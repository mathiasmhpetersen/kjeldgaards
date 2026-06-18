/* Kjeldgaards Barrier Defense — pre-sell product page
 * Buy-box, FAQ accordion, video click-to-play, scroll reveal,
 * Pixel/GA4 placeholders, sticky mobile buy-bar.
 */

(function () {
  'use strict';

  /* ---------- Config ---------- */
  var CHECKOUT_URL = 'https://kjeldgaards.com/checkout/';
  var CHECKOUT_URL_2PACK = 'https://kjeldgaards.com/checkout/';
  var PRICE = 470;

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  var stickyBar = document.querySelector('.sticky-buy');
  var heroEl = document.querySelector('.hero');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 80);

    if (stickyBar && heroEl) {
      var heroBottom = heroEl.getBoundingClientRect().bottom;
      stickyBar.classList.toggle('is-visible', heroBottom < 60);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Buy box ---------- */
  var options = document.querySelectorAll('.option');
  var ctaButtons = document.querySelectorAll('[data-cta]');

  function selectOption(targetValue) {
    options.forEach(function (opt) {
      var isSelected = opt.dataset.value === targetValue;
      opt.classList.toggle('is-selected', isSelected);
      var input = opt.querySelector('input');
      if (input) input.checked = isSelected;
    });
    ctaButtons.forEach(function (btn) {
      btn.setAttribute('data-current-pack', targetValue);
    });
    document.body.dataset.currentPack = targetValue;
  }

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      selectOption(opt.dataset.value);
    });
    opt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(opt.dataset.value);
      }
    });
  });

  // Initialize from default-checked option
  var defaultOpt = document.querySelector('.option[data-default="true"]');
  if (defaultOpt) selectOption(defaultOpt.dataset.value);

  /* ---------- CTA clicks ---------- */
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var pack = btn.getAttribute('data-current-pack') || '2-pack';
      var url = pack === '2-pack' ? CHECKOUT_URL_2PACK : CHECKOUT_URL;

      // Pixel + GA4 events (no-ops if not loaded)
      try {
        if (window.fbq) {
          window.fbq('track', 'InitiateCheckout', {
            content_name: 'Barrier Defense Serum',
            content_ids: [pack],
            num_items: pack === '2-pack' ? 2 : 1,
            value: pack === '2-pack' ? PRICE * 2 : PRICE,
            currency: 'DKK'
          });
        }
      } catch (err) {}
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'begin_checkout', {
            currency: 'DKK',
            value: pack === '2-pack' ? PRICE * 2 : PRICE,
            items: [{ item_name: 'Barrier Defense Serum', quantity: pack === '2-pack' ? 2 : 1 }]
          });
        }
      } catch (err) {}

      // Navigate (small delay to let events fire)
      e.preventDefault();
      setTimeout(function () { window.location.href = url; }, 80);
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      q.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ---------- Video click-to-play ---------- */
  document.querySelectorAll('.video-card').forEach(function (card) {
    var poster = card.querySelector('.poster');
    var video = card.querySelector('video');
    if (!poster || !video) return;
    poster.addEventListener('click', function () {
      card.classList.add('is-playing');
      poster.style.display = 'none';
      var overlay = card.querySelector('.play-overlay');
      if (overlay) overlay.style.display = 'none';
      video.setAttribute('controls', 'controls');
      video.play().catch(function () {});
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 75% scroll → ViewContent event ---------- */
  var firedScroll = false;
  function checkScroll() {
    if (firedScroll) return;
    var doc = document.documentElement;
    var scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
    if (scrolled >= 0.75) {
      firedScroll = true;
      try {
        if (window.fbq) {
          window.fbq('track', 'ViewContent', {
            content_name: 'barrier_defense_serum_75pct',
            content_category: 'pre_sell'
          });
        }
      } catch (err) {}
    }
  }
  window.addEventListener('scroll', checkScroll, { passive: true });

  /* ---------- Mark body for sticky-buy padding ---------- */
  if (stickyBar) document.body.classList.add('has-sticky');

})();
