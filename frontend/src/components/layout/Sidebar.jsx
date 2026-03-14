import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Building2, CalendarCheck, 
  MessageSquare, Settings, LogOut, CheckSquare
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Listings', path: '/listings', icon: Building2 },
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { name: 'Roommate Matches', path: '/matches', icon: CheckSquare },
    { name: 'Complaints', path: '/complaints', icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login', { replace: true });
  };

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-wider">MOV STAY ADMIN</h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center px-3 py-2 w-full text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center px-3 py-2 w-full mt-1 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
