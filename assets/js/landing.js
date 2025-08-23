/* ========================================
   Food Ninja - Landing Page JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍃 Food Ninja Landing Page loaded');
    
    // Initialize all components
    initNavbar();
    initSmoothScrolling();
    initAnimations();
    initStatsCounter();
    initTestimonialSlider();
    initParallaxEffects();
    
    // Check for PWA install prompt
    checkPWAInstall();
});

/* ========================================
   Navbar Functions
   ======================================== */

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Handle scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu on link click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }
}

/* ========================================
   Smooth Scrolling
   ======================================== */

function initSmoothScrolling() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll to demo function
    window.scrollToDemo = function() {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
}

/* ========================================
   Animations and Effects
   ======================================== */

function initAnimations() {
    // Floating food animations
    const floatingFoods = document.querySelectorAll('.floating-food');
    floatingFoods.forEach((food, index) => {
        // Random animation delays and durations
        const delay = Math.random() * 2;
        const duration = 6 + Math.random() * 4;
        
        food.style.animationDelay = `${delay}s`;
        food.style.animationDuration = `${duration}s`;
    });
    
    // Floating cards around phone mockup
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Feature cards hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Step cards animation on scroll
    const stepCards = document.querySelectorAll('.step-card');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    stepCards.forEach(card => {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease';
        stepObserver.observe(card);
    });
}

/* ========================================
   Stats Counter Animation
   ======================================== */

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStatNumbers();
            }
        });
    }, { threshold: 0.5 });
    
    if (statNumbers.length > 0) {
        counterObserver.observe(statNumbers[0].closest('.hero-stats'));
    }
    
    function animateStatNumbers() {
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[\d,]/g, '');
            
            let current = 0;
            const increment = number / 60; // 60 frames for 1 second animation
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                stat.textContent = Math.floor(current).toLocaleString() + suffix;
            }, 16); // ~60fps
        });
    }
}

/* ========================================
   Testimonial Slider (Simple)
   ======================================== */

function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    // Add auto-rotation effect
    setInterval(() => {
        testimonials.forEach((testimonial, index) => {
            testimonial.style.transform = index === currentTestimonial ? 'scale(1.02)' : 'scale(1)';
            testimonial.style.transition = 'transform 0.5s ease';
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }, 4000);
}

/* ========================================
   Parallax Effects
   ======================================== */

function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Hero section parallax
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const heroOffset = scrolled * 0.3;
            heroSection.style.transform = `translateY(${heroOffset}px)`;
        }
    });
}

/* ========================================
   CTA Button Interactions
   ======================================== */

function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-success');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ========================================
   PWA Install Prompt
   ======================================== */

function checkPWAInstall() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA install prompt available');
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button if needed
        showInstallPrompt();
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        hideInstallPrompt();
    });
    
    function showInstallPrompt() {
        // You can show a custom install prompt here
        console.log('Showing PWA install prompt');
    }
    
    function hideInstallPrompt() {
        // Hide the install prompt
        console.log('Hiding PWA install prompt');
    }
    
    // Global function for install button
    window.installPWA = async function() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            deferredPrompt = null;
        }
    };
}

/* ========================================
   Form Interactions
   ======================================== */

function initFormInteractions() {
    // Newsletter signup (if exists)
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Simulate newsletter signup
                showNotification('Cảm ơn bạn đã đăng ký!', 'success');
                this.reset();
            }
        });
    }
}

/* ========================================
   Scroll Indicator
   ======================================== */

function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
        
        // Hide scroll indicator after scrolling
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

/* ========================================
   Utility Functions
   ======================================== */

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ========================================
   Performance Optimizations
   ======================================== */

// Debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events that don't need to fire constantly
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Lazy loading for images
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

/* ========================================
   Initialize Everything
   ======================================== */

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCTAButtons();
    initFormInteractions();
    initScrollIndicator();
    initLazyLoading();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations or reduce activity when tab is not visible
        console.log('Page hidden - reducing activity');
    } else {
        // Resume normal activity
        console.log('Page visible - resuming activity');
    }
});

console.log('🚀 Food Ninja Landing JavaScript loaded successfully!');
