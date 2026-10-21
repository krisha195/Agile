import authService from '../services/authService';
import { useState } from "react";

const EyeIcon = ({ show }) =>
  show ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("All fields are required."); return; }
    setLoading(true);
    try {
      const res = await authService.login(form.email, form.password);
      const role = res?.data?.user?.role || res?.data?.role || res?.data?.data?.user?.role || res?.user?.role || "User";
      localStorage.setItem("role", role);
      localStorage.setItem("token", res?.data?.token || res?.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .lg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f5f4f0;
          font-family: 'Inter', sans-serif;
        }
        .lg-left {
          background: #1c1a17;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
          position: relative;
          overflow: hidden;
        }
        .lg-left-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 80%, rgba(200,135,58,0.12) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(200,135,58,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .lg-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .lg-brand-icon {
          width: 38px;
          height: 38px;
          background: #c8873a;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .lg-brand-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.3px;
        }
        .lg-brand-name span { color: #c8873a; }
        .lg-hero { position: relative; z-index: 1; }
        .lg-tagline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 44px;
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 18px;
          letter-spacing: -1px;
        }
        .lg-tagline em { color: #c8873a; font-style: normal; display: block; }
        .lg-sub {
          font-size: 15px;
          color: #8a8680;
          line-height: 1.7;
          max-width: 340px;
        }
        .lg-stats {
          display: flex;
          gap: 28px;
          position: relative;
          z-index: 1;
        }
        .lg-stat {
          padding-left: 14px;
          border-left: 2px solid #c8873a;
        }
        .lg-stat-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .lg-stat-label { font-size: 11px; color: #5a5650; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }

        .lg-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 52px 56px;
          background: #f5f4f0;
        }
        .lg-form-wrap {
          width: 100%;
          max-width: 400px;
          animation: lgFadeUp 0.45s ease both;
        }
        @keyframes lgFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lg-welcome {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #1a1814;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .lg-welcome-sub {
          font-size: 14px;
          color: #9a9590;
          margin-bottom: 36px;
        }
        .lg-error {
          background: #fde8e6;
          border: 1px solid #f5c6c2;
          border-left: 3px solid #c0392b;
          color: #922b21;
          font-size: 13px;
          padding: 11px 14px;
          border-radius: 6px;
          margin-bottom: 22px;
        }
        .lg-field { margin-bottom: 20px; }
        .lg-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #5a5650;
          margin-bottom: 7px;
          letter-spacing: 0.2px;
        }
        .lg-input-wrap { position: relative; }
        .lg-input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e2dfd9;
          border-radius: 8px;
          color: #1a1814;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          padding: 11px 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .lg-input:focus {
          border-color: #c8873a;
          box-shadow: 0 0 0 3px rgba(200,135,58,0.12);
        }
        .lg-input::placeholder { color: #c8c4bc; }
        .lg-eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #b0aca6;
          cursor: pointer;
          padding: 3px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .lg-eye:hover { color: #c8873a; }
        .lg-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .lg-check-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #7a7570;
          cursor: pointer;
        }
        .lg-check {
          width: 15px;
          height: 15px;
          accent-color: #c8873a;
          cursor: pointer;
        }
        .lg-forgot {
          font-size: 13px;
          color: #c8873a;
          font-weight: 500;
          transition: color 0.2s;
        }
        .lg-forgot:hover { color: #a06828; }
        .lg-btn {
          width: 100%;
          background: #c8873a;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 13px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.3);
          letter-spacing: 0.2px;
        }
        .lg-btn:hover { background: #a06828; box-shadow: 0 4px 14px rgba(200,135,58,0.35); }
        .lg-btn:active { transform: scale(0.99); }
        .lg-btn:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .lg-spinner {
          display: inline-block;
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lgSpin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes lgSpin { to { transform: rotate(360deg); } }
        .lg-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0;
          color: #c8c4bc;
          font-size: 12px;
        }
        .lg-divider::before, .lg-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2dfd9;
        }
        .lg-register {
          text-align: center;
          font-size: 13px;
          color: #9a9590;
        }
        .lg-register a {
          color: #c8873a;
          font-weight: 600;
          margin-left: 5px;
          transition: color 0.2s;
        }
        .lg-register a:hover { color: #a06828; }
        @media (max-width: 768px) {
          .lg-root { grid-template-columns: 1fr; }
          .lg-left { display: none; }
          .lg-right { padding: 36px 24px; }
        }
      `}</style>

      <div className="lg-root">
        <div className="lg-left">
          <div className="lg-left-pattern" />
          <div className="lg-brand">
            <div className="lg-brand-icon">⚙️</div>
            <div className="lg-brand-name">Gear<span>Guard</span></div>
          </div>
          <div className="lg-hero">
            <div className="lg-tagline">
              Maintain.<br />
              <em>Track.</em>
              Protect.
            </div>
            <p className="lg-sub">
              A unified platform for equipment maintenance, team coordination, and real-time request management across your organization.
            </p>
          </div>
          <div className="lg-stats">
            <div className="lg-stat">
              <div className="lg-stat-num">4</div>
              <div className="lg-stat-label">User Roles</div>
            </div>
            <div className="lg-stat">
              <div className="lg-stat-num">∞</div>
              <div className="lg-stat-label">Equipment</div>
            </div>
            <div className="lg-stat">
              <div className="lg-stat-num">9</div>
              <div className="lg-stat-label">Modules</div>
            </div>
          </div>
        </div>

        <div className="lg-right">
          <div className="lg-form-wrap">
            <h1 className="lg-welcome">Welcome</h1>
            <p className="lg-welcome-sub">Sign in to your maintenance dashboard</p>

            {error && <div className="lg-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="lg-field">
                <label className="lg-label" htmlFor="email">Email Address</label>
                <div className="lg-input-wrap">
                  <input
                    className="lg-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="lg-field">
                <label className="lg-label" htmlFor="password">Password</label>
                <div className="lg-input-wrap">
                  <input
                    className="lg-input"
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button" className="lg-eye" onClick={() => setShowPass(v => !v)}>
                    <EyeIcon show={showPass} />
                  </button>
                </div>
              </div>

              <div className="lg-row">
                <label className="lg-check-label">
                  <input className="lg-check" type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                  Remember me
                </label>
                <a href="/forgot-password" className="lg-forgot">Forgot password?</a>
              </div>

              <button className="lg-btn" type="submit" disabled={loading}>
                {loading && <span className="lg-spinner" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="lg-divider">or</div>

            <div className="lg-register">
              Don't have an account?
              <a href="/register">Create one here</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
