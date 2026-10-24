import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import requestService from '../../services/requestService';

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();
  const equipmentId = new URLSearchParams(location.search).get('equipmentId');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchRequests(); }, [equipmentId]);

  const fetchRequests = async () => {
    try {
      setLoading(true); setError('');
      const response = await requestService.getAllRequests(equipmentId ? { equipmentId } : {});
      const payload = response?.data ?? response;
      const list = payload?.data ?? payload;
      setRequests(Array.isArray(list) ? list : []);
    } catch { setError('Failed to load requests'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this request?')) {
      try { await requestService.deleteRequest(id); setRequests(requests.filter(r => r._id !== id)); }
      catch { setError('Failed to delete request'); }
    }
  };

  const statusConfig = {
    New: { color: '#2563a8', bg: '#dbeafe' },
    Assigned: { color: '#b07d1a', bg: '#fef3c7' },
    'In Progress': { color: '#6d3fa0', bg: '#ede9f8' },
    Repaired: { color: '#2d7a4f', bg: '#d4eddf' },
    Scrapped: { color: '#c0392b', bg: '#fde8e6' },
  };
  const priorityConfig = {
    Critical: { color: '#c0392b', bg: '#fde8e6' },
    High: { color: '#b07d1a', bg: '#fef3c7' },
    Medium: { color: '#2563a8', bg: '#dbeafe' },
    Low: { color: '#2d7a4f', bg: '#d4eddf' },
  };

  const statuses = ['All', 'New', 'Assigned', 'In Progress', 'Repaired', 'Scrapped'];
  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);
  const isOverdue = req => req.scheduledDate && new Date(req.scheduledDate) < new Date() && !['Repaired', 'Scrapped'].includes(req.status);

  return (
    <>
      <style>{`
        .rl-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; }
        .rl-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px;
        }
        .rl-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 26px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.4px;
        }
        .rl-title span { color: #c8873a; }
        .rl-btn {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 10px 20px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .rl-btn:hover { background: #a06828; }

        .rl-filter-banner {
          display: flex; justify-content: space-between; align-items: center;
          background: #fff; border: 1px solid #e2dfd9; border-radius: 8px;
          padding: 10px 16px; margin-bottom: 16px; font-size: 13px; color: #5a5650;
        }
        .rl-filter-tag { color: #c8873a; font-weight: 600; margin-right: 6px; }
        .rl-clear-btn {
          background: none; border: 1px solid #e2dfd9; border-radius: 6px;
          color: #5a5650; font-size: 12px; font-weight: 500;
          padding: 5px 12px; cursor: pointer; transition: all 0.2s;
        }
        .rl-clear-btn:hover { border-color: #c8873a; color: #c8873a; }

        .rl-filters { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .rl-filter-btn {
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 20px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 12.5px; font-weight: 500;
          padding: 6px 14px; cursor: pointer; transition: all 0.2s;
        }
        .rl-filter-btn:hover { border-color: #c8873a; color: #c8873a; }
        .rl-filter-btn.active { background: #c8873a; border-color: #c8873a; color: #fff; font-weight: 600; }

        .rl-error {
          background: #fde8e6; border: 1px solid #f5c6c2; border-left: 3px solid #c0392b;
          color: #922b21; padding: 11px 14px; border-radius: 6px;
          margin-bottom: 16px; font-size: 13px;
        }

        .rl-table-wrap {
          background: #fff; border-radius: 12px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f9f8f6; border-bottom: 1px solid #e2dfd9; }
        th {
          padding: 12px 18px; text-align: left;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase;
          color: #9a9590;
        }
        td {
          padding: 14px 18px; font-size: 13.5px;
          color: #5a5650; border-bottom: 1px solid #f5f4f0;
          vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #faf9f7; }

        .rl-subject { font-weight: 600; color: #1a1814; max-width: 200px; }
        .rl-overdue {
          display: inline-block; font-size: 10px; font-weight: 700;
          color: #c0392b; background: #fde8e6;
          padding: 2px 7px; border-radius: 4px;
          margin-left: 7px; vertical-align: middle;
        }
        .rl-badge {
          display: inline-block; font-size: 11.5px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
        }
        .rl-type-badge {
          font-size: 11.5px; font-weight: 500;
          padding: 3px 9px; border-radius: 5px;
          background: #f0ede8; color: #7a7570;
        }
        .rl-actions { display: flex; gap: 6px; }
        .rl-action-btn {
          background: none; border: 1.5px solid; border-radius: 6px;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
          padding: 5px 11px; cursor: pointer; transition: all 0.15s;
        }
        .rl-view { border-color: #2d7a4f; color: #2d7a4f; }
        .rl-view:hover { background: #d4eddf; }
        .rl-edit { border-color: #c8873a; color: #c8873a; }
        .rl-edit:hover { background: #f5e6d3; }
        .rl-del { border-color: #c0392b; color: #c0392b; }
        .rl-del:hover { background: #fde8e6; }

        .rl-empty { text-align: center; padding: 60px; color: #9a9590; }
        .rl-empty-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700; color: #5a5650; margin-bottom: 8px; }
        .rl-loading { text-align: center; padding: 60px; color: #9a9590; font-size: 14px; }
      `}</style>

      <div className="rl-root">
        <div className="rl-header">
          <h1 className="rl-title">Maintenance <span>Requests</span></h1>
          <button className="rl-btn" onClick={() => navigate('/requests/new')}>+ New Request</button>
        </div>

        {equipmentId && (
          <div className="rl-filter-banner">
            <span><span className="rl-filter-tag">Filtered:</span> Showing requests for selected equipment</span>
            <button className="rl-clear-btn" onClick={() => navigate('/requests')}>✕ Clear filter</button>
          </div>
        )}

        <div className="rl-filters">
          {statuses.map(s => (
            <button key={s} className={`rl-filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>

        {error && <div className="rl-error">{error}</div>}

        {loading ? (
          <div className="rl-loading">Loading requests...</div>
        ) : (
          <div className="rl-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Equipment</th>
                  <th>Location</th>
                  <th>Team</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Scheduled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="9">
                    <div className="rl-empty">
                      <div className="rl-empty-title">No Requests Found</div>
                      <p style={{ fontSize: 13 }}>Create your first maintenance request!</p>
                    </div>
                  </td></tr>
                ) : (
                  filtered.map(req => {
                    const sc = statusConfig[req.status] || { color: '#5a5650', bg: '#f0ede8' };
                    const pc = priorityConfig[req.priority] || { color: '#5a5650', bg: '#f0ede8' };
                    return (
                      <tr key={req._id}>
                        <td>
                          <div className="rl-subject">
                            {req.subject}
                            {isOverdue(req) && <span className="rl-overdue">OVERDUE</span>}
                          </div>
                        </td>
                        <td><span className="rl-type-badge">{req.requestType}</span></td>
                        <td>{req.equipmentId?.equipmentName || '—'}</td>
                        <td>
                          {(req.location || req.equipmentId?.location)
                            ? <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color:'#c8873a', background:'#fdf6ee', border:'1px solid #f5e6d3', borderRadius:5, padding:'2px 8px', fontWeight:600 }}>📍 {req.location || req.equipmentId?.location}</span>
                            : <span style={{ color:'#c8c4bc' }}>—</span>}
                        </td>
                        <td>{req.teamId?.teamName || '—'}</td>
                        <td><span className="rl-badge" style={{ color: pc.color, background: pc.bg }}>{req.priority}</span></td>
                        <td><span className="rl-badge" style={{ color: sc.color, background: sc.bg }}>{req.status}</span></td>
                        <td style={{ color: '#9a9590', fontSize: 13 }}>
                          {req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : '—'}
                        </td>
                        <td>
                          <div className="rl-actions">
                            <button className="rl-action-btn rl-view" onClick={() => navigate(`/requests/${req._id}`)}>View</button>
                            <button className="rl-action-btn rl-edit" onClick={() => navigate(`/requests/edit/${req._id}`)}>Edit</button>
                            <button className="rl-action-btn rl-del" onClick={() => handleDelete(req._id)}>Del</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
