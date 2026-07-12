
(function () {
  const role = sessionStorage.getItem("userRole");

  if (role !== "admin") {
    alert("Access Denied! Admins only.");
    window.location.href = "login.html";
  }
})();

// ==========================================
// ADMIN DASHBOARD JAVASCRIPT
// ==========================================

// Load all products from different categories
let allProducts = [];
let users = [];
let orders = [];
let uploadedImages = JSON.parse(localStorage.getItem('adminUploadedImages') || '[]');
const ADMIN_PRODUCTS_KEY = 'adminProducts';

const adminFilters = {
    productCategory: 'all',
    productSearch: '',
    inventoryCategory: 'all',
    inventoryStock: 'all',
    inventorySearch: '',
    userStatus: 'pending',
    userSearch: '',
    ordersSearch: '',
    mediaCategory: 'all',
    mediaSearch: ''
};

function normalizeSearchValue(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function matchesSearch(fields, rawSearchTerm) {
    const terms = normalizeSearchValue(rawSearchTerm).split(' ').filter(Boolean);
    if (terms.length === 0) return true;

    const haystack = normalizeSearchValue(fields.filter(Boolean).join(' '));
    return terms.every(term => haystack.includes(term));
}

function getStoredAdminProducts() {
    try {
        return JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function saveStoredAdminProducts(products) {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

function normalizeProductForStore(product) {
    const price = Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice) || null;
    return {
        ...product,
        price,
        originalPrice,
        discount: originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0,
        stock: Number(product.stock || product.stock_quantity || 0),
        sizes: Array.isArray(product.sizes)
            ? product.sizes.filter(Boolean)
            : String(product.sizes || '').split(',').map(size => size.trim()).filter(Boolean),
        rating: Number(product.rating || 0),
        ratingCount: Number(product.ratingCount || 0),
        isAdminProduct: true
    };
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    setupAdminEventListeners();
    updateDashboardStats();
    loadRecentActivity();
    renderAnalytics();
    setupMediaUpload();
    applyProductFilters();
    applyInventoryFilters();
    applyUserFilters();
    applyOrdersFilters();
    applyMediaFilters();
});

// ==========================================
// LOAD ALL DATA
// ==========================================
function loadAllData() {
    allProducts = [
        ...getSampleMenProducts(),
        ...getSampleWomenProducts(),
        ...getSampleKidsProducts(),
        ...getSampleAccessoriesProducts(),
        ...getStoredAdminProducts().map(normalizeProductForStore)
    ];

    users = getSampleUsers();
    orders = getSampleOrders();

    renderProductsTable();
    renderInventoryGrid();
    renderUsersGrid();
    renderOrdersTable();
}

// ==========================================
// SETUP EVENT LISTENERS
// ==========================================
function setupAdminEventListeners() {
    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.admin-sidebar .sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            switchSection(sectionName);
            
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Product filter tabs
    const filterTabs = document.querySelectorAll('#products .filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            adminFilters.productCategory = this.getAttribute('data-category');
            applyProductFilters();
        });
    });

    // Verification tabs
    const verifyTabs = document.querySelectorAll('.verify-tab');
    verifyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            verifyTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            adminFilters.userStatus = this.getAttribute('data-status');
            applyUserFilters();
        });
    });

    const productSearch = document.getElementById('adminProductSearch');
    const inventorySearch = document.getElementById('inventorySearch');
    const userSearch = document.getElementById('userSearch');
    const ordersSearch = document.getElementById('ordersSearch');
    const mediaSearch = document.getElementById('mediaSearch');

    // Inventory filters
    const inventoryCategory = document.getElementById('inventoryCategory');
    const stockStatus = document.getElementById('stockStatus');
    
    if (inventoryCategory) {
        inventoryCategory.addEventListener('change', function() {
            adminFilters.inventoryCategory = this.value;
            applyInventoryFilters();
        });
    }
    
    if (stockStatus) {
        stockStatus.addEventListener('change', function() {
            adminFilters.inventoryStock = this.value;
            applyInventoryFilters();
        });
    }

    if (productSearch) {
        productSearch.addEventListener('input', function() {
            adminFilters.productSearch = this.value;
            applyProductFilters();
        });
    }

    if (inventorySearch) {
        inventorySearch.addEventListener('input', function() {
            adminFilters.inventorySearch = this.value;
            applyInventoryFilters();
        });
    }

    if (userSearch) {
        userSearch.addEventListener('input', function() {
            adminFilters.userSearch = this.value;
            applyUserFilters();
        });
    }

    if (ordersSearch) {
        ordersSearch.addEventListener('input', function() {
            adminFilters.ordersSearch = this.value;
            applyOrdersFilters();
        });
    }

    if (mediaSearch) {
        mediaSearch.addEventListener('input', function() {
            adminFilters.mediaSearch = this.value;
            applyMediaFilters();
        });
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    const productImageUpload = document.getElementById('productImageUpload');
    if (productImageUpload) {
        productImageUpload.addEventListener('change', handleProductImageUpload);
    }
}

