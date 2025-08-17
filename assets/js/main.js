// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initFormValidation();
    initAnimations();
    initScrollEffects();
    initChatbot();
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

async function submitForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Mostrar estado "enviando"
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
    submitBtn.disabled = true;

    try {
        // Convertir formData a objeto normal
        const data = Object.fromEntries(formData);

        // Enviar al webhook de n8n
        const response = await fetch("https://nochon.smartbotics.eu/webhook/d51255e2-b1f5-43f2-8870-9969f1a37863", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Error al enviar los datos");
        }

        // Mostrar mensaje de éxito
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth' });

        // Resetear formulario
        form.reset();

        // Ocultar mensaje de éxito después de 10s
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 10000);

    } catch (error) {
        console.error("Error en el envío:", error);
        alert("Hubo un problema al enviar el formulario. Intenta de nuevo.");
    } finally {
        // Resetear botón
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
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

// Chatbot functionality
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSend = document.getElementById('chatbotSend');
    
    if (!chatbotToggle || !chatbotWindow || !chatbotForm) return;
    
    // Generate unique session and conversation IDs based on current time and random values
    const sessionId = 'session_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    const conversationId = 'automate_conv_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', () => {
        const isActive = chatbotWindow.classList.contains('active');
        if (isActive) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', closeChatbot);
    
    // Close chatbot with back button on mobile
    if (window.innerWidth <= 768) {
        window.addEventListener('popstate', (e) => {
            if (chatbotWindow.classList.contains('active')) {
                closeChatbot();
                e.preventDefault();
            }
        });
    }
    
    // Handle viewport changes (keyboard on mobile)
    if (window.innerWidth <= 768) {
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            // Adjust chatbot height when keyboard appears
            const currentHeight = window.innerHeight;
            const heightDiff = initialViewportHeight - currentHeight;
            
            if (heightDiff > 150) { // Keyboard is likely open
                chatbotWindow.style.height = currentHeight + 'px';
            } else {
                chatbotWindow.style.height = '100%';
            }
        });
    }
    
    // Handle form submission
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });
    
    // Auto-resize textarea
    chatbotInput.addEventListener('input', () => {
        chatbotInput.style.height = 'auto';
        chatbotInput.style.height = Math.min(chatbotInput.scrollHeight, 100) + 'px';
        
        // Enable/disable send button
        const message = chatbotInput.value.trim();
        chatbotSend.disabled = !message;
    });
    
    // Handle Enter key (send message)
    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    function openChatbot() {
        chatbotWindow.classList.add('active');
        chatbotToggle.classList.add('active');
        chatbotToggle.innerHTML = '<i class="bi bi-x"></i>';
        
        // Prevent body scroll on mobile when chatbot is open
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
            // Delay focus on mobile to prevent issues with keyboard
            setTimeout(() => chatbotInput.focus(), 300);
        } else {
            chatbotInput.focus();
        }
        
        // Scroll to bottom
        scrollToBottom();
    }
    
    function closeChatbot() {
        chatbotWindow.classList.remove('active');
        chatbotToggle.classList.remove('active');
        chatbotToggle.innerHTML = '<i class="bi bi-chat-dots"></i>';
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    function addMessage(message, isUser = false, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}${isError ? ' chatbot-error' : ''}`;
        messageDiv.textContent = message;
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message chatbot-typing';
        typingDiv.innerHTML = `
            <span>Escribiendo</span>
            <div class="chatbot-typing-dots">
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
            </div>
        `;
        typingDiv.id = 'typingIndicator';
        
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
        
        return typingDiv;
    }
    
    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
    
    function scrollToBottom() {
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
    }
    
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input
        chatbotInput.value = '';
        chatbotInput.style.height = 'auto';
        chatbotSend.disabled = true;
        
        // Show typing indicator
        const typingIndicator = addTypingIndicator();
        
        try {
            // Prepare request data with real user values
            const requestData = {
                message: message,
                conversationId: conversationId, // Unique for this conversation session
                timestamp: new Date().toISOString(), // Current timestamp
                userAgent: navigator.userAgent, // User's browser info
                page: getCurrentPage(), // Current page/section they're viewing
                sessionId: sessionId // Unique for this browser session
            };
            
            // Send request to API
            const response = await fetch('https://apilater-etb3crf5abffg2h2.westeurope-01.azurewebsites.net/api/automate-chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            // Remove typing indicator
            removeTypingIndicator();
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.message) {
                addMessage(data.message);
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
            
        } catch (error) {
            console.error('Chatbot error:', error);
            removeTypingIndicator();
            
            let errorMessage = 'Lo siento, ha ocurrido un error. ';
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Por favor, verifica tu conexión a internet y inténtalo de nuevo.';
            } else {
                errorMessage += 'Inténtalo de nuevo en unos momentos.';
            }
            
            addMessage(errorMessage, false, true);
        }
        
        // Focus back to input
        chatbotInput.focus();
    }
    
    function getCurrentPage() {
        // Get current page based on URL hash or scroll position
        const hash = window.location.hash;
        if (hash && hash.length > 1) {
            return hash.substring(1); // Remove the #
        }
        
        // If no hash, determine current section by scroll position
        const sections = document.querySelectorAll('section[id]');
        let currentSection = 'home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        return currentSection;
    }
    
    // Initial setup
    chatbotSend.disabled = true;
    
    // Auto-open chatbot after 5 seconds
    setTimeout(() => {
        if (!chatbotWindow.classList.contains('active')) {
            openChatbot();
            // Add a welcome message when auto-opening (delay to ensure smooth animation)
            setTimeout(() => {
                addMessage('¡Hola! 👋 Soy tu asistente virtual especializado en automatización empresarial. ¿En qué puedo ayudarte a optimizar tu negocio?');
            }, 800);
        }
    }, 5000);
}
