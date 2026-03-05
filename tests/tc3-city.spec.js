// @ts-check
import { test, expect } from '@playwright/test';
import { randomOptionsAddress, selectOptionsAddress } from '../resources/function.js';
import { gotoWebsite } from '../resources/function.js';
import state from '../resources/dataset/state.json' assert { type: 'json' };

const stateCity = randomOptionsAddress();

test.describe('TC3: City field validation', () => {
    test('TC3.1: city dropdown disabled until state selected', async ({ page }) => {
        await gotoWebsite(page);
        await expect(await page.locator('#city > .css-16xfy0z-control').getAttribute('aria-disabled')).toEqual("true");

    });

    test('TC3.2: city dropdown enabled after state selected', async ({ page }) => {
        await gotoWebsite(page);
        
        await selectOptionsAddress(page, {states: 'Haryana', city: null});
        
        await page.locator('#city > .css-13cymwt-control').click();
        await expect(await page.locator('#city > .css-t3ipsp-control')).toBeVisible();

    });

    test('TC3.3: city options filter by selected state', async ({ page }) => {
        await gotoWebsite(page);

        await page.locator('#state > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
        await page.getByRole('option', { name: stateCity.states }).click();
        await page.locator('#city > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();

        const stateEntry = Object.values(state.state).find(s => s.name === stateCity.states);
        const expectedCities = stateEntry?.city ?? [];

        const cityOptions = await page.getByRole('option').allTextContents();
        for (const city of expectedCities) {
            expect(cityOptions).toContain(city);
        }
    });
});