async function loadDashboard(){
  const d = await apiGet('dashboard/'); if(!d) return; const x=d.data;
  setText('totalClients', x.total_clients); setText('totalVehicles', x.total_vehicles); setText('activeInsurance', x.active_insurance); setText('monthlyRevenue', rupee(x.monthly_revenue));
  let data = x.expiring_documents || [];
  const q = (byId('dashSearch')?.value || '').toLowerCase();
  if(q) data = data.filter(r => `${r.vehicle_number} ${r.client_name} ${r.doc_type}`.toLowerCase().includes(q));
  if(!data.length) return showEmpty('expiringBody', 5, 'No expiring documents in next 30 days');
  expiringBody.innerHTML = data.map(r => `<tr><td><b>${r.vehicle_number}</b></td><td>${r.client_name}</td><td>${r.doc_type}</td><td>${statusBadge(r.status)}</td><td>${formatDate(r.end_date)}</td></tr>`).join('');
}
document.addEventListener('DOMContentLoaded', loadDashboard);
