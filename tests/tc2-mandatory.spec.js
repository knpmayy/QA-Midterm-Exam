// @ts-check
import { test, expect } from '@playwright/test';
import { randomPerson } from '../resources/function.js';
import { gotoWebsite, inputFullProfile } from '../resources/function.js';

const instance = randomPerson();

test.describe('TC2: Mandatory fields validation', () => {
    test('TC2.1: cannot submit form if first name is empty', async ({ page }) => {
        instance.fname = '';
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    test('TC2.2: cannot submit form if last name is empty', async ({ page }) => {
        instance.lname = '';
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    test('TC2.3: cannot submit form if gender is empty', async ({ page }) => {
        instance.sex = '';
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
    });

    test('TC2.4: cannot submit form if mobile number is empty', async ({ page }) => {
        instance.mobile_no = '';
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Mobile Number' })).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });
});