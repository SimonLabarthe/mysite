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
}

//--helper: getProjectName(card)--
function getProjectName(card) {
    const heading = card.querySelector('h2');
    return heading?.textContent.trim() || 'default';
}

//--helper: getStoredCount(key)--
function getStoredCount(key) {
    return parseInt(localStorage.getItem(key)) || 0;
}

//--helper: incrementCounter(CounterElement, key)--
function incrementCounter(CounterElement, key) {
    let count = getStoredCount(key);
    count++;
    CounterElement.textContent = count;
    localStorage.setItem(key, count);
}

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

//---dark mode toggle---
const toggleBtn = document.getElementById('darkModeToggle');
const toggleIcon = document.getElementById('toggleIcon');
const profilePic = document.getElementById('profilePic');

function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    if (toggleIcon) toggleIcon.src = isDark ? 'media/header_dark.png' : 'media/header_light.png';
}

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
}

//---debug layout---
const debugCheckbox = document.getElementById('debugCheckbox'); 
if (debugCheckbox) {
    debugCheckbox.addEventListener('change', () => {
        document.body.classList.toggle('debug', debugCheckbox.checked);
    });
}

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
