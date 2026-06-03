// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(productId, size = 'M', quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId && item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: quantity
            });
        }

        this.save();
        showToast(`${product.name} added to cart!`);
    }

    removeItem(productId, size) {
        this.items = this.items.filter(item => !(item.id === productId && item.size === size));
        this.save();
    }

    updateQuantity(productId, size, quantity) {
        const item = this.items.find(item => item.id === productId && item.size === size);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.save();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartCount() {
        const countEl = document.getElementById('cartCount');
        if (countEl) {
            countEl.textContent = this.getItemCount();
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Render cart page
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');

    if (cart.items.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';

    const subtotal = cart.getTotal();
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="size">Size: ${item.size}</p>
                        <p class="price">$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.size}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="cart-summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="cart-summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="cart-summary-row total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
            <a href="shop.html" class="btn btn-outline btn-block" style="margin-top:10px;">Continue Shopping</a>
        </div>
    `;
}

function updateCartQuantity(id, size, qty) {
    if (qty < 1) {
        removeFromCart(id, size);
        return;
    }
    cart.updateQuantity(id, size, qty);
    renderCart();
}

function removeFromCart(id, size) {
    cart.removeItem(id, size);
    renderCart();
    showToast('Item removed from cart');
}

// Render checkout page
function renderCheckout() {
    const itemsEl = document.getElementById('checkoutItems');
    const totalsEl = document.getElementById('checkoutTotals');

    if (cart.items.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    itemsEl.innerHTML = cart.items.map(item => `
        <div class="checkout-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const subtotal = cart.getTotal();
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    totalsEl.innerHTML = `
        <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="cart-summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="cart-summary-row total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function processCheckout(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('checkoutForm');
    const inputs = form.querySelectorAll('input, select');
    const name = form.querySelector('input[placeholder="John Doe"]')?.value || '';
    const phone = form.querySelector('input[type="tel"]')?.value || '';
    const address = form.querySelector('input[placeholder="123 Main Street"]')?.value || '';
    const city = form.querySelector('input[placeholder="New York"]')?.value || '';

    // Save order to localStorage
    const order = {
        id: 'ORD-2026-' + String(Date.now()).slice(-4),
        date: new Date().toISOString().split('T')[0],
        status: 'processing',
        customer: { name, phone, address, city },
        items: cart.items.map(item => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        })),
        total: cart.getTotal() + (cart.getTotal() > 100 ? 0 : 9.99),
        shipping: cart.getTotal() > 100 ? 'Free' : '$9.99'
    };

    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    savedOrders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(savedOrders));

    cart.clear();
    document.getElementById('orderModal').classList.add('active');
}

