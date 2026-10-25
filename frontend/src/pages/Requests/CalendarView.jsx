import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../../services/requestService';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const statusColor = { New: '#2563a8', Assigned: '#b07d1a', 'In Progress': '#6d3fa0', Repaired: '#2d7a4f', Scrapped: '#c0392b' };
const priorityColor = { Critical: '#c0392b', High: '#b07d1a', Medium: '#2563a8', Low: '#2d7a4f' };

export default function CalendarView() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [current, setCurrent] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
  const [selected, setSelected] = useState(null);
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await requestService.getAllRequests();
      const raw = res?.data ?? res;
      const list = Array.isArray(raw) ? raw : (raw?.data || []);
      setRequests(list.filter(r => r.scheduledDate));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year, month) => new Date(year, month, 1).getDay();

  const getRequestsForDay = (day) => {
    const d = new Date(current.year, current.month, day);
    return requests.filter(r => {
      const rd = new Date(r.scheduledDate);
      return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth() && rd.getDate() === d.getDate();
    });
  };

  const prevMonth = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const nextMonth = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDay(current.year, current.month);
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day) => day && today.getDate() === day && today.getMonth() === current.month && today.getFullYear() === current.year;

  const upcoming = [...requests]
    .filter(r => new Date(r.scheduledDate) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 8);

  const navItems = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Equipment', icon: '🔧', path: '/equipment' },
    { label: 'Requests', icon: '📋', path: '/requests' },
    { label: 'Teams', icon: '👥', path: '/teams' },
    { label: 'Users', icon: '👤', path: '/users' },
    { label: 'Calendar', icon: '📅', path: '/calendar' },
    { label: 'Reports', icon: '📊', path: '/reports' },
  ];

  return (
    <>
      <style>{`
        .cv-root { display: flex; min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; }
        .cv-sidebar { width: 248px; background: #1c1a17; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; box-shadow: 2px 0 12px rgba(0,0,0,0.12); }
        .cv-logo { padding: 24px 22px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
        .cv-logo-icon { width: 34px; height: 34px; background: #c8873a; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .cv-logo-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 800; color: #fff; }
        .cv-logo-text span { color: #c8873a; }
        .cv-logo-sub { font-size: 10px; color: #5a5650; letter-spacing: 0.5px; margin-top: 1px; }
        .cv-nav { flex: 1; padding: 12px 0; overflow-y: auto; }
        .cv-nav-section { padding: 14px 18px 6px; font-size: 10px; font-weight: 600; color: #4a4640; letter-spacing: 1px; text-transform: uppercase; }
        .cv-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 18px; cursor: pointer; transition: background 0.15s, color 0.15s; border-left: 3px solid transparent; font-size: 13.5px; font-weight: 500; color: #8a8680; text-decoration: none; margin: 1px 0; }
        .cv-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; border-left-color: rgba(200,135,58,0.4); }
        .cv-nav-item.active { background: rgba(200,135,58,0.12); color: #fff; border-left-color: #c8873a; }
        .cv-nav-icon { font-size: 15px; width: 18px; text-align: center; }
        .cv-sidebar-footer { padding: 16px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
        .cv-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 10px; }
        .cv-avatar { width: 34px; height: 34px; background: #c8873a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .cv-user-name { font-size: 13px; font-weight: 600; color: #fff; }
        .cv-user-role { font-size: 11px; color: #5a5650; }
        .cv-logout { width: 100%; background: none; border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; color: #8a8680; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 9px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .cv-logout:hover { border-color: #c0392b; color: #c0392b; background: rgba(192,57,43,0.06); }

        .cv-main { margin-left: 0; flex: 1; padding: 36px 40px; }
        .cv-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .cv-page-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a1814; letter-spacing: -0.4px; }
        .cv-page-title span { color: #c8873a; }
        .cv-nav-btns { display: flex; align-items: center; gap: 10px; }
        .cv-month-nav { background: #fff; border: 1.5px solid #e2dfd9; border-radius: 8px; color: #5a5650; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; padding: 9px 16px; cursor: pointer; transition: all 0.2s; }
        .cv-month-nav:hover { border-color: #c8873a; color: #c8873a; }
        .cv-month-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 800; color: #1a1814; min-width: 200px; text-align: center; }
        .cv-new-btn { background: #c8873a; border: none; border-radius: 8px; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; padding: 10px 20px; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 8px rgba(200,135,58,0.28); }
        .cv-new-btn:hover { background: #a06828; }

        .cv-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }

        .cv-calendar { background: #fff; border-radius: 14px; border: 1px solid #e2dfd9; box-shadow: 0 1px 4px rgba(0,0,0,0.05); overflow: hidden; }
        .cv-cal-head { display: grid; grid-template-columns: repeat(7, 1fr); background: #faf9f7; border-bottom: 1px solid #e2dfd9; }
        .cv-day-name { padding: 12px 8px; text-align: center; font-size: 11px; font-weight: 700; color: #9a9590; letter-spacing: 0.5px; text-transform: uppercase; }
        .cv-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
        .cv-cell { min-height: 110px; border-right: 1px solid #f0ede8; border-bottom: 1px solid #f0ede8; padding: 8px; position: relative; cursor: pointer; transition: background 0.15s; }
        .cv-cell:nth-child(7n) { border-right: none; }
        .cv-cell:hover { background: #faf9f7; }
        .cv-cell.empty { background: #faf9f7; cursor: default; }
        .cv-cell.today { background: #fdf6ee; }
        .cv-cell.selected { background: #fdf6ee; outline: 2px solid #c8873a; outline-offset: -2px; }
        .cv-day-num { font-size: 13px; font-weight: 600; color: #5a5650; margin-bottom: 4px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .cv-cell.today .cv-day-num { background: #c8873a; color: #fff; font-weight: 800; }
        .cv-event { font-size: 10.5px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
        .cv-more { font-size: 10px; color: #9a9590; font-weight: 500; padding: 1px 4px; }

        .cv-sidebar-panel { display: flex; flex-direction: column; gap: 16px; }
        .cv-panel { background: #fff; border-radius: 14px; border: 1px solid #e2dfd9; box-shadow: 0 1px 4px rgba(0,0,0,0.05); overflow: hidden; }
        .cv-panel-head { padding: 16px 20px; border-bottom: 1px solid #f0ede8; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: #1a1814; display: flex; align-items: center; gap: 7px; }
        .cv-panel-body { padding: 14px 20px; }

        .cv-upcoming-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f4f0; cursor: pointer; transition: background 0.15s; border-radius: 6px; }
        .cv-upcoming-item:last-child { border-bottom: none; }
        .cv-upcoming-item:hover { background: #faf9f7; padding-left: 6px; }
        .cv-upcoming-date { flex-shrink: 0; width: 40px; height: 40px; background: #f5e6d3; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .cv-upcoming-day { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 800; color: #c8873a; line-height: 1; }
        .cv-upcoming-mon { font-size: 9px; font-weight: 600; color: #c8873a; text-transform: uppercase; letter-spacing: 0.5px; }
        .cv-upcoming-info { flex: 1; min-width: 0; }
        .cv-upcoming-subject { font-size: 12.5px; font-weight: 600; color: #1a1814; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
        .cv-upcoming-meta { font-size: 11px; color: #9a9590; }

        .cv-selected-list { display: flex; flex-direction: column; gap: 8px; }
        .cv-sel-item { background: #faf9f7; border: 1px solid #e2dfd9; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.15s; }
        .cv-sel-item:hover { border-color: #c8873a; background: #fdf6ee; }
        .cv-sel-subject { font-size: 13px; font-weight: 600; color: #1a1814; margin-bottom: 5px; }
        .cv-sel-badges { display: flex; gap: 5px; flex-wrap: wrap; }
        .cv-sel-badge { font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }

        .cv-loading { display: flex; align-items: center; justify-content: center; height: 300px; color: #9a9590; font-size: 14px; gap: 10px; }
        .cv-spinner { width: 20px; height: 20px; border: 2px solid #e2dfd9; border-top-color: #c8873a; border-radius: 50%; animation: cvSpin 0.7s linear infinite; }
        @keyframes cvSpin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) { .cv-layout { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .cv-sidebar { display: none; } .cv-main { margin-left: 0; padding: 20px; } }
      `}</style>

      <div className="cv-root">
        <main className="cv-main">
          <div className="cv-topbar">
            <div className="cv-page-title">Maintenance <span>Calendar</span></div>
            <div className="cv-nav-btns">
              <button className="cv-month-nav" onClick={prevMonth}>‹</button>
              <div className="cv-month-label">{MONTHS[current.month]} {current.year}</div>
              <button className="cv-month-nav" onClick={nextMonth}>›</button>
              <button className="cv-new-btn" onClick={() => navigate('/requests/new')}>+ New Request</button>
            </div>
          </div>

          {loading ? (
            <div className="cv-loading"><div className="cv-spinner" /> Loading calendar...</div>
          ) : (
            <div className="cv-layout">
              <div className="cv-calendar">
                <div className="cv-cal-head">
                  {DAYS.map(d => <div key={d} className="cv-day-name">{d}</div>)}
                </div>
                <div className="cv-cal-grid">
                  {cells.map((day, i) => {
                    const dayReqs = day ? getRequestsForDay(day) : [];
                    const isSelected = selected && selected.day === day && selected.month === current.month && selected.year === current.year;
                    return (
                      <div
                        key={i}
                        className={`cv-cell ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => day && setSelected(isSelected ? null : { day, month: current.month, year: current.year, reqs: dayReqs })}
                      >
                        {day && <div className="cv-day-num">{day}</div>}
                        {dayReqs.slice(0, 3).map(r => (
                          <div
                            key={r._id}
                            className="cv-event"
                            style={{ background: (statusColor[r.status] || '#5a5650') + '22', color: statusColor[r.status] || '#5a5650', border: `1px solid ${statusColor[r.status] || '#5a5650'}44` }}
                            onClick={e => { e.stopPropagation(); navigate(`/requests/${r._id}`); }}
                            title={r.subject}
                          >
                            {r.subject}
                          </div>
                        ))}
                        {dayReqs.length > 3 && <div className="cv-more">+{dayReqs.length - 3} more</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="cv-sidebar-panel">
                {selected && selected.reqs.length > 0 && (
                  <div className="cv-panel">
                    <div className="cv-panel-head">📅 {selected.day} {MONTHS[selected.month]}</div>
                    <div className="cv-panel-body">
                      <div className="cv-selected-list">
                        {selected.reqs.map(r => (
                          <div key={r._id} className="cv-sel-item" onClick={() => navigate(`/requests/${r._id}`)}>
                            <div className="cv-sel-subject">{r.subject}</div>
                            <div className="cv-sel-badges">
                              <span className="cv-sel-badge" style={{ background: (statusColor[r.status] || '#5a5650') + '22', color: statusColor[r.status] || '#5a5650' }}>{r.status}</span>
                              <span className="cv-sel-badge" style={{ background: (priorityColor[r.priority] || '#5a5650') + '22', color: priorityColor[r.priority] || '#5a5650' }}>{r.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="cv-panel">
                  <div className="cv-panel-head">⏰ Upcoming Scheduled</div>
                  <div className="cv-panel-body">
                    {upcoming.length === 0 ? (
                      <div style={{ color: '#9a9590', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No upcoming scheduled requests</div>
                    ) : upcoming.map(r => {
                      const d = new Date(r.scheduledDate);
                      return (
                        <div key={r._id} className="cv-upcoming-item" onClick={() => navigate(`/requests/${r._id}`)}>
                          <div className="cv-upcoming-date">
                            <div className="cv-upcoming-day">{d.getDate()}</div>
                            <div className="cv-upcoming-mon">{MONTHS[d.getMonth()].slice(0, 3)}</div>
                          </div>
                          <div className="cv-upcoming-info">
                            <div className="cv-upcoming-subject">{r.subject}</div>
                            <div className="cv-upcoming-meta">{r.equipmentId?.equipmentName || '—'} · <span style={{ color: statusColor[r.status] || '#9a9590', fontWeight: 600 }}>{r.status}</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="cv-panel">
                  <div className="cv-panel-head">🎨 Legend</div>
                  <div className="cv-panel-body">
                    {Object.entries(statusColor).map(([s, c]) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: '#5a5650', fontWeight: 500 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
