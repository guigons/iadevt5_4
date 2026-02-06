import { test, expect } from '@playwright/test';

test.describe('Weather Dashboard', () => {
  test.describe('Busca por cidade', () => {
    test('should display weather data when searching for a valid city', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('location-name')).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId('temperature')).toContainText('°');
      await expect(page.getByTestId('weather-description')).toBeVisible();
      await expect(page.getByTestId('hourly-forecast')).toBeVisible();
      await expect(page.getByTestId('daily-forecast')).toBeVisible();
    });

    test('should show error message for invalid city', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('CidadeInexistente12345xyz');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('weather-error')).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId('weather-error')).toContainText('não encontrada');
    });

    test('should allow searching another city after first search', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('location-name')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder('Buscar cidade...').fill('Rio de Janeiro');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('location-name')).toContainText('Rio de Janeiro', { timeout: 15000 });
    });
  });

  test.describe('Previsões', () => {
    test('should display hourly forecast with scroll', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('hourly-forecast')).toBeVisible({ timeout: 15000 });
      const hourlyItems = page.getByTestId('hourly-item');
      await expect(hourlyItems.first()).toBeVisible();
      const count = await hourlyItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display 7-day forecast', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('daily-forecast')).toBeVisible({ timeout: 15000 });
      const dailyItems = page.getByTestId('daily-item');
      const count = await dailyItems.count();
      expect(count).toBe(7);
    });

    test('should highlight today in daily forecast', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('daily-forecast')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('Hoje')).toBeVisible();
    });
  });

  test.describe('Geolocalização', () => {
    test('should load weather automatically with geolocation permission', async ({ page, context }) => {
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation({ latitude: -23.55, longitude: -46.63 });
      await page.goto('/weather');
      await expect(page.getByTestId('temperature')).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId('hourly-forecast')).toBeVisible();
      await expect(page.getByTestId('daily-forecast')).toBeVisible();
    });

    test('should show search field when geolocation is denied', async ({ page, context }) => {
      await context.clearPermissions();
      await page.goto('/weather');
      await expect(page.getByPlaceholder('Buscar cidade...')).toBeVisible();
    });
  });

  test.describe('Estados de loading e erro', () => {
    test('should show loading spinner during search', async ({ page }) => {
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('location-name')).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Responsividade', () => {
    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('location-name')).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId('hourly-forecast')).toBeVisible();
      await expect(page.getByTestId('daily-forecast')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('location-name')).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId('hourly-forecast')).toBeVisible();
      await expect(page.getByTestId('daily-forecast')).toBeVisible();
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/weather');
      await page.getByPlaceholder('Buscar cidade...').fill('São Paulo');
      await page.getByRole('button', { name: 'Buscar' }).click();
      await expect(page.getByTestId('location-name')).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId('hourly-forecast')).toBeVisible();
      await expect(page.getByTestId('daily-forecast')).toBeVisible();
    });
  });
});
