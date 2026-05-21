/* Kjeldgaards advertorial — script.js (landingpage-2)
 * Fade-in på inline-figurer, 75% scroll ViewContent, primær CTA Lead-event,
 * sekundær CTA ViewContent-event. Ingen email-form på denne side.
 */
(function () {
  'use strict';

  var SOURCE_TAG = 'landingpage-2';

  function fireFbq() {
    if (typeof window.fbq === 'function') {
      try { window.fbq.apply(null, arguments); }
      catch (e) { /* swallow */ }
    }
  }

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
          fireFbq('track', 'ViewContent', { content_name: SOURCE_TAG + '_scroll_75' });
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
      fireFbq('track', 'Lead', {
        content_name: 'listicle_click_from_advertorial',
        content_category: 'advertorial_cta_primary',
        source_url: SOURCE_TAG
      });
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
      fireFbq('track', 'ViewContent', { content_name: 'soft_product_link_from_advertorial' });
      fireGa('event', 'click', { link_type: 'soft_product_link_from_advertorial' });
    });
  }

  function init() {
    initFadeIn();
    initScrollDepthEvent();
    initPrimaryCta();
    initSecondaryCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
