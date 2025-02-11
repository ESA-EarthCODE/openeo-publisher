import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


import { authConfig } from './auth.config';
import NextAuth from "next-auth";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};