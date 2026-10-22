import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('product discovery, case studies and contact remain connected', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'L‑Proof AI 설계와 구현', exact: true }).click();
  await expect(page).toHaveURL(/\/products\/l-proof$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://hetrich.com/products/l-proof');
  await page.getByRole('link', { name: '함께 만들고 싶은 일 이야기하기' }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('link', { name: '이메일 보내기' })).toHaveAttribute('href', 'mailto:this_is_laugh@naver.com');
  await page.goto('/products/silver-vow');
  await expect(page.getByText('각 장의 세 엔딩을 모두 모아야 다음 장이 열립니다.', { exact: false })).toBeVisible();
  await expect(page.getByText('검토 중 / 아직 구현하지 않은 방향')).toBeVisible();
  await expect(page.getByRole('link', { name: '팬게임 플레이' })).toHaveAttribute('href', 'https://ipjaworld.github.io/malfoy-silver-vow/');
});

for (const width of [320, 768, 1440]) {
  test(`new case studies: images, overflow and accessibility at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const slug of ['l-proof', 'secretary', 'calories', 'silver-vow']) {
      await page.goto(`/products/${slug}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test('reduced motion and keyboard access to product evidence', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const preview = page.getByRole('link', { name: 'L‑Proof AI 제품 사례 보기' });
  await preview.focus();
  await expect(preview).toBeFocused();
  expect(await page.locator('.showcase-card').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/products\/l-proof$/);
});

test('unknown product returns a genuine 404 and sitemap includes cases', async ({ page, request }) => {
  const response = await page.goto('/products/not-a-product');
  expect(response?.status()).toBe(404);
  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain('https://hetrich.com/products/silver-vow');
});
