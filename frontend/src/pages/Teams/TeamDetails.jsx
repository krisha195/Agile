import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../services/teamService';
import authService from '../../services/authService';

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
const canManageTeam = role === 'Admin' || role === 'Manager';

const [users, setUsers] = useState([]);
const [selectedUserId, setSelectedUserId] = useState('');
// eslint-disable-next-line no-unused-vars
const [loadingUsers, setLoadingUsers] = useState(false);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [userId, setUserId] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState('');

//   useEffect(() => {
//   fetchTeam();
//   if (canManageTeam) fetchUsers();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [id]);
useEffect(() => {
  fetchTeam();
  if (canManageTeam) fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

  const fetchTeam = async () => {
    try {
      const response = await teamService.getTeamById(id);
      setTeam(response.data);
    } catch {
      setError('Failed to load team details');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
  try {
    setLoadingUsers(true);
    const res = await authService.getAllUsers('Technician'); // change case if your DB uses lowercase
    setUsers(res.data || []);
  } catch (e) {
    setMemberError(e.message || 'Failed to load technicians');
  } finally {
    setLoadingUsers(false);
  }
};
  const handleAddMember = async () => {
    if (!selectedUserId) { setMemberError('Please select a technician'); return; }
    setAddingMember(true);
    setMemberError('');
    try {
      await teamService.addMember(id, selectedUserId);
      setSelectedUserId('');
      fetchTeam();
    } catch (err) {
      setMemberError(err.response?.data?.message || 'Failed to add member');
    }
    setAddingMember(false);
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member from the team?')) {
      try {
        await teamService.removeMember(id, memberId);
        fetchTeam();
      } catch {
        setError('Failed to remove member');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamService.deleteTeam(id);
        navigate('/teams');
      } catch {
        setError('Failed to delete team');
      }
    }
  };

  const specConfig = {
    IT: { color: '#2563a8', bg: '#dbeafe' },
    Electrical: { color: '#b07d1a', bg: '#fef3c7' },
    Mechanical: { color: '#5a5650', bg: '#f0ede8' },
    HVAC: { color: '#2d7a4f', bg: '#d4eddf' },
    General: { color: '#6d3fa0', bg: '#ede9f8' },
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a9590', fontFamily: 'Inter, sans-serif', fontSize: 15, gap: 10 }}>
      Loading team...
    </div>
  );

  return (
    <>
      <style>{`
        .td-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; max-width: 900px; margin: 0 auto; }
        .td-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none;
          color: #c8873a; font-family: 'Inter', sans-serif;
          font-size: 13.5px; font-weight: 600;
          cursor: pointer; margin-bottom: 24px; padding: 0;
          transition: color 0.2s;
        }
        .td-back:hover { color: #a06828; }
        .td-error {
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b; color: #922b21;
          padding: 11px 14px; border-radius: 6px;
          margin-bottom: 20px; font-size: 13px;
        }
        .td-header-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          margin-bottom: 18px; overflow: hidden;
          animation: tdFadeUp 0.4s ease both;
        }
        @keyframes tdFadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .td-banner {
          padding: 24px 28px;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid #f0ede8; background: #faf9f7;
        }
        .td-team-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 24px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.3px; margin-bottom: 8px;
        }
        .td-spec-badge {
          display: inline-block; font-size: 11.5px; font-weight: 600;
          padding: 4px 12px; border-radius: 20px;
          color: var(--spec-color); background: var(--spec-bg);
        }
        .td-banner-actions { display: flex; gap: 8px; }
        .td-edit-btn {
          background: none; border: 1.5px solid #c8873a; border-radius: 7px;
          color: #c8873a; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 8px 16px; cursor: pointer; transition: all 0.2s;
        }
        .td-edit-btn:hover { background: #f5e6d3; }
        .td-delete-btn {
          background: none; border: 1.5px solid #c0392b; border-radius: 7px;
          color: #c0392b; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 8px 16px; cursor: pointer; transition: all 0.2s;
        }
        .td-delete-btn:hover { background: #fde8e6; }
        .td-info-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          border-bottom: 1px solid #f0ede8;
        }
        .td-info-item { padding: 18px 24px; border-right: 1px solid #f0ede8; }
        .td-info-item:last-child { border-right: none; }
        .td-info-label { font-size: 11px; font-weight: 600; color: #9a9590; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 5px; }
        .td-info-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700; color: #1a1814; }
        .td-desc-section { padding: 20px 24px; }
        .td-desc-text { font-size: 14px; color: #5a5650; line-height: 1.7; }
        .td-members-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          overflow: hidden;
          animation: tdFadeUp 0.5s ease both;
        }
        .td-members-header {
          padding: 18px 24px; border-bottom: 1px solid #f0ede8;
          display: flex; align-items: center; gap: 10px;
          background: #faf9f7;
        }
        .td-members-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700; color: #1a1814;
        }
        .td-members-count {
          font-size: 11.5px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
          background: #f5e6d3; color: #c8873a;
        }
        .td-add-member {
          padding: 16px 24px; border-bottom: 1px solid #f0ede8;
          display: flex; gap: 10px;
        }
        .td-member-input {
          flex: 1; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #1a1814; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 10px 13px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .td-member-input:focus { border-color: #c8873a; box-shadow: 0 0 0 3px rgba(200,135,58,0.10); }
        .td-add-btn {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px; font-weight: 700;
          padding: 10px 20px; cursor: pointer;
          transition: background 0.2s; white-space: nowrap;
          box-shadow: 0 2px 6px rgba(200,135,58,0.25);
        }
        .td-add-btn:hover { background: #a06828; }
        .td-add-btn:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .td-member-error {
          margin: 10px 24px 0;
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b; color: #922b21;
          padding: 10px 14px; border-radius: 6px; font-size: 13px;
        }
        .td-members-list { padding: 12px 24px 20px; }
        .td-member-row {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 0; border-bottom: 1px solid #f5f4f0;
        }
        .td-member-row:last-child { border-bottom: none; }
        .td-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: #f5e6d3; color: #c8873a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .td-member-info { flex: 1; }
        .td-member-name { font-size: 14px; font-weight: 600; color: #1a1814; margin-bottom: 2px; }
        .td-member-email { font-size: 12px; color: #9a9590; }
        .td-member-role {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 10px;
          background: #f5e6d3; color: #c8873a; margin-top: 3px;
        }
        .td-remove-btn {
          background: none; border: 1.5px solid #e2dfd9; border-radius: 6px;
          color: #c0392b; font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 600;
          padding: 5px 12px; cursor: pointer; transition: all 0.2s;
        }
        .td-remove-btn:hover { border-color: #c0392b; background: #fde8e6; }
        .td-empty-members { text-align: center; padding: 36px; color: #9a9590; font-size: 14px; }
      `}</style>

      <div className="td-root">
        <button className="td-back" onClick={() => navigate('/teams')}>
          ← Back to Teams
        </button>

        {error && <div className="td-error">{error}</div>}

        {/* Header Card */}
        <div className="td-header-card">
          <div className="td-banner">
            <div>
              <div className="td-team-name">{team?.teamName}</div>
              <span
                className="td-spec-badge"
                style={{
                  '--spec-color': specConfig[team?.specialization]?.color || '#5a5650',
                  '--spec-bg': specConfig[team?.specialization]?.bg || '#f0ede8',
                }}
              >
                {team?.specialization}
              </span>
            </div>
            <div className="td-banner-actions">
              <button className="td-edit-btn" onClick={() => navigate(`/teams/edit/${id}`)}>
                ✏️ Edit
              </button>
              <button className="td-delete-btn" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="td-info-grid">
            <div className="td-info-item">
              <div className="td-info-label">Specialization</div>
              <div className="td-info-value">{team?.specialization}</div>
            </div>
            <div className="td-info-item">
              <div className="td-info-label">Total Members</div>
              <div className="td-info-value">{team?.members?.length || 0}</div>
            </div>
            <div className="td-info-item">
              <div className="td-info-label">Created At</div>
              <div className="td-info-value" style={{ fontSize: '16px' }}>
                {new Date(team?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {team?.description && (
            <div className="td-desc-section">
              <div className="td-info-label" style={{ marginBottom: '8px' }}>Description</div>
              <p className="td-desc-text">{team.description}</p>
            </div>
          )}
        </div>

        {/* Members Card */}
        <div className="td-members-card">
          <div className="td-members-header">
            <div className="td-members-title">Team Members</div>
            <span className="td-members-count">
              {team?.members?.length || 0} total
            </span>
          </div>

          {/* <div className="td-add-member">
            <input
              className="td-member-input"
              type="text"
              placeholder="Enter User ID to add member..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button
              className="td-add-btn"
              onClick={handleAddMember}
              disabled={addingMember}
            >
              {addingMember ? 'Adding...' : '+ Add Member'}
            </button>
          </div> */}

          {/* {canManageTeam && (
  <div className="td-add-member">
    <select
      className="td-member-input"
      value={selectedUserId}
      onChange={(e) => setSelectedUserId(e.target.value)}
      style={{ appearance: 'none' }}
    >
      <option value="">
        {loadingUsers ? 'Loading technicians...' : 'Select technician to add...'}
      </option>

      {users.map((u) => (
        <option key={u._id} value={u._id}>
          {u.fullName} ({u.email})
        </option>
      ))}
    </select>

    <button
      className="td-add-btn"
      disabled={addingMember || !selectedUserId}
      onClick={async () => {
        if (!selectedUserId) {
          setMemberError('Please select a technician');
          return;
        }
        setAddingMember(true);
        setMemberError('');
        try {
          await teamService.addMember(id, selectedUserId);
          setSelectedUserId('');
          fetchTeam();
        } catch (err) {
          setMemberError(err.response?.data?.message || 'Failed to add member');
        } finally {
          setAddingMember(false);
        }
      }}
    >
      {addingMember ? 'Adding...' : '+ Add Member'}
    </button>
  </div>
)} */}

          {canManageTeam && (
  <div className="td-add-member">
    <select
      className="td-member-input"
      value={selectedUserId}
      onChange={(e) => setSelectedUserId(e.target.value)}
    >
      <option value="">Select technician...</option>
      {users.map((u) => (
        <option key={u._id} value={u._id}>
          {u.fullName} ({u.email})
        </option>
      ))}
    </select>

    <button
      className="td-add-btn"
      disabled={!selectedUserId || addingMember}
      onClick={handleAddMember}
    >
      {addingMember ? 'Adding...' : '+ Add Member'}
    </button>
  </div>
)}    

          {memberError && (
            <div className="td-member-error">{memberError}</div>
          )}

          <div className="td-members-list">
            {!team?.members || team.members.length === 0 ? (
              <div className="td-empty-members">
                No members yet. Add members using their User ID.
              </div>
            ) : (
              team.members.map((member) => (
                <div key={member._id} className="td-member-row">
                  <div className="td-avatar">
                    {member.fullName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="td-member-info">
                    <div className="td-member-name">{member.fullName}</div>
                    <div className="td-member-email">{member.email}</div>
                    <div className="td-member-role">{member.role}</div>
                  </div>
                  <button
                    className="td-remove-btn"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}