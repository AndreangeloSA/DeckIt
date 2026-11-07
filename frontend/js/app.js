(() => {
  "use strict";

  const STORAGE_KEY = "deckit.local.decks.v1";
  let cards = [
    { id: "46986414", name: "Dark Magician", image: "assets/cards/46986414.jpg" },
    { id: "89631139", name: "Blue-Eyes White Dragon", image: "assets/cards/89631139.jpg" },
    { id: "74677422", name: "Red-Eyes Black Dragon", image: "assets/cards/74677422.jpg" }
  ];

  const demoDeckIds = new Set(["blue-eyes", "dark-magician", "red-eyes", "red-eyes-treino"]);

  const LANGUAGE_KEY = "deckit.local.language";
  const translations = {
    en: {
      "DeckIt — Início": "DeckIt — Home", "DeckIt — Minha coleção": "DeckIt — My collection",
      "DeckIt — Criar deck": "DeckIt — Create deck", "DeckIt — Blue-Eyes": "DeckIt — Blue-Eyes",
      "DeckIt — Dark Magician": "DeckIt — Dark Magician", "DeckIt — Pesquisar cartas": "DeckIt — Search cards",
      "DeckIt — Minha conta": "DeckIt — My account", "DeckIt — Configurações": "DeckIt — Settings",
      "Pular para o conteúdo": "Skip to content", "Início": "Home", "Meus decks": "My decks",
      "Ver todos": "View all", "Pesquisar cartas": "Search cards", "Criar deck": "Create deck",
      "Todos os seus decks": "All your decks", "Ordenar por": "Sort by", "Nome": "Name",
      "Nome (A–Z)": "Name (A–Z)", "Mais recentes": "Most recent", "Minha coleção": "My collection",
      "Buscar decks...": "Search decks...", "Nome do deck": "Deck name", "Minha conta": "My account",
      "Seu espaço pessoal no DeckIt.": "Your personal space in DeckIt.", "Membro DeckIt": "DeckIt member",
      "Editar perfil": "Edit profile", "Resumo da coleção": "Collection summary", "Dados da conta": "Account details",
      "E-mail": "Email", "Conta": "Account", "Tema, idioma e preferências": "Theme, language, and preferences",
      "Sair da conta": "Sign out", "Encerrar sua sessão neste dispositivo": "Sign out on this device",
      "Os dados exibidos são exemplos visuais e ainda não estão vinculados a uma conta.": "The displayed data is sample content and is not linked to an account yet.",
      "Configurações": "Settings", "Personalize sua experiência no DeckIt.": "Customize your DeckIt experience.",
      "Aparência": "Appearance", "Escolha como o DeckIt aparece para você.": "Choose how DeckIt looks.",
      "Tema": "Theme", "Desértico": "Desert", "Areia, creme e terracota": "Sand, cream, and terracotta",
      "Escuro": "Dark", "Contraste suave para pouca luz": "Soft contrast for low light", "Claro": "Light",
      "Visual luminoso e neutro": "Bright, neutral look", "Idioma": "Language", "Defina o idioma da interface.": "Choose the interface language.",
      "Idioma do aplicativo": "App language", "Preferências": "Preferences", "Escolha o que deseja ver na coleção.": "Choose what to show in your collection.",
      "Mostrar imagens das cartas": "Show card images", "Exibir artes nos decks e nas cartas": "Show artwork in decks and cards",
      "Reduzir animações": "Reduce motion", "Usar transições mais discretas": "Use subtler transitions",
      "As preferências ficam salvas neste navegador.": "Preferences are saved in this browser.",
      "Pesquisar cartas": "Search cards", "Encontre uma carta para sua coleção.": "Find a card for your collection.",
      "Buscar": "Search", "Resultados": "Results", "Nome da carta": "Card name", "Cartas": "Cards",
      "Perfil": "Profile", "Decks": "Decks", "Ajustes": "Settings", "Cartas totais": "Total cards", "Carta mais utilizada": "Most used card", "Cartas favoritas": "Favorite cards", "Navegação principal": "Main navigation",
      "Pesquisar cartas pelo nome": "Search cards by name", "Pesquisar decks": "Search decks",
      "Criar deck": "Create deck", "Editar deck": "Edit deck", "Editar informações do deck": "Edit deck details", "Informações do deck": "Deck details", "Salvar deck": "Save deck",
      "Salvar alterações": "Save changes", "Cancelar": "Cancel", "Cartas adicionadas ao deck": "Cards added to the deck",
      "Cartas de exemplo": "Sample cards", "Adicionar carta": "Add card", "Adicionar cartas ao deck": "Add cards to the deck", "Adicionar ou editar cartas": "Add or edit cards",
      "Clique em uma carta exemplo para ver seus detalhes.": "Click a sample card to view its details.",
      "Adicionar ao deck": "Add to deck", "Quantidade": "Quantity", "Remover": "Remove",
      "As cartas adicionadas aparecerão aqui.": "Cards you add will appear here.", "Pesquise para ver cartas": "Search to see cards",
      "carta encontrada": "card found", "cartas encontradas": "cards found", "Abrir deck": "Open deck",
      "Você ainda não criou decks.": "You have not created any decks yet.", "Nenhum deck encontrado.": "No decks found.",
      "Seus decks aparecerão aqui.": "Your decks will appear here.",
      "Desenvolvido por": "Developed by",
      "Excluir deck": "Delete deck", "Tem certeza de que deseja excluir este deck?": "Are you sure you want to delete this deck?",
      "Faça login para garantir persistência dos decks através de dispositivos e navegadores.": "Sign in to keep your decks synced across devices and browsers.",
      "Seus decks ficam salvos neste navegador.": "Your decks are saved in this browser.",
      "Este deck ainda não tem cartas.": "This deck does not have any cards yet.", "Não foi possível salvar os decks neste navegador.": "Could not save decks in this browser.",
      "Adicione pelo menos uma carta ao deck.": "Add at least one card to the deck.", "Todos os decks": "All decks", "DeckIt é um projeto independente, não oficial e não afiliado à Konami ou aos titulares de Yu-Gi-Oh!.": "DeckIt is an independent, unofficial project and is not affiliated with Konami or the Yu-Gi-Oh! rights holders."
    },
    es: {
      "DeckIt — Início": "DeckIt — Inicio", "DeckIt — Minha coleção": "DeckIt — Mi colección",
      "DeckIt — Criar deck": "DeckIt — Crear mazo", "DeckIt — Blue-Eyes": "DeckIt — Blue-Eyes",
      "DeckIt — Dark Magician": "DeckIt — Dark Magician", "DeckIt — Pesquisar cartas": "DeckIt — Buscar cartas",
      "DeckIt — Minha conta": "DeckIt — Mi cuenta", "DeckIt — Configurações": "DeckIt — Ajustes",
      "Pular para o conteúdo": "Saltar al contenido", "Início": "Inicio", "Meus decks": "Mis mazos",
      "Ver todos": "Ver todos", "Pesquisar cartas": "Buscar cartas", "Criar deck": "Crear mazo",
      "Todos os seus decks": "Todos tus mazos", "Ordenar por": "Ordenar por", "Nome": "Nombre",
      "Nome (A–Z)": "Nombre (A–Z)", "Mais recentes": "Más recientes", "Minha coleção": "Mi colección",
      "Buscar decks...": "Buscar mazos...", "Nome do deck": "Nombre del mazo", "Minha conta": "Mi cuenta",
      "Seu espaço pessoal no DeckIt.": "Tu espacio personal en DeckIt.", "Membro DeckIt": "Miembro de DeckIt",
      "Editar perfil": "Editar perfil", "Resumo da coleção": "Resumen de la colección", "Dados da conta": "Datos de la cuenta",
      "E-mail": "Correo electrónico", "Conta": "Cuenta", "Tema, idioma e preferências": "Tema, idioma y preferencias",
      "Sair da conta": "Cerrar sesión", "Encerrar sua sessão neste dispositivo": "Cerrar sesión en este dispositivo",
      "Os dados exibidos são exemplos visuais e ainda não estão vinculados a uma conta.": "Los datos mostrados son ejemplos y todavía no están vinculados a una cuenta.",
      "Configurações": "Ajustes", "Personalize sua experiência no DeckIt.": "Personaliza tu experiencia en DeckIt.",
      "Aparência": "Apariencia", "Escolha como o DeckIt aparece para você.": "Elige cómo se ve DeckIt.",
      "Tema": "Tema", "Desértico": "Desértico", "Areia, creme e terracota": "Arena, crema y terracota",
      "Escuro": "Oscuro", "Contraste suave para pouca luz": "Contraste suave para poca luz", "Claro": "Claro",
      "Visual luminoso e neutro": "Estilo luminoso y neutro", "Idioma": "Idioma", "Defina o idioma da interface.": "Elige el idioma de la interfaz.",
      "Idioma do aplicativo": "Idioma de la aplicación", "Preferências": "Preferencias", "Escolha o que deseja ver na coleção.": "Elige qué quieres ver en la colección.",
      "Mostrar imagens das cartas": "Mostrar imágenes de las cartas", "Exibir artes nos decks e nas cartas": "Mostrar ilustraciones en mazos y cartas",
      "Reduzir animações": "Reducir animaciones", "Usar transições mais discretas": "Usar transiciones más discretas",
      "As preferências ficam salvas neste navegador.": "Las preferencias se guardan en este navegador.",
      "Encontre uma carta para sua coleção.": "Encuentra una carta para tu colección.", "Buscar": "Buscar", "Resultados": "Resultados",
      "Nome da carta": "Nombre de la carta", "Cartas": "Cartas", "Perfil": "Perfil", "Decks": "Mazos", "Ajustes": "Ajustes", "Cartas totais": "Cartas totales", "Carta mais utilizada": "Carta más utilizada", "Cartas favoritas": "Cartas favoritas",
      "Navegação principal": "Navegación principal", "Pesquisar cartas pelo nome": "Buscar cartas por nombre", "Pesquisar decks": "Buscar mazos",
      "Editar deck": "Editar mazo", "Editar informações do deck": "Editar información del mazo", "Informações do deck": "Información del mazo", "Salvar deck": "Guardar mazo", "Salvar alterações": "Guardar cambios", "Cancelar": "Cancelar",
      "Cartas adicionadas ao deck": "Cartas añadidas al mazo", "Cartas de exemplo": "Cartas de ejemplo", "Adicionar carta": "Añadir carta",
      "Clique em uma carta exemplo para ver seus detalhes.": "Haz clic en una carta de ejemplo para ver sus detalles.",
      "Adicionar cartas ao deck": "Añadir cartas al mazo", "Adicionar ou editar cartas": "Añadir o editar cartas", "Adicionar ao deck": "Añadir al mazo", "Quantidade": "Cantidad", "Remover": "Quitar",
      "As cartas adicionadas aparecerão aqui.": "Las cartas añadidas aparecerán aquí.", "Pesquise para ver cartas": "Busca para ver cartas",
      "carta encontrada": "carta encontrada", "cartas encontradas": "cartas encontradas", "Abrir deck": "Abrir mazo",
      "Você ainda não criou decks.": "Todavía no has creado mazos.", "Nenhum deck encontrado.": "No se encontraron mazos.",
      "Seus decks aparecerão aqui.": "Tus mazos aparecerán aquí.",
      "Desenvolvido por": "Desarrollado por",
      "Excluir deck": "Eliminar mazo", "Tem certeza de que deseja excluir este deck?": "¿Seguro que quieres eliminar este mazo?",
      "Faça login para garantir persistência dos decks através de dispositivos e navegadores.": "Inicia sesión para mantener tus mazos sincronizados entre dispositivos y navegadores.",
      "Seus decks ficam salvos neste navegador.": "Tus mazos se guardan en este navegador.",
      "Este deck ainda não tem cartas.": "Este mazo todavía no tiene cartas.", "Não foi possível salvar os decks neste navegador.": "No se pudieron guardar los mazos en este navegador.",
      "Adicione pelo menos uma carta ao deck.": "Añade al menos una carta al mazo.", "DeckIt é um projeto independente, não oficial e não afiliado à Konami ou aos titulares de Yu-Gi-Oh!.": "DeckIt es un proyecto independiente y no oficial, sin afiliación con Konami ni con los titulares de Yu-Gi-Oh!."
    }
  };
  Object.assign(translations.en, {
    "Main": "Main",
    "Extra": "Extra",
    "Side": "Side",
    "Entre na sua conta para ver seus decks.": "Sign in to see your decks.",
    "Entre na sua conta para salvar o deck.": "Sign in to save your deck.",
    "Carregando decks…": "Loading decks…",
    "Carregando estatísticas…": "Loading statistics…",
    "Não foi possível carregar os decks.": "Could not load decks.",
    "Entre na sua conta para ver as cartas favoritas.": "Sign in to view your favorite cards.",
    "Carta adicionada com sucesso.": "Card added successfully.",
    "Pesquisa": "Search",
    "Ver cartas favoritas": "View favorite cards",
    "Nenhuma carta favorita.": "No favorite cards yet.",
    "Conta criada com sucesso.": "Account created successfully.",
    "Login realizado com sucesso.": "Signed in successfully.",
    "Deck excluído com sucesso.": "Deck deleted.",
    "Alterações salvas.": "Changes saved.",
    "Deck criado com sucesso.": "Deck created.",
    "Carregando cartas favoritas…": "Loading favorite cards…",
    "Não foi possível carregar os favoritos.": "Could not load favorites.",
    "DeckIt — Cartas favoritas": "DeckIt — Favorite cards",
    "Qtd.": "Qty.", "Nome da carta...": "Card name...", "Pesquisar cartas pelo nome...": "Search cards by name...",
    "Ex.: Dragões de olhos azuis": "e.g. Blue-Eyes Dragons", "Descrição": "Description", "Descreva seu deck...": "Describe your deck..."
  });
  Object.assign(translations.es, {
    "Main": "Principal",
    "Extra": "Extra",
    "Side": "Banquillo",
    "Entre na sua conta para ver seus decks.": "Inicia sesión para ver tus mazos.",
    "Entre na sua conta para salvar o deck.": "Inicia sesión para guardar tu mazo.",
    "Carregando decks…": "Cargando mazos…",
    "Carregando estatísticas…": "Cargando estadísticas…",
    "Não foi possível carregar os decks.": "No se pudieron cargar los mazos.",
    "Entre na sua conta para ver as cartas favoritas.": "Inicia sesión para ver tus cartas favoritas.",
    "Carta adicionada com sucesso.": "Carta añadida correctamente.",
    "Pesquisa": "Búsqueda",
    "Ver cartas favoritas": "Ver cartas favoritas",
    "Nenhuma carta favorita.": "Aún no hay cartas favoritas.",
    "Conta criada com sucesso.": "Cuenta creada correctamente.",
    "Login realizado com sucesso.": "Sesión iniciada.",
    "Deck excluído com sucesso.": "Mazo eliminado.",
    "Alterações salvas.": "Cambios guardados.",
    "Deck criado com sucesso.": "Mazo creado.",
    "Carregando cartas favoritas…": "Cargando cartas favoritas…",
    "Não foi possível carregar os favoritos.": "No se pudieron cargar los favoritos.",
    "DeckIt — Cartas favoritas": "DeckIt — Cartas favoritas",
    "Qtd.": "Cant.", "Nome da carta...": "Nombre de la carta...", "Pesquisar cartas pelo nome...": "Buscar cartas por nombre...",
    "Ex.: Dragões de olhos azuis": "Ej.: Dragones de ojos azules", "Descrição": "Descripción", "Descreva seu deck...": "Describe tu mazo..."
  });
  let currentLanguage = "pt-BR";
  const originalTextNodes = new WeakMap();
  const originalAttributes = new WeakMap();

  function translateValue(source, language = currentLanguage) {
    if (language === "pt-BR" || !source) return source;
    const dictionary = translations[language];
    const trimmed = source.trim();
    let translated = dictionary[trimmed];
    let match;
    if (!translated && (match = trimmed.match(/^(\d+) cartas?$/i))) {
      translated = language === "en" ? `${match[1]} ${Number(match[1]) === 1 ? "card" : "cards"}` : `${match[1]} ${Number(match[1]) === 1 ? "carta" : "cartas"}`;
    } else if (!translated && (match = trimmed.match(/^(\d+) decks?$/i))) {
      translated = language === "en" ? `${match[1]} ${Number(match[1]) === 1 ? "deck" : "decks"}` : `${match[1]} ${Number(match[1]) === 1 ? "mazo" : "mazos"}`;
    } else if (!translated && (match = trimmed.match(/^(\d+) cartas? encontradas?$/i))) {
      translated = language === "en" ? `${match[1]} ${Number(match[1]) === 1 ? "card" : "cards"} found` : `${match[1]} ${Number(match[1]) === 1 ? "carta encontrada" : "cartas encontradas"}`;
    } else if (!translated && (match = trimmed.match(/^Abrir deck (.+)$/i))) {
      translated = `${language === "en" ? "Open deck" : "Abrir mazo"} ${match[1]}`;
    } else if (!translated && (match = trimmed.match(/^Carta (.+)$/i))) {
      translated = `${language === "en" ? "Card" : "Carta"} ${match[1]}`;
    } else if (!translated && (match = trimmed.match(/^Cartas do deck (.+)$/i))) {
      translated = `${language === "en" ? "Cards in deck" : "Cartas del mazo"} ${match[1]}`;
    } else if (!translated && (match = trimmed.match(/^Quantidade: (\d+)$/i))) {
      translated = `${language === "en" ? "Quantity" : "Cantidad"}: ${match[1]}`;
    } else if (!translated && (match = trimmed.match(/^Ex\.: (.+)$/i))) {
      translated = `${language === "en" ? "e.g." : "Ej.:"} ${match[1]}`;
    }
    return translated ? source.replace(trimmed, translated) : source;
  }

  function applyLanguage() {
    document.documentElement.lang = currentLanguage;
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
      node.nodeValue = translateValue(originalTextNodes.get(node));
    }
    document.querySelectorAll("[placeholder], [aria-label], [alt], [title]").forEach(element => {
      const originals = originalAttributes.get(element) || {};
      ["placeholder", "aria-label", "alt", "title"].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
        element.setAttribute(attribute, translateValue(originals[attribute]));
      });
      originalAttributes.set(element, originals);
    });
  }

  function loadLanguage() {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    currentLanguage = ["pt-BR", "en", "es"].includes(saved) ? saved : "pt-BR";
    applyLanguage();
  }
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  const getCard = id => cards.find(card => card.id === String(id));
  const totalCards = deck => (deck.cards || []).reduce((sum, card) => sum + Number(card.quantity || 0), 0);
  const API = window.DeckItAPI;
  let apiMode = Boolean(API && API.session);
  let favoriteIds = new Set();
  let favoritesLoaded = false;
  let apiStats = null;
  let collectionState = "ready";
  const spinner = '<span class="collection-spinner" aria-hidden="true"></span>';

  let cardSearchSequence = 0;
  let builderSearchSequence = 0;

  async function restoreApiData({ deckList = false, coverLimit = 0, stats = false, favorites = false } = {}) {
    if (!API || !API.session) { apiMode = false; return false; }
    apiMode = true;
    const owner = API.session.user?.username;
    const [deckResult, statsResult, favoritesResult] = await Promise.allSettled([
      deckList ? API.listDecks() : Promise.resolve(null),
      stats ? API.getStats() : Promise.resolve(null),
      favorites ? API.getFavorites() : Promise.resolve(null)
    ]);
    if (!API.session || API.session.user?.username !== owner) return false;
    if (deckResult.status === "fulfilled" && deckResult.value) decks = deckResult.value;
    else if (deckList) console.warn("Não foi possível carregar os decks.", deckResult.reason);
    if (statsResult.status === "fulfilled" && statsResult.value) apiStats = statsResult.value;
    if (favoritesResult.status === "fulfilled" && favoritesResult.value) {
      favoriteIds = new Set((favoritesResult.value.cards || []).map(item => String(item.card)));
      window.__deckitFavoriteCount = favoritesResult.value.favorite_card_count || 0;
      favoritesLoaded = true;
    }
    if (coverLimit && deckList && deckResult.status === "fulfilled") {
      const visibleDecks = coverLimit === true ? decks : decks.slice(0, coverLimit);
      const ids = Array.from(new Set(visibleDecks.flatMap(deck => (deck.cards || []).slice(0, 1).map(card => String(card.id)))));
      const loadedCards = (await Promise.all(ids.map(id => API.cardById(id).catch(() => null)))).filter(Boolean);
      cards = [...loadedCards, ...cards.filter(card => !loadedCards.some(remote => remote.id === card.id))];
    }
    return !deckList || deckResult.status === "fulfilled";
  }

  async function loadApiFavorites() {
    if (!API?.session || favoritesLoaded) return;
    const result = await API.getFavorites();
    favoriteIds = new Set((result.cards || []).map(item => String(item.card)));
    window.__deckitFavoriteCount = result.favorite_card_count || 0;
    favoritesLoaded = true;
  }

  async function loadPageApiData() {
    if (!API?.session) return false;
    if ($(".card-search-form")) return true;
    if ($("#deck-card-list")) { await renderDeckPage(); return true; }
    if ($("#create-deck-form")) {
      const editId = new URLSearchParams(location.search).get("edit");
      if (editId) {
        try {
          const deck = await API.getDeck(editId);
          await loadDeckCards(deck);
          decks = [...decks.filter(item => String(item.id) !== String(deck.id)), deck];
        } catch (error) {
          const hint = $(".builder-heading span");
          if (hint) { hint.textContent = error.message || "Não foi possível carregar este deck."; hint.hidden = false; }
        }
      }
      renderCreatePage();
      return true;
    }
    const profile = Boolean($(".account-stats"));
    const deckListPage = document.body.classList.contains("decks-document");
    const homePage = Boolean($(".deck-list"));
    if (!profile && !deckListPage && !homePage) return true;
    collectionState = "loading";
    renderHome();
    renderDeckList();
    updateAccountStats();
    const loaded = await restoreApiData({
      deckList: profile || deckListPage || homePage,
      coverLimit: deckListPage ? true : homePage ? 2 : 0,
      stats: profile,
      favorites: profile
    });
    if (!API.session) return false;
    collectionState = loaded ? "ready" : "error";
    renderHome();
    renderDeckList();
    updateAccountStats();
    return loaded;
  }

  function updateAccountStats() {
    const stats = $(".account-stats");
    if (!stats) return;
    stats.setAttribute("aria-busy", String(collectionState === "loading"));
    if (collectionState !== "ready") {
      stats.querySelectorAll("[data-profile-stat]").forEach(value => {
        value.innerHTML = collectionState === "loading"
          ? spinner + '<span class="sr-only">' + translateValue("Carregando estatísticas…") + '</span>'
          : "—";
      });
      return;
    }
    const deckCount = $('[data-profile-stat="decks"]', stats);
    const cardCount = $('[data-profile-stat="cards"]', stats);
    const mostUsedField = $('[data-profile-stat="most-used"]', stats);
    const favoriteCount = $('[data-profile-stat="favorites"]', stats);
    const localUsage = new Map();
    decks.forEach(deck => (deck.cards || []).forEach(item => {
      const id = String(item.id);
      localUsage.set(id, (localUsage.get(id) || 0) + (Number(item.quantity) || 0));
    }));
    const localMostUsedId = Array.from(localUsage.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const localMostUsed = localMostUsedId ? getCard(localMostUsedId) : null;
    if (deckCount) deckCount.textContent = String(decks.length);
    if (cardCount) cardCount.textContent = String(apiStats ? apiStats.total_cards_used : decks.reduce((sum, deck) => sum + totalCards(deck), 0));
    const remoteMostUsed = apiStats && apiStats.most_used_card;
    if (mostUsedField) mostUsedField.textContent = remoteMostUsed ? remoteMostUsed.card__name : (localMostUsed ? localMostUsed.name : "—");
    if (favoriteCount) favoriteCount.textContent = String(apiMode ? (window.__deckitFavoriteCount || favoriteIds.size) : 0);
  }

  async function queryCards(query, filters = {}, page = 1) {
    if (!query.trim() && !Object.entries(filters).some(([key, value]) => key !== "deck_section" && String(value).trim())) {
      return { results: [], count: 0, next: null };
    }
    if (!API) return { results: cards.filter(card => card.name.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR"))), count: cards.length, next: null };
    const payload = await API.searchCards(query.trim(), filters, page);
    const results = payload.results || [];
    cards = [...results, ...cards.filter(card => !results.some(remote => remote.id === card.id))];
    return payload;
  }

  async function loadDeckCards(deck) {
    const entries = deck.cards || [];
    const loaded = await Promise.all(entries.map(async entry => {
      const current = getCard(entry.id);
      if (current?.desc !== undefined && (current.small_image_url || current.thumbnail)) return null;
      return API.cardById(entry.id).catch(() => null);
    }));
    const refreshed = loaded.filter(Boolean);
    cards = [...refreshed, ...cards.filter(card => !refreshed.some(item => item.id === card.id))];
  }

  async function syncDeckCardChanges(deckId, before, after) {
    const entryKey = item => (item.section || "main") + ":" + String(item.id);
    const beforeMap = new Map(before.map(item => [entryKey(item), item]));
    const afterMap = new Map(after.map(item => [entryKey(item), item]));
    const operations = [];
    for (const key of new Set([...beforeMap.keys(), ...afterMap.keys()])) {
      const oldEntry = beforeMap.get(key);
      const newEntry = afterMap.get(key);
      const id = String(oldEntry?.id || newEntry?.id);
      const oldQty = Number(oldEntry?.quantity) || 0;
      const newQty = Number(newEntry?.quantity) || 0;
      const oldSection = oldEntry?.section || "main";
      const newSection = newEntry?.section || "main";
      const queueQuantity = (kind, quantity, section) => {
        let remaining = quantity;
        while (remaining > 0) {
          const amount = Math.min(3, remaining);
          operations.push(kind === "add"
            ? API.addCard({ deck: deckId, card: id, card_quantity: amount, section })
            : API.removeCard({ deck: deckId, card: id, card_quantity: amount, section }));
          remaining -= amount;
        }
      };
      if (oldQty && newQty && oldSection !== newSection) {
        queueQuantity("remove", oldQty, oldSection);
        queueQuantity("add", newQty, newSection);
      } else if (newQty > oldQty) {
        queueQuantity("add", newQty - oldQty, newSection);
      } else if (oldQty > newQty) {
        queueQuantity("remove", oldQty - newQty, oldSection);
      }
    }
    for (let index = 0; index < operations.length; index += 1) await operations[index];
  }

  async function toggleFavorite(cardId) {
    if (!API || !API.session) {
      location.href = "account.html";
      return;
    }
    const id = String(cardId);
    const wasFavorite = favoriteIds.has(id);
    try {
      if (favoriteIds.has(id)) {
        await API.removeFavorite(id);
        favoriteIds.delete(id);
      } else {
        await API.addFavorite(id);
        favoriteIds.add(id);
      }
      const result = await API.getFavorites();
      favoritesLoaded = true;
      window.__deckitFavoriteCount = result.favorite_card_count || 0;
      favoriteIds = new Set((result.cards || []).map(item => String(item.card)));
    } catch (error) {
      if (wasFavorite) favoriteIds.add(id); else favoriteIds.delete(id);
      window.__deckitFavoriteCount = favoriteIds.size;
      throw error;
    }
    updateAccountStats();
  }

  function setupAccountAuth() {
    const panel = $("#auth-panel");
    const content = $("#account-content");
    if (!panel || !content) return;
    const form = $("#auth-form");
    const emailRow = $("#auth-email-row");
    const emailInput = $("#auth-email");
    const title = $("#auth-title");
    const description = $("#auth-description");
    const submit = $("#auth-submit");
    const toggle = $("#auth-mode-toggle");
    const message = $("#auth-message");
    const logout = $("#logout-button");
    let registerMode = false;

    function showState(isAuthenticated) {
      panel.hidden = isAuthenticated;
      content.hidden = !isAuthenticated;
      if (isAuthenticated && API?.session?.user) {
        const user = API.session.user;
        const username = user.username || "Usuário DeckIt";
        const email = user.email || "";
        const profileName = $("#profile-name");
        const accountName = $("#account-name");
        const profileEmail = $("#profile-email");
        const accountEmail = $("#account-email");
        if (profileName) profileName.textContent = username;
        if (accountName) accountName.textContent = username;
        if (profileEmail) profileEmail.textContent = email;
        if (accountEmail) accountEmail.textContent = email || "—";
        const avatar = $(".avatar");
        if (avatar) avatar.textContent = username.slice(0, 2).toLocaleUpperCase();
        const note = $("#account-note");
        if (note) note.hidden = true;
      }
    }
    function updateMode() {
      if (title) title.textContent = registerMode ? "Criar sua conta" : "Entrar na sua conta";
      if (description) description.textContent = registerMode ? "Crie uma conta para sincronizar seus decks e favoritos." : "Entre para sincronizar seus decks e favoritos.";
      if (submit) submit.textContent = registerMode ? "Criar conta" : "Entrar";
      if (toggle) toggle.textContent = registerMode ? "Já tenho uma conta" : "Criar conta";
      if (emailRow) emailRow.hidden = !registerMode;
      if (emailInput) emailInput.required = registerMode;
    }
    updateMode();
    showState(Boolean(API?.session));
    if (toggle) toggle.addEventListener("click", () => { registerMode = !registerMode; updateMode(); });
    if (form) form.addEventListener("submit", async event => {
      event.preventDefault();
      const username = $("#auth-username")?.value.trim();
      const password = $("#auth-password")?.value;
      const email = emailInput?.value.trim();
      if (!API) return;
      if (submit) setButtonBusy(submit, true);
      if (message) { message.hidden = true; message.textContent = ""; }
      try {
        if (registerMode) await API.register({ username, email, password });
        else await API.login(username, password);
        const loaded = await loadPageApiData();
        if (!loaded) throw new Error("A conta foi autenticada, mas não foi possível carregar seus dados.");
        showState(true);
        alert(translateValue(registerMode ? "Conta criada com sucesso." : "Login realizado com sucesso."));
        renderHome(); renderDeckList(); updateAccountStats();
      } catch (error) {
        if (message) { message.textContent = error.message || "Não foi possível entrar."; message.hidden = false; }
      } finally { if (submit) setButtonBusy(submit, false); }
    });
    if (logout) logout.addEventListener("click", async () => {
      setButtonBusy(logout, true);
      try {
        if (API) await API.logout().catch(() => {});
      } finally { setButtonBusy(logout, false); }
      collectionState = "ready";
      apiMode = false; decks = []; favoritesLoaded = false; favoriteIds.clear(); apiStats = null;
      showState(false); renderHome(); renderDeckList(); updateAccountStats();
    });
  }

  function setButtonBusy(button, busy) {
    button.disabled = busy;
    if (busy) button.setAttribute("aria-busy", "true");
    else button.removeAttribute("aria-busy");
  }

  function loadDecks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const userDecks = parsed.filter(deck => !demoDeckIds.has(String(deck.id)));
          if (userDecks.length !== parsed.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(userDecks));
          return userDecks;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.warn("Não foi possível acessar os decks locais.", error);
    }
    return [];
  }

  let decks = [];

  function saveDecks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
      return true;
    } catch (error) {
      alert(translateValue("Não foi possível salvar os decks neste navegador."));
      return false;
    }
  }

  async function deleteDeckById(id) {
    if (!confirm(translateValue("Tem certeza de que deseja excluir este deck?"))) return false;
    try {
      if (apiMode) await API.deleteDeck(id);
      decks = decks.filter(deck => String(deck.id) !== String(id));
      if (!apiMode && !saveDecks()) { decks = loadDecks(); return false; }
      alert(translateValue("Deck excluído com sucesso."));
      updateAccountStats();
      renderHome();
      renderDeckList();
      return true;
    } catch (error) {
      alert(error.message || "Não foi possível excluir o deck.");
      return false;
    }
  }

  async function openCardPreview(id) {
    let card = getCard(id);
    if (API && card && card.desc === undefined) {
      const loaded = await API.cardById(id);
      if (!loaded) throw new Error("Não foi possível carregar os detalhes da carta.");
      cards = [loaded, ...cards.filter(item => item.id !== String(id))];
      card = loaded;
    }
    if (!card) return;
    let dialog = document.querySelector('.card-preview-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'card-preview-dialog';
      dialog.setAttribute('aria-labelledby', 'card-preview-title');
      document.body.append(dialog);
      dialog.addEventListener('keydown', event => {
        if (event.key === 'Tab') {
          event.preventDefault();
          dialog.querySelector('[data-close-preview]').focus();
        }
      });
      dialog.addEventListener('click', event => {
        if (event.target.closest('[data-close-preview]')) dialog.close();
        if (event.target === dialog) {
          const bounds = dialog.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
        }
      });
      dialog.addEventListener('close', () => {
        document.body.classList.remove('card-preview-open');
        dialog.replaceChildren();
      });
    }
    const fields = [['ID', card.id], ['Tipo', card.type], ['Atributo', card.attribute], ['Raça', card.race], ['Nível', card.level], ['ATK', card.atk], ['DEF', card.defense ?? card.def], ['Moldura', card.frameType]];
    dialog.innerHTML = '<button type="button" class="card-preview-close" data-close-preview autofocus aria-label="' + (currentLanguage === 'en' ? 'Close' : 'Fechar') + '">×</button>' +
      '<div class="card-preview-layout"><div class="card-preview-art"><img alt="' + escapeHtml(card.name) + '" width="421" height="614"><p hidden role="status">' + (currentLanguage === 'en' ? 'Image unavailable.' : 'Imagem indisponível.') + '</p></div>' +
      '<section class="card-preview-details"><h2 id="card-preview-title">' + escapeHtml(card.name) + '</h2><dl>' + fields.filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value]) => '<div><dt>' + escapeHtml(translateValue(label)) + '</dt><dd>' + escapeHtml(String(value)) + '</dd></div>').join('') + '</dl><p class="card-preview-description">' + escapeHtml(card.desc || card.description || (currentLanguage === 'en' ? 'No description available.' : 'Descrição indisponível.')) + '</p></section></div>';
    const image = dialog.querySelector('img');
    image.onerror = () => { image.hidden = true; dialog.querySelector('[role="status"]').hidden = false; };
    image.src = card.image_url || card.image;
    document.body.classList.add('card-preview-open');
    dialog.showModal();
  }

  function thumbnailImage(card) {
    if (!card) return '<span class="empty-deck-art" aria-hidden="true"></span>';
    return '<img src="' + escapeHtml(card.small_image_url || card.thumbnail || card.image) + '" alt="" width="421" height="614">';
  }

  function deckCoverImage(card) {
    const fallback = "assets/cards/46986414.jpg";
    const source = card?.small_image_url || card?.thumbnail || card?.image || fallback;
    return '<img src="' + escapeHtml(source) + '" alt="" width="421" height="614" onerror="this.onerror=null;this.src=&quot;' + fallback + '&quot;">';
  }

  function thumbnailButton(card) {
    return '<button type="button" class="card-preview-button thumbnail-trigger" data-preview-card="' + escapeHtml(card.id) +
      '" aria-haspopup="dialog" aria-label="' + escapeHtml(card.name) + '">' + thumbnailImage(card) + '</button>';
  }

  function showDeckListStatus(list) {
    const loading = collectionState === "loading";
    list.setAttribute("aria-busy", String(loading));
    if (API?.session && collectionState === "ready") return false;
    const row = document.createElement(list.tagName === "UL" ? "li" : "div");
    row.className = "deck-list-status";
    row.setAttribute("role", "status");
    if (loading) row.innerHTML = spinner;
    row.append(translateValue(!API?.session ? "Entre na sua conta para ver seus decks." : loading ? "Carregando decks…" : "Não foi possível carregar os decks."));
    list.replaceChildren(row);
    return true;
  }

  function renderHome() {
    const list = $(".deck-list");
    if (!list || showDeckListStatus(list)) return;
    list.innerHTML = decks.slice(0, 2).map(deck => {
      const first = getCard(deck.cards[0] && deck.cards[0].id);
      return '<div class="deck">' + deckCoverImage(first) + '<a class="deck-link" href="deck.html?id=' + encodeURIComponent(deck.id) + '">' +
        '<span class="deck-info"><strong>' + escapeHtml(deck.name) + '</strong><span>' + totalCards(deck) + ' cartas</span></span>' +
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg></a></div>';
    }).join("") || '<div class="deck empty-deck-card"><span class="empty-deck-art" aria-hidden="true"></span><span class="deck-info"><strong>Você ainda não criou decks.</strong><span>Seus decks aparecerão aqui.</span></span></div>';
    applyLanguage();
  }

  function renderDeckList() {
    const list = $("#user-decks") || $(".decks-grid");
    if (!list || !document.body.classList.contains("decks-document")) return;
    const count = $(".deck-count");
    if (showDeckListStatus(list)) {
      if (count) count.textContent = "";
      return;
    }
    const search = ($("#deck-search")?.value || "").trim().toLocaleLowerCase("pt-BR");
    const sort = $("#deck-sort")?.value || "name";
    let visible = decks.filter(deck => deck.name.toLocaleLowerCase("pt-BR").includes(search));
    visible.sort((a, b) => sort === "updated"
      ? (b.updatedAt || 0) - (a.updatedAt || 0)
      : a.name.localeCompare(b.name, "pt-BR"));
    if (count) count.textContent = decks.length + (decks.length === 1 ? " deck" : " decks");
    list.innerHTML = visible.map(deck => {
      const first = getCard(deck.cards[0] && deck.cards[0].id);
      return '<li><article class="collection-deck"><button class="delete-deck-icon" type="button" data-delete-deck="' + escapeHtml(deck.id) + '" aria-label="Excluir deck" title="Excluir deck">×</button><div class="deck-cover">' + deckCoverImage(first) + '</div><div class="collection-info"><h3>' + escapeHtml(deck.name) +
        '</h3><p>' + totalCards(deck) + ' cartas</p><a class="open-deck" href="deck.html?id=' +
        encodeURIComponent(deck.id) + '">Abrir deck</a></div></article></li>';
    }).join("") || '<li class="empty-decks">' + (decks.length ? 'Nenhum deck encontrado.' : 'Você ainda não criou decks.') + '</li>';
    list.onclick = async event => {
      const button = event.target.closest("[data-delete-deck]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      setButtonBusy(button, true);
      if (!await deleteDeckById(button.getAttribute("data-delete-deck"))) setButtonBusy(button, false);
    };
    applyLanguage();
  }

  function thumbnailName(name) {
    const characters = Array.from(name);
    const label = characters.length > 24 ? characters.slice(0, 21).join("").trimEnd() + "..." : name;
    return '<span class="thumbnail-name" title="' + escapeHtml(name) + '">' + escapeHtml(label) + '</span>';
  }

  function resultCardMarkup(card, includeAddButton) {
    const action = includeAddButton
      ? '<div class="card-add-controls"><label>Qtd.<select data-add-quantity><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label><button type="button" data-add-card="' + card.id + '">Adicionar ao deck</button></div>'
      : '<button class="favorite-card-button" type="button" data-favorite-card="' + card.id + '" aria-pressed="' + favoriteIds.has(card.id) + '">' + (favoriteIds.has(card.id) ? '♥' : '♡') + '</button>';
    const thumbnail = card.small_image_url || card.thumbnail;
    const image = thumbnail ? '<img src="' + escapeHtml(thumbnail) + '" alt="" width="421" height="614" loading="lazy" decoding="async">' : '<span class="card-thumbnail-placeholder" aria-hidden="true">◇</span>';
    const preview = '<button class="card-preview-button" type="button" data-preview-card="' + escapeHtml(card.id) + '" aria-haspopup="dialog" aria-label="' + escapeHtml(card.name) + '">' + image + thumbnailName(card.name) + '</button>';
    return '<li><figure class="' + (includeAddButton ? 'builder-card' : 'search-card') + '" data-card-id="' + escapeHtml(card.id) + '">' + preview + action + '</figure></li>';
  }

  async function favoriteCards(section) {
    const result = await API.getFavorites({ deck_section: section });
    const ids = (result.cards || []).map(item => String(item.card));
    const results = [];
    for (let offset = 0; offset < ids.length; offset += 8) {
      const batch = await Promise.all(ids.slice(offset, offset + 8).map(id => API.cardById(id)));
      results.push(...batch.filter(Boolean));
    }
    const loaded = new Set(results.map(card => card.id));
    cards = [...results, ...cards.filter(card => !loaded.has(card.id))];
    return { results, count: results.length, next: null };
  }

  async function renderFavoritesPage() {
    const list = $("#favorite-results");
    if (!list) return;
    const status = $("#favorites-status");
    if (!API?.session) {
      location.replace("account.html");
      return;
    }
    try {
      const { results } = await favoriteCards();
      list.innerHTML = results.map(card => resultCardMarkup(card, false)).join("");
      status.textContent = results.length ? "" : translateValue("Nenhuma carta favorita.");
    } catch (error) { status.textContent = error.message || translateValue("Não foi possível carregar os favoritos."); }
  }

  async function renderSearchResults(query, target, includeAddButton, filterForm = null, page = 1, append = false) {
    if (!target) return;
    const normalized = query.trim();
    const requestId = ++cardSearchSequence;
    let payload = { results: [], count: 0, next: null };
    let failure = "";
    const filters = {};
    if (filterForm) new FormData(filterForm).forEach((value, key) => { if (key !== "q" && String(value).trim()) filters[key] = String(value).trim(); });
    if (normalized || Object.keys(filters).length) {
      try {
        const [searchPayload] = await Promise.all([
          queryCards(normalized, filters, page),
          loadApiFavorites().catch(() => {})
        ]);
        payload = searchPayload;
      }
      catch (error) { failure = error.message || "Não foi possível pesquisar cartas na API."; }
    }
    if (requestId !== cardSearchSequence) return;
    const found = payload.results || [];
    const markup = failure
      ? '<li class="search-error">' + escapeHtml(failure) + '</li>'
      : found.map(card => resultCardMarkup(card, includeAddButton)).join("");
    target.innerHTML = append ? target.innerHTML + markup : markup;
    const section = target.closest(".search-results");
    if (section) {
      section.hidden = !(normalized || Object.keys(filters).length);
      const count = $(".results-heading span", section);
      if (count) count.textContent = failure ? "" : (payload.count ?? found.length) + (Number(payload.count ?? found.length) === 1 ? " carta" : " cartas");
      let more = $(".search-load-more", section);
      if (!more) { more = document.createElement("button"); more.type = "button"; more.className = "search-load-more"; more.textContent = "Carregar mais"; section.append(more); }
      more.hidden = !payload.next || Boolean(failure);
      setButtonBusy(more, false);
      more.onclick = async () => {
        setButtonBusy(more, true);
        const nextPage = Number(target.dataset.nextPage || 1) + 1;
        target.dataset.nextPage = String(nextPage);
        await renderSearchResults(normalized, target, includeAddButton, filterForm, nextPage, true);
      };
      if (!append) target.dataset.nextPage = "1";
    }
    applyLanguage();
  }
  function renderCreatePage() {
    const form = $("#create-deck-form");
    if (!form) return;
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");
    const editing = decks.find(deck => deck.id === editId);
    const nameField = $("#deck-name");
    const descriptionField = $("#deck-description");
    if (editing && nameField) {
      nameField.value = editing.name;
      if (descriptionField) descriptionField.value = editing.description || "";
      const heading = $(".create-heading h1");
      if (heading) heading.textContent = "Editar deck";
      const saveButton = $("#save-deck-button");
      if (saveButton) saveButton.textContent = "Salvar alterações";
      const cardChoiceTitle = $("#card-choice-title");
      if (cardChoiceTitle) cardChoiceTitle.textContent = "Adicionar ou editar cartas";
    }

    const selected = new Map();
    if (editing) editing.cards.forEach(item => {
      const section = item.section || "main";
      selected.set(section + ":" + String(item.id), {
        id: String(item.id),
        quantity: Number(item.quantity) || 1,
        section
      });
    });

    const search = $("#builder-search");
    const results = $("#card-search-results");
    const chosen = $("#deck-empty-grid");
    const queryForm = $("#builder-query-form");
    const sectionTabs = Array.from(document.querySelectorAll("[data-deck-section]"));
    const notice = $("#card-added-notice");
    let noticeTimer;
    let activeSection = "main";

    function setActiveSection(section) {
      activeSection = section;
      sectionTabs.forEach(tab => {
        const active = tab.dataset.deckSection === section;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      builderSearchSequence += 1;
      if (results) {
        results.replaceChildren();
        results.hidden = true;
      }
      if (search) search.value = "";
      if (search) search.focus();
      const hint = $(".builder-heading span");
      if (hint) { hint.textContent = ""; hint.hidden = true; }
      loadMoreButton.hidden = true;
      setButtonBusy(loadMoreButton, false);
      renderChosen();
    }

    function renderChosen() {
      if (!chosen) return;
      const entries = Array.from(selected.values()).filter(item => item.section === activeSection);
      const cardsMarkup = entries.length ? entries.map(item => {
        const { id, quantity, section } = item;
        const card = getCard(id);
        if (!card) return "";
        return '<article class="chosen-card" data-selected-card="' + section + ':' + card.id + '">' + thumbnailButton(card) + '<div><strong>' + thumbnailName(card.name) +
          '</strong><label>Qtd. <select data-selected-quantity="' + section + ':' + card.id + '">' +
          [1, 2, 3].map(value => '<option value="' + value + '"' + (quantity === value ? " selected" : "") + '>' + value + '</option>').join("") +
          '</select></label><button type="button" data-remove-card="' + section + ':' + card.id + '">Remover</button></div></article>';
      }).join("") : '<p>Nenhuma carta adicionada à seção ' + translateValue(activeSection === "main" ? "Main" : activeSection === "extra" ? "Extra" : "Side") + '.</p>';
      const saveLabel = editing ? "Salvar alterações" : "Criar deck";
      chosen.innerHTML = '<div class="chosen-card-items">' + cardsMarkup + '</div><div class="deck-grid-actions"><a href="decks.html">Cancelar</a><button id="save-deck-button" type="submit">' + saveLabel + '</button></div>';
      applyLanguage();
    }

    const loadMoreButton = document.createElement("button");
    loadMoreButton.type = "button";
    loadMoreButton.className = "search-load-more";
    loadMoreButton.textContent = "Carregar mais";
    loadMoreButton.hidden = true;
    if (results) results.insertAdjacentElement("afterend", loadMoreButton);

    async function searchCards(page = 1, append = false, favoritesOnly = false) {
      if (!results) return;
      const query = (search && search.value || "").trim();
      const requestId = ++builderSearchSequence;
      let payload = { results: [], count: 0, next: null };
      let failure = "";
      const filters = Object.fromEntries(Array.from(new FormData(queryForm), ([key, value]) => [key, value.trim()]).filter(([, value]) => value));
      filters.deck_section = activeSection;
      const hasSearchFilters = Object.keys(filters).some(key => key !== "deck_section");
      const showResults = Boolean(query || favoritesOnly || hasSearchFilters);
      if (showResults) {
        try { payload = favoritesOnly ? await favoriteCards(activeSection) : await queryCards(query, filters, page); }
        catch (error) { failure = error.message || "Não foi possível pesquisar cartas na API."; }
      }
      if (requestId !== builderSearchSequence) return;
      const found = payload.results || [];
      const existingIds = append
        ? new Set(Array.from(results.querySelectorAll("[data-card-id]")).map(card => card.getAttribute("data-card-id")))
        : new Set();
      const markup = found.filter(card => !existingIds.has(String(card.id))).map(card => resultCardMarkup(card, true)).join("");
      if (failure) {
        if (append) results.insertAdjacentHTML("beforeend", '<li class="search-error">' + escapeHtml(failure) + '</li>');
        else results.innerHTML = '<li class="search-error">' + escapeHtml(failure) + '</li>';
      } else if (append) results.insertAdjacentHTML("beforeend", markup);
      else results.innerHTML = markup;
      results.hidden = !showResults;
      const hint = $(".builder-heading span");
      const count = payload.count ?? found.length;
      if (hint) {
        hint.textContent = failure || (favoritesOnly && !count ? translateValue("Nenhuma carta favorita.") : showResults ? count + (count === 1 ? " carta encontrada" : " cartas encontradas") : "");
        hint.hidden = !showResults;
      }
      loadMoreButton.hidden = !showResults || !payload.next || Boolean(failure);
      setButtonBusy(loadMoreButton, false);
      loadMoreButton.dataset.nextPage = String(page + 1);
      applyLanguage();
    }

    loadMoreButton.addEventListener("click", async () => {
      const nextPage = Number(loadMoreButton.dataset.nextPage || 2);
      setButtonBusy(loadMoreButton, true);
      await searchCards(nextPage, true);
    });

    const favoritesButton = $("#builder-favorites");
    favoritesButton.addEventListener("click", async () => {
      if (!API?.session) {
        alert(translateValue("Entre na sua conta para ver as cartas favoritas."));
        return;
      }
      clearTimeout(builderSearchTimer);
      search.value = "";
      setButtonBusy(favoritesButton, true);
      try { await searchCards(1, false, true); }
      finally { setButtonBusy(favoritesButton, false); }
    });
    sectionTabs.forEach(tab => tab.addEventListener("click", () => {
      if (tab.dataset.deckSection === activeSection) return;
      setActiveSection(tab.dataset.deckSection);
    }));
    let builderSearchTimer;
    searchCards();
    renderChosen();
    if (search) search.addEventListener("input", () => {
      clearTimeout(builderSearchTimer);
      builderSearchSequence += 1;
      if (!search.value.trim()) { searchCards(); return; }
      builderSearchTimer = setTimeout(searchCards, 2000);
    });
    queryForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!$("#builder-card-filters").hidden) $(".card-search-filter", form).click();
      clearTimeout(builderSearchTimer);
      searchCards();
    });

    form.addEventListener("click", event => {
      const add = event.target.closest("[data-add-card]");
      const remove = event.target.closest("[data-remove-card]");
      if (add) {
        const id = add.getAttribute("data-add-card");
        const quantityField = add.closest(".card-add-controls")?.querySelector("[data-add-quantity]");
        selected.set(activeSection + ":" + id, {
          id,
          quantity: Math.min(3, Math.max(1, Number(quantityField && quantityField.value) || 1)),
          section: activeSection
        });
        renderChosen();
        clearTimeout(noticeTimer);
        notice.textContent = translateValue("Carta adicionada com sucesso.") + " " + getCard(id).name;
        noticeTimer = setTimeout(() => { notice.textContent = ""; }, 3500);
      }
      if (remove) {
        selected.delete(remove.getAttribute("data-remove-card"));
        renderChosen();
      }
    });

    form.addEventListener("change", event => {
      const field = event.target.closest("[data-selected-quantity]");
      if (field) {
        const item = selected.get(field.getAttribute("data-selected-quantity"));
        if (item) selected.set(field.getAttribute("data-selected-quantity"), {
          ...item,
          quantity: Math.min(3, Math.max(1, Number(field.value) || 1))
        });
      }
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      const name = nameField && nameField.value.trim();
      const description = descriptionField ? descriptionField.value.trim() : "";
      if (!name) {
        const infoEditor = $(".deck-info-editor");
        if (infoEditor) infoEditor.open = true;
        if (nameField) nameField.focus();
        return;
      }
      if (!selected.size) {
        alert(translateValue("Adicione pelo menos uma carta ao deck."));
        return;
      }
      const now = Date.now();
      const deck = {
        id: editing ? editing.id : "deck-" + now.toString(36),
        name,
        description,
        cards: Array.from(selected.values()),
        updatedAt: now
      };
      if (apiMode) {
        const submitButton = $("#save-deck-button");
        if (submitButton) setButtonBusy(submitButton, true);
        try {
          let saved;
          if (editing) {
            const updated = await API.editDeck(editing.id, { name, description });
            await syncDeckCardChanges(editing.id, editing.cards, deck.cards);
            saved = await API.getDeck(editing.id).catch(() => ({ ...updated, cards: deck.cards }));
          } else {
            saved = await API.createDeck({ name, description });
            for (const { id: cardId, quantity, section } of selected.values()) {
              let remaining = quantity;
              while (remaining > 0) {
                const amount = Math.min(3, remaining);
                await API.addCard({ deck: saved.id, card: cardId, card_quantity: amount, section });
                remaining -= amount;
              }
            }
          }
          alert(translateValue(editing ? "Alterações salvas." : "Deck criado com sucesso."));
          location.href = "deck.html?id=" + encodeURIComponent(saved.id);
        } catch (error) {
          alert(error.message || "Não foi possível salvar o deck na API.");
          if (submitButton) setButtonBusy(submitButton, false);
        }
        return;
      }
      alert(translateValue("Entre na sua conta para salvar o deck."));
    });
  }

  async function renderDeckPage() {
    const list = $("#deck-card-list");
    if (!list) return;
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (!id) {
      list.innerHTML = '<li class="empty-decks">Nenhum deck selecionado.</li>';
      return;
    }
    let deck = decks.find(item => String(item.id) === id) || null;
    if (apiMode || API?.session) {
      try {
        deck = await API.getDeck(id);
        await loadDeckCards(deck);
        decks = decks.map(item => item.id === deck.id ? deck : item);
      } catch (error) {
        const errorNode = $(".single-deck-page .empty-decks") || list;
        if (errorNode) errorNode.textContent = error.message || "Não foi possível carregar este deck.";
        return;
      }
    }
    if (!deck) return;
    if (API && !apiMode) await loadDeckCards(deck);
    const heading = $(".single-deck-heading h1");
    const total = $(".single-deck-heading > span");
    if (heading) heading.textContent = deck.name;
    if (total) total.textContent = totalCards(deck) + " cartas";
    const descriptionBox = $("#single-deck-description");
    const descriptionText = descriptionBox && $("p", descriptionBox);
    if (descriptionText) descriptionText.textContent = deck.description || "";
    if (descriptionBox) descriptionBox.hidden = !String(deck.description || "").trim();
    const back = $(".single-deck-page .back-link");
    if (back) back.href = "decks.html";
    const addButton = $("#edit-deck-button");
    if (addButton) addButton.onclick = () => {
      location.href = "create-deck.html?edit=" + encodeURIComponent(deck.id);
    };
    const deleteButton = $("#delete-deck-button");
    if (deleteButton) deleteButton.onclick = async () => {
      setButtonBusy(deleteButton, true);
      if (await deleteDeckById(deck.id)) location.href = "decks.html";
      else setButtonBusy(deleteButton, false);
    };
    list.innerHTML = (deck.cards || []).map(item => {
      const card = getCard(item.id);
      if (!card) return "";
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const copiesAcrossSections = (deck.cards || []).filter(entry => String(entry.id) === String(item.id)).reduce((sum, entry) => sum + (Number(entry.quantity) || 0), 0);
      const thumbnail = card.small_image_url || card.thumbnail;
      const fallback = thumbnail ? ' onerror="this.onerror=null;this.src=\'' + escapeHtml(card.image) + '\'"' : '';
      const art = thumbnail ? '<img src="' + escapeHtml(thumbnail) + '"' + fallback + ' alt="' + escapeHtml(card.name) + '" width="421" height="614" loading="lazy" decoding="async">' : '<span class="card-thumbnail-placeholder" aria-hidden="true">◇</span>';
      return '<li><figure class="deck-card" data-card-id="' + card.id + '"><button class="card-preview-button" type="button" data-preview-card="' + card.id + '" aria-haspopup="dialog">' + art + thumbnailName(card.name) +
        '</button><div class="card-quantity" aria-label="Quantidade: ' + quantity + '"><button type="button" data-action="decrease" aria-label="Remover uma cópia">−</button>' +
        '<output data-quantity>' + quantity + '</output><button type="button" data-action="increase" aria-label="Adicionar uma cópia"' + (copiesAcrossSections >= 3 ? ' disabled title="Limite de 3 cópias atingido"' : '') + '>+</button></div></figure></li>';
    }).join("") || '<li class="empty-decks">Este deck ainda não tem cartas.</li>';

    list.onclick = async event => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const item = button.closest("[data-card-id]");
      const cardId = item && item.getAttribute("data-card-id");
      const entry = deck.cards.find(card => String(card.id) === cardId);
      if (!entry) return;
      const copiesAcrossSections = deck.cards.filter(card => String(card.id) === cardId).reduce((sum, card) => sum + (Number(card.quantity) || 0), 0);
      if (button.dataset.action === "increase" && copiesAcrossSections >= 3) return;
      if (apiMode) {
        setButtonBusy(button, true);
        try {
          if (button.dataset.action === "increase") await API.addCard({ deck: deck.id, card: cardId, card_quantity: 1, section: entry.section || "main" });
          else await API.removeCard({ deck: deck.id, card: cardId, card_quantity: 1, section: entry.section || "main" });
          await renderDeckPage();
        } catch (error) { alert(error.message || "Não foi possível atualizar a quantidade."); setButtonBusy(button, false); }
        return;
      }
      if (button.dataset.action === "increase") entry.quantity = Number(entry.quantity || 0) + 1;
      if (button.dataset.action === "decrease") {
        entry.quantity = Number(entry.quantity || 0) - 1;
        if (entry.quantity <= 0) deck.cards = deck.cards.filter(card => String(card.id) !== cardId);
      }
      deck.updatedAt = Date.now();
      saveDecks();
      renderDeckPage();
    };
    applyLanguage();
  }

  function initSettings() {
    const themeKey = "deckit.local.theme";
    const savedTheme = localStorage.getItem(themeKey);
    const theme = ["desert", "dark", "light"].includes(savedTheme) ? savedTheme : "desert";
    document.documentElement.dataset.theme = theme;

    const themeInputs = document.querySelectorAll('input[name="theme"]');
    const syncThemeCards = () => {
      themeInputs.forEach(input => {
        input.checked = input.value === theme;
        const card = input.closest(".option-card");
        if (card) card.classList.toggle("selected", input.checked);
      });
    };
    themeInputs.forEach(input => input.addEventListener("change", () => {
      localStorage.setItem(themeKey, input.value);
      document.documentElement.dataset.theme = input.value;
      themeInputs.forEach(option => {
        const card = option.closest(".option-card");
        if (card) card.classList.toggle("selected", option.checked);
      });
    }));
    syncThemeCards();

    const form = $(".settings-page");
    if (!form) return;
    const languageKey = "deckit.local.language";
    const language = currentLanguage;
    const languageSelect = $("#language");
    if (languageSelect) languageSelect.value = language;
    if (languageSelect) languageSelect.addEventListener("change", () => {
      currentLanguage = ["pt-BR", "en", "es"].includes(languageSelect.value) ? languageSelect.value : "pt-BR";
      localStorage.setItem(languageKey, currentLanguage);
      applyLanguage();
    });
  }

  function init() {
    loadLanguage();
    document.addEventListener("click", async event => {
      const button = event.target.closest("[data-preview-card]");
      if (!button || button.getAttribute("aria-busy") === "true") return;
      button.setAttribute("aria-busy", "true");
      try { await openCardPreview(button.dataset.previewCard); }
      catch (error) { alert(error.message || "Não foi possível carregar os detalhes da carta."); }
      finally { button.removeAttribute("aria-busy"); }
    });
    renderFavoritesPage();
    setupAccountAuth();
    if (!API?.session) {
      if ($("#deck-card-list") || ($("#create-deck-form") && new URLSearchParams(location.search).has("edit"))) {
        location.replace("account.html");
        return;
      }
      renderHome();
      renderDeckList();
      updateAccountStats();
      renderCreatePage();
      renderDeckPage();
    }

    const deckSearch = $("#deck-search");
    const deckSort = $("#deck-sort");
    if (deckSearch) deckSearch.addEventListener("input", renderDeckList);
    if (deckSort) deckSort.addEventListener("change", renderDeckList);

    const searchForm = $(".card-search-form");
    if (searchForm) {
      const input = $("#card-query");
      const results = $("#search-results");
      const filterPanel = $(".card-filter-panel", searchForm);
      const params = new URLSearchParams(location.search);
      if (filterPanel) filterPanel.querySelectorAll("[name]").forEach(field => { if (params.has(field.name)) field.value = params.get(field.name); });
      let searchTimer;
      searchForm.addEventListener("submit", async event => {
        event.preventDefault();
        clearTimeout(searchTimer);
        const submit = searchForm.querySelector('[type="submit"]');
        if (submit.disabled) return;
        setButtonBusy(submit, true);
        try { await renderSearchResults(input ? input.value : "", results, false, searchForm); }
        finally { setButtonBusy(submit, false); }
      });
      if (input) input.addEventListener("input", () => {
        clearTimeout(searchTimer);
        cardSearchSequence += 1;
        if (!input.value.trim()) { renderSearchResults("", results, false, searchForm); return; }
        searchTimer = setTimeout(() => renderSearchResults(input.value, results, false, searchForm), 2000);
      });
      if (input && params.has("q")) input.value = params.get("q") || "";
      if (input && (input.value || Array.from(params.keys()).some(key => key !== "q"))) renderSearchResults(input.value, results, false, searchForm);
    }
    const favoriteGrid = $("#favorite-results") || $("#search-results");
    if (favoriteGrid) favoriteGrid.addEventListener("click", async event => {
        const favoriteButton = event.target.closest("[data-favorite-card]");
        if (!favoriteButton) return;
        setButtonBusy(favoriteButton, true);
        try {
          await toggleFavorite(favoriteButton.getAttribute("data-favorite-card"));
          if (favoriteGrid.id === "favorite-results" && !favoriteIds.has(favoriteButton.dataset.favoriteCard)) {
            favoriteButton.closest("li").remove();
            if (!favoriteGrid.children.length) $("#favorites-status").textContent = translateValue("Nenhuma carta favorita.");
          }
          favoriteButton.setAttribute("aria-pressed", String(favoriteIds.has(favoriteButton.getAttribute("data-favorite-card"))));
          favoriteButton.textContent = favoriteIds.has(favoriteButton.getAttribute("data-favorite-card")) ? "♥" : "♡";
        } catch (error) { alert(error.message || "Não foi possível atualizar os favoritos."); }
        finally { setButtonBusy(favoriteButton, false); }
      });
    document.querySelectorAll(".card-search-filter[aria-controls]").forEach(button => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      function setOpen(open) {
        panel.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
      }
      button.addEventListener("click", () => setOpen(panel.hidden));
      document.addEventListener("click", event => {
        if (!panel.hidden && !panel.contains(event.target) && !button.contains(event.target)) setOpen(false);
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !panel.hidden) {
          setOpen(false);
          button.focus();
        }
      });
    });
    initSettings();

    if (API?.session) loadPageApiData();
  }

  document.addEventListener("DOMContentLoaded", init);
})();














