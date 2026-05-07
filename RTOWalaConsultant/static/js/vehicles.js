const vehiclesPaginationState = { currentPage: 1, totalPages: 0, count: 0, next: null, previous: null, search: '' };
const VEHICLE_SEARCH_DEBOUNCE_MS = 350;
let vehicleRequestId = 0;

function debounceVehicleSearch(callback, delay = VEHICLE_SEARCH_DEBOUNCE_MS) {
  let timer = null;
  return function debouncedSearch(...args) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback.apply(this, args), delay);
  };
}

async function loadVehicleClients(){ await fillSelect('vehicleClient','clients/', c => `${c.name} (${c.mobile_number})`, x=>x.id, 'Select client'); }

async function loadVehicles(page) {
  const pageNumber = Number(page) || vehiclesPaginationState.currentPage || 1;
  vehiclesPaginationState.currentPage = pageNumber;

  const search = (byId('vehicleSearch')?.value || '').trim();
  if (search !== vehiclesPaginationState.search) {
    vehiclesPaginationState.currentPage = 1;
  }
  vehiclesPaginationState.search = search;

  const endpoint = buildPaginationUrl('vehicles/', { page: vehiclesPaginationState.currentPage, search: vehiclesPaginationState.search });
  const requestId = ++vehicleRequestId;
  const payload = await apiGetPaginated(endpoint);
  if (requestId !== vehicleRequestId) return;

  updatePaginationState(vehiclesPaginationState, payload);

  let data = getPaginatedResults(payload);
  if (!data.length && vehiclesPaginationState.currentPage > 1 && vehiclesPaginationState.totalPages) {
    vehiclesPaginationState.currentPage = Math.max(1, vehiclesPaginationState.totalPages);
    return await loadVehicles(vehiclesPaginationState.currentPage);
  }

  if (!data.length) {
    showEmpty('vehiclesBody', 6);
    renderPagination('vehiclePagination', vehiclesPaginationState, { onPageChange: loadVehicles });
    return;
  }

  const body = byId('vehiclesBody');
  body.innerHTML = data.map(v => `<tr><td><b>${v.vehicle_number}</b></td><td>${v.client_name||'-'}</td><td>${v.vehicle_name||'-'}</td><td>${v.vehicle_type||'-'}</td><td>${v.fuel_type||'-'}</td><td>${deleteButton('vehicles/', v.id, 'loadVehicles')}</td></tr>`).join('');
  renderPagination('vehiclePagination', vehiclesPaginationState, { onPageChange: loadVehicles });
}

async function openVehicleModal(){ resetForm('vehicleForm'); await loadVehicleClients(); openModal('vehicleModal'); }

async function saveVehicle(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  try {
    await apiPost('vehicles/', {
      client: formValue('vehicleClient'),
      vehicle_number: formValue('vehicleNumber').toUpperCase(),
      vehicle_name: formValue('vehicleName') || null,
      vehicle_type: formValue('vehicleType') || null,
      fuel_type: formValue('fuelType') || null
    }, {
      form: form,
      successMessage: 'Vehicle saved successfully.'
    });
    closeModal('vehicleModal');
    await loadVehicles();
  } catch (error) {
    // Error handled by apiRequest
  }
}

function bindVehicleSearch() {
  const input = byId('vehicleSearch');
  if (!input || input.dataset.searchBound === 'true') return;

  input.dataset.searchBound = 'true';
  input.removeAttribute('oninput');

  const debouncedLoadVehicles = debounceVehicleSearch(() => {
    vehiclesPaginationState.currentPage = 1;
    loadVehicles(1);
  });

  input.addEventListener('input', debouncedLoadVehicles);
}

document.addEventListener('DOMContentLoaded', () => {
  bindVehicleSearch();
  loadVehicles(1);
});
