import { test, expect } from '@playwright/test';

// Basic smoke test verifying page renders and simulation button transitions state
test('homepage loads and simulation triggers progress state', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /AI Voice Agent Architecture/i })).toBeVisible();

  const startButton = page.getByRole('button', { name: /Simulate Call Flow/i });
  await expect(startButton).toBeEnabled();
  await startButton.click();

  // After click, the label changes so re-select by new accessible name
  const progressButton = page.getByRole('button', { name: /Simulation in Progress/i });
  await expect(progressButton).toBeDisabled();
});
