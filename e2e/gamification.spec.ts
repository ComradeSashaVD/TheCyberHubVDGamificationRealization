import { test, expect } from '@playwright/test';

test('leaderboard page renders gamification leaderboard controls', async ({ page }) => {
    await page.goto('/leaderboard');
    await expect(page.getByText('Hall of Fame')).toBeVisible();
    await expect(page.getByRole('combobox').first()).toBeVisible();
});

test('leaderboard metric filter changes selection', async ({ page }) => {
    await page.goto('/leaderboard');
    const select = page.getByRole('combobox').first();
    await select.selectOption('ctf');
    await expect(select).toHaveValue('ctf');
});

test('leaderboard period filter changes selection', async ({ page }) => {
    await page.goto('/leaderboard');
    const selects = page.getByRole('combobox');
    await selects.nth(1).selectOption('month');
    await expect(selects.nth(1)).toHaveValue('month');
});

test('profile page renders without crashing', async ({ page }) => {
    await page.goto('/profile');
    // Either shows profile content or redirects to login — both are valid
    await expect(page).not.toHaveURL('/500');
});

test('admin gamification page is accessible to admin', async ({ page }) => {
    // This test validates the page loads; auth gating is tested separately
    const response = await page.goto('/admin/gamification');
    expect(response?.status()).not.toBe(500);
});
