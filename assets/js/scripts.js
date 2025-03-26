document.addEventListener('mousemove', (e) => {
    const elements = document.querySelectorAll('[data-parallax]');
    elements.forEach((el) => {
        const speed = 0.05;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});