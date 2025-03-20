import { useUserStore } from '@/store';

export function logout() {
  localStorage.removeItem('token');
}

export function setLocalToken(token: string) {
  localStorage.setItem('token', token);
}

export function isVisitor() {
  return useUserStore().user?.role === -1;
}
