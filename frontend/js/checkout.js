// CHECKOUT PAGE FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout page
    initializeCheckout();

    // Payment method switching
    setupPaymentMethods();

    // Form validation
    setupFormValidation();

    // Card number formatting
    setupCardFormatting();

    // Place order functionality
    setupOrderPlacement();
});

// Initialize checkout page
function initializeCheckout() {
    // Check if user is logged in
    const role = sessionStorage.getItem('userRole');
    if (!role) {
        window.location.href = 'login.html';
        return;
    }

    // Display welcome message
    const welcomeUser = document.getElementById('welcomeUser');
    const username = sessionStorage.getItem('username');
    if (username && welcomeUser) {
        welcomeUser.textContent = `Welcome, ${username}!`;
    }

    // Load cart items and display order summary
    loadOrderSummary();

    // Update cart count
    updateCartCount();
}

// Setup payment method switching
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    const codNotice = document.getElementById('codNotice');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
                codNotice.style.display = 'none';
                // Make card fields required
                document.querySelectorAll('#cardDetails input').forEach(input => {
                    input.required = true;
                });
            } else if (this.value === 'cod') {
                cardDetails.style.display = 'none';
                codNotice.style.display = 'block';
                // Remove required from card fields
                document.querySelectorAll('#cardDetails input').forEach(input => {
                    input.required = false;
                });
            }
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const form = document.querySelector('.checkout-forms');

    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validation rules
    switch (field.id) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Must be at least 2 characters';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email';
            }
            break;

        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;

        case 'address':
            if (!value) {
                isValid = false;
                errorMessage = 'Address is required';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Please enter a complete address';
            }
            break;

        case 'city':
        case 'state':
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            break;

        case 'zipCode':
            if (!value) {
                isValid = false;
                errorMessage = 'ZIP code is required';
            } else if (!/^\d{5,6}$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid ZIP code';
            }
            break;

        case 'country':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a country';
            }
            break;

        case 'cardNumber':
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'Card number is required';
            } else if (field.required && !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid card number';
            }
            break;

        case 'expiryDate':
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'Expiry date is required';
            } else if (field.required && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter MM/YY format';
            }
            break;

        case 'cvv':
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'CVV is required';
            } else if (field.required && !/^\d{3,4}$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid CVV';
            }
            break;

        case 'cardName':
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'Name on card is required';
            } else if (field.required && value.length < 2) {
                isValid = false;
                errorMessage = 'Please enter the full name';
            }
            break;
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    }

    return isValid;
}

// Setup card number formatting
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    if (!cardNumber || !expiryDate) return;

    // Format card number
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';

        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        e.target.value = formattedValue;
    });

    // Format expiry date
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
}

// Load order summary from cart
function loadOrderSummary() {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const orderItems = document.getElementById('orderItems');

    if (cart.length === 0) {
        orderItems.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="index.html">Continue shopping</a></p>';
        document.getElementById('placeOrderBtn').disabled = true;
        return;
    }

    let subtotal = 0;
    orderItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">Rs.${item.price} x ${item.quantity} = Rs.${itemTotal}</div>
            </div>
        `;
        orderItems.appendChild(itemElement);
    });

    // Calculate totals
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `Rs.${subtotal}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `Rs.${shipping}`;
    document.getElementById('tax').textContent = `Rs.${tax}`;
    document.getElementById('total').textContent = `Rs.${total}`;
}

// Setup order placement
function setupOrderPlacement() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    placeOrderBtn.addEventListener('click', function() {
        if (validateAllFields()) {
            placeOrder();
        }
    });
}

// Validate all fields
function validateAllFields() {
    const inputs = document.querySelectorAll('.checkout-forms input, .checkout-forms select');
    let allValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            allValid = false;
        }
    });

    return allValid;
}

// Place order
async function placeOrder() {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Collect form data
    const orderData = {
        orderId: generateOrderId(),
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: {
                street: document.getElementById('address').value,
                street2: document.getElementById('address2').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value,
                country: document.getElementById('country').value
            }
        },
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        items: cart,
        totals: {
            subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('Rs.', '')),
            shipping: document.getElementById('shipping').textContent === 'FREE' ? 0 : parseFloat(document.getElementById('shipping').textContent.replace('Rs.', '')),
            tax: parseFloat(document.getElementById('tax').textContent.replace('Rs.', '')),
            total: parseFloat(document.getElementById('total').textContent.replace('Rs.', ''))
        },
        orderDate: new Date().toISOString(),
        estimatedDelivery: getEstimatedDelivery()
    };

    // Add card details if payment method is card
    if (orderData.paymentMethod === 'card') {
        orderData.cardDetails = {
            cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, '').slice(-4), // Only last 4 digits
            expiryDate: document.getElementById('expiryDate').value,
            cardName: document.getElementById('cardName').value
        };
    }

    try {
        const response = await BelleApi.placeOrder(orderData);
        if (response.orderId) {
            orderData.orderId = response.orderId;
        }
    } catch (error) {
        if (error.status) {
            alert(error.message || 'Order could not be placed');
            return;
        }
        // If the Java API is offline, keep the local demo checkout behavior.
    }

    // Save order locally as a browser-side receipt copy.
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    sessionStorage.removeItem('cart');

    // Show success modal
    showSuccessModal(orderData);
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BLV${timestamp}${random}`;
}

// Get estimated delivery date
function getEstimatedDelivery() {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 5 business days
    return deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Show success modal
function showSuccessModal(orderData) {
    const modal = document.getElementById('successModal');
    const orderIdElement = document.getElementById('orderId');
    const deliveryDateElement = document.getElementById('deliveryDate');

    orderIdElement.textContent = orderData.orderId;
    deliveryDateElement.textContent = orderData.estimatedDelivery;

    modal.style.display = 'block';

    // Close modal functionality
    document.getElementById('closeSuccessModal').addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Logout function
function logout() {
    sessionStorage.clear();
    sessionStorage.removeItem('cart');
    window.location.href = 'login.html';
}

// Add error message styles
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #e53e3e !important;
        background-color: #fed7d7 !important;
    }

    .error-message {
        color: #e53e3e;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
    }

    .empty-cart {
        text-align: center;
        padding: 40px 20px;
        color: #718096;
        font-size: 16px;
    }

    .empty-cart a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
    }

    .empty-cart a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);
