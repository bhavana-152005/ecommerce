/* ==========================================
   BELLEVOUIX E-COMMERCE FRONTEND SCRIPT
   Fixes:
   - JS-only file (no HTML/CSS concatenation)
   - Correct INR/₹ rendering using Unicode currency symbol
   - Working Add to Cart + sessionStorage cart persistence
   - Dynamic cart count
   - Wishlist toggle
   - Product rendering + quick view modal
   - Search suggestions (client-side)
========================================== */

(() => {
  // AUTH GATE
  const role = sessionStorage.getItem("userRole");
  if (!role) window.location.href = "login.html";

  const welcomeUser = document.getElementById("welcomeUser");
  if (welcomeUser) {
    const username = sessionStorage.getItem("username");
    welcomeUser.innerText = "Hi, " + (username || "");
  }
})();

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

// ==========================================
// SAMPLE PRODUCT DATA
// (frontend demo data; later replace with backend/API)
// ==========================================
const products = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    brand: "Bellevouix",
    category: "men",
    price: 799,
    originalPrice: 1299,
    discount: 38,
    rating: 4.5,
    ratingCount: 245,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    brand: "FashionX",
    category: "women",
    price: 1599,
    originalPrice: 2499,
    discount: 36,
    rating: 4.8,
    ratingCount: 512,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: 3,
    name: "Denim Jacket",
    brand: "UrbanStyle",
    category: "men",
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    rating: 4.6,
    ratingCount: 189,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: false,
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    name: "Kids Cartoon T-Shirt",
    brand: "KiddoWear",
    category: "kids",
    price: 499,
    originalPrice: 799,
    discount: 38,
    rating: 4.7,
    ratingCount: 324,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: 5,
    name: "Leather Handbag",
    brand: "LuxeAccessories",
    category: "accessories",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.9,
    ratingCount: 678,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: false,
    sizes: [],
  },
  {
    id: 6,
    name: "Slim Fit Jeans",
    brand: "DenimCo",
    category: "men",
    price: 1899,
    originalPrice: 2999,
    discount: 37,
    rating: 4.4,
    ratingCount: 412,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: false,
    sizes: ["30", "32", "34", "36"],
  },
  {
    id: 7,
    name: "Ethnic Kurta Set",
    brand: "TraditionalWear",
    category: "women",
    price: 2299,
    originalPrice: 3499,
    discount: 34,
    rating: 4.7,
    ratingCount: 567,
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 8,
    name: "Sports Shoes",
    brand: "AthleticGear",
    category: "accessories",
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    rating: 4.6,
    ratingCount: 892,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: true,
    sizes: ["6", "7", "8", "9", "10"],
  },
  {
    id: 9,
    name: "Casual Shirt",
    brand: "Bellevouix",
    category: "men",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4.3,
    ratingCount: 234,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: false,
    sizes: ["M", "L", "XL"],
  },
  {
    id: 10,
    name: "Party Wear Gown",
    brand: "GlamourX",
    category: "women",
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    rating: 4.9,
    ratingCount: 723,
    image:
      "https://images.unsplash.com/photo-1566479179815-4ba6a194b36e?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: true,
    sizes: ["S", "M", "L"],
  },
  {
    id: 11,
    name: "Kids Shorts Set",
    brand: "KiddoWear",
    category: "kids",
    price: 699,
    originalPrice: 1099,
    discount: 36,
    rating: 4.5,
    ratingCount: 189,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: false,
    sizes: ["S", "M", "L"],
  },
  {
    id: 12,
    name: "Designer Watch",
    brand: "TimePiece",
    category: "accessories",
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    rating: 4.8,
    ratingCount: 456,
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&h=500&q=80",
    isNew: true,
    sizes: [],
  },
];

function getAdminProductsForStore(category = "all") {
  try {
    return JSON.parse(localStorage.getItem("adminProducts") || "[]")
      .filter((product) => category === "all" || product.category === category)
      .map((product) => ({
        ...product,
        price: Number(product.price) || 0,
        originalPrice: Number(product.originalPrice) || null,
        stock: Number(product.stock || 0),
        rating: Number(product.rating || 0),
        ratingCount: Number(product.ratingCount || 0),
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        isAdminProduct: true,
      }));
  } catch (error) {
    return [];
  }
}

products.unshift(...getAdminProductsForStore("all"));

