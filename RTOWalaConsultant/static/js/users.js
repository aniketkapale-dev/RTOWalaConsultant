const usersPaginationState = { currentPage: 1, totalPages: 0, count: 0, next: null, previous: null };

async function initUsers(){ await fillSelect('uRole','roles/', r => r.role_name, x => x.id, 'Select role'); await loadUsers(); }

async function loadUsers(page) {
  const pageNumber = Number(page) || usersPaginationState.currentPage || 1;
  usersPaginationState.currentPage = pageNumber;

  const endpoint = buildPaginationUrl('users/', { page: usersPaginationState.currentPage });
  const payload = await apiGetPaginated(endpoint);
  updatePaginationState(usersPaginationState, payload);

  let data = getPaginatedResults(payload);
  if (!data.length && usersPaginationState.currentPage > 1 && usersPaginationState.totalPages) {
    usersPaginationState.currentPage = Math.max(1, usersPaginationState.totalPages);
    return await loadUsers(usersPaginationState.currentPage);
  }

  if (!data.length) {
    showEmpty('usersBody', 5);
    renderPagination('usersPagination', usersPaginationState, { onPageChange: loadUsers });
    return;
  }

  const body = byId('usersBody');
  body.innerHTML = data.map(u => `<tr><td><b>${u.username}</b></td><td>${u.name||'-'}</td><td>${u.mobile_number||'-'}</td><td>${u.email||'-'}</td><td>${u.role_name||'-'}</td></tr>`).join('');
  renderPagination('usersPagination', usersPaginationState, { onPageChange: loadUsers });
}

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
