(function () {
  const role = sessionStorage.getItem("userRole");

  if (!role) {
    window.location.href = "login.html";
  }
})();

document.getElementById("welcomeUser").innerText =
  "Hi, " + sessionStorage.getItem("username");

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

const accessoriesProducts = [
  {
    id: 3001,
    name: "Gloss Phone Case",
    brand: "Bellevouix",
    category: "phone-cases",
    price: 499,
    originalPrice: 899,
    discount: 44,
    rating: 4.6,
    ratingCount: 228,
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["iPhone", "Samsung", "Universal"],
  },
  {
    id: 3002,
    name: "Mirror Pop Case",
    brand: "CaseLab",
    category: "phone-cases",
    price: 599,
    originalPrice: 999,
    discount: 40,
    rating: 4.5,
    ratingCount: 184,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["iPhone", "Samsung"],
  },
  {
    id: 3003,
    name: "Bag Charm Duo",
    brand: "Tiny Trinkets",
    category: "charms",
    price: 799,
    originalPrice: 1299,
    discount: 38,
    rating: 4.7,
    ratingCount: 201,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 3004,
    name: "Star Clip Charm",
    brand: "Glow Pop",
    category: "charms",
    price: 649,
    originalPrice: 1099,
    discount: 41,
    rating: 4.4,
    ratingCount: 149,
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  },
  {
    id: 3005,
    name: "Chunky Street Sneakers",
    brand: "JumpStart",
    category: "shoes",
    price: 2499,
    originalPrice: 3899,
    discount: 36,
    rating: 4.8,
    ratingCount: 367,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["EU 37", "EU 38", "EU 39", "EU 40"],
  },
  {
    id: 3006,
    name: "Classic White Sneakers",
    brand: "Urban Sole",
    category: "shoes",
    price: 2199,
    originalPrice: 3499,
    discount: 37,
    rating: 4.6,
    ratingCount: 294,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["EU 38", "EU 39", "EU 40", "EU 41"],
  },
  {
    id: 3007,
    name: "Pearl Drop Earrings",
    brand: "Lustre Lane",
    category: "earrings",
    price: 999,
    originalPrice: 1599,
    discount: 38,
    rating: 4.7,
    ratingCount: 256,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 3008,
    name: "Crystal Hoop Pair",
    brand: "Moonbeam",
    category: "earrings",
    price: 1199,
    originalPrice: 1899,
    discount: 37,
    rating: 4.8,
    ratingCount: 238,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  },
  {
    id: 3009,
    name: "Satin Bow Headband",
    brand: "SoftMuse",
    category: "headbands",
    price: 549,
    originalPrice: 899,
    discount: 39,
    rating: 4.5,
    ratingCount: 167,
    image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 3010,
    name: "Braided Velvet Band",
    brand: "Bellevouix",
    category: "headbands",
    price: 699,
    originalPrice: 1099,
    discount: 36,
    rating: 4.4,
    ratingCount: 132,
    image: "https://images.unsplash.com/photo-1583391733981-84977f367c89?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  },
  {
    id: 3011,
    name: "Crystal Waist Chain",
    brand: "Glowline",
    category: "waist-chains",
    price: 1299,
    originalPrice: 2099,
    discount: 38,
    rating: 4.7,
    ratingCount: 175,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 3012,
    name: "Layered Metal Waist Chain",
    brand: "Afterglow",
    category: "waist-chains",
    price: 1499,
    originalPrice: 2399,
    discount: 38,
    rating: 4.6,
    ratingCount: 143,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  },
  {
    id: 3013,
    name: "Classic Dad Cap",
    brand: "TopThread",
    category: "caps",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.5,
    ratingCount: 214,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 3014,
    name: "Street Logo Cap",
    brand: "North Lane",
    category: "caps",
    price: 999,
    originalPrice: 1599,
    discount: 38,
    rating: 4.6,
    ratingCount: 198,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  },
  {
    id: 3015,
    name: "Minimal Steel Watch",
    brand: "TimePiece",
    category: "watches",
    price: 3299,
    originalPrice: 5299,
    discount: 38,
    rating: 4.8,
    ratingCount: 341,
    image: "https://images.unsplash.com/photo-1523170335684-f042070fe1c7?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["One Size"],
  },
  {
    id: 3016,
    name: "Mesh Strap Watch",
    brand: "ClassicTime",
    category: "watches",
    price: 2799,
    originalPrice: 4499,
    discount: 38,
    rating: 4.7,
    ratingCount: 286,
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["One Size"],
  },
  {
    id: 3017,
    name: "Layered Silver Chain",
    brand: "SteelStory",
    category: "chains",
    price: 1599,
    originalPrice: 2599,
    discount: 38,
    rating: 4.7,
    ratingCount: 233,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 3018,
    name: "Curb Link Chain",
    brand: "Metal Muse",
    category: "chains",
    price: 1899,
    originalPrice: 3099,
    discount: 39,
    rating: 4.6,
    ratingCount: 176,
    image: "https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  },
  {
    id: 3019,
    name: "Beaded Bracelet Stack",
    brand: "Wrist Theory",
    category: "bracelets",
    price: 1099,
    originalPrice: 1799,
    discount: 39,
    rating: 4.5,
    ratingCount: 209,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 3020,
    name: "Cuff Bracelet Set",
    brand: "Bellevouix",
    category: "bracelets",
    price: 1299,
    originalPrice: 2099,
    discount: 38,
    rating: 4.6,
    ratingCount: 182,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  }
];

function getAdminProductsForStore(category) {
  try {
    return JSON.parse(localStorage.getItem("adminProducts") || "[]")
      .filter((product) => product.category === category)
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

accessoriesProducts.unshift(...getAdminProductsForStore("accessories"));

/**
 * Cart and wishlist stay in sessionStorage so different logins do not share data.
 */
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
let wishlist = JSON.parse(sessionStorage.getItem("wishlist")) || [];

let quickViewSelectedSize = null;

let currentCategory = "all";
let filteredProducts = [...accessoriesProducts];

const productGrid = document.getElementById("productGrid");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoryTitle = document.getElementById("categoryTitle");
const tabBtns = document.querySelectorAll(".tab-btn");
function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function matchesSearch(fields, rawSearchTerm) {
  const terms = normalizeSearchValue(rawSearchTerm).split(" ").filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = normalizeSearchValue(fields.filter(Boolean).join(" "));
  return terms.every((term) => haystack.includes(term));
}

document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  updateCartCount();
  updateWishlistCount();
  setupEventListeners();
});

function setupEventListeners() {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      tabBtns.forEach((tab) => tab.classList.remove("active"));
      this.classList.add("active");
      currentCategory = this.getAttribute("data-category");
      filterProducts();
      updateCategoryTitle();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortProducts(this.value);
    });
  }

  if (cartBtn) {
    cartBtn.addEventListener("click", toggleCart);
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", toggleCart);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener("click", toggleCart);
  }

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

  const closeModalBtn = document.getElementById("closeModal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
}