async function loadBackendProducts() {
  if (typeof BelleApi === "undefined") return;

  try {
    const data = await BelleApi.products("all");
    if (!Array.isArray(data.products) || data.products.length === 0) return;

    products.length = 0;
    products.push(...data.products, ...getAdminProductsForStore("all"));
    filteredProducts = [...products];
  } catch (error) {
    // Static demo data remains available when the Java API is not running.
  }
}

/**
 * STATE MANAGEMENT
 * Cart and wishlist stay in sessionStorage so different logins do not share data.
 */
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
let wishlist = JSON.parse(sessionStorage.getItem("wishlist")) || [];

let currentCategory = "all";
let filteredProducts = [...products];

let quickViewSelectedSize = null;

// ==========================================
// Currency + helpers
// ==========================================
function formatINR(value) {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString("en-IN")}`;
}

function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let stars = "★".repeat(fullStars);
  if (halfStar) stars += "☆";
  return stars;
}

function matchesSearch(fields, rawSearchTerm) {
  const terms = normalizeSearchValue(rawSearchTerm)
    .split(" ")
    .filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalizeSearchValue(fields.filter(Boolean).join(" "));
  return terms.every((term) => haystack.includes(term));
}

function getProductSearchKeywords(product) {
  const name = normalizeSearchValue(product.name);
  const keywords = [product.name, product.brand, product.category];

  if (name.includes("t-shirt")) keywords.push("tshirt", "t shirt", "tee", "top");
  if (name.includes("shirt")) keywords.push("shirt", "casual shirt", "formal shirt");
  if (name.includes("dress") || name.includes("gown")) keywords.push("dress", "gown", "party wear");
  if (name.includes("jeans") || name.includes("denim")) keywords.push("jeans", "denim", "pants", "trousers");
  if (name.includes("jacket")) keywords.push("jacket", "outerwear", "coat");
  if (name.includes("kurta")) keywords.push("kurta", "ethnic", "traditional");
  if (name.includes("shoes")) keywords.push("shoes", "sneakers", "footwear");
  if (name.includes("watch")) keywords.push("watch", "wrist watch");
  if (name.includes("handbag")) keywords.push("handbag", "bag", "purse");

  if (product.category === "men") keywords.push("mens", "men clothing", "mens wear");
  if (product.category === "women") keywords.push("womens", "women clothing", "ladies wear");
  if (product.category === "kids") keywords.push("children", "kids wear", "kids clothing");
  if (product.category === "accessories") keywords.push("fashion accessories");

  return keywords;
}

function updateSearchUrl(term) {
  const url = new URL(window.location.href);
  const normalizedTerm = normalizeSearchValue(term);
  if (normalizedTerm) url.searchParams.set("search", term.trim());
  else url.searchParams.delete("search");
  window.history.replaceState({}, "", url);
}

// ==========================================
// DOM ELEMENTS
// ==========================================
const productGrid = document.getElementById("productGrid");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const navLinks = document.querySelectorAll(".nav-link");
const searchInput = document.getElementById("searchInput");
const searchIcon = document.querySelector(".header-actions .search-icon");
const searchSuggestions = document.getElementById("searchSuggestions");
const sortSelect = document.getElementById("sortSelect");
const productCount = document.getElementById("productCount");

// ==========================================
// SEARCH SUGGESTIONS (client-side)
// ==========================================
let currentSuggestions = [];
let activeSuggestionIndex = -1;

const searchTopics = [
  { label: "T-Shirts", query: "t-shirt", type: "Category", aliases: ["tshirt", "tee", "tees", "top", "t shirt"] },
  { label: "Shirts", query: "shirt", type: "Category", aliases: ["formal shirt", "casual shirt", "button down"] },
  { label: "Dresses", query: "dress", type: "Category", aliases: ["gown", "maxi dress", "party wear"] },
  { label: "Jeans", query: "jeans", type: "Category", aliases: ["denim", "pants", "trousers"] },
  { label: "Jackets", query: "jacket", type: "Category", aliases: ["coat", "outerwear", "denim jacket"] },
  { label: "Kurtas", query: "kurta", type: "Category", aliases: ["ethnic", "kurta set", "traditional"] },
  { label: "Kids Wear", query: "kids", type: "Category", aliases: ["children", "kids wear", "baby clothes"] },
  { label: "Accessories", query: "accessories", type: "Category", aliases: ["watch", "bag", "handbag", "shoes"] },
];

function getSearchSuggestions(query) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) return searchTopics.slice(0, 6);

  const topicSuggestions = searchTopics
    .filter((topic) => matchesSearch([topic.label, topic.query, ...(topic.aliases || [])], normalizedQuery))
    .map((topic) => ({
      label: topic.label,
      query: topic.query,
      subtitle: `Search ${topic.label}`,
      type: topic.type,
    }));

  const productSuggestions = products
    .filter((product) => matchesSearch(getProductSearchKeywords(product), normalizedQuery))
    .slice(0, 6)
    .map((product) => ({
      label: product.name,
      query: product.name,
      subtitle: `${product.brand} • ${product.category}`,
      type: "Product",
    }));

  const unique = [];
  const seen = new Set();

  [...topicSuggestions, ...productSuggestions].forEach((item) => {
    const key = `${normalizeSearchValue(item.label)}|${normalizeSearchValue(item.query)}`;
    if (!seen.has(key) && unique.length < 7) {
      seen.add(key);
      unique.push(item);
    }
  });

  return unique;
}

function renderSearchSuggestions(query) {
  if (!searchSuggestions) return;

  currentSuggestions = getSearchSuggestions(query);
  activeSuggestionIndex = -1;

  if (currentSuggestions.length === 0) {
    searchSuggestions.hidden = true;
    searchSuggestions.innerHTML = "";
    return;
  }

  const categories = currentSuggestions.filter((item) => item.type === "Category");
  const productsList = currentSuggestions.filter((item) => item.type === "Product");
  const sections = [];

  if (categories.length > 0) {
    sections.push(`
      <div class="search-suggestion-section">
        <div class="search-suggestion-heading">${normalizeSearchValue(query) ? "Suggested Searches" : "Popular Searches"}</div>
        ${categories
          .map((item) => {
            const index = currentSuggestions.indexOf(item);
            return `
              <button class="search-suggestion-item" data-index="${index}" type="button">
                <span class="search-suggestion-main">
                  <span class="search-suggestion-title">${item.label}</span>
                  <span class="search-suggestion-subtitle">${item.subtitle}</span>
                </span>
                <span class="search-suggestion-type">${item.type}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    `);
  }

  if (productsList.length > 0) {
    sections.push(`
      <div class="search-suggestion-section">
        <div class="search-suggestion-heading">Products</div>
        ${productsList
          .map((item) => {
            const index = currentSuggestions.indexOf(item);
            return `
              <button class="search-suggestion-item" data-index="${index}" type="button">
                <span class="search-suggestion-main">
                  <span class="search-suggestion-title">${item.label}</span>
                  <span class="search-suggestion-subtitle">${item.subtitle}</span>
                </span>
                <span class="search-suggestion-type">${item.type}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    `);
  }

  searchSuggestions.innerHTML = sections.join("");
  searchSuggestions.hidden = false;
}

function hideSearchSuggestions() {
  if (!searchSuggestions) return;
  searchSuggestions.hidden = true;
  activeSuggestionIndex = -1;
}

function highlightActiveSuggestion() {
  if (!searchSuggestions) return;
  searchSuggestions.querySelectorAll(".search-suggestion-item").forEach((item, index) => {
    item.classList.toggle("active", index === activeSuggestionIndex);
  });
}

function applySearchSelection(term) {
  if (searchInput) searchInput.value = term;
  hideSearchSuggestions();
  filterProducts(term);
  scrollToProductResults();
}

function applySearchFromUrl() {
  const urlTerm = new URLSearchParams(window.location.search).get("search") || "";
  if (searchInput) searchInput.value = urlTerm;
  filterProducts(urlTerm);
}

function scrollToProductResults() {
  const featuredSection = document.querySelector(".featured-section");
  if (featuredSection) featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function submitProductSearch() {
  applySearchSelection(searchInput ? searchInput.value : "");
}

// ==========================================
// RENDER PRODUCTS + FILTERING + SORT
// ==========================================
function renderProducts() {
  if (!productGrid) return;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 24px; margin-bottom: 10px;">No products found</h3>
        <p style="color: var(--text-light);">Try adjusting your filters or search term</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map(
      (product, index) => `
      <div class="product-card" style="animation-delay: ${index * 0.05}s">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          ${product.isNew || product.discount ? `
            <div class="product-badges">
              ${product.isNew ? "<span class='badge-new'>New</span>" : ""}
              ${product.discount ? `<span class='badge-sale'>${product.discount}% OFF</span>` : ""}
            </div>
          ` : ""}
          <div class="product-actions">
            <button
              class="action-icon wishlist-btn ${isInWishlist(product.id) ? "active" : ""}"
              onclick="toggleWishlist(${product.id})"
              title="${isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}"
              aria-label="${isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}"
            ></button>
            <button class="action-icon" onclick="quickView(${product.id})" title="Quick view" aria-label="Quick view"></button>
          </div>
        </div>

        <div class="product-info">
          <div class="product-brand">${product.brand}</div>
          <h3 class="product-name">${product.name}</h3>

          <div class="product-price">
            <span class="price-current">${formatINR(product.price)}</span>
            ${product.originalPrice ? `
              <span class="price-original">${formatINR(product.originalPrice)}</span>
              <span class="price-discount">(${product.discount}% OFF)</span>
            ` : ""}
          </div>

          <button class="add-to-cart-btn" onclick="quickView(${product.id})">Select Size</button>
        </div>
      </div>
    `
    )
    .join("");

  if (productCount) {
    const searchTerm = normalizeSearchValue(searchInput ? searchInput.value : "");
    productCount.textContent = searchTerm
      ? `Showing ${filteredProducts.length} result${filteredProducts.length === 1 ? "" : "s"} for "${(searchInput?.value || "").trim()}"`
      : `Showing ${filteredProducts.length} products`;
  }
}

function filterProducts(forcedSearchTerm = null) {
  let filtered = [...products];

  if (currentCategory !== "all") {
    filtered = filtered.filter((p) => p.category === currentCategory);
  }

  const checkedCategories = Array.from(document.querySelectorAll(".category-filter:checked")).map((cb) => cb.value);
  if (checkedCategories.length > 0 && currentCategory === "all") {
    filtered = filtered.filter((p) => checkedCategories.includes(p.category));
  }

  const checkedPrices = Array.from(document.querySelectorAll(".price-filter:checked")).map((cb) => cb.value);
  if (checkedPrices.length > 0) {
    filtered = filtered.filter((product) =>
      checkedPrices.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      })
    );
  }

  const activeSizes = Array.from(document.querySelectorAll(".size-btn.active")).map((btn) => btn.getAttribute("data-size"));
  if (activeSizes.length > 0) {
    filtered = filtered.filter((product) => activeSizes.some((size) => (product.sizes || []).includes(size)));
  }

  const searchTerm =
    forcedSearchTerm !== null ? forcedSearchTerm : searchInput ? searchInput.value : "";

  if (searchTerm) {
    filtered = filtered.filter((p) =>
      matchesSearch(
        [
          p.name,
          p.brand,
          p.category,
          (p.sizes || []).join(" "),
          ...getProductSearchKeywords(p),
          p.isNew ? "new latest trending" : "",
        ],
        searchTerm
      )
    );
  }

  filteredProducts = filtered;
  updateSearchUrl(searchTerm);
  renderProducts();
}

function sortProducts(sortType) {
  switch (sortType) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "new":
      filteredProducts.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
      break;
    case "popular":
      filteredProducts.sort((a, b) => b.ratingCount - a.ratingCount);
      break;
    default:
      filteredProducts = [...products];
  }
  renderProducts();
}

function clearAllFilters() {
  document.querySelectorAll(".category-filter, .price-filter").forEach((cb) => (cb.checked = false));
  document.querySelectorAll(".size-btn").forEach((btn) => btn.classList.remove("active"));

  currentCategory = "all";
  navLinks.forEach((link) => {
    if (link.getAttribute("data-category") === "all") link.classList.add("active");
    else link.classList.remove("active");
  });

  if (searchInput) searchInput.value = "";
  filterProducts("");
}

// ==========================================
// CART FUNCTIONS
// ==========================================
function addToCart(productId, selectedSize = null) {
  const product = products.find((p) => p.id === productId);
  if (!product) return false;

  const sizeToAdd =
    selectedSize !== null && selectedSize !== undefined
      ? selectedSize
      : quickViewSelectedSize;

  // If product has sizes, require selection
  if (Array.isArray(product.sizes) && product.sizes.length > 0 && !sizeToAdd) {
    showNotification("Please select a size first");
    return false;
  }

  // Identify cart items by (productId + selectedSize)
  const existingItem = cart.find(
    (item) => item.id === productId && (item.selectedSize || null) === (sizeToAdd || null)
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1, selectedSize: sizeToAdd || null });
  }

  saveCart();
  updateCartCount();
  renderCart();
  showNotification("Added to cart!");
  return true;
}

function removeFromCart(productId, selectedSize = null) {
  cart = cart.filter(
    (item) => !(item.id === productId && (item.selectedSize || null) === (selectedSize || null))
  );
  saveCart();
  updateCartCount();
  renderCart();
}

function updateQuantity(productId, selectedSize, change) {
  const item = cart.find(
    (it) => it.id === productId && (it.selectedSize || null) === (selectedSize || null)
  );
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId, selectedSize);
  } else {
    saveCart();
    renderCart();
  }
}

function renderCart() {
  if (!cartItems || !totalPrice) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
      </div>
    `;
    totalPrice.textContent = formatINR(0);
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-details">
            ${item.brand} • Size: ${item.selectedSize || "N/A"}
          </div>
          <div class="cart-item-price">${formatINR(item.price)}</div>
          <div class="cart-item-actions">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.selectedSize || ""}', -1)">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.selectedSize || ""}', 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.selectedSize || ""}')">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPrice.textContent = formatINR(total);
}

