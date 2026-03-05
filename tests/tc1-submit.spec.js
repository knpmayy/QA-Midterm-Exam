// @ts-check
import { test, expect } from '@playwright/test';
import { randomPerson, randomOptionsAddress, randomHobbies, randomSubjects, randomImage } from '../resources/function.js';
import { gotoWebsite, inputFullProfile, checkHobbies, inputSubject, selectOptionsAddress, attachPhotos, readSubmitDetails } from '../resources/function.js';

const instance = randomPerson();
const stateCity = randomOptionsAddress();
const hobbiesList = randomHobbies();
const subjectList = randomSubjects(2);
const imageName = randomImage();

test.describe('TC1: Submit form with valid data', () => {
    test('TC1.1: successfully submit form with all valid data in all fields', async ({ page }) => {
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await checkHobbies(page, hobbiesList);
        await inputSubject(page, subjectList);
        await selectOptionsAddress(page, stateCity);
        await attachPhotos(page, imageName);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
        await readSubmitDetails(page, expect, instance, stateCity, hobbiesList, subjectList, imageName);
    });

    test('TC1.2: successfully submit form with all valid data only in required fields', async ({ page }) => {
        instance.address = '';
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
        await readSubmitDetails(page, expect, instance);
    });

    test('TC1.3: modal correctly displays when submitted with valid data', async ({ page }) => {
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible();
        await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
    });
});