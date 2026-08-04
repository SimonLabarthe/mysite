/**
 * ============================================================================
 * MAIN.JS — Interactive Features
 * ============================================================================
 *
 * HOW THIS FILE IS ORGANIZED:
 * Each numbered section owns ONE feature and is self-contained — it grabs
 * the DOM elements it needs, guards against them not existing (see below),
 * and attaches its own listeners. Sections don't depend on each other, so
 * you can delete a whole numbered block without breaking the rest of the
 * file.
 *
 * THE GUARD PATTERN YOU'LL SEE EVERYWHERE:
 *   const btn = document.getElementById('someId');
 *   if (btn) { ... }
 * This file is shared across index.html, projects.html, about.html and
 * contact.html, and not every page has every element (e.g. index.html has
 * no trollometer). Without the `if (btn)` check, calling
 * `document.getElementById(...)` on a missing element returns `null`, and
 * the very next line (`btn.addEventListener(...)`) would throw and stop
 * ALL the code below it from running — including features on other,
 * unrelated sections of this file. Always guard before using an element
 * you grabbed by id/selector.
 *
 * WHERE TO ADD NEW STUFF:
 * - A new independent interactive feature -> a new numbered section at the
 *   end, following the same "grab element -> guard -> attach behavior"
 *   pattern.
 * - A tweak to an existing feature -> inside that feature's existing
 *   section, not bolted on elsewhere.
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
        toggleIcon.src = isDark ? 'media/header_dark.png' : 'media/header_light.png';
    }

    if (profilePic) {
        // Small opacity blip on the profile picture so the theme switch
        // feels connected to the whole header, not just the toggle button
        profilePic.style.transition = 'opacity 0.3s ease';
        profilePic.style.opacity = '0.7';
        setTimeout(() => {
            profilePic.style.opacity = '1';
        }, 300);
    }

    // Persisted on purpose: dark/light mode is a genuine user preference
    // that should survive a page reload or a new visit.
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Apply the saved theme immediately on load (before paint would be even
// better — see note below — but this keeps things simple for now)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (toggleIcon) {
        toggleIcon.src = 'media/header_dark.png';
    }
} else if (toggleIcon) {
    toggleIcon.src = 'media/header_light.png';
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMode);
}

// ----- 2. RANDOM HEADER FONT -----
/**
 * Deliberately NOT persisted (no localStorage/sessionStorage here) — the
 * whole point is that the title font is different every time the page
 * loads. This sets CSS custom properties on <html>, which style.css reads
 * as `var(--random-font, var(--serif))` on `header h1` — see style.css §7.
 * Fallback to --serif keeps the header readable even before this script
 * runs, or if it fails.
 */
(function() {
    const fontOptions = [
        { family: "'Bodoni Moda', serif", size: "3.4rem" },
        { family: "'IBM Plex Mono', monospace", size: "2.6rem" }
    ];

    const choice = fontOptions[Math.floor(Math.random() * fontOptions.length)];

    document.documentElement.style.setProperty('--random-font', choice.family);
    document.documentElement.style.setProperty('--random-size', choice.size);
})();

// ----- 3. PROJECT CARD SCROLL REVEAL (right -> left) -----
/**
 * Cards slide in from the right when scrolled into view, and slide back
 * out to the left when scrolled past — creating a continuous flow that
 * mirrors the header name's left-to-right parallax (§5) in the opposite
 * direction.
 * Uses IntersectionObserver instead of a scroll event listener because
 * it's far cheaper: the browser notifies us only when a card's visibility
 * actually changes, instead of us re-checking every card on every pixel
 * of scroll.
 */
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');

    if (!projectCards.length) return; // no project cards on this page

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const card = entry.target;

            if (entry.isIntersecting) {
                // Staggered delay by index so cards don't all pop in at once
                const delay = Array.from(projectCards).indexOf(card) * 150;
                setTimeout(() => {
                    card.classList.remove('visible-exit');
                    card.classList.add('visible');
                }, delay);
            } else if (card.classList.contains('visible')) {
                // Only animate the exit if it was actually visible before —
                // otherwise a card would "exit" before ever entering
                card.classList.remove('visible');
                card.classList.add('visible-exit');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    projectCards.forEach(card => observer.observe(card));
});

// ----- 4. RANDOM HOVER WIGGLE ("goofy" offset) -----
/**
 * Applies to ALL `.card` elements (project cards included). Sets CSS
 * variables (--goofy-x/--goofy-y) that style.css's `.project-card:hover`
 * transform reads — the JS only picks the random numbers, the CSS owns
 * how they're applied, keeping the "what moves" logic out of JS.
 */
function randomOffset() {
    const magnitude = Math.random() * 25 + 5; // 5-30px
    const sign = Math.random() < 0.5 ? -1 : 1;
    return magnitude * sign;
}

const allCards = document.querySelectorAll('.card');

allCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        this.style.setProperty('--goofy-x', randomOffset() + 'px');
        this.style.setProperty('--goofy-y', randomOffset() + 'px');
    });

    card.addEventListener('mouseleave', function() {
        this.style.setProperty('--goofy-x', '0px');
        this.style.setProperty('--goofy-y', '0px');
    });
});

// ----- 5. TROLLOMETER -----
/**
 * NOTE / BUG FIXED HERE: the original code referenced a `messages` array
 * (`messages[count]`) that was never declared anywhere in this file. On any
 * page that DOES have a trollBtn (about.html), clicking it past the point
 * where `messages` was expected to exist would throw
 * "ReferenceError: messages is not defined" and silently break every
 * feature defined AFTER this block in the file. Guarded with
 * `typeof messages !== 'undefined'` below so it fails safely instead of
 * crashing. If you want per-count messages (e.g. count 10 -> "ok that's
 * enough"), declare a real `messages` object/array near the top of this
 * section, e.g.:
 *   const messages = { 5: " (halfway there)", 10: " (seriously?)" };
 */
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

        if (typeof messages !== 'undefined' && messages[count]) {
            counterDisplay.textContent = count + messages[count];
        }
    });
}

// ----- 8. CONTACT FORM (front-end only feedback) -----
/**
 * NOTE: this only gives visual feedback ("SENT") — it does not actually
 * send anything anywhere. If contact.html expects real emails to arrive,
 * this form needs a backend or a service like Formspree/EmailJS hooked up;
 * right now submitting it does nothing but reset itself after 2 seconds.
 */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENT';
        submitBtn.style.opacity = '0.5';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            this.reset();
        }, 2000);
    });
}

// ----- 9. CONSOLE EASTER EGG -----
console.log('%c SIMON LABARTHE ', 'background: #a3161d; color: #f3f1e8; font-size: 20px; padding: 10px; font-family: "Bodoni Moda", serif;');
console.log('%c You found the secret console. Nice.', 'color: #a3161d; font-size: 14px;');
console.log('%c ➜ github.com/simooooone', 'color: #2f6b45; font-size: 12px;');