function toggleCart() {
  if (!cartSidebar || !cartOverlay) return;

  cartSidebar.classList.toggle("active");
  cartOverlay.classList.toggle("active");

  if (cartSidebar.classList.contains("active")) renderCart();
}

function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  if (!cartCount) return;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

// ==========================================
// WISHLIST FUNCTIONS
// ==========================================
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const product = products.find((item) => item.id === productId);
  const savedProducts = JSON.parse(sessionStorage.getItem("wishlistProducts") || "{}");
  if (index > -1) {
    wishlist.splice(index, 1);
    delete savedProducts[String(productId)];
    showNotification("Removed from wishlist");
  } else {
    wishlist.push(productId);
    if (product) savedProducts[String(productId)] = product;
    showNotification("Added to wishlist!");
  }

  sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
  sessionStorage.setItem("wishlistProducts", JSON.stringify(savedProducts));
  updateWishlistCount();
  renderProducts();
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}

function updateWishlistCount() {
  if (!wishlistCount) return;
  wishlistCount.textContent = wishlist.length;
}

// ==========================================
// QUICK VIEW MODAL
// ==========================================
function quickView(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("quickViewModal");
  const modalBody = document.getElementById("modalBody");
  if (!modal || !modalBody) return;

  quickViewSelectedSize = null;

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 40px;">
      <div>
        <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px;">
      </div>
      <div>
        <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; margin-bottom: 10px;">
          ${product.brand}
        </div>
        <h2 style="font-size: 28px; margin-bottom: 15px;">${product.name}</h2>

        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
          <span style="font-size: 32px; font-weight: 700;">${formatINR(product.price)}</span>
          ${product.originalPrice ? `
            <span style="font-size: 20px; color: var(--text-light); text-decoration: line-through;">
              ${formatINR(product.originalPrice)}
            </span>
            <span style="font-size: 16px; color: var(--primary); font-weight: 600;">
              (${product.discount}% OFF)
            </span>
          ` : ""}
        </div>

        <div style="margin-bottom: 25px;">
          <div style="font-weight: 600; margin-bottom: 10px;">Select Size:</div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${(product.sizes || []).map((size) => `
              <button
                class="size-btn"
                data-size="${size}"
                type="button"
                style="position: relative;"
                onclick="selectQuickViewSize('${size}')"
              >${size}</button>
            `).join("")}
          </div>
        </div>

        <div style="display: flex; gap: 15px; margin-bottom: 25px;">
          <button
            data-quick-view-add
            disabled
            onclick="handleQuickViewAddToCart(${product.id})"
            style="flex: 1; padding: 15px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: not-allowed; opacity: 0.45;"
          >
            Select size to add
          </button>
          <button onclick="toggleWishlist(${product.id})" 
                  style="padding: 15px 20px; background: white; border: 2px solid var(--border-color); border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;">
            ${isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        <div style="padding: 20px; background: var(--bg-light); border-radius: 8px;">
          <h4 style="margin-bottom: 10px;">Product Details</h4>
          <p style="color: var(--text-light); line-height: 1.8;">
            High-quality ${product.category} wear from ${product.brand}. Perfect for everyday use with comfortable fit and premium materials.
          </p>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function selectQuickViewSize(size) {
  quickViewSelectedSize = size;
  // visually toggle active state in quick view
  const modal = document.getElementById("quickViewModal");
  if (!modal) return;
  modal.querySelectorAll(".size-btn[data-size]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-size") === String(size));
  });

  const addButton = modal.querySelector("[data-quick-view-add]");
  if (addButton) {
    addButton.disabled = false;
    addButton.textContent = "Add to Cart";
    addButton.style.opacity = "1";
    addButton.style.cursor = "pointer";
  }
}

