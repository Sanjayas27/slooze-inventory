"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "#0a0a0a",
    headingColor: "#fff",
    subColor: "#888",
    featureColor: "#aaa",
    labelColor: "#888",
    divider: "#333",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardShadow: "0 8px 40px rgba(0,0,0,0.4)",
    logoBg: "#1a1a1a",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    inputColor: "#fff",
    placeholder: "#444",
    eyeIcon: "#555",
    eyeIconHover: "#aaa",
    demoSep: "rgba(255,255,255,0.07)",
    demoLabel: "#555",
    demoBtnBg: "rgba(255,255,255,0.03)",
    demoBtnBorder: "rgba(255,255,255,0.08)",
    demoBtnHover: "rgba(255,255,255,0.07)",
    demoBtnHoverBorder: "rgba(255,255,255,0.15)",
    demoEmail: "#666",
    toggleBg: "rgba(255,255,255,0.06)",
    toggleBorder: "rgba(255,255,255,0.12)",
    toggleIcon: "#ccc",
    toggleShadow: "rgba(0,0,0,0.3)",
    blobOpacity: "0.15",
  },
  light: {
    bg: "#f4f4f7",
    headingColor: "#111",
    subColor: "#666",
    featureColor: "#555",
    labelColor: "#777",
    divider: "#ddd",
    cardBg: "rgba(255,255,255,0.85)",
    cardBorder: "rgba(0,0,0,0.07)",
    cardShadow: "0 8px 40px rgba(0,0,0,0.08)",
    logoBg: "#f0f0f0",
    inputBg: "#fff",
    inputBorder: "rgba(0,0,0,0.12)",
    inputColor: "#111",
    placeholder: "#bbb",
    eyeIcon: "#aaa",
    eyeIconHover: "#555",
    demoSep: "rgba(0,0,0,0.08)",
    demoLabel: "#aaa",
    demoBtnBg: "rgba(0,0,0,0.02)",
    demoBtnBorder: "rgba(0,0,0,0.07)",
    demoBtnHover: "rgba(0,0,0,0.05)",
    demoBtnHoverBorder: "rgba(0,0,0,0.12)",
    demoEmail: "#999",
    toggleBg: "rgba(255,255,255,0.9)",
    toggleBorder: "rgba(0,0,0,0.1)",
    toggleIcon: "#555",
    toggleShadow: "rgba(0,0,0,0.1)",
    blobOpacity: "0.10",
  },
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dark, setDark] = useState(true);

  // Persist theme across sessions
  useEffect(() => {
    const saved = localStorage.getItem("slooze-theme");
    if (saved) setDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("slooze-theme", next ? "dark" : "light");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setError("");
    // Replace the line below with: const loggedInUser = await fetch('/auth/login', {...})
    await new Promise((r) => setTimeout(r, 600));
    const loggedInUser = login(email, password);
    setIsLoading(false);
    if (!loggedInUser) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    if (loggedInUser.role === "MANAGER") router.push("/dashboard");
    else if (loggedInUser.role === "STORE_KEEPER") router.push("/products");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const fillDemo = (type) => {
    setEmail(type === "manager" ? "manager@slooze.com" : "store@slooze.com");
    setPassword(type === "manager" ? "manager123" : "store123");
    setError("");
  };

  const t = dark ? themes.dark : themes.light;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lr { min-height:100vh;display:flex;font-family:'DM Sans',sans-serif;background:${t.bg};overflow:hidden;position:relative;transition:background 0.35s ease; }

        .blob { position:absolute;border-radius:50%;filter:blur(90px);opacity:${t.blobOpacity};pointer-events:none;transition:opacity 0.35s; }
        .b1 { width:500px;height:500px;background:#6c47ff;top:-120px;left:-100px;animation:d1 12s ease-in-out infinite alternate; }
        .b2 { width:400px;height:400px;background:#ff6b35;bottom:-80px;right:-60px;animation:d2 14s ease-in-out infinite alternate; }
        .b3 { width:300px;height:300px;background:#00c9a7;top:40%;left:55%;animation:d1 10s ease-in-out infinite alternate-reverse; }
        @keyframes d1 { from{transform:translate(0,0) scale(1)} to{transform:translate(30px,40px) scale(1.08)} }
        @keyframes d2 { from{transform:translate(0,0) scale(1)} to{transform:translate(-25px,-35px) scale(1.1)} }

        /* ── Theme toggle ── */
        .tt {
          position:fixed;top:20px;right:20px;z-index:100;
          width:44px;height:44px;border-radius:50%;
          border:1px solid ${t.toggleBorder};
          background:${t.toggleBg};
          cursor:pointer;display:flex;align-items:center;justify-content:center;
          color:${t.toggleIcon};
          transition:background 0.35s,border-color 0.35s,transform 0.2s,box-shadow 0.3s,color 0.35s;
          box-shadow:0 2px 12px ${t.toggleShadow};
          backdrop-filter:blur(10px);
        }
        .tt:hover { transform:scale(1.1) rotate(18deg);box-shadow:0 4px 20px ${t.toggleShadow}; }
        .tt:active { transform:scale(0.94); }

        /* ── Left panel ── */
        .lp { display:none;flex:1;align-items:center;justify-content:center;padding:60px;position:relative;z-index:1; }
        @media(min-width:900px){.lp{display:flex;}}
        .tg { font-family:'Syne',sans-serif;font-size:clamp(2.2rem,3.5vw,3.2rem);font-weight:800;color:${t.headingColor};line-height:1.1;letter-spacing:-0.02em;margin-bottom:20px;transition:color 0.35s; }
        .tg span { background:linear-gradient(135deg,#6c47ff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .ts { font-size:1rem;color:${t.subColor};line-height:1.6;margin-bottom:40px;transition:color 0.35s; }
        .fl { display:flex;flex-direction:column;gap:14px; }
        .fi { display:flex;align-items:center;gap:12px;color:${t.featureColor};font-size:0.9rem;transition:color 0.35s; }
        .fd { width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#6c47ff,#ff6b35);flex-shrink:0; }

        .dv { display:none;width:1px;background:linear-gradient(to bottom,transparent,${t.divider},transparent);margin:40px 0;position:relative;z-index:1;transition:background 0.35s; }
        @media(min-width:900px){.dv{display:block;}}

        /* ── Card ── */
        .rp { flex:1;display:flex;align-items:center;justify-content:center;padding:32px 20px;position:relative;z-index:1; }
        .card {
          width:100%;max-width:420px;
          background:${t.cardBg};border:1px solid ${t.cardBorder};
          border-radius:24px;padding:40px 36px;
          backdrop-filter:blur(20px);
          box-shadow:${t.cardShadow};
          animation:ci 0.5s cubic-bezier(0.22,1,0.36,1) both;
          transition:background 0.35s,border-color 0.35s,box-shadow 0.35s;
        }
        @keyframes ci { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

        .lw { display:flex;align-items:center;gap:12px;margin-bottom:28px; }
        .li { width:40px;height:40px;border-radius:10px;background:${t.logoBg};overflow:hidden;display:flex;align-items:center;justify-content:center;transition:background 0.35s; }
        .lt { font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:700;color:${t.headingColor};letter-spacing:-0.01em;transition:color 0.35s; }

        .ct { font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:700;color:${t.headingColor};margin-bottom:6px;letter-spacing:-0.02em;transition:color 0.35s; }
        .cs { font-size:0.875rem;color:${t.subColor};margin-bottom:28px;transition:color 0.35s; }

        .ig { display:flex;flex-direction:column;gap:14px;margin-bottom:10px; }
        .il { font-size:0.75rem;font-weight:500;color:${t.labelColor};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;transition:color 0.35s; }
        .iw { position:relative; }

        .inf {
          width:100%;background:${t.inputBg};border:1px solid ${t.inputBorder};
          border-radius:12px;padding:13px 16px;font-size:0.9375rem;
          color:${t.inputColor};font-family:'DM Sans',sans-serif;
          transition:border-color 0.2s,box-shadow 0.2s,background 0.35s,color 0.35s;outline:none;
        }
        .inf::placeholder { color:${t.placeholder}; }
        .inf:focus { border-color:rgba(108,71,255,0.6);box-shadow:0 0 0 3px rgba(108,71,255,0.12); }
        .inf.pt { padding-right:46px; }

        .eb {
          position:absolute;right:14px;top:50%;transform:translateY(-50%);
          background:none;border:none;cursor:pointer;color:${t.eyeIcon};
          padding:2px;display:flex;align-items:center;transition:color 0.2s;
        }
        .eb:hover { color:${t.eyeIconHover}; }

        .em {
          font-size:0.8rem;color:#ff6b6b;margin-top:14px;margin-bottom:4px;
          padding:10px 14px;background:rgba(255,107,107,0.08);
          border:1px solid rgba(255,107,107,0.2);border-radius:8px;
          display:flex;align-items:center;gap:8px;
          animation:sk 0.35s ease;
        }
        @keyframes sk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

        .lb {
          width:100%;padding:14px;border-radius:12px;border:none;
          background:linear-gradient(135deg,#6c47ff,#9b72ff);
          color:#fff;font-family:'Syne',sans-serif;font-size:0.9375rem;font-weight:600;
          cursor:pointer;letter-spacing:0.01em;
          box-shadow:0 4px 20px rgba(108,71,255,0.35);
          display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;
          transition:opacity 0.2s,transform 0.15s,box-shadow 0.2s;
        }
        .lb:hover:not(:disabled){opacity:0.92;box-shadow:0 6px 28px rgba(108,71,255,0.5);}
        .lb:active:not(:disabled){transform:scale(0.98);}
        .lb:disabled{opacity:0.4;cursor:not-allowed;}

        .sp { width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .ds { margin-top:28px;padding-top:20px;border-top:1px solid ${t.demoSep};transition:border-color 0.35s; }
        .dl { font-size:0.7rem;font-weight:500;color:${t.demoLabel};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;text-align:center;transition:color 0.35s; }
        .dg { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
        .db {
          padding:10px 12px;border-radius:10px;
          border:1px solid ${t.demoBtnBorder};background:${t.demoBtnBg};
          cursor:pointer;text-align:left;
          transition:background 0.2s,border-color 0.2s,transform 0.15s;
        }
        .db:hover{background:${t.demoBtnHover};border-color:${t.demoBtnHoverBorder};transform:translateY(-1px);}
        .db:active{transform:scale(0.98);}
        .dr { font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px; }
        .de { font-size:0.78rem;color:${t.demoEmail};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color 0.35s; }
        .rm { color:#6c47ff; } .rs { color:#00c9a7; }
      `}</style>

      <div className="lr">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />

        {/* ── Theme Toggle Button ── */}
        <button className="tt" onClick={toggleTheme} aria-label="Toggle light/dark theme">
          {dark ? (
            // Sun — switch to light
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            // Moon — switch to dark
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
        </button>

        {/* ── Left branding panel ── */}
        <div className="lp">
          <div style={{ maxWidth: 400 }}>
            <h2 className="tg">Inventory that<br /><span>moves with you.</span></h2>
            <p className="ts">Slooze gives your team real-time visibility across every store, every product, every shift.</p>
            <div className="fl">
              {["Live stock levels across all locations","Manager dashboard with full analytics","Role-based access for your entire team","Instant low-stock alerts"].map(f => (
                <div className="fi" key={f}><div className="fd" />{f}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="dv" />

        {/* ── Login card ── */}
        <div className="rp">
          <div className="card">
            <div className="lw">
              <div className="li">
                <Image src="/slooze-logo.png" alt="Slooze" width={40} height={40} />
              </div>
              <span className="lt">Slooze</span>
            </div>

            <h1 className="ct">Sign in</h1>
            <p className="cs">Access your workspace</p>

            <div className="ig">
              <div>
                <p className="il">Email</p>
                <input type="email" className="inf" placeholder="you@slooze.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown} autoComplete="email" />
              </div>
              <div>
                <p className="il">Password</p>
                <div className="iw">
                  <input type={showPassword ? "text" : "password"} className="inf pt"
                    placeholder="••••••••" value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown} autoComplete="current-password" />
                  <button type="button" className="eb" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="em">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button className="lb" onClick={handleLogin} disabled={!email || !password || isLoading}>
              {isLoading ? <><div className="sp" /> Signing in…</> : "Sign In"}
            </button>

            <div className="ds">
              <p className="dl">Quick demo access</p>
              <div className="dg">
                <button className="db" onClick={() => fillDemo("manager")}>
                  <p className="dr rm">Manager</p>
                  <p className="de">manager@slooze.com</p>
                </button>
                <button className="db" onClick={() => fillDemo("store")}>
                  <p className="dr rs">Store</p>
                  <p className="de">store@slooze.com</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
