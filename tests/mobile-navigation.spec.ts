import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });

test('menu animates in and out without shifting the header', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Open navigation', exact: true });
  const before = await button.boundingBox();
  const motion = await page.evaluate(async () => {
    const trigger = document.querySelector<HTMLButtonElement>('.mobile-toggle')!;
    const panel = document.querySelector<HTMLElement>('#mobile-nav')!;
    trigger.click();
    const start = Number(getComputedStyle(panel).opacity);
    const properties = panel.getAnimations().map(a => (a as CSSTransition).transitionProperty);
    await Promise.all(panel.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {})));
    return { start, end: Number(getComputedStyle(panel).opacity), properties };
  });
  expect(motion.properties).toContain('transform');
  expect(motion.properties).toContain('opacity');
  expect(motion.start).toBeLessThan(1);
  expect(motion.end).toBe(1);
  const after = await page.getByRole('button', { name: 'Close navigation' }).boundingBox();
  expect(Math.abs(after!.x - before!.x)).toBeLessThan(1);
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
  const exit = await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>('.mobile-toggle')!.click();
    const panel = document.querySelector<HTMLElement>('#mobile-nav')!;
    return { hidden: panel.hidden, inert: panel.inert, state: panel.dataset.state };
  });
  expect(exit).toEqual({ hidden: false, inert: true, state: 'closed' });
  await expect(page.locator('#mobile-nav')).toBeHidden();
  await expect(page.locator('.mobile-nav-scrim')).toBeHidden();
  await expect(page.locator('html')).not.toHaveClass(/mobile-menu-open/);
});

test('rapid reversal, Escape, and outside tap leave the menu in the right state', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('#mobile-nav');
  await page.evaluate(async () => {
    const trigger = document.querySelector<HTMLButtonElement>('.mobile-toggle')!;
    trigger.click();
    await new Promise<void>(r => requestAnimationFrame(() => r()));
    trigger.click();
    await new Promise<void>(r => requestAnimationFrame(() => r()));
    trigger.click();
    await Promise.all(document.querySelector('#mobile-nav')!.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {})));
  });
  await expect(panel).toBeVisible();
  await expect(panel).not.toHaveAttribute('inert');
  await expect(page.locator('.mobile-toggle')).toHaveAttribute('aria-expanded', 'true');
  await panel.getByRole('link', { name: 'About', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mobile-toggle')).toBeFocused();
  await expect(panel).toBeHidden();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const box = await panel.boundingBox();
  await page.mouse.click(5, box!.y + 32);
  await expect(panel).toBeHidden();
  await expect(page.locator('.mobile-toggle')).toBeFocused();
});

test('reduced motion is immediate; disclosure is scrollable on short screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 480 });
  await page.goto('/contact-us/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const panel = page.locator('#mobile-nav');
  const reduced = await panel.evaluate(m => ({ count: m.getAnimations({ subtree: true }).length, height: m.clientHeight, all: m.scrollHeight, bottom: m.getBoundingClientRect().bottom }));
  expect(reduced.count).toBe(0);
  expect(reduced.all).toBeGreaterThan(reduced.height);
  const bar = await page.locator('.mobile-actions').boundingBox();
  expect(reduced.bottom).toBeLessThan(bar!.y);
  await panel.getByRole('link', { name: 'Contact', exact: true }).scrollIntoViewIfNeeded();
  await expect(panel.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('aria-current', 'page');
  const hidden = await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>('.mobile-toggle')!.click();
    return document.querySelector<HTMLElement>('#mobile-nav')!.hidden;
  });
  expect(hidden).toBe(true);
});

test('header request link works from an open menu, and desktop resize clears the backdrop', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.locator('.header-request').click();
  await expect(page).toHaveURL(/#request-service$/);
  await expect(page.locator('#mobile-nav')).toBeHidden();
  await expect(page.locator('html')).not.toHaveClass(/mobile-menu-open/);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.setViewportSize({ width: 1366, height: 900 });
  await expect(page.locator('#mobile-nav')).toBeHidden();
  await expect(page.locator('.mobile-nav-scrim')).toBeHidden();
  await expect(page.locator('.desktop-nav')).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/mobile-menu-open/);
});

test('open navigation remains accessible across phone and tablet widths', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  for (const width of [320, 390, 768, 1024, 1100]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.getByRole('navigation', { name: 'Mobile navigation', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const audit = await new AxeBuilder({ page }).include('.site-header').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(audit.violations).toEqual([]);
  }
});
