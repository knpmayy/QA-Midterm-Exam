import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import dayjs from "dayjs";
import Person from "/Person";
import state from "/dataset/state.json";
import subjects from "/dataset/subjectkey.json";

const rand = (max) => Math.floor(Math.random() * max);
const DATASET_PATH = "dataset";
const DEMOQA_URL = "https://demoqa.com/automation-practice-form/";

export function readCSV(fileName) {
    return parse(fs.readFileSync(path.join(DATASET_PATH, fileName)), {
        columns: true,
        skip_empty_lines: true
    });
}

export function randomPerson() {
    const data = readCSV("persondata.csv");
    const row = data[rand(data.length)];
    return new Person(row.fname, row.lname, row.email, row.sex, row.mobile_no, row.birthdate, row.address);
}

export function randomOptionsAddress() {
    const stateKeys = Object.keys(state.state);
    const stateIdx = rand(stateKeys.length);
    const stateData = state.state[stateIdx.toString()];
    return {
        states: stateData.name,
        city: stateData.city[rand(stateData.city.length)]
    };
}

export function randomHobbies() {
    return { sports: rand(2), reading: rand(2), music: rand(2) };
}

export function randomSubjects(amount) {
    const total = amount ?? rand(3);
    const result = Array.from({ length: total }, () => subjects[rand(subjects.length)]);
    return result.sort();
}

export function randomImage() {
    const dir = path.join(process.cwd(), DATASET_PATH);
    const images = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    return images[rand(images.length)];
}

export async function gotoWebsite(page) {
    await page.goto(DEMOQA_URL);
}

export async function inputFullProfile(page, p) {
    await page.getByRole("textbox", { name: "First Name" }).fill(p.fname);
    await page.getByRole("textbox", { name: "Last Name" }).fill(p.lname);
    await page.getByRole("textbox", { name: "name@example.com" }).fill(p.email);
    await changeSex(page, p.sex);
    await manualClickInputBirthdate(page, p.birthdate);
    await page.getByRole("textbox", { name: "Mobile Number" }).fill(p.mobile_no);
    await page.getByRole("textbox", { name: "Current Address" }).fill(p.address);
}

export async function inputProfileDetails(page, p) {
    await page.getByRole("textbox", { name: "First Name" }).fill(p.fname);
    await page.getByRole("textbox", { name: "Last Name" }).fill(p.lname);
    await page.getByRole("textbox", { name: "name@example.com" }).fill(p.email);
    await page.getByRole("textbox", { name: "Mobile Number" }).fill(p.mobile_no);
    const addressBox = page.getByRole("textbox", { name: "Current Address" });
    await addressBox.click();
    await addressBox.fill(p.address);
}

export async function changeSex(page, sex) {
    if (!sex) return;
    await page.getByRole("radio", { name: sex, exact: true }).check();
}

export async function checkHobbies(page, hobbies) {
    const options = ["Sports", "Reading", "Music"];
    for (const opt of options) {
        if (hobbies[opt.toLowerCase()])
            await page.getByRole("checkbox", { name: opt }).check();
    }
}

export async function selectOptionsAddress(page, data) {
    const dropdowns = [
        { id: "state", value: data.states },
        { id: "city",  value: data.city   }
    ];
    for (const { id, value } of dropdowns) {
        if (!value) continue;
        await page.locator(`#${id} > .css-13cymwt-control > .css-hlgwow > .css-19bb58m`).click();
        await page.getByRole("option", { name: value }).click();
    }
}

export async function manualKeyboardInputBirthdate(page, date) {
    await page.locator("#dateOfBirthInput").click();
    await page.locator("#dateOfBirthInput").fill(date);
}

export async function manualClickInputBirthdate(page, date) {
    if (!date) return;

    const d = dayjs(date);
    const day = d.date();
    const suffix = [11, 12, 13].includes(day) ? "th"
        : day % 10 === 1 ? "st"
        : day % 10 === 2 ? "nd"
        : day % 10 === 3 ? "rd"
        : "th";

    await page.locator("#dateOfBirthInput").click();
    await page.locator('xpath=//*[@id="dateOfBirth"]/div[2]/div[2]/div/div/div/div/div[1]/div/div[2]/select').selectOption(String(d.year()));
    await page.locator('xpath=/html/body/div/div/div/div/div[2]/div[1]/form/div[5]/div[2]/div[2]/div[2]/div/div/div/div/div[1]/div/div[1]/select').selectOption(String(d.month()));
    await page.getByRole("gridcell", { name: `Choose ${d.format("dddd")}, ${d.format("MMMM")} ${day}${suffix}` }).click();
}

async function typeSubject(page, name) {
    await page.locator(".subjects-auto-complete__input-container").click();
    await page.locator("#subjectsInput").fill(name);
    await page.locator("#subjectsInput").press("Enter");
}

export async function inputSubject(page, name) {
    const subjects = Array.isArray(name) ? name : [name];
    for (const s of subjects) await typeSubject(page, s);
}

export async function removeSubject(page, name) {
    const subjects = Array.isArray(name) ? name : [name];
    for (const s of subjects)
        await page.getByRole("button", { name: `Remove ${s}` }).click();
}

export async function getSubjectSelected(page) {
    const items = await page.locator(".subjects-auto-complete__multi-value.css-1p3m7a8-multiValue").all();
    const texts = await Promise.all(items.map(el => el.innerText()));
    return texts.sort();
}

export async function attachPhotos(page, filename) {
    await page.getByRole("button", { name: "Choose File" }).setInputFiles(
        path.join(__dirname, `/dataset/${filename}`)
    );
}

export async function readSubmitDetails(page, expect, instance, states, activity, subject, imageUpload) {
    const rows = await page.locator("xpath=/html/body/div[4]/div/div/div[2]/div/table/tbody//tr/td[2]").all();

    const checks = [
        `${instance.fname} ${instance.lname}`,
        instance.email,
        instance.sex,
        instance.mobile_no,
        dayjs(instance.birthdate).format("D MMMM,YYYY")
    ];
    for (const val of checks)
        await expect(page.getByRole("cell", { name: val })).toBeVisible();

    if (instance.address)
        await expect(page.getByRole("cell", { name: instance.address })).toBeVisible();

    if (subject) {
        const subjectWeb = String(await rows[5].innerText()).split(",").map(e => e.trim()).sort();
        await expect(subjectWeb).toEqual(subject.sort());
    }

    if (activity) {
        const hobbiesWeb = String(await rows[6].innerText()).split(",").map(e => e.trim()).sort().filter(Boolean);
        const declared = ["Sports", "Music", "Reading"].filter(h => activity[h.toLowerCase()]).sort();
        await expect(hobbiesWeb).toEqual(declared);
    }

    if (imageUpload) {
        const filename = imageUpload.includes("/") ? imageUpload.split("/")[1] : imageUpload;
        await expect(page.getByRole("cell", { name: filename })).toBeVisible();
    }

    if (states)
        await expect(page.getByRole("cell", { name: `${states.states} ${states.city}` })).toBeVisible();
}