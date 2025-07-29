// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initFormValidation();
    initAnimations();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 39, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        }
    });
    
    // Smooth scroll and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    
    // Clear previous errors
    form.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(error => {
        error.remove();
    });
    
    // Required fields validation
    const requiredFields = [
        { id: 'contactName', message: 'El nombre de contacto es obligatorio' },
        { id: 'phone', message: 'El teléfono es obligatorio' }
    ];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            showFieldError(input, field.message);
            isValid = false;
        }
    });
    
    // Legal acceptance validation
    const legalAcceptance = document.getElementById('legalAcceptance');
    if (!legalAcceptance.checked) {
        showFieldError(legalAcceptance, 'Debe aceptar el aviso legal para continuar');
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    if (phone.value.trim() && !isValidPhone(phone.value)) {
        showFieldError(phone, 'Por favor, introduce un teléfono válido');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value ? field.value.trim() : '';
    
    // Special handling for checkboxes
    if (field.type === 'checkbox') {
        if (field.hasAttribute('required') && !field.checked) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        clearFieldError(field);
        return true;
    }
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Por favor, introduce un teléfono válido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const parentNode = field.type === 'checkbox' ? field.closest('.form-check') : field.parentNode;
    const existingError = parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const parentNode = field.type === 'checkbox' ? field.closest('.form-check') : field.parentNode;
    const errorMessage = parentNode.querySelector('.invalid-feedback');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Spanish phone number validation (basic)
    const phoneRegex = /^(\+34|0034|34)?[6-9]\d{8}$/;
    const cleanPhone = phone.replace(/[\s-]/g, '');
    return phoneRegex.test(cleanPhone);
}

function submitForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Log form data (for development)
        console.log('Form Data:', Object.fromEntries(formData));
        
        // Show success message
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth' });
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Hide success message after 10 seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 10000);
        
    }, 2000); // Simulate 2 second delay
}

// Animation and scroll effects
function initAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .detail-card, .experience-highlight, .implementation-card, .solution-card, .pricing-card, .contact-form-wrapper'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

function initScrollEffects() {
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Add counter animation for results
    const counters = document.querySelectorAll('.result-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/\D/g, ''));
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 30; // Animation duration in frames
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + (hasPercent ? '%' : '');
    }, 50);
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Mobile menu enhancements
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
});

// Performance optimization - Lazy load images when they enter viewport
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error to analytics service here
});

// Export functions for potential use by other scripts
window.IAApp = {
    validateForm,
    submitForm,
    animateCounter
};

// Legal notice acceptance function
function acceptLegalNotice() {
    const checkbox = document.getElementById('legalAcceptance');
    if (checkbox) {
        checkbox.checked = true;
        clearFieldError(checkbox);
    }
}
