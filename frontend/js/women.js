
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
// WOMEN'S PRODUCTS DATA
// ==========================================
const womenProducts = [
    // DRESSES
    {
        id: 1,
        name: 'Floral Maxi Dress',
        brand: 'Bellevouix',
        category: 'dresses',
        price: 1899,
        originalPrice: 2999,
        discount: 37,
        rating: 4.7,
        ratingCount: 342,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 2,
        name: 'Summer Cotton Dress',
        brand: 'FashionX',
        category: 'dresses',
        price: 1599,
        originalPrice: 2499,
        discount: 36,
        rating: 4.5,
        ratingCount: 289,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L']
    },
    {
        id: 3,
        name: 'Party Wear Gown',
        brand: 'GlamourX',
        category: 'dresses',
        price: 3999,
        originalPrice: 5999,
        discount: 33,
        rating: 4.9,
        ratingCount: 512,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL']
    },

    // TOPS & BLOUSES
    {
        id: 4,
        name: 'Silk Blouse',
        brand: 'Elegance',
        category: 'tops',
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        rating: 4.6,
        ratingCount: 234,
        image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 5,
        name: 'Casual Crop Top',
        brand: 'TrendyWear',
        category: 'tops',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        rating: 4.4,
        ratingCount: 456,
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L']
    },
    {
        id: 6,
        name: 'Designer Top',
        brand: 'Bellevouix',
        category: 'tops',
        price: 1499,
        originalPrice: 2299,
        discount: 35,
        rating: 4.7,
        ratingCount: 198,
        image: 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL']
    },

    // JEANS & PANTS
    {
        id: 7,
        name: 'High Waist Jeans',
        brand: 'DenimCo',
        category: 'jeans',
        price: 1899,
        originalPrice: 2999,
        discount: 37,
        rating: 4.8,
        ratingCount: 678,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['28', '30', '32', '34']
    },
    {
        id: 8,
        name: 'Skinny Fit Jeans',
        brand: 'FashionX',
        category: 'jeans',
        price: 1699,
        originalPrice: 2599,
        discount: 35,
        rating: 4.6,
        ratingCount: 423,
        image: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['28', '30', '32', '34', '36']
    },
    {
        id: 9,
        name: 'Palazzo Pants',
        brand: 'ComfortWear',
        category: 'jeans',
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        rating: 4.5,
        ratingCount: 312,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL']
    },

    // ETHNIC WEAR
    {
        id: 10,
        name: 'Ethnic Kurta Set',
        brand: 'TraditionalWear',
        category: 'ethnic',
        price: 2299,
        originalPrice: 3499,
        discount: 34,
        rating: 4.8,
        ratingCount: 567,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 11,
        name: 'Designer Saree',
        brand: 'SilkHeritage',
        category: 'ethnic',
        price: 3999,
        originalPrice: 5999,
        discount: 33,
        rating: 4.9,
        ratingCount: 789,
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['One Size']
    },
    {
        id: 12,
        name: 'Anarkali Suit',
        brand: 'EthnicStyle',
        category: 'ethnic',
        price: 2799,
        originalPrice: 4299,
        discount: 35,
        rating: 4.7,
        ratingCount: 445,
        image: 'https://images.unsplash.com/photo-1583391265373-83b386c15268?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL']
    },

    // WESTERN WEAR
    {
        id: 13,
        name: 'Jumpsuit',
        brand: 'ModernStyle',
        category: 'western',
        price: 2499,
        originalPrice: 3799,
        discount: 34,
        rating: 4.6,
        ratingCount: 334,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 14,
        name: 'Blazer Set',
        brand: 'CorporateWear',
        category: 'western',
        price: 3299,
        originalPrice: 4999,
        discount: 34,
        rating: 4.8,
        ratingCount: 267,
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 15,
        name: 'Formal Skirt',
        brand: 'OfficeWear',
        category: 'western',
        price: 1499,
        originalPrice: 2299,
        discount: 35,
        rating: 4.5,
        ratingCount: 198,
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL']
    }
];

