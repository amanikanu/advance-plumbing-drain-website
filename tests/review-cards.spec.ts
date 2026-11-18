import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { business } from '../content/business';

for (const path of ['/', '/reviews/']) {
  test(`review cards: branded, accessible links on ${path}`, async ({ page, context }) => {
    await page.goto(path + '#customer-reviews');
    const section = page.getByRole('region', { name: path === '/' ? 'Hear from our customers.' : 'Read the original reviews.' });
    await expect(section).toBeVisible();
    for (const [name, href] of [['Google Maps', business.profiles.google], ['Yelp', business.profiles.yelp]]) {
      const card = section.getByRole('link', { name: `Read reviews on ${name} (opens in a new tab)` });
      await expect(card).toHaveAttribute('href', href);
      await expect(card).toHaveAttribute('rel', /noopener/);
      const size = await card.boundingBox();
      expect(size!.height).toBeGreaterThanOrEqual(44);
      // Verify the external-link action without generating a visit to a real business profile.
      await context.route(href, r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>Review source test fixture</title>' }));
      await card.focus();
      await expect(card).toBeFocused();
      const popup = context.waitForEvent('page');
      await page.keyboard.press('Enter');
      const tab = await popup;
      await expect(tab).toHaveURL(href);
      await tab.close();
    }
    for (const width of [320, 390, 768, 980, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await section.scrollIntoViewIfNeeded();
      expect(await section.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      const results = await new AxeBuilder({ page }).include('#customer-reviews').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
      expect(results.violations).toEqual([]);
    }
  });
}
