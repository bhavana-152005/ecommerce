function applyTheme() {
    const theme = localStorage.getItem('bellevouixTheme') || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = theme === 'dark';
        const modeText = document.querySelector('.theme-mode-text');
        if (modeText) {
            modeText.textContent = theme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled';
        }
    }
}

function toggleThemeMode() {
    const themeToggle = document.getElementById('themeToggle');
    const isDark = themeToggle ? themeToggle.checked : false;
    localStorage.setItem('bellevouixTheme', isDark ? 'dark' : 'light');
    applyTheme();
}

function openSettingsSheet() {
    const sheet = document.getElementById('settingsSheet');
    const backdrop = document.getElementById('sheetBackdrop');
    if (sheet && backdrop) {
        sheet.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSettingsSheet() {
    const sheet = document.getElementById('settingsSheet');
    const backdrop = document.getElementById('sheetBackdrop');
    if (sheet && backdrop) {
        sheet.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function scrollToSection(id) {
    const section = document.querySelector(`[data-section-id="${id}"]`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeSettingsSheet();
    }
}

function openPasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function savePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all password fields.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New password and confirmation do not match.');
        return;
    }

    alert('Password change request received. This is a demo page, so your password is not actually saved.');
    closePasswordModal();
}

function loadSettingsPage() {
    const role = sessionStorage.getItem('userRole');
    if (window.location.pathname.endsWith('settings.html')) {
        if (role === 'admin') {
            window.location.href = 'admin.html';
            return;
        }
        if (!role) {
            window.location.href = 'login.html';
            return;
        }

        const username = sessionStorage.getItem('username') || 'Guest';
        const email = username === 'Admin' ? 'admin@bellevouix.com' : `${username.toLowerCase().replace(/\s+/g, '')}@bellevouix.com`;
        const orderCount = JSON.parse(localStorage.getItem('orders') || '[]').length;
        const trackCount = JSON.parse(localStorage.getItem('trackedOrders') || '[]').length;

        const userNameEl = document.getElementById('settingsUserName');
        const userEmailEl = document.getElementById('settingsUserEmail');
        const orderCountEl = document.getElementById('orderCount');
        const trackCountEl = document.getElementById('trackCount');

        if (userNameEl) userNameEl.textContent = username;
        if (userEmailEl) userEmailEl.textContent = email;
        if (orderCountEl) orderCountEl.textContent = orderCount;
        if (trackCountEl) trackCountEl.textContent = trackCount;
    }
}

function initGlobalHeaderSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (currentPage === 'index.html') return;

    const searchContainer = searchInput.closest('.search-container');
    if (!searchContainer) return;

    let suggestionsBox = document.getElementById('searchSuggestions');
    if (!suggestionsBox) {
        suggestionsBox = document.createElement('div');
        suggestionsBox.id = 'searchSuggestions';
        suggestionsBox.className = 'search-suggestions';
        suggestionsBox.hidden = true;
        searchContainer.appendChild(suggestionsBox);
    }

    const searchIcon = searchContainer.querySelector('.search-icon');
    const searchTopics = [
        { label: 'T-Shirts', query: 't-shirt', subtitle: 'Trending category', type: 'Category' },
        { label: 'Shirts', query: 'shirt', subtitle: 'Trending category', type: 'Category' },
        { label: 'Dresses', query: 'dress', subtitle: 'Trending category', type: 'Category' },
        { label: 'Jeans', query: 'jeans', subtitle: 'Trending category', type: 'Category' },
        { label: 'Jackets', query: 'jacket', subtitle: 'Trending category', type: 'Category' },
        { label: 'Kurtas', query: 'kurta', subtitle: 'Trending category', type: 'Category' },
        { label: 'Kids Wear', query: 'kids', subtitle: 'Trending category', type: 'Category' },
        { label: 'Accessories', query: 'accessories', subtitle: 'Trending category', type: 'Category' },
        { label: 'Classic Cotton T-Shirt', query: 'Classic Cotton T-Shirt', subtitle: 'Product result', type: 'Product' },
        { label: 'Floral Summer Dress', query: 'Floral Summer Dress', subtitle: 'Product result', type: 'Product' },
        { label: 'Slim Fit Jeans', query: 'Slim Fit Jeans', subtitle: 'Product result', type: 'Product' },
        { label: 'Denim Jacket', query: 'Denim Jacket', subtitle: 'Product result', type: 'Product' }
    ];

    let currentSuggestions = [];
    let activeSuggestionIndex = -1;

    function normalize(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getSuggestions(query) {
        const normalizedQuery = normalize(query);
        if (!normalizedQuery) return searchTopics.slice(0, 8);

        return searchTopics
            .filter(item => normalize(`${item.label} ${item.query} ${item.subtitle}`).includes(normalizedQuery))
            .slice(0, 8);
    }

    function renderSuggestions(query) {
        currentSuggestions = getSuggestions(query);
        activeSuggestionIndex = -1;

        if (currentSuggestions.length === 0) {
            suggestionsBox.hidden = true;
            suggestionsBox.innerHTML = '';
            return;
        }

        const categories = currentSuggestions.filter(item => item.type === 'Category');
        const productsList = currentSuggestions.filter(item => item.type === 'Product');
        const sections = [];

        if (categories.length > 0) {
            sections.push(`
                <div class="search-suggestion-section">
                    <div class="search-suggestion-heading">${normalize(query) ? 'Suggested Searches' : 'Popular Searches'}</div>
                    ${categories.map(item => {
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
                    }).join('')}
                </div>
            `);
        }

        if (productsList.length > 0) {
            sections.push(`
                <div class="search-suggestion-section">
                    <div class="search-suggestion-heading">Products</div>
                    ${productsList.map(item => {
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
                    }).join('')}
                </div>
            `);
        }

        suggestionsBox.innerHTML = sections.join('');

        suggestionsBox.hidden = false;
    }

    function hideSuggestions() {
        suggestionsBox.hidden = true;
        activeSuggestionIndex = -1;
    }

    function highlightActiveSuggestion() {
        suggestionsBox.querySelectorAll('.search-suggestion-item').forEach((item, index) => {
            item.classList.toggle('active', index === activeSuggestionIndex);
        });
    }

    function goToDashboardSearch(term) {
        const query = String(term || '').trim();
        if (!query) return;
        window.location.href = `index.html?search=${encodeURIComponent(query)}#productGrid`;
    }

    searchInput.addEventListener('input', function() {
        renderSuggestions(this.value);
    });

    searchInput.addEventListener('focus', function() {
        renderSuggestions(this.value);
    });

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowDown' && currentSuggestions.length > 0) {
            event.preventDefault();
            activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, currentSuggestions.length - 1);
            highlightActiveSuggestion();
            return;
        }

        if (event.key === 'ArrowUp' && currentSuggestions.length > 0) {
            event.preventDefault();
            activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
            highlightActiveSuggestion();
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            const selected = currentSuggestions[activeSuggestionIndex];
            goToDashboardSearch(selected ? selected.query : searchInput.value);
        }

        if (event.key === 'Escape') {
            hideSuggestions();
        }
    });

    suggestionsBox.addEventListener('click', function(event) {
        const trigger = event.target.closest('.search-suggestion-item');
        if (!trigger) return;

        const selected = currentSuggestions[Number(trigger.dataset.index)];
        if (selected) {
            goToDashboardSearch(selected.query);
        }
    });

    if (searchIcon) {
        searchIcon.style.pointerEvents = 'auto';
        searchIcon.style.cursor = 'pointer';
        searchIcon.addEventListener('click', function() {
            goToDashboardSearch(searchInput.value);
        });
    }

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            hideSuggestions();
        }
    });
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function getLogoFallbackPath() {
    return '../images/bellevouix-logo.png';
}

