import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../../services/teamService';

export default function TeamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    teamName: '',
    specialization: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) fetchTeam();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await teamService.getTeamById(id);
      const { teamName, specialization, description } = response.data;
      setFormData({ teamName, specialization, description: description || '' });
    } catch {
      setError('Failed to load team data');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teamName || !formData.specialization) {
      setError('Team name and specialization are required!');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await teamService.updateTeam(id, formData);
      } else {
        await teamService.createTeam(formData);
      }
      navigate('/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .tf-root {
          min-height: 100vh;
          background: #f5f4f0;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .tf-card {
          width: 100%; max-width: 560px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          overflow: hidden;
          animation: tfFadeUp 0.4s ease both;
        }
        @keyframes tfFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tf-card-header {
          padding: 28px 32px 24px;
          border-bottom: 1px solid #f0ede8;
          background: #faf9f7;
          display: flex; align-items: center; gap: 14px;
        }
        .tf-header-icon {
          width: 46px; height: 46px;
          background: linear-gradient(135deg, #c8873a, #f0b060);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(200,135,58,0.3);
        }
        .tf-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.3px;
          margin-bottom: 2px;
        }
        .tf-subtitle { font-size: 13px; color: #9a9590; }
        .tf-body { padding: 28px 32px; }
        .tf-error {
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b;
          color: #922b21; font-size: 13px;
          padding: 11px 14px; border-radius: 8px;
          margin-bottom: 22px;
        }
        .tf-group { margin-bottom: 20px; }
        .tf-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #5a5650; margin-bottom: 7px; letter-spacing: 0.2px;
        }
        .tf-required { color: #c8873a; }
        .tf-input, .tf-select, .tf-textarea {
          width: 100%; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 9px;
          color: #1a1814; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 11px 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .tf-input:focus, .tf-select:focus, .tf-textarea:focus {
          border-color: #c8873a;
          box-shadow: 0 0 0 3px rgba(200,135,58,0.12);
        }
        .tf-input::placeholder, .tf-textarea::placeholder { color: #c8c4bc; }
        .tf-select option { background: #fff; color: #1a1814; }
        .tf-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
        .tf-spec-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;
        }
        .tf-spec-btn {
          padding: 10px 6px; border-radius: 8px;
          border: 1.5px solid #e2dfd9;
          background: #faf9f7; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 600;
          color: #7a7570; text-align: center;
          transition: all 0.18s;
        }
        .tf-spec-btn:hover { border-color: #c8873a; color: #c8873a; background: #fdf6ee; }
        .tf-spec-btn.active { border-color: #c8873a; background: #fdf6ee; color: #c8873a; box-shadow: 0 0 0 3px rgba(200,135,58,0.10); }
        .tf-spec-icon { font-size: 18px; margin-bottom: 4px; }
        .tf-actions {
          display: flex; gap: 10px;
          padding: 20px 32px;
          border-top: 1px solid #f0ede8;
          background: #faf9f7;
        }
        .tf-cancel {
          flex: 1; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 9px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 12px; cursor: pointer; transition: all 0.2s;
        }
        .tf-cancel:hover { border-color: #c8c4bc; color: #1a1814; }
        .tf-submit {
          flex: 2; background: #c8873a; border: none; border-radius: 9px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 12px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .tf-submit:hover { background: #a06828; }
        .tf-submit:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .tf-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: tfSpin 0.7s linear infinite;
          vertical-align: middle; margin-right: 7px;
        }
        @keyframes tfSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="tf-root">
        <div className="tf-card">
          <div className="tf-card-header">
            <div className="tf-header-icon">👥</div>
            <div>
              <h1 className="tf-title">{isEditing ? 'Edit Team' : 'New Team'}</h1>
              <p className="tf-subtitle">{isEditing ? 'Update the team information below' : 'Fill in the details to create a new team'}</p>
            </div>
          </div>

          <div className="tf-body">
            {error && <div className="tf-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="tf-group">
                <label className="tf-label">
                  Team Name <span className="tf-required">*</span>
                </label>
                <input
                  className="tf-input"
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="e.g. IT Support Team"
                />
              </div>

              <div className="tf-group">
                <label className="tf-label">
                  Specialization <span className="tf-required">*</span>
                </label>
                <select
                  className="tf-select"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                >
                  <option value="">-- Select Specialization --</option>
                  <option value="IT">IT</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="HVAC">HVAC</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="tf-group">
                <label className="tf-label">Description</label>
                <textarea
                  className="tf-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the team's responsibilities..."
                />
              </div>
            </form>
          </div>

          <div className="tf-actions">
            <button className="tf-cancel" onClick={() => navigate('/teams')}>
              Cancel
            </button>
            <button
              className="tf-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <span className="tf-spinner" />}
              {loading ? 'Saving...' : isEditing ? 'Update Team' : 'Create Team'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}