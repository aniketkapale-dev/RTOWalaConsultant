const API = '/api/';

function token(){ return localStorage.getItem('accessToken'); }
function authHeaders(json=true){
  const h = {};
  if(json) h['Content-Type'] = 'application/json';
  if(token()) h.Authorization = 'Bearer ' + token();
  return h;
}   
async function apiRequest(path, options={}){
  const { skipLoader=false, successMessage='', errorMessage='', form=null, button=null, redirectOnUnauthorized=true, ...fetchOptions } = options;
  const loaderButton = button || form?.querySelector('button[type="submit"], button:not([type])');
  if(!skipLoader && window.showLoader) window.showLoader({ button: loaderButton });
  try {
    const res = await fetch(API + path, { headers: authHeaders(fetchOptions.body !== undefined), ...fetchOptions });
    let data = null;
    try { data = await res.json(); } catch(e) {}
    if(res.status === 401){
      localStorage.clear();
      if(window.showError) showError(errorMessage || 'Session expired. Please login again.');
      if(redirectOnUnauthorized) window.setTimeout(() => { location.href = '/'; }, 700);
      throw data || res;
    }
    if(!res.ok){
      const mapped = form && window.applyServerValidation ? applyServerValidation(form, data) : false;
      if(!mapped && window.showError) showError(errorMessage || apiErrorMessage(data));
      throw data || res;
    }
    if(successMessage && window.showSuccess) showSuccess(successMessage);
    return data;
  } catch(error) {
    if(error instanceof TypeError && window.showError) showError('Network error. Please check your connection.');
    throw error;
  } finally {
    if(!skipLoader && window.hideLoader) window.hideLoader({ button: loaderButton });
  }
}
function apiErrorMessage(data){
  if(!data) return 'Request failed';
  if(data.message) return data.message;
  if(data.detail) return data.detail;
  if(typeof data === 'string') return data;
  const firstKey = Object.keys(data)[0];
  const firstValue = firstKey ? data[firstKey] : null;
  return Array.isArray(firstValue) ? firstValue[0] : 'Request failed';
}
const apiGet = (path, options={}) => apiRequest(path, { method:'GET', headers:authHeaders(false), ...options });
const apiPost = (path,data,options={}) => apiRequest(path, { method:'POST', body:JSON.stringify(data), ...options });
const apiPatch = (path,data,options={}) => apiRequest(path, { method:'PATCH', body:JSON.stringify(data), ...options });
const apiDelete = (path, options={}) => apiRequest(path, { method:'DELETE', headers:authHeaders(false), ...options });
const apiGetPaginated = (path, options={}) => apiGet(path, options);
function getPaginatedResults(response){ return response?.data?.results || response?.results || []; }
function rows(payload){ return payload?.data?.results || payload?.data || payload?.results || payload || []; }
function byId(id){ return document.getElementById(id); }
function setText(id, val){ const el=byId(id); if(el) el.innerText = val ?? '-'; }
function formValue(id){ return byId(id)?.value?.trim() || ''; }
function openModal(id){ byId(id)?.classList.add('show'); if(window.refreshSelect2) window.refreshSelect2(byId(id)); }
function closeModal(id){ byId(id)?.classList.remove('show'); }
function resetForm(id){ const f=byId(id); if(f) { f.reset(); if(window.clearFormErrors) window.clearFormErrors(f); if(window.refreshSelect2) window.refreshSelect2(f); } }
function formatDate(v){ return v ? new Date(v).toLocaleDateString('en-IN') : '-'; }
function statusBadge(status){ return `<span class="status status-${String(status||'active').toLowerCase()}">${status || 'active'}</span>`; }
function rupee(v){ return '₹' + Number(v || 0).toLocaleString('en-IN'); }
function logout(){ localStorage.clear(); location.href='/'; }
function showEmpty(tbodyId, cols, text='No records found'){
  const el=byId(tbodyId); if(el) el.innerHTML = `<tr><td colspan="${cols}" class="empty-cell">${text}</td></tr>`;
}
async function deleteRecord(endpoint, id, reloadFn){
  if(!confirm('Delete this record?')) return;
  try { await apiDelete(`${endpoint}${id}/`, { successMessage:'Record deleted successfully.' }); if(window[reloadFn]) window[reloadFn](); }
  catch(e) { /* handled */ }
}
function deleteButton(endpoint,id,reloadFn){ return `<button class="icon-btn danger" onclick="deleteRecord('${endpoint}',${id},'${reloadFn}')">Delete</button>`; }
async function fillSelect(selectId, endpoint, labelFn, valueFn=x=>x.id, placeholder='Select'){
  const el=byId(selectId); if(!el) return [];
  const data=rows(await apiGet(endpoint));
  el.innerHTML = `<option value="">${placeholder}</option>` + data.map(x=>`<option value="${valueFn(x)}">${labelFn(x)}</option>`).join('');
  if(window.refreshSelect2) window.refreshSelect2(el);
  return data;
}
function bindModalClose() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      closeModal(modalId);
      // Cleanup validation errors on modal close
      const modal = byId(modalId);
      if (modal) {
        const form = modal.querySelector('form');
        if (form && window.clearFormErrors) window.clearFormErrors(form);
      }
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        closeModal(m.id);
        // Cleanup validation errors on backdrop click
        const modal = byId(m.id);
        if (modal) {
          const form = modal.querySelector('form');
          if (form && window.clearFormErrors) window.clearFormErrors(form);
        }
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', bindModalClose);
