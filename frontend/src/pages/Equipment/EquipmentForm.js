import { useState, useEffect } from 'react';
import equipmentService from '../../services/equipmentService';

const CATEGORIES = ['Computer', 'Vehicle', 'Machine', 'Office Equipment', 'Other'];
const DEPARTMENTS = ['IT', 'Engineering', 'Facilities', 'Operations', 'HR', 'Finance', 'Other'];
const STATUSES = ['Active', 'Under Maintenance', 'Scrapped'];

export default function EquipmentForm() {
  const isEdit = window.location.pathname.includes('/edit/');
  const id = isEdit ? window.location.pathname.split('/').pop() : null;

  const [form, setForm] = useState({
    equipmentName: '', serialNumber: '', category: '',
    department: '', location: '', description: '',
    purchaseDate: '', warrantyExpiryDate: '', status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      equipmentService.getEquipment(id).then(data => {
        setForm({
          equipmentName: data.equipmentName || '',
          serialNumber: data.serialNumber || '',
          category: data.category || '',
          department: data.department || '',
          location: data.location || '',
          description: data.description || '',
          purchaseDate: data.purchaseDate?.slice(0, 10) || '',
          warrantyExpiryDate: data.warrantyExpiryDate?.slice(0, 10) || '',
          status: data.status || 'Active'
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.equipmentName.trim()) e.equipmentName = 'Name is required';
    if (!form.serialNumber.trim()) e.serialNumber = 'Serial number is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.department) e.department = 'Department is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) { await equipmentService.updateEquipment(id, form); setSuccess('Equipment updated successfully!'); }
      else { await equipmentService.createEquipment(form); setSuccess('Equipment added successfully!'); }
      setTimeout(() => window.location.href = '/equipment', 1500);
    } catch { setErrors({ general: 'Something went wrong. Try again.' }); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .ef-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; }
        .ef-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
        .ef-back {
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 7px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          padding: 8px 14px; cursor: pointer; transition: all 0.2s;
        }
        .ef-back:hover { border-color: #c8873a; color: #c8873a; }
        .ef-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; color: #1a1814; letter-spacing: -0.3px; }
        .ef-title span { color: #c8873a; }
        .ef-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          padding: 32px; max-width: 720px;
        }
        .ef-success {
          background: #d4eddf; border: 1px solid #a8d5b8;
          border-left: 3px solid #2d7a4f; color: #1e5c38;
          padding: 11px 14px; border-radius: 6px;
          margin-bottom: 22px; font-size: 13px; font-weight: 500;
        }
        .ef-general-err {
          background: #fde8e6; border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b; color: #922b21;
          padding: 11px 14px; border-radius: 6px;
          margin-bottom: 22px; font-size: 13px;
        }
        .ef-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .ef-full { grid-column: 1 / -1; }
        .ef-label { display: block; font-size: 12px; font-weight: 600; color: #5a5650; margin-bottom: 6px; letter-spacing: 0.2px; }
        .ef-input {
          width: 100%; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #1a1814; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 10px 13px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .ef-input:focus { border-color: #c8873a; box-shadow: 0 0 0 3px rgba(200,135,58,0.10); }
        .ef-input.error { border-color: #c0392b; }
        .ef-input::placeholder { color: #c8c4bc; }
        .ef-err { font-size: 12px; color: #c0392b; margin-top: 4px; display: block; }
        .ef-btn-row { display: flex; gap: 10px; margin-top: 26px; }
        .ef-btn {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 12px 28px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .ef-btn:hover { background: #a06828; }
        .ef-btn:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .ef-btn-cancel {
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          padding: 12px 22px; cursor: pointer; transition: all 0.2s;
        }
        .ef-btn-cancel:hover { border-color: #c8c4bc; color: #1a1814; }
        @media (max-width: 600px) { .ef-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ef-root">
        <div className="ef-header">
          <button className="ef-back" onClick={() => window.location.href = '/equipment'}>← Back</button>
          <div className="ef-title">{isEdit ? 'Edit' : 'Add'} <span>Equipment</span></div>
        </div>

        <div className="ef-card">
          {success && <div className="ef-success">✅ {success}</div>}
          {errors.general && <div className="ef-general-err">{errors.general}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="ef-grid">
              <div>
                <label className="ef-label">Equipment Name *</label>
                <input className={`ef-input ${errors.equipmentName ? 'error' : ''}`} name="equipmentName" placeholder="e.g. Dell Laptop" value={form.equipmentName} onChange={handleChange} />
                {errors.equipmentName && <span className="ef-err">{errors.equipmentName}</span>}
              </div>
              <div>
                <label className="ef-label">Serial Number *</label>
                <input className={`ef-input ${errors.serialNumber ? 'error' : ''}`} name="serialNumber" placeholder="e.g. SN-2024-001" value={form.serialNumber} onChange={handleChange} />
                {errors.serialNumber && <span className="ef-err">{errors.serialNumber}</span>}
              </div>
              <div>
                <label className="ef-label">Category *</label>
                <select className={`ef-input ${errors.category ? 'error' : ''}`} name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <span className="ef-err">{errors.category}</span>}
              </div>
              <div>
                <label className="ef-label">Department *</label>
                <select className={`ef-input ${errors.department ? 'error' : ''}`} name="department" value={form.department} onChange={handleChange}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
                {errors.department && <span className="ef-err">{errors.department}</span>}
              </div>
              <div>
                <label className="ef-label">Location</label>
                <input className="ef-input" name="location" placeholder="e.g. Floor 2, Room 204" value={form.location} onChange={handleChange} />
              </div>
              <div>
                <label className="ef-label">Status</label>
                <select className="ef-input" name="status" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="ef-label">Purchase Date</label>
                <input className="ef-input" type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
              </div>
              <div>
                <label className="ef-label">Warranty Expiry Date</label>
                <input className="ef-input" type="date" name="warrantyExpiryDate" value={form.warrantyExpiryDate} onChange={handleChange} />
              </div>
              <div className="ef-full">
                <label className="ef-label">Description</label>
                <textarea className="ef-input" name="description" placeholder="Optional details about this equipment..." value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="ef-btn-row">
              <button type="submit" className="ef-btn" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Equipment' : 'Add Equipment'}
              </button>
              <button type="button" className="ef-btn-cancel" onClick={() => window.location.href = '/equipment'}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
