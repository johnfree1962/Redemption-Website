const CATEGORY_STORAGE_KEY = 'redemption-pharmacy-categories';

const defaultCategories = [
    { id: 'pain', name: 'Pain relief' },
    { id: 'vitamins', name: 'Vitamins' },
    { id: 'cold', name: 'Cold & flu' },
    { id: 'skin', name: 'Skincare' },
    { id: 'digestive', name: 'Digestive' }
];

function getCategories() {
    try {
        const savedCategories = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY));
        return Array.isArray(savedCategories) && savedCategories.length ? savedCategories : defaultCategories;
    } catch (error) {
        return defaultCategories;
    }
}

function saveCategories(categories) {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
}

function categoryIdFromName(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

window.pharmacyCategories = { defaultCategories, getCategories, saveCategories, categoryIdFromName };