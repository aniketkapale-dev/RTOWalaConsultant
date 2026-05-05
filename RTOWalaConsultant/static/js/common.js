const API = '/api/';

function token(){ return localStorage.getItem('accessToken'); }
function authHeaders(json=true){
  const h = {};
  if(json) h['Content-Type'] = 'application/json';
  if(token()) h.Authorization = 'Bearer ' + token();
  return h;
}
async function apiRequest(path, options={}){
  const res = await fetch(API + path, { headers: authHeaders(options.body !== undefined), ...options });
  if(res.status === 401){ localStorage.clear(); location.href = '/'; return null; }
  let data = null;
  try { data = await res.json(); } catch(e) {}
  if(!res.ok){ alert(data?.message || data?.detail || 'Request failed'); throw data || res; }
  return data;
}
const apiGet = path => apiRequest(path, { method:'GET', headers:authHeaders(false) });
const apiPost = (path,data) => apiRequest(path, { method:'POST', body:JSON.stringify(data) });
const apiPatch = (path,data) => apiRequest(path, { method:'PATCH', body:JSON.stringify(data) });
const apiDelete = path => apiRequest(path, { method:'DELETE', headers:authHeaders(false) });
function rows(payload){ return payload?.data?.results || payload?.data || payload?.results || payload || []; }
function byId(id){ return document.getElementById(id); }
function setText(id, val){ const el=byId(id); if(el) el.innerText = val ?? '-'; }
function formValue(id){ return byId(id)?.value?.trim() || ''; }
function openModal(id){ byId(id)?.classList.add('show'); }
function closeModal(id){ byId(id)?.classList.remove('show'); }
function resetForm(id){ const f=byId(id); if(f) f.reset(); }
function formatDate(v){ return v ? new Date(v).toLocaleDateString('en-IN') : '-'; }
function statusBadge(status){ return `<span class="status status-${String(status||'active').toLowerCase()}">${status || 'active'}</span>`; }
function rupee(v){ return '₹' + Number(v || 0).toLocaleString('en-IN'); }
function logout(){ localStorage.clear(); location.href='/'; }
function showEmpty(tbodyId, cols, text='No records found'){
  const el=byId(tbodyId); if(el) el.innerHTML = `<tr><td colspan="${cols}" class="empty-cell">${text}</td></tr>`;
}
async function deleteRecord(endpoint, id, reloadFn){
  if(!confirm('Delete this record?')) return;
  try { await apiDelete(`${endpoint}${id}/`); if(window[reloadFn]) window[reloadFn](); }
  catch(e) { /* handled */ }
}
function deleteButton(endpoint,id,reloadFn){ return `<button class="icon-btn danger" onclick="deleteRecord('${endpoint}',${id},'${reloadFn}')">Delete</button>`; }
async function fillSelect(selectId, endpoint, labelFn, valueFn=x=>x.id, placeholder='Select'){
  const el=byId(selectId); if(!el) return [];
  const data=rows(await apiGet(endpoint));
  el.innerHTML = `<option value="">${placeholder}</option>` + data.map(x=>`<option value="${valueFn(x)}">${labelFn(x)}</option>`).join('');
  return data;
}
function bindModalClose(){
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.close)));
  document.querySelectorAll('.modal-backdrop').forEach(m => m.addEventListener('click', e => { if(e.target === m) closeModal(m.id); }));
}
document.addEventListener('DOMContentLoaded', bindModalClose);
