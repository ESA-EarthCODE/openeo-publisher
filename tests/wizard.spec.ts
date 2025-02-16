import {expect, test} from '@playwright/test';
import openEOFedResponse from './fixture/responses/openeofed.json';
import vitoResponse from './fixture/responses/vito.json';
import openEOJobs from './fixture/responses/jobs.json';
import openEOJob from './fixture/responses/jobinfo.json';

test.describe('Publishing Wizard Tests', () => {

    test('Should publish openEO jobs', async ({page}) => {


        let createCount = 0;
        let prCount = 0;

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/', async route => {
            await route.fulfill({json: openEOFedResponse});
        });

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs', async route => {
            await route.fulfill({json: openEOJobs});
        });

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs/**', async route => {
            await route.fulfill({json: openEOJob});
        });

        await page.route('https://openeo.vito.be/openeo', async route => {
            await route.fulfill({json: vitoResponse});
        });

        await page.route('https://api.github.com/**/git/ref/heads%2Fmain', async route => {
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

        await page.route('https://api.github.com/**/contents/*', async route => {
            if (route.request().method() === 'PUT') {
                createCount++;
                await route.fulfill({
                    json: {}
                });
            } else {
                await route.continue();
            }
        });

        await page.route('https://api.github.com/**/pulls', async route => {
            if (route.request().method() === 'POST') {
                prCount++;
                await route.fulfill({
                    json: {}
                });
            } else {
                await route.continue();
            }
        });

        await page.goto('/');

        // STEP 1. Select backend
        await expect(page.getByTestId('backend-selector')).toBeVisible();
        await expect(page.getByTestId('stepper-step').nth(0)).toHaveAttribute('aria-current', 'step');

        await page.getByTestId('backend-selector').click();
        await page.getByTestId('backend-selector-item').getByText('Copernicus Data Space Ecosystem openEO Aggregator').click();

        await page.getByTestId('next-button').click();

        // STEP 2. Select jobs
        await expect(page.getByTestId('job-table')).toBeVisible();
        await expect(page.getByTestId('stepper-step').nth(2)).toHaveAttribute('aria-current', 'step');
        await expect(page.getByTestId('next-button')).toBeDisabled();

        await expect(page.getByTestId('job-table').getByRole('rowgroup').getByRole('row')).toHaveCount(17);
        await page.getByTestId('job-table').getByRole('rowgroup').getByRole('checkbox').nth(0).check();
        await page.getByTestId('job-table').getByRole('rowgroup').getByRole('checkbox').nth(5).check();

        await page.getByTestId('next-button').click();

        // STEP 3. Publish jobs
        await expect(page.getByTestId('publish-button')).toBeVisible();
        await expect(page.getByTestId('stepper-step').nth(3)).toHaveAttribute('aria-current', 'step');
        await expect(page.getByTestId('next-button')).not.toBeVisible();

        await expect(page.getByTestId('job-summary')).toHaveCount(2);

        await page.getByTestId('publish-button').click();

        await page.waitForResponse(resp => resp.url().includes('/pulls'));

        expect(createCount).toBe(2);
        expect(prCount).toBe(1);
    });


});

test.describe('Wizard Navigation Tests', () => {

    test('Should return to the first step whenever the user did not select a backend', async ({page}) => {

        await page.addInitScript(params => {
            window.localStorage.removeItem('openeo_backend');
        });

        await page.goto('?step=2');

        expect(page.url()).toContain('?step=0');
        await expect(page.getByTestId('backend-selector')).toBeVisible();
        await expect(page.getByTestId('stepper-step').nth(0)).toHaveAttribute('aria-current', 'step');
    });

    test('Should return to the first step whenever the user is not logged in anymore', async ({page}) => {

        await page.addInitScript(params => {
            window.localStorage.setItem('openeo_backend', JSON.stringify({
                id: 'openeofed',
                title: 'Copernicus Data Space Ecosystem openEO Aggregator',
                url: 'https://openeofed.dataspace.copernicus.eu/openeo/'
            }));
        });

        await page.route('https://openeofed.dataspace.copernicus.eu/openeo/jobs', async route => {
            await route.fulfill({
                status: 401
            });
        });


        await page.goto('?step=2');
        await expect(page.getByTestId('toast')).toContainText('You are not authenticated with');

        expect(page.url()).toContain('?step=0');
        await expect(page.getByTestId('backend-selector')).toBeVisible();
        await expect(page.getByTestId('stepper-step').nth(0)).toHaveAttribute('aria-current', 'step');
    });
})