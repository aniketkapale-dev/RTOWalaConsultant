async function loadLogs(){ const d=await apiGet('error-logs/'); const data=rows(d); if(!data.length) return showEmpty('logsBody',4); logsBody.innerHTML=data.map(x=>`<tr><td>${x.msg||x.error_message||'-'}</td><td>${x.path||''}</td><td>${x.method||''}</td><td>${formatDate(x.created_at)}</td></tr>`).join(''); }
document.addEventListener('DOMContentLoaded', loadLogs);
