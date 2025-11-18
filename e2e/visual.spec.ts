import { test, expect } from '@playwright/test';

// Basic visual regression for landing layout (non-animation snapshot)
// Animations are minimal but we enforce prefers-reduced-motion to stabilize.

test.use({
  colorScheme: 'dark',
  viewport: { width: 1280, height: 800 }
});

test('homepage visual baseline', async ({ page }) => {
  await page.addInitScript(() => {
    const css = document.createElement('style');
    css.textContent = `* { transition: none !important; animation: none !important; }`;
    document.head.appendChild(css);
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('home.png');
});
