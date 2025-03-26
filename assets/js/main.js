// Typing Animation for Hero Subtitle
document.addEventListener('DOMContentLoaded', () => {
    const roles = document.querySelectorAll('.role');
    let delay = 0;

    roles.forEach((role, index) => {
        const text = role.textContent;
        role.textContent = '';
        role.style.borderRight = '2px solid var(--accent-neon)';
        role.style.animation = 'blink 0.7s step-end infinite';

        // Typing effect
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                role.textContent += text[i];
                // Stop blinking cursor and add glow when typing is complete for this role
                if (i === text.length - 1) {
                    role.style.borderRight = 'none';
                    role.style.animation = 'none';
                    role.classList.add('typed'); // Add class to trigger glow
                }
            }, delay);
            delay += 100; // Adjust typing speed
        }
        delay += 500; // Delay between roles
    });

    // Firefly Effect for Hero Section
    const hero = document.querySelector('.hero');
    const firefliesContainer = document.createElement('div');
    firefliesContainer.className = 'hero-fireflies';
    hero.appendChild(firefliesContainer);

    // Create 20 fireflies
    for (let i = 0; i < 20; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.animationDelay = `${Math.random() * 5}s`;
        firefliesContainer.appendChild(firefly);
    }
});

// Blinking cursor animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes blink {
        50% { border-color: transparent; }
    }
`;
document.head.appendChild(styleSheet);

// Particle Effect for Hero Background
const hero = document.querySelector('.hero');
const canvas = document.createElement('canvas');
canvas.className = 'hero-particles';
hero.appendChild(canvas);
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '0';

const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

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
        ctx.fillStyle = 'rgba(76, 175, 80, 0.5)'; // Matches #4CAF50 with 0.5 opacity
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
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

// Mouse interaction
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