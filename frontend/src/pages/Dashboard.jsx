import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PosterDashboard from './PosterDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Route to appropriate dashboard based on user role
  if (user.role === 'admin' || user.role === 'poster') {
    return <PosterDashboard />;
  }

  return <EmployeeDashboard />;
};

export default Dashboard;
