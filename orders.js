const cart = [];
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const orderModal = document.getElementById('orderModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const orderForm = document.getElementById('orderForm');
const orderMessage = document.getElementById('orderMessage');
const deliveryLatitude = document.getElementById('deliveryLatitude');
const deliveryLongitude = document.getElementById('deliveryLongitude');
const locationStatus = document.getElementById('locationStatus');
let deliveryMap;
let deliveryMarker;
let lastGeocodedAddress = '';
let geocodeRequest = 0;

function setDeliveryLocation(latitude, longitude) {
    const point = L.latLng(latitude, longitude);
    deliveryLatitude.value = point.lat.toFixed(6);
    deliveryLongitude.value = point.lng.toFixed(6);
    if (deliveryMarker) deliveryMarker.setLatLng(point);
    else deliveryMarker = L.marker(point, { draggable: true }).addTo(deliveryMap);
    deliveryMarker.off('dragend').on('dragend', event => {
        const markerPoint = event.target.getLatLng();
        setDeliveryLocation(markerPoint.lat, markerPoint.lng);
    });
    locationStatus.textContent = `Pinned at ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}. Finding the street address...`;

    const requestId = ++geocodeRequest;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lng}`)
        .then(response => response.ok ? response.json() : Promise.reject(new Error('Address lookup unavailable')))
        .then(result => {
            if (requestId !== geocodeRequest) return;
            const addressField = orderForm.elements.address;
            const displayAddress = result.display_name || '';
            if (displayAddress && (!addressField.value.trim() || addressField.value === lastGeocodedAddress)) {
                addressField.value = displayAddress;
                lastGeocodedAddress = displayAddress;
            }
            locationStatus.textContent = `Delivery pin set at ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}.`;
        })
        .catch(() => {
            if (requestId === geocodeRequest) locationStatus.textContent = `Delivery pin set at ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}. Add landmarks or directions above.`;
        });
}

function initializeDeliveryMap() {
    if (!deliveryMap) {
        deliveryMap = L.map('deliveryMap').setView([6.3004, -10.7969], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(deliveryMap);
        deliveryMap.on('click', event => setDeliveryLocation(event.latlng.lat, event.latlng.lng));
    }
    requestAnimationFrame(() => deliveryMap.invalidateSize());
}

function formatMoney(value) {
    return `$${Number(value).toFixed(2)}`;
}

function updateCart() {
    const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = quantity;
    cartCount.hidden = quantity === 0;
    cartItems.innerHTML = cart.length ? cart.map((item, index) => `
        <div class="cart-item">
            <div><strong>${escapeOrderText(item.name)}</strong><small>${formatMoney(item.price)} each</small></div>
            <div class="cart-item-controls"><button type="button" data-decrease="${index}" aria-label="Decrease ${escapeOrderText(item.name)}">−</button><span>${item.quantity}</span><button type="button" data-increase="${index}" aria-label="Increase ${escapeOrderText(item.name)}">+</button><button class="remove-cart-item" type="button" data-remove="${index}" aria-label="Remove ${escapeOrderText(item.name)}"><i class="fas fa-trash"></i></button></div>
        </div>
    `).join('') : '<p class="empty-cart">Your order is empty. Add a product to begin.</p>';
    cartTotal.textContent = formatMoney(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

function escapeOrderText(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function addToCart(productId) {
    const product = window.pharmacyProducts.getProducts().find(item => item.id === productId);
    if (!product) return;
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 });
    updateCart();
    cartButton.classList.add('cart-pulse');
    window.setTimeout(() => cartButton.classList.remove('cart-pulse'), 300);
}

document.addEventListener('products:rendered', () => {
    document.querySelectorAll('[data-add-to-cart]').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.addToCart)));
});

cartButton.addEventListener('click', () => {
    orderModal.hidden = false;
    updateCart();
    initializeDeliveryMap();
});

document.getElementById('useMyLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        locationStatus.textContent = 'Location is unavailable in this browser. Tap the map to place your pin.';
        return;
    }
    locationStatus.textContent = 'Finding your current location...';
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        deliveryMap.setView([latitude, longitude], 17);
        setDeliveryLocation(latitude, longitude);
    }, () => {
        locationStatus.textContent = 'Could not access your location. Allow location access or tap the map to place your pin.';
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
});

document.querySelector('[data-close-order]')?.addEventListener('click', () => { orderModal.hidden = true; });
orderModal.addEventListener('click', event => { if (event.target === orderModal) orderModal.hidden = true; });
cartItems.addEventListener('click', event => {
    const control = event.target.closest('button');
    if (!control) return;
    const index = Number(control.dataset.increase ?? control.dataset.decrease ?? control.dataset.remove);
    if (control.dataset.increase !== undefined) cart[index].quantity += 1;
    if (control.dataset.decrease !== undefined) cart[index].quantity -= 1;
    if (control.dataset.remove !== undefined || cart[index]?.quantity <= 0) cart.splice(index, 1);
    updateCart();
});

orderForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!cart.length) {
        orderMessage.textContent = 'Add at least one product before placing your order.';
        orderMessage.hidden = false;
        return;
    }
    if (!deliveryLatitude.value || !deliveryLongitude.value) {
        locationStatus.textContent = 'Choose your delivery location on the map before placing the order.';
        document.getElementById('deliveryMap').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    const formData = new FormData(orderForm);
    const order = window.pharmacyOrders.createOrder({
        name: formData.get('name').trim(),
        phone: formData.get('phone').trim(),
        email: formData.get('email').trim(),
        address: formData.get('address').trim(),
        location: {
            latitude: Number(formData.get('latitude')),
            longitude: Number(formData.get('longitude'))
        }
    }, cart.map(item => ({ ...item })));
    orderMessage.textContent = `Order ${order.id} placed successfully. We will contact you shortly.`;
    orderMessage.hidden = false;
    cart.length = 0;
    orderForm.reset();
    if (deliveryMarker) {
        deliveryMap.removeLayer(deliveryMarker);
        deliveryMarker = null;
    }
    lastGeocodedAddress = '';
    locationStatus.textContent = 'Tap the map to place the delivery pin, or use your current location.';
    updateCart();
    window.setTimeout(() => { orderModal.hidden = true; orderMessage.hidden = true; }, 3500);
});

updateCart();
