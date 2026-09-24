const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');
const searchProducts = document.getElementById('searchProducts');
const formTitle = document.getElementById('formTitle');
const editProductId = document.getElementById('editProductId');
const cancelEdit = document.getElementById('cancelEdit');
const resetProducts = document.getElementById('resetProducts');
const toast = document.getElementById('toast');
const ordersList = document.getElementById('ordersList');
const orderCount = document.getElementById('orderCount');
const pendingOrders = document.getElementById('pendingOrders');
const navOrderCount = document.getElementById('navOrderCount');
const refreshOrders = document.getElementById('refreshOrders');
const productImage = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewImage = document.getElementById('imagePreviewImage');
const removeImage = document.getElementById('removeImage');
const aboutForm = document.getElementById('aboutForm');

let products = window.pharmacyProducts.getProducts();
let orders = window.pharmacyOrders.getOrders();
let selectedImage = '';
let aboutContent = window.pharmacyAbout.getAboutContent();
let teamMembers = aboutContent.team.map(member => ({ ...member }));

const categoryNames = {
    pain: 'Pain relief',
    vitamins: 'Vitamins',
    cold: 'Cold & flu',
    skin: 'Skincare',
    digestive: 'Digestive'
};

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2500);
}

function updateStats() {
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('inventoryValue').textContent = `$${products.reduce((total, product) => total + Number(product.price) * Number(product.stock), 0).toFixed(2)}`;
    document.getElementById('lowStock').textContent = products.filter(product => Number(product.stock) < 10).length;
}

function renderTable() {
    const searchTerm = searchProducts.value.trim().toLowerCase();
    const visibleProducts = products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(searchTerm));

    productTableBody.innerHTML = visibleProducts.length ? visibleProducts.map(product => `
        <tr>
            <td><div class="product-name">${escapeAdminText(product.name)}</div><div class="product-category">${escapeAdminText(categoryNames[product.category] || product.category)}</div></td>
            <td>$${Number(product.price).toFixed(2)}</td>
            <td><span class="stock ${Number(product.stock) < 10 ? 'low' : ''}">${Number(product.stock)} units</span></td>
            <td><div class="row-actions"><button class="icon-btn" type="button" data-edit="${product.id}" title="Edit product"><i class="fas fa-pen"></i></button><button class="icon-btn delete" type="button" data-delete="${product.id}" title="Delete product"><i class="fas fa-trash"></i></button></div></td>
        </tr>
    `).join('') : '<tr><td colspan="4" class="empty-state">No products match your search.</td></tr>';

    updateStats();
}

function renderOrders() {
    orderCount.textContent = `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`;
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    pendingOrders.textContent = pendingCount;
    navOrderCount.textContent = orders.length;
    ordersList.innerHTML = orders.length ? orders.map(order => `
        <article class="order-admin-card">
            <div class="order-admin-top"><div><p class="order-admin-id">${escapeAdminText(order.id)}</p><div class="order-admin-meta">${escapeAdminText(order.customer.name)} · ${escapeAdminText(order.customer.phone)} · ${escapeAdminText(order.customer.email)}</div><div class="order-admin-meta">${escapeAdminText(order.customer.address)}</div></div><time class="order-admin-meta">${new Date(order.createdAt).toLocaleString()}</time></div>
            <div class="order-admin-items">${order.items.map(item => `${escapeAdminText(item.name)} × ${item.quantity}`).join(' · ')}</div>
            <div class="order-admin-bottom"><span class="order-admin-total">${formatAdminMoney(order.total)}</span><div class="order-admin-actions"><select class="order-status ${escapeAdminText(order.status)}" data-order-status="${escapeAdminText(order.id)}" aria-label="Update ${escapeAdminText(order.id)} status"><option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option><option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option><option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready for pickup</option><option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option><option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option></select><button class="archive-order" type="button" data-archive-order="${escapeAdminText(order.id)}">Archive</button></div></div>
        </article>
    `).join('') : '<div class="empty-state">No customer orders yet. New orders will appear here.</div>';
}

function refreshOrderModule() {
    orders = window.pharmacyOrders.getOrders();
    renderOrders();
}

