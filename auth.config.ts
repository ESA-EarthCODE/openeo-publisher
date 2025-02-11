import NextAuth, {NextAuthConfig} from "next-auth";
import GitHub from "next-auth/providers/github";

export const authConfig = {
    pages: {
        signIn: '/signin'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            return !!auth?.user;
        },
    },
    providers: [GitHub],
} satisfies NextAuthConfig;