function attachImageFallbacks() {
    if (!document.body.dataset.globalImageFallback) {
        document.body.dataset.globalImageFallback = 'true';
        document.addEventListener('error', function(event) {
            const img = event.target;
            if (!(img instanceof HTMLImageElement) || img.dataset.usedFallback) return;
            img.dataset.usedFallback = 'true';
            img.src = getLogoFallbackPath();
            img.classList.add('image-fallback');
        }, true);
    }

    document.querySelectorAll('img').forEach(img => {
        if (img.dataset.fallbackReady) return;
        img.dataset.fallbackReady = 'true';
        img.addEventListener('error', function() {
            if (this.dataset.usedFallback) return;
            this.dataset.usedFallback = 'true';
            this.src = getLogoFallbackPath();
            this.classList.add('image-fallback');
        });
    });
}

function getPageProducts() {
    try {
        if (Array.isArray(products)) return products;
    } catch (error) {}

    try {
        if (Array.isArray(menProducts)) return menProducts;
    } catch (error) {}

    try {
        if (Array.isArray(womenProducts)) return womenProducts;
    } catch (error) {}

    try {
        if (Array.isArray(kidsProducts)) return kidsProducts;
    } catch (error) {}

    try {
        if (Array.isArray(accessoriesProducts)) return accessoriesProducts;
    } catch (error) {}

    return [];
}