function formatAdminMoney(value) {
    return `$${Number(value).toFixed(2)}`;
}

function fillAboutForm() {
    const fields = {
        pageTitle: aboutContent.pageTitle,
        pageSubtitle: aboutContent.pageSubtitle,
        storyTitle: aboutContent.storyTitle,
        story: aboutContent.story.join('\n\n'),
        mission: aboutContent.mission,
        vision: aboutContent.vision,
        values: aboutContent.values,
        communityTitle: aboutContent.communityTitle,
        community: aboutContent.community.join('\n\n')
    };
    Object.entries(fields).forEach(([name, value]) => { aboutForm.elements[name].value = value; });
    renderTeamEditors();
}

function renderTeamEditors() {
    const editors = document.getElementById('teamEditors');
    editors.innerHTML = teamMembers.map((member, index) => `
        <div class="team-editor" data-team-editor="${index}">
            <div class="team-editor-title"><strong>Team member ${index + 1}</strong><button class="remove-team-member" type="button" data-remove-member="${index}" ${teamMembers.length === 1 ? 'disabled' : ''}><i class="fas fa-trash"></i> Remove member</button></div>
            <input data-team-field="name" value="${escapeAdminText(member.name || '')}" placeholder="Full name" aria-label="Team member ${index + 1} name" required>
            <input data-team-field="role" value="${escapeAdminText(member.role || '')}" placeholder="Role" aria-label="Team member ${index + 1} role" required>
            <input data-team-field="credentials" value="${escapeAdminText(member.credentials || '')}" placeholder="Credentials" aria-label="Team member ${index + 1} credentials" required>
            <input data-team-image="${index}" type="file" accept="image/*" aria-label="Photo for team member ${index + 1}">
            <small class="field-help">Optional photo, max 2 MB.</small>
            <img class="team-image-preview" data-team-preview="${index}" alt="Team member ${index + 1} preview" ${member.image ? `src="${escapeAdminText(member.image)}"` : ''} ${member.image ? '' : 'hidden'}>
        </div>
    `).join('');
}

document.getElementById('addTeamMember').addEventListener('click', () => {
    teamMembers.push({ name: '', role: '', credentials: '', image: '' });
    renderTeamEditors();
    aboutForm.querySelector(`[data-team-editor="${teamMembers.length - 1}"] input`).focus();
});

document.getElementById('teamEditors').addEventListener('input', event => {
    const field = event.target.closest('[data-team-field]');
    if (!field) return;
    const editor = event.target.closest('[data-team-editor]');
    teamMembers[Number(editor.dataset.teamEditor)][field.dataset.teamField] = field.value;
});

document.getElementById('teamEditors').addEventListener('change', event => {
    const input = event.target.closest('[data-team-image]');
    if (!input) return;
    const file = input.files[0];
    const index = Number(input.dataset.teamImage);
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
        input.value = '';
        showToast('Choose an image smaller than 2 MB');
        return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        teamMembers[index].image = reader.result;
        const preview = aboutForm.querySelector(`[data-team-preview="${index}"]`);
        preview.src = reader.result;
        preview.hidden = false;
    });
    reader.readAsDataURL(file);
});

document.getElementById('teamEditors').addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove-member]');
    if (!removeButton || teamMembers.length === 1) return;
    teamMembers.splice(Number(removeButton.dataset.removeMember), 1);
    renderTeamEditors();
});

aboutForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(aboutForm);
    aboutContent = {
        pageTitle: formData.get('pageTitle').trim(),
        pageSubtitle: formData.get('pageSubtitle').trim(),
        storyTitle: formData.get('storyTitle').trim(),
        story: formData.get('story').split(/\n\s*\n/).map(value => value.trim()).filter(Boolean),
        mission: formData.get('mission').trim(),
        vision: formData.get('vision').trim(),
        values: formData.get('values').trim(),
        team: teamMembers,
        communityTitle: formData.get('communityTitle').trim(),
        community: formData.get('community').split(/\n\s*\n/).map(value => value.trim()).filter(Boolean)
    };
    window.pharmacyAbout.saveAboutContent(aboutContent);
    showToast('About page content saved');
});

