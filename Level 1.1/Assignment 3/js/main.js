$(document).ready(function () {

    function initMasonry() {
        const grid = document.querySelector(".lates-news-grid-container");
        if (grid) {
            new Masonry(grid, {
                gutter: 11
            });
        }
    }

    let introCarousel = $("#intro-carousel").owlCarousel({
        items: 1,
        dotsContainer: '#intro-carousel-dots',
        loop: true
    });

    $('#prev-button').click(function () {
        introCarousel.trigger('prev.owl.carousel');
    });

    $('#next-button').click(function () {
        introCarousel.trigger('next.owl.carousel');
    });

    $("#quote-carousel").owlCarousel({
        items: 1,
        dotsContainer: '#testimonial-carousel-dots',
        loop: true
    });

    $(window).on('load', function () {
        initMasonry();
    });

    $(window).on('resize', function () {
        initMasonry();
    });
});