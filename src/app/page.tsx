import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ── Ambient background blobs ── */
        .home-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .home-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(108,71,255,0.18) 0%, transparent 70%);
          top: -120px; left: -100px;
          animation: blobDrift 12s ease-in-out infinite alternate;
        }
        .home-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%);
          bottom: -80px; right: -60px;
          animation: blobDrift 15s ease-in-out infinite alternate-reverse;
        }
        .home-blob-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(155,114,255,0.1) 0%, transparent 70%);
          top: 50%; right: 10%;
          animation: blobDrift 10s ease-in-out infinite alternate;
        }
        @keyframes blobDrift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }

        /* ── Grid overlay ── */
        .home-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
          pointer-events: none;
        }

        /* ── Content ── */
        .home-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          text-align: center;
          animation: homeIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes homeIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Logo ── */
        .home-logo-wrap {
          position: relative;
          margin-bottom: 32px;
          animation: homeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both;
        }
        .home-logo-ring {
          width: 96px; height: 96px;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(108,71,255,0.2), 0 8px 32px rgba(108,71,255,0.2), 0 2px 8px rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
        }
        .home-logo-glow {
          position: absolute;
          inset: -20px;
          border-radius: 40px;
          background: radial-gradient(circle, rgba(108,71,255,0.25) 0%, transparent 70%);
          z-index: -1;
          animation: pulseGlow 3s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }

        /* ── Badge ── */
        .home-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px;
          border-radius: 20px;
          border: 1px solid rgba(108,71,255,0.3);
          background: rgba(108,71,255,0.1);
          color: #a78bfa;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
          animation: homeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .home-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6c47ff;
          box-shadow: 0 0 6px #6c47ff;
          animation: pulseGlow 2s ease-in-out infinite;
        }

        /* ── Heading ── */
        .home-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 6vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 20px;
          animation: homeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s both;
        }
        .home-title-accent {
          background: linear-gradient(135deg, #6c47ff, #9b72ff, #00c9a7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Subtitle ── */
        .home-sub {
          font-size: 1rem;
          color: #666;
          max-width: 420px;
          line-height: 1.7;
          margin-bottom: 40px;
          animation: homeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both;
        }

        /* ── CTA button ── */
        .home-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6c47ff, #9b72ff);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(108,71,255,0.4), 0 1px 0 rgba(255,255,255,0.1) inset;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          animation: homeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s both;
        }
        .home-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(108,71,255,0.55), 0 1px 0 rgba(255,255,255,0.1) inset;
        }
        .home-cta:active { transform: scale(0.97); }
        .home-cta-arrow {
          transition: transform 0.18s;
        }
        .home-cta:hover .home-cta-arrow { transform: translateX(4px); }

        /* ── Stats row ── */
        .home-stats {
          display: flex;
          gap: 32px;
          margin-top: 56px;
          animation: homeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both;
          flex-wrap: wrap;
          justify-content: center;
        }
        .home-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .home-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .home-stat-label {
          font-size: 0.75rem;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .home-stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.08);
          align-self: center;
        }

        /* ── Feature pills ── */
        .home-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 28px;
          animation: homeIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }
        .home-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 13px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: #666;
          font-size: 0.78rem;
        }
        .home-pill-icon { font-size: 0.85rem; }
      `}</style>

      <div className="home-root">
        {/* Background */}
        <div className="home-grid" />
        <div className="home-blob home-blob-1" />
        <div className="home-blob home-blob-2" />
        <div className="home-blob home-blob-3" />

        <div className="home-content">
          {/* Logo */}
          <div className="home-logo-wrap">
            <div className="home-logo-glow" />
            <div className="home-logo-ring">
              <Image src="/slooze-logo.png" alt="Slooze" width={56} height={56} style={{ borderRadius: 12 }} />
            </div>
          </div>

          {/* Badge */}
          <div className="home-badge">
            <span className="home-badge-dot" />
            Inventory Management Platform
          </div>

          {/* Title */}
          <h1 className="home-title">
            Manage your stock<br />
            <span className="home-title-accent">smarter, faster.</span>
          </h1>

          {/* Subtitle */}
          <p className="home-sub">
            Track commodities, monitor stock levels, and get real-time insights — all in one clean, powerful dashboard.
          </p>

          {/* CTA */}
          <Link href="/login" className="home-cta">
            Get Started
            <svg className="home-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>

          {/* Feature pills */}
          <div className="home-pills">
            {[
              { icon: "📦", label: "Product Tracking" },
              { icon: "📊", label: "Live Dashboard" },
              { icon: "⚠️", label: "Low Stock Alerts" },
              { icon: "🔒", label: "Role-Based Access" },
            ].map(p => (
              <span key={p.label} className="home-pill">
                <span className="home-pill-icon">{p.icon}</span>
                {p.label}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="home-stats">
            {[
              { value: "2", label: "User Roles" },
              { value: "∞", label: "Products" },
              { value: "100%", label: "Role Guarded" },
            ].map((s, i, arr) => (
              <React.Fragment key={s.label}>
                <div className="home-stat">
                  <span className="home-stat-value">{s.value}</span>
                  <span className="home-stat-label">{s.label}</span>
                </div>
                {i < arr.length - 1 && <div className="home-stat-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