function handleQuickViewAddToCart(productId) {
  if (addToCart(productId, quickViewSelectedSize)) {
    closeModal();
  }
}

function closeModal() {
  const modal = document.getElementById("quickViewModal");
  if (modal) modal.classList.remove("active");
  quickViewSelectedSize = null;
}

// ==========================================
// NOTIFICATION + HEADER EFFECT
// ==========================================
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--secondary-color, #4a4a68);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: var(--shadow-hover, 0 10px 30px rgba(0,0,0,0.25));
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (!header) return;
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 100) header.style.transform = "translateY(-100%)";
  else header.style.transform = "translateY(0)";

  lastScroll = currentScroll;
});

// ==========================================
// FEATURED IMAGES FROM ADMIN
// ==========================================
function loadFeaturedImages() {
  const featuredImages = JSON.parse(localStorage.getItem("featuredImages") || "[]");
  const featuredSection = document.getElementById("featuredImagesSection");
  const featuredGrid = document.getElementById("featuredImagesGrid");

  if (!featuredSection || !featuredGrid) return;

  if (featuredImages.length === 0) {
    featuredSection.style.display = "none";
    return;
  }

  featuredSection.style.display = "block";

  featuredGrid.innerHTML = featuredImages
    .slice(0, 6)
    .map(
      (image) => `
      <div class="featured-card">
        <img src="${image.url}" alt="${image.name}" class="featured-image">
        <div class="featured-overlay">
          <div class="featured-title">${image.name}</div>
          <div class="featured-meta">Uploaded ${new Date(image.uploadDate).toLocaleDateString()}</div>
        </div>
      </div>
    `
    )
    .join("");
}

