let allClients = [];
async function initDocuments(){
  allClients = await fillSelect('filterClient','clients/', c => `${c.name} (${c.mobile_number})`, x=>x.id, 'All clients');
  await fillSelect('docClient','clients/', c => `${c.name} (${c.mobile_number})`, x=>x.id, 'Select client');
  await fillSelect('docCategory','document-categories/', c => c.name, x=>x.id, 'Select category');
  await onFilterClientChange();
  await loadDocuments();
}
async function onFilterClientChange(){
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
async function loadDocuments(){
  let endpoint = 'vehicle-documents/';
  const params = new URLSearchParams();
  if(formValue('filterVehicle')) params.append('vehicle', formValue('filterVehicle'));
  if(formValue('filterClient')) params.append('client', formValue('filterClient'));
  if(params.toString()) endpoint += '?' + params.toString();
  const payload = await apiGet(endpoint); let data = rows(payload);
  const q = (byId('documentSearch')?.value || '').toLowerCase();
  if(q) data = data.filter(d => `${d.client_name||''} ${d.vehicle_number||''} ${d.document_category_name||''} ${d.document_number||''} ${d.provider||''}`.toLowerCase().includes(q));
  if(!data.length) return showEmpty('documentsBody', 8);
  documentsBody.innerHTML = data.map(d => `<tr><td>${d.client_name}</td><td><b>${d.vehicle_number}</b></td><td>${d.document_category_name}</td><td>${d.document_number||'-'}</td><td>${d.provider||'-'}</td><td>${formatDate(d.end_date)}</td><td>${statusBadge(d.status)}</td><td>${deleteButton('vehicle-documents/', d.id, 'loadDocuments')}</td></tr>`).join('');
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
