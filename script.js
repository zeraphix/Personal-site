// Loading Screen
const loadingScreen = document.querySelector('.loading-screen');

window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.add('loaded');
    }, 1500); // 1.5 seconds delay for smooth feel
});

// Custom Cursor: Normal arrow with green glow
const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
});

// Grow on hover (links, buttons, etc.)
const hoverElements = document.querySelectorAll('a, button, .nav-btn, input, textarea, .contact-link');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        customCursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hover');
    });
});

// Particle Background (subtle, static)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        const isLight = document.documentElement.hasAttribute('data-theme');
        ctx.fillStyle = isLight ? '#aaaaaa' : '#444444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Dark/Light Mode Toggle
const themeSwitch = document.getElementById('theme-switch');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeSwitch.checked = true;
} else {
    document.documentElement.removeAttribute('data-theme');
    themeSwitch.checked = false;
}

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    }
    animateParticles();
});

// Section Reveal (fade in on scroll)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.content').forEach(section => {
    revealObserver.observe(section);
});

// Sidebar active link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-btn');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (pageYOffset >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

// Skill bars animation
const bars = document.querySelectorAll('.skill-level');
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const level = entry.target.getAttribute('data-level');
            entry.target.style.width = `${level}%`;
        }
    });
}, { threshold: 0.5 });
bars.forEach(bar => barObserver.observe(bar));

// Hamburger Menu + Overlay
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.sidebar-overlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

document.querySelectorAll('.nav-btn').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Back to Top
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Search & AI Functionality
const aiBtn = document.querySelector('.ai-btn');
const searchBtn = document.querySelector('.search-btn');
const aiModal = document.getElementById('ai-modal');
const searchModal = document.getElementById('search-modal');
const closeAi = document.querySelector('.close-ai');
const closeSearch = document.querySelector('.close-search');
const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send');
const aiChat = document.getElementById('ai-chat');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const noResults = document.getElementById('no-results');

const searchableContent = [
    { title: "Home", text: "developer student", url: "#home" },
    { title: "About", text: "passionate front-end", url: "#about" },
    { title: "Projects", text: "to-do list portfolio movie chat expense", url: "#projects" },
    { title: "Skills", text: "html css javascript git responsive", url: "#skills" },
    { title: "Experience", text: "self-taught freelance contributor", url: "#experience" },
    { title: "Blog", text: "web development learning semantic", url: "#blog" },
    { title: "Testimonials", text: "client feedback excellent", url: "#testimonials" },
    { title: "Contact", text: "email github touch", url: "#contact" }
];

// Open modals
aiBtn.addEventListener('click', () => {
    aiModal.classList.add('show');
    aiInput.focus();
});

searchBtn.addEventListener('click', () => {
    searchModal.classList.add('show');
    searchInput.focus();
});

// Close modals
closeAi.addEventListener('click', () => aiModal.classList.remove('show'));
closeSearch.addEventListener('click', () => {
    searchModal.classList.remove('show');
    searchInput.value = '';
    searchResults.innerHTML = '';
    noResults.style.display = 'none';
});

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            if (modal === searchModal) {
                searchInput.value = '';
                searchResults.innerHTML = '';
                noResults.style.display = 'none';
            }
        }
    });
});

// Search
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    noResults.style.display = 'none';

    if (query === '') return;

    const results = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    results.forEach(result => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = result.url;
        a.textContent = result.title;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.classList.remove('show');
            document.querySelector(result.url).scrollIntoView({ behavior: 'smooth' });
        });
        li.appendChild(a);
        const p = document.createElement('p');
        p.textContent = result.text.substring(0, 100) + '...';
        li.appendChild(p);
        searchResults.appendChild(li);
    });
});

// AI Chat
function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.textContent = text;
    aiChat.appendChild(msg);
    aiChat.scrollTop = aiChat.scrollHeight;
}

aiSend.addEventListener('click', () => {
    const text = aiInput.value.trim();
    if (text === '') return;

    addMessage(text, 'user-message');
    aiInput.value = '';

    setTimeout(() => {
        addMessage("Thanks for your message! This is a demo AI response. 😊 (Real AI coming soon)", 'bot-message');
    }, 800);
});

aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') aiSend.click();
});