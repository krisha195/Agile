import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import requestService from '../../services/requestService';

const rawBaseUrl = process.env.REACT_APP_API_URL || '';
const API_BASE = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchRequest(); }, [id]);

  const fetchRequest = async () => {
    try {
      const res = await requestService.getRequestById(id);
      setRequest(res?.data ? res.data : res);
    } catch { setError('Failed to load request details'); }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try { await requestService.updateStatus(id, newStatus); fetchRequest(); }
    catch { setError('Failed to update status'); }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this request?')) {
      try { await requestService.deleteRequest(id); navigate('/requests'); }
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

  const nextStatuses = { New: ['Assigned'], Assigned: ['In Progress'], 'In Progress': ['Repaired', 'Scrapped'], Repaired: [], Scrapped: [] };
  const statusOrder = ['New', 'Assigned', 'In Progress', 'Repaired'];
  const isOverdue = request?.scheduledDate && new Date(request.scheduledDate) < new Date() && !['Repaired', 'Scrapped'].includes(request?.status);

  // Build image URL — handles both /uploads/... and full URLs
  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_BASE}${imgPath}`;
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a9590', fontFamily: 'Inter, sans-serif', fontSize: 15, gap: 10 }}>
      <div style={{ width: 20, height: 20, border: '2px solid #e2dfd9', borderTopColor: '#c8873a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Loading request...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        .rd-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; max-width: 900px; margin: 0 auto; }
        .rd-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none;
          color: #c8873a; font-family: 'Inter', sans-serif;
          font-size: 13.5px; font-weight: 600;
          cursor: pointer; margin-bottom: 24px;
          padding: 0; transition: color 0.2s;
        }
        .rd-back:hover { color: #a06828; }
        .rd-error {
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b; color: #922b21;
          padding: 11px 14px; border-radius: 6px;
          margin-bottom: 20px; font-size: 13px;
        }
        .rd-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          margin-bottom: 18px;
          animation: rdFadeUp 0.4s ease both;
          overflow: hidden;
        }
        @keyframes rdFadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

        .rd-banner {
          padding: 26px 30px;
          border-bottom: 1px solid #f0ede8;
          display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
          background: #faf9f7;
        }
        .rd-subject {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.3px;
          margin-bottom: 10px;
        }
        .rd-badges { display: flex; gap: 7px; flex-wrap: wrap; }
        .rd-badge {
          font-size: 11.5px; font-weight: 600;
          padding: 4px 11px; border-radius: 20px;
        }
        .rd-overdue {
          font-size: 11.5px; font-weight: 700;
          padding: 4px 11px; border-radius: 20px;
          background: #fde8e6; color: #c0392b;
          animation: rdPulse 1.5s infinite;
        }
        @keyframes rdPulse { 0%,100% { opacity:1; } 50% { opacity:0.65; } }
        .rd-banner-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .rd-edit-btn {
          background: none; border: 1.5px solid #c8873a; border-radius: 7px;
          color: #c8873a; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 8px 16px; cursor: pointer; transition: all 0.2s;
        }
        .rd-edit-btn:hover { background: #f5e6d3; }
        .rd-del-btn {
          background: none; border: 1.5px solid #c0392b; border-radius: 7px;
          color: #c0392b; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 8px 16px; cursor: pointer; transition: all 0.2s;
        }
        .rd-del-btn:hover { background: #fde8e6; }

        .rd-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          border-bottom: 1px solid #f0ede8;
        }
        .rd-info-item {
          padding: 18px 24px;
          border-right: 1px solid #f0ede8;
        }
        .rd-info-item:last-child { border-right: none; }
        .rd-info-label { font-size: 11px; font-weight: 600; color: #9a9590; letter-spacing: 0.3px; margin-bottom: 5px; text-transform: uppercase; }
        .rd-info-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a1814; }

        .rd-section { padding: 22px 28px; border-bottom: 1px solid #f0ede8; }
        .rd-section:last-child { border-bottom: none; }
        .rd-section-label { font-size: 12px; font-weight: 600; color: #9a9590; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 10px; }
        .rd-desc-text { font-size: 14px; color: #5a5650; line-height: 1.7; }

        .rd-image-wrap {
          border-radius: 10px; overflow: hidden;
          border: 1px solid #e2dfd9;
          max-width: 700px;
        }
        .rd-image-wrap img { width: 100%; display: block; max-height: 400px; object-fit: cover; }

        /* STATUS CARD */
        .rd-status-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .rd-status-head {
          padding: 18px 28px;
          border-bottom: 1px solid #f0ede8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700; color: #1a1814;
          background: #faf9f7;
          display: flex; align-items: center; gap: 8px;
        }
        .rd-status-body { padding: 24px 28px; }

        .rd-progress { display: flex; align-items: center; margin-bottom: 28px; overflow-x: auto; padding-bottom: 4px; }
        .rd-step { display: flex; flex-direction: column; align-items: center; gap: 7px; flex-shrink: 0; }
        .rd-step-circle {
          width: 34px; height: 34px; border-radius: 50%;
          border: 2px solid #e2dfd9; background: #f9f8f6;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #c8c4bc;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s;
        }
        .rd-step-circle.done { border-color: #2d7a4f; background: #d4eddf; color: #2d7a4f; }
        .rd-step-circle.current { border-color: #c8873a; background: #f5e6d3; color: #c8873a; }
        .rd-step-label { font-size: 10.5px; font-weight: 600; color: #c8c4bc; text-align: center; letter-spacing: 0.2px; }
        .rd-step-label.done { color: #2d7a4f; }
        .rd-step-label.current { color: #c8873a; }
        .rd-step-line { flex: 1; height: 2px; background: #e2dfd9; margin: 0 8px; margin-bottom: 22px; min-width: 28px; }
        .rd-step-line.done { background: #2d7a4f; }

        .rd-next-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .rd-next-btn {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 11px 22px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .rd-next-btn:hover { background: #a06828; }
        .rd-next-btn:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .rd-scrap-btn {
          background: none; border: 1.5px solid #c0392b; border-radius: 8px;
          color: #c0392b; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 11px 22px; cursor: pointer; transition: all 0.2s;
        }
        .rd-scrap-btn:hover { background: #fde8e6; }
        .rd-done-msg {
          color: #2d7a4f; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          display: flex; align-items: center; gap: 8px;
          background: #d4eddf; padding: 12px 18px; border-radius: 8px;
        }
      `}</style>

      <div className="rd-root">
        <button className="rd-back" onClick={() => navigate('/requests')}>← Back to Requests</button>

        {error && <div className="rd-error">{error}</div>}

        <div className="rd-card">
          <div className="rd-banner">
            <div>
              <div className="rd-subject">{request?.subject}</div>
              <div className="rd-badges">
                {(() => { const sc = statusConfig[request?.status] || { color: '#5a5650', bg: '#f0ede8' }; return <span className="rd-badge" style={{ color: sc.color, background: sc.bg }}>{request?.status}</span>; })()}
                {(() => { const pc = priorityConfig[request?.priority] || { color: '#5a5650', bg: '#f0ede8' }; return <span className="rd-badge" style={{ color: pc.color, background: pc.bg }}>{request?.priority}</span>; })()}
                <span className="rd-badge" style={{ color: request?.requestType === 'Corrective' ? '#c0392b' : '#2563a8', background: request?.requestType === 'Corrective' ? '#fde8e6' : '#dbeafe' }}>{request?.requestType}</span>
                {isOverdue && <span className="rd-overdue">⚠ Overdue</span>}
              </div>
            </div>
            <div className="rd-banner-actions">
              <button className="rd-edit-btn" onClick={() => navigate(`/requests/edit/${id}`)}>✏️ Edit</button>
              <button className="rd-del-btn" onClick={handleDelete}>🗑️ Delete</button>
            </div>
          </div>

          <div className="rd-info-grid">
            {[
              { label: 'Equipment', value: request?.equipmentId?.equipmentName || '—' },
              { label: 'Location', value: request?.location || request?.equipmentId?.location || '—' },
              { label: 'Team', value: request?.teamId?.teamName || '—' },
              { label: 'Technician', value: request?.assignedTechnicianId?.fullName || '—' },
              { label: 'Scheduled', value: request?.scheduledDate ? new Date(request.scheduledDate).toLocaleDateString() : '—' },
              { label: 'Created By', value: request?.createdBy?.fullName || '—' },
              { label: 'Created At', value: new Date(request?.createdAt).toLocaleDateString() },
            ].map(item => (
              <div key={item.label} className="rd-info-item">
                <div className="rd-info-label">{item.label}</div>
                <div className="rd-info-value">{item.value}</div>
              </div>
            ))}
          </div>

          {request?.description && (
            <div className="rd-section">
              <div className="rd-section-label">Description</div>
              <p className="rd-desc-text">{request.description}</p>
            </div>
          )}

          {request?.image && (
            <div className="rd-section">
              <div className="rd-section-label">Damage Photo</div>
              <div className="rd-image-wrap">
                <img
                  src={getImageUrl(request.image)}
                  alt="Damage"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Update */}
        <div className="rd-status-card">
          <div className="rd-status-head">🔄 Update Status</div>
          <div className="rd-status-body">
            <div className="rd-progress">
              {statusOrder.map((step, i, arr) => {
                const currentIdx = statusOrder.indexOf(request?.status);
                const stepIdx = statusOrder.indexOf(step);
                const isDone = stepIdx < currentIdx;
                const isCurrent = stepIdx === currentIdx;
                return (
                  <div key={step} style={{ display: 'contents' }}>
                    <div className="rd-step">
                      <div className={`rd-step-circle ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <div className={`rd-step-label ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>{step}</div>
                    </div>
                    {i < arr.length - 1 && <div className={`rd-step-line ${stepIdx < currentIdx ? 'done' : ''}`} />}
                  </div>
                );
              })}
            </div>

            <div className="rd-next-actions">
              {nextStatuses[request?.status]?.length === 0 ? (
                <div className="rd-done-msg">✅ Request {request?.status} — No further actions needed</div>
              ) : (
                nextStatuses[request?.status]?.map(next =>
                  next === 'Scrapped' ? (
                    <button key={next} className="rd-scrap-btn" onClick={() => handleStatusUpdate(next)} disabled={updating}>
                      🗑️ Mark as Scrapped
                    </button>
                  ) : (
                    <button key={next} className="rd-next-btn" onClick={() => handleStatusUpdate(next)} disabled={updating}>
                      → Move to {next}
                    </button>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
