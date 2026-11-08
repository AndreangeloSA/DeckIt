(() => {
  "use strict";

  const SESSION_KEY = "deckit.api.session.v1";
  const configuredBase = document.querySelector('meta[name="deckit-api-base"]')?.content;
  const defaultBase = location.protocol === "file:"
    ? "http://127.0.0.1:8000/api/"
    : location.port === "8000"
      ? `${location.origin}/api/`
      : `${location.protocol}//${location.hostname}:8000/api/`;
  const base = new URL(configuredBase || defaultBase, location.href);
  let session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (_) { session = null; }

  function checkStoredSession() {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (_) {}
    if (session?.user?.username !== stored?.user?.username) location.reload();
    else session = stored;
  }
  window.addEventListener("storage", event => {
    if (event.key === SESSION_KEY || event.key === null) checkStoredSession();
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) checkStoredSession();
  });

  let wakeUpPromise = null;

  function wakeUpAPI() {
  if (!wakeUpPromise) {
    wakeUpPromise = fetch(url("health/"))
      .then(response => {
        if (!response.ok) {
          throw new Error("API indisponível");
        }
        return true;
      })
      .catch(error => {
        console.error("Erro ao conectar à API:", error);
        wakeUpPromise = null;
        return false;
      });
  }

    return wakeUpPromise;
  }

  function saveSession(next) {
    session = next;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }

  function url(path, params) {
    const target = new URL(String(path).replace(/^\//, ""), base.href.endsWith("/") ? base : new URL(base.href + "/"));
    if (params) Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") target.searchParams.set(key, value);
    });
    return target;
  }

  async function parseResponse(response) {
    if (response.status === 204) return null;
    const raw = await response.text();
    let payload = null;
    try { payload = raw ? JSON.parse(raw) : null; } catch (_) { payload = raw; }
    if (!response.ok) {
      const detail = payload && (payload.detail || payload.error || Object.values(payload).flat().join(" "));
      throw new Error(detail || `API error (${response.status})`);
    }
    return payload;
  }

  async function refreshAccess() {
    if (!session?.refresh) return false;
    const response = await fetch(url("users/token/refresh/"), {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh: session.refresh })
    });
    if (!response.ok) { saveSession(null); return false; }
    const tokens = await response.json();
    saveSession({ ...session, access: tokens.access, refresh: tokens.refresh || session.refresh });
    return true;
  }

  async function request(path, options = {}) {
    const settings = { ...options };
    const headers = new Headers(settings.headers || {});
    headers.set("Accept", "application/json");
    if (settings.body !== undefined && !(settings.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
      settings.body = JSON.stringify(settings.body);
    }
    if (session?.access && !settings.noAuth) headers.set("Authorization", `Bearer ${session.access}`);
    delete settings.noAuth;
    settings.headers = headers;
    settings.credentials = "same-origin";
    let response = await fetch(url(path, options.params), settings);
    if (response.status === 401 && session?.refresh && !options.noRefresh) {
      if (await refreshAccess()) {
        headers.set("Authorization", `Bearer ${session.access}`);
        response = await fetch(url(path, options.params), settings);
      }
    }
    return parseResponse(response);
  }

  const CACHE_PREFIX = "deckit.api.cache.v1:";
  const CACHE_TTL = { cards: 24 * 60 * 60 * 1000, user: 5 * 60 * 1000 };

  function cacheOwner() {
    return session?.user?.username ? encodeURIComponent(session.user.username.toLocaleLowerCase()) : "anonymous";
  }

  function cacheKey(category, path, params = {}) {
    const scope = category === "cards" ? "public" : cacheOwner();
    const query = new URLSearchParams(Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([a], [b]) => a.localeCompare(b))).toString();
    return `${CACHE_PREFIX}${scope}:${category}:${path}:${query}`;
  }

  function readCache(key, ttl) {
    try {
      const cached = JSON.parse(localStorage.getItem(key) || "null");
      if (cached && Date.now() - cached.savedAt < ttl) return { hit: true, value: cached.value };
      if (cached) localStorage.removeItem(key);
    } catch (_) { localStorage.removeItem(key); }
    return { hit: false, value: null };
  }

  async function cachedGet(category, path, params, ttl, options = {}) {
    if (category !== "cards" && !session?.user?.username) throw new Error("Faça login para acessar os dados da conta.");
    const key = cacheKey(category, path, params);
    const cached = readCache(key, ttl);
    if (cached.hit) return cached.value;
    const value = await request(path, { ...options, params });
    try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value })); } catch (_) { /* cache is optional when storage is full */ }
    return value;
  }

  function clearUserCache(...categories) {
    const ownerPrefix = `${CACHE_PREFIX}${cacheOwner()}:`;
    const selectedPrefixes = categories.map(category => `${ownerPrefix}${category}:`);
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith(ownerPrefix) && (!categories.length || selectedPrefixes.some(prefix => key.startsWith(prefix)))) {
        localStorage.removeItem(key);
      }
    }
  }

  function clearAllUserCache(owner = cacheOwner()) {
    const ownerPrefix = `${CACHE_PREFIX}${owner}:`;
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith(ownerPrefix)) localStorage.removeItem(key);
    }
  }
  function normalizeCard(card) {
    return {
      ...card,
      id: String(card.id),
      thumbnail: card.small_image_url || null,
      image: card.image_url || card.image || `https://pub-6aee9263b7e24444b8ca3bc7c18b8d2c.r2.dev/${card.id}.jpg`,
      def: card.defense ?? card.def ?? null
    };
  }

  function normalizeDeck(deck) {
    const hasSectionLists = Array.isArray(deck.main_deck_cards) || Array.isArray(deck.extra_deck_cards) || Array.isArray(deck.side_deck_cards);
    const entries = hasSectionLists
      ? [
          ...(deck.main_deck_cards || []).map(entry => ({ ...entry, section: entry.section || "main" })),
          ...(deck.extra_deck_cards || []).map(entry => ({ ...entry, section: entry.section || "extra" })),
          ...(deck.side_deck_cards || []).map(entry => ({ ...entry, section: entry.section || "side" }))
        ]
      : (deck.card || deck.deck_containing_card || []);
    return {
      ...deck,
      id: String(deck.id),
      description: deck.description || "",
      cards: entries.map(entry => ({
        id: String(entry.card ?? entry.id), quantity: Number(entry.card_quantity ?? entry.quantity) || 1, section: entry.section || "main"
      }))
    };
  }

  async function login(username, password, profile = {}) {
    const tokens = await request("users/token/", { method: "POST", body: { username, password }, noAuth: true, noRefresh: true });
    saveSession({ access: tokens.access, refresh: tokens.refresh, user: { username, ...profile } });
    return session;
  }

  async function register({ username, email, password }) {
    await request("users/register/", { method: "POST", body: { username, email, password }, noAuth: true, noRefresh: true });
    return login(username, password, { email });
  }

  async function logout() {
    const owner = cacheOwner();
    try {
      if (session?.refresh) await request("users/logout/", { method: "POST", body: { refresh: session.refresh } });
    } finally { clearAllUserCache(owner); saveSession(null); }
  }

  async function listDecks() {
    const result = await cachedGet("decks", "decks/decklist/", {}, CACHE_TTL.user);
    return (result.decks || []).map(normalizeDeck);
  }

  async function getDeck(id) { return normalizeDeck(await cachedGet("decks", `decks/decks/${encodeURIComponent(id)}/`, {}, CACHE_TTL.user)); }
  async function createDeck(data) { const deck = normalizeDeck(await request("decks/create/", { method: "POST", body: data })); clearUserCache("decks", "stats"); return deck; }
  async function editDeck(id, data) { const deck = normalizeDeck(await request(`decks/edit/${encodeURIComponent(id)}/`, { method: "PATCH", body: data })); clearUserCache("decks", "stats"); return deck; }
  async function deleteDeck(id) { const result = await request(`decks/delete/${encodeURIComponent(id)}/`, { method: "DELETE" }); clearUserCache("decks", "stats"); return result; }
  async function searchCards(name, filters = {}, page = 1) {
    const result = await cachedGet("cards", "cards/search/", { name, ...filters, page }, CACHE_TTL.cards, { noRefresh: true });
    if (Array.isArray(result)) return { results: result.map(normalizeCard), count: result.length, next: null, previous: null };
    const body = result?.results ? result : result?.search_results ? result.search_results : result?.data ? result.data : result?.pagination?.results ? result.pagination : result;
    const cards = Array.isArray(body) ? body : (body?.results || body?.cards || []);
    const pagination = result?.pagination && !Array.isArray(result.pagination) ? result.pagination : body;
    return {
      ...result,
      results: cards.map(normalizeCard),
      count: pagination?.count ?? pagination?.total ?? result?.count ?? cards.length,
      next: pagination?.next ?? result?.next ?? null,
      previous: pagination?.previous ?? result?.previous ?? null
    };
  }
  async function cardById(id) {
    const result = await searchCards("", { id }, 1);
    return result.results.length ? result.results[0] : null;
  }
  async function addCard({ deck, card, card_quantity = 1, section = "main" }) {
    const result = normalizeManagedCard(await request("decks/manage_cards/", { method: "POST", body: { deck, card, card_quantity, section } }));
    clearUserCache("decks", "stats");
    return result;
  }
  async function removeCard({ deck, card, card_quantity = 1, section = "main" }) {
    const result = normalizeManagedCard(await request("decks/manage_cards/", { method: "DELETE", body: { deck, card, card_quantity, section } }));
    clearUserCache("decks", "stats");
    return result;
  }
  function normalizeManagedCard(result) {
    return result ? { ...result, card: result.card === undefined ? undefined : String(result.card) } : result;
  }
  async function getStats() { return cachedGet("stats", "decks/card_usage_stats/", {}, CACHE_TTL.user); }
  async function getFavorites(params = {}) { return cachedGet("favorites", "users/favorite/", params, CACHE_TTL.user); }
  async function addFavorite(id) { const result = await request(`users/favorite/${encodeURIComponent(id)}/`, { method: "POST" }); clearUserCache("favorites"); return result; }
  async function removeFavorite(id) { const result = await request(`users/favorite/${encodeURIComponent(id)}/`, { method: "DELETE" }); clearUserCache("favorites"); return result; }

  window.DeckItAPI = {
    get session() { return session; },
    get baseUrl() { return base.href; },
    request, login, register, logout, listDecks, getDeck, createDeck, editDeck, deleteDeck,
    searchCards, cardById, addCard, removeCard, getStats, getFavorites, addFavorite, removeFavorite
  };
  void wakeUpAPI();
})();
