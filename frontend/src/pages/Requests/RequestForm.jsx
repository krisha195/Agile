import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import requestService from '../../services/requestService';
import equipmentService from '../../services/equipmentService';
import teamService from '../../services/teamService';

export default function RequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    subject: '', description: '', requestType: 'Corrective',
    equipmentId: '', teamId: '', assignedTechnicianId: '',
    priority: 'Medium', status: 'New', scheduledDate: '', location: ''
  });
  const [equipmentList, setEquipmentList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [technicianList, setTechnicianList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchDropdowns(); if (isEditing) fetchRequest(); }, [id]);

  const fetchDropdowns = async () => {
    try {
      const [eqRes, teamRes] = await Promise.all([equipmentService.getAllEquipment(), teamService.getAllTeams()]);
      setEquipmentList(Array.isArray(eqRes) ? eqRes : (eqRes.data || []));
      setTeamList(Array.isArray(teamRes) ? teamRes : (teamRes.data || []));
    } catch { setError('Failed to load form data'); }
  };

  const fetchRequest = async () => {
    try {
      const res = await requestService.getRequestById(id);
      const r = res.data;
      setFormData({
        subject: r.subject || '', description: r.description || '',
        requestType: r.requestType || 'Corrective',
        equipmentId: r.equipmentId?._id || '', teamId: r.teamId?._id || '',
        assignedTechnicianId: r.assignedTechnicianId?._id || '',
        priority: r.priority || 'Medium', status: r.status || 'New',
        scheduledDate: r.scheduledDate ? r.scheduledDate.split('T')[0] : '',
        location: r.location || r.equipmentId?.location || '',
      });
      if (r.teamId) {
        const team = teamList.find(t => t._id === r.teamId._id);
        if (team) setTechnicianList(team.members || []);
      }
    } catch { setError('Failed to load request'); }
  };

  const handleEquipmentChange = (e) => {
    const eqId = e.target.value;
    const selected = equipmentList.find(eq => eq._id === eqId);
    setSelectedEquipment(selected || null);
    setFormData(prev => ({ ...prev, equipmentId: eqId, teamId: selected?.teamId || prev.teamId, location: selected?.location || prev.location }));
    if (selected?.teamId) {
      const team = teamList.find(t => t._id === selected.teamId);
      setTechnicianList(team?.members || []);
    }
  };

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    setFormData(prev => ({ ...prev, teamId, assignedTechnicianId: '' }));
    const team = teamList.find(t => t._id === teamId);
    setTechnicianList(team?.members || []);
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be ≤ 5MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject?.trim() || !formData.equipmentId || !formData.requestType) {
      setError('Subject, Equipment and Request Type are required!'); return;
    }
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('subject', formData.subject.trim());
      fd.append('description', formData.description || '');
      fd.append('requestType', formData.requestType);
      fd.append('equipmentId', formData.equipmentId);
      if (formData.teamId) fd.append('teamId', formData.teamId);
      if (formData.assignedTechnicianId) fd.append('assignedTechnicianId', formData.assignedTechnicianId);
      fd.append('priority', formData.priority || 'Medium');
      fd.append('status', formData.status || 'New');
      if (formData.scheduledDate) fd.append('scheduledDate', formData.scheduledDate);
      if (formData.location) fd.append('location', formData.location);
      if (imageFile) fd.append('image', imageFile);
      if (isEditing) { await requestService.updateRequest(id, fd); }
      else { await requestService.createRequest(fd); }
      navigate('/requests');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .rf-root {
          min-height: 100vh; background: #f5f4f0;
          font-family: 'Inter', sans-serif;
          padding: 36px 40px;
          display: flex; justify-content: center; align-items: flex-start;
        }
        .rf-card {
          width: 100%; max-width: 700px;
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          animation: rfFadeUp 0.4s ease both;
          overflow: hidden;
        }
        @keyframes rfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .rf-header {
          padding: 26px 32px;
          border-bottom: 1px solid #f0ede8;
          background: #faf9f7;
        }
        .rf-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.3px;
          margin-bottom: 3px;
        }
        .rf-subtitle { font-size: 13px; color: #9a9590; }
        .rf-body { padding: 28px 32px; }
        .rf-error {
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b;
          color: #922b21; font-size: 13px;
          padding: 11px 14px; border-radius: 6px;
          margin-bottom: 22px;
        }
        .rf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .rf-grid-full { grid-column: 1 / -1; }
        .rf-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #5a5650; margin-bottom: 6px; letter-spacing: 0.2px;
        }
        .rf-req { color: #c8873a; }
        .rf-input, .rf-select, .rf-textarea {
          width: 100%; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #1a1814; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 10px 13px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .rf-input:focus, .rf-select:focus, .rf-textarea:focus {
          border-color: #c8873a;
          box-shadow: 0 0 0 3px rgba(200,135,58,0.10);
        }
        .rf-input::placeholder, .rf-textarea::placeholder { color: #c8c4bc; }
        .rf-select option { background: #fff; color: #1a1814; }
        .rf-textarea { resize: vertical; min-height: 96px; }
        .rf-autofill { font-size: 11.5px; color: #c8873a; margin-top: 5px; font-weight: 500; }

        .rf-type-row { display: flex; gap: 10px; }
        .rf-type-btn {
          flex: 1; padding: 11px;
          background: #f9f8f6; border: 1.5px solid #e2dfd9;
          border-radius: 8px; color: #9a9590;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .rf-type-btn:hover { border-color: #c8c4bc; color: #5a5650; }
        .rf-type-btn.corrective.active { border-color: #c0392b; color: #c0392b; background: #fde8e6; }
        .rf-type-btn.preventive.active { border-color: #2563a8; color: #2563a8; background: #dbeafe; }

        .rf-file-area {
          border: 2px dashed #e2dfd9; border-radius: 8px;
          padding: 20px; text-align: center;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
          background: #faf9f7;
        }
        .rf-file-area:hover { border-color: #c8873a; background: #fdf6ee; }
        .rf-file-input { display: none; }
        .rf-file-label { font-size: 13px; color: #9a9590; cursor: pointer; }
        .rf-file-label span { color: #c8873a; font-weight: 600; }
        .rf-preview {
          margin-top: 12px; border-radius: 8px;
          overflow: hidden; border: 1px solid #e2dfd9;
        }
        .rf-preview img { width: 100%; max-height: 240px; object-fit: cover; display: block; }

        .rf-actions {
          display: flex; gap: 10px;
          padding: 20px 32px;
          border-top: 1px solid #f0ede8;
          background: #faf9f7;
        }
        .rf-cancel {
          flex: 1; background: none;
          border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 12px; cursor: pointer; transition: all 0.2s;
        }
        .rf-cancel:hover { border-color: #c8c4bc; color: #1a1814; }
        .rf-submit {
          flex: 2; background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 12px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .rf-submit:hover { background: #a06828; }
        .rf-submit:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .rf-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: rfSpin 0.7s linear infinite;
          vertical-align: middle; margin-right: 7px;
        }
        @keyframes rfSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rf-root">
        <div className="rf-card">
          <div className="rf-header">
            <h1 className="rf-title">{isEditing ? '✏️ Edit Request' : '📋 New Maintenance Request'}</h1>
            <p className="rf-subtitle">{isEditing ? 'Update the maintenance request details' : 'Fill in the details to create a maintenance request'}</p>
          </div>

          <div className="rf-body">
            {error && <div className="rf-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="rf-grid">
                {/* Request Type */}
                <div className="rf-grid-full">
                  <label className="rf-label">Request Type <span className="rf-req">*</span></label>
                  <div className="rf-type-row">
                    <button type="button" className={`rf-type-btn corrective ${formData.requestType === 'Corrective' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, requestType: 'Corrective' })}>
                      🔴 Corrective
                    </button>
                    <button type="button" className={`rf-type-btn preventive ${formData.requestType === 'Preventive' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, requestType: 'Preventive' })}>
                      🔵 Preventive
                    </button>
                  </div>
                </div>

                {/* Subject */}
                <div className="rf-grid-full">
                  <label className="rf-label">Subject <span className="rf-req">*</span></label>
                  <input className="rf-input" type="text" name="subject" value={formData.subject}
                    onChange={handleChange} placeholder="e.g. AC unit not cooling properly" />
                </div>

                {/* Equipment */}
                <div>
                  <label className="rf-label">Equipment <span className="rf-req">*</span></label>
                  <select className="rf-select" name="equipmentId" value={formData.equipmentId} onChange={handleEquipmentChange}>
                    <option value="">— Select Equipment —</option>
                    {equipmentList.map(eq => <option key={eq._id} value={eq._id}>{eq.equipmentName}</option>)}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="rf-label">📍 Equipment Location</label>
                  <input
                    className="rf-input"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Floor 2, Room 204"
                  />
                  {selectedEquipment?.location && formData.location === selectedEquipment.location && (
                    <div style={{ fontSize: 11.5, color: '#c8873a', marginTop: 5, fontWeight: 600 }}>⚡ Auto-filled from equipment</div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="rf-label">Priority</label>
                  <select className="rf-select" name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🔵 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>

                {/* Team */}
                <div>
                  <label className="rf-label">Team</label>
                  <select className="rf-select" name="teamId" value={formData.teamId} onChange={handleTeamChange}>
                    <option value="">— Select Team —</option>
                    {teamList.map(t => <option key={t._id} value={t._id}>{t.teamName}</option>)}
                  </select>
                  {formData.teamId && <div className="rf-autofill">⚡ Auto-filled from equipment</div>}
                </div>

                {/* Technician */}
                <div>
                  <label className="rf-label">Assigned Technician</label>
                  <select className="rf-select" name="assignedTechnicianId" value={formData.assignedTechnicianId}
                    onChange={handleChange} disabled={technicianList.length === 0}>
                    <option value="">— Select Technician —</option>
                    {technicianList.map(tech => <option key={tech._id} value={tech._id}>{tech.fullName}</option>)}
                  </select>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label className="rf-label">Scheduled Date</label>
                  <input className="rf-input" type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} />
                </div>

                {/* Status (edit only) */}
                {isEditing && (
                  <div>
                    <label className="rf-label">Status</label>
                    <select className="rf-select" name="status" value={formData.status} onChange={handleChange}>
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Repaired">Repaired</option>
                      <option value="Scrapped">Scrapped</option>
                    </select>
                  </div>
                )}

                {/* Description */}
                <div className="rf-grid-full">
                  <label className="rf-label">Description</label>
                  <textarea className="rf-textarea" name="description" value={formData.description}
                    onChange={handleChange} placeholder="Describe the issue or maintenance needed..." />
                </div>

                {/* Image Upload */}
                <div className="rf-grid-full">
                  <label className="rf-label">Damage Photo <span style={{ color: '#9a9590', fontWeight: 400 }}>(optional)</span></label>
                  <div className="rf-file-area" onClick={() => document.getElementById('rf-file-input').click()}>
                    <input id="rf-file-input" className="rf-file-input" type="file" accept="image/*" onChange={onImageChange} />
                    <div className="rf-file-label">
                      📷 <span>Click to upload</span> or drag & drop<br />
                      <span style={{ fontSize: 11, color: '#c8c4bc' }}>PNG, JPG, JPEG up to 5MB</span>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="rf-preview">
                      <img src={imagePreview} alt="Damage preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="rf-actions">
                <button type="button" className="rf-cancel" onClick={() => navigate('/requests')}>Cancel</button>
                <button type="submit" className="rf-submit" disabled={loading}>
                  {loading && <span className="rf-spinner" />}
                  {loading ? 'Saving...' : isEditing ? 'Update Request' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
