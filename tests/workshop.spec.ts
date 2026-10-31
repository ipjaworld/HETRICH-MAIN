import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const goInside = async (page: Page) => {
  await page.evaluate(() => window.scrollTo({ top: Number((document.querySelector('.workshop-track') as HTMLElement).dataset.insideTop), behavior: 'instant' }));
  await expect(page.locator('.workshop[data-scene="inside"]')).toHaveCount(1);
};

const objects = [
  ['person', '이건하'], ['paper', 'L‑Proof AI'], ['memo', 'HIS'], ['book', '악역영애 말포이 — 은빛 서약'],
  ['drawer', '실무 경험'], ['arcade', '메이플랜드 레범몬'], ['bowl', 'How Much Calories Left'], ['story', '쓰고 있는 이야기'],
] as const;

test('every object opens through its real tap target and stays changed', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${process.env.TEST_BASE_URL ?? 'http://localhost:3101'}/`);
  await expect(page.locator('.workshop[data-ready]')).toHaveCount(1);
  await goInside(page);
  const home = await page.locator('.workshop-stage').getAttribute('viewBox');
  for (const [id, title] of objects) {
    // The screen point matters: a tap must not be swallowed by furniture drawn in front.
    const box = (await page.locator(`[data-hit="${id}"]`).boundingBox())!;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.locator('.workshop-panel h2')).toHaveText(title);
    await expect(page.locator('.workshop-back')).toBeInViewport();
    // A real touch: locator.tap() would scroll the page to fit the sliding panel.
    await page.waitForTimeout(900);
    const back = (await page.locator('.workshop-back').boundingBox())!;
    await page.touchscreen.tap(back.x + back.width / 2, back.y + back.height / 2);
    await expect(page.locator('.workshop[data-focus]')).toHaveCount(0);
    await expect.poll(() => page.locator('.workshop-stage').getAttribute('viewBox')).toBe(home);
  }
  await expect(page.locator('.obj.visited')).toHaveCount(objects.length);
  // Closing a panel must leave the visitor in the room rather than scroll them away.
  expect(await page.evaluate(() => scrollY)).toBe(Number(await page.locator('.workshop-track').getAttribute('data-inside-top')));
  expect(errors).toEqual([]);
  await context.close();
});

test('keyboard opens an object and escape returns to it', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.workshop[data-ready]')).toHaveCount(1);
  await page.locator('[data-hit="arcade"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.workshop-panel h2')).toHaveText('메이플랜드 레범몬');
  await expect(page.locator('.workshop-back')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.workshop[data-focus]')).toHaveCount(0);
  await expect(page.locator('[data-hit="arcade"]')).toBeFocused();
});

test('scrolling walks from the street through the door and only then reaches the record', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.locator('.workshop[data-scene="outside"]')).toHaveCount(1);
  await expect(page.locator('.workshop-exterior')).toBeVisible();
  await expect(page.locator('[data-hit="paper"]')).toHaveCSS('pointer-events', 'none');
  await expect(page.locator('.workshop-brand')).toHaveCSS('opacity', '1');
  await expect(page.locator('#workshop-title')).toHaveCSS('opacity', '0');
  await expect(page.locator('.site-header .wordmark')).toBeHidden();
  await goInside(page);
  await expect(page.locator('.workshop-brand')).toHaveCSS('opacity', '0');
  await expect(page.locator('#workshop-title')).toHaveCSS('opacity', '1');
  await expect(page.locator('.site-header .wordmark')).toBeVisible();
  await expect(page.locator('[data-hit="paper"]')).toHaveCSS('pointer-events', 'all');
  await expect(page.locator('.workshop-exterior')).toBeHidden();
  await expect(page.locator('#products')).not.toBeInViewport();
  const track = page.locator('.workshop-track');
  const end = await track.evaluate((node) => node.getBoundingClientRect().bottom + scrollY - innerHeight);
  await page.evaluate((top) => window.scrollTo({ top: top - 10, behavior: 'instant' }), end);
  await expect(page.locator('.workshop[data-scene="inside"]')).toBeInViewport();
  await page.evaluate((top) => window.scrollTo({ top: top + 700, behavior: 'instant' }), end);
  await expect(page.locator('#products-title')).toBeInViewport();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.workshop[data-scene="outside"]')).toHaveCount(1);
});

test('street layers reach the screen edges instead of cutting vehicles mid-road', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.workshop[data-scene="outside"]')).toHaveCount(1);
  const clipping = await page.locator('.workshop-street').first().evaluate((node) => ({ overflow: getComputedStyle(node).overflow, clip: getComputedStyle(node).clipPath }));
  expect(clipping.overflow).toBe('visible');
  expect(clipping.clip).toContain('-300%');
});

test('reduced motion starts inside with no pinned scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.workshop[data-scene="inside"]')).toHaveCount(1);
  await expect(page.locator('.workshop-exterior')).toBeHidden();
  expect(await page.locator('.workshop-track').evaluate((node) => node.getBoundingClientRect().height)).toBe(await page.evaluate(() => innerHeight));
});

test('a visitor from a service lands at that service without stealing focus', async ({ page }) => {
  await page.goto('/?ref=calories');
  await expect(page.locator('.workshop-panel h2')).toHaveText('How Much Calories Left');
  await expect(page.getByText('이 서비스를 만든 이건하의 작업실입니다.')).toBeVisible();
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY');
});

for (const phase of ['morning', 'noon', 'night']) {
  test(`${phase} room and open panel pass accessibility checks`, async ({ page }) => {
    await page.goto(`/?t=${phase}`);
    await expect(page.locator(`.workshop[data-time="${phase}"]`)).toHaveCount(1);
    const outside = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(outside.violations).toEqual([]);
    await page.locator('[data-hit="paper"]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.workshop-back')).toBeFocused();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}
