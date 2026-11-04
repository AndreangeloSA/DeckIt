const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

test('search thumbnails and accessible responsive card preview', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const card = { id: 42, name: 'Test Dragon', small_image_url: 'https://images.test/small.jpg', image_url: 'https://images.test/full.jpg', desc: '<script>unsafe</script>\nDescription', atk: 0, defense: 2500, level: 8, type: 'Monster', race: 'Dragon' };
    const images = [];
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname === 'images.test') {
        images.push(url.pathname);
        return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="421" height="614"><rect width="421" height="614" fill="tan"/></svg>' });
      }
      if (url.pathname.includes('/api/decks/decks/')) return route.fulfill({ json: { id: 1, name: 'Test deck', description: 'Full width description', card: [{card: 42, card_quantity: 1}] } });
      if (url.pathname.includes('/api/')) return route.fulfill({ json: { results: [card], count: 1, next: null } });
      const file = path.join(__dirname, '..', decodeURIComponent(url.pathname));
      const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
      try { return route.fulfill({ body: await fs.readFile(file), contentType: types[path.extname(file)] || 'application/octet-stream' }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    });
    await page.goto('http://deckit.test/search.html?q=Dragon');
    const button = page.locator('[data-preview-card]');
    await button.waitFor();
    assert.equal(await button.locator('img').getAttribute('src'), card.small_image_url);
    assert.ok(!images.includes('/full.jpg'), 'full artwork must not load before opening');
    for (const width of [360, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await button.focus();
      await page.keyboard.press('Enter');
      const dialog = page.locator('dialog');
      assert.equal(await dialog.evaluate(el => el.open), true);
      assert.equal(await dialog.locator('img').getAttribute('src'), card.image_url);
      assert.equal(await dialog.locator('dl div').filter({ has: page.locator('dt', { hasText: /^ATK$/ }) }).locator('dd').textContent(), '0');
      assert.equal(await dialog.locator('.card-preview-description').textContent(), card.desc);
      assert.equal(await dialog.locator('script').count(), 0);
      assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth));
      await page.keyboard.press('Tab');
      assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)));
      await page.keyboard.press('Escape');
      assert.equal(await dialog.evaluate(el => el.open), false);
      assert.equal(await button.evaluate(el => el === document.activeElement), true);
    }
    await button.click();
    await page.locator('[data-close-preview]').click();
    assert.equal(await page.locator('dialog').evaluate(el => el.open), false);
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('card-preview-open')), false);
    // A missing thumbnail must never cause an eager full-size download.
    delete card.small_image_url;
    images.length = 0;
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('.card-thumbnail-placeholder').waitFor();
    assert.deepEqual(images, []);
    await button.click();
    assert.equal(await page.locator('dialog img').getAttribute('src'), card.image_url);
    await page.mouse.click(1, 1);
    assert.equal(await page.locator('dialog').evaluate(el => el.open), false);
    card.small_image_url = 'https://images.test/small.jpg';
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://deckit.test/index.html');
    await page.locator('[data-preview-card="46986414"]').click();
    await page.locator('dialog[open]').waitFor();
    assert.equal(await page.locator('dialog h2').textContent(), card.name);
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      localStorage.setItem('deckit.api.session.v1', JSON.stringify({access:'test', user:{username:'test'}}));
      localStorage.setItem('deckit.local.theme', 'dark');
    });
    await page.goto('http://deckit.test/deck.html?id=1');
    await page.locator('.deck-card').waitFor();
    for (const width of [360, 1280]) {
      await page.setViewportSize({width, height:800});
      await page.evaluate(() => document.documentElement.dataset.theme = 'dark');
      const layout = await page.evaluate(() => {
        const desc = document.querySelector('#single-deck-description').getBoundingClientRect();
        const actions = document.querySelector('.deck-actions').getBoundingClientRect();
        const card = document.querySelector('.deck-card');
        return {descRight:desc.right, actionsRight:actions.right, bg:getComputedStyle(card).backgroundColor, surface:getComputedStyle(document.documentElement).getPropertyValue('--surface').trim()};
      });
      assert.ok(Math.abs(layout.descRight-layout.actionsRight)<1);
      assert.equal(layout.bg,'rgb(53, 49, 58)');
      await page.locator('[data-preview-card]').click();
      await page.locator('dialog[open]').waitFor();
      assert.equal(await page.locator('dialog h2').textContent(),card.name);
      await page.keyboard.press('Escape');
    }
    assert.equal(await page.locator('[data-quantity]').textContent(),'1');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
