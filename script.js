// Particle Background
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

// Fade-in content
const contents = document.querySelectorAll('.content');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
contents.forEach(c => observer.observe(c));

// Sidebar active link
const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav-btn');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (pageYOffset >= sec.offsetTop - 200) current = sec.id;
    });
    links.forEach(link => {
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

// Hamburger Menu - now working on mobile
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
});

document.querySelectorAll('.nav-btn').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
    });
});

// Search Modal
const searchBtn = document.querySelector('.search-btn');
const searchModal = document.getElementById('search-modal');
const closeSearch = document.querySelector('.close-search');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const noResults = document.getElementById('no-results');

const searchableContent = [
    { title: "Home", text: "Developer First-year software engineering student", url: "#home" },
    { title: "About Me", text: "passionate about front-end development interactive beautiful web apps HTML CSS JavaScript Git", url: "#about" },
    { title: "Projects", text: "Interactive To-Do List Portfolio Weather Dashboard", url: "#projects" },
    { title: "Skills", text: "HTML CSS JavaScript Git GitHub Responsive Design", url: "#skills" },
    { title: "Contact", text: "email github", url: "#contact" }
];

searchBtn.addEventListener('click', () => {
    searchModal.style.display = 'flex';
    searchInput.focus();
});

closeSearch.addEventListener('click', () => {
    searchModal.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '';
    noResults.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
        noResults.style.display = 'none';
    }
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    noResults.style.display = 'none';

    if (query === '') return;

    const results = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.text.toLowerCase().includes(query)
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
        a.addEventListener('click', () => {
            searchModal.style.display = 'none';
            searchInput.value = '';
        });
        li.appendChild(a);
        const p = document.createElement('p');
        p.textContent = result.text.substring(0, 100) + '...';
        li.appendChild(p);
        searchResults.appendChild(li);
    });
});




const aiBtn = document.querySelector('.ai-btn');
const aiModal = document.getElementById('ai-modal');
const closeAi = document.querySelector('.close-ai');
const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send');
const aiChat = document.querySelector('.ai-chat');

let conversationHistory = [
    { role: "system", content: "You are a friendly, helpful AI assistant on a developer's portfolio website. Answer naturally and conversationally. Keep responses concise but informative. You can talk about the portfolio, web development, coding, or any topic the user asks." }
];

function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('ai-message', type);
    msg.textContent = text;
    aiChat.appendChild(msg);
    aiChat.scrollTop = aiChat.scrollHeight;
}

async function getAIResponse(userMessage) {
    conversationHistory.push({ role: "user", content: userMessage });

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content.trim();
        conversationHistory.push({ role: "assistant", content: reply });
        return reply;
    } catch (error) {
        console.error("AI Error:", error);
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
}

aiBtn.addEventListener('click', () => {
    aiModal.style.display = 'flex';
});

closeAi.addEventListener('click', () => {
    aiModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === aiModal) {
        aiModal.style.display = 'none';
    }
});

aiSend.addEventListener('click', sendMessage);
aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const text = aiInput.value.trim();
    if (text === '') return;

    addMessage(text, 'user');
    aiInput.value = '';

    addMessage("Typing...", 'bot');

    const reply = await getAIResponse(text);
    aiChat.lastChild.remove();
    addMessage(reply, 'bot');
}

// Left floating buttons functionality
document.querySelector('.theme-float').addEventListener('click', () => {
    themeSwitch.checked = !themeSwitch.checked;
    themeSwitch.dispatchEvent(new Event('change'));
});

document.querySelector('.top-float').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});