document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation for Hero Subtitle
    const roles = document.querySelectorAll('.role');
    let delay = 0;

    roles.forEach((role) => {
        const text = role.textContent;
        role.textContent = '';
        role.style.borderRight = '2px solid var(--accent-neon)';
        role.style.animation = 'blink 0.7s step-end infinite';

        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                role.textContent += text[i];
                if (i === text.length - 1) {
                    role.style.borderRight = 'none';
                    role.style.animation = 'none';
                    role.classList.add('typed');
                }
            }, delay);
            delay += 100;
        }
        delay += 500;
    });

    // Add blinking cursor style
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes blink {
            50% { border-color: transparent; }
        }
    `;
    document.head.appendChild(styleSheet);

    // Fireflies
    const hero = document.querySelector('.hero');
    const firefliesContainer = document.createElement('div');
    firefliesContainer.className = 'hero-fireflies';
    hero.appendChild(firefliesContainer);

    for (let i = 0; i < 20; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.animationDelay = `${Math.random() * 5}s`;
        firefliesContainer.appendChild(firefly);
    }

    // Canvas Particle Background
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-particles';
    Object.assign(canvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '0',
    });
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.01;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(46, 125, 50, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const number = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < number; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            if (particlesArray[i].size <= 0.2) {
                particlesArray.splice(i, 1);
                i--;
                particlesArray.push(new Particle());
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Particle boost on mousemove (desktop only)
    if (!('ontouchstart' in window)) {
        canvas.addEventListener('mousemove', (e) => {
            for (let i = 0; i < 5; i++) {
                const particle = new Particle();
                particle.x = e.x;
                particle.y = e.y;
                particle.size = Math.random() * 3 + 1;
                particle.speedX = Math.random() * 2 - 1;
                particle.speedY = Math.random() * 2 - 1;
                particlesArray.push(particle);
            }
        });
    }

    // Scroll Reveal Sections
    const sections = document.querySelectorAll('.section-highlight');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
});

// Parallax Effect (Mouse + Touch support)
function applyParallax(x, y) {
    const elements = document.querySelectorAll('[data-parallax]');
    const speed = 0.05;
    const xOffset = (window.innerWidth - x * speed) / 100;
    const yOffset = (window.innerHeight - y * speed) / 100;

    elements.forEach((el) => {
        el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
}

if (!('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        applyParallax(e.pageX, e.pageY);
    });
} else {
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        applyParallax(touch.pageX, touch.pageY);
    }, { passive: true });
}

import { initMandelbulb } from './mandelbulb.js';

document.addEventListener('DOMContentLoaded', () => {
  initMandelbulb('mandelbulb-bg');
});
