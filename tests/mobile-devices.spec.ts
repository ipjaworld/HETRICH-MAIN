import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('mobile product discovery, touch navigation and rotation', async ({ page }, testInfo) => {
  const viewport = page.viewportSize()!;
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.lproof-skeleton')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.getByRole('link', { name: '제품 둘러보기' }).tap();
  await expect(page.locator('#products-title')).toBeInViewport();
  const heading = await page.locator('#products-title').boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(header!.height);
  await expect(page.locator('.showcase-card')).toHaveCount(4);
  await expect(page.locator('.showcase-status')).toHaveText(['공개 운영', '개발 버전', '초기 버전 · 사용 가능', '출시 · 공개 이용 가능']);
  for (const link of await page.locator('.showcase-actions a, .studio-products-more a').all()) {
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
  const clipped = await page.locator('h1,h2,h3,p').evaluateAll(nodes => nodes.filter(n => n.scrollWidth > n.clientWidth + 1).map(n => n.textContent));
  expect(clipped).toEqual([]);
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  for (const preview of await page.locator('.product-preview img').all()) {
    await preview.scrollIntoViewIfNeeded();
    await expect.poll(() => preview.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator('#products').screenshot({ path: `outputs/${testInfo.project.name}-products.png`, style: '.site-header, .skip-link { visibility: hidden !important; }' });
  // Keep device DPR for interaction; CSS-pixel output avoids WebKit's 32767px image limit on long pages.
  await page.screenshot({ path: `outputs/${testInfo.project.name}-home.png`, fullPage: true, scale: 'css' });

  await page.getByRole('link', { name: '제품별 설계와 구현' }).tap();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.locator('.product-row')).toHaveCount(4);
  await expect(page.getByRole('link', { name: 'HIS GitHub (새 탭)', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '메뉴 열기' }).tap();
  await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: 'About' }).tap();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute('aria-expanded', 'false');

  // Inspect every existing route in both orientations with this device's touch/DPR profile.
  for (const route of ['/', '/products', '/about', '/contact', '/insights']) {
    await page.goto(route);
    for (const size of [viewport, { width: viewport.height, height: viewport.width }]) {
      await page.setViewportSize(size);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${route} ${size.width}px`).toBe(size.width);
      await expect(page.locator('h1')).toHaveCount(1);
    }
  }
  expect(errors).toEqual([]);
});
