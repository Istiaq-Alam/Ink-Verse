// 1. Typewriter Effect
const typewriter = () => {
    const text = "কবিতা ও সাহিত্যের আঙিনা...";
    const el = document.getElementById("typewriter");
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
        } else { clearInterval(typing); }
    }, 150);
};

// 2. Scroll Reveal
const reveal = () => {
    const reveals = document.querySelectorAll(".scroll-reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) { el.classList.add("active"); }
    });
};

// 3. Modal & Fetch Logic
const modal = document.getElementById("poemModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-modal");

document.querySelectorAll(".read-more").forEach(button => {
    button.addEventListener("click", async () => {
        const filePath = button.getAttribute("data-file");
        const title = button.getAttribute("data-title");
        
        modalTitle.innerText = "লোডিং...";
        modalBody.innerText = "কবিতাটি সংগ্রহ করা হচ্ছে...";
        modal.style.display = "block";

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error("ফাইল পাওয়া যায়নি");
            const text = await response.text();
            
            modalTitle.innerText = title;
            modalBody.innerText = text;
        } catch (error) {
            modalBody.innerText = "দুঃখিত, কবিতাটি লোড করা সম্ভব হয়নি।";
        }
    });
});

// Close Modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// Init
window.addEventListener("scroll", reveal);
window.onload = () => {
    typewriter();
    reveal();
};
