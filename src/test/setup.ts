import '@testing-library/jest-dom/vitest'

class MemoryStorage implements Storage {
    private data = new Map<string, string>();
    get length() {
        return this.data.size;
    }
    clear(): void {
        this.data.clear();
    }
    getItem(key: string): string | null {
        return this.data.has(key) ? this.data.get(key)! : null;
    }
    key(index: number): string | null {
        return Array.from(this.data.keys())[index] ?? null;
    }
    removeItem(key: string): void {
        this.data.delete(key);
    }
    setItem(key: string, value: string): void {
        this.data.set(key, value);
    }
}

if (!globalThis.localStorage || typeof globalThis.localStorage.clear !== 'function') {
    Object.defineProperty(globalThis, 'localStorage', {
        value: new MemoryStorage(),
        configurable: true,
    });
}