function renderProducts() {
  if (!productGrid) return;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 32px; margin-bottom: 20px;">Search</div>
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
            ${
              product.isNew || product.discount
                ? `
                  <div class="product-badges">
                    ${product.isNew ? '<span class="badge-new">New</span>' : ""}
                    ${product.discount ? `<span class="badge-sale">${product.discount}% OFF</span>` : ""}
                  </div>
                `
                : ""
            }
            <div class="product-actions">
                    <button class="action-icon wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" 
                            onclick="toggleWishlist(${product.id})" 
                            title="${isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}"
                            aria-label="${isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}"></button>
                    <button class="action-icon" onclick="quickView(${product.id})" title="Quick view" aria-label="Quick view"></button>
                </div>
          </div>
          <div class="product-info">
            <div class="product-brand">${product.brand}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
              <span class="price-current">Rs.${product.price}</span>
              ${
                product.originalPrice
                  ? `
                    <span class="price-original">Rs.${product.originalPrice}</span>
                    <span class="price-discount">(${product.discount}% OFF)</span>
                  `
                  : ""
              }
            </div>
            <button class="add-to-cart-btn" onclick="quickView(${product.id})">Select Size</button>
          </div>
        </div>
      `
    )
    .join("");
}

function filterProducts() {
  let filtered = [...accessoriesProducts];

  if (currentCategory !== "all") {
    filtered = filtered.filter((product) => product.category === currentCategory);
  }

  const searchTerm = searchInput ? searchInput.value : "";
  if (searchTerm) {
    filtered = filtered.filter(
      (product) =>
        matchesSearch(
          [
            product.name,
            product.brand,
            product.category,
            product.subcategory,
            (product.sizes || []).join(" "),
            product.isNew ? "new latest trending" : ""
          ],
          searchTerm
        )
    );
  }

  filteredProducts = filtered;
  sortProducts(sortSelect ? sortSelect.value : "default", false);
  renderProducts();
}

function sortProducts(sortType, shouldRender = true) {
  switch (sortType) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "new":
      filteredProducts.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "popular":
      filteredProducts.sort((a, b) => b.ratingCount - a.ratingCount);
      break;
    default:
      break;
  }

  if (shouldRender) {
    renderProducts();
  }
}

function updateCategoryTitle() {
  const categoryNames = {
    all: "All Accessories",
    "phone-cases": "Phone Cases",
    charms: "Charms",
    shoes: "Shoes & Sneakers",
    earrings: "Earrings",
    headbands: "Headbands",
    "waist-chains": "Waist Chains",
    caps: "Men's Caps",
    watches: "Watches",
    chains: "Chains",
    bracelets: "Bracelets",
  };

  if (categoryTitle) {
    categoryTitle.textContent = categoryNames[currentCategory] || "Accessories";
  }
}

function addToCart(productId, selectedSize = null) {
  const product = accessoriesProducts.find((item) => item.id === productId);
  if (!product) return false;

  const sizeToAdd =
    selectedSize !== null && selectedSize !== undefined
      ? selectedSize
      : quickViewSelectedSize;

  if (Array.isArray(product.sizes) && product.sizes.length > 0 && !sizeToAdd) {
    showNotification("Please select a size first");
    return false;
  }

  const existingItem = cart.find(
    (item) =>
      item.id === productId && (item.selectedSize || null) === (sizeToAdd || null)
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
    (item) =>
      !(
        item.id === productId &&
        (item.selectedSize || null) === (selectedSize || null)
      )
  );
  saveCart();
  updateCartCount();
  renderCart();
}

function updateQuantity(productId, selectedSize, change) {
  const item = cart.find(
    (cartItem) =>
      cartItem.id === productId &&
      (cartItem.selectedSize || null) === (selectedSize || null)
  );
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId, selectedSize);
    return;
  }

  saveCart();
  updateCartCount();
  renderCart();
}

function renderCart() {
  if (!cartItems || !totalPrice) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">Cart</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
      </div>
    `;
    totalPrice.textContent = "Rs.0";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-details">${item.brand} • Size: ${item.selectedSize || "N/A"}</div>
            <div class="cart-item-price">Rs.${item.price}</div>
            <div class="cart-item-actions">
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.selectedSize || ""}', -1)">-</button>
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
  totalPrice.textContent = `Rs.${total.toLocaleString()}`;
}

