/* Kjeldgaards advertorial — script.js (landingpage-2)
 * Fade-in på inline-figurer, 75% scroll ViewContent, primær CTA Lead-event,
 * sekundær CTA ViewContent-event. Ingen email-form på denne side.
 */
(function () {
  'use strict';

  var SOURCE_TAG = 'landingpage-2';

  function fireGa() {
    if (typeof window.gtag === 'function') {
      try { window.gtag.apply(null, arguments); }
      catch (e) { /* swallow */ }
    }
  }

  function initFadeIn() {
    var figures = document.querySelectorAll('[data-fade]');
    if (!figures.length) return;

    if (!('IntersectionObserver' in window)) {
      figures.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    figures.forEach(function (el) { observer.observe(el); });
  }

  function initPrimaryCta() {
    var link = document.querySelector('[data-primary-cta]');
    if (!link) return;
    link.addEventListener('click', function () {
      fireGa('event', 'generate_lead', {
        link_type: 'listicle_click_from_advertorial',
        source: SOURCE_TAG
      });
    });
  }

  function initSecondaryCta() {
    var link = document.querySelector('[data-secondary-cta]');
    if (!link) return;
    link.addEventListener('click', function () {
      fireGa('event', 'select_content', {
        content_type: 'product_click_from_advertorial',
        source: SOURCE_TAG
      });
    });
  }

  function init() {
    initFadeIn();
    initPrimaryCta();
    initSecondaryCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
