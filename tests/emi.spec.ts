import { test, expect } from '@playwright/test';
import ExcelJS = require('exceljs');
import path = require('path');
import { EMIPage } from '../pages/EMIPage';
import bikeData from '../test-data/emiData.json';

let emiPage: EMIPage;

async function readTenureChangeData() {
    const workbook = new ExcelJS.Workbook();
    const workbookPath = path.resolve(
        __dirname,
        '../test-data/emiTestData.xlsx'
    );
    await workbook.xlsx.readFile(workbookPath);

    const worksheet = workbook.getWorksheet('Tenure Change');
    if (!worksheet) {
        throw new Error('Excel sheet "Tenure Change" was not found');
    }

    const row = worksheet.getRow(2);
    const data = {
        testCase: row.getCell(1).text,
        brand: row.getCell(2).text,
        model: row.getCell(3).text,
        variant: row.getCell(4).text,
        tenureMonths: Number(row.getCell(5).value)
    };

    if (
        data.testCase !== 'TC_EMI_02' ||
        !data.brand ||
        !data.model ||
        !data.variant ||
        !Number.isInteger(data.tenureMonths) ||
        data.tenureMonths <= 0
    ) {
        throw new Error('Excel row 2 contains invalid TC_EMI_02 data');
    }

    return data;
}

test.beforeEach(async ({ page }) => {

    emiPage = new EMIPage(page);

    await emiPage.navigateToEMICalculator();

});


test('TC_EMI_01 Validate EMI calculation with valid inputs',
async ({ page }) => {

    await emiPage.selectBike(
        bikeData.bike.brand,
        bikeData.bike.model,
        bikeData.bike.variant
    );

    await expect(
        emiPage.emiPrice()
    ).toBeVisible();
});



test('TC_EMI_02 Validate EMI recalculation when tenure changes',
async ({ page }) => {
    const tenureData = await readTenureChangeData();

    await emiPage.selectBike(
        tenureData.brand,
        tenureData.model,
        tenureData.variant
    );

    console.log(
  await page.getByPlaceholder('Select Brand').inputValue()
);

console.log(
  await page.getByPlaceholder('Select Model').inputValue()
);

console.log(
  await page.getByPlaceholder('Select Variant').inputValue()
);

    const beforeEMI = await emiPage.getEMI();
    console.log("before:"+beforeEMI)

    await emiPage.changeTenure(tenureData.tenureMonths);

    await page.waitForTimeout(2000);

    const afterEMI = await emiPage.getEMI();
    console.log("after:"+afterEMI)

    expect(afterEMI).not.toEqual(beforeEMI);
});



test('TC_EMI_03 Validate EMI recalculation when interest rate changes',
async ({ page }) => {

    await emiPage.selectBike(
        bikeData.bike.brand,
        bikeData.bike.model,
        bikeData.bike.variant
    );

    const beforeEMI = await emiPage.getEMI();

    await emiPage.increaseInterestRate();

    await page.waitForTimeout(2000);

    const afterEMI = await emiPage.getEMI();

    expect(afterEMI).not.toEqual(beforeEMI);
});


test('TC_EMI_04 Validate mandatory field validation', async ({ page }) => {

    const brandDropdown = page.locator('#bmvBrand');

    await expect(brandDropdown).toBeVisible();

    await expect(brandDropdown).toHaveValue(bikeData.expected.emptyBrand);

});


test('TC_EMI_05 Validate negative value restriction', async ({ page }) => {

    await page.getByRole('spinbutton').fill(
        String(bikeData.testInputs.negativeLoanAmount)
    );

    await page.keyboard.press('Enter');

    await expect(
      page.locator('.emiPrice')
    ).not.toContainText(bikeData.expected.invalidEmiText);

});


test('TC_EMI_06 Validate alphabetic input restriction', async ({ page }) => {

    const loanAmount = page.getByRole('spinbutton').first();

    await loanAmount.click();

    await page.keyboard.type(bikeData.testInputs.alphabeticLoanAmount);

    const value = await loanAmount.inputValue();

    console.log('VALUE =', value);

    expect(value).not.toBe(bikeData.testInputs.alphabeticLoanAmount);
});


test('TC_EMI_07 Validate EMI update through sliders',
async ({ page }) => {

    await emiPage.selectBike(
        bikeData.bike.brand,
        bikeData.bike.model,
        bikeData.bike.variant
    );

    const beforeEMI = await emiPage.getEMI();

    await emiPage.increaseLoanAmount();

    await page.waitForTimeout(2000);

    const afterEMI = await emiPage.getEMI();

    expect(afterEMI).not.toEqual(beforeEMI);
});