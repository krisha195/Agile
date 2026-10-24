import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../../services/requestService';

export default function KanbanBoard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [dragOverCol, setDragOverCol] = useState(null);

  const columns = ['New', 'Assigned', 'In Progress', 'Repaired', 'Scrapped'];

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await requestService.getAllRequests();
      setRequests(res.data);
    } catch { }
    setLoading(false);
  };

  const getByStatus = (status) =>
    requests
  .filter((r) => r.status === status)
  .filter((r) =>
    r.subject?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDragStart = (id) => setDraggedId(id);

  const handleDrop = async (status) => {
    if (!draggedId) return;
    try {
      await requestService.updateStatus(draggedId, status);
      setRequests((prev) =>
        prev.map((r) => r._id === draggedId ? { ...r, status } : r)
      );
    } catch { }
    setDraggedId(null);
  };

  const isOverdue = (req) =>
    req.scheduledDate &&
    new Date(req.scheduledDate) < new Date() &&
    !['Repaired', 'Scrapped'].includes(req.status);

  const priorityColor = (p) => ({
    Critical: '#ef4444', High: '#f0a500',
    Medium: '#3b82f6', Low: '#10b981',
  }[p] || '#555');

  const columnColor = (s) => ({
    'New': '#3b82f6', 'Assigned': '#f0a500',
    'In Progress': '#8b5cf6', 'Repaired': '#10b981', 'Scrapped': '#ef4444',
  }[s] || '#555');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .kb-root {
          min-height: 100vh;
          background: #0d0d0d;
          font-family: 'Barlow', sans-serif;
          padding: 40px;
        }
        .kb-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          border-bottom: 1px solid #1e1e1e;
          padding-bottom: 24px;
        }
        .kb-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 42px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #fff;
        }
        .kb-title span { color: #f0a500; }
        .kb-btn {
          background: #f0a500;
          border: none;
          color: #000;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 12px 28px;
          cursor: pointer;
        }
        .kb-btn:hover { background: #ffd166; }
        .kb-board {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          align-items: start;
        }
        .kb-col {
          background: #111;
          border: 1px solid #1e1e1e;
          border-top: 3px solid var(--col-color);
          min-height: 500px;
        }
        .kb-col-header {
          padding: 16px;
          border-bottom: 1px solid #1e1e1e;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .kb-col-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--col-color);
        }
        .kb-col-count {
          font-size: 12px;
          color: #555;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          padding: 2px 8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
        }
.kb-col-body {
  padding: 12px;
  max-height: 70vh;
  overflow-y: auto;
}
        .kb-card {
  background: #181818;
  border: 1px solid #2a2a2a;
  border-left: 4px solid var(--priority-color);
  padding: 16px;
  margin-bottom: 12px;
  cursor: grab;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.kb-card:hover {
  transform: translateY(-3px);
  border-color: var(--priority-color);
  box-shadow: 0 5px 15px rgba(0,0,0,0.4);
}
        .kb-card:hover {
          border-color: #f0a500;
          transform: translateY(-2px);
        }
        .kb-card.overdue {
          border-color: #ef4444;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .kb-card-subject {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .kb-card-equipment {
          font-size: 11px;
          color: #555;
          margin-bottom: 8px;
        }
        .kb-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .kb-priority {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--priority-color);
        }
        .kb-overdue-tag {
          font-size: 10px;
          font-weight: 700;
          color: #ef4444;
          letter-spacing: 1px;
        }
        .kb-view-btn {
          font-size: 11px;
          background: none;
          border: none;
          color: #f0a500;
          cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .kb-empty {
          text-align: center;
          padding: 40px 16px;
          color: #2a2a2a;
          font-size: 13px;
        }
        .kb-drop-zone {
          min-height: 400px;
        }
        .kb-loading {
          text-align: center;
          padding: 80px;
          color: #555;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        @media (max-width: 1200px) {
          .kb-board { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .kb-board { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="kb-root">
        <div className="kb-header">
  <div>
    <h1 className="kb-title">Kanban <span>Board</span></h1>

    <input
      placeholder="Search requests..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        marginTop: "10px",
        padding: "8px 12px",
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        color: "#fff",
        width: "250px"
      }}
    />
  </div>

  <button className="kb-btn" onClick={() => navigate('/requests/new')}>
    + New Request
  </button>
</div>

        {loading ? (
          <div className="kb-loading">Loading Board...</div>
        ) : (
          <div className="kb-board">
            {columns.map((col) => (
              <div
                key={col}
                className="kb-col"
                style={{ '--col-color': columnColor(col) }}
                onDragOver={(e) => {
  e.preventDefault();
  setDragOverCol(col);
}}
onDrop={() => {
  handleDrop(col);
  setDragOverCol(null);
}}
              >
                <div className="kb-col-header">
                  <div className="kb-col-title">{col}</div>
                  <div className="kb-col-count">{getByStatus(col).length}</div>
                </div>
                <div className="kb-col-body kb-drop-zone">
                  {getByStatus(col).length === 0 ? (
                    <div className="kb-empty">Drop here</div>
                  ) : (
                    getByStatus(col).map((req) => (
                      <div
                        key={req._id}
                        className={`kb-card ${isOverdue(req) ? 'overdue' : ''}`}
                        style={{ '--priority-color': priorityColor(req.priority) }}
                        draggable
                        onDragStart={() => handleDragStart(req._id)}
                      >
                        <div className="kb-card-subject">{req.subject}</div>
                        <div className="kb-card-equipment">
                          🔧 {req.equipmentId?.equipmentName || '—'}
                        </div>
                        <div className="kb-card-footer">
                          <div>
                            <div className="kb-priority">{req.priority}</div>
                            {isOverdue(req) && (
                              <div className="kb-overdue-tag">⚠ OVERDUE</div>
                            )}
                          </div>
                          <button
                            className="kb-view-btn"
                            onClick={() => navigate(`/requests/${req._id}`)}
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}