function escapeAdminText(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function clearForm() {
    productForm.reset();
    editProductId.value = '';
    selectedImage = '';
    productImage.value = '';
    imagePreview.hidden = true;
    imagePreviewImage.removeAttribute('src');
    formTitle.textContent = 'Add a product';
    cancelEdit.hidden = true;
}

function showImagePreview(image) {
    selectedImage = image;
    imagePreviewImage.src = image;
    imagePreview.hidden = false;
}

productImage.addEventListener('change', () => {
    const file = productImage.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        productImage.value = '';
        showToast('Please choose an image file');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        productImage.value = '';
        showToast('Photo must be smaller than 2 MB');
        return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => showImagePreview(reader.result));
    reader.readAsDataURL(file);
});

removeImage.addEventListener('click', () => {
    selectedImage = '';
    productImage.value = '';
    imagePreview.hidden = true;
    imagePreviewImage.removeAttribute('src');
});

productForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(productForm);
    const product = {
        id: editProductId.value || `p-${Date.now()}`,
        name: formData.get('name').trim(),
        category: formData.get('category'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        icon: formData.get('icon').trim() || 'fa-pills',
        image: selectedImage,
        description: formData.get('description').trim()
    };

    if (editProductId.value) {
        products = products.map(item => item.id === editProductId.value ? product : item);
        showToast('Product updated successfully');
    } else {
        products.unshift(product);
        showToast('Product added to the website');
    }

    window.pharmacyProducts.saveProducts(products);
    renderTable();
    clearForm();
});

productTableBody.addEventListener('click', event => {
    const editButton = event.target.closest('[data-edit]');
    const deleteButton = event.target.closest('[data-delete]');

    if (editButton) {
        const product = products.find(item => item.id === editButton.dataset.edit);
        if (!product) return;
        Object.entries(product).forEach(([key, value]) => {
            const input = productForm.elements[key];
            if (input) input.value = value;
        });
        selectedImage = product.image || '';
        if (selectedImage) showImagePreview(selectedImage);
        editProductId.value = product.id;
        formTitle.textContent = 'Edit product';
        cancelEdit.hidden = false;
        document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (deleteButton) {
        const product = products.find(item => item.id === deleteButton.dataset.delete);
        if (!product || !window.confirm(`Remove ${product.name} from the website?`)) return;
        products = products.filter(item => item.id !== product.id);
        window.pharmacyProducts.saveProducts(products);
        renderTable();
        showToast('Product removed from the website');
    }
});

ordersList.addEventListener('change', event => {
    const statusSelect = event.target.closest('[data-order-status]');
    if (!statusSelect) return;
    orders = orders.map(order => order.id === statusSelect.dataset.orderStatus ? { ...order, status: statusSelect.value } : order);
    window.pharmacyOrders.saveOrders(orders);
    renderOrders();
    showToast('Order status updated');
});

ordersList.addEventListener('click', event => {
    const archiveButton = event.target.closest('[data-archive-order]');
    if (!archiveButton) return;
    const order = orders.find(item => item.id === archiveButton.dataset.archiveOrder);
    if (!order) return;
    orders = orders.filter(item => item.id !== order.id);
    window.pharmacyOrders.saveOrders(orders);
    renderOrders();
    showToast('Order archived');
});

refreshOrders.addEventListener('click', () => {
    refreshOrderModule();
    showToast('Orders refreshed');
});

window.addEventListener('storage', event => {
    if (event.key === 'redemption-pharmacy-orders') refreshOrderModule();
});

searchProducts.addEventListener('input', renderTable);
cancelEdit.addEventListener('click', clearForm);
resetProducts.addEventListener('click', () => {
    if (!window.confirm('Restore the original demo catalog?')) return;
    products = window.pharmacyProducts.defaultProducts.map(product => ({ ...product }));
    window.pharmacyProducts.saveProducts(products);
    renderTable();
    clearForm();
    showToast('Demo catalog restored');
});

renderTable();
renderOrders();
fillAboutForm();
