import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('product discovery, case studies and contact remain connected', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'L‑Proof AI 설계와 구현', exact: true }).click();
  await expect(page).toHaveURL(/\/products\/l-proof$/);
  // Client navigation can briefly retain the previous route's streamed metadata.
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://hetrich.com/products/l-proof');
  await page.getByRole('link', { name: '함께 만들고 싶은 일 이야기하기' }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('link', { name: '이메일 보내기' })).toHaveAttribute('href', 'mailto:this_is_laugh@naver.com');
  await page.goto('/products/silver-vow');
  await expect(page.getByText('각 장의 세 엔딩을 모두 모아야 다음 장이 열립니다.', { exact: false })).toBeVisible();
  await expect(page.getByText('비상업·비공식 팬게임입니다.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: '팬게임 플레이' })).toHaveAttribute('href', 'https://ipjaworld.github.io/malfoy-silver-vow/');
});

for (const width of [320, 768, 1440]) {
  test(`new case studies: images, overflow and accessibility at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const slug of ['l-proof', 'secretary', 'calories', 'rebemon', 'silver-vow']) {
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
  const xml = await sitemap.text();
  expect(xml).toContain('https://hetrich.com/products/silver-vow');
  expect(xml).toContain('https://hetrich.com/products/rebemon');
});

test('primary buttons keep comfortable geometry and keyboard access', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const buttons = page.locator('main .button');
  for (const button of await buttons.all()) {
    const metrics = await button.evaluate(el => {
      const css = getComputedStyle(el), rect = el.getBoundingClientRect();
      return { nested: el.querySelectorAll('a,button').length, height: rect.height, padding: parseFloat(css.paddingLeft), align: css.alignItems, weight: css.fontWeight, overflow: rect.right > innerWidth };
    });
    expect(metrics.nested).toBe(0);
    expect(metrics.height).toBeGreaterThanOrEqual(48);
    expect(metrics.padding).toBeGreaterThanOrEqual(28);
    expect(metrics.align).toBe('center');
    expect(metrics.weight).toBe('500');
    expect(metrics.overflow).toBe(false);
  }
  const primary = page.getByRole('link', { name: '제품 둘러보기' });
  await primary.focus();
  await expect(primary).toBeFocused();
  expect(await primary.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  const originalBackground = await primary.evaluate(el => getComputedStyle(el).backgroundColor);
  await primary.hover();
  await expect.poll(() => primary.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(originalBackground);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#products$/);
  const wrapped = await primary.evaluate(el => {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelector('.button-label')!.textContent = '긴 버튼 문구가 두 줄로 나뉘어도 가운데에 편안하게 표시됩니다';
    clone.style.width = '180px';
    el.parentElement!.appendChild(clone);
    const rect = clone.getBoundingClientRect();
    const disabled = document.createElement('button');
    disabled.className = 'button button-dark'; disabled.disabled = true; disabled.textContent = '대기';
    el.parentElement!.appendChild(disabled);
    const result = { height: rect.height, scroll: clone.scrollHeight, client: clone.clientHeight, disabledOpacity: getComputedStyle(disabled).opacity, disabledCursor: getComputedStyle(disabled).cursor };
    disabled.remove();
    clone.remove();
    return result;
  });
  expect(wrapped.height).toBeGreaterThan(48);
  expect(wrapped.scroll).toBeLessThanOrEqual(wrapped.client);
  expect(Number(wrapped.disabledOpacity)).toBeLessThan(1);
  expect(wrapped.disabledCursor).toBe('not-allowed');
});


test('button content groups label and icon without nested controls', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const button = page.getByRole('link', { name: '제품 둘러보기' });
  const group = button.locator('.button-content');
  await expect(group.locator('.button-label')).toHaveText('제품 둘러보기');
  expect(await group.evaluate(el => getComputedStyle(el).alignItems)).toBe('center');
  expect(await button.locator('a, button').count()).toBe(0);
  expect(await button.locator('.button-label').evaluate(el => getComputedStyle(el).top)).toBe('auto');
  await button.screenshot({ path: 'outputs/button-group.png', animations: 'disabled' });
});

test('button groups support mixed and multi-line labels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    const panel = document.createElement('div');
    panel.id = 'button-review';
    panel.style.cssText = 'position:fixed;inset:0;z-index:1000;background:#f8f7f3;padding:20px;display:flex;flex-direction:column;align-items:flex-start;gap:18px';
    for (const [text, icon] of [['제품 둘러보기', '↗'], ['Explore Products', ''], ['L-Proof AI 자세히 보기', '↗'], ['긴 제품 피드백과 협업 제안 보내기', '↗']]) {
      const button = document.createElement('button'); button.className = 'button button-dark';
      if (text.startsWith('긴')) button.style.width = '220px';
      const group = document.createElement('span'); group.className = 'button-content'; button.appendChild(group);
      const label = document.createElement('span'); label.className = 'button-label'; label.textContent = text; group.appendChild(label);
      if (icon) { const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = icon; group.appendChild(arrow); }
      panel.appendChild(button);
    }
    document.body.appendChild(panel);
  });
  const panel = page.locator('#button-review');
  await panel.screenshot({ path: 'outputs/button-varieties.png' });
  for (const label of await panel.locator('.button-label').all()) {
    expect(await label.evaluate(el => getComputedStyle(el).top)).toBe('auto');
  }
  expect(await panel.locator('.button').last().evaluate(el => el.scrollHeight <= el.clientHeight)).toBe(true);
});

test('interior routes retain the shared typography without horizontal overflow', async ({ page }) => {
  const paths = ['/products', '/products/l-proof', '/products/secretary', '/products/calories', '/products/rebemon', '/products/silver-vow', '/work', '/about', '/insights', '/contact'];
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.ok(), path).toBe(true);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('main h1'), path).toHaveCount(1);
      expect(await page.locator('main h1').evaluate(el => getComputedStyle(el).fontWeight), path).toBe('600');
      expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBe(width);
    }
  }
});
