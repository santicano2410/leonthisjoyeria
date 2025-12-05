// ===== GLOBAL VARIABLES =====
let isInitialized = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialization started
    
    if (!isInitialized) {
        initializePage();
        isInitialized = true;
    }
});

// ===== INITIALIZE PAGE =====
function initializePage() {
    setupAnimations();
    setupButtonHandlers();
    setupWhatsAppIntegration();
    setupSocialLinks();
    setupKeyboardNavigation();
    setupPerformanceOptimizations();
    setupBackgroundVideo(); // Nueva función para video de fondo
    
    // Add loaded class for CSS animations
    document.body.classList.add('loaded');
    
    // Features initialized
}

// ===== ANIMATIONS SETUP =====
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all buttons and profile elements
    const elementsToAnimate = document.querySelectorAll('.btn, .logo, .brand-info');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// ===== BUTTON HANDLERS =====
function setupButtonHandlers() {
    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
        
        // Enhanced hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Touch feedback for mobile
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// ===== RIPPLE EFFECT =====
function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Add ripple animation to styles if not exists
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
    
    // Ensure button has position relative for ripple positioning
    if (getComputedStyle(button).position === 'static') {
        button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== WHATSAPP INTEGRATION =====
function setupWhatsAppIntegration() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // WhatsApp Business integration
            const phoneNumber = '573044020836'; // Replace with your WhatsApp Business number
            const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus servicios. 🚀');
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            // Show loading state
            const originalText = this.querySelector('.btn-main').textContent;
            this.querySelector('.btn-main').textContent = 'Conectando...';
            this.style.opacity = '0.7';
            
            // Open WhatsApp with fallback
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                
                // Reset button state
                this.querySelector('.btn-main').textContent = originalText;
                this.style.opacity = '1';
                
                // Track interaction (you can integrate with analytics here)
                trackEvent('whatsapp_click', 'engagement');
            }, 500);
        });
    }
}

// ===== SOCIAL LINKS SETUP =====
function setupSocialLinks() {
    const socialButtons = document.querySelectorAll('.btn-secondary');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add visual feedback before opening
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track social link clicks
            const platform = this.textContent.trim().toLowerCase();
            trackEvent(`${platform}_click`, 'social_engagement');
        });
    });
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC to close any overlays (future feature)
        if (e.key === 'Escape') {
            // Future: close modals, etc.
        }
        
        // Enter and Space to activate focused buttons
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('btn')) {
            e.preventDefault();
            e.target.click();
        }
        
        // Arrow navigation for buttons
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const buttons = Array.from(document.querySelectorAll('.btn'));
            const currentIndex = buttons.indexOf(document.activeElement);
            
            if (currentIndex !== -1) {
                e.preventDefault();
                let nextIndex;
                
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % buttons.length;
                } else {
                    nextIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
                }
                
                buttons[nextIndex].focus();
            }
        }
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function setupPerformanceOptimizations() {
    // Lazy load images that are not immediately visible
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Observe any images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload important resources
    preloadResources();
}

// ===== RESOURCE PRELOADING =====
function preloadResources() {
    // Preload WhatsApp URL for faster opening
    const whatsappUrl = 'https://wa.me/573001234567';
    
    // Create invisible link for preloading
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'prefetch';
    preloadLink.href = whatsappUrl;
    document.head.appendChild(preloadLink);
}

// ===== EVENT TRACKING (Mock Analytics) =====
function trackEvent(eventName, category) {
    // This is where you would integrate with Google Analytics, Mixpanel, etc.
    // Event tracked (analytics placeholder)
    
    if (window.customAnalytics) {
        window.customAnalytics.track(eventName, {
            category: category,
            timestamp: new Date().toISOString(),
            page: 'link-in-bio'
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// (scrollToTop removed for now)

// Copy text to clipboard (for future features)
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('¡Copiado al portapapeles!', 'success');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showNotification('Error al copiar', 'error');
    }
}

// Show notifications (simple implementation)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#34D399' : '#EF4444'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
    
    // You could send error reports to your error tracking service here
    // (Optional) Send error to error tracking service
});

// ===== RESPONSIVE UTILITIES =====
// (isMobile and isTouchDevice removed; add back if external API is required)

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #34D399;
        color: #064E3B;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 600;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.id = 'main-content';
        mainContainer.setAttribute('role', 'main');
    }
}

// Initialize accessibility enhancements
enhanceAccessibility();

// ===== BACKGROUND VIDEO SETUP =====
function setupBackgroundVideo() {
    const video = document.getElementById('backgroundVideo');
    if (!video) {
        // Background video element not found
        return;
    }

    // Setting up background video...
    
    // Configure video for optimal performance
    video.addEventListener('loadstart', function() {
        // Video loading started
    });
    
    video.addEventListener('canplay', function() {
        // Video ready to play
        video.style.opacity = '1';
    });
    
    video.addEventListener('error', function(e) {
        // Video error
        showVideoFallback();
    });
    
    // Try to play the video
    video.play().then(() => {
        // Video playing successfully
    }).catch((error) => {
        // Video play failed
        showVideoFallback();
    });
    
    // Pause video when tab is not active (battery saving)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(() => {});
        }
    });
    
    // Handle responsive video
    window.addEventListener('resize', function() {
        if (video.offsetWidth !== window.innerWidth) {
            video.style.width = '100vw';
            video.style.height = '100vh';
        }
    });
    
    // Background video setup complete
}

// ===== VIDEO FALLBACK =====
function showVideoFallback() {
    // Showing video fallback (static background)
    const video = document.getElementById('backgroundVideo');
    if (video) {
        video.style.display = 'none';
    }
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.TechSolutions = {
    trackEvent,
    copyToClipboard,
    showNotification
};

// Application loaded
