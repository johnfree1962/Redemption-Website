const ORDER_STORAGE_KEY = 'redemption-pharmacy-orders';

function getOrders() {
    try {
        const savedOrders = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY));
        return Array.isArray(savedOrders) ? savedOrders : [];
    } catch (error) {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function createOrder(customer, items) {
    const order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        customer,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    return order;
}

window.pharmacyOrders = { getOrders, saveOrders, createOrder };
