import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { LogOut, User, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className=" glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold gradient-text">CareerLink</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{user?.name}</span>
              <span className="px-2 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-400">
                {user?.role === 'admin' ? 'Poster' : 'Seeker'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

