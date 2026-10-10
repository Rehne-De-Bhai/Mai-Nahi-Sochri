import { test, expect } from '@playwright/test';
import { EMIPage } from '../pages/EMIPage';

let emiPage: EMIPage;

test.beforeEach(async ({ page }) => {

    emiPage = new EMIPage(page);

    await emiPage.navigateToEMICalculator();

});


test('TC_EMI_01 Validate EMI calculation with valid inputs',
async ({ page }) => {

    await emiPage.selectHondaActivaSTD();

    await expect(
        emiPage.emiPrice()
    ).toBeVisible();
});



test('TC_EMI_02 Validate EMI recalculation when tenure changes',
async ({ page }) => {

    await emiPage.selectHondaActivaSTD();

    const beforeEMI = await emiPage.getEMI();

    await emiPage.changeTenureTo12Months();

    await page.waitForTimeout(2000);

    const afterEMI = await emiPage.getEMI();

    expect(afterEMI).not.toEqual(beforeEMI);
});



test('TC_EMI_03 Validate EMI recalculation when interest rate changes',
async ({ page }) => {

    await emiPage.selectHondaActivaSTD();

    const beforeEMI = await emiPage.getEMI();

    await emiPage.increaseInterestRate();

    await page.waitForTimeout(2000);

    const afterEMI = await emiPage.getEMI();

    expect(afterEMI).not.toEqual(beforeEMI);
});


test('TC_EMI_04 Validate mandatory field validation', async ({ page }) => {

    const brandDropdown = page.locator('#bmvBrand');

    await expect(brandDropdown).toBeVisible();

    await expect(brandDropdown).toHaveValue('');

});


test('TC_EMI_05 Validate negative value restriction', async ({ page }) => {

    await page.getByRole('spinbutton').fill('-10000');

    await page.keyboard.press('Enter');

    await expect(
      page.locator('.emiPrice')
    ).not.toContainText('NaN');

});


test('TC_EMI_06 Validate alphabetic input restriction', async ({ page }) => {

    const loanAmount = page.getByRole('spinbutton').first();

    await loanAmount.click();

    await page.keyboard.type('abcd');

    const value = await loanAmount.inputValue();

    console.log('VALUE =', value);

    expect(value).not.toBe('abcd');
});


test('TC_EMI_07 Validate EMI update through sliders',
async ({ page }) => {

    await emiPage.selectHondaActivaSTD();

    const beforeEMI = await emiPage.getEMI();

    await emiPage.increaseLoanAmount();

    await page.waitForTimeout(2000);

    const afterEMI = await emiPage.getEMI();

    expect(afterEMI).not.toEqual(beforeEMI);
});