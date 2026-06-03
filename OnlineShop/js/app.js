// Main application logic

// Load custom products from localStorage
function loadCustomProducts() {
    const saved = JSON.parse(localStorage.getItem('customProducts')) || [];
    saved.forEach(p => {
        if (!products.find(existing => existing.id === p.id)) {
            products.push(p);
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load any user-added products
    loadCustomProducts();

    // Render featured products on home page
    const featuredGrid = document.getElementById('featuredProducts');
    if (featuredGrid) {
        const featured = products.filter(p => p.isFeatured).slice(0, 4);
        featuredGrid.innerHTML = featured.map(p => createProductCard(p)).join('');
    }

    // Render new arrivals on home page
    const newArrivalsGrid = document.getElementById('newArrivals');
    if (newArrivalsGrid) {
        const newItems = products.filter(p => p.isNew).slice(0, 4);
        newArrivalsGrid.innerHTML = newItems.map(p => createProductCard(p)).join('');
    }

    // Update cart count
    cart.updateCartCount();
});

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button onclick="cart.addItem(${product.id})" title="Add to Cart">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                    <button onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <p class="category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="cart.addItem(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Filter products on shop page
function filterProducts() {
    const shopGrid = document.getElementById('shopProducts');
    if (!shopGrid) return;

    const category = document.querySelector('input[name="category"]:checked')?.value || 'all';
    const priceRange = document.querySelector('input[name="price"]:checked')?.value || 'all';
    const sort = document.getElementById('sortSelect')?.value || 'default';

    let filtered = [...products];

    // Category filter
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Price filter
    if (priceRange !== 'all') {
        if (priceRange === '100+') {
            filtered = filtered.filter(p => p.price >= 100);
        } else {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
    }

    // Sort
    switch (sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    // Update count
    const countEl = document.getElementById('productCount');
    if (countEl) {
        countEl.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
    }

    // Render
    shopGrid.innerHTML = filtered.length > 0
        ? filtered.map(p => createProductCard(p)).join('')
        : '<p style="text-align:center; grid-column:1/-1; padding:40px; color:#666;">No products found matching your criteria.</p>';
}

// Search products
function searchProducts() {
    const query = document.getElementById('searchInput')?.value.toLowerCase();
    if (!query) return;

    const results = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    const shopGrid = document.getElementById('shopProducts') ||
                     document.getElementById('featuredProducts');
    if (shopGrid) {
        shopGrid.innerHTML = results.length > 0
            ? results.map(p => createProductCard(p)).join('')
            : '<p style="text-align:center; grid-column:1/-1; padding:40px; color:#666;">No products found.</p>';
    }
}

// Toggle search bar
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            document.getElementById('searchInput').focus();
        }
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Toggle filters on mobile
function toggleFilters() {
    const sidebar = document.querySelector('.shop-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Quick view (simple alert for demo)
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showToast(`${product.name} - $${product.price.toFixed(2)}`);
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// Newsletter subscription
function subscribeNewsletter(e) {
    e.preventDefault();
    showToast('Thank you for subscribing!');
    e.target.reset();
}

// Contact form submission
function submitContact(e) {
    e.preventDefault();
    showToast('Message sent successfully! We\'ll get back to you soon.');
    e.target.reset();
}

