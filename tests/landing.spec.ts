import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 375, 390, 430, 768, 1024, 1440];
for (const width of widths) {
  test(`home layout and accessibility at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('.lproof-skeleton')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.showcase-card')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const clipped = await page.locator('h1,h2,h3,p,.showcase-card').evaluateAll(nodes => nodes.filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.textContent));
    expect(clipped).toEqual([]);
    for (const cta of await page.locator('.showcase-actions a, .studio-hero-actions a, .menu-button:visible').all()) {
      const box = await cta.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    await page.locator('a[href="#products"]').click();
    await expect(page).toHaveURL(/#products$/);
    await expect(page.locator('#products')).toBeInViewport();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.screenshot({ path: `outputs/${testInfo.project.name}-${width}.png`, fullPage: true });
  });
}

test('mobile keyboard menu, navigation, resize and skip link', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  // Windows WebKit excludes anchors from native Tab traversal (Playwright #5609).
  // Chrome checks sequential Tab order; WebKit checks focus + keyboard activation.
  if (browserName === 'webkit') await page.getByRole('link', { name: '본문으로 건너뛰기' }).focus();
  else await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '본문으로 건너뛰기' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const menu = page.getByRole('button', { name: '메뉴 열기' });
  await menu.click();
  if (browserName === 'webkit') await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: 'Products' }).focus();
  else await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: 'Products' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: 'Products' }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('existing routes remain usable at narrow and tablet widths', async ({ page }) => {
  for (const route of ['/products', '/about', '/contact', '/insights']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${route} at ${width}`).toBe(width);
    }
  }
});

test('reduced motion, short viewport and product destinations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  const destinations = await page.locator('.showcase-actions .button').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect(destinations).toEqual(['https://l-proof-ai.xyz', 'https://hetrich.vercel.app/', 'https://how-much-calories-left.vercel.app/', 'https://www.rebemon.xyz/']);
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await expect(page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: 'Contact' })).toBeInViewport();
});

test('mobile viewport emulation and rotation', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  await page.goto(process.env.TEST_BASE_URL ?? 'http://localhost:3101');
  expect(await page.evaluate(() => innerWidth)).toBe(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(844);
  await expect(page.getByRole('navigation', { name: '주요 메뉴' })).toBeVisible();
  await context.close();
});

test('publication rows have one divider and no hover underline', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const rows = page.locator('a.home-article');
  await expect(rows).toHaveCount(3);
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const row = rows.first();
    await row.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const before = await row.evaluate(el => ({
      line: getComputedStyle(el).textDecorationLine,
      border: getComputedStyle(el).borderTopWidth,
      height: el.getBoundingClientRect().height,
    }));
    await row.hover();
    expect(await row.evaluate(el => getComputedStyle(el).textDecorationLine)).toBe('none');
    expect(await row.locator('h3').evaluate(el => getComputedStyle(el).textDecorationLine)).toBe('none');
    expect(before.line).toBe('none');
    expect(await row.evaluate(el => getComputedStyle(el).borderTopWidth)).toBe(before.border);
    expect((await row.boundingBox())!.height).toBe(before.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.locator('.studio-insights').screenshot({ path: `outputs/${testInfo.project.name}-publications-${width}.png`, style: '.site-header, .skip-link { visibility: hidden !important; }' });
  }
});

for (const width of [320, 768, 1024, 1440, 1920]) {
  test(`founder name and portrait at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/about');
    await page.evaluate(() => document.fonts.ready);
    const name = page.getByRole('heading', { name: '이건하', exact: true });
    await name.scrollIntoViewIfNeeded();
    const nameLayout = await name.evaluate(el => {
      const range = document.createRange(); range.selectNodeContents(el);
      return { lines: range.getClientRects().length, width: el.scrollWidth, available: el.clientWidth };
    });
    expect(nameLayout.lines).toBe(1);
    expect(nameLayout.width).toBeLessThanOrEqual(nameLayout.available);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const portrait = page.getByRole('img', { name: 'HETRICH를 만드는 개발자 이건하', exact: true });
    await portrait.scrollIntoViewIfNeeded();
    await expect(portrait).toBeVisible();
    await expect.poll(() => portrait.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await page.locator('.founder-section').screenshot({ path: `outputs/founder-${width}.png`, style: '.site-header { visibility: hidden !important; }' });
  });
}

for (const width of [320, 768, 1440, 1920]) {
  test(`selected work readable and accessible at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('article')).toHaveCount(5);
    await expect(page.getByText('개발자 이건하가 이전 조직에서 수행한 프로젝트의 담당 범위와 문제 해결 과정을 소개합니다.')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const clipped = await page.locator('h1,h2,h3,p').evaluateAll(nodes => nodes.filter(n => n.scrollWidth > n.clientWidth + 1).map(n => n.textContent));
    expect(clipped).toEqual([]);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    if (width <= 700) await page.getByRole('button', { name: '메뉴 열기' }).click();
    await expect(page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: 'Selected Work' })).toHaveAttribute('aria-current', 'page');
    if (width <= 700) await page.getByRole('button', { name: '메뉴 닫기' }).click();
    await page.screenshot({ path: `outputs/work-${testInfo.project.name}-${width}.png`, fullPage: true });
    await page.getByRole('link', { name: '개발·협업 문의' }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });
}
