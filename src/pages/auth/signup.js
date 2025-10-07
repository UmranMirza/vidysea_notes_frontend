import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SignupForm from '../../components/auth/SignupForm';
import UserDashboard from '../../components/dashboard/UserDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import { getToken, getUserRole, useAuthGuard } from '../../utils/auth';

export function AuthGuard({ children, requiredRole }) {
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

  return children;
}

export default function SignupPage() {
  return <SignupForm />;
}

export function UserDashboardPage() {
  return (
    <AuthGuard requiredRole="user">
      <UserDashboard />
    </AuthGuard>
  );
}

export function AdminDashboardPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboard />
    </AuthGuard>
  );
}