function getAllStoredProducts() {
    const pageProducts = getPageProducts();
    const cartProducts = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const wishlistProducts = Object.values(JSON.parse(sessionStorage.getItem('wishlistProducts') || '{}'));
    const productMap = new Map();

    [...pageProducts, ...cartProducts, ...wishlistProducts].forEach(product => {
        if (product && product.id !== undefined) {
            productMap.set(String(product.id), product);
        }
    });

    return Array.from(productMap.values());
}

function formatRs(value) {
    return `Rs.${Number(value || 0).toLocaleString('en-IN')}`;
}

function buildProductOptionLabel(product) {
    const category = product.category ? ` - ${product.category}` : '';
    return `${product.name}${category}`;
}

function seedReviewsIfNeeded() {
    const existing = JSON.parse(localStorage.getItem('productReviews') || '[]');
    if (existing.length > 0) return;

    localStorage.setItem('productReviews', JSON.stringify([
        {
            id: Date.now() - 3000,
            productId: 'Classic Cotton T-Shirt::1',
            productName: 'Classic Cotton T-Shirt',
            productType: 'men',
            customerName: 'Aarav',
            rating: 5,
            comment: 'Soft fabric and the size was right. Good daily wear.',
            image: '',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
            id: Date.now() - 2000,
            productId: 'Floral Summer Dress::2',
            productName: 'Floral Summer Dress',
            productType: 'women',
            customerName: 'Mira',
            rating: 4,
            comment: 'Looks close to the picture and feels light for summer.',
            image: '',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
    ]));
}

function getReviews() {
    seedReviewsIfNeeded();
    return JSON.parse(localStorage.getItem('productReviews') || '[]');
}

function saveReviews(reviews) {
    localStorage.setItem('productReviews', JSON.stringify(reviews));
}

function initReviewsSection() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid || document.getElementById('reviewsSection')) return;

    const productsForPage = getPageProducts();
    if (productsForPage.length === 0) return;

    const section = document.createElement('section');
    section.className = 'reviews-section';
    section.id = 'reviewsSection';
    section.innerHTML = `
        <div class="container">
            <div class="section-header">
                <div class="section-label">Reviews</div>
                <h2 class="section-title">Customer Reviews</h2>
                <p class="section-subtitle">Share what you bought, add a photo, and read real product feedback.</p>
            </div>
            <div class="reviews-layout">
                <form class="review-form" id="reviewForm">
                    <label>
                        Product
                        <select id="reviewProduct" required></select>
                    </label>
                    <label>
                        Your Name
                        <input id="reviewName" type="text" placeholder="Enter your name" required>
                    </label>
                    <label>
                        Rating
                        <select id="reviewRating" required>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Bad</option>
                        </select>
                    </label>
                    <label>
                        Review
                        <textarea id="reviewComment" placeholder="How was the fit, quality, delivery, or value?" required></textarea>
                    </label>
                    <label>
                        Upload Product Photo
                        <input id="reviewImage" type="file" accept="image/*">
                    </label>
                    <div class="review-upload-preview" id="reviewImagePreview"></div>
                    <button class="primary-button" type="submit">Add Review</button>
                </form>
                <div class="reviews-list-panel">
                    <div class="review-actions">
                        <h3 class="settings-item-title">Recent Reviews</h3>
                        <select id="reviewFilter" class="filter-select"></select>
                    </div>
                    <div id="reviewsList"></div>
                </div>
            </div>
        </div>
    `;

    productGrid.closest('main, section, .featured-section')?.after(section);

    const productSelect = document.getElementById('reviewProduct');
    const filterSelect = document.getElementById('reviewFilter');
    const options = productsForPage
        .map(product => `<option value="${product.name}::${product.id}" data-name="${product.name}" data-type="${product.category || 'product'}">${buildProductOptionLabel(product)}</option>`)
        .join('');

    productSelect.innerHTML = options;
    filterSelect.innerHTML = `<option value="all">All product reviews</option>${options}`;

    setupReviewImagePreview();
    document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);
    filterSelect.addEventListener('change', renderReviews);
    renderReviews();
}

