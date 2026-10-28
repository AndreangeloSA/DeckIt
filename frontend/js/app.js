(() => {
  "use strict";

  const STORAGE_KEY = "deckit.local.decks.v1";
  const cards = [
    { id: "46986414", name: "Dark Magician", image: "assets/cards/46986414.jpg" },
    { id: "89631139", name: "Blue-Eyes White Dragon", image: "assets/cards/89631139.jpg" },
    { id: "74677422", name: "Red-Eyes Black Dragon", image: "assets/cards/74677422.jpg" }
  ];

  const starterDecks = [
    { id: "blue-eyes", name: "Blue-Eyes", cards: [{ id: "89631139", quantity: 3 }, { id: "46986414", quantity: 2 }, { id: "74677422", quantity: 1 }] },
    { id: "dark-magician", name: "Dark Magician", cards: [{ id: "46986414", quantity: 3 }, { id: "89631139", quantity: 1 }] },
    { id: "red-eyes", name: "Red-Eyes", cards: [{ id: "74677422", quantity: 3 }, { id: "46986414", quantity: 1 }] },
    { id: "red-eyes-treino", name: "Red-Eyes — Treino", cards: [{ id: "74677422", quantity: 2 }, { id: "89631139", quantity: 1 }] }
  ];

  const LANGUAGE_KEY = "deckit.local.language";
  const translations = {
    en: {
      "DeckIt — Início": "DeckIt — Home", "DeckIt — Todos os seus decks": "DeckIt — All your decks",
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
      "Perfil": "Profile", "Decks": "Decks", "Ajustes": "Settings", "Navegação principal": "Main navigation",
      "Pesquisar cartas pelo nome": "Search cards by name", "Pesquisar decks": "Search decks",
      "Criar deck": "Create deck", "Editar deck": "Edit deck", "Editar informações do deck": "Edit deck details", "Informações do deck": "Deck details", "Salvar deck": "Save deck",
      "Salvar alterações": "Save changes", "Cancelar": "Cancel", "Cartas adicionadas ao deck": "Cards added to the deck",
      "Cartas de exemplo": "Sample cards", "Adicionar carta": "Add card", "Adicionar cartas ao deck": "Add cards to the deck",
      "Adicionar ao deck": "Add to deck", "Quantidade": "Quantity", "Remover": "Remove",
      "As cartas adicionadas aparecerão aqui.": "Cards you add will appear here.", "Pesquise para ver cartas": "Search to see cards",
      "carta encontrada": "card found", "cartas encontradas": "cards found", "Abrir deck": "Open deck",
      "Você ainda não criou decks.": "You have not created any decks yet.", "Nenhum deck encontrado.": "No decks found.",
      "Este deck ainda não tem cartas.": "This deck does not have any cards yet.", "Não foi possível salvar os decks neste navegador.": "Could not save decks in this browser.",
      "Adicione pelo menos uma carta ao deck.": "Add at least one card to the deck.", "Todos os decks": "All decks"
    },
    es: {
      "DeckIt — Início": "DeckIt — Inicio", "DeckIt — Todos os seus decks": "DeckIt — Todos tus mazos",
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
      "Nome da carta": "Nombre de la carta", "Cartas": "Cartas", "Perfil": "Perfil", "Decks": "Mazos", "Ajustes": "Ajustes",
      "Navegação principal": "Navegación principal", "Pesquisar cartas pelo nome": "Buscar cartas por nombre", "Pesquisar decks": "Buscar mazos",
      "Editar deck": "Editar mazo", "Editar informações do deck": "Editar información del mazo", "Informações do deck": "Información del mazo", "Salvar deck": "Guardar mazo", "Salvar alterações": "Guardar cambios", "Cancelar": "Cancelar",
      "Cartas adicionadas ao deck": "Cartas añadidas al mazo", "Cartas de exemplo": "Cartas de ejemplo", "Adicionar carta": "Añadir carta",
      "Adicionar cartas ao deck": "Añadir cartas al mazo", "Adicionar ao deck": "Añadir al mazo", "Quantidade": "Cantidad", "Remover": "Quitar",
      "As cartas adicionadas aparecerão aqui.": "Las cartas añadidas aparecerán aquí.", "Pesquise para ver cartas": "Busca para ver cartas",
      "carta encontrada": "carta encontrada", "cartas encontradas": "cartas encontradas", "Abrir deck": "Abrir mazo",
      "Você ainda não criou decks.": "Todavía no has creado mazos.", "Nenhum deck encontrado.": "No se encontraron mazos.",
      "Este deck ainda não tem cartas.": "Este mazo todavía no tiene cartas.", "Não foi possível salvar os decks neste navegador.": "No se pudieron guardar los mazos en este navegador.",
      "Adicione pelo menos uma carta ao deck.": "Añade al menos una carta al mazo."
    }
  };
  Object.assign(translations.en, {
    "Qtd.": "Qty.", "Nome da carta...": "Card name...", "Pesquisar cartas pelo nome...": "Search cards by name...",
    "Ex.: Dragões de olhos azuis": "e.g. Blue-Eyes Dragons", "Descrição": "Description", "Descreva seu deck...": "Describe your deck..."
  });
  Object.assign(translations.es, {
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

  function loadDecks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starterDecks));
    } catch (error) {
      console.warn("Não foi possível acessar os decks locais.", error);
    }
    return starterDecks.map(deck => ({ ...deck, cards: deck.cards.map(card => ({ ...card })) }));
  }

  let decks = loadDecks();

  function saveDecks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
      return true;
    } catch (error) {
      alert(translateValue("Não foi possível salvar os decks neste navegador."));
      return false;
    }
  }

  function cardImage(id) {
    const card = getCard(id);
    return card ? card.image : "assets/cards/" + encodeURIComponent(id) + ".jpg";
  }

  function renderHome() {
    const list = $(".deck-list");
    if (!list) return;
    list.innerHTML = decks.slice(0, 2).map(deck => {
      const first = getCard(deck.cards[0] && deck.cards[0].id);
      return '<a class="deck deck-link" href="deck.html?id=' + encodeURIComponent(deck.id) + '">' +
        '<img src="' + escapeHtml(first ? first.image : cardImage("46986414")) + '" alt="" width="421" height="614">' +
        '<span class="deck-info"><strong>' + escapeHtml(deck.name) + '</strong><span>' + totalCards(deck) + ' cartas</span></span>' +
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg></a>';
    }).join("") || '<p class="empty-message">Você ainda não criou decks.</p>';
    applyLanguage();
  }

  function renderDeckList() {
    const list = $("#user-decks") || $(".decks-grid");
    if (!list || !document.body.classList.contains("decks-document")) return;
    const search = ($("#deck-search")?.value || "").trim().toLocaleLowerCase("pt-BR");
    const sort = $("#deck-sort")?.value || "name";
    let visible = decks.filter(deck => deck.name.toLocaleLowerCase("pt-BR").includes(search));
    visible.sort((a, b) => sort === "updated"
      ? (b.updatedAt || 0) - (a.updatedAt || 0)
      : a.name.localeCompare(b.name, "pt-BR"));
    const count = $(".deck-count");
    if (count) count.textContent = decks.length + (decks.length === 1 ? " deck" : " decks");
    list.innerHTML = visible.map(deck => {
      const first = getCard(deck.cards[0] && deck.cards[0].id);
      return '<li><article class="collection-deck"><div class="deck-cover"><img src="' +
        escapeHtml(first ? first.image : cardImage("46986414")) + '" alt="' + escapeHtml(first ? first.name : "Carta") +
        '" width="421" height="614"></div><div class="collection-info"><h3>' + escapeHtml(deck.name) +
        '</h3><p>' + totalCards(deck) + ' cartas</p><a class="open-deck" href="deck.html?id=' +
        encodeURIComponent(deck.id) + '">Abrir deck</a></div></article></li>';
    }).join("") || '<li class="empty-decks">Nenhum deck encontrado.</li>';
    applyLanguage();
  }

  function renderSearchResults(query, target, includeAddButton) {
    if (!target) return;
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const found = normalized ? cards.filter(card => card.name.toLocaleLowerCase("pt-BR").includes(normalized)) : [];
    target.innerHTML = found.map(card => {
      const action = includeAddButton
        ? '<div class="card-add-controls"><label>Qtd.<select data-add-quantity aria-label="Quantidade de ' + escapeHtml(card.name) + '">' +
          '<option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label>' +
          '<button type="button" data-add-card="' + card.id + '">Adicionar ao deck</button></div>'
        : '';
      return '<li><figure class="' + (includeAddButton ? 'builder-card' : 'search-card') + '" data-card-id="' + card.id + '">' +
        '<img src="' + escapeHtml(card.image) + '" alt="' + escapeHtml(card.name) + '" width="421" height="614">' +
        (includeAddButton ? '<h3>' : '<figcaption>') + escapeHtml(card.name) +
        (includeAddButton ? '</h3>' : '</figcaption>') + action + '</figure></li>';
    }).join("");
    const section = target.closest(".search-results");
    if (section) {
      section.hidden = !normalized;
      const count = $(".results-heading span", section);
      if (count) count.textContent = found.length + (found.length === 1 ? " carta" : " cartas");
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
    }

    const selected = new Map();
    if (editing) editing.cards.forEach(item => selected.set(String(item.id), Number(item.quantity) || 1));

    const search = $("#builder-search");
    const results = $("#card-search-results");
    const chosen = $("#deck-empty-grid");
    const addSearchButton = $("#search-cards-button");

    function renderChosen() {
      if (!chosen) return;
      const entries = Array.from(selected.entries());
      chosen.innerHTML = entries.length ? entries.map(([id, quantity]) => {
        const card = getCard(id);
        if (!card) return "";
        return '<article class="chosen-card" data-selected-card="' + card.id + '"><img src="' + escapeHtml(card.image) +
          '" alt="' + escapeHtml(card.name) + '" width="421" height="614"><div><strong>' + escapeHtml(card.name) +
          '</strong><label>Qtd. <select data-selected-quantity="' + card.id + '">' +
          [1, 2, 3].map(value => '<option value="' + value + '"' + (quantity === value ? " selected" : "") + '>' + value + '</option>').join("") +
          '</select></label><button type="button" data-remove-card="' + card.id + '">Remover</button></div></article>';
      }).join("") : '<p>As cartas adicionadas aparecerão aqui.</p>';
      applyLanguage();
    }

    function searchCards() {
      if (!results) return;
      const query = (search && search.value || "").trim().toLocaleLowerCase("pt-BR");
      const found = query ? cards.filter(card => card.name.toLocaleLowerCase("pt-BR").includes(query)) : [];
      results.innerHTML = found.map(card => '<li><article class="builder-card" data-card-id="' + card.id +
        '"><img src="' + escapeHtml(card.image) + '" alt="' + escapeHtml(card.name) + '" width="421" height="614"><h3>' +
        escapeHtml(card.name) + '</h3><div class="card-add-controls"><label>Qtd.<select data-add-quantity>' +
        '<option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label>' +
        '<button type="button" data-add-card="' + card.id + '">Adicionar ao deck</button></div></article></li>').join("");
      results.hidden = !query;
      const hint = $(".builder-heading span");
      if (hint) {
        hint.textContent = query ? found.length + (found.length === 1 ? " carta encontrada" : " cartas encontradas") : "";
        hint.hidden = !query;
      }
      applyLanguage();
    }

    searchCards();
    renderChosen();
    if (search) search.addEventListener("input", searchCards);
    if (addSearchButton) addSearchButton.addEventListener("click", searchCards);

    form.addEventListener("click", event => {
      const add = event.target.closest("[data-add-card]");
      const remove = event.target.closest("[data-remove-card]");
      if (add) {
        const id = add.getAttribute("data-add-card");
        const quantityField = add.closest(".card-add-controls")?.querySelector("[data-add-quantity]");
        selected.set(id, Math.min(3, Math.max(1, Number(quantityField && quantityField.value) || 1)));
        renderChosen();
      }
      if (remove) {
        selected.delete(remove.getAttribute("data-remove-card"));
        renderChosen();
      }
    });

    form.addEventListener("change", event => {
      const field = event.target.closest("[data-selected-quantity]");
      if (field) selected.set(field.getAttribute("data-selected-quantity"), Math.min(3, Math.max(1, Number(field.value) || 1)));
    });

    form.addEventListener("submit", event => {
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
        cards: Array.from(selected, ([id, quantity]) => ({ id, quantity })),
        updatedAt: now
      };
      if (editing) decks = decks.map(item => item.id === editing.id ? deck : item);
      else decks.push(deck);
      if (saveDecks()) location.href = "deck.html?id=" + encodeURIComponent(deck.id);
    });
  }

  function renderDeckPage() {
    const list = $("#deck-card-list");
    if (!list) return;
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "blue-eyes";
    const deck = decks.find(item => item.id === id) || decks[0];
    if (!deck) return;
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
    const addButton = $("#add-card-button");
    if (addButton) addButton.addEventListener("click", () => {
      location.href = "create-deck.html?edit=" + encodeURIComponent(deck.id);
    });
    list.innerHTML = (deck.cards || []).map(item => {
      const card = getCard(item.id);
      if (!card) return "";
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return '<li><figure class="deck-card" data-card-id="' + card.id + '"><img src="' + escapeHtml(card.image) +
        '" alt="Carta ' + escapeHtml(card.name) + '" width="421" height="614"><figcaption>' + escapeHtml(card.name) +
        '</figcaption><div class="card-quantity" aria-label="Quantidade: ' + quantity + '"><button type="button" data-action="decrease" aria-label="Remover uma cópia">−</button>' +
        '<output data-quantity>' + quantity + '</output><button type="button" data-action="increase" aria-label="Adicionar uma cópia">+</button></div></figure></li>';
    }).join("") || '<li class="empty-decks">Este deck ainda não tem cartas.</li>';

    list.addEventListener("click", event => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const item = button.closest("[data-card-id]");
      const cardId = item && item.getAttribute("data-card-id");
      const entry = deck.cards.find(card => String(card.id) === cardId);
      if (!entry) return;
      if (button.dataset.action === "increase") entry.quantity = Number(entry.quantity || 0) + 1;
      if (button.dataset.action === "decrease") {
        entry.quantity = Number(entry.quantity || 0) - 1;
        if (entry.quantity <= 0) deck.cards = deck.cards.filter(card => String(card.id) !== cardId);
      }
      deck.updatedAt = Date.now();
      saveDecks();
      renderDeckPage();
    }, { once: true });
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
    renderHome();
    renderDeckList();
    renderCreatePage();
    renderDeckPage();

    const deckSearch = $("#deck-search");
    const deckSort = $("#deck-sort");
    if (deckSearch) deckSearch.addEventListener("input", renderDeckList);
    if (deckSort) deckSort.addEventListener("change", renderDeckList);

    const searchForm = $(".card-search-form");
    if (searchForm) {
      const input = $("#card-query");
      const results = $("#search-results");
      searchForm.addEventListener("submit", event => {
        event.preventDefault();
        renderSearchResults(input ? input.value : "", results, false);
      });
      if (input) input.addEventListener("input", () => renderSearchResults(input.value, results, false));
      const searchParams = new URLSearchParams(location.search);
      if (input && searchParams.has("q")) input.value = searchParams.get("q") || "";
      if (input && input.value) renderSearchResults(input.value, results, false);
    }
    initSettings();

    const profileCount = $(".account-stats .stat-value");
    if (profileCount) profileCount.textContent = String(decks.length);
  }

  document.addEventListener("DOMContentLoaded", init);
})();














