(function(window, document, $) {
  'use strict';

  const FIELD_SELECTOR = 'input, select, textarea';
  const SKIP_TYPES = ['button', 'submit', 'reset', 'hidden'];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePattern = /^(\+91[\s-]?)?[6-9]\d{9}$/;

  function getFields(form) {
    return Array.from(form.querySelectorAll(FIELD_SELECTOR)).filter(function(field) {
      return !field.disabled && !SKIP_TYPES.includes((field.type || '').toLowerCase());
    });
  }

  function getFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('label')?.textContent || field.placeholder || field.name || field.id || 'This field';
    return label.replace('*', '').trim();
  }

  function getFeedbackElement(field) {
    let feedback = field.parentElement.querySelector(':scope > .invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      field.parentElement.appendChild(feedback);
    }
    return feedback;
  }

  function updateSelect2State(field, isInvalid) {
    if (!field.matches('select')) return;
    const container = field.nextElementSibling;
    if (!container || !container.classList.contains('select2')) return;
    container.classList.toggle('is-invalid', isInvalid);
    container.classList.toggle('is-valid', !isInvalid && Boolean(field.value));
  }

  function showFieldError(field, message) {
    if (!field) return;
    const feedback = getFeedbackElement(field);
    feedback.textContent = message;
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    field.setAttribute('aria-invalid', 'true');
    updateSelect2State(field, true);
  }

  function clearFieldError(field) {
    if (!field) return;
    const feedback = field.parentElement?.querySelector(':scope > .invalid-feedback');
    if (feedback) feedback.textContent = '';
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    if (field.value) field.classList.add('is-valid');
    updateSelect2State(field, false);
  }

  function clearFormErrors(form) {
    if (!form) return;
    getFields(form).forEach(clearFieldError);
  }

  function isMobileField(field) {
    const key = `${field.name || ''} ${field.id || ''} ${field.dataset.validate || ''}`.toLowerCase();
    return key.includes('mobile') || key.includes('phone');
  }

  function isPasswordField(field) {
    return field.type === 'password' || (field.dataset.validate || '').toLowerCase().includes('password');
  }

  function validateField(field) {
    const value = (field.value || '').trim();
    const label = getFieldLabel(field);
    const regex = field.dataset.regex;
    const minLength = Number(field.dataset.minLength || 0);

    clearFieldError(field);

    if (field.required && !value) {
      showFieldError(field, `${label} is required.`);
      return false;
    }

    if (!value) {
      return true;
    }

    if (field.type === 'email' && !emailPattern.test(value)) {
      showFieldError(field, 'Enter a valid email address.');
      return false;
    }

    if (isMobileField(field) && !mobilePattern.test(value.replace(/\s/g, ''))) {
      showFieldError(field, 'Enter a valid mobile number.');
      return false;
    }

    if (isPasswordField(field) && minLength && value.length < minLength) {
      showFieldError(field, `Password must be at least ${minLength} characters.`);
      return false;
    }

    if (regex && !(new RegExp(regex).test(value))) {
      showFieldError(field, field.dataset.regexMessage || `${label} format is invalid.`);
      return false;
    }

    if (field.dataset.confirmFor) {
      const source = document.getElementById(field.dataset.confirmFor) || document.querySelector(`[name="${field.dataset.confirmFor}"]`);
      if (source && value !== source.value) {
        showFieldError(field, field.dataset.confirmMessage || 'Values do not match.');
        return false;
      }
    }

    return true;
  }

  function validateForm(form) {
    if (!form) return true;
    clearFormErrors(form);
    const fields = getFields(form);
    const valid = fields.map(validateField).every(Boolean);

    if (!valid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus({ preventScroll: false });
      if (window.showWarning) window.showWarning('Please correct the highlighted fields.');
    }

    return valid;
  }

  function findField(form, key) {
    if (!form || !key) return null;
    return form.querySelector(`[name="${key}"], [data-api-field="${key}"], #${key}`);
  }

  function flattenMessage(value) {
    if (Array.isArray(value)) return value.join(' ');
    if (value && typeof value === 'object') return Object.values(value).flat().join(' ');
    return String(value || 'Invalid value.');
  }

  function applyServerValidation(form, errors) {
    if (!form || !errors || typeof errors !== 'object') return false;
    let mapped = false;

    Object.keys(errors).forEach(function(key) {
      const field = findField(form, key);
      if (!field) return;
      showFieldError(field, flattenMessage(errors[key]));
      mapped = true;
    });

    if (mapped && window.showError) {
      window.showError('Please correct the highlighted fields.');
    }

    return mapped;
  }

  document.addEventListener('input', function(event) {
    if (event.target && event.target.matches(FIELD_SELECTOR)) {
      validateField(event.target);
    }
  });

  document.addEventListener('change', function(event) {
    if (event.target && event.target.matches(FIELD_SELECTOR)) {
      validateField(event.target);
    }
  });

  if ($) {
    $(document).on('select2:select select2:clear', 'select', function(event) {
      validateField(event.target);
    });
  }

  window.validateForm = validateForm;
  window.validateField = validateField;
  window.showFieldError = showFieldError;
  window.clearFieldError = clearFieldError;
  window.clearFormErrors = clearFormErrors;
  window.applyServerValidation = applyServerValidation;
})(window, document, window.jQuery);
