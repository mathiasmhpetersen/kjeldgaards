/* Kjeldgaards advertorial — script.js
 * Email-form, scroll-driven fade-in, scroll-depth ViewContent, secondary CTA event.
 */
(function () {
  'use strict';

  var EMAIL_ENDPOINT = '/api/lead';
  var SOURCE_TAG = 'biologi-bag-traetheden';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fireGa() {
    if (typeof window.gtag === 'function') {
      try { window.gtag.apply(null, arguments); }
      catch (e) { /* swallow */ }
    }
  }

  function initLeadForm() {
    var form = document.querySelector('[data-lead-form]');
    if (!form) return;

    var wrap = form.closest('[data-capture]');
    var formWrap = wrap && wrap.querySelector('[data-capture-form-wrap]');
    var successWrap = wrap && wrap.querySelector('[data-capture-success]');
    var errorEl = form.querySelector('[data-form-error]');
    var button = form.querySelector('button[type="submit"]');
    var emailInput = form.querySelector('input[name="email"]');
    var honeypot = form.querySelector('input[name="website"]');
    var gdprInput = form.querySelector('input[name="gdpr_consent"]');

    function showError(msg) {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }

    function clearError() {
      if (!errorEl) return;
      errorEl.textContent = '';
      errorEl.hidden = true;
    }

    function setSubmitting(isSubmitting) {
      if (!button) return;
      if (isSubmitting) {
        button.disabled = true;
        button.textContent = 'Sender…';
      } else {
        button.disabled = false;
        button.textContent = button.getAttribute('data-default-label') || 'Send mig guiden';
      }
    }

    function showSuccess() {
      if (formWrap) formWrap.hidden = true;
      if (successWrap) {
        successWrap.hidden = false;
        successWrap.setAttribute('tabindex', '-1');
        try { successWrap.focus(); } catch (e) {}
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError();

      // Honeypot: bot detection — silently "succeed" so the bot moves on.
      if (honeypot && honeypot.value) {
        showSuccess();
        return;
      }

      var email = (emailInput && emailInput.value || '').trim();
      if (!EMAIL_RE.test(email)) {
        showError('Indtast venligst en gyldig e-mail-adresse.');
        emailInput && emailInput.focus();
        return;
      }

      if (gdprInput && !gdprInput.checked) {
        showError('Du skal acceptere privatlivspolitikken for at modtage guiden.');
        return;
      }

      setSubmitting(true);

      var payload = { email: email, source: SOURCE_TAG };

      // Skip the network call on local/file origins so dev does not log
      // a failed POST when no backend is running. Success state is shown
      // regardless so the flow is testable.
      var host = window.location.hostname;
      var isLocal = (
        window.location.protocol === 'file:' ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        /\.local$/.test(host) ||
        host === ''
      );

      function finish() {
        fireGa('event', 'generate_lead', { source: SOURCE_TAG });
        showSuccess();
        setSubmitting(false);
      }

      if (isLocal) {
        setTimeout(finish, 250);
        return;
      }

      fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('Bad response: ' + res.status);
        finish();
      }).catch(function () {
        // Network/endpoint failed: still show success so the user is not
        // stuck. The lead is lost in this case — server-side logging on the
        // endpoint should surface that separately.
        finish();
      });
    });
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
          fireGa('event', 'scroll', { percent_scrolled: 75, source: SOURCE_TAG });
          observer.disconnect();
        }
      });
    }, { threshold: 0 });

    observer.observe(marker);
  }

  function initSecondaryCta() {
    var link = document.querySelector('[data-secondary-cta]');
    if (!link) return;
    link.addEventListener('click', function () {
      fireGa('event', 'click', { link_type: 'soft_product_link_from_advertorial' });
    });
  }

  function init() {
    initLeadForm();
    initFadeIn();
    initScrollDepthEvent();
    initSecondaryCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
