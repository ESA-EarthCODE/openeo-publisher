import {NextAuthConfig} from "next-auth";
import GitHub from "next-auth/providers/github";
import moment from "moment";

export const authConfig = {
    pages: {
        signIn: '/signin'
    },
    callbacks: {
        authorized({ auth }) {
            if (process.env.NODE_ENV === "test") {
                return true;
            } else {
                return !!auth?.user;
            }
        },
        async session({session, token}) {
            session.accessToken = token.accessToken as string;
            session.tokenExpired = token.exp ? moment().isSameOrAfter(moment(token.exp * 1000)) : false
            return session;
        },
        async jwt({token, account}) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        }
    },
    providers: [GitHub({
        authorization: {
            params: {
                scope: "public_repo",
            },
        }
    })],
} satisfies NextAuthConfig;
