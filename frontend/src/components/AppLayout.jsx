import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      setUser(u);
      setRole(u?.role || localStorage.getItem('role') || '');
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Equipment', icon: '🔧', path: '/equipment' },
    { label: 'Requests', icon: '📋', path: '/requests' },
    { label: 'Kanban Board', icon: '📌', path: '/requests/kanban' },
    { label: 'Calendar', icon: '📅', path: '/calendar' },
    { label: 'Teams', icon: '👥', path: '/teams' },
    { label: 'Users', icon: '👤', path: '/users' },
    { label: 'Reports', icon: '📊', path: '/reports' },
  ];

  const isItemActive = (itemPath) => {
    const current = location.pathname;
    if (itemPath === '/dashboard') return current === '/dashboard';
    if (itemPath === '/requests/kanban') return current === '/requests/kanban';
    if (itemPath === '/requests') return current.startsWith('/requests') && current !== '/requests/kanban';
    return current.startsWith(itemPath);
  };

  const visibleNavItems = navItems.filter(item => {
    if (item.path === '/equipment' || item.path === '/teams' || item.path === '/users' || item.path === '/requests/kanban') {
      return role === 'Admin' || role === 'Manager';
    }
    if (item.path === '/reports') {
      return role === 'Admin';
    }
    return true;
  });

  return (
    <>
      <style>{`
        .app-layout-root {
          display: flex;
          min-height: 100vh;
          background: #f5f4f0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .app-sidebar {
          width: 248px;
          background: #1c1a17;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 999;
          box-shadow: 2px 0 12px rgba(0,0,0,0.18);
          user-select: none;
        }

        .app-logo {
          padding: 24px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .app-logo-icon {
          width: 36px;
          height: 36px;
          background: #c8873a;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(200,135,58,0.35);
        }
        .app-logo-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.3px;
        }
        .app-logo-text span {
          color: #c8873a;
        }
        .app-logo-sub {
          font-size: 10px;
          color: #7a7570;
          letter-spacing: 0.5px;
          margin-top: 1px;
        }

        .app-nav {
          flex: 1;
          padding: 14px 0;
          overflow-y: auto;
        }
        .app-nav::-webkit-scrollbar {
          width: 4px;
        }
        .app-nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .app-nav-section {
          padding: 12px 20px 6px;
          font-size: 10px;
          font-weight: 700;
          color: #5a554e;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .app-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 20px;
          cursor: pointer;
          transition: all 0.15s ease;
          border-left: 3px solid transparent;
          font-size: 13.5px;
          font-weight: 500;
          color: #9a9590;
        }
        .app-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: #fff;
          border-left-color: rgba(200,135,58,0.4);
        }
        .app-nav-item.active {
          background: rgba(200,135,58,0.12);
          color: #fff;
          font-weight: 600;
          border-left-color: #c8873a;
        }
        .app-nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .app-sidebar-footer {
          padding: 16px 18px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: #181614;
        }
        .app-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .app-avatar {
          width: 34px;
          height: 34px;
          background: #c8873a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .app-user-info {
          overflow: hidden;
        }
        .app-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .app-user-role {
          font-size: 11px;
          color: #7a7570;
        }

        .app-logout {
          width: 100%;
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #8a8580;
          font-size: 12.5px;
          font-weight: 600;
          padding: 9px 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .app-logout:hover {
          background: rgba(192,57,43,0.12);
          border-color: rgba(192,57,43,0.35);
          color: #e74c3c;
        }

        .app-main-content {
          margin-left: 248px;
          flex: 1;
          min-width: 0;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .app-sidebar {
            display: none;
          }
          .app-main-content {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="app-layout-root">
        <aside className="app-sidebar">
          <div className="app-logo" onClick={() => navigate('/dashboard')}>
            <div className="app-logo-icon">⚙️</div>
            <div>
              <div className="app-logo-text">Gear<span>Guard</span></div>
              <div className="app-logo-sub">Maintenance Tracker</div>
            </div>
          </div>

          <nav className="app-nav">
            <div className="app-nav-section">Main Menu</div>
            {visibleNavItems.map(item => (
              <div
                key={item.path}
                className={`app-nav-item ${isItemActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="app-nav-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>

          <div className="app-sidebar-footer">
            <div className="app-user-row">
              <div className="app-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div className="app-user-info">
                <div className="app-user-name">{user?.fullName || 'User'}</div>
                <div className="app-user-role">{role || 'Member'}</div>
              </div>
            </div>
            <button className="app-logout" onClick={handleLogout}>
              <span>↩</span> Sign Out
            </button>
          </div>
        </aside>

        <div className="app-main-content">
          {children}
        </div>
      </div>
    </>
  );
}
