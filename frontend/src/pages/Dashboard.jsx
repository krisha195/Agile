import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import equipmentService from '../services/equipmentService';
import teamService from '../services/teamService';
import requestService from '../services/requestService';

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEquipment: 0, activeRequests: 0, teams: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({ New: 0, Assigned: 0, 'In Progress': 0, Repaired: 0, Scrapped: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [equipmentRes, teamsRes, requestsRes] = await Promise.all([
        equipmentService.getAllEquipment(),
        teamService.getAllTeams(),
        requestService.getAllRequests(),
      ]);
      const equipment = Array.isArray(equipmentRes?.data) ? equipmentRes.data : (equipmentRes?.data?.data || []);
      const teams = Array.isArray(teamsRes?.data) ? teamsRes.data : (teamsRes?.data?.data || []);
      const requestsRaw = requestsRes?.data ?? requestsRes;
      const requests = Array.isArray(requestsRaw) ? requestsRaw : (requestsRaw?.data || []);

      setRecentRequests([...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      const activeRequests = requests.filter(r => !['Repaired', 'Scrapped'].includes(r.status)).length;
      const now = new Date();
      const completedThisMonth = requests.filter(r => {
        if (r.status !== 'Repaired') return false;
        const d = new Date(r.updatedAt || r.completedDate || r.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;
      const counts = { New: 0, Assigned: 0, 'In Progress': 0, Repaired: 0, Scrapped: 0 };
      requests.forEach(r => { if (counts[r.status] !== undefined) counts[r.status] += 1; });
      setStatusCounts(counts);
      setStats({ totalEquipment: equipment.length, teams: teams.length, activeRequests, completed: completedThisMonth });
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const statCards = [
    { label: 'Total Equipment', value: stats.totalEquipment, sub: 'Registered assets', icon: '🔧', color: '#2563a8', bg: '#dbeafe', path: '/equipment' },
    { label: 'Active Requests', value: stats.activeRequests, sub: 'In progress', icon: '⚡', color: '#b07d1a', bg: '#fef3c7', path: '/requests' },
    { label: 'Teams', value: stats.teams, sub: 'Available', icon: '👥', color: '#2d7a4f', bg: '#d4eddf', path: '/teams' },
    { label: 'Completed', value: stats.completed, sub: 'This month', icon: '✅', color: '#6d3fa0', bg: '#ede9f8', path: '/requests' },
  ];

  const navItems = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Equipment', icon: '🔧', path: '/equipment' },
    { label: 'Requests', icon: '📋', path: '/requests' },
    { label: 'Teams', icon: '👥', path: '/teams' },
    { label: 'Users', icon: '👤', path: '/users' },
    { label: 'Calendar', icon: '📅', path: '/calendar' },
    { label: 'Reports', icon: '📊', path: '/reports' },
  ];

  const statusConfig = [
    { label: 'New', color: '#2563a8', bg: '#dbeafe' },
    { label: 'Assigned', color: '#b07d1a', bg: '#fef3c7' },
    { label: 'In Progress', color: '#6d3fa0', bg: '#ede9f8' },
    { label: 'Repaired', color: '#2d7a4f', bg: '#d4eddf' },
    { label: 'Scrapped', color: '#c0392b', bg: '#fde8e6' },
  ];

  const totalRequests = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <>
      <style>{`
        .db-root { display: flex; min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; }

        /* SIDEBAR */
        .db-sidebar {
          width: 248px;
          background: #1c1a17;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          z-index: 100;
          box-shadow: 2px 0 12px rgba(0,0,0,0.12);
        }
        .db-logo {
          padding: 24px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .db-logo-icon {
          width: 34px; height: 34px;
          background: #c8873a;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .db-logo-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px; font-weight: 800;
          color: #fff; letter-spacing: -0.3px;
        }
        .db-logo-text span { color: #c8873a; }
        .db-logo-sub { font-size: 10px; color: #5a5650; letter-spacing: 0.5px; margin-top: 1px; }

        .db-nav { flex: 1; padding: 12px 0; overflow-y: auto; }
        .db-nav-section { padding: 14px 18px 6px; font-size: 10px; font-weight: 600; color: #4a4640; letter-spacing: 1px; text-transform: uppercase; }
        .db-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          border-left: 3px solid transparent;
          font-size: 13.5px; font-weight: 500;
          color: #8a8680;
          text-decoration: none;
          border-radius: 0;
          margin: 1px 0;
        }
        .db-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; border-left-color: rgba(200,135,58,0.4); }
        .db-nav-item.active { background: rgba(200,135,58,0.12); color: #fff; border-left-color: #c8873a; }
        .db-nav-icon { font-size: 15px; width: 18px; text-align: center; }

        .db-sidebar-footer {
          padding: 16px 18px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .db-user-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .db-avatar {
          width: 34px; height: 34px;
          background: #c8873a;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700;
          color: #fff; flex-shrink: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .db-user-name { font-size: 13px; font-weight: 600; color: #fff; }
        .db-user-role { font-size: 11px; color: #5a5650; }
        .db-logout {
          width: 100%;
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          color: #8a8680;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          padding: 9px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .db-logout:hover { border-color: #c0392b; color: #c0392b; background: rgba(192,57,43,0.06); }

        /* MAIN */
        .db-main { margin-left: 248px; flex: 1; padding: 36px 40px; min-height: 100vh; }

        .db-topbar {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 32px;
        }
        .db-page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.5px;
        }
        .db-page-title span { color: #c8873a; }
        .db-date { font-size: 13px; color: #9a9590; margin-top: 3px; }
        .db-new-btn {
          background: #c8873a;
          border: none; border-radius: 8px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 11px 22px;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
          white-space: nowrap;
        }
        .db-new-btn:hover { background: #a06828; box-shadow: 0 4px 14px rgba(200,135,58,0.35); }

        /* STAT CARDS */
        .db-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .db-stat-card {
          background: #fff;
          border-radius: 12px;
          padding: 22px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #e2dfd9;
        }
        .db-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
        .db-stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .db-stat-label { font-size: 12px; font-weight: 600; color: #9a9590; letter-spacing: 0.2px; }
        .db-stat-icon-wrap {
          width: 36px; height: 36px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
        }
        .db-stat-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 40px; font-weight: 800;
          color: #1a1814; line-height: 1;
          margin-bottom: 6px;
        }
        .db-stat-sub { font-size: 12px; font-weight: 500; }

        /* BOTTOM GRID */
        .db-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .db-section {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .db-section-head {
          padding: 18px 22px;
          border-bottom: 1px solid #f0ede8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #1a1814;
          display: flex; align-items: center; gap: 8px;
        }
        .db-section-body { padding: 18px 22px; }

        /* RECENT REQUESTS */
        .db-req-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
          margin-bottom: 6px;
          border: 1px solid #f0ede8;
        }
        .db-req-item:last-child { margin-bottom: 0; }
        .db-req-item:hover { background: #f9f8f6; }
        .db-req-subject {
          font-size: 13.5px; font-weight: 600;
          color: #1a1814;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 200px;
        }
        .db-req-meta { font-size: 11.5px; color: #9a9590; margin-top: 2px; }
        .db-req-badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          white-space: nowrap; flex-shrink: 0;
        }

        /* STATUS BARS */
        .db-status-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .db-status-row:last-child { margin-bottom: 0; }
        .db-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .db-status-name { font-size: 13px; color: #5a5650; width: 90px; flex-shrink: 0; }
        .db-status-bar-bg { flex: 1; height: 6px; background: #f0ede8; border-radius: 3px; overflow: hidden; }
        .db-status-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
        .db-status-count { font-size: 13px; font-weight: 700; color: #1a1814; width: 24px; text-align: right; flex-shrink: 0; }

        .db-loading {
          display: flex; align-items: center; justify-content: center;
          height: 200px; color: #9a9590; font-size: 15px;
          gap: 10px;
        }
        .db-spinner {
          width: 20px; height: 20px;
          border: 2px solid #e2dfd9;
          border-top-color: #c8873a;
          border-radius: 50%;
          animation: dbSpin 0.7s linear infinite;
        }
        @keyframes dbSpin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) { .db-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 900px) { .db-bottom-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) {
          .db-sidebar { display: none; }
          .db-main { margin-left: 0; padding: 20px; }
          .db-stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="db-root">
        {/* SIDEBAR */}
        <aside className="db-sidebar">
          <div className="db-logo">
            <div className="db-logo-icon">⚙️</div>
            <div>
              <div className="db-logo-text">Gear<span>Guard</span></div>
              <div className="db-logo-sub">Maintenance Tracker</div>
            </div>
          </div>

          <nav className="db-nav">
            <div className="db-nav-section">Main Menu</div>
            {navItems
              .filter(item => {
                if (item.path === '/equipment' || item.path === '/teams' || item.path === '/users') return role === 'Admin' || role === 'Manager';
                if (item.path === '/reports') return role === 'Admin';
                return true;
              })
              .map(item => (
                <div
                  key={item.path}
                  className={`db-nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="db-nav-icon">{item.icon}</span>
                  {item.label}
                </div>
              ))}
          </nav>

          <div className="db-sidebar-footer">
            <div className="db-user-row">
              <div className="db-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div>
                <div className="db-user-name">{user?.fullName || 'User'}</div>
                <div className="db-user-role">{user?.role || 'Member'}</div>
              </div>
            </div>
            <button className="db-logout" onClick={handleLogout}>
              <span>↩</span> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="db-main">
          <div className="db-topbar">
            <div>
              <h1 className="db-page-title">Welcome, <span>{user?.fullName?.split(' ')[0] || 'there'}</span> </h1>
              <div className="db-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <button className="db-new-btn" onClick={() => navigate('/requests/new')}>+ New Request</button>
          </div>

          {loading ? (
            <div className="db-loading">
              <div className="db-spinner" />
              Loading dashboard...
            </div>
          ) : (
            <>
              <div className="db-stats-grid">
                {statCards.map(card => (
                  <div key={card.label} className="db-stat-card" onClick={() => navigate(card.path)}>
                    <div className="db-stat-top">
                      <div className="db-stat-label">{card.label}</div>
                      <div className="db-stat-icon-wrap" style={{ background: card.bg }}>
                        {card.icon}
                      </div>
                    </div>
                    <div className="db-stat-value">{card.value}</div>
                    <div className="db-stat-sub" style={{ color: card.color }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              <div className="db-bottom-grid">
                {/* Recent Requests */}
                <div className="db-section">
                  <div className="db-section-head">🕒 Recent Requests</div>
                  <div className="db-section-body">
                    {recentRequests.length === 0 ? (
                      <div style={{ color: '#9a9590', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No requests yet.</div>
                    ) : (
                      recentRequests.map(r => {
                        const statusColors = { New: { color: '#2563a8', bg: '#dbeafe' }, Assigned: { color: '#b07d1a', bg: '#fef3c7' }, 'In Progress': { color: '#6d3fa0', bg: '#ede9f8' }, Repaired: { color: '#2d7a4f', bg: '#d4eddf' }, Scrapped: { color: '#c0392b', bg: '#fde8e6' } };
                        const sc = statusColors[r.status] || { color: '#5a5650', bg: '#f0ede8' };
                        return (
                          <div key={r._id} className="db-req-item" onClick={() => navigate(`/requests/${r._id}`)}>
                            <div style={{ minWidth: 0 }}>
                              <div className="db-req-subject">{r.subject || 'Untitled'}</div>
                              <div className="db-req-meta">
                                {r.equipmentId?.equipmentName ? `${r.equipmentId.equipmentName} · ` : ''}
                                {new Date(r.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span className="db-req-badge" style={{ color: sc.color, background: sc.bg }}>{r.status}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Status Overview */}
                <div className="db-section">
                  <div className="db-section-head">📊 Request Status Overview</div>
                  <div className="db-section-body">
                    {statusConfig.map(s => (
                      <div key={s.label} className="db-status-row">
                        <div className="db-status-dot" style={{ background: s.color }} />
                        <div className="db-status-name">{s.label}</div>
                        <div className="db-status-bar-bg">
                          <div
                            className="db-status-bar-fill"
                            style={{ width: `${(statusCounts[s.label] / totalRequests) * 100}%`, background: s.color }}
                          />
                        </div>
                        <div className="db-status-count">{statusCounts[s.label]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
