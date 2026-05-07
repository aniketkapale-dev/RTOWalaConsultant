(function(window, document) {
  'use strict';

  const MAX_PAGE_BUTTONS = 5;
  const DEFAULT_PAGE_SIZE = 10;

  function getPageFromUrl(url) {
    if (!url) return 1;
    try {
      const parsed = new URL(url, window.location.origin);
      return Number(parsed.searchParams.get('page')) || 1;
    } catch (e) {
      return 1;
    }
  }

  function buildPaginationUrl(base, params = {}) {
    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    const path = url.pathname + (url.search ? `?${url.searchParams.toString()}` : '');
    return path.replace(/^\//, '');
  }

  function getPaginatedResults(response) {
    return response?.data?.results || response?.results || [];
  }

  function getCurrentPageFromResponse(data, fallback = 1) {
    if (!data) return fallback;
    if (data.next) return Math.max(1, getPageFromUrl(data.next) - 1);
    if (data.previous) return Math.max(1, getPageFromUrl(data.previous) + 1);
    return fallback;
  }

  function updatePaginationState(state, response) {
    const data = response?.data || response || {};
    const count = Number(data.count || 0);
    state.count = count;
    state.next = data.next || null;
    state.previous = data.previous || null;
    state.currentPage = getCurrentPageFromResponse(data, state.currentPage || 1);
    state.totalPages = count ? Math.max(1, Math.ceil(count / DEFAULT_PAGE_SIZE)) : 0;
  }

  function buildPageRange(currentPage, totalPages, maxPages = MAX_PAGE_BUTTONS) {
    const pages = [];
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    const half = Math.floor(maxPages / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = maxPages;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxPages + 1;
    }

    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }

  function renderPagination(containerId, state, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!state || state.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    const current = state.currentPage || 1;
    const pages = buildPageRange(current, state.totalPages, options.maxButtons);
    const prevDisabled = current <= 1;
    const nextDisabled = current >= state.totalPages;

    const items = [];
    items.push(`<li class="page-item ${prevDisabled ? 'disabled' : ''}" data-page="${Math.max(1, current - 1)}"><button type="button" class="page-link" ${prevDisabled ? 'disabled' : ''} aria-label="Previous page">Previous</button></li>`);

    pages.forEach(page => {
      const active = page === current ? 'active' : '';
      items.push(`<li class="page-item ${active}" data-page="${page}"><button type="button" class="page-link" ${active ? 'aria-current="page"' : ''}>${page}</button></li>`);
    });

    items.push(`<li class="page-item ${nextDisabled ? 'disabled' : ''}" data-page="${Math.min(state.totalPages, current + 1)}"><button type="button" class="page-link" ${nextDisabled ? 'disabled' : ''} aria-label="Next page">Next</button></li>`);

    container.innerHTML = `
      <nav class="pagination-nav" aria-label="Table pagination">
        <ul class="pagination-list">${items.join('')}</ul>
      </nav>
    `;

    if (options.onPageChange) {
      setupPagination(containerId, state, options.onPageChange);
    }
  }

  function setupPagination(containerId, state, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container || !onPageChange) return;
    if (container.dataset.paginationSetup === 'true') return;

    container.dataset.paginationSetup = 'true';
    container.addEventListener('click', function(event) {
      const button = event.target.closest('[data-page]');
      if (!button || button.classList.contains('disabled')) return;
      const page = Number(button.dataset.page);
      if (!page || page === state.currentPage) return;
      onPageChange(page);
    });
  }

  window.getPageFromUrl = getPageFromUrl;
  window.buildPaginationUrl = buildPaginationUrl;
  window.getPaginatedResults = getPaginatedResults;
  window.updatePaginationState = updatePaginationState;
  window.renderPagination = renderPagination;
  window.setupPagination = setupPagination;
})(window, document);
