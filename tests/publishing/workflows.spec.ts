import {test} from "../setup";
import {expect} from "@playwright/test";
import {selectJobs, setupRoutes} from "./utils";


test.describe('Test Workflow Publishing', () => {
    test('Should publish openEO jobs as a new EarthCODE workflow', async ({page}) => {

        let createCount = 0;
        let prCount = 0;

        await setupRoutes(page, () => createCount++, () => prCount++);
        await selectJobs(page, 'Copernicus Data Space Ecosystem openEO Aggregator', [0, 5])


        // STEP 3. Publish workflows
        await page.getByTestId('job-summary').nth(0).getByTestId('jobschema-selector').click();
        await page.getByTestId('jobschema-selector-item').getByText('Workflow').click();
        await page.getByTestId('job-summary').nth(0).getByTestId('workflow-schema-project').click();
        await page.getByText('test-project-1').click();
        await page.getByTestId('job-summary').nth(0).getByTestId('workflow-schema-theme').click();
        await page.getByText('test-theme-1').click();
        await page.getByTestId('job-summary').nth(0).getByTestId('workflow-schema-id').locator('input').fill("test-workflow-id-1");
        await page.getByTestId('job-summary').nth(0).getByTestId('workflow-schema-url').locator('input').fill("https://workflow-url-1.test");


        await page.getByTestId('job-summary').nth(1).getByTestId('jobschema-selector').click();
        await page.getByTestId('jobschema-selector-item').getByText('Workflow').click();
        await page.getByTestId('job-summary').nth(1).getByTestId('workflow-schema-project').click();
        await page.getByText('test-project-1').click();
        await page.getByTestId('job-summary').nth(1).getByTestId('workflow-schema-theme').click();
        await page.getByText('test-theme-1').nth(1).click();
        await page.getByTestId('job-summary').nth(1).getByTestId('workflow-schema-id').locator('input').fill("test-workflow-id-2");
        await page.getByTestId('job-summary').nth(1).getByTestId('workflow-schema-url').locator('input').fill("https://workflow-url-2.test");

        await page.getByTestId('publish-button').click();

        await page.waitForResponse(resp => resp.url().includes('/pulls'));

        expect(createCount).toBe(5); // 2 workflows + 1 parent + 1 project + 1 theme
        expect(prCount).toBe(1);
    });
});
