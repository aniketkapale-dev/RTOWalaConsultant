const insurancePaginationState = { currentPage: 1, totalPages: 0, count: 0, next: null, previous: null, client: '', vehicle: '', status: '' };
let currentInsuranceDocs = [];

async function initInsurance(){
  await fillSelect('insuranceClient','clients/', c => `${c.name} (${c.mobile_number})`, x=>x.id, 'Select client');
  await fillSelect('insuranceStatus','vehicle-documents/status-options/', option => option.label, option => option.value, 'All statuses');
  applyInsuranceUrlParams();
}

function applyInsuranceUrlParams(){
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status') || '';
  if(status && byId('insuranceStatus')){
    byId('insuranceStatus').value = status;
    if(window.refreshSelect2) window.refreshSelect2(byId('insuranceStatus'));
    insurancePaginationState.status = status;
  }
}

function updateInsuranceUrl() {
  const params = new URLSearchParams(window.location.search);
  if (insurancePaginationState.status) {
    params.set('status', insurancePaginationState.status);
  } else {
    params.delete('status');
  }
  const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
  window.history.replaceState(null, '', newUrl);
}

async function loadInsuranceVehicles(){
  insurancePaginationState.currentPage = 1;
  const clientId = formValue('insuranceClient');
  const el = byId('insuranceVehicle');
  if(!clientId){ el.innerHTML='<option value="">Select client first</option>'; showEmpty('insuranceBody',8,'Select client and vehicle'); renderPagination('insurancePagination', insurancePaginationState, { onPageChange: loadInsuranceDocuments }); return; }
  await fillSelect('insuranceVehicle', `vehicles/?client=${clientId}`, v => `${v.vehicle_number} - ${v.vehicle_name}`, x=>x.id, 'Select vehicle');
  showEmpty('insuranceBody',8,'Select vehicle to view documents');
}

function calcStatus(d){
  if(!d.end_date) return d.status || 'active';
  const today = new Date(); today.setHours(0,0,0,0);
  const expiry = new Date(d.end_date);
  const diff = Math.ceil((expiry - today)/(1000*60*60*24));
  if(diff < 0) return 'expired';
  if(diff <= 30) return 'expiring';
  return d.status || 'active';
}

async function loadInsuranceDocuments(page) {
  const pageNumber = Number(page) || insurancePaginationState.currentPage || 1;
  insurancePaginationState.currentPage = pageNumber;

  const clientId = formValue('insuranceClient');
  const vehicleId = formValue('insuranceVehicle');
  const status = formValue('insuranceStatus');

  if (clientId !== insurancePaginationState.client || vehicleId !== insurancePaginationState.vehicle || status !== insurancePaginationState.status) {
    insurancePaginationState.currentPage = 1;
  }

  insurancePaginationState.client = clientId;
  insurancePaginationState.vehicle = vehicleId;
  insurancePaginationState.status = status;
  updateInsuranceUrl();

  if(!vehicleId) {
    showEmpty('insuranceBody',8,'Select vehicle to view documents');
    renderPagination('insurancePagination', insurancePaginationState, { onPageChange: loadInsuranceDocuments });
    return;
  }

  const endpoint = buildPaginationUrl('vehicle-documents/', { page: insurancePaginationState.currentPage, vehicle: vehicleId, status });
  const payload = await apiGetPaginated(endpoint);
  updatePaginationState(insurancePaginationState, payload);

  let data = getPaginatedResults(payload);
  currentInsuranceDocs = data;

  if (!data.length && insurancePaginationState.currentPage > 1 && insurancePaginationState.totalPages) {
    insurancePaginationState.currentPage = Math.max(1, insurancePaginationState.totalPages);
    return await loadInsuranceDocuments(insurancePaginationState.currentPage);
  }

  if(!data.length) {
    showEmpty('insuranceBody',8,'No documents found for selected vehicle');
    renderPagination('insurancePagination', insurancePaginationState, { onPageChange: loadInsuranceDocuments });
    return;
  }

  const body = byId('insuranceBody');
  body.innerHTML = data.map(d => {
    const st = calcStatus(d);
    const canRenew = st === 'expired' || st === 'expiring';
    return `<tr><td>${d.document_category_name}</td><td>${d.document_number||'-'}</td><td>${d.provider||'-'}</td><td>${formatDate(d.issue_date)}</td><td>${formatDate(d.end_date)}</td><td>${rupee(d.amount)}</td><td>${statusBadge(st)}</td><td>${canRenew ? `<button class="icon-btn" onclick="openRenew(${d.vehicle},${d.document_category},'${d.vehicle_number}','${d.document_category_name}')">Update</button>` : '-'}</td></tr>`;
  }).join('');

  renderPagination('insurancePagination', insurancePaginationState, { onPageChange: loadInsuranceDocuments });
}

function openRenew(vehicleId, categoryId, vehicleNo, categoryName){
  resetForm('renewForm');
  byId('renewVehicle').value = vehicleId;
  byId('renewCategory').value = categoryId;
  byId('renewVehicleLabel').value = vehicleNo;
  byId('renewCategoryLabel').value = categoryName;
  openModal('renewModal');
}

async function saveRenewal(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  try {
    await apiPost('vehicle-documents/', {
      vehicle: formValue('renewVehicle'),
      document_category: formValue('renewCategory'),
      document_number: formValue('renewNumber') || null,
      issue_date: formValue('renewIssue') || null,
      start_date: formValue('renewStart') || null,
      end_date: formValue('renewEnd'),
      provider: formValue('renewProvider') || null,
      amount: formValue('renewAmount') || null,
      status: 'active',
      is_current: true
    }, {
      form: form,
      successMessage: 'Insurance updated successfully.'
    });
    closeModal('renewModal');
    await loadInsuranceDocuments();
  } catch (error) {
    // Error handled by apiRequest
  }
}

document.addEventListener('DOMContentLoaded', initInsurance);
