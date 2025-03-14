import {expect, Page} from '@playwright/test';
import {test} from './setup';
import openEOFedResponse from './fixture/responses/openeofed.json';
import vitoResponse from './fixture/responses/vito.json';
import openEOJobs from './fixture/responses/jobs.json';
import openEOJob from './fixture/responses/jobinfo.json';
import openEOJobResults from './fixture/responses/jobresults.json';

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