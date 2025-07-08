import { test } from "../setup";
import { expect } from "@playwright/test";
import { selectJobs, setupRoutes } from "./utils";

test.describe('Test Product Publishing', () => {

    test('Should publish openEO jobs as an EarthCODE product', async ({ page }) => {

        let createCount = 0;
        let prCount = 0;

        await setupRoutes(page, () => createCount++, () => prCount++);
        await selectJobs(page, 'Copernicus Data Space Ecosystem openEO Aggregator', [0, 5])


        await page.getByTestId('job-summary').nth(0).getByTestId('jobschema-selector').click();
        await page.getByTestId('jobschema-selector-item').getByText('Product').click();
        await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-id').locator('input').fill("test-product-id-1");
        await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-project').click();
        await page.getByText('test-project-1').click();
        await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-theme').click();
        await page.getByText('test-theme-1').click();
        expect(await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-asset').count()).toBe(3);

        // Add an asset
        await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-add-asset-name').locator('input').fill('test-asset-1');
        await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-add-asset-url').locator('input').fill('https://test-asset-1.test');
        await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-add-asset-button').click();
        expect(await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-asset').count()).toBe(4);


        await page.getByTestId('job-summary').nth(1).getByTestId('jobschema-selector').click();
        await page.getByTestId('jobschema-selector-item').getByText('Product').click();
        await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-id').locator('input').fill("test-product-id-2");
        await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-project').click();
        await page.getByText('test-project-1').click();
        await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-theme').locator('input').fill("test-theme-1");
        await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-theme').click();
        await page.getByText('test-theme-1').nth(1).click();
        expect(await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-asset').count()).toBe(3);

        // Delete an asset
        await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-asset-delete').nth(1).click();
        expect(await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-asset').count()).toBe(2);

        await page.getByTestId('publish-button').click();

        await page.waitForResponse(resp => resp.url().includes('/pulls'));

        expect(createCount).toBe(5); // 2 product + 1 parent catalogue + 1 theme + 1 project
        expect(prCount).toBe(1);
    });
});