/* Kjeldgaards advertorial — traette-paa-fotos
 * Direct-product advertorial: tracks 75% scroll depth and primary CTA click.
 * No email-capture form on this page.
 */
(function () {
  'use strict';

  var SOURCE_TAG = 'traette-paa-fotos';

  function fireGa() {
    if (typeof window.gtag === 'function') {
      try { window.gtag.apply(null, arguments); }
      catch (e) { /* swallow */ }
    }
  }

  function initScrollDepthEvent() {
    if (!('IntersectionObserver' in window)) return;

    var marker = document.createElement('div');
    marker.setAttribute('aria-hidden', 'true');
    marker.style.cssText = 'position:absolute;left:0;width:1px;height:1px;pointer-events:none;';

    function place() {
      var pageHeight = document.documentElement.scrollHeight;
      marker.style.top = Math.round(pageHeight * 0.75) + 'px';
    }

    document.body.appendChild(marker);
    place();
    window.addEventListener('resize', place, { passive: true });

    var fired = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !fired) {
          fired = true;
          fireGa('event', 'scroll', { percent_scrolled: 75, source: SOURCE_TAG });
          observer.disconnect();
        }
      });
    }, { threshold: 0 });

    observer.observe(marker);
  }

  function initPrimaryCta() {
    var link = document.querySelector('[data-primary-cta]');
    if (!link) return;
    link.addEventListener('click', function () {
      fireGa('event', 'select_promotion', {
        promotion_name: 'barrier_defense_60_day',
        source: SOURCE_TAG
      });
    });
  }

  function init() {
    initScrollDepthEvent();
    initPrimaryCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
