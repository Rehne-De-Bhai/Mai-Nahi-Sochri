import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.bikedekho.com/');
  await page.locator('span').filter({ hasText: 'Tools' }).first().click();
  await page.getByRole('link', { name: 'EMI Calculator' }).click();
  await page.getByPlaceholder('Select Brand').click();
  await page.getByText('Honda').first().click();
  await page.getByPlaceholder('Select Model').click();
  await page.getByText('ADV 160').click();
  await page.getByPlaceholder('Select Variant').click();
  await page.locator('.cdRangeSlider').first().click();
  await page.locator('.gsp-handle').first().click();
  await page.locator('.gsp-handle').first().click();
  //await page.locator('.gsp-handle.gsp-handle-lower.gsp-active').click();
  await page.getByText('24', { exact: true }).click();
  await page.getByRole('radio', { name: '24' }).check();
});


test('test', async ({ page }) => {
  await page.goto('https://www.bikedekho.com/bike-loan-emi-calculator');
  await page.getByPlaceholder('Select Brand').click();
  await page.getByText('Honda').first().click();
  await page.getByPlaceholder('Select Model').click();
  await page.getByText('Activa', { exact: true }).click();
  await page.getByPlaceholder('Select Variant').click();
  await page.getByText('STD ₹88636*').click();
  await page.locator('.gsp-handle').first().click();
  await page.locator('#sliderInterest > .gsp-base > .gsp-origin > .gsp-handle').click();
  await page.locator('#emi_section').getByText('30', { exact: true }).click();
  await page.locator('#emi_section').getByRole('radio', { name: '30' }).check();
});