function setupReviewImagePreview() {
    const input = document.getElementById('reviewImage');
    const preview = document.getElementById('reviewImagePreview');
    if (!input || !preview) return;

    input.addEventListener('change', function() {
        preview.innerHTML = '';
        const file = this.files && this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            preview.innerHTML = `<img src="${event.target.result}" alt="Selected review upload">`;
        };
        reader.readAsDataURL(file);
    });
}

function handleReviewSubmit(event) {
    event.preventDefault();

    const productSelect = document.getElementById('reviewProduct');
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const imagePreview = document.querySelector('#reviewImagePreview img');
    const username = sessionStorage.getItem('username') || '';
    const review = {
        id: Date.now(),
        productId: productSelect.value,
        productName: selectedOption.dataset.name,
        productType: selectedOption.dataset.type,
        customerName: document.getElementById('reviewName').value.trim() || username || 'Customer',
        rating: Number(document.getElementById('reviewRating').value),
        comment: document.getElementById('reviewComment').value.trim(),
        image: imagePreview ? imagePreview.src : '',
        createdAt: new Date().toISOString()
    };

    const reviews = getReviews();
    reviews.unshift(review);
    saveReviews(reviews);
    event.target.reset();
    document.getElementById('reviewImagePreview').innerHTML = '';
    renderReviews();
}

function renderReviews() {
    const list = document.getElementById('reviewsList');
    const filter = document.getElementById('reviewFilter');
    if (!list || !filter) return;

    const selectedProduct = filter.value;
    const reviews = getReviews().filter(review => selectedProduct === 'all' || String(review.productId) === selectedProduct);

    if (reviews.length === 0) {
        list.innerHTML = '<div class="review-empty">No reviews yet. Add the first one for this product.</div>';
        return;
    }

    list.innerHTML = reviews.map(review => `
        <article class="review-card">
            <img src="${review.image || getLogoFallbackPath()}" alt="${review.productName}">
            <div>
                <h4>${review.productName}</h4>
                <div class="review-meta">
                    <span>${review.customerName}</span>
                    <span class="review-rating">${review.rating}/5</span>
                    <span>${review.productType}</span>
                </div>
                <p>${review.comment}</p>
            </div>
        </article>
    `).join('');
    attachImageFallbacks();
}

function initWishlistPanel() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (!wishlistBtn || document.getElementById('wishlistModal')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'wishlist-backdrop';
    backdrop.id = 'wishlistBackdrop';

    const modal = document.createElement('div');
    modal.className = 'wishlist-modal';
    modal.id = 'wishlistModal';
    modal.innerHTML = `
        <div class="wishlist-panel">
            <div class="wishlist-header">
                <h2 class="section-title" style="font-size: 1.6rem; margin: 0;">Wishlist</h2>
                <button class="modal-close" id="closeWishlist" aria-label="Close wishlist"></button>
            </div>
            <div id="wishlistItems"></div>
        </div>
    `;

    document.body.append(backdrop, modal);

    wishlistBtn.addEventListener('click', function(event) {
        event.preventDefault();
        renderWishlistPanel();
        backdrop.classList.add('active');
        modal.classList.add('active');
    });

    document.getElementById('closeWishlist').addEventListener('click', closeWishlistPanel);
    backdrop.addEventListener('click', closeWishlistPanel);
}