function toggleCart() {
  if (!cartSidebar || !cartOverlay) return;

  cartSidebar.classList.toggle("active");
  cartOverlay.classList.toggle("active");
  if (cartSidebar.classList.contains("active")) {
    renderCart();
  }
}

function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  if (!cartCount) return;

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const product = accessoriesProducts.find((item) => item.id === productId);
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

function quickView(productId) {
  const product = accessoriesProducts.find((item) => item.id === productId);
  if (!product) return;

  const modal = document.getElementById("quickViewModal");
  const modalBody = document.getElementById("modalBody");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px; padding: 12px;">
      <div>
        <img src="${product.image}" alt="${product.name}" style="width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 16px;">
      </div>
      <div>
        <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; margin-bottom: 10px;">${product.brand}</div>
        <h2 style="font-size: 28px; margin-bottom: 15px;">${product.name}</h2>
        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
          <span style="font-size: 32px; font-weight: 700;">Rs.${product.price}</span>
          ${product.originalPrice ? `<span style="font-size: 20px; color: var(--text-light); text-decoration: line-through;">Rs.${product.originalPrice}</span><span style="font-size: 16px; color: var(--primary); font-weight: 600;">(${product.discount}% OFF)</span>` : ""}
        </div>
        <div style="margin-bottom: 24px;">
          <div style="font-weight: 600; margin-bottom: 10px;">Available Sizes</div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${product.sizes
              .map(
                (size) => `
                  <button
                    class="size-btn"
                    type="button"
                    data-size="${size}"
                    style="position: relative;"
                    onclick="selectQuickViewSize('${size}')"
                  >${size}</button>
                `
              )
              .join("")}
          </div>
        </div>
        <div style="display: flex; gap: 15px; margin-bottom: 25px;">
          <button data-quick-view-add disabled onclick="handleQuickViewAddToCart(${product.id})" style="flex: 1; padding: 15px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: not-allowed; opacity: 0.45;">Select size to add</button>
          <button onclick="toggleWishlist(${product.id})" style="padding: 15px 20px; background: white; border: 2px solid var(--border-color); border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;">${isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}</button>
        </div>
        <div style="padding: 20px; background: var(--bg-light); border-radius: 12px;">
          <h4 style="margin-bottom: 10px;">Product Details</h4>
          <p style="color: var(--text-light); line-height: 1.8;">Premium ${product.category} accessory from ${product.brand}. Designed to finish the look with clean styling and everyday usability.</p>
        </div>
      </div>
    </div>
  `;

  quickViewSelectedSize = null;
  modal.classList.add("active");
}

function selectQuickViewSize(size) {
  quickViewSelectedSize = size;

  const modal = document.getElementById("quickViewModal");
  if (!modal) return;

  modal.querySelectorAll(".size-btn[data-size]").forEach((btn) => {
    const btnSize = btn.getAttribute("data-size");
    btn.classList.toggle("active", btnSize === String(size));
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
  if (modal) {
    modal.classList.remove("active");
  }
  quickViewSelectedSize = null;
}

function getStarRating(rating) {
  return `${Number(rating).toFixed(1)}/5`;
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--secondary-color);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: var(--shadow-hover);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
