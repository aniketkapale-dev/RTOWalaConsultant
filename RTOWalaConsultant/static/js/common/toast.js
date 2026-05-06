(function(window, document) {
  'use strict';

  const TOAST_TYPES = {
    success: { title: 'Success', className: 'toast-success' },
    error: { title: 'Error', className: 'toast-error' },
    warning: { title: 'Warning', className: 'toast-warning' },
    info: { title: 'Info', className: 'toast-info' }
  };
  const activeToasts = new Map();
  const defaultDuration = 4500;

  function getContainer() {
    let container = document.getElementById('globalToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'globalToastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  }

  function normalizeMessage(message) {
    if (!message) return 'Something went wrong';
    if (Array.isArray(message)) return message.join(' ');
    if (typeof message === 'object') return message.message || message.detail || 'Something went wrong';
    return String(message);
  }

  function removeToast(toast, key) {
    if (!toast) return;
    toast.classList.remove('show');
    window.setTimeout(function() {
      toast.remove();
      activeToasts.delete(key);
    }, 220);
  }

  function showToast(type, message, options) {
    const toastType = TOAST_TYPES[type] || TOAST_TYPES.info;
    const text = normalizeMessage(message);
    const key = `${type}:${text}`;
    const duration = Number(options?.duration || defaultDuration);

    if (activeToasts.has(key)) {
      const existing = activeToasts.get(key);
      existing.classList.remove('toast-pulse');
      window.requestAnimationFrame(function() {
        existing.classList.add('toast-pulse');
      });
      return existing;
    }

    const toast = document.createElement('div');
    toast.className = `app-toast ${toastType.className}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.innerHTML = `
      <div class="app-toast-content">
        <strong>${toastType.title}</strong>
        <span>${text}</span>
      </div>
      <button type="button" class="app-toast-close" aria-label="Close notification">&times;</button>
    `;

    activeToasts.set(key, toast);
    getContainer().appendChild(toast);
    window.requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    toast.querySelector('.app-toast-close').addEventListener('click', function() {
      removeToast(toast, key);
    });

    if (duration > 0) {
      window.setTimeout(function() {
        removeToast(toast, key);
      }, duration);
    }

    return toast;
  }

  window.showToast = showToast;
  window.showSuccess = function(message, options) { return showToast('success', message, options); };
  window.showError = function(message, options) { return showToast('error', message, options); };
  window.showWarning = function(message, options) { return showToast('warning', message, options); };
  window.showInfo = function(message, options) { return showToast('info', message, options); };
})(window, document);
