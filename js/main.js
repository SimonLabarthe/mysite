//---console easter egg---
console.log('%c Simon s website', 'background: #b0b0b0; color: #f3f1e8; font-size: 20px; padding: 10px; font-family: "Bodoni Moda", serif;');
console.log('%c You found the secret console. Nice.', 'color: #a3161d; font-size: 14px;');

//---count of read---
function getCounterElements(card) {
    return {
        viewCounter: card.querySelector('[id^="view-counter-"]'), //id starts with view-counter
        downloadCounter: card.querySelector('[id^="download-counter-"]'), 
        viewBtn: card.querySelector('[id^="view-btn-"]'), 
        downloadBtn: card.querySelector('[id^="download-btn-"]')
    };
};

//--helper: getProjectName(card)--
function getProjectName(card) {
    const heading = card.querySelector('h2');
    return heading?.textContent.trim() || 'default';
};

//--helper: getStoredCount(key)--
function getStoredCount(key) {
    return parseInt(localStorage.getItem(key)) || 0;
};

//--helper: incrementCounter(CounterElement, key)--
function incrementCounter(CounterElement, key) {
    let count = getStoredCount(key);
    count++;
    CounterElement.textContent = count;
    localStorage.setItem(key, count);
};

//--setup counters for all project cards--
document.querySelectorAll('.card').forEach((card) => {
    //get all counter elements for this card
    const { viewCounter, downloadCounter, viewBtn, downloadBtn } = getCounterElements(card);

    //skip this card if it doesn't have the required elements
    if (!viewCounter && !downloadCounter) return;

    //get project name for LocalStorage keys
    const projectName = getProjectName(card);

        //-setup view counter-
    if (viewCounter && viewBtn && downloadCounter && downloadBtn) {
        //create unique LocalStorage key for this project's views
        const viewKey = `views_${projectName}`;

        //load and display the saved count
        viewCounter.textContent = getStoredCount(viewKey);

        //add click event Listener to the view button
        viewBtn.addEventListener('click', () => {
            //increment the counter
            incrementCounter(viewCounter, viewKey);
        });
    }

    //-setup download counter-
    if (downloadCounter && downloadBtn) {
        //create unique LocalStorage key for this project's downloads
        const downloadKey = `downloads_${projectName}`;
        const viewKey = `views_${projectName}`;

        //load and display the savec count
        downloadCounter.textContent = getStoredCount(downloadKey);

        //add click event listener to the download button
        downloadBtn.addEventListener('click', () => {
            //increment the counters
            incrementCounter(downloadCounter, downloadKey);
            incrementCounter(viewCounter, viewKey);
        });
    }
});

//--expand/collapse--
document.querySelectorAll('.expand-btn').forEach((btn) => {
    let content = null;
    const targetId = btn.dataset.target;
    if (targetId) content = document.getElementById(targetId);
    if (!content) {
        const card = btn.closest('.card');
        if (card) content = card.querySelector('.project-content');
    }
    if (!content) return; 
    
    content.classList.add('collapsible'); // mark the content as collapsible so the ::after / ::before show up
    
    content.classList.remove('expanded'); 
    btn.textContent = 'Show more';
    
    btn.addEventListener('click', () => {
        const isOpen = content.classList.toggle('expanded');
        btn.textContent = isOpen ? 'Show less': 'Show more';
        
        if (!isOpen) {
            btn.closest('.card')?.scrollIntoView({
                behavior: 'smooth', 
                block: 'nearest'
            });
        }
    });
});



//---dark mode toggle---
const toggleBtn = document.getElementById('darkModeToggle');
const toggleIcon = document.getElementById('toggleIcon');
const profilePic = document.getElementById('profilePic');

function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    if (toggleIcon) toggleIcon.src = isDark ? 'media/header_dark.png' : 'media/header_light.png';
};

applyTheme(localStorage.getItem('theme') === 'dark'); //apply the saved preference immediatly on load

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark');
        applyTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light'); // persisted: real user preference
        if (profilePic) {
            profilePic.animate([{ opacity: 1 }, { opacity: 0.6 }, { opacity: 1 }], { duration: 300 });
        }
    });
};

//---auto-scroll & expand the card targeted via url hash---
(function () {
    const hash = window.location.hash;
    if (!hash) return;

    const targetCard = document.querySelector(hash);
    if (!targetCard) return;

    // Expand the card's content
    const btn = targetCard.querySelector('.expand-btn');
    const content = targetCard.querySelector('.project-content');
    if (btn && content && !content.classList.contains('expanded')) {
        btn.click();
    }

    // Smoothly center it a moment later (after layout settles)
    setTimeout(() => {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
})();

//---auto-expand a card when arriving via #anchor (from index.html)---
(function () {
    const hash = window.location.hash;
    if (!hash) return;

    const targetCard = document.querySelector(hash);
    if (!targetCard) return;

    // Expand the card's content
    const btn = targetCard.querySelector('.expand-btn');
    const content = targetCard.querySelector('.project-content');
    if (btn && content && !content.classList.contains('expanded')) {
        btn.click();
    }

    // Smoothly center it a moment later (after layout settles)
    setTimeout(() => {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
})();

//---debug layout---
const debugCheckbox = document.getElementById('debugCheckbox'); 
if (debugCheckbox) {
    debugCheckbox.addEventListener('change', () => {
        document.body.classList.toggle('debug', debugCheckbox.checked);
    });
};

//---hover-to-expand project cards---
document.querySelectorAll('.card .project-content').forEach((content) => {
    // Only cards that actually overflow should be collapsible.
    // We check after layout with a small rAF to be sure.
    requestAnimationFrame(() => {
        const isOverflowing = content.scrollHeight > content.clientHeight + 4;
        if (!isOverflowing) return;   // short cards stay as-is

        content.classList.add('collapsible');

        const card = content.closest('.card');
        if (!card) return;

        // Expand on hover
        card.addEventListener('mouseenter', () => {
            content.classList.add('expanded');
        });

        // Collapse when leaving
        card.addEventListener('mouseleave', () => {
            content.classList.remove('expanded');
        });

        // --- Fallbacks for accessibility & touch ---

        // Keyboard: expand when any focusable element inside is focused
        card.addEventListener('focusin', () => content.classList.add('expanded'));
        card.addEventListener('focusout', () => content.classList.remove('expanded'));

        // Touch: tap toggles (since hover doesn't exist)
        card.addEventListener('touchstart', () => {
            content.classList.toggle('expanded');
        }, { passive: true });
    });
});

//---random header font---
(function () {
    const fonts = [
        { family: "'Bodoni Moda', serif", size: "3.4rem" }, 
        { family: "'IBM Plex Mono', monospace", size: "2.6rem"}
    ];
    const choice = fonts[Math.floor(Math.random() * fonts.length)];
    document.documentElement.style.setProperty('--font-random', choice.family);
    document.documentElement.style.setProperty('--size-random', choice.size);
})();

//---random hover wiggle---
function randomOffset() {
    const magnitude = Math.random() * 20 + 5; //5-25px
    return Math.random() < 0.5 ? -magnitude : magnitude;
}

document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        card.style.setProperty('--goofy-x', `${randomOffset()}px`);
        card.style.setProperty('--goofy-y', `${randomOffset()}px`);
    });
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--goofy-x', '0px');
        card.style.setProperty('--goofy-y', '0px');
    });
});
