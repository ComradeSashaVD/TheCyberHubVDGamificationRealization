import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM_API = (process.env.NEXT_PUBLIC_API_URL || 'https://dev-api.thecyberhub.org').replace(/\/+$/, '');

async function proxy(request: NextRequest, method: string, path: string[]) {
    // Keep local gamification route handlers handled by their own files.
    if (path[0] === 'gamification') {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const query = request.nextUrl.searchParams.toString();
    const url = `${UPSTREAM_API}/api/${path.join('/')}${query ? `?${query}` : ''}`;

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('content-length');
    headers.delete('expect');

    const body = method === 'GET' || method === 'HEAD' ? undefined : await request.text();
    const upstream = await fetch(url, {
        method,
        headers,
        body,
        redirect: 'follow',
    });

    const outHeaders = new Headers(upstream.headers);
    outHeaders.delete('content-encoding');
    outHeaders.delete('content-length');
    outHeaders.delete('transfer-encoding');

    return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: outHeaders,
    });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: Ctx) {
    const { path } = await ctx.params;
    return proxy(request, 'GET', path);
}

export async function POST(request: NextRequest, ctx: Ctx) {
    const { path } = await ctx.params;
    return proxy(request, 'POST', path);
}

export async function PUT(request: NextRequest, ctx: Ctx) {
    const { path } = await ctx.params;
    return proxy(request, 'PUT', path);
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
    const { path } = await ctx.params;
    return proxy(request, 'PATCH', path);
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
    const { path } = await ctx.params;
    return proxy(request, 'DELETE', path);
}

export async function OPTIONS(request: NextRequest, ctx: Ctx) {
    const { path } = await ctx.params;
    return proxy(request, 'OPTIONS', path);
}
