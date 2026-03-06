"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync with login page's localStorage key "slooze-theme"
  useEffect(() => {
    const saved = localStorage.getItem("slooze-theme");
    if (saved) setDark(saved === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("slooze-theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      roles: ["MANAGER"],
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      label: "Products",
      path: "/products",
      roles: ["MANAGER", "STORE_KEEPER"],
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
  ];

  const t = dark ? tokens.dark : tokens.light;

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .al-root {
          display: flex;
          min-height: 100vh;
          background: ${t.mainBg};
          transition: background 0.35s ease;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Sidebar ── */
        .al-sidebar {
          width: ${collapsed ? "72px" : "240px"};
          min-height: 100vh;
          background: ${t.sidebarBg};
          border-right: 1px solid ${t.sidebarBorder};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 0;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1), background 0.35s, border-color 0.35s;
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }

        /* Subtle vertical accent line */
        .al-sidebar::after {
          content: '';
          position: absolute;
          top: 15%;
          right: 0;
          width: 2px;
          height: 70%;
          background: linear-gradient(to bottom, transparent, rgba(108,71,255,0.25), transparent);
          border-radius: 2px;
        }

        /* ── Logo area ── */
        .al-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 ${collapsed ? "18px" : "20px"};
          margin-bottom: 32px;
          transition: padding 0.3s;
          overflow: hidden;
        }
        .al-logo-img {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: ${t.logoBg};
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.35s;
        }
        .al-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: ${t.logoText};
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s, color 0.35s;
          letter-spacing: -0.01em;
        }

        /* ── Collapse toggle ── */
        .al-collapse-btn {
          position: absolute;
          top: 22px;
          right: -12px;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: ${t.collapseBg};
          border: 1px solid ${t.collapseBorder};
          color: ${t.collapseIcon};
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 10;
          transition: background 0.2s, border-color 0.35s, transform 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .al-collapse-btn:hover { background: ${t.collapseBgHover}; }
        .al-collapse-btn svg { transition: transform 0.3s; transform: rotate(${collapsed ? "180deg" : "0deg"}); }

        /* ── Nav ── */
        .al-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }

        .al-nav-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px ${collapsed ? "10px" : "12px"};
          border-radius: 10px;
          cursor: pointer;
          border: none;
          background: transparent;
          color: ${t.navColor};
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          text-align: left;
          width: 100%;
          transition: background 0.18s, color 0.18s, padding 0.3s;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
        }
        .al-nav-item:hover { background: ${t.navHoverBg}; color: ${t.navHoverColor}; }
        .al-nav-item.active {
          background: ${t.navActiveBg};
          color: ${t.navActiveColor};
          font-weight: 500;
        }
        /* Active left indicator */
        .al-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 25%; bottom: 25%;
          width: 3px;
          border-radius: 0 2px 2px 0;
          background: linear-gradient(to bottom, #6c47ff, #9b72ff);
        }

        .al-nav-icon { flex-shrink: 0; opacity: 0.8; }
        .al-nav-item.active .al-nav-icon { opacity: 1; }

        .al-nav-label {
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
          overflow: hidden;
        }

        /* ── Section label ── */
        .al-section-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: ${t.sectionLabel};
          padding: 0 24px;
          margin-bottom: 8px;
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s, color 0.35s;
        }

        /* ── Bottom controls ── */
        .al-bottom { padding: 0 12px; display: flex; flex-direction: column; gap: 6px; }

        .al-user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px ${collapsed ? "10px" : "12px"};
          border-radius: 10px;
          background: ${t.userChipBg};
          border: 1px solid ${t.userChipBorder};
          margin-bottom: 6px;
          overflow: hidden;
          transition: background 0.35s, border-color 0.35s, padding 0.3s;
        }
        .al-user-avatar {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6c47ff, #ff6b35);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          font-family: 'Syne', sans-serif;
        }
        .al-user-info { overflow: hidden; }
        .al-user-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: ${t.userNameColor};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.35s;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s, color 0.35s;
        }
        .al-user-role {
          font-size: 0.68rem;
          color: ${t.userRoleColor};
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s, color 0.35s;
        }

        /* icon-only control buttons */
        .al-ctrl-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px ${collapsed ? "10px" : "12px"};
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          text-align: left;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          transition: background 0.18s, color 0.18s, padding 0.3s;
        }
        .al-ctrl-label {
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }

        .al-theme-btn {
          background: ${t.themeBtnBg};
          color: ${t.themeBtnColor};
          border: 1px solid ${t.themeBtnBorder};
        }
        .al-theme-btn:hover { background: ${t.themeBtnHover}; }

        .al-logout-btn {
          background: rgba(239,68,68,0.08);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.15);
        }
        .al-logout-btn:hover { background: rgba(239,68,68,0.15); }

        /* ── Main content ── */
        .al-main {
          flex: 1;
          min-width: 0;
          background: ${t.mainBg};
          transition: background 0.35s;
          display: flex;
          flex-direction: column;
        }

        /* ── Top bar ── */
        .al-topbar {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          border-bottom: 1px solid ${t.topbarBorder};
          background: ${t.topbarBg};
          backdrop-filter: blur(10px);
          transition: background 0.35s, border-color 0.35s;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .al-breadcrumb {
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: ${t.breadcrumbColor};
          letter-spacing: -0.01em;
          transition: color 0.35s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .al-breadcrumb-sep { color: ${t.breadcrumbSep}; font-weight: 400; }
        .al-breadcrumb-page { color: ${t.breadcrumbPage}; }

        .al-topbar-right { display: flex; align-items: center; gap: 10px; }

        /* Topbar theme toggle pill — same style as login page button */
        .al-topbar-theme {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid ${t.toggleBorder};
          background: ${t.toggleBg};
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: ${t.toggleIcon};
          transition: background 0.35s, border-color 0.35s, transform 0.2s, box-shadow 0.3s, color 0.35s;
          box-shadow: 0 2px 10px ${t.toggleShadow};
          backdrop-filter: blur(8px);
        }
        .al-topbar-theme:hover { transform: scale(1.1) rotate(18deg); box-shadow: 0 4px 18px ${t.toggleShadow}; }
        .al-topbar-theme:active { transform: scale(0.94); }

        .al-topbar-logout {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.06);
          color: #ef4444;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          transition: background 0.18s, border-color 0.18s;
        }
        .al-topbar-logout:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); }

        .al-content { flex: 1; padding: 28px; overflow: auto; }

        /* ── Tooltip for collapsed nav ── */
        .al-nav-item { position: relative; }
        .al-tooltip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: ${t.tooltipBg};
          color: ${t.tooltipColor};
          font-size: 0.78rem;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 100;
          border: 1px solid ${t.tooltipBorder};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .al-nav-item:hover .al-tooltip { opacity: ${collapsed ? 1 : 0}; }
      `}</style>

      <div className="al-root">
        {/* ── Sidebar ── */}
        <aside className="al-sidebar">
          {/* Collapse toggle */}
          <button className="al-collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div>
            {/* Logo */}
            <div className="al-logo">
              <div className="al-logo-img">
                <Image src="/slooze-logo.png" alt="Slooze" width={36} height={36} />
              </div>
              <span className="al-logo-text">Slooze</span>
            </div>

            {/* Nav section */}
            <p className="al-section-label">Menu</p>
            <nav className="al-nav">
              {navItems
                .filter(item => user?.role && item.roles.includes(user.role))
                .map(item => (
                  <button
                    key={item.path}
                    className={`al-nav-item ${pathname === item.path ? "active" : ""}`}
                    onClick={() => router.push(item.path)}
                  >
                    <span className="al-nav-icon">{item.icon}</span>
                    <span className="al-nav-label">{item.label}</span>
                    {collapsed && <span className="al-tooltip">{item.label}</span>}
                  </button>
                ))}
            </nav>
          </div>

          {/* Bottom controls */}
          <div className="al-bottom">
            {/* User chip */}
            <div className="al-user-chip">
              <div className="al-user-avatar">
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="al-user-info">
                <p className="al-user-name">{user?.email ?? "User"}</p>
                <p className="al-user-role">{user?.role === "MANAGER" ? "Manager" : "Store Keeper"}</p>
              </div>
            </div>

            {/* Theme toggle */}
            <button className="al-ctrl-btn al-theme-btn" onClick={toggleTheme}>
              <span style={{ flexShrink: 0, display: "flex" }}>
                {dark ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
              </span>
              <span className="al-ctrl-label">{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Logout */}
            <button className="al-ctrl-btn al-logout-btn" onClick={handleLogout}>
              <span style={{ flexShrink: 0, display: "flex" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              <span className="al-ctrl-label">Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className="al-main">
          {/* Top bar */}
          <header className="al-topbar">
            <div className="al-breadcrumb">
              <span>Slooze</span>
              <span className="al-breadcrumb-sep">›</span>
              <span className="al-breadcrumb-page">
                {pathname === "/dashboard" ? "Dashboard" : pathname === "/products" ? "Products" : ""}
              </span>
            </div>

            <div className="al-topbar-right">
              {/* Theme toggle — same pill style as login page */}
              <button className="al-topbar-theme" onClick={toggleTheme} aria-label="Toggle theme">
                {dark ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
              </button>

              <button className="al-topbar-logout" onClick={handleLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </header>

          <main className="al-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

// ─── Theme tokens (mirrors login page system) ─────────────────────────────────
const tokens = {
  dark: {
    mainBg: "#0d0d0d",
    sidebarBg: "#111111",
    sidebarBorder: "rgba(255,255,255,0.07)",
    logoBg: "#1e1e1e",
    logoText: "#fff",
    navColor: "#888",
    navHoverBg: "rgba(255,255,255,0.05)",
    navHoverColor: "#ccc",
    navActiveBg: "rgba(108,71,255,0.12)",
    navActiveColor: "#a78bfa",
    sectionLabel: "#444",
    userChipBg: "rgba(255,255,255,0.04)",
    userChipBorder: "rgba(255,255,255,0.08)",
    userNameColor: "#ddd",
    userRoleColor: "#555",
    themeBtnBg: "rgba(255,255,255,0.04)",
    themeBtnColor: "#aaa",
    themeBtnBorder: "rgba(255,255,255,0.08)",
    themeBtnHover: "rgba(255,255,255,0.08)",
    collapseBg: "#1e1e1e",
    collapseBorder: "rgba(255,255,255,0.1)",
    collapseIcon: "#888",
    collapseBgHover: "#2a2a2a",
    topbarBg: "rgba(17,17,17,0.8)",
    topbarBorder: "rgba(255,255,255,0.07)",
    breadcrumbColor: "#666",
    breadcrumbSep: "#444",
    breadcrumbPage: "#ddd",
    toggleBg: "rgba(255,255,255,0.06)",
    toggleBorder: "rgba(255,255,255,0.12)",
    toggleIcon: "#ccc",
    toggleShadow: "rgba(0,0,0,0.3)",
    tooltipBg: "#1e1e1e",
    tooltipColor: "#ccc",
    tooltipBorder: "rgba(255,255,255,0.1)",
  },
  light: {
    mainBg: "#f5f5f7",
    sidebarBg: "#ffffff",
    sidebarBorder: "rgba(0,0,0,0.07)",
    logoBg: "#f0f0f0",
    logoText: "#111",
    navColor: "#777",
    navHoverBg: "rgba(0,0,0,0.04)",
    navHoverColor: "#111",
    navActiveBg: "rgba(108,71,255,0.08)",
    navActiveColor: "#6c47ff",
    sectionLabel: "#bbb",
    userChipBg: "rgba(0,0,0,0.02)",
    userChipBorder: "rgba(0,0,0,0.07)",
    userNameColor: "#222",
    userRoleColor: "#aaa",
    themeBtnBg: "rgba(0,0,0,0.03)",
    themeBtnColor: "#555",
    themeBtnBorder: "rgba(0,0,0,0.08)",
    themeBtnHover: "rgba(0,0,0,0.07)",
    collapseBg: "#fff",
    collapseBorder: "rgba(0,0,0,0.1)",
    collapseIcon: "#999",
    collapseBgHover: "#f5f5f5",
    topbarBg: "rgba(255,255,255,0.85)",
    topbarBorder: "rgba(0,0,0,0.07)",
    breadcrumbColor: "#aaa",
    breadcrumbSep: "#ddd",
    breadcrumbPage: "#222",
    toggleBg: "rgba(255,255,255,0.9)",
    toggleBorder: "rgba(0,0,0,0.1)",
    toggleIcon: "#555",
    toggleShadow: "rgba(0,0,0,0.1)",
    tooltipBg: "#fff",
    tooltipColor: "#333",
    tooltipBorder: "rgba(0,0,0,0.1)",
  },
};
