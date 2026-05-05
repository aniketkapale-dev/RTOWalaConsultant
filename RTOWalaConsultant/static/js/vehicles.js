async function loadVehicleClients(){ await fillSelect('vehicleClient','clients/', c => `${c.name} (${c.mobile_number})`, x=>x.id, 'Select client'); }
async function loadVehicles(){
  const payload = await apiGet('vehicles/');
  let data = rows(payload);
  const q = (byId('vehicleSearch')?.value || '').toLowerCase();
  if(q) data = data.filter(v => `${v.vehicle_number} ${v.client_name||''} ${v.vehicle_name||''} ${v.vehicle_type||''}`.toLowerCase().includes(q));
  if(!data.length) return showEmpty('vehiclesBody', 6);
  vehiclesBody.innerHTML = data.map(v => `<tr><td><b>${v.vehicle_number}</b></td><td>${v.client_name||'-'}</td><td>${v.vehicle_name||'-'}</td><td>${v.vehicle_type||'-'}</td><td>${v.fuel_type||'-'}</td><td>${deleteButton('vehicles/', v.id, 'loadVehicles')}</td></tr>`).join('');
}
async function openVehicleModal(){ resetForm('vehicleForm'); await loadVehicleClients(); openModal('vehicleModal'); }
async function saveVehicle(e){
  e.preventDefault();
  await apiPost('vehicles/', { client:formValue('vehicleClient'), vehicle_number:formValue('vehicleNumber').toUpperCase(), vehicle_name:formValue('vehicleName'), vehicle_type:formValue('vehicleType') || null, fuel_type:formValue('fuelType') || null });
  closeModal('vehicleModal'); await loadVehicles();
}
document.addEventListener('DOMContentLoaded', loadVehicles);
