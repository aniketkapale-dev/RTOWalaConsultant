const documentsPaginationState = { currentPage: 1, totalPages: 0, count: 0, next: null, previous: null, client: '', vehicle: '', search: '' };
let allClients = [];

async function initDocuments(){
  allClients = await fillSelect('filterClient','clients/', c => `${c.name} (${c.mobile_number})`, x=>x.id, 'All clients');
  await fillSelect('docClient','clients/', c => `${c.name} (${c.mobile_number})`, x=>x.id, 'Select client');
  await fillSelect('docCategory','document-categories/', c => c.name, x=>x.id, 'Select category');
  await onFilterClientChange();
  await loadDocuments();
}

async function onFilterClientChange(){
  documentsPaginationState.currentPage = 1;
  const clientId = formValue('filterClient');
  const endpoint = clientId ? `vehicles/?client=${clientId}` : 'vehicles/';
  await fillSelect('filterVehicle', endpoint, v => `${v.vehicle_number} - ${v.vehicle_name}`, x=>x.id, 'All vehicles');
  await loadDocuments();
}

async function loadDocVehicles(){
  const clientId = formValue('docClient');
  const el = byId('docVehicle');
  if(!clientId){ el.innerHTML='<option value="">Select client first</option>'; return; }
  await fillSelect('docVehicle', `vehicles/?client=${clientId}`, v => `${v.vehicle_number} - ${v.vehicle_name}`, x=>x.id, 'Select vehicle');
}

async function loadDocuments(page) {
  const pageNumber = Number(page) || documentsPaginationState.currentPage || 1;
  documentsPaginationState.currentPage = pageNumber;

  const clientId = formValue('filterClient');
  const vehicleId = formValue('filterVehicle');
  const search = (byId('documentSearch')?.value || '').trim();

  if (clientId !== documentsPaginationState.client || vehicleId !== documentsPaginationState.vehicle || search !== documentsPaginationState.search) {
    documentsPaginationState.currentPage = 1;
  }

  documentsPaginationState.client = clientId;
  documentsPaginationState.vehicle = vehicleId;
  documentsPaginationState.search = search;

  const params = { page: documentsPaginationState.currentPage };
  if (clientId) params.client = clientId;
  if (vehicleId) params.vehicle = vehicleId;
  if (search) params.search = search;

  const endpoint = buildPaginationUrl('vehicle-documents/', params);
  const payload = await apiGetPaginated(endpoint);
  updatePaginationState(documentsPaginationState, payload);

  let data = getPaginatedResults(payload);
  if (!data.length && documentsPaginationState.currentPage > 1 && documentsPaginationState.totalPages) {
    documentsPaginationState.currentPage = Math.max(1, documentsPaginationState.totalPages);
    return await loadDocuments(documentsPaginationState.currentPage);
  }

  if (!data.length) {
    showEmpty('documentsBody', 8);
    renderPagination('documentsPagination', documentsPaginationState, { onPageChange: loadDocuments });
    return;
  }

  const body = byId('documentsBody');
  body.innerHTML = data.map(d => `<tr><td>${d.client_name}</td><td><b>${d.vehicle_number}</b></td><td>${d.document_category_name}</td><td>${d.document_number||'-'}</td><td>${d.provider||'-'}</td><td>${formatDate(d.end_date)}</td><td>${statusBadge(d.status)}</td><td>${deleteButton('vehicle-documents/', d.id, 'loadDocuments')}</td></tr>`).join('');
  renderPagination('documentsPagination', documentsPaginationState, { onPageChange: loadDocuments });
}

async function openDocumentModal(){ resetForm('documentForm'); byId('docVehicle').innerHTML='<option value="">Select client first</option>'; openModal('documentModal'); }

async function saveDocument(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  try {
    await apiPost('vehicle-documents/', {
      vehicle: formValue('docVehicle'),
      document_category: formValue('docCategory'),
      document_number: formValue('docNumber') || null,
      issue_date: formValue('issueDate') || null,
      start_date: formValue('startDate') || null,
      end_date: formValue('endDate'),
      provider: formValue('provider') || null,
      amount: formValue('amount') || null,
      status: 'active',
      is_current: true
    }, {
      form: form,
      successMessage: 'Document saved successfully.'
    });
    closeModal('documentModal');
    await loadDocuments();
  } catch (error) {
    // Error handled by apiRequest
  }
}

document.addEventListener('DOMContentLoaded', initDocuments);