// ==========================================
// INITIALIZATION + EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", async function () {
  await loadBackendProducts();
  renderProducts();
  updateCartCount();
  updateWishlistCount();
  loadFeaturedImages();
  applySearchFromUrl();
  setupEventListeners();

  const closeBtn = document.getElementById("closeModal");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
});

function setupEventListeners() {
  // Navigation categories
  navLinks.forEach((link) => {
    const category = link.getAttribute("data-category");
    if (!category) return;

    link.addEventListener("click", function (e) {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      currentCategory = category || "all";
      filterProducts();
    });
  });

  // Search suggestions
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderSearchSuggestions(this.value);
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" && currentSuggestions.length > 0) {
        event.preventDefault();
        activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, currentSuggestions.length - 1);
        highlightActiveSuggestion();
        return;
      }

      if (event.key === "ArrowUp" && currentSuggestions.length > 0) {
        event.preventDefault();
        activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
        highlightActiveSuggestion();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const selectedSuggestion = currentSuggestions[activeSuggestionIndex];
        applySearchSelection(selectedSuggestion ? selectedSuggestion.query : this.value);
      }

      if (event.key === "Escape") hideSearchSuggestions();
    });

    searchInput.addEventListener("focus", function () {
      renderSearchSuggestions(this.value);
    });
  }

  if (searchIcon) {
    searchIcon.style.cursor = "pointer";
    searchIcon.setAttribute("role", "button");
    searchIcon.setAttribute("tabindex", "0");
    searchIcon.setAttribute("aria-label", "Search products");
    searchIcon.addEventListener("click", submitProductSearch);
    searchIcon.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        submitProductSearch();
      }
    });
  }

  if (searchSuggestions) {
    searchSuggestions.addEventListener("click", function (event) {
      const suggestionButton = event.target.closest(".search-suggestion-item");
      if (!suggestionButton) return;
      const suggestion = currentSuggestions[Number(suggestionButton.dataset.index)];
      if (suggestion) applySearchSelection(suggestion.query);
    });
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".search-container")) hideSearchSuggestions();
  });

  // Sort
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortProducts(this.value);
    });
  }

  // Cart
  if (cartBtn) cartBtn.addEventListener("click", toggleCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", toggleCart);
  if (cartOverlay) cartOverlay.addEventListener("click", toggleCart);

  // Checkout button
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (cart.length === 0) {
        showNotification("Your cart is empty!");
        return;
      }
      window.location.href = "checkout.html";
    });
  }

  // Filter buttons (category/price/size) used in category pages
  document.querySelectorAll(".category-filter").forEach((el) => el.addEventListener("change", filterProducts));
  document.querySelectorAll(".price-filter").forEach((el) => el.addEventListener("change", filterProducts));

  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      filterProducts();
    });
  });

  const clearFiltersBtn = document.getElementById("clearFilters");
  if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", clearAllFilters);
}

