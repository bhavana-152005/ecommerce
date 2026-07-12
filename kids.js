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

// ==========================================
// KIDS PRODUCTS DATA
// ==========================================
const kidsProducts = [
  {
    id: 2001,
    name: "Dino Adventure Tee Set",
    brand: "KiddoWear",
    category: "boys",
    price: 999,
    originalPrice: 1599,
    discount: 38,
    rating: 4.7,
    ratingCount: 248,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
  },
  {
    id: 2002,
    name: "Playtime Denim Jacket",
    brand: "MiniMode",
    category: "boys",
    price: 1499,
    originalPrice: 2299,
    discount: 35,
    rating: 4.6,
    ratingCount: 194,
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-12Y"],
  },
  {
    id: 2003,
    name: "Cool Cargo Co-ord Set",
    brand: "Urban Cubs",
    category: "boys",
    price: 1699,
    originalPrice: 2599,
    discount: 35,
    rating: 4.8,
    ratingCount: 286,
    image:
      "https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
  },
  {
    id: 2004,
    name: "Rainbow Party Dress",
    brand: "Tiny Twirl",
    category: "girls",
    price: 1399,
    originalPrice: 2199,
    discount: 36,
    rating: 4.8,
    ratingCount: 321,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-12Y"],
  },
  {
    id: 2005,
    name: "Floral Weekend Frock",
    brand: "BloomKids",
    category: "girls",
    price: 1199,
    originalPrice: 1899,
    discount: 37,
    rating: 4.5,
    ratingCount: 212,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
  },
  {
    id: 2006,
    name: "Princess Tulle Dress",
    brand: "DressyKids",
    category: "girls",
    price: 1899,
    originalPrice: 2899,
    discount: 34,
    rating: 4.9,
    ratingCount: 402,
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["4-5Y", "6-7Y", "8-9Y"],
  },
  {
    id: 2007,
    name: "Soft Cotton Romper",
    brand: "SnuggleBug",
    category: "infants",
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.7,
    ratingCount: 178,
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["0-3M", "3-6M", "6-9M", "9-12M"],
  },
  {
    id: 2008,
    name: "Sleepy Bear Onesie",
    brand: "LittleNest",
    category: "infants",
    price: 699,
    originalPrice: 1099,
    discount: 36,
    rating: 4.6,
    ratingCount: 145,
    image:
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["0-3M", "3-6M", "6-9M"],
  },
  {
    id: 2009,
    name: "Baby Winter Knit Set",
    brand: "CozyCub",
    category: "infants",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4.8,
    ratingCount: 203,
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["3-6M", "6-9M", "9-12M", "12-18M"],
  },
  {
    id: 2010,
    name: "Cartoon Backpack",
    brand: "Happy Trails",
    category: "accessories",
    price: 899,
    originalPrice: 1399,
    discount: 36,
    rating: 4.6,
    ratingCount: 267,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=500&fit=crop",
    isNew: false,
    sizes: ["Free Size"],
  },
  {
    id: 2011,
    name: "Fun Print Cap Pack",
    brand: "SunnySide",
    category: "accessories",
    price: 599,
    originalPrice: 999,
    discount: 40,
    rating: 4.4,
    ratingCount: 184,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["Free Size"],
  },
  {
    id: 2012,
    name: "School Day Sneaker Pair",
    brand: "JumpStart",
    category: "accessories",
    price: 1599,
    originalPrice: 2399,
    discount: 33,
    rating: 4.7,
    ratingCount: 295,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    isNew: true,
    sizes: ["EU 28", "EU 30", "EU 32", "EU 34"],
  },
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

kidsProducts.unshift(...getAdminProductsForStore("kids"));

/**
 * Cart and wishlist stay in sessionStorage so different logins do not share data.
 */
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
let wishlist = JSON.parse(sessionStorage.getItem("wishlist")) || [];

let quickViewSelectedSize = null;

let currentCategory = "all";
let filteredProducts = [...kidsProducts];

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
  let filtered = [...kidsProducts];

  if (currentCategory !== "all") {
    filtered = filtered.filter((product) => product.category === currentCategory);
  }

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  if (searchTerm) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
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
    all: "All Kids Products",
    boys: "Boys Collection",
    girls: "Girls Collection",
    infants: "Infants Collection",
    accessories: "Kids Accessories",
  };

  if (categoryTitle) {
    categoryTitle.textContent = categoryNames[currentCategory] || "Kids Products";
  }
}

function addToCart(productId, selectedSize = null) {
  const product = kidsProducts.find((item) => item.id === productId);
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
  const product = kidsProducts.find((item) => item.id === productId);
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
  const product = kidsProducts.find((item) => item.id === productId);
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
          ${
            product.originalPrice
              ? `
                <span style="font-size: 20px; color: var(--text-light); text-decoration: line-through;">Rs.${product.originalPrice}</span>
                <span style="font-size: 16px; color: var(--primary-color); font-weight: 600;">(${product.discount}% OFF)</span>
              `
              : ""
          }
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
          <button data-quick-view-add
                  disabled
                  onclick="handleQuickViewAddToCart(${product.id})"
                  style="flex: 1; padding: 15px; background: var(--primary-color); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: not-allowed; opacity: 0.45;">Select size to add</button>
          <button onclick="toggleWishlist(${product.id})"
                  style="padding: 15px 20px; background: white; border: 2px solid var(--border-color); border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;">${
                    isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"
                  }</button>
        </div>
        <div style="padding: 20px; background: var(--bg-light); border-radius: 12px;">
          <h4 style="margin-bottom: 10px;">Product Details</h4>
          <p style="color: var(--text-light); line-height: 1.8;">Comfortable kidswear from ${product.brand}. Built for active days, soft movement, and easy styling across every little adventure.</p>
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
