let storyPages = [];
let currentPageIndex = 0;

const modal = document.getElementById("poemModal");
const modalContent = document.querySelector(".modal-content");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-modal");
const themeToggle = document.getElementById('theme-toggle');
const paginationControls = document.getElementById("pagination-controls");
const pageNumDisplay = document.getElementById("pageNumber");

// --- 1. Utilities ---
const typewriter = () => {
    const text = "কবিতা ও সাহিত্যের আঙিনা...";
    const el = document.getElementById("typewriter");
    if (!el) return;
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) { el.innerHTML += text.charAt(i); i++; } 
        else { clearInterval(typing); }
    }, 150);
};

const reveal = () => {
    document.querySelectorAll(".scroll-reveal").forEach((el, index) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            setTimeout(() => el.classList.add("active"), index * 100);
        }
    });
};

function paginateText(text) {
    const pages = [];
    let pageSize;

    // Dynamic Character Limit based on Screen Height
    const screenHeight = window.innerHeight;

    if (screenHeight < 700) {
        // Smaller phones (e.g., iPhone SE)
        pageSize = 450;
    } else if (screenHeight < 900) {
        // Standard modern smartphones
        pageSize = 580;
    } else {
        // Desktop or Large Tablets
        pageSize = 950;
    }
    
    // Split the text into the calculated chunks
    for (let i = 0; i < text.length; i += pageSize) {
        pages.push(text.substring(i, i + pageSize));
    }
    return pages;
}


function updatePage(direction) {
    modalBody.classList.remove("page-turn-right", "page-turn-left");
    void modalBody.offsetWidth; // Force reflow
    modalBody.classList.add(direction === 'next' ? "page-turn-right" : "page-turn-left");
    
    modalBody.innerText = storyPages[currentPageIndex];
    if(pageNumDisplay) pageNumDisplay.innerText = `পৃষ্ঠা ${currentPageIndex + 1}`;
    
    document.getElementById("prevPage").disabled = (currentPageIndex === 0);
    document.getElementById("nextPage").disabled = (currentPageIndex === storyPages.length - 1);
}

// --- 2. The Multi-Modal Switcher ---
document.querySelectorAll(".read-more").forEach(button => {
    button.addEventListener("click", async () => {
        const filePath = button.getAttribute("data-file");
        const title = button.getAttribute("data-title");
        const contentType = button.getAttribute("data-type") || "poem"; 
        
        // Reset Modal Styling
        modalTitle.innerText = "লোডিং...";
        modalBody.innerText = "";
        modalBody.classList.remove("type-poem", "type-prose", "page-turn-right", "page-turn-left");
        modalContent.classList.remove("prose-mode"); // Reset to default (poem)
        
        modal.style.display = "block";
        document.body.classList.add('modal-open');

        try {
            const response = await fetch(filePath);
            const text = await response.text();
            modalTitle.innerText = title;

            if (contentType === "prose") {
                // ACTIVATE PROSE MODE (Fixed height, pagination)
                modalContent.classList.add("prose-mode");
                modalBody.classList.add("type-prose");
                storyPages = paginateText(text);
                currentPageIndex = 0;
                paginationControls.style.display = "flex";
                updatePage('next');
            } else {
                // ACTIVATE POEM MODE (Standard behavior)
                modalBody.classList.add("type-poem");
                paginationControls.style.display = "none";
                modalBody.innerText = text;
            }
        } catch (error) {
            modalBody.innerText = "ফাইলটি লোড করা সম্ভব হয়নি।";
        }
    });
});

const closeModal = () => {
    modal.style.display = "none";
    document.body.classList.remove('modal-open');
};

closeBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target == modal) closeModal(); };

// --- 3. Pagination Listeners ---
document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPageIndex < storyPages.length - 1) { currentPageIndex++; updatePage('next'); }
});
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPageIndex > 0) { currentPageIndex--; updatePage('prev'); }
});

// --- 4. Theme & Init ---
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
});

window.addEventListener("scroll", reveal);
window.onload = () => { typewriter(); reveal(); };
