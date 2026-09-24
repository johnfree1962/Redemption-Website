// Login Form Functionality

// Toggle between Login and Sign Up tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const switchTabButtons = document.querySelectorAll('.switch-tab');

// Tab button click handlers
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        switchTab(tabName);
    });
});

// Switch tab button click handlers (for footer links)
switchTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = btn.dataset.tab;
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Scroll to top of form
    document.querySelector('.login-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target.closest('.toggle-password');
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Form Validation
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value.trim();

    if (!email) {
        showError('Please enter your email address');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!password) {
        showError('Please enter your password');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // If validation passes
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name-signup').value.trim();
    const email = document.getElementById('email-signup').value.trim();
    const password = document.getElementById('password-signup').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const agreeTerms = document.querySelector('input[name="terms"]').checked;

    if (!name) {
        showError('Please enter your full name');
        return;
    }

    if (name.length < 3) {
        showError('Name must be at least 3 characters');
        return;
    }

    if (!email) {
        showError('Please enter your email address');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!password) {
        showError('Please enter a password');
        return;
    }

    if (password.length < 8) {
        showError('Password must be at least 8 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (!agreeTerms) {
        showError('Please agree to the Terms & Conditions');
        return;
    }

    // If validation passes
    showSuccess('Account created successfully! Redirecting...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

// Email Validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Show Error Message
function showError(message) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'login-alert error';
    alert.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;

    document.querySelector('.login-form-container').insertBefore(
        alert,
        document.querySelector('.login-form-container').firstChild
    );

    // Add styles dynamically
    alert.style.cssText = `
        padding: 15px 20px;
        background: #fee;
        border-left: 4px solid #e74c3c;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #e74c3c;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;

    // Remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Show Success Message
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'login-alert success';
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    document.querySelector('.login-form-container').insertBefore(
        alert,
        document.querySelector('.login-form-container').firstChild
    );

    alert.style.cssText = `
        padding: 15px 20px;
        background: #eef;
        border-left: 4px solid #27ae60;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #27ae60;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Social Login Button Handlers
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = btn.classList.contains('google-btn') ? 'Google' : 'Facebook';
        showSuccess(`Signing in with ${provider}...`);
        setTimeout(() => {
            console.log(`${provider} login would be processed here`);
        }, 1500);
    });
});

// Forgot Password Link
document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-login').value.trim();

    if (!email) {
        showError('Please enter your email address first');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    showSuccess(`Password reset link sent to ${email}`);
});

// Real-time Input Validation
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (loginForm) {
    const emailInput = loginForm.querySelector('#email-login');
    const passwordInput = loginForm.querySelector('#password-login');

    emailInput?.addEventListener('blur', () => {
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            emailInput.style.borderColor = '#e74c3c';
        } else {
            emailInput.style.borderColor = '#ecf0f1';
        }
    });

    passwordInput?.addEventListener('blur', () => {
        if (passwordInput.value && passwordInput.value.length < 6) {
            passwordInput.style.borderColor = '#e74c3c';
        } else {
            passwordInput.style.borderColor = '#ecf0f1';
        }
    });
}

if (signupForm) {
    const nameInput = signupForm.querySelector('#name-signup');
    const emailInput = signupForm.querySelector('#email-signup');
    const passwordInput = signupForm.querySelector('#password-signup');
    const confirmInput = signupForm.querySelector('#confirm-password');

    // Name validation
    nameInput?.addEventListener('blur', () => {
        if (nameInput.value && nameInput.value.length < 3) {
            nameInput.style.borderColor = '#e74c3c';
        } else {
            nameInput.style.borderColor = '#ecf0f1';
        }
    });

    // Email validation
    emailInput?.addEventListener('blur', () => {
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            emailInput.style.borderColor = '#e74c3c';
        } else {
            emailInput.style.borderColor = '#ecf0f1';
        }
    });

    // Password validation
    passwordInput?.addEventListener('blur', () => {
        if (passwordInput.value && passwordInput.value.length < 8) {
            passwordInput.style.borderColor = '#e74c3c';
        } else {
            passwordInput.style.borderColor = '#ecf0f1';
        }
    });

    // Confirm password validation
    confirmInput?.addEventListener('blur', () => {
        if (confirmInput.value && confirmInput.value !== passwordInput.value) {
            confirmInput.style.borderColor = '#e74c3c';
        } else {
            confirmInput.style.borderColor = '#ecf0f1';
        }
    });
}

// Enter key to submit form
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-content.active');
        const form = activeTab.querySelector('form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Auto-focus on form load
window.addEventListener('load', () => {
    const activeInput = document.querySelector('.tab-content.active input:first-of-type');
    if (activeInput) {
        activeInput.focus();
    }
});

// Track user activity for better UX
let userInteracted = false;
document.addEventListener('click', () => {
    userInteracted = true;
});
document.addEventListener('keypress', () => {
    userInteracted = true;
});

// Console message
console.log('MediCare Pharmacy - Login System Loaded');
console.log('Made with ❤️ for your health');
