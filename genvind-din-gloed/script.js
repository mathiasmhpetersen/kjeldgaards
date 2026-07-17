/* Kjeldgaards — Genvind din glød på 8 uger
 * Accordion, scroll-reveal, reviews masonry + lightbox, tilmeldings-logik,
 * sticky mobil-bjælke, dataLayer-sporing (§9). Vanilla JS, ingen frameworks. */

(function () {
  'use strict';

  var REVIEW_BASE = '/genvind-din-gloed/assets/reviews/';
  var CHECKOUT_URL = 'https://kjeldgaards.com/checkout/genvind-din-gloed'; // placeholder
  var dl = (window.dataLayer = window.dataLayer || []);
  function track(event, extra) {
    var payload = { event: event };
    if (extra) for (var k in extra) payload[k] = extra[k];
    dl.push(payload);
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- view_content (load) ---------- */
  track('view_content', { page: 'genvind-din-gloed' });

  /* ---------- Scroll reveal ---------- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- photo_guide_view (scroll til fotovejledningen) ---------- */
  var guide = document.querySelector('[data-photo-guide]');
  if (guide && 'IntersectionObserver' in window) {
    var fired = false;
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !fired) { fired = true; track('photo_guide_view'); gio.disconnect(); }
      });
    }, { threshold: 0.35 });
    gio.observe(guide);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- CTA (Deltag nu → tilmelding) : add_to_cart ved første klik ---------- */
  var cartFired = false;
  document.querySelectorAll('[data-cta]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!cartFired) { cartFired = true; track('add_to_cart', { value: 749, currency: 'DKK', items: 2 }); }
    });
  });

  /* ---------- Sticky mobil-bjælke ---------- */
  var sticky = document.querySelector('[data-sticky]');
  var hero = document.querySelector('.hero');
  function onScroll() {
    if (!sticky || !hero) return;
    sticky.classList.toggle('is-visible', hero.getBoundingClientRect().bottom < 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Tilmelding: spørgsmål 3 = Nej → skjul betaling ---------- */
  (function () {
    var form = document.querySelector('[data-signup]');
    if (!form) return;
    var checkout = form.querySelector('[data-checkout]');
    var optout = form.querySelector('[data-optout]');
    var ja = form.querySelector('[data-billede-ja]');
    var nej = form.querySelector('[data-billede-nej]');
    var checkoutBtn = form.querySelector('[data-checkout-btn]');

    function update() {
      var saysNo = nej && nej.checked;
      if (checkout) checkout.hidden = !!saysNo;
      if (optout) optout.hidden = !saysNo;
    }
    if (ja) ja.addEventListener('change', update);
    if (nej) nej.addEventListener('change', update);
    update();

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function (e) {
        track('begin_checkout', { value: 749, currency: 'DKK', items: 2 });
        var href = checkoutBtn.getAttribute('href');
        if (href && href.indexOf('http') === 0) {
          e.preventDefault();
          setTimeout(function () { window.location.href = href; }, 80);
        }
      });
    }
  })();

  /* ---------- Anmeldelser: masonry + lightbox ---------- */
  (function () {
    var host = document.querySelector('[data-fb-reviews]');
    var data = window.KJELDGAARDS_REVIEWS;
    if (!host || !data || !data.length) return;

    var frag = document.createDocumentFragment();
    data.forEach(function (r, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fb-review';
      btn.setAttribute('aria-label', 'Åbn anmeldelse ' + (i + 1) + ' af ' + data.length);
      var img = document.createElement('img');
      img.src = REVIEW_BASE + r.file;
      img.alt = r.alt || 'Facebook-anmeldelse af Barrier Defense';
      if (r.w) img.width = r.w;
      if (r.h) img.height = r.h;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      btn.appendChild(img);
      btn.addEventListener('click', function () { open(i); });
      frag.appendChild(btn);
    });
    host.appendChild(frag);

    var lb = document.querySelector('[data-review-lightbox]');
    if (!lb) return;
    var lbImg = lb.querySelector('[data-rlbimg]');
    var lbCount = lb.querySelector('[data-rlbcounter]');
    var lbStage = lb.querySelector('[data-rlbstage]');
    var idx = 0, isOpen = false, lastFocus = null;

    function paint() {
      var r = data[idx];
      lbImg.src = REVIEW_BASE + r.file;
      lbImg.alt = r.alt || 'Facebook-anmeldelse af Barrier Defense';
      if (lbCount) lbCount.textContent = (idx + 1) + ' / ' + data.length;
    }
    function open(i) {
      idx = i; isOpen = true; lastFocus = document.activeElement;
      paint();
      lb.hidden = false;
      document.body.classList.add('lb-open');
      window.requestAnimationFrame(function () { lb.classList.add('is-open'); });
      var c = lb.querySelector('[data-rlbclose]');
      if (c && c.focus) c.focus();
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      lb.classList.remove('is-open');
      document.body.classList.remove('lb-open');
      window.setTimeout(function () { if (!isOpen) lb.hidden = true; }, reduceMotion ? 0 : 220);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function step(d) {
      idx = (idx + d + data.length) % data.length;
      if (lbStage) {
        lbStage.classList.add('is-swapping');
        window.setTimeout(function () { paint(); lbStage.classList.remove('is-swapping'); }, reduceMotion ? 0 : 110);
      } else { paint(); }
    }

    [].slice.call(lb.querySelectorAll('[data-rlbclose]')).forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    });
    var p = lb.querySelector('[data-rlbprev]'), n = lb.querySelector('[data-rlbnext]');
    if (p) p.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    if (n) n.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  })();

})();
