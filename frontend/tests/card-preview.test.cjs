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
      if (url.pathname === '/api/users/favorite/') return route.fulfill({ json: { cards: [{ card: 42 }], favorite_card_count: 1 } });
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
    await page.goto('http://deckit.test/favorites.html?preview');
    await page.waitForURL('**/account.html');
    await page.locator('#auth-panel').waitFor();
    await page.goto('http://deckit.test/create-deck.html');
    await page.locator('#builder-favorites').waitFor({ state: 'visible' });
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
    await page.goto('http://deckit.test/account.html');
    for (const [width, ratio] of [[360, 1], [1280, 0.6]]) {
      await page.setViewportSize({ width, height: 800 });
      const box = await page.locator('.stat-card').first().boundingBox();
      assert.ok(Math.abs(box.height - box.width * ratio) < 1);
    }
    await page.locator('[href="favorites.html"]').click();
    const favorite = page.locator('[data-preview-card="42"]');
    await favorite.waitFor();
    assert.equal(await favorite.locator('img').getAttribute('src'), card.small_image_url);
    await favorite.click();
    assert.equal(await page.locator('dialog[open] h2').textContent(), card.name);
    for (const path of ['create-deck.html', 'create-deck.html?edit=1']) {
      await page.goto('http://deckit.test/' + path);
      await page.locator('#builder-favorites').waitFor();
      const toggle = page.locator('[aria-controls="builder-card-filters"]');
      const level = path.includes('?') ? '7' : '8';
      await toggle.click();
      await page.locator('#builder-card-filters [name="level"]').fill(level);
      await page.locator('.create-heading').click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      const filtered = page.waitForRequest(request => new URL(request.url()).searchParams.get('level') === level);
      await page.locator('#search-cards-button').click();
      await filtered;
      await page.locator('[data-add-card="42"]').waitFor();
      await page.locator('#builder-favorites').click();
      await page.locator('[data-add-quantity]').selectOption('2');
      await page.locator('[data-add-card="42"]').click();
      assert.equal(await page.locator('[data-selected-quantity="42"]').inputValue(), '2');
      await page.locator('.chosen-card [data-preview-card="42"] img').click();
      assert.equal(await page.locator('dialog[open] h2').textContent(), card.name);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('[data-selected-quantity="42"]').inputValue(), '2');
      assert.equal(await page.locator('#card-added-notice').textContent(), 'Carta adicionada com sucesso. ' + card.name);
    }
    for (const [file, region] of [
      ['decks.html', '#user-decks'], ['index.html', '.deck-list'], ['account.html', '.account-stats']
    ]) {
      await page.evaluate(() => Object.keys(localStorage)
        .filter(key => key.startsWith('deckit.api.cache.')).forEach(key => localStorage.removeItem(key)));
      let release;
      const pending = new Promise(resolve => { release = resolve; });
      await page.route('**/api/decks/decklist/', async route => {
        await pending;
        await route.fulfill({json: {decks: []}});
      });
      await page.goto('http://deckit.test/' + file);
      const section = page.locator(region);
      await section.locator('.collection-spinner').first().waitFor();
      assert.equal(await section.getAttribute('aria-busy'), 'true');
      assert.ok(!(await section.textContent()).includes('Você ainda não criou decks.'));
      release();
      await page.locator(region + '[aria-busy="false"]').waitFor();
      if (file === 'account.html') assert.equal(await section.locator('[data-profile-stat="decks"]').textContent(), '0');
      else assert.ok((await section.textContent()).includes('Você ainda não criou decks.'));
      await page.unroute('**/api/decks/decklist/');
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
