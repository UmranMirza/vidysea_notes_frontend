import UserDashboard from '../../components/dashboard/UserDashboard';
import { useAuthGuard } from '../../utils/auth';

export default function UserDashboardPage() {
  useAuthGuard('user');
  return <UserDashboard />;
}