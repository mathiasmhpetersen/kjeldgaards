/* Kjeldgaards Barrier Defense — pre-sell product page
 * Buy-box, FAQ accordion, video click-to-play, scroll reveal,
 * Pixel/GA4 placeholders, sticky mobile buy-bar.
 */

(function () {
  'use strict';

  /* ---------- Config ---------- */
  var CHECKOUT_URL = 'https://kjeldgaards.com/checkout/'; // placeholder
  var PRICE_2PACK = 749;  // 2 flasker — 60-dages kur (eneste tilbud)
  var REVIEW_BASE = '/genvind-din-gloed/assets/reviews/';

  /* ---------- Sporing (§7): dataLayer ---------- */
  var dl = (window.dataLayer = window.dataLayer || []);
  function track(event, extra) {
    var p = { event: event };
    if (extra) for (var k in extra) p[k] = extra[k];
    dl.push(p);
  }
  track('view_content', { page: 'genvind-din-gloed' });

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

  /* ---------- CTA clicks (§7: which button, add_to_cart, begin_checkout) ---------- */
  var cartFired = false;
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var which = btn.getAttribute('data-btn') || 'cta';
      var href = btn.getAttribute('href') || '';
      var isCheckout = href.indexOf('http') === 0;

      if (!cartFired) {
        cartFired = true;
        track('add_to_cart', { value: PRICE_2PACK, currency: 'DKK', items: 2, button: which });
      }

      if (isCheckout) {
        track('begin_checkout', { value: PRICE_2PACK, currency: 'DKK', items: 2, button: which });
        e.preventDefault();
        setTimeout(function () { window.location.href = href; }, 80);
      } else {
        track('cta_click', { button: which });
        // anchor links (#deltag) scroll normally — no preventDefault
      }
    });
  });

  /* ---------- FAQ accordion (main + mini under buy box) ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      q.setAttribute('aria-expanded', !isOpen);
    });
  });
  document.querySelectorAll('.mini-faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.mini-faq-item');
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      q.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ---------- Auto-rotating USP row ---------- */
  (function () {
    var rotator = document.querySelector('[data-usp]');
    if (!rotator) return;
    var items = rotator.querySelectorAll('.usp');
    if (items.length < 2) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var i = 0;
    setInterval(function () {
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 2600);
  })();

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

  /* ---------- Reduced-motion flag ---------- */
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Horizontal carousels (ingredients, UGC) ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-track]');
    if (!track) return;
    var prevBtn = carousel.querySelector('[data-prev]');
    var nextBtn = carousel.querySelector('[data-next]');
    var edgeL = carousel.querySelector('.carousel-edge.left');
    var edgeR = carousel.querySelector('.carousel-edge.right');

    function stepSize() {
      var card = track.firstElementChild;
      if (!card) return 280;
      var gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '18', 10) || 18;
      return card.getBoundingClientRect().width + gap;
    }
    function maxScroll() { return track.scrollWidth - track.clientWidth; }

    function updateEdges() {
      var x = track.scrollLeft;
      var max = maxScroll();
      var atStart = x <= 2;
      var atEnd = x >= max - 2;
      if (edgeL) edgeL.classList.toggle('is-hidden', atStart);
      if (edgeR) edgeR.classList.toggle('is-hidden', atEnd);
      if (prevBtn) prevBtn.disabled = atStart;
      if (nextBtn) nextBtn.disabled = atEnd;
    }

    if (prevBtn) prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    track.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges, { passive: true });
    updateEdges();

    /* Pointer drag-to-scroll */
    var isDown = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      isDown = true; moved = false;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    track.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    function endDrag() {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);
    /* Prevent click navigation right after a drag */
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); }
    }, true);
  });

  /* ---------- Count-up on stats / timeline day numbers ---------- */
  var countEls = document.querySelectorAll('[data-count-to]:not([data-count-prefix])');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = String(target); return; }
    var dur = 1100, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && countEls.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Gentle hero parallax ---------- */
  var parallaxImg = document.querySelector('[data-parallax] img');
  if (parallaxImg && !reduceMotion) {
    var ticking = false;
    function applyParallax() {
      var y = window.scrollY || window.pageYOffset;
      var shift = Math.max(-22, Math.min(0, -y * 0.045));
      parallaxImg.style.transform = 'translateY(' + shift + 'px) scale(1.04)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(applyParallax); ticking = true; }
    }, { passive: true });
    applyParallax();
  }

  /* ---------- Product gallery + lightbox ---------- */
  (function () {
    var gallery = document.querySelector('[data-gallery]');
    if (!gallery) return;
    var lightbox = document.querySelector('[data-lightbox]');
    var mainWrap = gallery.querySelector('[data-gmain]');
    var mainImg  = gallery.querySelector('[data-gmainimg]');
    var thumbs   = [].slice.call(gallery.querySelectorAll('[data-gthumbs] .thumb'));

    var images = thumbs.map(function (t) {
      return {
        full:   t.getAttribute('data-full'),
        alt:    t.getAttribute('data-alt') || '',
        bottle: t.getAttribute('data-bottle') === '1'
      };
    });
    if (!images.length) return;

    var index = 0;
    var lbOpen = false;
    var lastFocus = null;

    // graphics with baked-in text should never be cropped
    function isContain(i) { return /reviews|klinisk|before-after/.test(images[i].full); }

    function fadeSwap(el, src, alt) {
      if (reduceMotion) { el.src = src; el.alt = alt; return; }
      el.style.opacity = '0';
      var pre = new Image();
      var done = function () {
        el.src = src; el.alt = alt;
        window.requestAnimationFrame(function () { el.style.opacity = ''; });
      };
      pre.onload = done; pre.onerror = done;
      pre.src = src;
    }

    var lbImg     = lightbox && lightbox.querySelector('[data-lbimg]');
    var lbCounter = lightbox && lightbox.querySelector('[data-lbcounter]');

    function updateLb() {
      if (!lbImg) return;
      fadeSwap(lbImg, images[index].full, images[index].alt);
      if (lbCounter) lbCounter.textContent = (index + 1) + ' / ' + images.length;
    }

    function render(i, syncLb) {
      i = (i % images.length + images.length) % images.length;
      index = i;
      fadeSwap(mainImg, images[i].full, images[i].alt);
      mainWrap.classList.toggle('is-contain', isContain(i));
      mainWrap.classList.toggle('show-pills', !!images[i].bottle);
      thumbs.forEach(function (t, ti) {
        t.classList.toggle('is-active', ti === i);
        t.setAttribute('aria-current', ti === i ? 'true' : 'false');
      });
      if (lbOpen && syncLb !== false) updateLb();
    }
    function step(delta) { render(index + delta); }

    /* thumbnails select the main image */
    thumbs.forEach(function (t, ti) {
      t.addEventListener('click', function (e) { e.preventDefault(); render(ti); });
    });

    /* gallery arrows */
    var gPrev = gallery.querySelector('[data-gprev]');
    var gNext = gallery.querySelector('[data-gnext]');
    if (gPrev) gPrev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    if (gNext) gNext.addEventListener('click', function (e) { e.stopPropagation(); step(1); });

    /* shared pointer drag helper (swipe + tap detection) */
    function attachDrag(el, opts) {
      var down = false, startX = 0, startY = 0, moved = false, dx = 0;
      el.addEventListener('pointerdown', function (e) {
        if (e.button && e.button !== 0) return;
        if (opts.ignore && e.target.closest(opts.ignore)) return;
        down = true; moved = false; startX = e.clientX; startY = e.clientY; dx = 0;
        el.classList.add('is-dragging');
      });
      el.addEventListener('pointermove', function (e) {
        if (!down) return;
        dx = e.clientX - startX;
        if (Math.abs(dx) > 6 || Math.abs(e.clientY - startY) > 6) moved = true;
      });
      function end() {
        if (!down) return;
        down = false; el.classList.remove('is-dragging');
        if (moved && Math.abs(dx) > 45) opts.onSwipe(dx < 0 ? 1 : -1);
        else if (!moved && opts.onTap) opts.onTap();
      }
      el.addEventListener('pointerup', end);
      el.addEventListener('pointerleave', end);
      el.addEventListener('pointercancel', function () { down = false; el.classList.remove('is-dragging'); });
      el.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }

    /* main image: drag to swipe, tap to open lightbox (ignore arrow clicks) */
    attachDrag(mainWrap, {
      ignore: '.gallery-nav',
      onSwipe: function (dir) { step(dir); },
      onTap: function () { openLb(index); }
    });

    /* ---- lightbox ---- */
    function openLb(i) {
      if (!lightbox) return;
      render(i, false);
      lbOpen = true;
      lastFocus = document.activeElement;
      lightbox.hidden = false;
      document.body.classList.add('lb-open');
      updateLb();
      window.requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
      var closeBtn = lightbox.querySelector('[data-lbclose]');
      if (closeBtn && closeBtn.focus) closeBtn.focus();
    }
    function closeLb() {
      if (!lightbox || !lbOpen) return;
      lbOpen = false;
      lightbox.classList.remove('is-open');
      document.body.classList.remove('lb-open');
      setTimeout(function () { if (!lbOpen) lightbox.hidden = true; }, reduceMotion ? 0 : 240);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (lightbox) {
      [].slice.call(lightbox.querySelectorAll('[data-lbclose]')).forEach(function (el) {
        el.addEventListener('click', function (e) { e.stopPropagation(); closeLb(); });
      });
      var lbPrev = lightbox.querySelector('[data-lbprev]');
      var lbNext = lightbox.querySelector('[data-lbnext]');
      if (lbPrev) lbPrev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
      if (lbNext) lbNext.addEventListener('click', function (e) { e.stopPropagation(); step(1); });

      document.addEventListener('keydown', function (e) {
        if (!lbOpen) return;
        if (e.key === 'Escape') closeLb();
        else if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
      });

      var lbStage = lightbox.querySelector('[data-lbstage]');
      if (lbStage) attachDrag(lbStage, { onSwipe: function (dir) { step(dir); } });
    }
  })();

  /* ---------- Facebook-anmeldelser: masonry + lightbox ---------- */
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
      btn.addEventListener('click', function () { openRlb(i); });
      frag.appendChild(btn);
    });
    host.appendChild(frag);

    var lb = document.querySelector('[data-review-lightbox]');
    if (!lb) return;
    var lbImg = lb.querySelector('[data-rlbimg]');
    var lbCount = lb.querySelector('[data-rlbcounter]');
    var lbStage = lb.querySelector('[data-rlbstage]');
    var idx = 0, open = false, lastFocus = null;

    function paint() {
      var r = data[idx];
      lbImg.src = REVIEW_BASE + r.file;
      lbImg.alt = r.alt || 'Facebook-anmeldelse af Barrier Defense';
      if (lbCount) lbCount.textContent = (idx + 1) + ' / ' + data.length;
    }
    function openRlb(i) {
      idx = i; open = true; lastFocus = document.activeElement;
      paint();
      lb.hidden = false;
      document.body.classList.add('lb-open');
      window.requestAnimationFrame(function () { lb.classList.add('is-open'); });
      var c = lb.querySelector('[data-rlbclose]');
      if (c && c.focus) c.focus();
    }
    function closeRlb() {
      if (!open) return;
      open = false;
      lb.classList.remove('is-open');
      document.body.classList.remove('lb-open');
      window.setTimeout(function () { if (!open) lb.hidden = true; }, reduceMotion ? 0 : 220);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function stepR(d) {
      idx = (idx + d + data.length) % data.length;
      if (lbStage) {
        lbStage.classList.add('is-swapping');
        window.setTimeout(function () { paint(); lbStage.classList.remove('is-swapping'); }, reduceMotion ? 0 : 110);
      } else { paint(); }
    }

    [].slice.call(lb.querySelectorAll('[data-rlbclose]')).forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); closeRlb(); });
    });
    var p = lb.querySelector('[data-rlbprev]'), n = lb.querySelector('[data-rlbnext]');
    if (p) p.addEventListener('click', function (e) { e.stopPropagation(); stepR(-1); });
    if (n) n.addEventListener('click', function (e) { e.stopPropagation(); stepR(1); });
    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') closeRlb();
      else if (e.key === 'ArrowLeft') stepR(-1);
      else if (e.key === 'ArrowRight') stepR(1);
    });
  })();

})();
