import {expect, Page} from '@playwright/test';
import openEOFedResponse from '../fixture/responses/openeofed.json';
import vitoResponse from '../fixture/responses/vito.json';
import openEOJobs from '../fixture/responses/jobs.json';
import openEOJob from '../fixture/responses/jobinfo.json';
import openEOJobResults from '../fixture/responses/jobresults.json';
import earthCODEProductCatalog from '../fixture/earthcode/products/catalog.json';

export const setupRoutes = async (
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
                } else if (route.request().url().includes('workflows%2Fcatalog.json')) {
                    await route.fulfill({
                        json: {
                            sha: '123',
                            content: Buffer.from(JSON.stringify({
                                links: [
                                    {
                                        "rel": "item",
                                        "href": "./test-workflow-1/record.json",
                                        "type": "application/json",
                                        "title": "test-workflow-1"
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
                } else if (route.request().url().includes('collection.json') || route.request().url().includes('catalog.json') ||  route.request().url().includes('record.json')) {
                    await route.fulfill({
                        json: {
                            sha: '123',
                            content: Buffer.from(JSON.stringify({id: 'test-id', properties: { title: 'test-title' } , links: []})).toString('base64')
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

export const selectJobs = async (page: Page, backend: string, jobs: number[]) => {

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