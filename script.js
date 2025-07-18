// Language Toggle - DEFAULT TO DARI
let currentLang = 'dari'; // Changed from 'en' to 'dari'

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'dari' : 'en';
    document.body.classList.toggle('rtl', currentLang === 'dari');
    document.getElementById('lang-text').textContent = currentLang === 'en' ? 'دری' : 'English';
    
    // Update HTML lang and dir attributes
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'dari' ? 'rtl' : 'ltr');
    
    // Update all elements with data-en and data-dari attributes
    document.querySelectorAll('[data-en][data-dari]').forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.tagName === 'OPTION') {
            element.textContent = text;
        } else if (element.tagName === 'SPAN' || element.parentElement.tagName === 'LI') {
            // For spans inside list items, just update the text content
            element.textContent = text;
        } else {
            element.textContent = text;
        }
    });
    
    // Update theme button text
    const isDark = document.body.classList.contains('dark');
    const themeText = document.getElementById('theme-text');
    if (themeText) {
        if (currentLang === 'dari') {
            themeText.textContent = isDark ? 'روشن' : 'تاریک';
        } else {
            themeText.textContent = isDark ? 'Light' : 'Dark';
        }
    }
    
    // Save preference
    localStorage.setItem('language', currentLang);
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    if (themeText) {
        if (currentLang === 'dari') {
            themeText.textContent = isDark ? 'روشن' : 'تاریک';
        } else {
            themeText.textContent = isDark ? 'Light' : 'Dark';
        }
    }
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// FAQ Toggle functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Gallery Filter Functionality
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Hero Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Validation (Updated to make email optional)
function validateForm(form) {
    const firstName = form.querySelector('#firstName');
    const lastName = form.querySelector('#lastName');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    // Clear previous error styles
    [firstName, lastName, phone, email, subject, message].forEach(field => {
        if (field) {
            field.style.borderColor = '';
        }
    });
    
    // Validate required fields
    if (firstName && !firstName.value.trim()) {
        firstName.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (lastName && !lastName.value.trim()) {
        lastName.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (phone && !phone.value.trim()) {
        phone.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    // Email is now optional - only validate if filled
    if (email && email.value.trim() && !isValidEmail(email.value)) {
        email.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (subject && !subject.value) {
        subject.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    if (message && !message.value.trim()) {
        message.style.borderColor = '#e74c3c';
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Intersection Observer for fade-in animation
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Close mobile menu when clicking outside
function initMobileMenuClose() {
    document.addEventListener('click', function(event) {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && mobileMenuToggle && 
            !navMenu.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Initialize page with Dari as default
function initializePageLanguage() {
    // Set initial language to Dari
    document.body.classList.add('rtl');
    document.documentElement.setAttribute('lang', 'dari');
    document.documentElement.setAttribute('dir', 'rtl');
    
    // Update all elements to show Dari text
    document.querySelectorAll('[data-en][data-dari]').forEach(element => {
        const dariText = element.getAttribute('data-dari');
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = dariText;
        } else if (element.tagName === 'OPTION') {
            element.textContent = dariText;
        } else {
            element.textContent = dariText;
        }
    });
    
    // Set language toggle button text
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = 'English';
    }
    
    // Set theme button text in Dari
    const themeText = document.getElementById('theme-text');
    if (themeText) {
        themeText.textContent = 'تاریک';
    }
}

// Load saved preferences
function loadPreferences() {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');
    
    // Load saved language or default to Dari
    if (savedLanguage === 'en') {
        currentLang = 'dari'; // Set to dari so toggle will switch to en
        toggleLanguage();
    } else {
        // Default to Dari or load saved Dari preference
        initializePageLanguage();
    }
    
    // Load saved theme
    if (savedTheme === 'dark') {
        toggleTheme();
    }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load preferences
    loadPreferences();
    
    // Initialize features
    initHeroSlider();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenuClose();
    initGalleryFilter();
    
    // Load More functionality for gallery
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            alert(currentLang === 'en' ? 
                'More photos would be loaded here' : 
                'عکس‌های بیشتر در اینجا بارگذاری می‌شوند');
        });
    }
});

// Add visible class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);