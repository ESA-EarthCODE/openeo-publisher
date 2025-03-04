import {expect, Page} from '@playwright/test';
import {test} from './setup';
import openEOFedResponse from './fixture/responses/openeofed.json';
import vitoResponse from './fixture/responses/vito.json';
import openEOJobs from './fixture/responses/jobs.json';
import openEOJob from './fixture/responses/jobinfo.json';
import openEOJobResults from './fixture/responses/jobresults.json';
import earthCODEProductCatalog from './fixture/earthcode/products/catalog.json';

test.describe('Publishing Wizard Tests', () => {

    const setupRoutes = async (
        page: Page,
        callBackCreateFile: () => void,
        callbackCreatePR: () => void) => {

            await page.route('https://openeofed.dataspace.copernicus.eu/openeo', async route => {
                await route.fulfill({json: openEOFedResponse});
            });

            await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs', async route => {
                await route.fulfill({json: openEOJobs});
            });

            await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs/**', async route => {
                await route.fulfill({json: openEOJob});
            });

            await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs/**/results', async route => {
                await route.fulfill({json: openEOJobResults});
            });

            await page.route('https://openeo.vito.be/openeo', async route => {
                await route.fulfill({json: vitoResponse});
            });


            await page.route('https://api.github.com/**/git/ref/**', async route => {
                await route.fulfill({
                    json: {
                        object: {
                            sha: '1234567890'
                        }
                    }
                });
            });

            await page.route('https://api.github.com/**/git/refs', async route => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({
                        json: {
                            object: {
                                sha: '1234567890'
                            }
                        }
                    });
                } else {
                    await route.continue();
                }
            });

            await page.route('https://api.github.com/**/git/refs/**', async route => {
                if (route.request().method() === 'DELETE') {
                    await route.fulfill();
                } else {
                    await route.continue();
                }
            });

            await page.route('https://api.github.com/**/contents/*', async route => {
                    if (route.request().method() === 'PUT') {
                        callBackCreateFile();
                        await route.fulfill({
                            json: {}
                        });
                    } else if (route.request().method() === 'GET') {
                        if (route.request().url().includes('projects%2Fcatalog.json')) {
                            await route.fulfill({
                                json: {
                                    sha: '123',
                                    content: Buffer.from(JSON.stringify({
                                        links: [
                                            {
                                                "rel": "child",
                                                "href": "./test-project-1/collection.json",
                                                "type": "application/json",
                                                "title": "test-project-1"
                                            }
                                        ]
                                    })).toString('base64')
                                }
                            });
                        } else if (route.request().url().includes('themes%2Fcatalog.json')) {
                            await route.fulfill({
                                json: {
                                    sha: '123',
                                    content: Buffer.from(JSON.stringify({
                                        links: [
                                            {
                                                "rel": "child",
                                                "href": "./test-theme-1/collection.json",
                                                "type": "application/json",
                                                "title": "test-theme-1"
                                            }
                                        ]
                                    })).toString('base64')
                                }
                            });
                        } else if (route.request().url().includes('products%2Fcatalog.json')) {
                            await route.fulfill({
                                json: {
                                    sha: '123',
                                    content: Buffer.from(JSON.stringify(earthCODEProductCatalog)).toString('base64')
                                }
                            });
                        } else if (route.request().url().includes('collection.json') || route.request().url().includes('catalog.json')) {
                            await route.fulfill({
                                json: {
                                    sha: '123',
                                    content: Buffer.from(JSON.stringify({links: []})).toString('base64')
                                }
                            });
                        } else {
                            route.continue();
                        }

                    } else {
                        await route.continue();
                    }
                }
            )


            await page.route('https://api.github.com/**/pulls', async route => {
                if (route.request().method() === 'POST') {
                    callbackCreatePR();
                    await route.fulfill({
                        json: {}
                    });
                } else {
                    await route.continue();
                }
            });
        }

        const selectJobs = async (page: Page, backend: string, jobs: number[]) => {

            // STEP 1. Select backend
            await expect(page.getByTestId('backend-selector')).toBeVisible();
            await expect(page.getByTestId('stepper-step').nth(0)).toHaveAttribute('aria-current', 'step');

            await page.getByTestId('backend-selector').click();
            await page.getByTestId('backend-selector-item').getByText(backend).click();

            await page.getByTestId('next-button').click();

            // STEP 2. Select jobs
            await expect(page.getByTestId('job-table')).toBeVisible();
            await expect(page.getByTestId('stepper-step').nth(2)).toHaveAttribute('aria-current', 'step');
            await expect(page.getByTestId('next-button')).toBeDisabled();

            await expect(page.getByTestId('job-table').getByRole('rowgroup').getByRole('row')).toHaveCount(13);
            for (const index of jobs) {
                await page.getByTestId('job-table').getByRole('rowgroup').getByRole('checkbox').nth(index).check();
            }

            await page.getByTestId('next-button').click();

            // STEP 3. Publish
            await expect(page.getByTestId('publish-button')).toBeVisible();
            await expect(page.getByTestId('stepper-step').nth(3)).toHaveAttribute('aria-current', 'step');
            await expect(page.getByTestId('next-button')).not.toBeVisible();

            await expect(page.getByTestId('job-summary')).toHaveCount(jobs.length);

            await expect(page.getByTestId('publish-button')).toBeDisabled();


        }

        test('Should publish openEO jobs as an EarthCODE product', async ({page}) => {

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


            await page.getByTestId('job-summary').nth(1).getByTestId('jobschema-selector').click();
            await page.getByTestId('jobschema-selector-item').getByText('Product').click();
            await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-id').locator('input').fill("test-product-id-2");
            await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-project').click();
            await page.getByText('test-project-1').click();
            await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-theme').locator('input').fill("test-theme-1");
            await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-theme').click();
            await page.getByText('test-theme-1').nth(1).click();

            await page.getByTestId('publish-button').click();

            await page.waitForResponse(resp => resp.url().includes('/pulls'));

            expect(createCount).toBe(5); // 2 product + 1 parent catalogue + 1 theme + 1 project
            expect(prCount).toBe(1);
        });

        test('Should publish openEO jobs as an EarthCODE workflow', async ({page}) => {

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

        test('Should publish openEO jobs as an EarthCODE experiment', async ({page}) => {

            let createCount = 0;
            let prCount = 0;

            await setupRoutes(page, () => createCount++, () => prCount++);
            await selectJobs(page, 'Copernicus Data Space Ecosystem openEO Aggregator', [0, 5])


            // STEP 3. Publish workflows
            await page.getByTestId('job-summary').nth(0).getByTestId('jobschema-selector').click();
            await page.getByTestId('jobschema-selector-item').getByText('Experiment').click();
            await page.getByTestId('job-summary').nth(0).getByTestId('experiment-schema-id').locator('input').fill("test-experiment-id-1");
            await page.getByTestId('job-summary').nth(0).getByTestId('experiment-schema-project').click();
            await page.getByText('test-project-1').click();
            await page.getByTestId('job-summary').nth(0).getByTestId('experiment-schema-theme').click();
            await page.getByText('test-theme-1').click();
            await page.getByTestId('job-summary').nth(0).getByTestId('product-schema-id').locator('input').fill("test-product-id-1");
            await page.getByTestId('job-summary').nth(0).getByTestId('workflow-schema-id').locator('input').fill("test-workflow-id-1");
            await page.getByTestId('job-summary').nth(0).getByTestId('workflow-schema-url').locator('input').fill("https://workflow-url-1.test");


            await page.getByTestId('job-summary').nth(1).getByTestId('jobschema-selector').click();
            await page.getByTestId('jobschema-selector-item').getByText('Experiment').click();
            await page.getByTestId('job-summary').nth(1).getByTestId('experiment-schema-id').locator('input').fill("test-experiment-id-2");
            await page.getByTestId('job-summary').nth(1).getByTestId('experiment-schema-project').click();
            await page.getByText('test-project-1').click();
            await page.getByTestId('job-summary').nth(1).getByTestId('experiment-schema-theme').click();
            await page.getByText('test-theme-1').nth(1).click();
            await page.getByTestId('job-summary').nth(1).getByTestId('product-schema-id').locator('input').fill("test-product-id-2");
            await page.getByTestId('job-summary').nth(1).getByTestId('workflow-schema-id').locator('input').fill("test-workflow-id-2");
            await page.getByTestId('job-summary').nth(1).getByTestId('workflow-schema-url').locator('input').fill("https://workflow-url-2.test");

            await page.getByTestId('publish-button').click();

            await page.waitForResponse(resp => resp.url().includes('/pulls'));

            expect(createCount).toBe(15); // 2 * 5 (product, workflow experiment, environment.yaml, input.yaml) + 3 parents + 1 project + 1 theme
            expect(prCount).toBe(1);
        });
    }
)


