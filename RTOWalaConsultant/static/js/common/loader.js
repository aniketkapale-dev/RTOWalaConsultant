(function(window, document) {
  'use strict';

  let requestCount = 0;
  const buttonStates = new WeakMap();

  function getLoader() {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'globalLoader';
      loader.className = 'global-loader';
      loader.setAttribute('aria-live', 'assertive');
      loader.setAttribute('aria-busy', 'false');
      loader.innerHTML = `
        <div class="global-loader-box" role="status">
          <span class="global-loader-spinner" aria-hidden="true"></span>
          <span class="global-loader-text">Loading...</span>
        </div>
      `;
      document.body.appendChild(loader);
    }
    return loader;
  }

  function setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      if (!buttonStates.has(button)) {
        buttonStates.set(button, {
          html: button.innerHTML,
          disabled: button.disabled
        });
      }
      button.disabled = true;
      button.classList.add('btn-loading');
      button.innerHTML = '<span class="button-spinner" aria-hidden="true"></span><span>Processing...</span>';
      return;
    }

    const state = buttonStates.get(button);
    if (!state) return;
    button.innerHTML = state.html;
    button.disabled = state.disabled;
    button.classList.remove('btn-loading');
    buttonStates.delete(button);
  }

  function showLoader(options) {
    requestCount += 1;
    const loader = getLoader();
    loader.classList.add('show');
    loader.setAttribute('aria-busy', 'true');
    document.documentElement.classList.add('is-loading');
    setButtonLoading(options?.button, true);
  }

  function hideLoader(options) {
    requestCount = Math.max(0, requestCount - 1);
    setButtonLoading(options?.button, false);

    if (requestCount > 0) return;

    const loader = getLoader();
    loader.classList.remove('show');
    loader.setAttribute('aria-busy', 'false');
    document.documentElement.classList.remove('is-loading');
  }

  function resetLoader() {
    requestCount = 0;
    const loader = getLoader();
    loader.classList.remove('show');
    loader.setAttribute('aria-busy', 'false');
    document.documentElement.classList.remove('is-loading');
  }

  window.showLoader = showLoader;
  window.hideLoader = hideLoader;
  window.resetLoader = resetLoader;
  window.setButtonLoading = setButtonLoading;
})(window, document);
