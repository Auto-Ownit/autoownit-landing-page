(function () {
    var slider = document.querySelector('[data-slider]');
    if (!slider) return;

    var track = slider.querySelector('[data-slider-track]');
    var prev = slider.querySelector('[data-slider-prev]');
    var next = slider.querySelector('[data-slider-next]');
    var dotsWrap = slider.querySelector('[data-slider-dots]');
    var pages = 1;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function ease() { return reduceMotion.matches ? 'auto' : 'smooth'; }

    function pageWidth() { return track.clientWidth; }
    function pageCount() { return Math.max(1, Math.round(track.scrollWidth / pageWidth())); }
    function currentPage() { return Math.round(track.scrollLeft / pageWidth()); }

    function goTo(i) {
        track.scrollTo({ left: i * pageWidth(), behavior: ease() });
    }

    function buildDots() {
        pages = pageCount();
        dotsWrap.innerHTML = '';
        for (var i = 0; i < pages; i++) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ' of ' + pages);
            dot.dataset.index = i;
            dot.addEventListener('click', function () { goTo(Number(this.dataset.index)); });
            dotsWrap.appendChild(dot);
        }

        slider.classList.toggle('is-static', pages < 2);
        update();
    }

    function update() {
        var active = Math.min(currentPage(), pages - 1);
        var dots = dotsWrap.children;
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('is-active', i === active);
        }
        var max = track.scrollWidth - pageWidth();
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max - 2;
    }

    prev.addEventListener('click', function () {
        track.scrollBy({ left: -pageWidth(), behavior: ease() });
    });
    next.addEventListener('click', function () {
        track.scrollBy({ left: pageWidth(), behavior: ease() });
    });

    var ticking = false;
    track.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildDots, 150);
    });

    buildDots();
})();