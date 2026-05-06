(function(window, document, $) {
  'use strict';

  if (!$ || !$.fn || !$.fn.select2) {
    return;
  }

  const SELECTOR = 'select, select.form-select';

  function getDropdownParent(element) {
    const modal = element.closest('.modal');
    const modalBackdrop = element.closest('.modal-backdrop');

    if (modal) {
      return $(modal);
    }

    if (modalBackdrop) {
      return $(modalBackdrop);
    }

    return $(document.body);
  }

  function getPlaceholder(element) {
    const dataPlaceholder = element.getAttribute('data-placeholder');
    const placeholder = element.getAttribute('placeholder');
    const firstOption = element.querySelector('option[value=""]');

    return dataPlaceholder || placeholder || (firstOption ? firstOption.textContent.trim() : 'Select');
  }

  function initializeSelect2(context) {
    const root = context || document;
    const selects = root.matches && root.matches(SELECTOR)
      ? [root]
      : Array.from(root.querySelectorAll ? root.querySelectorAll(SELECTOR) : []);

    selects.forEach(function(element) {
      if (!$(element).hasClass('select2-hidden-accessible')) {
        $(element).select2({
          theme: 'bootstrap-5',
          width: '100%',
          placeholder: getPlaceholder(element),
          allowClear: !element.required,
          dropdownParent: getDropdownParent(element)
        });
      } else {
        $(element).trigger('change.select2');
      }
    });
  }

  function refreshSelect2(context) {
    initializeSelect2(context || document);
  }

  let observerTimer = null;
  function scheduleRefresh(target) {
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(function() {
      refreshSelect2(target || document);
    }, 0);
  }

  document.addEventListener('DOMContentLoaded', function() {
    initializeSelect2(document);

    const observer = new MutationObserver(function(mutations) {
      let refreshTarget = null;

      mutations.forEach(function(mutation) {
        if (mutation.target && mutation.target.matches && mutation.target.matches(SELECTOR)) {
          refreshTarget = mutation.target;
          return;
        }

        Array.from(mutation.addedNodes || []).forEach(function(node) {
          if (node.nodeType !== 1) {
            return;
          }

          if ((node.matches && node.matches(SELECTOR)) || (node.querySelector && node.querySelector(SELECTOR))) {
            refreshTarget = node;
          }
        });
      });

      if (refreshTarget) {
        scheduleRefresh(refreshTarget);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

  window.initializeSelect2 = initializeSelect2;
  window.refreshSelect2 = refreshSelect2;
})(window, document, window.jQuery);