test.describe('Wizard Navigation Tests', () => {

    const setupRoutes = async (
        page: Page
    ) => {

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo', async route => {
            await route.fulfill({json: openEOFedResponse});
        });

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs', async route => {
            await route.fulfill({json: openEOJobs});
        });

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs/**', async route => {
            await route.fulfill({json: openEOJob});
        });

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs/**/results', async route => {
            await route.fulfill({json: openEOJobResults});
        });

        await page.route('https://openeo.vito.be/openeo', async route => {
            await route.fulfill({json: vitoResponse});
        });
    }


    test('Should return to the first step whenever the user did not select a backend', async ({page}) => {

        await setupRoutes(page);

        await page.evaluate(() => {
            window.localStorage.removeItem('openeo_backend');
        });

        await page.goto('?step=2');
        await page.waitForTimeout(1000);

        expect(page.url()).toContain('?step=0');
        await expect(page.getByTestId('backend-selector')).toBeVisible();
        await expect(page.getByTestId('stepper-step').nth(0)).toHaveAttribute('aria-current', 'step');
    });

    test('Should return to the first step whenever the user is not logged in anymore', async ({page}) => {


        await setupRoutes(page);
        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs', async route => {
            await route.fulfill({
                status: 401
            });
        });


        await page.evaluate(() => {
            window.localStorage.setItem('openeo_backend', JSON.stringify({
                id: 'openeofed',
                title: 'Copernicus Data Space Ecosystem openEO Aggregator',
                url: 'https://openeofed.dataspace.copernicus.eu/openeo'
            }));
        });


        await page.goto('?step=2');
        await page.waitForTimeout(1000);

        await expect(page.getByTestId('toast')).toContainText('You are not authenticated with');

        expect(page.url()).toContain('?step=0');
        await expect(page.getByTestId('backend-selector')).toBeVisible();
        await expect(page.getByTestId('stepper-step').nth(0)).toHaveAttribute('aria-current', 'step');
    });
})