import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAuthGuard(requiredRole) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const role = getUserRole();
    if (!token) {
      router.replace('/auth/login');
    } else if (requiredRole && role !== requiredRole) {
      router.replace('/dashboard/user');
    }
  }, [router, requiredRole]);
}

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUserRole = () => {
  // Assuming role is stored in localStorage after login
  return localStorage.getItem('role');
};

export const isAuthenticated = () => {
  return !!getToken();
};