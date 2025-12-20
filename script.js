// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.parallax-bg').forEach(bg => {
        bg.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});

// Animate content when scrolled into view
const contents = document.querySelectorAll('.content');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.3 });

contents.forEach(content => {
    observer.observe(content);
});