// ==========================================
// SWITCH SECTIONS
// ==========================================
function switchSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// ==========================================
// DASHBOARD STATS
// ==========================================
function updateDashboardStats() {
    document.getElementById('totalProducts').textContent = allProducts.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalOrders').textContent = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
}

function renderAnalytics() {
    const salesCanvas = document.getElementById('salesChart');
    const categoryCanvas = document.getElementById('categoryChart');
    const topProductsList = document.getElementById('topProductsList');

    if (salesCanvas && categoryCanvas) {
        const salesData = [12000, 18400, 15900, 22100, 27800, 31500];
        const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        drawBarChart(salesCanvas, categories, salesData, '#ff385c');

        const categoryData = [40, 26, 15, 19];
        const categoryLabels = ['Women', 'Men', 'Kids', 'Accessories'];
        drawBarChart(categoryCanvas, categoryLabels, categoryData, '#8b5cf6');
    }

    if (topProductsList) {
        const topProducts = allProducts
            .slice()
            .sort((a, b) => (b.stock || 0) - (a.stock || 0))
            .slice(0, 4)
            .map(product => `
                <div class="analytics-list-item">
                    <span>${product.name}</span>
                    <strong>${product.stock || 0} in stock</strong>
                </div>
            `)
            .join('');
        topProductsList.innerHTML = topProducts || '<p>No products yet.</p>';
    }
}

function drawBarChart(canvas, labels, values, color) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth || 320;
    const height = canvas.height = 180;
    ctx.clearRect(0, 0, width, height);
    const padding = 24;
    const maxValue = Math.max(...values, 1);
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const gap = 18;
    const barWidth = (chartWidth - gap * (labels.length - 1)) / labels.length;

    ctx.strokeStyle = '#e8e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        const y = padding + (chartHeight / 3) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    values.forEach((value, index) => {
        const x = padding + index * (barWidth + gap);
        const barHeight = (value / maxValue) * chartHeight;
        const y = height - padding - barHeight;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillStyle = '#4b4b63';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, height - 8);
    });
}

// ==========================================
// RECENT ACTIVITY
// ==========================================
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const activities = [
        { icon: '🛍️', title: 'New Order Placed', description: 'Order #12345 - ₹2,499', time: '5 mins ago' },
        { icon: '👤', title: 'New User Registration', description: 'user@example.com joined', time: '15 mins ago' },
        { icon: '📦', title: 'Product Stock Updated', description: 'Floral Dress - 50 units added', time: '1 hour ago' },
        { icon: '⚠️', title: 'Low Stock Alert', description: 'Classic T-Shirt - Only 5 left', time: '2 hours ago' },
        { icon: '✅', title: 'User Verified', description: 'Profile verification completed', time: '3 hours ago' }
    ];

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${activity.description} • ${activity.time}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// PRODUCTS MANAGEMENT
// ==========================================
function renderProductsTable(products = allProducts) {
    const tbody = document.getElementById('productsTableBody');

    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-light); padding: 30px 18px;">
                    No products match your search.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-img-small"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock || 0}</td>
            <td>
                <span class="status-badge ${getStockClass(product.stock)}">
                    ${getStockStatus(product.stock)}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterProducts(category) {
    adminFilters.productCategory = category;
    applyProductFilters();
}

function applyProductFilters() {
    let filtered = [...allProducts];

    if (adminFilters.productCategory !== 'all') {
        filtered = filtered.filter(product => product.category === adminFilters.productCategory);
    }

    if (adminFilters.productSearch) {
        filtered = filtered.filter(product =>
            matchesSearch(
                [
                    product.name,
                    product.brand,
                    product.category,
                    product.subcategory,
                    (product.sizes || []).join(' '),
                    getStockStatus(product.stock)
                ],
                adminFilters.productSearch
            )
        );
    }

    renderProductsTable(filtered);
}

