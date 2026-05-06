async function loadClients(){
  const payload = await apiGet('clients/');
  let data = rows(payload);
  const q = (byId('clientSearch')?.value || '').toLowerCase();
  if(q) data = data.filter(c => `${c.name} ${c.mobile_number} ${c.email||''} ${c.address||''}`.toLowerCase().includes(q));
  setText('clientCount', data.length);
  setText('activeClientCount', data.filter(c=>c.is_active !== false).length);
  setText('clientVehicleCount', data.reduce((s,c)=>s + Number(c.total_vehicles || 0), 0));
  if(!data.length) return showEmpty('clientsBody', 6);
  clientsBody.innerHTML = data.map(c => `<tr><td><b>${c.name}</b></td><td>${c.mobile_number}</td><td>${c.email||'-'}</td><td>${c.address||'-'}</td><td>${c.total_vehicles||0}</td><td>${deleteButton('clients/', c.id, 'loadClients')}</td></tr>`).join('');
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
document.addEventListener('DOMContentLoaded', loadClients);
