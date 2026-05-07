const clientPaginationState = { currentPage: 1, totalPages: 0, count: 0, next: null, previous: null, search: '' };
const CLIENT_SEARCH_DEBOUNCE_MS = 350;
let clientRequestId = 0;

function debounceClientSearch(callback, delay = CLIENT_SEARCH_DEBOUNCE_MS) {
  let timer = null;
  return function debouncedSearch(...args) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback.apply(this, args), delay);
  };
}

async function loadClients(page) {
  const pageNumber = Number(page) || clientPaginationState.currentPage || 1;
  clientPaginationState.currentPage = pageNumber;

  const search = (byId('clientSearch')?.value || '').trim();
  if (search !== clientPaginationState.search) {
    clientPaginationState.currentPage = 1;
  }
  clientPaginationState.search = search;

  const endpoint = buildPaginationUrl('clients/', { page: clientPaginationState.currentPage, search: clientPaginationState.search });
  const requestId = ++clientRequestId;
  const payload = await apiGetPaginated(endpoint);
  if (requestId !== clientRequestId) return;

  updatePaginationState(clientPaginationState, payload);

  let data = getPaginatedResults(payload);
  if (!data.length && clientPaginationState.currentPage > 1 && clientPaginationState.totalPages) {
    clientPaginationState.currentPage = Math.max(1, clientPaginationState.totalPages);
    return await loadClients(clientPaginationState.currentPage);
  }

  setText('clientCount', clientPaginationState.count);
  setText('activeClientCount', data.filter(c => c.is_active !== false).length);
  setText('clientVehicleCount', data.reduce((s, c) => s + Number(c.total_vehicles || 0), 0));

  if (!data.length) {
    showEmpty('clientsBody', 6);
    renderPagination('clientPagination', clientPaginationState, { onPageChange: loadClients });
    return;
  }

  const body = byId('clientsBody');
  body.innerHTML = data.map(c => `<tr><td><b>${c.name}</b></td><td>${c.mobile_number}</td><td>${c.email||'-'}</td><td>${c.address||'-'}</td><td>${c.total_vehicles||0}</td><td>${deleteButton('clients/', c.id, 'loadClients')}</td></tr>`).join('');
  renderPagination('clientPagination', clientPaginationState, { onPageChange: loadClients });
}

function openClientModal(){ resetForm('clientForm'); byId('clientId').value=''; openModal('clientModal'); }

async function saveClient(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  try {
    await apiPost('clients/', {
      name: formValue('clientName'),
      mobile_number: formValue('clientMobile'),
      email: formValue('clientEmail') || null,
      address: formValue('clientAddress') || null
    }, {
      form: form,
      successMessage: 'Client saved successfully.'
    });
    closeModal('clientModal');
    await loadClients();
  } catch (error) {
    // Error handled by apiRequest
  }
}

function bindClientSearch() {
  const input = byId('clientSearch');
  if (!input || input.dataset.searchBound === 'true') return;

  input.dataset.searchBound = 'true';
  input.removeAttribute('oninput');

  const debouncedLoadClients = debounceClientSearch(() => {
    clientPaginationState.currentPage = 1;
    loadClients(1);
  });

  input.addEventListener('input', debouncedLoadClients);
}

document.addEventListener('DOMContentLoaded', () => {
  bindClientSearch();
  loadClients(1);
});
