
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
// MEN'S PRODUCTS DATA
// ==========================================
const menProducts = [
    // T-SHIRTS
    {
        id: 1001,
        name: 'Classic Cotton T-Shirt',
        brand: 'Bellevouix',
        category: 'tshirts',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        rating: 4.5,
        ratingCount: 245,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 50
    },
    {
        id: 1002,
        name: 'Graphic Print Tee',
        brand: 'StreetStyle',
        category: 'tshirts',
        price: 899,
        originalPrice: 1499,
        discount: 40,
        rating: 4.6,
        ratingCount: 312,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 45
    },
    {
        id: 1003,
        name: 'V-Neck Basic Tee',
        brand: 'Essentials',
        category: 'tshirts',
        price: 699,
        originalPrice: 1199,
        discount: 42,
        rating: 4.4,
        ratingCount: 189,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 60
    },
    {
        id: 1004,
        name: 'Polo Neck T-Shirt',
        brand: 'ClassicWear',
        category: 'tshirts',
        price: 1099,
        originalPrice: 1799,
        discount: 39,
        rating: 4.7,
        ratingCount: 267,
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['M', 'L', 'XL', 'XXL'],
        stock: 35
    },

    // SHIRTS
    {
        id: 1005,
        name: 'Casual Denim Shirt',
        brand: 'UrbanStyle',
        category: 'shirts',
        price: 1499,
        originalPrice: 2299,
        discount: 35,
        rating: 4.5,
        ratingCount: 198,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 40
    },
    {
        id: 1006,
        name: 'Formal White Shirt',
        brand: 'CorporateWear',
        category: 'shirts',
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        rating: 4.8,
        ratingCount: 423,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 55
    },
    {
        id: 1007,
        name: 'Checkered Casual Shirt',
        brand: 'Bellevouix',
        category: 'shirts',
        price: 1399,
        originalPrice: 2199,
        discount: 36,
        rating: 4.6,
        ratingCount: 334,
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['M', 'L', 'XL', 'XXL'],
        stock: 42
    },
    {
        id: 1008,
        name: 'Linen Beach Shirt',
        brand: 'SummerVibes',
        category: 'shirts',
        price: 1599,
        originalPrice: 2499,
        discount: 36,
        rating: 4.7,
        ratingCount: 289,
        image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 38
    },

    // JEANS & PANTS
    {
        id: 1009,
        name: 'Slim Fit Jeans',
        brand: 'DenimCo',
        category: 'jeans',
        price: 1899,
        originalPrice: 2999,
        discount: 37,
        rating: 4.8,
        ratingCount: 567,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['28', '30', '32', '34', '36'],
        stock: 48
    },
    {
        id: 1010,
        name: 'Relaxed Fit Jeans',
        brand: 'ComfortDenim',
        category: 'jeans',
        price: 1799,
        originalPrice: 2799,
        discount: 36,
        rating: 4.6,
        ratingCount: 412,
        image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['28', '30', '32', '34', '36', '38'],
        stock: 52
    },
    {
        id: 1011,
        name: 'Black Skinny Jeans',
        brand: 'TrendyDenim',
        category: 'jeans',
        price: 1999,
        originalPrice: 3199,
        discount: 38,
        rating: 4.7,
        ratingCount: 498,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['28', '30', '32', '34', '36'],
        stock: 44
    },
    {
        id: 1012,
        name: 'Cargo Pants',
        brand: 'UrbanUtility',
        category: 'jeans',
        price: 1699,
        originalPrice: 2599,
        discount: 35,
        rating: 4.5,
        ratingCount: 356,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 40
    },
    {
        id: 1013,
        name: 'Chino Pants',
        brand: 'SmartCasual',
        category: 'jeans',
        price: 1499,
        originalPrice: 2299,
        discount: 35,
        rating: 4.6,
        ratingCount: 278,
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['28', '30', '32', '34', '36'],
        stock: 46
    },

    // JACKETS
    {
        id: 1014,
        name: 'Denim Jacket',
        brand: 'ClassicDenim',
        category: 'jackets',
        price: 2499,
        originalPrice: 3999,
        discount: 38,
        rating: 4.8,
        ratingCount: 689,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['M', 'L', 'XL', 'XXL'],
        stock: 30
    },
    {
        id: 1015,
        name: 'Bomber Jacket',
        brand: 'StreetWear',
        category: 'jackets',
        price: 2799,
        originalPrice: 4299,
        discount: 35,
        rating: 4.7,
        ratingCount: 534,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 28
    },
    {
        id: 1016,
        name: 'Leather Jacket',
        brand: 'LuxeStyle',
        category: 'jackets',
        price: 4999,
        originalPrice: 7999,
        discount: 38,
        rating: 4.9,
        ratingCount: 812,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['M', 'L', 'XL'],
        stock: 20
    },
    {
        id: 1017,
        name: 'Windbreaker Jacket',
        brand: 'ActiveWear',
        category: 'jackets',
        price: 1999,
        originalPrice: 2999,
        discount: 33,
        rating: 4.5,
        ratingCount: 445,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 35
    },

    // HOODIES
    {
        id: 1018,
        name: 'Classic Pullover Hoodie',
        brand: 'ComfortWear',
        category: 'hoodies',
        price: 1599,
        originalPrice: 2499,
        discount: 36,
        rating: 4.7,
        ratingCount: 678,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 55
    },
    {
        id: 1019,
        name: 'Zip-Up Hoodie',
        brand: 'SportStyle',
        category: 'hoodies',
        price: 1699,
        originalPrice: 2699,
        discount: 37,
        rating: 4.6,
        ratingCount: 523,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 48
    },
    {
        id: 1020,
        name: 'Oversized Hoodie',
        brand: 'StreetStyle',
        category: 'hoodies',
        price: 1799,
        originalPrice: 2799,
        discount: 36,
        rating: 4.8,
        ratingCount: 734,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['M', 'L', 'XL', 'XXL'],
        stock: 42
    },
    {
        id: 1021,
        name: 'Tech Fleece Hoodie',
        brand: 'TechWear',
        category: 'hoodies',
        price: 2199,
        originalPrice: 3499,
        discount: 37,
        rating: 4.7,
        ratingCount: 589,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 38
    },

    // SHORTS
    {
        id: 1022,
        name: 'Denim Shorts',
        brand: 'SummerStyle',
        category: 'shorts',
        price: 999,
        originalPrice: 1599,
        discount: 38,
        rating: 4.5,
        ratingCount: 312,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['28', '30', '32', '34', '36'],
        stock: 50
    },
    {
        id: 1023,
        name: 'Cargo Shorts',
        brand: 'OutdoorWear',
        category: 'shorts',
        price: 1199,
        originalPrice: 1899,
        discount: 37,
        rating: 4.6,
        ratingCount: 267,
        image: 'https://images.unsplash.com/photo-1591195850194-6b838b2fa2b3?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 45
    },
    {
        id: 1024,
        name: 'Athletic Shorts',
        brand: 'ActiveWear',
        category: 'shorts',
        price: 899,
        originalPrice: 1499,
        discount: 40,
        rating: 4.7,
        ratingCount: 445,
        image: 'https://images.unsplash.com/photo-1591195851194-22d37f3bc30e?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 60
    },
    {
        id: 1025,
        name: 'Chino Shorts',
        brand: 'SmartCasual',
        category: 'shorts',
        price: 1099,
        originalPrice: 1799,
        discount: 39,
        rating: 4.5,
        ratingCount: 334,
        image: 'https://images.unsplash.com/photo-1591195850194-6b838b2fa2b3?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['28', '30', '32', '34', '36'],
        stock: 42
    },

    // SPORTSWEAR
    {
        id: 1026,
        name: 'Running Track Pants',
        brand: 'AthleticPro',
        category: 'sportswear',
        price: 1499,
        originalPrice: 2299,
        discount: 35,
        rating: 4.6,
        ratingCount: 489,
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 48
    },
    {
        id: 1027,
        name: 'Compression T-Shirt',
        brand: 'FitGear',
        category: 'sportswear',
        price: 999,
        originalPrice: 1699,
        discount: 41,
        rating: 4.7,
        ratingCount: 567,
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 55
    },
    {
        id: 1028,
        name: 'Training Joggers',
        brand: 'ActiveWear',
        category: 'sportswear',
        price: 1699,
        originalPrice: 2599,
        discount: 35,
        rating: 4.8,
        ratingCount: 623,
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
        isNew: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 50
    },
    {
        id: 1029,
        name: 'Sports Tank Top',
        brand: 'GymWear',
        category: 'sportswear',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        rating: 4.5,
        ratingCount: 398,
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 58
    },
    {
        id: 1030,
        name: 'Performance Shorts',
        brand: 'AthleticPro',
        category: 'sportswear',
        price: 1099,
        originalPrice: 1799,
        discount: 39,
        rating: 4.6,
        ratingCount: 456,
        image: 'https://images.unsplash.com/photo-1591195851194-22d37f3bc30e?w=400&h=500&fit=crop',
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 52
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

menProducts.unshift(...getAdminProductsForStore('men'));

/**
 * SHARED CART & WISHLIST FUNCTIONALITY
 * Cart and wishlist stay in sessionStorage so different logins do not share data.
 */
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let wishlist = JSON.parse(sessionStorage.getItem('wishlist')) || [];

let quickViewSelectedSize = null;

let currentCategory = 'all';
let filteredProducts = [...menProducts];

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
    let filtered = [...menProducts];

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
            filteredProducts = [...menProducts];
    }
    renderProducts();
}

// ==========================================
// UPDATE CATEGORY TITLE
// ==========================================
function updateCategoryTitle() {
    const categoryNames = {
        'all': 'All Men\'s Products',
        'tshirts': 'T-Shirts',
        'shirts': 'Shirts',
        'jeans': 'Jeans & Pants',
        'jackets': 'Jackets',
        'hoodies': 'Hoodies',
        'shorts': 'Shorts',
        'sportswear': 'Sportswear'
    };
    categoryTitle.textContent = categoryNames[currentCategory] || 'Men\'s Products';
}

// ==========================================
// CART FUNCTIONS
// ==========================================
function addToCart(productId, selectedSize = null) {
    const product = menProducts.find(p => p.id === productId);
    if (!product) return false;

    const sizeToAdd =
        selectedSize !== null && selectedSize !== undefined ? selectedSize : quickViewSelectedSize;

    if (Array.isArray(product.sizes) && product.sizes.length > 0 && !sizeToAdd) {
        showNotification('Please select a size first');
        return false;
    }

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
    const product = menProducts.find(item => item.id === productId);
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
    const product = menProducts.find(p => p.id === productId);
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
