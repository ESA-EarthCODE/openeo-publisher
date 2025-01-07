import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const headers = new Headers(request.headers)
    headers.set("x-pathname",request.nextUrl.href.split('?')[0])

    return NextResponse.next({
        request: {
          headers,
        },
    });
}

export const config = {
    matcher: '/callback/:path*',
}