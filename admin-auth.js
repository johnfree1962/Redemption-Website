const ADMIN_SESSION_KEY = 'redemption-admin-session';
const ADMIN_EMAIL = 'admin@redemptionpharmacy.com';
const ADMIN_PASSWORD_HASH = 'a36aef5a11c4073fbe60314fc9df530a9d5f986533594d1f5190742ff9e0e408';
const ADMIN_SESSION_DURATION = 30 * 60 * 1000;

async function hashAdminPassword(password) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function hasAdminSession() {
    try {
        const session = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY));
        return session?.email === ADMIN_EMAIL && Date.now() - session.createdAt < ADMIN_SESSION_DURATION;
    } catch (error) {
        return false;
    }
}

function startAdminSession() {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ email: ADMIN_EMAIL, createdAt: Date.now() }));
}

function endAdminSession() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function protectAdminPage() {
    if (window.location.pathname.endsWith('/admin.html') && !hasAdminSession()) {
        window.location.replace('admin-login.html');
    }
}

async function handleAdminLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const errorMessage = document.getElementById('adminLoginError');
    const submitButton = form.querySelector('button[type="submit"]');

    errorMessage.hidden = true;
    submitButton.disabled = true;

    const passwordHash = await hashAdminPassword(password);
    if (email !== ADMIN_EMAIL || passwordHash !== ADMIN_PASSWORD_HASH) {
        errorMessage.textContent = 'The email or password is incorrect.';
        errorMessage.hidden = false;
        submitButton.disabled = false;
        return;
    }

    startAdminSession();
    window.location.replace('admin.html');
}

protectAdminPage();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) loginForm.addEventListener('submit', handleAdminLogin);

    const logoutButton = document.getElementById('adminLogout');
    if (logoutButton) logoutButton.addEventListener('click', () => {
        endAdminSession();
        window.location.replace('admin-login.html');
    });
});

window.adminAuth = { hasAdminSession, endAdminSession };
