import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        .ua-root {
          min-height: 100vh; background: #f5f4f0;
          font-family: 'Inter', sans-serif;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px; text-align: center;
        }
        .ua-icon {
          width: 80px; height: 80px;
          background: #fde8e6; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; margin-bottom: 24px;
        }
        .ua-code {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 72px; font-weight: 900;
          color: #c8873a; letter-spacing: -3px;
          line-height: 1; margin-bottom: 12px;
        }
        .ua-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 24px; font-weight: 800;
          color: #1a1814; margin-bottom: 10px;
        }
        .ua-sub { font-size: 15px; color: #9a9590; margin-bottom: 32px; line-height: 1.6; }
        .ua-btn {
          background: #c8873a; border: none; border-radius: 10px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 13px 32px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(200,135,58,0.3);
          margin-bottom: 12px;
        }
        .ua-btn:hover { background: #a06828; }
        .ua-back {
          background: none; border: 1.5px solid #e2dfd9; border-radius: 10px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 11px 28px; cursor: pointer; transition: all 0.2s;
          display: block;
        }
        .ua-back:hover { border-color: #c8873a; color: #c8873a; }
      `}</style>

      <div className="ua-root">
        <div className="ua-icon">🔒</div>
        <div className="ua-code">403</div>
        <div className="ua-title">Access Denied</div>
        <p className="ua-sub">You don't have permission to access this page.<br />Please contact your administrator.</p>
        <button className="ua-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        <button className="ua-back" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    </>
  );
}
