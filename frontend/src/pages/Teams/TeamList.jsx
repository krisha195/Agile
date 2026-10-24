import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import teamService from '../../services/teamService';

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchTeams(); }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamService.getAllTeams();
      setTeams(response.data);
    } catch { setError('Failed to load teams'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this team?')) {
      try { await teamService.deleteTeam(id); setTeams(teams.filter(t => t._id !== id)); }
      catch { setError('Failed to delete team'); }
    }
  };

  const specConfig = {
    IT: { color: '#2563a8', bg: '#dbeafe' },
    Electrical: { color: '#b07d1a', bg: '#fef3c7' },
    Mechanical: { color: '#5a5650', bg: '#f0ede8' },
    HVAC: { color: '#2d7a4f', bg: '#d4eddf' },
    General: { color: '#6d3fa0', bg: '#ede9f8' },
  };

  return (
    <>
      <style>{`
        .tl-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; }
        .tl-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
        }
        .tl-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a1814; letter-spacing: -0.4px; }
        .tl-title span { color: #c8873a; }
        .tl-header-btns { display: flex; gap: 10px; }
        .tl-btn {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 10px 18px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .tl-btn:hover { background: #a06828; }
        .tl-btn-outline {
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #5a5650; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 10px 18px; cursor: pointer; transition: all 0.2s;
        }
        .tl-btn-outline:hover { border-color: #c8873a; color: #c8873a; }
        .tl-error {
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b; color: #922b21;
          padding: 11px 14px; border-radius: 6px;
          margin-bottom: 20px; font-size: 13px;
        }
        .tl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
        .tl-card {
          background: #fff; border-radius: 12px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .tl-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
        .tl-card-top {
          height: 4px;
          background: var(--accent-color);
        }
        .tl-card-header {
          padding: 18px 20px 14px;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .tl-card-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 17px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.2px;
        }
        .tl-spec-badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
          white-space: nowrap;
        }
        .tl-card-body { padding: 0 20px 16px; }
        .tl-desc { font-size: 13px; color: #9a9590; line-height: 1.6; margin-bottom: 12px; }
        .tl-members-row { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #7a7570; margin-bottom: 10px; }
        .tl-member-tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .tl-member-tag {
          font-size: 11.5px; color: #7a7570;
          background: #f5f4f0; border: 1px solid #e2dfd9;
          padding: 3px 9px; border-radius: 5px;
        }
        .tl-card-actions {
          display: flex; border-top: 1px solid #f0ede8;
        }
        .tl-action-btn {
          flex: 1; background: none; border: none;
          padding: 11px; font-family: 'Inter', sans-serif;
          font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, color 0.15s;
          border-right: 1px solid #f0ede8;
        }
        .tl-action-btn:last-child { border-right: none; }
        .tl-view { color: #2d7a4f; }
        .tl-view:hover { background: #d4eddf; }
        .tl-edit { color: #c8873a; }
        .tl-edit:hover { background: #f5e6d3; }
        .tl-delete { color: #c0392b; }
        .tl-delete:hover { background: #fde8e6; }
        .tl-empty { text-align: center; padding: 80px 40px; color: #9a9590; }
        .tl-empty-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 700; color: #5a5650; margin-bottom: 10px; }
        .tl-loading { text-align: center; padding: 80px; color: #9a9590; font-size: 14px; }
      `}</style>

      <div className="tl-root">
        <div className="tl-header">
          <h1 className="tl-title">Teams <span>Management</span></h1>
          <div className="tl-header-btns">
            <button className="tl-btn" onClick={() => navigate('/teams/new')}>+ New Team</button>
            <button className="tl-btn-outline" onClick={() => navigate('/users')}>👤 Users</button>
          </div>
        </div>

        {error && <div className="tl-error">{error}</div>}

        {loading ? (
          <div className="tl-loading">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="tl-empty">
            <div className="tl-empty-title">No Teams Found</div>
            <p style={{ fontSize: 13, marginBottom: 20 }}>Create your first team to get started</p>
            <button className="tl-btn" onClick={() => navigate('/teams/new')}>+ Create First Team</button>
          </div>
        ) : (
          <div className="tl-grid">
            {teams.map(team => {
              const sc = specConfig[team.specialization] || { color: '#5a5650', bg: '#f0ede8' };
              return (
                <div key={team._id} className="tl-card">
                  <div className="tl-card-top" style={{ '--accent-color': sc.color }} />
                  <div className="tl-card-header">
                    <div className="tl-card-name">{team.teamName}</div>
                    <span className="tl-spec-badge" style={{ color: sc.color, background: sc.bg }}>{team.specialization}</span>
                  </div>
                  <div className="tl-card-body">
                    <p className="tl-desc">{team.description || 'No description provided'}</p>
                    <div className="tl-members-row">👥 {team.members?.length || 0} Member(s)</div>
                    {team.members?.length > 0 && (
                      <div className="tl-member-tags">
                        {team.members.slice(0, 3).map(m => (
                          <span key={m._id} className="tl-member-tag">{m.fullName}</span>
                        ))}
                        {team.members.length > 3 && <span className="tl-member-tag">+{team.members.length - 3} more</span>}
                      </div>
                    )}
                  </div>
                  <div className="tl-card-actions">
                    <button className="tl-action-btn tl-view" onClick={() => navigate(`/teams/${team._id}`)}>View</button>
                    <button className="tl-action-btn tl-edit" onClick={() => navigate(`/teams/edit/${team._id}`)}>Edit</button>
                    <button className="tl-action-btn tl-delete" onClick={() => handleDelete(team._id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
