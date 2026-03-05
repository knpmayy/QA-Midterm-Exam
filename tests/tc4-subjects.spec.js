// @ts-check
import { test, expect } from '@playwright/test';
import { randomSubjects } from '../resources/function.js';
import { gotoWebsite, inputSubject, removeSubject, getSubjectSelected } from '../resources/function.js';

const subjectList = [...new Set(randomSubjects(5))];

test.describe('TC4: Subjects field validation', () => {
    test('TC4.1: can add one subject', async ({ page }) => {
        await gotoWebsite(page);
        await inputSubject(page, subjectList[0]);
        const selected = await getSubjectSelected(page);
        expect(selected).toContain(subjectList[0]);
    });

    test('TC4.2: can add multiple subjects', async ({ page }) => {
        await gotoWebsite(page);
        await inputSubject(page, subjectList);
        const selected = await getSubjectSelected(page);
        expect(selected).toEqual([...subjectList].sort());
    });

    test('TC4.3: can remove added subject', async ({ page }) => {
        await gotoWebsite(page);
        await inputSubject(page, subjectList);
        await removeSubject(page, subjectList[0]);
        const selected = await getSubjectSelected(page);
        expect(selected).not.toContain(subjectList[0]);
    });

    test('TC4.4: cannot add non-existing subject', async ({ page }) => {
        await gotoWebsite(page);
        await page.locator('.subjects-auto-complete__input-container').click();
        await page.locator('#subjectsInput').fill('zzz_notasubject_xyz');
        await page.locator('#subjectsInput').press('Enter');
        await page.locator('body').click();
        const selected = await getSubjectSelected(page);
        expect(selected).toHaveLength(0);
    });
});