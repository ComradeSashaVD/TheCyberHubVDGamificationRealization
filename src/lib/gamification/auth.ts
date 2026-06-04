import { NextRequest } from 'next/server';

export interface RequestUser {
    id: string;
    username: string;
    role: string;
}

const parseBearerPayload = (token: string): RequestUser | null => {
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;
        const json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
        const id = String(json.sub ?? json.id ?? '');
        const username = String(json.username ?? json.name ?? id);
        const role = String(json.role ?? 'user');
        if (!id) return null;
        return { id, username, role };
    } catch {
        return null;
    }
};

export const getRequestUser = (request: NextRequest): RequestUser | null => {
    const explicitId = request.headers.get('x-user-id');
    if (explicitId) {
        return {
            id: explicitId,
            username: request.headers.get('x-username') ?? explicitId,
            role: request.headers.get('x-role') ?? 'user',
        };
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.toLowerCase().startsWith('bearer ')) return null;
    const token = authHeader.slice(7);
    return parseBearerPayload(token);
};