function getAdminProductsForStore(category) {
    try {
        return JSON.parse(localStorage.getItem('adminProducts') || '[]')
            .filter(product => product.category === category)
            .map(product => ({
                ...product,
                price: Number(product.price) || 0,
                originalPrice: Number(product.originalPrice) || null,
                stock: Number(product.stock || 0),
                rating: Number(product.rating || 0),
                ratingCount: Number(product.ratingCount || 0),
                sizes: Array.isArray(product.sizes) ? product.sizes : [],
                isAdminProduct: true
            }));
    } catch (error) {
        return [];
    }
}

womenProducts.unshift(...getAdminProductsForStore('women'));

/**
 * SHARED CART & WISHLIST FUNCTIONALITY
 * Cart and wishlist stay in sessionStorage so different logins do not share data.
 */
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let wishlist = JSON.parse(sessionStorage.getItem('wishlist')) || [];

let quickViewSelectedSize = null;

let currentCategory = 'all';
let filteredProducts = [...womenProducts];

// ==========================================
// DOM ELEMENTS
// ==========================================
const productGrid = document.getElementById('productGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryTitle = document.getElementById('categoryTitle');
const tabBtns = document.querySelectorAll('.tab-btn');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    updateWishlistCount();
    setupEventListeners();
});

// ==========================================
// SETUP EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Category tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category');
            filterProducts();
            updateCategoryTitle();
        });
    });

    // Search
    searchInput.addEventListener('input', filterProducts);

    // Sort
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });

    // Cart
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
}

// ==========================================
// RENDER PRODUCTS
// ==========================================
function renderProducts() {
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="font-size: 24px; margin-bottom: 10px;">No products found</h3>
                <p style="color: var(--text-light);">Try adjusting your filters or search term</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.05}s">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                
                ${product.isNew || product.discount ? `
                    <div class="product-badges">
                        ${product.isNew ? '<span class="badge-new">New</span>' : ''}
                        ${product.discount ? `<span class="badge-sale">${product.discount}% OFF</span>` : ''}
                    </div>
                ` : ''}
                
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
                    ${product.originalPrice ? `
                        <span class="price-original">Rs.${product.originalPrice}</span>
                        <span class="price-discount">(${product.discount}% OFF)</span>
                    ` : ''}
                </div>
                
                <button class="add-to-cart-btn" onclick="quickView(${product.id})">
                    Select Size
                </button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// FILTER PRODUCTS
// ==========================================
function filterProducts() {
    let filtered = [...womenProducts];

    // Category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }

    filteredProducts = filtered;
    renderProducts();
}

// ==========================================
// SORT PRODUCTS
// ==========================================
function sortProducts(sortType) {
    switch(sortType) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'new':
            filteredProducts.sort((a, b) => b.isNew - a.isNew);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.ratingCount - a.ratingCount);
            break;
        default:
            filteredProducts = [...womenProducts];
    }
    renderProducts();
}

// ==========================================
// UPDATE CATEGORY TITLE
// ==========================================
function updateCategoryTitle() {
    const categoryNames = {
        'all': 'All Women\'s Products',
        'dresses': 'Dresses',
        'tops': 'Tops & Blouses',
        'jeans': 'Jeans & Pants',
        'ethnic': 'Ethnic Wear',
        'western': 'Western Wear'
    };
    categoryTitle.textContent = categoryNames[currentCategory] || 'Women\'s Products';
}

// ==========================================
// CART FUNCTIONS
// ==========================================
function addToCart(productId, selectedSize = null) {
    const product = womenProducts.find(p => p.id === productId);
    if (!product) return false;

    const sizeToAdd =
        selectedSize !== null && selectedSize !== undefined ? selectedSize : quickViewSelectedSize;

    // require size if product has sizes
    if (Array.isArray(product.sizes) && product.sizes.length > 0 && !sizeToAdd) {
        showNotification('Please select a size first');
        return false;
    }

    // unique cart line by (id + selectedSize)
    const existingItem = cart.find(
        item => item.id === productId && (item.selectedSize || null) === (sizeToAdd || null)
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1, selectedSize: sizeToAdd || null });
    }

    saveCart();
    updateCartCount();
    renderCart();
    showNotification('Added to cart!');
    return true;
}

