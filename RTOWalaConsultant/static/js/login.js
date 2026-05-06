async function login(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  try {
    const res = await apiPost('auth/login/', {
      username: formValue('username'),
      password: formValue('password')
    }, {
      form: form,
      successMessage: 'Login successful. Redirecting...',
      redirectOnUnauthorized: false
    });

    if (res.access) {
      localStorage.setItem('accessToken', res.access);
      localStorage.setItem('refreshToken', res.refresh);
      window.setTimeout(() => location.href = '/dashboard/', 500);
    }
  } catch (error) {
    // Error handled by apiRequest
  }
}
