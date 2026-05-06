async function initUsers(){ await fillSelect('uRole','roles/', r=>r.role_name, x=>x.id, 'Select role'); await loadUsers(); }
async function loadUsers(){ const d=await apiGet('users/'); const data=rows(d); if(!data.length) return showEmpty('usersBody',5); usersBody.innerHTML=data.map(u=>`<tr><td><b>${u.username}</b></td><td>${u.name||'-'}</td><td>${u.mobile_number||'-'}</td><td>${u.email||'-'}</td><td>${u.role_name||'-'}</td></tr>`).join(''); }
function openUserModal(){ resetForm('userForm'); openModal('userModal'); }
async function saveUser(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  try {
    await apiPost('users/', {
      username: formValue('uUsername'),
      name: formValue('uName'),
      mobile_number: formValue('uMobile'),
      email: formValue('uEmail') || null,
      password: formValue('uPassword'),
      role: formValue('uRole')
    }, {
      form: form,
      successMessage: 'User saved successfully.'
    });
    closeModal('userModal');
    await loadUsers();
  } catch (error) {
    // Error handled by apiRequest
  }
}
document.addEventListener('DOMContentLoaded', initUsers);
