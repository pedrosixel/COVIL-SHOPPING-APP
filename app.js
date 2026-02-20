(() => {
  "use strict";

  const CONFIG = {
    cartKey: "proto_cart_v1",
    lastCategoryKey: "proto_last_category",
    filtersKey: "proto_filters",
    shippingFee: 12,
    taxRate: 0.12,
    phoneWidth: 393,
    phoneHeight: 852,
    stageGutter: 24,
    pageDuration: 220,
    menuDuration: 260,
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const PRODUCT_CATALOG = [
    {
      id: "tops-classic-black",
      name: "Classic Logo Tee",
      ref: "TOP-001",
      category: "tops",
      color: "black",
      price: 45,
      images: ["00ClassicLogoTee–Black.webp"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "tops-classic-white",
      name: "Classic Logo Tee",
      ref: "TOP-002",
      category: "tops",
      color: "white",
      price: 45,
      images: ["00ClassicLogoTee–White.webp"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "tops-heavyweight-grey",
      name: "Heavyweight Tee",
      ref: "TOP-003",
      category: "tops",
      color: "grey",
      price: 55,
      images: ["00HeavyweightTee–Grey.webp", "01HeavyweightTee–Grey.webp"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "knit-performance-blue",
      name: "Performance Hoodie",
      ref: "KNT-001",
      category: "knitwear",
      color: "blue",
      price: 95,
      images: ["00PerformanceHoodie–Blue.webp", "01PerformanceHoodie–Blue.webp", "03PerformanceHoodie–Blue.webp"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "knit-zip-black",
      name: "Zip Hoodie",
      ref: "KNT-002",
      category: "knitwear",
      color: "black",
      price: 98,
      images: ["00ZipHoodie –Black.webp", "01ZipHoodie –Black.webp"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "out-royalty-black",
      name: "Royalty Puffa Jacket",
      ref: "OUT-001",
      category: "outwear",
      color: "black",
      price: 180,
      images: [
        "00RoyaltyPuffaJacket–Black.webp",
        "01RoyaltyPuffaJacket–Black.webp",
        "02RoyaltyPuffaJacket–Black.webp",
        "03RoyaltyPuffaJacket–Black.webp",
        "04RoyaltyPuffaJacket–Black.webp",
      ],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "bot-baggy-grey",
      name: "Baggy Jeans",
      ref: "BOT-001",
      category: "bottoms",
      color: "grey",
      price: 88,
      images: ["00BaggyJeans–Grey.webp", "02BaggyJeans–Grey.webp", "03BaggyJeans–Grey.webp"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "head-teddy-brown",
      name: "Teddy Ears Cap",
      ref: "HED-001",
      category: "headwear",
      color: "brown",
      price: 48,
      images: [
        "00TeddyEarsCap–Brown.webp",
        "01TeddyEarsCap–Brown.webp",
        "02TeddyEarsCap–Brown.webp",
        "03TeddyEarsCap–Brown.webp",
      ],
      sizes: ["OS"],
    },
    {
      id: "acc-star-ashtray",
      name: "Star Ashtray",
      ref: "ACC-001",
      category: "accessories",
      color: "grey",
      price: 35,
      images: ["00StarAshtray.webp", "01StarAshtray.webp"],
      sizes: ["OS"],
    },
  ];

  const CATEGORY_FILE = {
    all: "all.html",
    tops: "tops.html",
    knitwear: "knitwear.html",
    outwear: "outwear.html",
    bottoms: "bottoms.html",
    headwear: "headwear.html",
    accessories: "accessories.html",
  };

  function assetPath(file) {
    return `./assets/${file}`;
  }

  function safeParse(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? fallback;
    } catch (_err) {
      return fallback;
    }
  }

  function safeString(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value : fallback;
  }

  function formatMoney(value) {
    const amount = Number.isFinite(value) ? value : 0;
    return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
  }

  function setPhoneScale() {
    const scaleX = (window.innerWidth - CONFIG.stageGutter) / CONFIG.phoneWidth;
    const scaleY = (window.innerHeight - CONFIG.stageGutter) / CONFIG.phoneHeight;
    const scale = Math.min(1, scaleX, scaleY);
    const finalScale = Number.isFinite(scale) ? Math.max(0.5, scale) : 1;
    document.documentElement.style.setProperty("--phone-scale", String(finalScale));
  }

  function pageEnter() {
    if (reduceMotion) return;
    document.body.classList.add("page-enter");
    requestAnimationFrame(() => {
      document.body.classList.add("page-enter-active");
      window.setTimeout(() => {
        document.body.classList.remove("page-enter", "page-enter-active");
      }, CONFIG.pageDuration);
    });
  }

  function navigate(href) {
    if (!href) return;
    if (reduceMotion) {
      window.location.href = href;
      return;
    }
    if (document.body.classList.contains("page-leave")) return;
    document.body.classList.add("page-leave");
    window.setTimeout(() => {
      window.location.href = href;
    }, CONFIG.pageDuration);
  }

  function wireAnchors() {
    qsa("a[href]").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("#")) return;
        if (anchor.matches("[data-no-sales], a.menuItem.sale[href]")) return;
        if (anchor.closest("[data-menu-section=\"sale\"]")) return;
        if (anchor.target && anchor.target !== "_self") return;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

        event.preventDefault();
        navigate(href);
      });
    });
  }

  function wireNoSalesLinks() {
    qsa("[data-no-sales], [data-menu-section=\"sale\"] a, a.menuItem.sale[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });
  }

  function setLastCategory(href) {
    localStorage.setItem(CONFIG.lastCategoryKey, href);
  }

  function getLastCategory() {
    return localStorage.getItem(CONFIG.lastCategoryKey) || "tops.html";
  }

  function getFilters() {
    return safeParse(CONFIG.filtersKey, {});
  }

  function setFilters(next) {
    localStorage.setItem(CONFIG.filtersKey, JSON.stringify(next));
  }

  const Cart = {
    normalize(raw) {
      if (!raw || typeof raw !== "object") return null;
      const id = safeString(raw.id, "tops-classic-black");
      const ref = safeString(raw.ref, "TOP-001");
      const name = safeString(raw.name, "Classic Logo Tee");
      const color = safeString(raw.color, "black");
      const size = safeString(raw.size, "M").toUpperCase();
      const price = Math.max(0, Number(raw.price) || 0);
      const qty = Math.max(1, Math.floor(Number(raw.qty) || 1));
      const image = safeString(raw.image, assetPath("00ClassicLogoTee–Black.webp"));
      return { id, ref, name, color, size, price, qty, image };
    },

    read() {
      const parsed = safeParse(CONFIG.cartKey, []);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(this.normalize).filter(Boolean);
    },

    write(items) {
      const clean = (Array.isArray(items) ? items : []).map(this.normalize).filter(Boolean);
      localStorage.setItem(CONFIG.cartKey, JSON.stringify(clean));
    },

    clear() {
      localStorage.removeItem(CONFIG.cartKey);
    },

    count(items = this.read()) {
      return items.reduce((sum, item) => sum + item.qty, 0);
    },

    subtotal(items = this.read()) {
      const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      return Number.isFinite(total) ? total : 0;
    },
  };

  function renderCartCount() {
    const count = Cart.count();
    qsa("[data-cart-count]").forEach((node) => {
      node.textContent = count > 0 ? String(count) : "";
    });
    qsa(".cartLink[aria-label]").forEach((link) => {
      link.setAttribute("aria-label", count > 0 ? `Cart, ${count} item${count > 1 ? "s" : ""}` : "Cart");
    });
  }

  function computeCartTotals(items = Cart.read()) {
    const subtotal = Cart.subtotal(items);
    const taxes = subtotal * CONFIG.taxRate;
    const shipping = subtotal > 0 ? CONFIG.shippingFee : 0;
    const total = subtotal + taxes + shipping;
    return { subtotal, taxes, shipping, total };
  }

  function setContinueShoppingLinks() {
    const href = getLastCategory();
    qsa("[data-continue-shopping]").forEach((node) => {
      node.setAttribute("href", href);
    });
    const back = qs("[data-back-category]");
    if (back) {
      back.setAttribute("href", href);
      const label = href.replace(".html", "").toUpperCase();
      back.textContent = `← BACK TO ${label}`;
    }
  }

  function openOverlay({
    title,
    text = "",
    leftLabel = "",
    leftAction = null,
    rightLabel = "",
    rightAction = null,
    singleLabel = "",
    singleAction = null,
  }) {
    const phone = qs(".phone");
    if (!phone) return null;

    const existing = qs("[data-runtime-overlay]", phone);
    if (existing) existing.remove();

    const wrap = document.createElement("div");
    wrap.setAttribute("data-runtime-overlay", "true");
    wrap.innerHTML = `
      <div class="modalScrim" data-overlay-close></div>
      <div class="modalCard">
        <div class="modalIcon"></div>
        <div class="modalTitle">${title}</div>
        ${text ? `<div class="modalText">${text}</div>` : ""}
        ${
          singleLabel
            ? `<button type="button" class="btnPrimary" data-overlay-single style="width:100%;">${singleLabel}</button>`
            : `<div class="modalRow">
                <button type="button" class="btnSecondary" data-overlay-left>${leftLabel}</button>
                <button type="button" class="btnPrimary" data-overlay-right>${rightLabel}</button>
              </div>`
        }
      </div>
    `;

    phone.appendChild(wrap);
    document.body.classList.add("has-modal");

    const close = () => {
      wrap.remove();
      if (!qs("[data-runtime-overlay]")) {
        document.body.classList.remove("has-modal");
      }
    };

    const scrim = qs("[data-overlay-close]", wrap);
    if (scrim) {
      scrim.addEventListener("click", () => {
        close();
        if (typeof leftAction === "function") leftAction();
      });
    }

    const left = qs("[data-overlay-left]", wrap);
    if (left) {
      left.addEventListener("click", () => {
        close();
        if (typeof leftAction === "function") leftAction();
      });
    }

    const right = qs("[data-overlay-right]", wrap);
    if (right) {
      right.addEventListener("click", () => {
        close();
        if (typeof rightAction === "function") rightAction();
      });
    }

    const single = qs("[data-overlay-single]", wrap);
    if (single) {
      single.addEventListener("click", () => {
        close();
        if (typeof singleAction === "function") singleAction();
      });
    }

    return close;
  }

  function initMenu() {
    const shell = qs("[data-menu-shell]");
    if (!shell) return;

    const lockScroll = (locked) => {
      document.body.classList.toggle("menu-open", locked);
    };

    const setSection = (name, open) => {
      const section = qs(`[data-menu-section="${name}"]`, shell);
      if (!section) return;
      section.classList.toggle("menuSectionOpen", open);
      const arrow = qs(`[data-menu-arrow="${name}"]`, section);
      if (arrow) arrow.textContent = open ? "−" : "+";
    };

    const openMenu = () => {
      shell.hidden = false;
      shell.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => shell.classList.add("is-open"));
      lockScroll(true);
    };

    const closeMenu = (href = "") => {
      shell.classList.remove("is-open");
      const finish = () => {
        if (!shell.classList.contains("is-open")) {
          shell.hidden = true;
          shell.setAttribute("aria-hidden", "true");
          lockScroll(false);
          if (href) navigate(href);
        }
      };
      if (reduceMotion) finish();
      else window.setTimeout(finish, CONFIG.menuDuration);
    };

    qsa("[data-open-menu]").forEach((button) => {
      button.addEventListener("click", openMenu);
    });

    qsa("[data-close-menu]", shell).forEach((button) => {
      button.addEventListener("click", () => closeMenu(button.getAttribute("data-close-href") || ""));
    });

    qsa("[data-menu-toggle]", shell).forEach((button) => {
      button.addEventListener("click", () => {
        const sectionName = button.getAttribute("data-menu-toggle");
        if (!sectionName) return;
        const section = qs(`[data-menu-section="${sectionName}"]`, shell);
        const next = !section?.classList.contains("menuSectionOpen");
        setSection("shop", false);
        setSection("sale", false);
        setSection(sectionName, next);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function getProductsByCategory(category) {
    if (category === "all") return [...PRODUCT_CATALOG];
    return PRODUCT_CATALOG.filter((product) => product.category === category);
  }

  function renderCategoryCards(grid, products, category) {
    grid.innerHTML = products
      .map((product) => {
        const thumb = assetPath(product.images[0] || "");
        return `
          <a class="lookbookCard" href="product.html?id=${encodeURIComponent(product.id)}&cat=${encodeURIComponent(category)}"
             data-color="${product.color}" data-price="${product.price}" data-category="${product.category}">
            <div class="lookbookMedia">
              <img src="${thumb}" alt="${product.name}">
            </div>
            <div class="lookbookMeta">
              <span>${product.name.toUpperCase()} - ${product.color.toUpperCase()}</span>
              <span>PRICE: CA${formatMoney(product.price)}</span>
            </div>
          </a>
        `;
      })
      .join("");
  }

  function applyFilterSort(products, state) {
    let next = [...products];

    if (state.color && state.color !== "all") {
      next = next.filter((product) => product.color === state.color);
    }

    if (state.sort === "price_asc") {
      next.sort((a, b) => a.price - b.price);
    } else if (state.sort === "price_desc") {
      next.sort((a, b) => b.price - a.price);
    }

    return next;
  }

  function initCategoryPage() {
    const category = document.body.getAttribute("data-category-page");
    const grid = qs("[data-product-grid]");
    if (!category || !grid) return;

    const categoryHref = CATEGORY_FILE[category] || "tops.html";
    setLastCategory(categoryHref);

    const allFilters = getFilters();
    const state = allFilters[category] || { color: "all", sort: "featured" };
    const filterToggle = qs("[data-filter-toggle]");
    const sortToggle = qs("[data-sort-toggle]");
    const filterDrawer = qs("[data-filter-drawer]");
    const sortDrawer = qs("[data-sort-drawer]");

    const controls = qs(".listControls");
    let activeRow = qs("[data-list-states]");
    if (!activeRow && controls) {
      activeRow = document.createElement("div");
      activeRow.className = "listStates";
      activeRow.setAttribute("data-list-states", "");
      controls.after(activeRow);
    }

    const labelForSort = (sortValue) => {
      if (sortValue === "price_asc") return "PRICE (LOW-HIGH)";
      if (sortValue === "price_desc") return "PRICE (HIGH-LOW)";
      return "";
    };

    const renderActiveStates = () => {
      if (!activeRow) return;
      const chips = [];
      if (state.color && state.color !== "all") {
        chips.push(
          `<button type="button" class="listStateChip" data-clear-state="color" aria-label="Clear color filter">FILTER: ${state.color.toUpperCase()} <span aria-hidden="true">x</span></button>`
        );
      }
      if (state.sort && state.sort !== "featured") {
        chips.push(
          `<button type="button" class="listStateChip" data-clear-state="sort" aria-label="Clear sort">SORT: ${labelForSort(state.sort)} <span aria-hidden="true">x</span></button>`
        );
      }
      activeRow.innerHTML = chips.join("");
      qsa("[data-clear-state]", activeRow).forEach((button) => {
        button.addEventListener("click", () => {
          const mode = button.getAttribute("data-clear-state");
          if (mode === "color") state.color = "all";
          if (mode === "sort") state.sort = "featured";
          allFilters[category] = state;
          setFilters(allFilters);
          render();
        });
      });
    };

    const render = () => {
      const products = getProductsByCategory(category);
      const result = applyFilterSort(products, state);
      renderCategoryCards(grid, result, category);
      renderActiveStates();
      wireAnchors();
    };

    if (filterToggle && filterDrawer) {
      filterToggle.addEventListener("click", () => {
        filterDrawer.classList.toggle("is-open");
        if (sortDrawer) sortDrawer.classList.remove("is-open");
      });
    }

    if (sortToggle && sortDrawer) {
      sortToggle.addEventListener("click", () => {
        sortDrawer.classList.toggle("is-open");
        if (filterDrawer) filterDrawer.classList.remove("is-open");
      });
    }

    qsa("[data-filter-value]").forEach((button) => {
      button.addEventListener("click", () => {
        state.color = button.getAttribute("data-filter-value") || "all";
        allFilters[category] = state;
        setFilters(allFilters);
        if (filterDrawer) filterDrawer.classList.remove("is-open");
        render();
      });
    });

    qsa("[data-sort-value]").forEach((button) => {
      button.addEventListener("click", () => {
        state.sort = button.getAttribute("data-sort-value") || "featured";
        allFilters[category] = state;
        setFilters(allFilters);
        if (sortDrawer) sortDrawer.classList.remove("is-open");
        render();
      });
    });

    render();
  }

  function getProductById(id) {
    return PRODUCT_CATALOG.find((product) => product.id === id) || PRODUCT_CATALOG[0];
  }

  function initProduct() {
    const addBtn = qs("[data-add-to-cart]");
    if (!addBtn) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || "tops-classic-black";
    const category = params.get("cat") || "tops";
    const categoryHref = CATEGORY_FILE[category] || getLastCategory();

    setLastCategory(categoryHref);
    setContinueShoppingLinks();

    const product = getProductById(productId);

    const ref = qs("[data-pdp-ref]");
    const name = qs("[data-pdp-name]");
    const price = qs("[data-pdp-price]");
    if (ref) ref.textContent = "";
    if (name) name.textContent = `${product.name.toUpperCase()} - ${product.color.toUpperCase()}`;
    if (price) price.textContent = `PRICE: CA${formatMoney(product.price)}`;

    const gallery = qs(".pdpGallery");
    if (gallery) {
      gallery.innerHTML = product.images
        .slice(0, 3)
        .map(
          (file) => `
            <div class="pdpImage">
              <img src="${assetPath(file)}" alt="${product.name}">
            </div>
          `
        )
        .join("");
    }

    const sizeRow = qs(".sizeRow");
    if (sizeRow) {
      sizeRow.innerHTML = product.sizes
        .map((size) => `<button type="button" data-size="${size}">${size}</button>`)
        .join("");
    }

    let selectedSize = "";
    if (product.sizes.length === 1) {
      selectedSize = product.sizes[0];
      const only = qs("[data-size]");
      if (only) only.classList.add("active");
    }
    qsa("[data-size]").forEach((button) => {
      button.addEventListener("click", () => {
        qsa("[data-size]").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        selectedSize = button.dataset.size || "";
      });
    });

    addBtn.addEventListener("click", () => {
      if (!selectedSize) {
        alert("Please select a size");
        return;
      }

      const cart = Cart.read();
      const existing = cart.find((item) => item.id === product.id && item.size === selectedSize);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: product.id,
          ref: product.ref,
          name: product.name,
          color: product.color,
          price: product.price,
          size: selectedSize,
          qty: 1,
          image: assetPath(product.images[0]),
        });
      }

      Cart.write(cart);
      renderCartCount();

      openOverlay({
        title: "ADDED TO CART",
        text: "ITEM HAS BEEN ADDED TO YOUR BAG",
        leftLabel: "KEEP SHOPPING",
        leftAction: () => {},
        rightLabel: "GO TO CART",
        rightAction: () => navigate("cart.html"),
      });
    });
  }

  function cartRowMarkup(item, index) {
    return `
      <article class="cartItem">
        <div class="cartThumb"><img alt="${item.name}" src="${item.image}"></div>
        <div class="cartInfo">
          <h3>REF: ${item.ref}<br>${item.name.toUpperCase()}</h3>
          <div class="meta">${item.color.toUpperCase()} / ${item.size}</div>
          <div class="meta">CA${formatMoney(item.price)}</div>
          <div class="qtyRow">
            <button type="button" data-dec="${index}" aria-label="Decrease quantity">−</button>
            <div class="miniLabel">${item.qty}</div>
            <button type="button" data-inc="${index}" aria-label="Increase quantity">+</button>
            <button type="button" class="trashBtn" data-del="${index}" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function initCartPage() {
    const wrap = qs("[data-cart-wrap]");
    if (!wrap) return;

    const list = qs("[data-cart-list]");
    const subtotalNode = qs("[data-subtotal]");
    const checkoutButton = qs("[data-cart-checkout]");
    if (!list || !subtotalNode) return;

    const setCheckoutDisabled = (disabled) => {
      if (!checkoutButton) return;
      checkoutButton.classList.toggle("is-disabled", disabled);
      checkoutButton.setAttribute("aria-disabled", disabled ? "true" : "false");
      if (disabled) {
        checkoutButton.setAttribute("tabindex", "-1");
      } else {
        checkoutButton.removeAttribute("tabindex");
      }
    };

    if (checkoutButton) {
      checkoutButton.addEventListener("click", (event) => {
        if (checkoutButton.classList.contains("is-disabled")) {
          event.preventDefault();
        }
      });
    }

    const render = () => {
      const items = Cart.read();
      if (items.length === 0) {
        list.innerHTML = `<div class="miniLabel" style="padding:6px 0 2px;">you have not selected any items yet</div>`;
        subtotalNode.textContent = "CA$0";
        setCheckoutDisabled(true);
        renderCartCount();
        return;
      }

      list.innerHTML = items.map(cartRowMarkup).join("");
      subtotalNode.textContent = `CA${formatMoney(Cart.subtotal(items))}`;
      setCheckoutDisabled(false);
      renderCartCount();

      qsa("[data-inc]", list).forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.inc);
          const next = Cart.read();
          if (!next[idx]) return;
          next[idx].qty += 1;
          Cart.write(next);
          render();
        });
      });

      qsa("[data-dec]", list).forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.dec);
          const next = Cart.read();
          if (!next[idx]) return;
          next[idx].qty = Math.max(1, next[idx].qty - 1);
          Cart.write(next);
          render();
        });
      });

      qsa("[data-del]", list).forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.del);
          const next = Cart.read();
          if (!next[idx]) return;
          next.splice(idx, 1);
          Cart.write(next);
          render();
        });
      });
    };

    render();
  }

  function initCheckout() {
    const continueBtn = qs("[data-checkout-continue]");
    if (!continueBtn) return;

    const cartItems = Cart.read();
    if (!cartItems.length) {
      navigate("cart.html");
      return;
    }

    const totals = computeCartTotals(cartItems);
    const count = Cart.count();

    const summary = qs(".orderSummaryBar .amt");
    const totalNode = qs(".totalRow .big");
    const itemText = qs(".totalSub");
    const checkoutTitle = qs("[data-checkout-step-title]");

    if (checkoutTitle) checkoutTitle.textContent = "Shipping and payment Info";
    if (summary) summary.textContent = `CA${formatMoney(totals.total)}`;
    if (totalNode) totalNode.textContent = `CA${formatMoney(totals.total)}`;

    if (itemText && count > 0) {
      itemText.textContent = `${count} ITEMS`;
    }

    continueBtn.addEventListener("click", () => {
      navigate("checkout-summary.html");
    });
  }

  function checkoutSummaryRow(item) {
    return `
      <article class="summaryItem">
        <div class="summaryThumb"><img src="${item.image}" alt="${item.name}"></div>
        <div class="summaryInfo">
          <h3>${item.name.toUpperCase()} - ${item.color.toUpperCase()}</h3>
          <div class="meta">${item.color.toUpperCase()} / ${item.size}</div>
          <div class="meta">QTY ${item.qty}</div>
        </div>
        <div class="summaryPrice">CA${formatMoney(item.qty * item.price)}</div>
      </article>
    `;
  }

  function initCheckoutSummary() {
    const finalizeBtn = qs("[data-finalize-purchase]");
    if (!finalizeBtn) return;

    const items = Cart.read();
    if (!items.length) {
      navigate("cart.html");
      return;
    }

    const list = qs("[data-summary-items]");
    const subtotalNode = qs("[data-summary-subtotal]");
    const taxNode = qs("[data-summary-tax]");
    const shippingNode = qs("[data-summary-shipping]");
    const totalNode = qs("[data-summary-total]");
    const summaryAmt = qs(".orderSummaryBar .amt");

    if (list) list.innerHTML = items.map(checkoutSummaryRow).join("");

    const totals = computeCartTotals(items);
    if (subtotalNode) subtotalNode.textContent = `CA${formatMoney(totals.subtotal)}`;
    if (taxNode) taxNode.textContent = `CA${formatMoney(totals.taxes)}`;
    if (shippingNode) shippingNode.textContent = `CA${formatMoney(totals.shipping)}`;
    if (totalNode) totalNode.textContent = `CA${formatMoney(totals.total)}`;
    if (summaryAmt) summaryAmt.textContent = `CA${formatMoney(totals.total)}`;

    finalizeBtn.addEventListener("click", () => {
      const orderNo = String(Math.floor(100000 + Math.random() * 900000));
      Cart.clear();
      renderCartCount();

      openOverlay({
        title: "ORDER CONFIRMED !",
        text: `ORDER #${orderNo}<br>YOU'LL RECEIVE A CONFIRMATION EMAIL SHORTLY.`,
        singleLabel: "BACK TO HOME",
        singleAction: () => navigate("index.html"),
      });
    });
  }

  function initEmptyCartState() {
    if (!window.location.pathname.endsWith("cart-empty.html")) return;
    setContinueShoppingLinks();
  }

  function init() {
    setPhoneScale();
    pageEnter();
    wireAnchors();
    wireNoSalesLinks();

    renderCartCount();
    setContinueShoppingLinks();

    initMenu();
    initCategoryPage();
    initProduct();
    initCartPage();
    initEmptyCartState();
    initCheckout();
    initCheckoutSummary();
  }

  window.addEventListener("resize", setPhoneScale, { passive: true });
  document.addEventListener("DOMContentLoaded", init);
})();
