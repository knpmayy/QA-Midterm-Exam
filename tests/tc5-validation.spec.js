// @ts-check
import { test, expect } from '@playwright/test';
import { randomPerson } from '../resources/function.js';
import { gotoWebsite, inputFullProfile, manualClickInputBirthdate } from '../resources/function.js';
import dayjs from 'dayjs';

const instance = randomPerson();

test.describe('TC5: Fields validation', () => {
    test.describe('Mobile number field validation', () => {
        test('TC5.1: can submit form if mobile number is exactly 10 digits', async ({ page }) => {
            instance.mobile_no = '0812345678';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
        });

        test('TC5.2: cannot submit form if mobile number is less than 10 digits', async ({ page }) => {
            instance.mobile_no = '081234567';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Mobile Number' })).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });

        test('TC5.3: can submit form if mobile number is more than 10 digits but it will be truncated to 10 digits', async ({ page }) => {
            const Tel = instance.mobile_no;
            instance.mobile_no = instance.mobile_no + '5';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
            await expect(await page.getByRole('textbox', { name: 'Mobile Number' }).inputValue()).toEqual(Tel);
            instance.mobile_no = Tel;

        });

        test('TC5.4: cannot submit form if mobile number contains alphabetic characters', async ({ page }) => {
            instance.mobile_no = '081234567a';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Mobile Number' })).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });

        test('TC5.5: cannot submit form if mobile number contains special characters', async ({ page }) => {
            instance.mobile_no = '081234567!';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Mobile Number' })).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        });
    });

    test.describe('Email field validation', () => {
        test('TC5.8: can submit form if email is in valid format', async ({ page }) => {
            instance.email = 'valid@example.com';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
        });

        test('TC5.9: cannot submit form if email is missing "@" symbol', async ({ page }) => {
            instance.email = 'invalidemail.com';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.10: cannot submit form if email contains only "@" symbol', async ({ page }) => {
            instance.email = '@';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.11: cannot submit form if email has no dot after "@" symbol', async ({ page }) => {
            instance.email = 'user@examplecom';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.12: cannot submit form if email has nothing before "@" symbol', async ({ page }) => {
            instance.email = '@example.com';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.13: cannot submit form if email has no domain after "@" symbol', async ({ page }) => {
            instance.email = 'user@';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.14: cannot submit form if email has nothing between "@" and "."', async ({ page }) => {
            instance.email = 'user@.com';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.15: cannot submit form if email has nothing after "." symbol', async ({ page }) => {
            instance.email = 'user@example.';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.16: cannot submit form if email has only 1 letter after "."', async ({ page }) => {
            instance.email = 'user@example.c';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.17: cannot submit form if email has 6 letters after "."', async ({ page }) => {
            instance.email = 'user@example.toolong';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });

        test('TC5.18: cannot submit form if email contains spaces', async ({ page }) => {
            instance.email = 'user @example.com';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        });
    });

    test.describe('Date of Birth field validation', () => {
        test('TC5.19: if do not change date of birth it must be current date', async ({ page }) => {
            await gotoWebsite(page);
            const currentDate = dayjs().format('DD MMM YYYY');
            const inputValue = await page.locator('#dateOfBirthInput').inputValue();
            expect(inputValue).toBe(currentDate);
        });

        test('TC5.20: can select date of birth using date picker', async ({ page }) => {
            await gotoWebsite(page);
            await manualClickInputBirthdate(page, instance.birthdate);
            const expected = dayjs(instance.birthdate).format('DD MMM YYYY');
            const inputValue = await page.locator('#dateOfBirthInput').inputValue();
            expect(inputValue).toBe(expected);
        });
    });
});