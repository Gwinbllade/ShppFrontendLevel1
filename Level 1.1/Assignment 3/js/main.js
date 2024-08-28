$(function () {
    window.onload = () => {
        const grid = document.querySelector(".lates-news-grid-container")
        const masonry = new Masonry(grid, {
            gutter: 11
        });

        $(document).ready(function () {
            $("#intro-carousel").owlCarousel({
                items: 1,
                dotsContainer: '#intro-carousel-dots',
                loop: true
            });
        });

        $(document).ready(function () {
            $("#quote-carousel").owlCarousel({
                items: 1,
                dotsContainer: '#testimonial-carousel-dots',
                loop: true
            });
        });
    }
});