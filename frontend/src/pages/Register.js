import authService from '../services/authService';
import { useState } from "react";

// eslint-disable-next-line no-unused-vars
const GearIcon = () => null;

const EyeIcon = ({ show }) =>
  show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

// eslint-disable-next-line no-unused-vars
const CheckIcon = () => null;

const DEPARTMENTS = ["IT", "Engineering", "Facilities", "Operations", "HR", "Finance", "Other"];

function PasswordStrength({ password }) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  // eslint-disable-next-line no-unused-vars
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#c0392b", "#b07d1a", "#2563a8", "#2d7a4f"];

  if (!password) return null;

  return (
    <div style={{ marginTop: 6, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= score ? colors[score] : "#e2dfd9",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {Object.entries({ "8+ chars": checks.length, Uppercase: checks.upper, Lowercase: checks.lower, Number: checks.number }).map(([label, ok]) => (
          <span key={label} style={{ fontSize: 11, color: ok ? "#2d7a4f" : "#c8c4bc", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
            {ok ? '✓' : '○'} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    fullName: "", username: "", email: "",
    password: "", confirmPassword: "",
    department: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal, 2 = credentials

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Min 3 characters";
    if (!form.department) e.department = "Please select a department";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep2()) return;
  setLoading(true);
  try {
    await authService.register({
      fullName: form.fullName,
      username: form.username,
      email: form.email,
      password: form.password,
      department: form.department,
    });
    setLoading(false);
    setSuccess(true);
  } catch (err) {
    setErrors({ confirmPassword: err.message || 'Registration failed' });
    setLoading(false);
  }
};

  return (
    <>
      <style>{`
        .gg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Inter', sans-serif;
          background: #f5f4f0;
        }
        .gg-left {
          background: #1c1a17;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
          position: relative; overflow: hidden;
        }
        .gg-left-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 20% 80%, rgba(200,135,58,0.12) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(200,135,58,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .gg-logo { display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; }
        .gg-logo-icon {
          width: 36px; height: 36px; background: #c8873a; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; font-size: 17px;
        }
        .gg-logo-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; color: #fff; }
        .gg-logo-text span { color: #c8873a; }
        .gg-steps { position: relative; z-index: 1; }
        .gg-steps-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 38px; font-weight: 800;
          color: #fff; margin-bottom: 36px;
          line-height: 1.1; letter-spacing: -0.5px;
        }
        .gg-steps-title em { color: #c8873a; font-style: normal; display: block; }
        .gg-step-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 22px; }
        .gg-step-num {
          width: 30px; height: 30px; border-radius: 50%;
          border: 2px solid #3a3830;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 13px; color: #4a4640;
          flex-shrink: 0; transition: all 0.3s;
        }
        .gg-step-num.active { border-color: #c8873a; color: #c8873a; background: rgba(200,135,58,0.12); }
        .gg-step-num.done { border-color: #2d7a4f; color: #2d7a4f; background: rgba(45,122,79,0.12); }
        .gg-step-info { padding-top: 3px; }
        .gg-step-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .gg-step-desc { font-size: 12px; color: #5a5650; }
        .gg-left-bottom { position: relative; z-index: 1; }
        .gg-role-badges { display: flex; flex-wrap: wrap; gap: 7px; }
        .gg-badge {
          font-size: 11px; padding: 5px 11px; border-radius: 20px;
          border: 1px solid #3a3830; color: #5a5650; font-weight: 500;
        }
        .gg-badge.highlight { border-color: #c8873a; color: #c8873a; background: rgba(200,135,58,0.08); }
        .gg-right {
          display: flex; align-items: center; justify-content: center;
          padding: 52px 56px; background: #f5f4f0; overflow-y: auto;
        }
        .gg-card { width: 100%; max-width: 440px; animation: ggFadeUp 0.45s ease both; }
        @keyframes ggFadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .gg-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800;
          color: #1a1814; margin-bottom: 4px; letter-spacing: -0.4px;
        }
        .gg-heading-sub { font-size: 13.5px; color: #9a9590; margin-bottom: 28px; }
        .gg-progress { display: flex; gap: 6px; margin-bottom: 28px; }
        .gg-progress-bar { flex: 1; height: 3px; background: #e2dfd9; border-radius: 2px; transition: background 0.4s; }
        .gg-progress-bar.filled { background: #c8873a; }
        .gg-label { display: block; font-size: 12px; font-weight: 600; color: #5a5650; margin-bottom: 6px; }
        .gg-input-wrap { position: relative; margin-bottom: 16px; }
        .gg-input {
          width: 100%; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #1a1814; font-family: 'Inter', sans-serif;
          font-size: 14px; padding: 10px 13px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; appearance: none;
        }
        .gg-input:focus { border-color: #c8873a; box-shadow: 0 0 0 3px rgba(200,135,58,0.10); }
        .gg-input.error { border-color: #c0392b; }
        .gg-input::placeholder { color: #c8c4bc; }
        .gg-field-error { font-size: 12px; color: #c0392b; margin-top: 4px; display: block; }
        .gg-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: #b0aca6;
          cursor: pointer; padding: 3px; transition: color 0.2s;
          display: flex; align-items: center;
        }
        .gg-eye:hover { color: #c8873a; }
        .gg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .gg-btn-row { display: flex; gap: 10px; margin-top: 8px; }
        .gg-btn {
          flex: 1; background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 13px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .gg-btn:hover { background: #a06828; }
        .gg-btn:active { transform: scale(0.99); }
        .gg-btn:disabled { background: #d4d0c8; color: #9a9590; cursor: not-allowed; box-shadow: none; }
        .gg-btn-outline {
          flex: 0 0 auto; background: #fff;
          border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #7a7570; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 13px 20px; cursor: pointer; transition: all 0.2s;
        }
        .gg-btn-outline:hover { border-color: #c8c4bc; color: #1a1814; }
        .gg-spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: ggSpin 0.7s linear infinite;
          vertical-align: middle; margin-right: 7px;
        }
        @keyframes ggSpin { to { transform: rotate(360deg); } }
        .gg-success { text-align: center; padding: 40px 20px; animation: ggFadeUp 0.5s ease both; }
        .gg-success-icon {
          width: 68px; height: 68px;
          border: 2px solid #2d7a4f; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 22px; background: #d4eddf;
        }
        .gg-success-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 26px; font-weight: 800;
          color: #1a1814; margin-bottom: 8px;
        }
        .gg-success-sub { font-size: 14px; color: #9a9590; margin-bottom: 28px; }
        .gg-success-btn {
          display: inline-block; background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 13px 36px; cursor: pointer;
          transition: background 0.2s; box-shadow: 0 2px 8px rgba(200,135,58,0.28);
        }
        .gg-success-btn:hover { background: #a06828; }
        .gg-login-link { text-align: center; font-size: 13px; color: #9a9590; margin-top: 22px; }
        .gg-login-link a { color: #c8873a; font-weight: 600; margin-left: 5px; transition: color 0.2s; }
        .gg-login-link a:hover { color: #a06828; }
        @media (max-width: 768px) {
          .gg-root { grid-template-columns: 1fr; }
          .gg-left { display: none; }
          .gg-right { padding: 36px 24px; align-items: flex-start; }
          .gg-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="gg-root">
        {/* LEFT PANEL */}
        <div className="gg-left">
          <div className="gg-left-pattern" />
          <div className="gg-logo">
            <div className="gg-logo-icon">⚙️</div>
            <div className="gg-logo-text">Gear<span>Guard</span></div>
          </div>

          <div className="gg-steps">
            <div className="gg-steps-title">
              Join the<br />
              <em>Platform.</em>
            </div>
            {[
              { n: 1, name: "Personal Info", desc: "Your name, role & department" },
              { n: 2, name: "Credentials", desc: "Email & secure password" },
              { n: 3, name: "Access Granted", desc: "Start managing equipment" },
            ].map(({ n, name, desc }) => (
              <div className="gg-step-item" key={n}>
                <div className={`gg-step-num ${step === n ? "active" : step > n || success ? "done" : ""}`}>
                  {(step > n || success) ? '✓' : n}
                </div>
                <div className="gg-step-info">
                  <div className="gg-step-name">{name}</div>
                  <div className="gg-step-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="gg-left-bottom">
            <div style={{ fontSize: 11, color: "#4a4640", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Role assignment</div>
            <div className="gg-role-badges">
              <div className="gg-badge highlight">User</div>
              <div style={{ fontSize: 11, color: '#9a9590', marginTop: 10, maxWidth: 280 }}>
                All sign-ups are registered as User accounts automatically. Role selection is not available on public registration.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="gg-right">
          <div className="gg-card">
            {success ? (
              <div className="gg-success">
                <div className="gg-success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="gg-success-title">You're In!</div>
                <p className="gg-success-sub">Account created for <strong style={{ color: "#1a1814" }}>{form.fullName}</strong>.<br />Please wait for admin approval.</p>
                <button className="gg-success-btn" onClick={() => window.location.href = "/login"}>
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <h1 className="gg-heading">{step === 1 ? "Create Account" : "Set Credentials"}</h1>
                <p className="gg-heading-sub">
                  {step === 1 ? "Tell us about yourself" : "Secure your account"}
                </p>

                <div className="gg-progress">
                  <div className={`gg-progress-bar ${step >= 1 ? "filled" : ""}`} />
                  <div className={`gg-progress-bar ${step >= 2 ? "filled" : ""}`} />
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {step === 1 && (
                    <>
                      <div className="gg-input-wrap">
                        <label className="gg-label">Full Name</label>
                        <input
                          className={`gg-input ${errors.fullName ? "error" : ""}`}
                          name="fullName"
                          type="text"
                          placeholder="John Smith"
                          value={form.fullName}
                          onChange={handleChange}
                        />
                        {errors.fullName && <span className="gg-field-error">{errors.fullName}</span>}
                      </div>

                      <div className="gg-input-wrap">
                        <label className="gg-label">Username</label>
                        <input
                          className={`gg-input ${errors.username ? "error" : ""}`}
                          name="username"
                          type="text"
                          placeholder="johnsmith"
                          value={form.username}
                          onChange={handleChange}
                        />
                        {errors.username && <span className="gg-field-error">{errors.username}</span>}
                      </div>

                      <div className="gg-input-wrap">
                        <label className="gg-label">Department</label>
                        <select
                          className={`gg-input ${errors.department ? "error" : ""}`}
                          name="department"
                          value={form.department}
                          onChange={handleChange}
                        >
                          <option value="">Select dept.</option>
                          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {errors.department && <span className="gg-field-error">{errors.department}</span>}
                      </div>
                      <div className="gg-btn-row">
                        <button type="button" className="gg-btn" onClick={handleNext}>
                          Next Step →
                        </button>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="gg-input-wrap">
                        <label className="gg-label">Email Address</label>
                        <input
                          className={`gg-input ${errors.email ? "error" : ""}`}
                          name="email"
                          type="email"
                          placeholder="you@company.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && <span className="gg-field-error">{errors.email}</span>}
                      </div>

                      <div className="gg-input-wrap">
                        <label className="gg-label">Password</label>
                        <input
                          className={`gg-input ${errors.password ? "error" : ""}`}
                          name="password"
                          type={showPass ? "text" : "password"}
                          placeholder="Min 8 characters"
                          value={form.password}
                          onChange={handleChange}
                        />
                        <button type="button" className="gg-eye" onClick={() => setShowPass((v) => !v)}>
                          <EyeIcon show={showPass} />
                        </button>
                        {errors.password && <span className="gg-field-error">{errors.password}</span>}
                      </div>

                      <PasswordStrength password={form.password} />

                      <div className="gg-input-wrap">
                        <label className="gg-label">Confirm Password</label>
                        <input
                          className={`gg-input ${errors.confirmPassword ? "error" : ""}`}
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repeat password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                        <button type="button" className="gg-eye" onClick={() => setShowConfirm((v) => !v)}>
                          <EyeIcon show={showConfirm} />
                        </button>
                        {errors.confirmPassword && <span className="gg-field-error">{errors.confirmPassword}</span>}
                      </div>

                      <div className="gg-btn-row">
                        <button type="button" className="gg-btn-outline" onClick={() => setStep(1)}>
                          ← Back
                        </button>
                        <button type="submit" className="gg-btn" disabled={loading}>
                          {loading && <span className="gg-spinner" />}
                          {loading ? "Creating..." : "Create Account"}
                        </button>
                      </div>
                    </>
                  )}
                </form>

                <div className="gg-login-link">
                  Already have an account?
                  <a href="/login">Sign in</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}