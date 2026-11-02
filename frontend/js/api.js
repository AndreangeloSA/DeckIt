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

  function normalizeCard(card) {
    return {
      ...card,
      id: String(card.id),
      image: card.image_url || card.image || `https://pub-6aee9263b7e24444b8ca3bc7c18b8d2c.r2.dev/${card.id}.jpg`,
      def: card.defense ?? card.def ?? null
    };
  }

  function normalizeDeck(deck) {
    const entries = deck.card || deck.deck_containing_card || [];
    return {
      ...deck,
      id: String(deck.id),
      description: deck.description || "",
      cards: entries.map(entry => ({
        id: String(entry.card), quantity: Number(entry.card_quantity) || 1, section: entry.section || "main"
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
    try {
      if (session?.refresh) await request("users/logout/", { method: "POST", body: { refresh: session.refresh } });
    } finally { saveSession(null); }
  }

  async function listDecks() {
    const result = await request("decks/decklist/");
    return (result.decks || []).map(normalizeDeck);
  }

  async function getDeck(id) { return normalizeDeck(await request(`decks/decks/${encodeURIComponent(id)}/`)); }
  async function createDeck(data) { return normalizeDeck(await request("decks/create/", { method: "POST", body: data })); }
  async function editDeck(id, data) { return normalizeDeck(await request(`decks/edit/${encodeURIComponent(id)}/`, { method: "PATCH", body: data })); }
  async function deleteDeck(id) { return request(`decks/delete/${encodeURIComponent(id)}/`, { method: "DELETE" }); }
  async function searchCards(name, filters = {}, page = 1) {
    const result = await request("cards/search/", { params: { name, ...filters, page }, noRefresh: true });
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
    return normalizeManagedCard(await request("decks/manage_cards/", { method: "POST", body: { deck, card, card_quantity, section } }));
  }
  async function removeCard({ deck, card, card_quantity = 1, section = "main" }) {
    return normalizeManagedCard(await request("decks/manage_cards/", { method: "DELETE", body: { deck, card, card_quantity, section } }));
  }
  function normalizeManagedCard(result) {
    return result ? { ...result, card: result.card === undefined ? undefined : String(result.card) } : result;
  }
  async function getStats() { return request("decks/card_usage_stats/"); }
  async function getFavorites() { return request("users/favorite/"); }
  async function addFavorite(id) { return request(`users/favorite/${encodeURIComponent(id)}/`, { method: "POST" }); }
  async function removeFavorite(id) { return request(`users/favorite/${encodeURIComponent(id)}/`, { method: "DELETE" }); }

  window.DeckItAPI = {
    get session() { return session; },
    get baseUrl() { return base.href; },
    request, login, register, logout, listDecks, getDeck, createDeck, editDeck, deleteDeck,
    searchCards, cardById, addCard, removeCard, getStats, getFavorites, addFavorite, removeFavorite
  };
})();
