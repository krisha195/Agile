import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = ['Technician', 'User', 'Manager'];
const DEPARTMENTS = ['IT', 'Engineering', 'Facilities', 'Operations', 'HR', 'Finance', 'Other'];

export default function CreateUser() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const rawBaseUrl = process.env.REACT_APP_API_URL || '';
  const API_BASE_URL = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

  const [form, setForm] = useState({
    fullName: '', username: '', email: '',
    password: '', department: '', role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.username || !form.email || !form.password || !form.role) {
      setError('Full name, username, email, password and role are required.');
      return;
    }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
        const text = await res.text();
        let data = {};
        if (text) {
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
        }
        if (!res.ok) throw new Error(data.message || 'Failed to create user');
      setSuccess(`User "${form.fullName}" created successfully!`);
      setTimeout(() => navigate('/teams'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .cu-root {
          min-height: 100vh; background: #f5f4f0;
          font-family: 'Inter', sans-serif;
          padding: 36px 40px;
          display: flex; justify-content: center; align-items: flex-start;
        }
        .cu-card {
          width: 100%; max-width: 620px;
          background: #fff; border-radius: 16px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          overflow: hidden;
          animation: cuFadeUp 0.4s ease both;
        }
        @keyframes cuFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cu-header {
          padding: 26px 32px 22px;
          border-bottom: 1px solid #f0ede8;
          background: #faf9f7;
          display: flex; align-items: center; gap: 14px;
        }
        .cu-header-icon {
          width: 46px; height: 46px;
          background: linear-gradient(135deg, #c8873a, #f0b060);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(200,135,58,0.3);
        }
        .cu-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.3px; margin-bottom: 2px;
        }
        .cu-subtitle { font-size: 13px; color: #9a9590; }
        .cu-body { padding: 28px 32px; }
        .cu-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none;
          color: #c8873a; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; margin-bottom: 20px; padding: 0;
          transition: color 0.2s;
        }
        .cu-back:hover { color: #a06828; }
        .cu-error {
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b;
          color: #922b21; font-size: 13px;
          padding: 11px 14px; border-radius: 8px; margin-bottom: 20px;
        }
        .cu-success {
          background: #d4eddf; border: 1px solid #a8d5b8;
          border-left: 3px solid #2d7a4f;
          color: #1e5c38; font-size: 13px; font-weight: 500;
          padding: 11px 14px; border-radius: 8px; margin-bottom: 20px;
        }
        .cu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .cu-full { grid-column: 1 / -1; }
        .cu-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #5a5650; margin-bottom: 6px; letter-spacing: 0.2px;
        }
        .cu-req { color: #c8873a; }
        .cu-input, .cu-select {
          width: 100%; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 9px;
          color: #1a1814; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 11px 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .cu-input:focus, .cu-select:focus {
          border-color: #c8873a;
          box-shadow: 0 0 0 3px rgba(200,135,58,0.12);
        }
        .cu-input::placeholder { color: #c8c4bc; }
        .cu-select option { background: #fff; color: #1a1814; }
        .cu-actions {
          display: flex; gap: 10px;
          padding: 20px 32px;
          border-top: 1px solid #f0ede8;
          background: #faf9f7;
        }
        .cu-cancel {
          flex: 1; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 9px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 12px; cursor: pointer; transition: all 0.2s;
        }
        .cu-cancel:hover { border-color: #c8c4bc; color: #1a1814; }
        .cu-submit {
          flex: 2; background: #c8873a; border: none; border-radius: 9px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 12px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .cu-submit:hover { background: #a06828; }
        .cu-submit:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .cu-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: cuSpin 0.7s linear infinite;
          vertical-align: middle; margin-right: 7px;
        }
        @keyframes cuSpin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .cu-grid { grid-template-columns: 1fr; } .cu-root { padding: 20px; } }
      `}</style>

      <div className="cu-root">
        <div className="cu-card">
          <div className="cu-header">
            <div className="cu-header-icon">👤</div>
            <div>
              <div className="cu-title">Create Team Member</div>
              <div className="cu-subtitle">Add a new user to the system</div>
            </div>
          </div>

          <div className="cu-body">
            <button className="cu-back" onClick={() => navigate(-1)}>← Back</button>

            {error && <div className="cu-error">{error}</div>}
            {success && <div className="cu-success">✅ {success}</div>}

            <form onSubmit={onSubmit} noValidate>
              <div className="cu-grid">
                <div>
                  <label className="cu-label">Full Name <span className="cu-req">*</span></label>
                  <input className="cu-input" name="fullName" placeholder="e.g. John Smith" value={form.fullName} onChange={onChange} />
                </div>
                <div>
                  <label className="cu-label">Username <span className="cu-req">*</span></label>
                  <input className="cu-input" name="username" placeholder="e.g. johnsmith" value={form.username} onChange={onChange} />
                </div>
                <div>
                  <label className="cu-label">Email Address <span className="cu-req">*</span></label>
                  <input className="cu-input" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={onChange} />
                </div>
                <div>
                  <label className="cu-label">Password <span className="cu-req">*</span></label>
                  <input className="cu-input" type="password" name="password" placeholder="Min 8 characters" value={form.password} onChange={onChange} />
                </div>
                <div>
                  <label className="cu-label">Role</label>
                  <select className="cu-select" name="role" value={form.role} onChange={onChange}>
                    <option value="">— Select Role —</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="cu-label">Department</label>
                  <select className="cu-select" name="department" value={form.department} onChange={onChange}>
                    <option value="">— Select Department —</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </form>
          </div>

          <div className="cu-actions">
            <button className="cu-cancel" type="button" onClick={() => navigate('/teams')}>Cancel</button>
            <button className="cu-submit" type="button" onClick={onSubmit} disabled={loading}>
              {loading && <span className="cu-spinner" />}
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
