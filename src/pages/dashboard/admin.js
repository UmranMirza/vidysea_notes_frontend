import AdminDashboard from '../../components/dashboard/AdminDashboard';
import { useAuthGuard } from '../../utils/auth';

export default function AdminDashboardPage() {
  useAuthGuard('admin');
  return <AdminDashboard />;
}