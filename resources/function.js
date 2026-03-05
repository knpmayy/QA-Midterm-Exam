import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import Person from "./person.js";

dayjs.extend(customParseFormat);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rand = (max) => Math.floor(Math.random() * max);
const DATASET_PATH = path.join(__dirname, "dataset");
const DEMOQA_URL = "https://demoqa.com/automation-practice-form/";

const state    = JSON.parse(fs.readFileSync(path.join(__dirname, "dataset", "state.json"), "utf-8"));
const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, "dataset", "subjectkey.json"), "utf-8"));

export function readCSV(fileName) {
    const content = fs.readFileSync(path.join(DATASET_PATH, fileName), "utf-8");
    const [headerLine, ...lines] = content.trim().split(/\r?\n/);
    const headers = headerLine.split(",");
    return lines
        .filter(line => line.trim())
        .map(line => {
            const values = line.split(",");
            return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] ?? "").trim()]));
        });
}

export function randomPerson() {
    const data = readCSV("persondata.csv");
    const row = data[rand(data.length)];
    return new Person(row.firstname, row.lastname, row.email, row.sex, row.mobile, row.birthdate, row.address);
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
    const images = fs.readdirSync(DATASET_PATH).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
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

    const d = dayjs(date, "D MMM YYYY");
    const day = d.date();
    const suffix = [11, 12, 13].includes(day) ? "th"
        : day % 10 === 1 ? "st"
        : day % 10 === 2 ? "nd"
        : day % 10 === 3 ? "rd"
        : "th";

    const input = page.locator("#dateOfBirthInput");
    await input.click();
    await page.waitForSelector(".react-datepicker__year-select", { state: "visible" });
    await page.locator(".react-datepicker__year-select").selectOption(String(d.year()));
    await page.locator(".react-datepicker__month-select").selectOption(String(d.month()));
    await page.getByRole("gridcell", { name: `Choose ${d.format("dddd")}, ${d.format("MMMM")} ${day}${suffix}` }).click();
}

async function typeSubject(page, name) {
    await page.locator(".subjects-auto-complete__input-container").click();
    await page.locator("#subjectsInput").fill(name);
    await page.locator("#subjectsInput").press("Enter");
}

export async function inputSubject(page, name) {
    const list = Array.isArray(name) ? name : [name];
    for (const s of list) await typeSubject(page, s);
}

export async function removeSubject(page, name) {
    const list = Array.isArray(name) ? name : [name];
    for (const s of list)
        await page.getByRole("button", { name: `Remove ${s}` }).click();
}

export async function getSubjectSelected(page) {
    const items = await page.locator(".subjects-auto-complete__multi-value.css-1p3m7a8-multiValue").all();
    const texts = await Promise.all(items.map(el => el.innerText()));
    return texts.sort();
}

export async function attachPhotos(page, filename) {
    await page.getByRole("button", { name: "Choose File" }).setInputFiles(
        path.join(DATASET_PATH, filename)
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