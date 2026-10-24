import { useState, useEffect } from 'react';
import equipmentService from '../../services/equipmentService';

const CATEGORIES = ['All', 'Computer', 'Vehicle', 'Machine', 'Office Equipment', 'Other'];
const STATUSES = ['All', 'Active', 'Under Maintenance', 'Scrapped'];

export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchEquipment(); }, [category, status]);

  const fetchEquipment = async () => {
    setLoading(true);
    const filters = {};
    if (category !== 'All') filters.category = category;
    if (status !== 'All') filters.status = status;
    const res = await equipmentService.getAllEquipment(filters);
    setEquipment(res.data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this equipment?')) return;
    await equipmentService.deleteEquipment(id);
    fetchEquipment();
  };

  const filtered = equipment.filter(e =>
    e.equipmentName?.toLowerCase().includes(search.toLowerCase()) ||
    e.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const statusConfig = {
    Active: { color: '#2d7a4f', bg: '#d4eddf' },
    'Under Maintenance': { color: '#b07d1a', bg: '#fef3c7' },
    Scrapped: { color: '#c0392b', bg: '#fde8e6' },
  };

  return (
    <>
      <style>{`
        .el-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; }
        .el-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .el-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a1814; letter-spacing: -0.4px; }
        .el-title span { color: #c8873a; }
        .el-btn {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 10px 20px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .el-btn:hover { background: #a06828; }
        .el-filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .el-search {
          flex: 1; min-width: 200px;
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #1a1814; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 10px 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .el-search:focus { border-color: #c8873a; box-shadow: 0 0 0 3px rgba(200,135,58,0.10); }
        .el-search::placeholder { color: #c8c4bc; }
        .el-select {
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #5a5650; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 10px 14px; outline: none; cursor: pointer;
          transition: border-color 0.2s;
        }
        .el-select:focus { border-color: #c8873a; }
        .el-table-wrap {
          background: #fff; border-radius: 12px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f9f8f6; border-bottom: 1px solid #e2dfd9; }
        th { padding: 12px 18px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9a9590; }
        td { padding: 14px 18px; border-bottom: 1px solid #f5f4f0; font-size: 13.5px; color: #5a5650; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #faf9f7; }
        .el-name { font-weight: 600; color: #1a1814; }
        .el-serial { font-family: 'Courier New', monospace; font-size: 12.5px; color: #9a9590; }
        .el-badge { display: inline-block; padding: 3px 10px; font-size: 11.5px; font-weight: 600; border-radius: 20px; }
        .el-actions { display: flex; gap: 6px; }
        .el-action {
          background: none; border: 1.5px solid; border-radius: 6px;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
          padding: 5px 11px; cursor: pointer; transition: all 0.15s;
        }
        .el-view { border-color: #2d7a4f; color: #2d7a4f; }
        .el-view:hover { background: #d4eddf; }
        .el-edit { border-color: #c8873a; color: #c8873a; }
        .el-edit:hover { background: #f5e6d3; }
        .el-del { border-color: #c0392b; color: #c0392b; }
        .el-del:hover { background: #fde8e6; }
        .el-empty { text-align: center; padding: 60px; color: #9a9590; font-size: 14px; }
        .el-loading { text-align: center; padding: 60px; color: #9a9590; font-size: 14px; }
      `}</style>

      <div className="el-root">
        <div className="el-header">
          <div className="el-title">Equipment <span>List</span></div>
          <button className="el-btn" onClick={() => window.location.href = '/equipment/new'}>+ Add Equipment</button>
        </div>

        <div className="el-filters">
          <input className="el-search" placeholder="Search by name or serial number..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="el-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="el-select" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="el-table-wrap">
          {loading ? (
            <div className="el-loading">Loading equipment...</div>
          ) : filtered.length === 0 ? (
            <div className="el-empty">No equipment found. Add your first one!</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Serial No.</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(eq => {
                  const sc = statusConfig[eq.status] || { color: '#5a5650', bg: '#f0ede8' };
                  return (
                    <tr key={eq._id || eq.id}>
                      <td><span className="el-name">{eq.equipmentName}</span></td>
                      <td><span className="el-serial">{eq.serialNumber}</span></td>
                      <td>{eq.category}</td>
                      <td>{eq.department}</td>
                      <td>{eq.location || '—'}</td>
                      <td><span className="el-badge" style={{ color: sc.color, background: sc.bg }}>{eq.status}</span></td>
                      <td>
                        <div className="el-actions">
                          <button className="el-action el-view" onClick={() => window.location.href = `/equipment/${eq._id || eq.id}`}>View</button>
                          <button className="el-action el-edit" onClick={() => window.location.href = `/equipment/edit/${eq._id || eq.id}`}>Edit</button>
                          <button className="el-action el-del" onClick={() => handleDelete(eq._id || eq.id)}>Delete</button>
                        </div>
                      </td>
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