function getStockClass(stock) {
    if (stock === 0) return 'status-out-of-stock';
    if (stock < 10) return 'status-low-stock';
    return 'status-in-stock';
}

function getStockStatus(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
}

function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        openEditProductModal(product);
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        allProducts = allProducts.filter(p => p.id !== productId);
        applyProductFilters();
        applyInventoryFilters();
        updateDashboardStats();
        showNotification('Product deleted successfully');
    }
}

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================
function renderInventoryGrid() {
    const inventoryGrid = document.getElementById('inventoryGrid');

    if (!inventoryGrid) return;
    
    inventoryGrid.innerHTML = allProducts.map(product => {
        const stock = product.stock || 0;
        const maxStock = 100;
        const percentage = (stock / maxStock) * 100;
        const stockClass = stock === 0 ? 'out' : stock < 10 ? 'low' : '';
        
        return `
            <div class="inventory-card">
                <div class="inventory-header">
                    <img src="${product.image}" alt="${product.name}" class="inventory-img">
                    <div class="inventory-info">
                        <h3>${product.name}</h3>
                        <p>${product.brand} • ${product.category}</p>
                    </div>
                </div>
                
                <div class="stock-bar">
                    <div class="stock-fill ${stockClass}" style="width: ${percentage}%"></div>
                </div>
                
                <div class="stock-actions">
                    <span class="stock-quantity">${stock} units in stock</span>
                    <button class="btn-edit" onclick="updateStock(${product.id})">Update</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterInventory() {
    adminFilters.inventoryCategory = document.getElementById('inventoryCategory').value;
    adminFilters.inventoryStock = document.getElementById('stockStatus').value;
    applyInventoryFilters();
}

function applyInventoryFilters() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;

    let filtered = [...allProducts];
    
    if (adminFilters.inventoryCategory !== 'all') {
        filtered = filtered.filter(p => p.category === adminFilters.inventoryCategory);
    }
    
    if (adminFilters.inventoryStock !== 'all') {
        if (adminFilters.inventoryStock === 'in-stock') {
            filtered = filtered.filter(p => (p.stock || 0) >= 10);
        } else if (adminFilters.inventoryStock === 'low-stock') {
            filtered = filtered.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10);
        } else if (adminFilters.inventoryStock === 'out-of-stock') {
            filtered = filtered.filter(p => (p.stock || 0) === 0);
        }
    }

    if (adminFilters.inventorySearch) {
        filtered = filtered.filter(product =>
            matchesSearch(
                [
                    product.name,
                    product.brand,
                    product.category,
                    product.subcategory,
                    `${product.stock || 0}`,
                    getStockStatus(product.stock)
                ],
                adminFilters.inventorySearch
            )
        );
    }

    if (filtered.length === 0) {
        inventoryGrid.innerHTML = `
            <div class="inventory-card" style="grid-column: 1 / -1; text-align: center;">
                <div class="inventory-info">
                    <h3>No inventory items match your search.</h3>
                    <p>Try a different product name, brand, category, or stock level.</p>
                </div>
            </div>
        `;
        return;
    }

    inventoryGrid.innerHTML = filtered.map(product => {
        const stock = product.stock || 0;
        const maxStock = 100;
        const percentage = (stock / maxStock) * 100;
        const stockClass = stock === 0 ? 'out' : stock < 10 ? 'low' : '';
        
        return `
            <div class="inventory-card">
                <div class="inventory-header">
                    <img src="${product.image}" alt="${product.name}" class="inventory-img">
                    <div class="inventory-info">
                        <h3>${product.name}</h3>
                        <p>${product.brand} • ${product.category}</p>
                    </div>
                </div>
                
                <div class="stock-bar">
                    <div class="stock-fill ${stockClass}" style="width: ${percentage}%"></div>
                </div>
                
                <div class="stock-actions">
                    <span class="stock-quantity">${stock} units in stock</span>
                    <button class="btn-edit" onclick="updateStock(${product.id})">Update</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStock(productId) {
    const product = allProducts.find(p => p.id === productId);
    const newStock = prompt(`Update stock for ${product.name}:`, product.stock || 0);
    
    if (newStock !== null) {
        product.stock = parseInt(newStock);
        applyInventoryFilters();
        applyProductFilters();
        showNotification('Stock updated successfully');
    }
}

// ==========================================
// USER VERIFICATION
// ==========================================
function renderUsersGrid(filteredUsers = users) {
    const usersGrid = document.getElementById('usersGrid');

    if (!usersGrid) return;

    if (filteredUsers.length === 0) {
        usersGrid.innerHTML = `
            <div class="user-card" style="text-align: center;">
                <div class="user-details">
                    <h3>No users match your search.</h3>
                    <p>Try a different name, email, phone, or verification status.</p>
                </div>
            </div>
        `;
        return;
    }
    
    usersGrid.innerHTML = filteredUsers.map(user => `
        <div class="user-card">
            <div class="user-header">
                <div class="user-avatar">${user.name.charAt(0)}</div>
                <div class="user-details">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                    <span class="verification-badge badge-${user.status}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </div>
            </div>
            
            <div class="user-info">
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Joined:</strong> ${user.joinDate}</p>
                <p><strong>Orders:</strong> ${user.totalOrders}</p>
            </div>
            
            <div class="user-actions">
                <button class="btn-verify" onclick="verifyUser(${user.id})">Verify</button>
                <button class="btn-flag" onclick="flagUser(${user.id})">Flag</button>
                <button class="btn-view" onclick="viewUserDetails(${user.id})">View</button>
            </div>
        </div>
    `).join('');
}

function filterUsers(status) {
    adminFilters.userStatus = status;
    applyUserFilters();
}

function applyUserFilters() {
    let filtered = users.filter(user => user.status === adminFilters.userStatus);

    if (adminFilters.userSearch) {
        filtered = filtered.filter(user =>
            matchesSearch(
                [
                    user.name,
                    user.email,
                    user.phone,
                    user.status,
                    user.joinDate,
                    `${user.totalOrders}`
                ],
                adminFilters.userSearch
            )
        );
    }

    renderUsersGrid(filtered);
}

function verifyUser(userId) {
    const user = users.find(u => u.id === userId);
    user.status = 'verified';
    applyUserFilters();
    showNotification(`${user.name} has been verified`);
}

function flagUser(userId) {
    const user = users.find(u => u.id === userId);
    user.status = 'flagged';
    applyUserFilters();
    showNotification(`${user.name} has been flagged for review`);
}

function viewUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nStatus: ${user.status}`);
}

// ==========================================
// ORDERS MANAGEMENT
// ==========================================
function renderOrdersTable(filteredOrders = orders) {
    const tbody = document.getElementById('ordersTableBody');

    if (!tbody) return;

    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-light); padding: 30px 18px;">
                    No orders match your search.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.items}</td>
            <td>₹${order.total.toLocaleString()}</td>
            <td>
                <span class="status-badge ${getOrderStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="viewOrder(${order.id})">View</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getOrderStatusClass(status) {
    if (status === 'Delivered') return 'status-in-stock';
    if (status === 'Processing') return 'status-low-stock';
    return 'status-out-of-stock';
}

function viewOrder(orderId) {
    alert(`Viewing order #${orderId}`);
}

function applyOrdersFilters() {
    let filtered = [...orders];

    if (adminFilters.ordersSearch) {
        filtered = filtered.filter(order =>
            matchesSearch(
                [
                    `${order.id}`,
                    order.customer,
                    order.date,
                    `${order.items}`,
                    `${order.total}`,
                    order.status
                ],
                adminFilters.ordersSearch
            )
        );
    }

    renderOrdersTable(filtered);
}

// ==========================================
// PRODUCT MODAL
// ==========================================
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.add('active');
}

function openEditProductModal(product) {
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productBrand').value = product.brand;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productSubcategory').value = product.subcategory || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productStock').value = product.stock || 0;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productSizes').value = product.sizes ? product.sizes.join(', ') : '';
    document.getElementById('productNew').checked = product.isNew || false;
    
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function handleProductImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(loadEvent) {
        document.getElementById('productImage').value = loadEvent.target.result;
        showNotification('Image ready for this product');
    };
    reader.readAsDataURL(file);
}

