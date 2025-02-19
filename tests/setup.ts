import { test as base } from "@playwright/test";

export const test = base.extend({
    page: async ({ page, context }, use) => {
        await context.addCookies([
            {
                name: "authjs.session-token",
                value: "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiVGFjRHBtXy1JREl0c09XdkE2djRiRnB2VkNxdVBaWnZxenRyX3dlX3lXR3N6WWFBZEwwRE9qdkF0X1UwMzliVFBYd3laR0xDbV90bHVtWXFNam1icncifQ..hTSmCYPPm1K9iPNfYARkQw.orR7zipgwewTh7tS_GwalHF2P1CDydj4gSIQGpo08teKbp8nhlb6KSw3lOkVoSFWfiiYVvhVYeOsGzjGrxnWj17oPovRYwIhjaufunUypqsDQa2ydPR-XovqhiJVxZn17FU_MMdT9mFInNJ0UJYJ3i8cgbL9NRA6EpC4qsomDise-kQSfGCYp1zbcZP-RKRSNdz53UIwPjEmmTHe0bOpI44WUZf44fSKnSSqO47HPM2SccYc41yCawZ0rmYFwZl2_L0kzTqbcM583zvX4On_5GdxRmrOCMnpbC28AWKUHBw5NgZX9E4sMJAvy7pAXsypfhZK1KZFBJEHOXAng9-ifxeoNNgtqS_i166OiEURfi8.SUzrzjR_B6fCPSnolQ88K5SCxUk3oJ4SGe3PrIVXsVk", // Replace with real token
                domain: "localhost",
                path: "/",
                httpOnly: true,
                secure: false, // Set to `true` if using HTTPS
            },
        ]);

        await page.route("/api/auth/session", async (route) => {
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    user: {
                        name: "Test User",
                        email: "test@example.com",
                    },
                    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
                    accessToken: 'foobar'
                }),
            });
        });

        await page.goto('/');
        await use(page);
    },
});