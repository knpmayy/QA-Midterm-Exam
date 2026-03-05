// @ts-check
import { test, expect } from '@playwright/test';

test.describe('TC5: Fields validation', () => {
    test.describe('Mobile number field validation', () => {
        test('TC5.1: can submit form if mobile number is exactly 10 digits', async ({ page }) => {

        });

        test('TC5.2: cannot submit form if mobile number is less than 10 digits', async ({ page }) => {
        });

        test('TC5.3: cannot submit form if mobile number is more than 10 digits', async ({ page }) => {
        });

        test('TC5.4: cannot submit form if mobile number contains alphabetic characters', async ({ page }) => {
        });

        test('TC5.5: cannot submit form if mobile number contains special characters', async ({ page }) => {
        });
    });

    test.describe('Email field validation', () => {
        test('TC5.8: can submit form if email is in valid format', async ({ page }) => {

        });

        test('TC5.9: cannot submit form if email is missing "@" symbol', async ({ page }) => {
        });

        test('TC5.10: cannot submit form if email is contain only "@" symbol', async ({ page }) => {
        });

        test('TC5.11: cannot submit form if email has no dot after "@" symbol', async ({ page }) => {
        });
        
        test('TC5.12: cannot submit form if email has blank characters before "@" symbol', async ({ page }) => {
        });

        test('TC5.13: cannot submit form if email has blank characters after "@" symbol', async ({ page }) => {
        });

        test('TC5.14: cannot submit form if email has blank characters between "@" and "."', async ({ page }) => {
        });

        test('TC5.15: cannot submit form if email has blank characters after "." symbol', async ({ page }) => {
        });

        test('TC5.16: cannot submit form if email has only 1 letter after "."', async ({ page }) => {
        });

        test('TC5.17: cannot submit form if email has 6 letters after "."', async ({ page }) => {
        });
    
    });

    test.describe('Date of Birth field validation', () => {
        test('TC5.18: if do not change date of birth it must be current date', async ({ page }) => {
        });

        test('TC5.16: can select date of birth using date picker', async ({ page }) => {
        });

    });

});