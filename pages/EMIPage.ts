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

    thirtySixMonths = () =>
        this.page.locator('input[name="loadPeriod"][value="36"]');

    // Actions

    async navigateToEMICalculator() {

        await this.page.goto(
            'https://www.bikedekho.com/bike-loan-emi-calculator'
        );

    }

    async selectBike(
        brand: string,
        model: string,
        variant: string
    ) {

        await this.page.getByPlaceholder('Select Brand').fill(brand);
        await this.page.keyboard.press('Enter');

        await this.page.getByPlaceholder('Select Model').fill(model);
        await this.page.keyboard.press('Enter');

        await this.page.getByPlaceholder('Select Variant').fill(variant);
        await this.page.keyboard.press('Enter');
    }

    async getEMI() {
        return await this.emiPrice().textContent();
    }

    async changeTenure(months: number) {
        await this.page.locator(
            `input[name="loadPeriod"][value="${months}"]`
        ).check();
    }

    async increaseInterestRate() {
        await this.interestSlider().press('ArrowRight');
    }

    async increaseLoanAmount() {
        await this.loanAmountSlider().press('ArrowRight');
    }
}
