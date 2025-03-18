import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Define only the public paths that don't require authentication
const publicPaths = ['/auth/signin', '/api/auth'];

// Default page to redirect to after successful login
const DEFAULT_LOGIN_REDIRECT = '/';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if the user is authenticated
    const session = await auth();
    const isAuthenticated = !!session?.user;

    const isPublicPath = publicPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    );

    const isApiRoute = pathname.startsWith('/api/');

    const isSignInPage = pathname === '/auth/signin';

    if (isAuthenticated && isSignInPage) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
    }

    // If it's a non-public API and user is not authenticated
    if (isApiRoute && !isPublicPath && !isAuthenticated) {
        return NextResponse.json(
            { success: false, message: 'Access Denied' },
            { status: 401 }
        );
    }

    // If it's a non-public route and user is not authenticated
    if (!isPublicPath && !isAuthenticated) {
        const redirectUrl = new URL('/auth/signin', request.url);
        redirectUrl.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    runtime: 'nodejs',
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};