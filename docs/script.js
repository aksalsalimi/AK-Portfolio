// Matrix rain effect for hero section
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hero = document.querySelector('.hero-section');
        
        this.hero.style.position = 'relative';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.opacity = '0.15';
        this.canvas.style.pointerEvents = 'none';
        
        this.hero.insertBefore(this.canvas, this.hero.firstChild);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.drops = [];
        this.fontSize = 14;
        this.running = true;
        
        this.init();
        this.animate();

        // Pause animation when not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.running = entry.isIntersecting;
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.hero);
    }
    
    resize() {
        this.canvas.width = this.hero.offsetWidth;
        this.canvas.height = this.hero.offsetHeight;
        this.init();
    }
    
    init() {
        const columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        for(let i = 0; i < columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }
    
    animate() {
        if (!this.running) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'px monospace';
        
        for(let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillText(char, x, y);
            
            if(y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth scrolling with progress indication
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Remove active class from all links
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Enhanced typing effect
function typeWriter(element, text, speed = 50, callback = null) {
    let i = 0;
    element.innerHTML = '';
    element.style.opacity = '1';
    
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === ' ') {
                element.innerHTML += ' ';
            } else {
                element.innerHTML += `<span style="animation: glow 1s ${i * 0.1}s infinite">${text.charAt(i)}</span>`;
            }
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// Glitch effect with better performance
function addGlitchEffect(element) {
    let isGlitching = false;
    
    element.addEventListener('mouseover', function() {
        if (isGlitching) return;
        
        isGlitching = true;
        const originalText = this.textContent;
        let iterations = 0;
        const maxIterations = originalText.length * 3;
        
        const interval = setInterval(() => {
            this.textContent = originalText
                .split("")
                .map((letter, index) => {
                    if(index < iterations / 3) {
                        return originalText[index];
                    }
                    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                })
                .join("");
            
            if(iterations >= maxIterations) {
                clearInterval(interval);
                this.textContent = originalText;
                isGlitching = false;
            }
            iterations++;
        }, 30);
    });
}

// Enhanced smooth scroll with dynamic offset
function smoothScrollTo(target, offset = 0) {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - offset;
    
    window.scrollTo({
        top: startPosition + distance,
        behavior: 'smooth'
    });
}

// Logo click handler - scroll to top
document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced navigation scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.classList.contains('logo')) return; // Skip logo
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--header-height'));
            smoothScrollTo(target, headerOffset);
        }
    });
});

// Handle window resize for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Update header height for scroll offset
        const header = document.querySelector('header');
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        
        // Close mobile menu if window is resized larger
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu();
        }
    }, 250);
});

// Initial header height setup
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
});

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize matrix rain effect
    new MatrixRain();
    
    // Add glitch effect to headings
    document.querySelectorAll('h2, h3').forEach(addGlitchEffect);
    
    // Typing effect for hero section subtitle
    const subtitle = document.querySelector('.hero-section h2');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText);
    }
    
    // Enhanced scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    document.querySelectorAll('section').forEach(section => {
        section.style.transform = 'translateY(20px)';
        section.style.opacity = '0';
        section.style.transition = 'all 0.5s ease-out';
        observer.observe(section);
    });
    
    // Add hover animations to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelectorAll('li').forEach((li, index) => {
                li.style.transform = 'translateX(10px)';
                li.style.transition = `transform 0.3s ease ${index * 0.1}s`;
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelectorAll('li').forEach(li => {
                li.style.transform = 'translateX(0)';
            });
        });
    });
});

// Scroll reveal animation
const sections = document.querySelectorAll('section');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero-section')) {
                startMatrixRain();
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Scroll progress indicator
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
};

createScrollIndicator();

// Enhanced hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Mobile menu handling
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
let isMenuOpen = false;

function toggleMenu(event) {
    if (event) {
        event.stopPropagation();
    }
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('show');
    mobileMenuBtn.innerHTML = isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !e.target.closest('nav')) {
        toggleMenu();
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});

// Close menu when window is resized above mobile breakpoint
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMenu();
    }
});

// Form submission handler
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = {
            name: form.querySelector('input[name="name"]').value,
            email: form.querySelector('input[name="email"]').value,
            subject: form.querySelector('input[name="subject"]').value,
            message: form.querySelector('textarea[name="message"]').value
        };

        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        // Show success message
        form.reset();
        alert('Message sent successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again later.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    
    // Change button state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    
    // Simulate API call
    setTimeout(() => {
        // Show confirmation message
        const confirmationMessage = document.getElementById('confirmationMessage');
        confirmationMessage.classList.add('show');
        
        // Reset form
        this.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-shield-alt btn-icon';
        
        // Hide confirmation message after 5 seconds
        setTimeout(() => {
            confirmationMessage.classList.remove('show');
        }, 5000);
    }, 1500);
});
