import { useState, useEffect } from 'react';
import equipmentService from '../../services/equipmentService';
import requestService from '../../services/requestService';

export default function EquipmentDetails() {
  const id = window.location.pathname.split('/').pop();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openReqCount, setOpenReqCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const eq = await equipmentService.getEquipment(id);
        setEquipment(eq);
        const res = await requestService.getAllRequests({ equipmentId: id, openOnly: true });
        const payload = res?.data ?? res;
        const list = payload?.data ?? payload;
        setOpenReqCount(Array.isArray(list) ? list.length : 0);
      } catch (e) {
        console.error('Failed to load equipment/count', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this equipment?')) return;
    await equipmentService.deleteEquipment(id);
    window.location.href = '/equipment';
  };

  const statusConfig = {
    Active: { color: '#2d7a4f', bg: '#d4eddf' },
    'Under Maintenance': { color: '#b07d1a', bg: '#fef3c7' },
    Scrapped: { color: '#c0392b', bg: '#fde8e6' },
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a9590', fontFamily: 'Inter, sans-serif', fontSize: 15, gap: 10 }}>
      <div style={{ width: 20, height: 20, border: '2px solid #e2dfd9', borderTopColor: '#c8873a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Loading...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!equipment) return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a9590', fontFamily: 'Inter, sans-serif' }}>
      Equipment not found.
    </div>
  );

  const sc = statusConfig[equipment.status] || { color: '#5a5650', bg: '#f0ede8' };

  return (
    <>
      <style>{`
        .ed-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; padding: 36px 40px; }
        .ed-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 14px; }
        .ed-header-left { display: flex; align-items: center; gap: 14px; }
        .ed-back {
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 7px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          padding: 8px 14px; cursor: pointer; transition: all 0.2s;
        }
        .ed-back:hover { border-color: #c8873a; color: #c8873a; }
        .ed-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; color: #1a1814; letter-spacing: -0.3px; }
        .ed-title span { color: #c8873a; }
        .ed-btn-row { display: flex; gap: 8px; }
        .ed-btn {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px; font-weight: 700;
          padding: 9px 20px; cursor: pointer;
          transition: background 0.2s; box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .ed-btn:hover { background: #a06828; }
        .ed-btn-del {
          background: none; border: 1.5px solid #c0392b; border-radius: 8px;
          color: #c0392b; font-family: 'Inter', sans-serif;
          font-size: 13.5px; font-weight: 600;
          padding: 9px 20px; cursor: pointer; transition: all 0.2s;
        }
        .ed-btn-del:hover { background: #fde8e6; }

        .ed-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }

        .ed-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          overflow: hidden; margin-bottom: 18px;
        }
        .ed-card-head {
          padding: 16px 22px;
          border-bottom: 1px solid #f0ede8;
          background: #faf9f7;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #5a5650; text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex; align-items: center; gap: 7px;
        }
        .ed-card-body { padding: 22px; }

        /* LOCATION HIGHLIGHT BANNER */
        .ed-location-banner {
          display: flex; align-items: center; gap: 14px;
          background: linear-gradient(135deg, #fdf6ee, #fff8f0);
          border: 1.5px solid #f5e6d3;
          border-radius: 12px;
          padding: 18px 22px;
          margin-bottom: 22px;
        }
        .ed-location-icon {
          width: 44px; height: 44px;
          background: #c8873a; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .ed-location-label { font-size: 11px; font-weight: 600; color: #c8873a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .ed-location-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 800; color: #1a1814; }

        .ed-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ed-field { }
        .ed-field-label { font-size: 11px; font-weight: 600; color: #9a9590; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 5px; }
        .ed-field-value { font-size: 14px; color: #1a1814; font-weight: 500; }
        .ed-field-value.mono { font-family: 'Courier New', monospace; font-size: 13px; color: #5a5650; }
        .ed-field-value.big { font-size: 18px; font-weight: 700; }

        .ed-status-badge { display: inline-block; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; }

        .ed-desc { font-size: 14px; color: #5a5650; line-height: 1.7; padding-top: 4px; }

        .ed-req-btn {
          width: 100%;
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 10px;
          color: #1a1814; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 14px 18px; cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .ed-req-btn:hover { border-color: #c8873a; background: #fdf6ee; color: #c8873a; }
        .ed-req-count {
          background: #c8873a; color: #fff;
          font-size: 12px; font-weight: 700;
          padding: 3px 10px; border-radius: 20px;
          min-width: 28px; text-align: center;
        }
        .ed-new-req-btn {
          width: 100%;
          background: #c8873a; border: none; border-radius: 10px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 13px; cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .ed-new-req-btn:hover { background: #a06828; }

        .ed-meta-row { display: flex; flex-direction: column; gap: 12px; }
        .ed-meta-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f5f4f0; }
        .ed-meta-item:last-child { border-bottom: none; }
        .ed-meta-key { font-size: 12px; color: #9a9590; font-weight: 500; }
        .ed-meta-val { font-size: 13px; color: #1a1814; font-weight: 600; }

        @media (max-width: 768px) {
          .ed-grid { grid-template-columns: 1fr; }
          .ed-info-grid { grid-template-columns: 1fr; }
          .ed-root { padding: 20px; }
        }
      `}</style>

      <div className="ed-root">
        <div className="ed-header">
          <div className="ed-header-left">
            <button className="ed-back" onClick={() => window.location.href = '/equipment'}>← Back</button>
            <div className="ed-title">Equipment <span>Details</span></div>
          </div>
          <div className="ed-btn-row">
            <button className="ed-btn" onClick={() => window.location.href = `/equipment/edit/${id}`}>✏️ Edit</button>
            <button className="ed-btn-del" onClick={handleDelete}>🗑️ Delete</button>
          </div>
        </div>

        <div className="ed-grid">
          {/* LEFT */}
          <div>
            <div className="ed-card">
              <div className="ed-card-head">📋 General Information</div>
              <div className="ed-card-body">

                {/* LOCATION BANNER — prominent */}
                <div className="ed-location-banner">
                  <div className="ed-location-icon">📍</div>
                  <div>
                    <div className="ed-location-label">Equipment Location</div>
                    <div className="ed-location-value">{equipment.location || 'Location not specified'}</div>
                  </div>
                </div>

                <div className="ed-field" style={{ marginBottom: 18 }}>
                  <div className="ed-field-label">Equipment Name</div>
                  <div className="ed-field-value big">{equipment.equipmentName}</div>
                </div>

                <div className="ed-info-grid">
                  <div className="ed-field">
                    <div className="ed-field-label">Serial Number</div>
                    <div className="ed-field-value mono">{equipment.serialNumber}</div>
                  </div>
                  <div className="ed-field">
                    <div className="ed-field-label">Category</div>
                    <div className="ed-field-value">{equipment.category}</div>
                  </div>
                  <div className="ed-field">
                    <div className="ed-field-label">Department</div>
                    <div className="ed-field-value">{equipment.department}</div>
                  </div>
                  <div className="ed-field">
                    <div className="ed-field-label">Assigned Team</div>
                    <div className="ed-field-value">{equipment.teamId?.teamName || '—'}</div>
                  </div>
                  <div className="ed-field">
                    <div className="ed-field-label">Purchase Date</div>
                    <div className="ed-field-value">{equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : '—'}</div>
                  </div>
                  <div className="ed-field">
                    <div className="ed-field-label">Warranty Expiry</div>
                    <div className="ed-field-value">{equipment.warrantyExpiryDate ? new Date(equipment.warrantyExpiryDate).toLocaleDateString() : '—'}</div>
                  </div>
                </div>

                {equipment.description && (
                  <div className="ed-field" style={{ marginTop: 16 }}>
                    <div className="ed-field-label">Description</div>
                    <div className="ed-desc">{equipment.description}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* Status Card */}
            <div className="ed-card">
              <div className="ed-card-head">⚡ Status</div>
              <div className="ed-card-body">
                <div style={{ marginBottom: 18 }}>
                  <div className="ed-field-label" style={{ marginBottom: 8 }}>Current Status</div>
                  <span className="ed-status-badge" style={{ color: sc.color, background: sc.bg }}>
                    {equipment.status}
                  </span>
                </div>
                <div className="ed-meta-row">
                  <div className="ed-meta-item">
                    <span className="ed-meta-key">Added On</span>
                    <span className="ed-meta-val">{new Date(equipment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="ed-meta-item">
                    <span className="ed-meta-key">Last Updated</span>
                    <span className="ed-meta-val">{new Date(equipment.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Card */}
            <div className="ed-card">
              <div className="ed-card-head">🔧 Maintenance</div>
              <div className="ed-card-body">
                <button
                  className="ed-req-btn"
                  onClick={() => window.location.href = `/requests?equipmentId=${id}`}
                >
                  <span>View All Requests</span>
                  <span className="ed-req-count">{openReqCount}</span>
                </button>
                <button
                  className="ed-new-req-btn"
                  onClick={() => window.location.href = `/requests/new?equipmentId=${id}`}
                >
                  + New Maintenance Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
