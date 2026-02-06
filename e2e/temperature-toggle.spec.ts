import { test, expect } from '@playwright/test';

test.describe('Temperature Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/weather');
    await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page.getByTestId('temperature')).toBeVisible({ timeout: 15000 });
  });

  test('should display toggle buttons', async ({ page }) => {
    await expect(page.getByTestId('temperature-toggle')).toBeVisible();
    await expect(page.getByTestId('toggle-celsius')).toBeVisible();
    await expect(page.getByTestId('toggle-fahrenheit')).toBeVisible();
  });

  test('should show temperatures in celsius by default', async ({ page }) => {
    const temperature = await page.getByTestId('temperature').textContent();
    expect(temperature).toContain('°C');
  });

  test('should toggle all temperatures to fahrenheit', async ({ page }) => {
    await page.getByTestId('toggle-fahrenheit').click();
    const temperature = await page.getByTestId('temperature').textContent();
    expect(temperature).toContain('°F');
    const feelsLike = await page.getByTestId('feels-like').textContent();
    expect(feelsLike).toContain('°F');
    const hourlyItems = page.getByTestId('hourly-item');
    const firstHourlyText = await hourlyItems.first().textContent();
    expect(firstHourlyText).toContain('°F');
    const dailyItems = page.getByTestId('daily-item');
    const firstDailyText = await dailyItems.first().textContent();
    expect(firstDailyText).toContain('°F');
  });

  test('should toggle back to celsius', async ({ page }) => {
    await page.getByTestId('toggle-fahrenheit').click();
    const tempF = await page.getByTestId('temperature').textContent();
    expect(tempF).toContain('°F');
    await page.getByTestId('toggle-celsius').click();
    const tempC = await page.getByTestId('temperature').textContent();
    expect(tempC).toContain('°C');
  });

  test('should persist fahrenheit selection after page reload', async ({ page }) => {
    await page.getByTestId('toggle-fahrenheit').click();
    const tempBefore = await page.getByTestId('temperature').textContent();
    expect(tempBefore).toContain('°F');
    await page.reload();
    await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page.getByTestId('temperature')).toBeVisible({ timeout: 15000 });
    const tempAfter = await page.getByTestId('temperature').textContent();
    expect(tempAfter).toContain('°F');
  });

  test('should persist celsius selection after page reload', async ({ page }) => {
    await page.getByTestId('toggle-fahrenheit').click();
    await page.getByTestId('toggle-celsius').click();
    const tempBefore = await page.getByTestId('temperature').textContent();
    expect(tempBefore).toContain('°C');
    await page.reload();
    await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page.getByTestId('temperature')).toBeVisible({ timeout: 15000 });
    const tempAfter = await page.getByTestId('temperature').textContent();
    expect(tempAfter).toContain('°C');
  });
});