function handleProductSubmit(e) {
    e.preventDefault();

    const image = document.getElementById('productImage').value.trim();
    if (!image) {
        showNotification('Please add a product image URL or upload an image');
        return;
    }
    
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        originalPrice: parseFloat(document.getElementById('productOriginalPrice').value) || null,
        stock: parseInt(document.getElementById('productStock').value),
        image,
        sizes: document.getElementById('productSizes').value.split(',').map(s => s.trim()).filter(Boolean),
        isNew: document.getElementById('productNew').checked,
        rating: 0,
        ratingCount: 0
    };
    
    if (product.originalPrice) {
        product.discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    
    const cleanProduct = normalizeProductForStore(product);
    const storedProducts = getStoredAdminProducts();
    storedProducts.unshift(cleanProduct);
    saveStoredAdminProducts(storedProducts);

    allProducts.unshift(cleanProduct);
    applyProductFilters();
    applyInventoryFilters();
    updateDashboardStats();
    closeProductModal();
    showNotification('Product added to the store');
}

// ==========================================
// SAMPLE DATA
// ==========================================
function getSampleMenProducts() {
    return [
        {
            id: 1001,
            name: 'Classic Cotton T-Shirt',
            brand: 'Bellevouix',
            category: 'men',
            subcategory: 'tshirts',
            price: 799,
            originalPrice: 1299,
            discount: 38,
            stock: 50,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
            isNew: true,
            sizes: ['S', 'M', 'L', 'XL'],
            rating: 4.5,
            ratingCount: 245
        },
        {
            id: 1002,
            name: 'Denim Jacket',
            brand: 'UrbanStyle',
            category: 'men',
            subcategory: 'jackets',
            price: 2499,
            originalPrice: 3999,
            discount: 38,
            stock: 30,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
            isNew: false,
            sizes: ['M', 'L', 'XL'],
            rating: 4.6,
            ratingCount: 189
        }
    ];
}

