import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page, context }: any, use: any) => {
    const { encode } = await import("next-auth/jwt");
    const token = await encode({
      token: {
        name: "FooBar",
        sub: "dummy-sub",
        accessToken: "dummy-token",
        iat: Date.now(),
        exp: Date.now() + 3 * 1000 * 60 * 60,
        jti: "dummy-jti",
      },
      secret: process.env.AUTH_SECRET || "",
      salt: "authjs.session-token",
    });

    console.log(token);
    await context.addCookies([
      {
        name: "authjs.session-token",
        value: token,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false, // Set to `true` if using HTTPS
      },
    ]);

    await page.route("/api/auth/session", async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            name: "Test User",
            email: "test@example.com",
          },
          expires: new Date(Date.now() + 3 * 1000 * 60 * 60).toISOString(),
          accessToken: "foobar",
        }),
      });
    });

    await page.route("https://api.github.com/user", async (route: any) => {
      await route.fulfill({
        status: 200,
      });
    });

    await page.goto("/");
    await use(page);
  },
});
