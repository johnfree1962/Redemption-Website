const PRODUCT_STORAGE_KEY = 'redemption-pharmacy-products';

const defaultProducts = [
    { id: 'p-001', name: 'Ibuprofen 200mg', category: 'pain', price: 5.99, stock: 42, icon: 'fa-capsules', description: 'Effective pain relief and fever reducer. Contains 100 tablets per box.' },
    { id: 'p-002', name: 'Acetaminophen 500mg', category: 'pain', price: 4.99, stock: 28, icon: 'fa-tablets', description: 'Safe and gentle pain reliever. 60 tablets. Non-aspirin formula.' },
    { id: 'p-003', name: 'Vitamin C 1000mg', category: 'vitamins', price: 8.99, stock: 64, icon: 'fa-leaf', description: 'Boost immunity with pure vitamin C. 30 tablets. Daily supplement.' },
    { id: 'p-004', name: 'Multivitamin Daily', category: 'vitamins', price: 12.99, stock: 19, icon: 'fa-heart', description: 'Complete daily vitamins and minerals. 60 tablets. All age groups.' },
    { id: 'p-005', name: 'Vitamin D3 1000IU', category: 'vitamins', price: 9.99, stock: 35, icon: 'fa-sun', description: 'Support bone health. 90 tablets. Essential for calcium absorption.' },
    { id: 'p-006', name: 'Cold & Flu Relief', category: 'cold', price: 6.99, stock: 24, icon: 'fa-mortar-pestle', description: 'Multi-symptom relief formula. 24 caplets. Fast acting.' },
    { id: 'p-007', name: 'Nasal Decongestant', category: 'cold', price: 5.49, stock: 11, icon: 'fa-wind', description: 'Clear nasal passages. 15ml spray. Fast relief.' },
    { id: 'p-008', name: 'Cough Syrup', category: 'cold', price: 6.49, stock: 8, icon: 'fa-prescription-bottle', description: 'Soothe cough and throat irritation. 120ml bottle. Cherry flavor.' },
    { id: 'p-009', name: 'Moisturizing Lotion', category: 'skin', price: 12.99, stock: 31, icon: 'fa-bottle-droplet', description: 'Hydrate and nourish skin. 200ml pump bottle. All skin types.' },
    { id: 'p-010', name: 'Sunscreen SPF 50', category: 'skin', price: 14.99, stock: 16, icon: 'fa-spa', description: 'Protect from UV rays. 100ml bottle. Water-resistant formula.' },
    { id: 'p-011', name: 'Acne Treatment Cream', category: 'skin', price: 9.99, stock: 7, icon: 'fa-spa', description: 'Clear skin solution. 50ml tube. With benzoyl peroxide.' },
    { id: 'p-012', name: 'Antacid Tablets', category: 'digestive', price: 5.99, stock: 26, icon: 'fa-pills', description: 'Fast heartburn relief. 30 chewable tablets. Mint flavor.' },
    { id: 'p-013', name: 'Probiotic Supplement', category: 'digestive', price: 15.99, stock: 14, icon: 'fa-leaf', description: 'Support gut health. 30 capsules. 10 billion CFU.' },
    { id: 'p-014', name: 'Fiber Supplement', category: 'digestive', price: 11.99, stock: 22, icon: 'fa-droplet', description: 'Digestive wellness. 30 capsules. Natural ingredients.' }
];

function getProducts() {
    try {
        const savedProducts = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY));
        return Array.isArray(savedProducts) ? savedProducts : defaultProducts;
    } catch (error) {
        return defaultProducts;
    }
}

function saveProducts(products) {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

function escapeProductText(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderPublicProducts() {
    const productsGrid = document.querySelector('.products-grid[data-product-list]');
    if (!productsGrid) return;

    const products = getProducts();
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${escapeProductText(product.category)}">
            <div class="product-image">${product.image ? `<img src="${escapeProductText(product.image)}" alt="${escapeProductText(product.name)}">` : `<i class="fas ${escapeProductText(product.icon || 'fa-pills')}"></i>`}</div>
            <h3>${escapeProductText(product.name)}</h3>
            <p>${escapeProductText(product.description)}</p>
            <div class="product-footer">
                <span class="price">$${Number(product.price).toFixed(2)}</span>
                <button class="btn-small" type="button" data-add-to-cart="${escapeProductText(product.id)}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    document.dispatchEvent(new CustomEvent('products:rendered'));
}

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem(PRODUCT_STORAGE_KEY)) saveProducts(defaultProducts);
    renderPublicProducts();
});

window.pharmacyProducts = { defaultProducts, getProducts, saveProducts, renderPublicProducts };