function closeWishlistPanel() {
    document.getElementById('wishlistBackdrop')?.classList.remove('active');
    document.getElementById('wishlistModal')?.classList.remove('active');
}

function renderWishlistPanel() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;

    const wishlist = JSON.parse(sessionStorage.getItem('wishlist') || '[]').map(String);
    const products = getAllStoredProducts();
    const items = products.filter(product => wishlist.includes(String(product.id)));

    if (items.length === 0) {
        container.innerHTML = '<div class="review-empty">Your wishlist is empty. Save products from the product cards to see them here.</div>';
        return;
    }

    container.innerHTML = `
        <div class="wishlist-grid">
            ${items.map(item => `
                <article class="wishlist-item">
                    <img src="${item.image || getLogoFallbackPath()}" alt="${item.name}">
                    <div class="wishlist-item-body">
                        <div class="wishlist-item-title">${item.name}</div>
                        <div class="wishlist-item-meta">${item.brand || 'Bellevouix'} - ${formatRs(item.price)}</div>
                        <div class="wishlist-item-actions">
                            <button class="mini-btn" type="button" onclick="addWishlistItemToCart('${item.id}')">Add</button>
                            <button class="mini-btn secondary" type="button" onclick="removeWishlistItem('${item.id}')">Remove</button>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
    attachImageFallbacks();
}

function addWishlistItemToCart(productId) {
    const product = getAllStoredProducts().find(item => String(item.id) === String(productId));
    if (!product) return;

    if (Array.isArray(product.sizes) && product.sizes.length > 0 && typeof window.quickView === 'function') {
        closeWishlistPanel();
        window.quickView(product.id);
        return;
    }

    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => String(item.id) === String(productId) && !item.selectedSize);

    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1, selectedSize: null });

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateHeaderCounts();
    renderWishlistPanel();
}

function removeWishlistItem(productId) {
    const wishlist = JSON.parse(sessionStorage.getItem('wishlist') || '[]').filter(id => String(id) !== String(productId));
    const savedProducts = JSON.parse(sessionStorage.getItem('wishlistProducts') || '{}');
    delete savedProducts[String(productId)];
    sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
    sessionStorage.setItem('wishlistProducts', JSON.stringify(savedProducts));
    updateHeaderCounts();
    renderWishlistPanel();
}

function initCartButtonFallback() {
    const cartBtn = document.getElementById('cartBtn');
    if (!cartBtn || document.getElementById('cartSidebar')) return;

    cartBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if ((window.location.pathname.split('/').pop() || '').toLowerCase() === 'checkout.html') {
            document.querySelector('.order-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        window.location.href = 'checkout.html';
    });
}

function updateHeaderCounts() {
    const cartCount = document.getElementById('cartCount');
    const wishlistCount = document.getElementById('wishlistCount');
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const wishlist = JSON.parse(sessionStorage.getItem('wishlist') || '[]');

    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

window.applyTheme = applyTheme;
window.toggleThemeMode = toggleThemeMode;
window.logout = logout;
window.openSettingsSheet = openSettingsSheet;
window.closeSettingsSheet = closeSettingsSheet;
window.scrollToSection = scrollToSection;
window.openPasswordModal = openPasswordModal;
window.closePasswordModal = closePasswordModal;
window.savePassword = savePassword;
window.loadSettingsPage = loadSettingsPage;
window.addWishlistItemToCart = addWishlistItemToCart;
window.removeWishlistItem = removeWishlistItem;

document.addEventListener('DOMContentLoaded', function() {
    applyTheme();
    loadSettingsPage();
    initGlobalHeaderSearch();
    initWishlistPanel();
    initCartButtonFallback();
    initReviewsSection();
    attachImageFallbacks();
    updateHeaderCounts();
});