function getSampleWomenProducts() {
    return [
        {
            id: 2001,
            name: 'Floral Maxi Dress',
            brand: 'Bellevouix',
            category: 'women',
            subcategory: 'dresses',
            price: 1899,
            originalPrice: 2999,
            discount: 37,
            stock: 40,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
            isNew: true,
            sizes: ['S', 'M', 'L', 'XL'],
            rating: 4.7,
            ratingCount: 342
        }
    ];
}

function getSampleKidsProducts() {
    return [
        {
            id: 3001,
            name: 'Kids Cartoon T-Shirt',
            brand: 'KiddoWear',
            category: 'kids',
            subcategory: 'tshirts',
            price: 499,
            originalPrice: 799,
            discount: 38,
            stock: 60,
            image: 'https://images.unsplash.com/photo-1503919436084-b69c2f762761?w=400&h=500&fit=crop',
            isNew: true,
            sizes: ['S', 'M', 'L'],
            rating: 4.7,
            ratingCount: 324
        }
    ];
}

function getSampleAccessoriesProducts() {
    return [
        {
            id: 4001,
            name: 'Phone Case - Pink',
            brand: 'TechStyle',
            category: 'accessories',
            subcategory: 'phone-cases',
            price: 299,
            originalPrice: 499,
            discount: 40,
            stock: 100,
            image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=500&fit=crop',
            isNew: true,
            sizes: [],
            rating: 4.6,
            ratingCount: 456
        }
    ];
}

function getSampleUsers() {
    return [
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+91 98765 43210',
            joinDate: '2024-01-15',
            totalOrders: 5,
            status: 'pending'
        },
        {
            id: 2,
            name: 'Mike Chen',
            email: 'mike@example.com',
            phone: '+91 98765 43211',
            joinDate: '2024-02-20',
            totalOrders: 8,
            status: 'verified'
        },
        {
            id: 3,
            name: 'Emily Davis',
            email: 'emily@example.com',
            phone: '+91 98765 43212',
            joinDate: '2024-03-10',
            totalOrders: 2,
            status: 'flagged'
        }
    ];
}

function getSampleOrders() {
    return [
        {
            id: 12345,
            customer: 'Sarah Johnson',
            date: '2024-04-05',
            items: 3,
            total: 4599,
            status: 'Processing'
        },
        {
            id: 12346,
            customer: 'Mike Chen',
            date: '2024-04-06',
            items: 2,
            total: 2998,
            status: 'Delivered'
        }
    ];
}

// ==========================================
// MEDIA UPLOAD MANAGEMENT
// ==========================================

function setupMediaUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');

    if (uploadArea && imageInput) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            handleFileSelection(files);
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFileSelection(files);
        });
    }

    // Gallery filter tabs
    const galleryFilterTabs = document.querySelectorAll('.gallery-section .filter-tab');
    galleryFilterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            galleryFilterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            adminFilters.mediaCategory = this.getAttribute('data-category');
            applyMediaFilters();
        });
    });
}

