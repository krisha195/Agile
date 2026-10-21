import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const roleConfig = {
  Admin: { color: '#c0392b', bg: '#fde8e6' },
  Manager: { color: '#b07d1a', bg: '#fef3c7' },
  Technician: { color: '#2563a8', bg: '#dbeafe' },
  User: { color: '#2d7a4f', bg: '#d4eddf' },
};

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await authService.getAllUsers();
      setUsers(res.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const filtered = users.filter(u => {
    const matchSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <>
      <style>{`
        .ul-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; }
        .ul-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .ul-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a1814; letter-spacing: -0.4px; }
        .ul-title span { color: #c8873a; }
        .ul-btn { background: #c8873a; border: none; border-radius: 8px; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; padding: 10px 20px; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 8px rgba(200,135,58,0.28); }
        .ul-btn:hover { background: #a06828; }
        .ul-filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .ul-search { flex: 1; min-width: 200px; background: #fff; border: 1.5px solid #e2dfd9; border-radius: 8px; color: #1a1814; font-family: 'Inter', sans-serif; font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.2s; }
        .ul-search:focus { border-color: #c8873a; box-shadow: 0 0 0 3px rgba(200,135,58,0.10); }
        .ul-search::placeholder { color: #c8c4bc; }
        .ul-select { background: #fff; border: 1.5px solid #e2dfd9; border-radius: 8px; color: #5a5650; font-family: 'Inter', sans-serif; font-size: 14px; padding: 10px 14px; outline: none; cursor: pointer; }
        .ul-select:focus { border-color: #c8873a; }
        .ul-table-wrap { background: #fff; border-radius: 12px; border: 1px solid #e2dfd9; box-shadow: 0 1px 4px rgba(0,0,0,0.05); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f9f8f6; border-bottom: 1px solid #e2dfd9; }
        th { padding: 12px 18px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9a9590; }
        td { padding: 14px 18px; border-bottom: 1px solid #f5f4f0; font-size: 13.5px; color: #5a5650; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #faf9f7; }
        .ul-name { font-weight: 600; color: #1a1814; }
        .ul-email { font-size: 12.5px; color: #9a9590; }
        .ul-badge { display: inline-block; padding: 3px 10px; font-size: 11.5px; font-weight: 600; border-radius: 20px; }
        .ul-avatar { width: 36px; height: 36px; border-radius: 50%; background: #f5e6d3; color: #c8873a; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ul-name-cell { display: flex; align-items: center; gap: 10px; }
        .ul-empty { text-align: center; padding: 60px; color: #9a9590; font-size: 14px; }
        .ul-loading { text-align: center; padding: 60px; color: #9a9590; font-size: 14px; }
        .ul-back { background: #fff; border: 1.5px solid #e2dfd9; border-radius: 7px; color: #7a7570; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 8px 14px; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; display: inline-block; }
        .ul-back:hover { border-color: #c8873a; color: #c8873a; }
      `}</style>

      <div className="ul-root">
        <button className="ul-back" onClick={() => navigate('/teams')}>← Back to Teams</button>
        <div className="ul-header">
          <div className="ul-title">User <span>Management</span></div>
          <button className="ul-btn" onClick={() => navigate('/users/new')}>+ Add User</button>
        </div>

        <div className="ul-filters">
          <input className="ul-search" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="ul-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Technician">Technician</option>
            <option value="User">User</option>
          </select>
        </div>

        <div className="ul-table-wrap">
          {loading ? (
            <div className="ul-loading">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="ul-empty">No users found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Username</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const rc = roleConfig[u.role] || { color: '#5a5650', bg: '#f0ede8' };
                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="ul-name-cell">
                          <div className="ul-avatar">{u.fullName?.charAt(0)?.toUpperCase() || '?'}</div>
                          <div>
                            <div className="ul-name">{u.fullName}</div>
                            <div className="ul-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'Courier New, monospace', fontSize: 12.5, color: '#9a9590' }}>@{u.username}</td>
                      <td>{u.department || '—'}</td>
                      <td><span className="ul-badge" style={{ color: rc.color, background: rc.bg }}>{u.role}</span></td>
                      <td style={{ color: '#9a9590', fontSize: 13 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
