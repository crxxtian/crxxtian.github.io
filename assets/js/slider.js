document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".post-slider");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    // Scroll the slider smoothly
    function scrollSlider(direction) {
        const slideWidth = document.querySelector(".post-slide").clientWidth + 24; // slide width + gap
        slider.scrollBy({ left: direction * slideWidth, behavior: "smooth" });
    }

    // Button event listeners
    prevBtn.addEventListener("click", () => scrollSlider(-1));
    nextBtn.addEventListener("click", () => scrollSlider(1));

    // Drag functionality (optional, smoother UX)
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
});