function handleFileSelection(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
        showNotification('Please select image files only');
        return;
    }

    // Preview selected images
    const uploadArea = document.getElementById('uploadArea');
    const placeholder = uploadArea.querySelector('.upload-placeholder');
    
    placeholder.innerHTML = `
        <span class="upload-icon">📸</span>
        <p>${imageFiles.length} image(s) selected</p>
        <button class="btn-primary" onclick="uploadImages()">Upload Images</button>
        <button class="btn-secondary" onclick="clearSelection()">Clear</button>
    `;

    // Store selected files temporarily
    window.selectedFiles = imageFiles;
}

function clearSelection() {
    window.selectedFiles = null;
    const uploadArea = document.getElementById('uploadArea');
    const placeholder = uploadArea.querySelector('.upload-placeholder');
    
    placeholder.innerHTML = `
        <span class="upload-icon">📤</span>
        <p>Drag & drop images here or click to browse</p>
        <input type="file" id="imageInput" multiple accept="image/*" style="display: none;">
        <button class="btn-primary" onclick="document.getElementById('imageInput').click()">
            Choose Files
        </button>
    `;
}

function uploadImages() {
    if (!window.selectedFiles || window.selectedFiles.length === 0) {
        showNotification('No images selected');
        return;
    }

    const category = document.getElementById('imageCategory').value;
    
    window.selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                id: Date.now() + index,
                name: file.name,
                url: e.target.result,
                category: category,
                uploadDate: new Date().toISOString(),
                featured: category === 'featured'
            };
            
            uploadedImages.unshift(imageData); // Add to beginning for featured display
            localStorage.setItem('adminUploadedImages', JSON.stringify(uploadedImages));
            
            if (index === window.selectedFiles.length - 1) {
                applyMediaFilters();
                clearSelection();
                showNotification(`${window.selectedFiles.length} image(s) uploaded successfully!`);
                updateFeaturedImages(); // Update homepage display
            }
        };
        reader.readAsDataURL(file);
    });
}

function renderGallery(images = uploadedImages) {
    const galleryGrid = document.getElementById('galleryGrid');

    if (!galleryGrid) return;
    
    if (images.length === 0) {
        galleryGrid.innerHTML = `
            <div class="empty-gallery">
                <span style="font-size: 3rem;">📷</span>
                <p>No images uploaded yet</p>
                <p>Upload some images to get started!</p>
            </div>
        `;
        return;
    }

    galleryGrid.innerHTML = images.map(image => `
        <div class="gallery-item">
            <img src="${image.url}" alt="${image.name}" class="gallery-image">
            <div class="gallery-info">
                <h4 class="gallery-name">${image.name}</h4>
                <div class="gallery-meta">
                    <span>${image.category}</span>
                    <span>${new Date(image.uploadDate).toLocaleDateString()}</span>
                </div>
                <div class="gallery-actions">
                    <button class="btn-feature" onclick="toggleFeatured(${image.id})">
                        ${image.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button class="btn-delete" onclick="deleteImage(${image.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterGallery(category) {
    adminFilters.mediaCategory = category;
    applyMediaFilters();
}

function applyMediaFilters() {
    let filtered = [...uploadedImages];

    if (adminFilters.mediaCategory !== 'all') {
        filtered = filtered.filter(img => img.category === adminFilters.mediaCategory);
    }

    if (adminFilters.mediaSearch) {
        filtered = filtered.filter(image =>
            matchesSearch(
                [
                    image.name,
                    image.category,
                    image.featured ? 'featured homepage' : ''
                ],
                adminFilters.mediaSearch
            )
        );
    }

    renderGallery(filtered);
}

function toggleFeatured(imageId) {
    const image = uploadedImages.find(img => img.id === imageId);
    if (image) {
        image.featured = !image.featured;
        localStorage.setItem('adminUploadedImages', JSON.stringify(uploadedImages));
        applyMediaFilters();
        updateFeaturedImages();
        showNotification(`Image ${image.featured ? 'featured' : 'unfeatured'}`);
    }
}

function deleteImage(imageId) {
    if (confirm('Are you sure you want to delete this image?')) {
        uploadedImages = uploadedImages.filter(img => img.id !== imageId);
        localStorage.setItem('adminUploadedImages', JSON.stringify(uploadedImages));
        applyMediaFilters();
        updateFeaturedImages();
        showNotification('Image deleted successfully');
    }
}

function updateFeaturedImages() {
    // This will be called to update the homepage display
    // The homepage will read from localStorage and display featured images
    localStorage.setItem('featuredImages', JSON.stringify(uploadedImages.filter(img => img.featured)));
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
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
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
