import React from 'react';
import { LayoutGrid, Calendar, Moon, LogOut, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col justify-between fixed left-0 top-0 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/today')}>
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Event Planner</span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Navigation</p>

          <button
            onClick={() => navigate('/all')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/all') ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <LayoutGrid size={20} />
            <span>All Tasks</span>
          </button>

          <button
            onClick={() => navigate('/today')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/today') ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <Calendar size={20} />
            <span>Today's Tasks</span>
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Moon size={20} />
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
