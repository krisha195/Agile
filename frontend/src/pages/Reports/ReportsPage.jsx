import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../../services/requestService';
import equipmentService from '../../services/equipmentService';
import teamService from '../../services/teamService';

export default function ReportsPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Equipment', icon: '🔧', path: '/equipment' },
    { label: 'Requests', icon: '📋', path: '/requests' },
    { label: 'Teams', icon: '👥', path: '/teams' },
    { label: 'Users', icon: '👤', path: '/users' },
    { label: 'Calendar', icon: '📅', path: '/calendar' },
    { label: 'Reports', icon: '📊', path: '/reports' },
  ];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [rRes, eRes, tRes] = await Promise.all([
        requestService.getAllRequests(),
        equipmentService.getAllEquipment(),
        teamService.getAllTeams(),
      ]);
      const rRaw = rRes?.data ?? rRes;
      setRequests(Array.isArray(rRaw) ? rRaw : (rRaw?.data || []));
      setEquipment(eRes.data || []);
      setTeams(tRes.data || []);
    } catch { }
    setLoading(false);
  };

  const byStatus = (s) => requests.filter(r => r.status === s).length;
  const byType = (t) => requests.filter(r => r.requestType === t).length;
  const byPriority = (p) => requests.filter(r => r.priority === p).length;
  const avgResolution = () => {
    const done = requests.filter(r => r.status === 'Repaired' && r.createdAt && r.completedDate);
    if (!done.length) return '—';
    const avg = done.reduce((sum, r) => sum + (new Date(r.completedDate) - new Date(r.createdAt)), 0) / done.length;
    return Math.round(avg / (1000 * 60 * 60 * 24)) + ' days';
  };

  const requestsByTeam = teams.map(t => ({
    name: t.teamName,
    count: requests.filter(r => r.teamId?._id === t._id || r.teamId === t._id).length,
  }));
  const maxTeamCount = Math.max(...requestsByTeam.map(t => t.count), 1);

  const statusList = [
    { label: 'New', color: '#2563a8' },
    { label: 'Assigned', color: '#b07d1a' },
    { label: 'In Progress', color: '#6d3fa0' },
    { label: 'Repaired', color: '#2d7a4f' },
    { label: 'Scrapped', color: '#c0392b' },
  ];

  return (
    <>
      <style>{`
        .rp-root { display: flex; min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; }
        .rp-sidebar { width: 248px; background: #1c1a17; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; box-shadow: 2px 0 12px rgba(0,0,0,0.12); }
        .rp-logo { padding: 24px 22px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
        .rp-logo-icon { width: 34px; height: 34px; background: #c8873a; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .rp-logo-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 800; color: #fff; }
        .rp-logo-text span { color: #c8873a; }
        .rp-logo-sub { font-size: 10px; color: #5a5650; letter-spacing: 0.5px; margin-top: 1px; }
        .rp-nav { flex: 1; padding: 12px 0; overflow-y: auto; }
        .rp-nav-section { padding: 14px 18px 6px; font-size: 10px; font-weight: 600; color: #4a4640; letter-spacing: 1px; text-transform: uppercase; }
        .rp-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 18px; cursor: pointer; transition: background 0.15s, color 0.15s; border-left: 3px solid transparent; font-size: 13.5px; font-weight: 500; color: #8a8680; margin: 1px 0; }
        .rp-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; border-left-color: rgba(200,135,58,0.4); }
        .rp-nav-item.active { background: rgba(200,135,58,0.12); color: #fff; border-left-color: #c8873a; }
        .rp-nav-icon { font-size: 15px; width: 18px; text-align: center; }
        .rp-sidebar-footer { padding: 16px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
        .rp-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 10px; }
        .rp-avatar { width: 34px; height: 34px; background: #c8873a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .rp-user-name { font-size: 13px; font-weight: 600; color: #fff; }
        .rp-user-role { font-size: 11px; color: #5a5650; }
        .rp-logout { width: 100%; background: none; border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; color: #8a8680; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 9px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .rp-logout:hover { border-color: #c0392b; color: #c0392b; background: rgba(192,57,43,0.06); }

        .rp-main { margin-left: 0; flex: 1; padding: 36px 40px; }
        .rp-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .rp-page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a1814; letter-spacing: -0.4px; }
        .rp-page-title span { color: #c8873a; }
        .rp-date { font-size: 13px; color: #9a9590; margin-top: 3px; }

        .rp-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .rp-summary-card { background: #fff; border-radius: 12px; border: 1px solid #e2dfd9; border-top: 3px solid var(--sc); padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .rp-summary-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 38px; font-weight: 800; color: #1a1814; margin-bottom: 4px; }
        .rp-summary-label { font-size: 12px; font-weight: 600; color: #9a9590; text-transform: uppercase; letter-spacing: 0.5px; }

        .rp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .rp-card { background: #fff; border-radius: 12px; border: 1px solid #e2dfd9; box-shadow: 0 1px 4px rgba(0,0,0,0.05); overflow: hidden; }
        .rp-card-header { padding: 18px 22px; border-bottom: 1px solid #f0ede8; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a1814; }
        .rp-card-body { padding: 20px 22px; }
        .rp-stat-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .rp-stat-row:last-child { margin-bottom: 0; }
        .rp-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--dc); flex-shrink: 0; }
        .rp-stat-label { font-size: 13px; color: #5a5650; width: 100px; flex-shrink: 0; }
        .rp-bar-wrap { flex: 1; height: 6px; background: #f0ede8; border-radius: 3px; overflow: hidden; }
        .rp-bar { height: 100%; background: var(--dc); border-radius: 3px; width: var(--bw); transition: width 0.5s ease; }
        .rp-stat-count { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #1a1814; min-width: 28px; text-align: right; }

        .rp-loading { display: flex; align-items: center; justify-content: center; height: 300px; color: #9a9590; font-size: 14px; gap: 10px; }
        .rp-spinner { width: 20px; height: 20px; border: 2px solid #e2dfd9; border-top-color: #c8873a; border-radius: 50%; animation: rpSpin 0.7s linear infinite; }
        @keyframes rpSpin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) { .rp-summary-grid { grid-template-columns: repeat(2, 1fr); } .rp-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .rp-sidebar { display: none; } .rp-main { margin-left: 0; padding: 20px; } }
      `}</style>

      <div className="rp-root">
        <main className="rp-main">
          <div className="rp-topbar">
            <div>
              <div className="rp-page-title">Reports & <span>Analytics</span></div>
              <div className="rp-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          {loading ? (
            <div className="rp-loading"><div className="rp-spinner" /> Loading reports...</div>
          ) : (
            <>
              <div className="rp-summary-grid">
                {[
                  { label: 'Total Equipment', val: equipment.length, color: '#2563a8' },
                  { label: 'Total Requests', val: requests.length, color: '#c8873a' },
                  { label: 'Total Teams', val: teams.length, color: '#2d7a4f' },
                  { label: 'Avg Resolution', val: avgResolution(), color: '#6d3fa0' },
                ].map(s => (
                  <div key={s.label} className="rp-summary-card" style={{ '--sc': s.color }}>
                    <div className="rp-summary-val">{s.val}</div>
                    <div className="rp-summary-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rp-grid">
                <div className="rp-card">
                  <div className="rp-card-header">📊 Requests by Status</div>
                  <div className="rp-card-body">
                    {statusList.map(s => {
                      const count = byStatus(s.label);
                      const pct = requests.length ? Math.round((count / requests.length) * 100) : 0;
                      return (
                        <div key={s.label} className="rp-stat-row">
                          <div className="rp-dot" style={{ '--dc': s.color }} />
                          <div className="rp-stat-label">{s.label}</div>
                          <div className="rp-bar-wrap"><div className="rp-bar" style={{ '--dc': s.color, '--bw': `${pct}%` }} /></div>
                          <div className="rp-stat-count">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rp-card">
                  <div className="rp-card-header">🎯 Requests by Priority</div>
                  <div className="rp-card-body">
                    {[{ label: 'Critical', color: '#c0392b' }, { label: 'High', color: '#b07d1a' }, { label: 'Medium', color: '#2563a8' }, { label: 'Low', color: '#2d7a4f' }].map(p => {
                      const count = byPriority(p.label);
                      const pct = requests.length ? Math.round((count / requests.length) * 100) : 0;
                      return (
                        <div key={p.label} className="rp-stat-row">
                          <div className="rp-dot" style={{ '--dc': p.color }} />
                          <div className="rp-stat-label">{p.label}</div>
                          <div className="rp-bar-wrap"><div className="rp-bar" style={{ '--dc': p.color, '--bw': `${pct}%` }} /></div>
                          <div className="rp-stat-count">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rp-card">
                  <div className="rp-card-header">🔀 Requests by Type</div>
                  <div className="rp-card-body">
                    {[{ label: 'Corrective', color: '#c0392b' }, { label: 'Preventive', color: '#2563a8' }].map(t => {
                      const count = byType(t.label);
                      const pct = requests.length ? Math.round((count / requests.length) * 100) : 0;
                      return (
                        <div key={t.label} className="rp-stat-row">
                          <div className="rp-dot" style={{ '--dc': t.color }} />
                          <div className="rp-stat-label">{t.label}</div>
                          <div className="rp-bar-wrap"><div className="rp-bar" style={{ '--dc': t.color, '--bw': `${pct}%` }} /></div>
                          <div className="rp-stat-count">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rp-card">
                  <div className="rp-card-header">👥 Requests by Team</div>
                  <div className="rp-card-body">
                    {requestsByTeam.length === 0 ? (
                      <div style={{ color: '#9a9590', fontSize: 13 }}>No teams found</div>
                    ) : requestsByTeam.map(t => {
                      const pct = Math.round((t.count / maxTeamCount) * 100);
                      return (
                        <div key={t.name} className="rp-stat-row">
                          <div className="rp-dot" style={{ '--dc': '#c8873a' }} />
                          <div className="rp-stat-label" style={{ width: 120 }}>{t.name}</div>
                          <div className="rp-bar-wrap"><div className="rp-bar" style={{ '--dc': '#c8873a', '--bw': `${pct}%` }} /></div>
                          <div className="rp-stat-count">{t.count}</div>
                        </div>
                      );
                    })}
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
