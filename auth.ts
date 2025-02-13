import { authConfig } from './auth.config';
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken: string;
        expires: string;
        user: {
            address: string
        } & DefaultSession["user"];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
});