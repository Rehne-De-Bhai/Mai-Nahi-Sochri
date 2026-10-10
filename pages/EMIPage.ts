import { Page, expect } from '@playwright/test';
import data from '../test-data/emiData.json';

export class EMIPage {

    constructor(private page: Page) {}

    // Locators

    brandDropdown = () => this.page.locator('#bmvBrand');
    modelDropdown = () => this.page.locator('#bmvModel');
    variantDropdown = () => this.page.locator('#bmvVariant');

    emiPrice = () => this.page.locator('.emiPrice');

    interestSlider = () => this.page.locator('#sliderInterest');

    loanAmountSlider = () => this.page.locator('#slideramount');

    twelveMonths = () =>
        this.page.locator('input[name="loadPeriod"][value="12"]');

    twentyFourMonths = () =>
        this.page.locator('input[name="loadPeriod"][value="24"]');

    // Actions

    async navigateToEMICalculator() {

        await this.page.goto(
            'https://www.bikedekho.com/bike-loan-emi-calculator'
        );

    }

    async selectHondaActivaSTD() {

        await this.page.getByPlaceholder('Select Brand').click();
        await this.page.getByText(data.bike.brand).first().click();

        await this.page.getByPlaceholder('Select Model').click();
        await this.page.getByText(data.bike.model, {exact: true}).click();

        await this.page.getByPlaceholder('Select Variant').click();
        await this.page.getByPlaceholder('Select Variant').fill(data.bike.variant);

        await this.page.keyboard.press('Enter');
    }

    async getEMI() {
        return await this.emiPrice().textContent();
    }

    async changeTenureTo12Months() {
        await this.twelveMonths().check();
    }

    async changeTenureTo24Months() {
        await this.twentyFourMonths().check();
    }

    async increaseInterestRate() {
        await this.interestSlider().press('ArrowRight');
    }

    async increaseLoanAmount() {
        await this.loanAmountSlider().press('ArrowRight');
    }
}
