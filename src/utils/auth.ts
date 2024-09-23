export function logout() {
  localStorage.removeItem('token');
}

export function setLocalToken(token: string) {
  localStorage.setItem('token', token);
}