function removeFromCart(productId, selectedSize = null) {
    cart = cart.filter(
        item => !(item.id === productId && (item.selectedSize || null) === (selectedSize || null))
    );
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, selectedSize, change) {
    const item = cart.find(
        it => it.id === productId && (it.selectedSize || null) === (selectedSize || null)
    );

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, selectedSize);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon"></div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        totalPrice.textContent = 'Rs.0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">${item.brand} - Size: ${item.selectedSize || 'N/A'}</div>
                <div class="cart-item-price">Rs.${item.price}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.selectedSize || ''}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.selectedSize || ''}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.selectedSize || ''}')">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `Rs.${total.toLocaleString()}`;
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    if (cartSidebar.classList.contains('active')) {
        renderCart();
    }
}

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// ==========================================
// WISHLIST FUNCTIONS
// ==========================================
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const product = womenProducts.find(item => item.id === productId);
    const savedProducts = JSON.parse(sessionStorage.getItem('wishlistProducts') || '{}');

    if (index > -1) {
        wishlist.splice(index, 1);
        delete savedProducts[String(productId)];
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        if (product) savedProducts[String(productId)] = product;
        showNotification('Added to wishlist!');
    }

    sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
    sessionStorage.setItem('wishlistProducts', JSON.stringify(savedProducts));
    updateWishlistCount();
    renderProducts();
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

// ==========================================
// QUICK VIEW MODAL
// ==========================================
function quickView(productId) {
    const product = womenProducts.find(p => p.id === productId);
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');

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
                    <span style="font-size: 32px; font-weight: 700;">Rs.${product.price}</span>
                    ${product.originalPrice ? `
                        <span style="font-size: 20px; color: var(--text-light); text-decoration: line-through;">
                            Rs.${product.originalPrice}
                        </span>
                        <span style="font-size: 16px; color: var(--primary); font-weight: 600;">
                            (${product.discount}% OFF)
                        </span>
                    ` : ''}
                </div>

                <div style="margin-bottom: 25px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">Select Size:</div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${product.sizes.map(size => `
                            <button
                                class="size-btn"
                                type="button"
                                data-size="${size}"
                                style="position: relative;"
                                onclick="selectQuickViewSize('${size}')"
                            >${size}</button>
                        `).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 15px; margin-bottom: 25px;">
                    <button data-quick-view-add
                            disabled
                            onclick="handleQuickViewAddToCart(${product.id})"
                            style="flex: 1; padding: 15px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: not-allowed; opacity: 0.45;">
                        Select size to add
                    </button>
                    <button onclick="toggleWishlist(${product.id})"
                            style="padding: 15px 20px; background: white; border: 2px solid var(--border-color); border-radius: 8px; font-size: 20px; cursor: pointer;">
                        ${isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>

                <div style="padding: 20px; background: var(--bg-light); border-radius: 8px;">
                    <h4 style="margin-bottom: 10px;">Product Details</h4>
                    <p style="color: var(--text-light); line-height: 1.8;">
                        High-quality ${product.category} from ${product.brand}. 
                        Perfect for everyday use with comfortable fit and premium materials.
                    </p>
                </div>
            </div>
        </div>
    `;

    // reset selection each time modal opens
    quickViewSelectedSize = null;
    modal.classList.add('active');
}

function selectQuickViewSize(size) {
    quickViewSelectedSize = size;

    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    modal.querySelectorAll('.size-btn[data-size]').forEach(btn => {
        const btnSize = btn.getAttribute('data-size');
        btn.classList.toggle('active', btnSize === String(size));
    });

    const addButton = modal.querySelector('[data-quick-view-add]');
    if (addButton) {
        addButton.disabled = false;
        addButton.textContent = 'Add to Cart';
        addButton.style.opacity = '1';
        addButton.style.cursor = 'pointer';
    }
}

function handleQuickViewAddToCart(productId) {
    if (addToCart(productId, quickViewSelectedSize)) {
        closeModal();
    }
}

function closeModal() {
    document.getElementById('quickViewModal').classList.remove('active');
    quickViewSelectedSize = null;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function getStarRating(rating) {
    return `${Number(rating).toFixed(1)}/5`;
}

function showNotification(message) {
    const notification = document.createElement('div');
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
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

