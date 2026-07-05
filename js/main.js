/**
 * ============================================================================
 * MAIN.JS — Interactive Features
 * ============================================================================
 */

// ----- 1. DARK MODE TOGGLE -----
const profilePic = document.getElementById('profilePic');
const toggleIcon = document.getElementById('toggleIcon');
const toggleBtn = document.getElementById('darkModeToggle');

function toggleMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    
    if (toggleIcon) {
        toggleIcon.src = isDark ? '../media/header_dark.png' : '../media/header_light.png';
    }
    
    if (profilePic) {
        profilePic.style.transition = 'opacity 0.3s ease';
        profilePic.style.opacity = '0.7';
        setTimeout(() => {
            profilePic.style.opacity = '1';
        }, 300);
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (toggleIcon) {
        toggleIcon.src = '../media/header_dark.png';
    }
} else {
    if (toggleIcon) {
        toggleIcon.src = '../media/header_light.png';
    }
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMode);
}

// ----- 2. CARD REVEAL WITH SLIDING EFFECT (Right → Left) -----
/**
 * Cards slide in from the right when scrolling down
 * AND slide out to the left when scrolling past them
 * Creates a continuous left-right flow with the header name
 */
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!projectCards.length) return;
    
    // Use Intersection Observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            const card = entry.target;
            
            if (entry.isIntersecting) {
                // Card is entering viewport → slide in from right
                const delay = Array.from(projectCards).indexOf(card) * 150;
                setTimeout(() => {
                    card.classList.remove('visible-exit');
                    card.classList.add('visible');
                }, delay);
            } else {
                // Card is leaving viewport → slide out to left
                // Only apply if it was visible before
                if (card.classList.contains('visible')) {
                    card.classList.remove('visible');
                    card.classList.add('visible-exit');
                }
            }
        });
    }, {
        threshold: 0.1, // 10% visible triggers
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each card
    projectCards.forEach(card => {
        observer.observe(card);
    });
});

// ----- 3. GOOFY CARD MOVEMENT (Random offset on hover) -----
/**
 * Cards move randomly on hover for playful effect
 * Now works alongside the reveal animation
 */
function randomOffset() {
    const magnitude = Math.random() * 25 + 5; // 5-30px
    const sign = Math.random() < 0.5 ? -1 : 1;
    return magnitude * sign;
}

// Apply to ALL cards (including project cards)
const allCards = document.querySelectorAll('.card');

allCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        const x = randomOffset();
        const y = randomOffset();
        // Use CSS custom properties for smooth transition
        this.style.setProperty('--goofy-x', x + 'px');
        this.style.setProperty('--goofy-y', y + 'px');
        // The transform is already defined in CSS with the variables
    });

    card.addEventListener('mouseleave', function() {
        this.style.setProperty('--goofy-x', '0px');
        this.style.setProperty('--goofy-y', '0px');
    });
});

// ----- 4. TROLLOMETER -----
const btn = document.getElementById('trollBtn');
const counterDisplay = document.getElementById('counter');
const trollBar = document.getElementById('trollBar');

if (btn && counterDisplay) {
    let count = parseInt(localStorage.getItem('trollCount')) || 0;
    counterDisplay.textContent = count;
    if (trollBar) {
        trollBar.style.width = Math.min(count * 1.5, 100) + '%';
    }

    btn.addEventListener('click', function() {
        count = count + 1;
        counterDisplay.textContent = count;
        localStorage.setItem('trollCount', count);
        
        if (trollBar) {
            trollBar.style.width = Math.min(count * 1.5, 100) + '%';
        }

        const messages = {
            5: ' (it\'s ok, breathe)',
            10: ' (broooo get out of here)',
            20: ' FOUND SOME FRIENDS BRO PLEASE',
            67: ' SIX SEVEN SIX SEVEN TASTY CROUTSY',
            100: ' YOU BROKE THE TROLLOMETER'
        };
        
        if (messages[count]) {
            counterDisplay.textContent = count + messages[count];
        }
    });
}

// ----- 5. PARALLAX NAME (Left → Right) -----
/**
 * The big background name moves from LEFT to RIGHT as you scroll
 * Opposite direction to the cards (Right → Left)
 * Creates a beautiful tension/flow between header and content
 */
document.addEventListener('DOMContentLoaded', function() {
    const nameElement = document.querySelector('.header-background-name');
    const header = document.querySelector('header');
    
    if (!nameElement || !header) return;
    
    let isScrolling = false;
    let rafId = null;
    
    function updateNamePosition() {
        if (!nameElement) return;
        
        const scrollY = window.scrollY;
        // MOVES LEFT TO RIGHT: positive direction
        // Negative value would move left, positive moves right
        const moveAmount = scrollY * 0.3; // Changed from -0.3 to +0.3
        
        nameElement.style.transform = `translate(calc(-50% + ${moveAmount}px), -50%)`;
        
        // Slightly increase opacity as user scrolls
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;
        const opacity = 0.07 + (scrollPercent * 0.05);
        nameElement.style.opacity = Math.min(opacity, 0.15);
    }
    
    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            rafId = requestAnimationFrame(() => {
                updateNamePosition();
                isScrolling = false;
            });
        }
    }
    
    // Initial position
    updateNamePosition();
    
    // Listen to scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateNamePosition);
});

// ----- 6. SMOOTH SCROLL -----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ----- 7. CONTACT FORM -----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'SENT';
        btn.style.opacity = '0.5';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.opacity = '1';
            this.reset();
        }, 2000);
    });
}

// ----- 8. CONSOLE EASTER EGG -----
console.log('%c SIMON LABARTHE ', 'background: #a3161d; color: #f3f1e8; font-size: 20px; padding: 10px; font-family: "Bodoni Moda", serif;');
console.log('%c You found the secret console. Nice.', 'color: #a3161d; font-size: 14px;');
console.log('%c ➜ github.com/simooooone', 'color: #2f6b45; font-size: 12px;');