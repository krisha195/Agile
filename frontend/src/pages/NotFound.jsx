import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        .nf-root { min-height: 100vh; background: #f5f4f0; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
        .nf-code { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 96px; font-weight: 900; color: #c8873a; letter-spacing: -4px; line-height: 1; margin-bottom: 12px; }
        .nf-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #1a1814; margin-bottom: 10px; }
        .nf-sub { font-size: 15px; color: #9a9590; margin-bottom: 36px; line-height: 1.6; }
        .nf-btn { background: #c8873a; border: none; border-radius: 10px; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; padding: 13px 32px; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 10px rgba(200,135,58,0.3); margin-bottom: 12px; }
        .nf-btn:hover { background: #a06828; }
        .nf-back { background: none; border: 1.5px solid #e2dfd9; border-radius: 10px; color: #7a7570; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; padding: 11px 28px; cursor: pointer; transition: all 0.2s; display: block; }
        .nf-back:hover { border-color: #c8873a; color: #c8873a; }
      `}</style>
      <div className="nf-root">
        <div className="nf-code">404</div>
        <div className="nf-title">Page Not Found</div>
        <p className="nf-sub">The page you're looking for doesn't exist or has been moved.</p>
        <button className="nf-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        <button className="nf-back" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    </>
  );
}
