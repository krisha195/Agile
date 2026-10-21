import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: '🔧', title: 'Equipment Management', desc: 'Register and track all company assets — machines, computers, vehicles and more.' },
    { icon: '👥', title: 'Team Coordination', desc: 'Create specialized teams and assign technicians to handle maintenance work.' },
    { icon: '📋', title: 'Maintenance Requests', desc: 'Submit corrective or preventive requests and track them through every stage.' },
    { icon: '📊', title: 'Kanban & Reports', desc: 'Visualize work on a drag-and-drop board and generate detailed analytics.' },
    { icon: '📅', title: 'Calendar View', desc: 'Schedule preventive maintenance and never miss a service date again.' },
    { icon: '⚡', title: 'Real-time Updates', desc: 'Every change made by any user is instantly visible across the entire system.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          background: #f5f4f0;
          font-family: 'Inter', sans-serif;
          color: #1a1814;
          overflow-x: hidden;
        }

        /* ── NAVBAR ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 60px;
          height: 68px;
          background: rgba(245,244,240,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226,223,217,0.8);
        }
        .lp-nav-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .lp-nav-icon {
          width: 36px; height: 36px;
          background: #c8873a; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
        }
        .lp-nav-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #1a1814; letter-spacing: -0.3px;
        }
        .lp-nav-name span { color: #c8873a; }
        .lp-nav-links {
          display: flex; align-items: center; gap: 8px;
        }
        .lp-nav-signin {
          background: none;
          border: 1.5px solid #e2dfd9; border-radius: 8px;
          color: #5a5650; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 9px 20px; cursor: pointer;
          transition: all 0.2s;
        }
        .lp-nav-signin:hover { border-color: #c8873a; color: #c8873a; background: #fdf6ee; }
        .lp-nav-signup {
          background: #c8873a; border: none; border-radius: 8px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 9px 20px; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(200,135,58,0.3);
        }
        .lp-nav-signup:hover { background: #a06828; }

        /* ── HERO ── */
        .lp-hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative;
          overflow: hidden;
        }
        .lp-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,135,58,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(200,135,58,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .lp-hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: #fff; border: 1px solid #e2dfd9;
          border-radius: 20px; padding: 6px 16px;
          font-size: 12.5px; font-weight: 600; color: #c8873a;
          margin-bottom: 28px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          animation: lpFadeUp 0.5s ease both;
        }
        .lp-hero-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #c8873a;
          animation: lpPulse 2s infinite;
        }
        @keyframes lpPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.3);} }

        .lp-hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -2px;
          color: #1a1814;
          margin-bottom: 24px;
          max-width: 820px;
          animation: lpFadeUp 0.55s 0.05s ease both;
        }
        .lp-hero-title em {
          font-style: normal;
          color: #c8873a;
          position: relative;
        }
        .lp-hero-title em::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c8873a, #f0b060);
          border-radius: 2px;
          opacity: 0.4;
        }
        .lp-hero-sub {
          font-size: 18px; font-weight: 400;
          color: #7a7570; line-height: 1.7;
          max-width: 560px; margin-bottom: 44px;
          animation: lpFadeUp 0.55s 0.1s ease both;
        }
        .lp-hero-btns {
          display: flex; gap: 12px; flex-wrap: wrap;
          justify-content: center;
          animation: lpFadeUp 0.55s 0.15s ease both;
          margin-bottom: 64px;
        }
        .lp-hero-cta {
          background: #c8873a; border: none; border-radius: 10px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          padding: 14px 32px; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(200,135,58,0.35);
        }
        .lp-hero-cta:hover { background: #a06828; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,135,58,0.4); }
        .lp-hero-cta:active { transform: translateY(0); }
        .lp-hero-outline {
          background: #fff; border: 1.5px solid #e2dfd9; border-radius: 10px;
          color: #5a5650; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 600;
          padding: 14px 32px; cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .lp-hero-outline:hover { border-color: #c8873a; color: #c8873a; transform: translateY(-2px); }

        .lp-hero-stats {
          display: flex; gap: 48px; flex-wrap: wrap; justify-content: center;
          animation: lpFadeUp 0.55s 0.2s ease both;
        }
        .lp-hero-stat { text-align: center; }
        .lp-hero-stat-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 32px; font-weight: 900;
          color: #1a1814; letter-spacing: -1px;
        }
        .lp-hero-stat-num span { color: #c8873a; }
        .lp-hero-stat-label { font-size: 13px; color: #9a9590; font-weight: 500; margin-top: 2px; }

        @keyframes lpFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── DIVIDER ── */
        .lp-divider {
          height: 1px; background: #e2dfd9;
          margin: 0 60px;
        }

        /* ── FEATURES ── */
        .lp-features {
          padding: 100px 60px;
          max-width: 1200px; margin: 0 auto;
        }
        .lp-section-label {
          font-size: 12px; font-weight: 700;
          color: #c8873a; letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 12px;
          text-align: center;
        }
        .lp-section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800; letter-spacing: -0.8px;
          color: #1a1814; text-align: center;
          margin-bottom: 14px;
        }
        .lp-section-sub {
          font-size: 16px; color: #9a9590;
          text-align: center; max-width: 500px;
          margin: 0 auto 60px; line-height: 1.7;
        }
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .lp-feature-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #e2dfd9;
          padding: 28px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .lp-feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.09); }
        .lp-feature-icon {
          width: 48px; height: 48px;
          background: #fdf6ee; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 18px;
        }
        .lp-feature-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #1a1814; margin-bottom: 8px;
        }
        .lp-feature-desc { font-size: 14px; color: #7a7570; line-height: 1.65; }

        /* ── HOW IT WORKS ── */
        .lp-how {
          background: #1c1a17;
          padding: 100px 60px;
        }
        .lp-how-inner { max-width: 1100px; margin: 0 auto; }
        .lp-how .lp-section-label { color: #c8873a; }
        .lp-how .lp-section-title { color: #fff; }
        .lp-how .lp-section-sub { color: #5a5650; }
        .lp-steps-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 24px; position: relative;
        }
        .lp-steps-row::before {
          content: '';
          position: absolute;
          top: 28px; left: calc(12.5% + 14px); right: calc(12.5% + 14px);
          height: 2px;
          background: linear-gradient(90deg, #c8873a, rgba(200,135,58,0.2));
          z-index: 0;
        }
        .lp-step {
          text-align: center; position: relative; z-index: 1;
        }
        .lp-step-num {
          width: 56px; height: 56px;
          background: #c8873a; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 800; color: #fff;
          margin: 0 auto 18px;
          box-shadow: 0 4px 16px rgba(200,135,58,0.4);
        }
        .lp-step-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700; color: #fff;
          margin-bottom: 8px;
        }
        .lp-step-desc { font-size: 13px; color: #5a5650; line-height: 1.6; }

        /* ── TEAM ── */
        .lp-team {
          padding: 100px 60px;
          max-width: 1100px; margin: 0 auto;
        }
        .lp-team-cards {
          display: flex; gap: 24px; justify-content: center;
          flex-wrap: wrap; margin-top: 52px;
        }
        .lp-team-card {
          background: #fff; border-radius: 20px;
          border: 1px solid #e2dfd9;
          padding: 40px 48px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
          min-width: 260px;
        }
        .lp-team-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.11); }
        .lp-team-avatar {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8873a, #f0b060);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 30px; font-weight: 900; color: #fff;
          margin: 0 auto 20px;
          box-shadow: 0 6px 20px rgba(200,135,58,0.35);
        }
        .lp-team-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #1a1814; margin-bottom: 6px;
          letter-spacing: -0.3px;
        }
        .lp-team-roll {
          font-size: 13px; color: #9a9590;
          font-weight: 500; margin-bottom: 14px;
        }
        .lp-team-tag {
          display: inline-block;
          background: #fdf6ee; color: #c8873a;
          border: 1px solid #f5e6d3;
          border-radius: 20px; padding: 4px 14px;
          font-size: 12px; font-weight: 600;
        }

        /* ── CTA BANNER ── */
        .lp-cta-section {
          background: linear-gradient(135deg, #1c1a17 0%, #2a2520 100%);
          padding: 90px 60px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .lp-cta-section::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,135,58,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-cta-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900; color: #fff;
          letter-spacing: -1px; margin-bottom: 16px;
          position: relative; z-index: 1;
        }
        .lp-cta-title span { color: #c8873a; }
        .lp-cta-sub {
          font-size: 16px; color: #5a5650;
          margin-bottom: 40px; position: relative; z-index: 1;
        }
        .lp-cta-btns {
          display: flex; gap: 12px; justify-content: center;
          flex-wrap: wrap; position: relative; z-index: 1;
        }
        .lp-cta-primary {
          background: #c8873a; border: none; border-radius: 10px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          padding: 14px 36px; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(200,135,58,0.4);
        }
        .lp-cta-primary:hover { background: #a06828; transform: translateY(-2px); }
        .lp-cta-secondary {
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.15); border-radius: 10px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 600;
          padding: 14px 36px; cursor: pointer;
          transition: all 0.2s;
        }
        .lp-cta-secondary:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.3); }

        /* ── FOOTER ── */
        .lp-footer {
          background: #1c1a17;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 32px 60px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .lp-footer-brand {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 800; color: #fff;
        }
        .lp-footer-brand span { color: #c8873a; }
        .lp-footer-copy { font-size: 13px; color: #4a4640; }
        .lp-footer-links { display: flex; gap: 20px; }
        .lp-footer-link {
          font-size: 13px; color: #5a5650;
          background: none; border: none; cursor: pointer;
          transition: color 0.2s; font-family: 'Inter', sans-serif;
        }
        .lp-footer-link:hover { color: #c8873a; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .lp-nav { padding: 0 24px; }
          .lp-features { padding: 70px 24px; }
          .lp-features-grid { grid-template-columns: 1fr 1fr; }
          .lp-how { padding: 70px 24px; }
          .lp-steps-row { grid-template-columns: 1fr 1fr; }
          .lp-steps-row::before { display: none; }
          .lp-team { padding: 70px 24px; }
          .lp-cta-section { padding: 70px 24px; }
          .lp-footer { padding: 24px; flex-direction: column; text-align: center; }
        }
        @media (max-width: 600px) {
          .lp-features-grid { grid-template-columns: 1fr; }
          .lp-steps-row { grid-template-columns: 1fr; }
          .lp-hero-stats { gap: 28px; }
          .lp-nav-signin { display: none; }
        }
      `}</style>

      <div className="lp-root">

        {/* NAVBAR */}
        <nav className="lp-nav">
          <div className="lp-nav-brand">
            <div className="lp-nav-icon">⚙️</div>
            <div className="lp-nav-name">Gear<span>Guard</span></div>
          </div>
          <div className="lp-nav-links">
            <button className="lp-nav-signin" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-nav-signup" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-bg" />

          <h1 className="lp-hero-title">
            Smart Maintenance<br />
            Management for <em>Modern</em><br />
            Organizations
          </h1>

          <p className="lp-hero-sub">
            GearGuard connects your equipment, teams, and maintenance requests in one unified platform - so nothing ever falls through the cracks.
          </p>

          <div className="lp-hero-btns">
            <button className="lp-hero-cta" onClick={() => navigate('/register')}>
              Get Started Free →
            </button>
            <button className="lp-hero-outline" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>

          <div className="lp-hero-stats">
            <div className="lp-hero-stat">
              <div className="lp-hero-stat-num">4<span>+</span></div>
              <div className="lp-hero-stat-label">User Roles</div>
            </div>
            <div className="lp-hero-stat">
              <div className="lp-hero-stat-num">9<span>+</span></div>
              <div className="lp-hero-stat-label">Modules</div>
            </div>
            <div className="lp-hero-stat">
              <div className="lp-hero-stat-num">∞</div>
              <div className="lp-hero-stat-label">Equipment Tracked</div>
            </div>
            <div className="lp-hero-stat">
              <div className="lp-hero-stat-num">100<span>%</span></div>
              <div className="lp-hero-stat-label">Real-time Sync</div>
            </div>
          </div>
        </section>

        <div className="lp-divider" />

        {/* FEATURES */}
        <section className="lp-features">
          <div className="lp-section-label">What We Offer</div>
          <h2 className="lp-section-title">Everything you need to manage maintenance</h2>
          <p className="lp-section-sub">From registering assets to closing repair tickets — GearGuard handles the full lifecycle.</p>

          <div className="lp-features-grid">
            {features.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-how">
          <div className="lp-how-inner">
            <div className="lp-section-label">How It Works</div>
            <h2 className="lp-section-title">From request to resolution</h2>
            <p className="lp-section-sub">A simple four-step workflow that keeps everyone on the same page.</p>

            <div className="lp-steps-row">
              {[
                { n: '1', title: 'Register Equipment', desc: 'Add all your assets with details like category, department and warranty.' },
                { n: '2', title: 'Create a Request', desc: 'Select equipment — team and category auto-fill instantly.' },
                { n: '3', title: 'Assign & Track', desc: 'Assign a technician and move the request through the Kanban board.' },
                { n: '4', title: 'Close & Report', desc: 'Mark as repaired, log costs, and generate analytics reports.' },
              ].map(s => (
                <div key={s.n} className="lp-step">
                  <div className="lp-step-num">{s.n}</div>
                  <div className="lp-step-title">{s.title}</div>
                  <div className="lp-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="lp-team">
          <div className="lp-section-label">Built By</div>
          <h2 className="lp-section-title">Meet the Team</h2>
          <p className="lp-section-sub">
            GearGuard was designed and developed as part of the Advanced Web Technology course at our university.
          </p>

          <div className="lp-team-cards">
            <div className="lp-team-card">
              <div className="lp-team-avatar">T</div>
              <div className="lp-team-name">Tisha Boda</div>
              <div className="lp-team-roll">Roll No. 23BCP041</div>
              <span className="lp-team-tag">Full Stack Developer</span>
            </div>

            <div className="lp-team-card">
              <div className="lp-team-avatar">K</div>
              <div className="lp-team-name">Krisha Patel</div>
              <div className="lp-team-roll">Roll No. 23BCP045</div>
              <span className="lp-team-tag">Full Stack Developer</span>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="lp-cta-section">
          <h2 className="lp-cta-title">Ready to take control of<br /><span>your maintenance?</span></h2>
          <p className="lp-cta-sub">Join GearGuard today and keep every asset running smoothly.</p>
          <div className="lp-cta-btns">
            <button className="lp-cta-primary" onClick={() => navigate('/register')}>
              Create Free Account
            </button>
            <button className="lp-cta-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-brand">Gear<span>Guard</span></div>
          <div className="lp-footer-copy">© 2024 GearGuard · Tisha Boda & Krisha Patel</div>
          <div className="lp-footer-links">
            <button className="lp-footer-link" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-footer-link" onClick={() => navigate('/register')}>Register</button>
          </div>
        </footer>

      </div>
    </>
  );
}
