// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.style.display = 'none';
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation class
document.querySelectorAll('.service-card, .product-card, .stat-card, .reason, .testimonial')
    .forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

// Form submission handler
const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Get form data
    const formData = new FormData(form);
    
    // Simple validation
    let isValid = true;
    const usernameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    
    if (!usernameInput?.value.trim()) {
        alert('Please enter your name');
        isValid = false;
    }
    
    if (!emailInput?.value.trim() || !isValidEmail(emailInput.value)) {
        alert('Please enter a valid email');
        isValid = false;
    }
    
    if (!messageInput?.value.trim()) {
        alert('Please enter a message');
        isValid = false;
    }
    
    if (isValid) {
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
    }
};

// Email validation
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Attach form submission handlers
document.querySelectorAll('form').forEach(form => {
    if (form.id !== 'orderForm') form.addEventListener('submit', handleFormSubmit);
});

// Counter animation for stats
const animateCounters = () => {
    const statCards = document.querySelectorAll('.stat-card h3');
    
    statCards.forEach(card => {
        const target = parseInt(card.textContent);
        if (target && !isNaN(target)) {
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    card.textContent = card.textContent; // Keep original text
                    clearInterval(timer);
                } else {
                    card.textContent = Math.floor(current) + (card.textContent.includes('+') ? '+' : '');
                }
            }, 30);
        }
    });
};

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.unobserve(statsSection);
        }
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Responsive navigation
const updateNavigation = () => {
    const width = window.innerWidth;
    if (width > 768) {
        navLinks.style.display = 'flex';
        hamburger?.classList.remove('active');
    }
};

window.addEventListener('resize', updateNavigation);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});

// Product filtering and search (if product page exists)
let activeProductCategory = 'all';

const filterProducts = (category = activeProductCategory, searchTerm = '') => {
    const products = document.querySelectorAll('.product-card');
    activeProductCategory = category;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    products.forEach(product => {
        const matchesCategory = category === 'all' || product.dataset.category === category;
        const matchesSearch = !normalizedSearch || product.textContent.toLowerCase().includes(normalizedSearch);
        if (matchesCategory && matchesSearch) {
            product.style.display = 'block';
            setTimeout(() => product.style.opacity = '1', 10);
        } else {
            product.style.opacity = '0';
            setTimeout(() => product.style.display = 'none', 300);
        }
    });
};

// Add click handler to filter buttons if they exist
document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        filterProducts(button.dataset.filter, document.getElementById('productSearch')?.value || '');
    });
});

document.getElementById('productSearch')?.addEventListener('input', event => {
    filterProducts(activeProductCategory, event.target.value);
});

console.log('MediCare Pharmacy Website Loaded Successfully');
