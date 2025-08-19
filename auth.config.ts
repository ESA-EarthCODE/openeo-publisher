import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import moment from "moment";

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async authorized({ auth }) {
      if (process.env.SKIP_AUTH === "true") {
        return true;
      } else {
        return !!auth?.user;
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.tokenExpired = token.exp
        ? moment().isSameOrAfter(moment(token.exp * 1000))
        : false;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (token.accessToken && process.env.SKIP_AUTH !== "true") {
        try {
          const response = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          if (response.status === 401) {
            console.error("GitHub token is invalid or expired");
            return null;
          }
        } catch (error) {
          console.error("Error validating GitHub token:", error);
          return null;
        }
      }
      return token;
    },
  },
  providers: [
    GitHub({
      authorization: {
        params: {
          scope: "public_repo",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;
