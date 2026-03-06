"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProducts, type Product } from "@/context/ProductsContext";


// ─── Theme (mirrors login + AppLayout system) ─────────────────────────────────
const tokens = {
  dark: {
    pageBg: "transparent",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardShadow: "0 2px 20px rgba(0,0,0,0.35)",
    headingColor: "#fff",
    subColor: "#888",
    labelColor: "#666",
    valueColor: "#fff",
    tableHeaderColor: "#555",
    tableRowBorder: "rgba(255,255,255,0.06)",
    tableRowHover: "rgba(255,255,255,0.03)",
    tableCellColor: "#ccc",
    barTrack: "rgba(255,255,255,0.07)",
    badgeLowBg: "rgba(239,68,68,0.12)",
    badgeLowColor: "#f87171",
    badgeOkBg: "rgba(34,197,94,0.1)",
    badgeOkColor: "#4ade80",
    categoryChipBg: "rgba(255,255,255,0.05)",
    categoryChipBorder: "rgba(255,255,255,0.1)",
    categoryChipColor: "#aaa",
    categoryChipActive: "rgba(108,71,255,0.18)",
    categoryChipActiveBorder: "rgba(108,71,255,0.4)",
    categoryChipActiveColor: "#a78bfa",
    divider: "rgba(255,255,255,0.07)",
    accessDeniedBg: "rgba(239,68,68,0.06)",
    accessDeniedBorder: "rgba(239,68,68,0.2)",
  },
  light: {
    pageBg: "transparent",
    cardBg: "#fff",
    cardBorder: "rgba(0,0,0,0.07)",
    cardShadow: "0 2px 16px rgba(0,0,0,0.06)",
    headingColor: "#111",
    subColor: "#888",
    labelColor: "#aaa",
    valueColor: "#111",
    tableHeaderColor: "#bbb",
    tableRowBorder: "rgba(0,0,0,0.06)",
    tableRowHover: "rgba(0,0,0,0.02)",
    tableCellColor: "#444",
    barTrack: "rgba(0,0,0,0.07)",
    badgeLowBg: "rgba(239,68,68,0.08)",
    badgeLowColor: "#ef4444",
    badgeOkBg: "rgba(34,197,94,0.08)",
    badgeOkColor: "#16a34a",
    categoryChipBg: "rgba(0,0,0,0.03)",
    categoryChipBorder: "rgba(0,0,0,0.08)",
    categoryChipColor: "#888",
    categoryChipActive: "rgba(108,71,255,0.08)",
    categoryChipActiveBorder: "rgba(108,71,255,0.3)",
    categoryChipActiveColor: "#6c47ff",
    divider: "rgba(0,0,0,0.07)",
    accessDeniedBg: "rgba(239,68,68,0.04)",
    accessDeniedBorder: "rgba(239,68,68,0.15)",
  },
};

// ─── Stat card accent configs ─────────────────────────────────────────────────
const STAT_ACCENTS = [
  { gradient: "linear-gradient(135deg,#6c47ff,#9b72ff)", icon: "📦", glow: "rgba(108,71,255,0.3)" },
  { gradient: "linear-gradient(135deg,#00c9a7,#00e6bf)", icon: "🏗️", glow: "rgba(0,201,167,0.3)" },
  { gradient: "linear-gradient(135deg,#ef4444,#f87171)", icon: "⚠️", glow: "rgba(239,68,68,0.3)" },
  { gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)", icon: "💰", glow: "rgba(245,158,11,0.3)" },
];

// ─── Category palette ─────────────────────────────────────────────────────────
const CAT_COLORS = [
  "#6c47ff","#00c9a7","#f59e0b","#ef4444","#3b82f6","#ec4899","#8b5cf6","#10b981",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { products } = useProducts();

  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"stock" | "value" | "name">("stock");

  // Sync theme with global slooze-theme key
  useEffect(() => {
    const saved = localStorage.getItem("slooze-theme");
    if (saved) setDark(saved === "dark");
    setMounted(true);
    // Trigger bar animations on mount
    setTimeout(() => setAnimKey(1), 100);
  }, []);

  // Listen for theme changes from AppLayout toggle
  useEffect(() => {
    const onStorage = () => {
      const saved = localStorage.getItem("slooze-theme");
      if (saved) setDark(saved === "dark");
    };
    window.addEventListener("storage", onStorage);
    // Also poll (same-tab toggles don't fire storage event)
    const interval = setInterval(onStorage, 300);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, []);

  // ── Role-based access gate ──────────────────────────────────────────────────
  if (!mounted) return null;

  if (!user) {
    router.replace("/login");
    return null;
  }

  if (user.role !== "MANAGER") {
    return <AccessDenied dark={dark} onRedirect={() => router.push("/products")} />;
  }

  const t = dark ? tokens.dark : tokens.light;

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 20).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const avgPrice = totalProducts > 0 ? products.reduce((s, p) => s + p.price, 0) / totalProducts : 0;
  const maxStock = products.length > 0 ? Math.max(...products.map((p) => p.stock)) : 1;

  // Category breakdown
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const catStats = categories.slice(1).map((cat, i) => {
    const items = products.filter((p) => p.category === cat);
    return {
      name: cat,
      count: items.length,
      stock: items.reduce((s, p) => s + p.stock, 0),
      value: items.reduce((s, p) => s + p.price * p.stock, 0),
      low: items.filter((p) => p.stock < 20).length,
      color: CAT_COLORS[i % CAT_COLORS.length],
    };
  });
  const totalCatStock = catStats.reduce((s, c) => s + c.stock, 0);

  // Filtered + sorted products
  const filtered = activeCategory === "All"
    ? [...products]
    : products.filter((p) => p.category === activeCategory);
  const sorted = filtered.sort((a, b) => {
    if (sortBy === "stock") return b.stock - a.stock;
    if (sortBy === "value") return (b.price * b.stock) - (a.price * a.stock);
    return a.name.localeCompare(b.name);
  });

  const stats = [
    { label: "Total Products", value: totalProducts, sub: `${categories.length - 1} categories` },
    { label: "Total Stock Units", value: totalStock.toLocaleString(), sub: `Avg ${totalProducts > 0 ? Math.round(totalStock / totalProducts) : 0} per item` },
    { label: "Low Stock Alerts", value: lowStock, sub: lowStock > 0 ? "Needs attention" : "All healthy" },
    { label: "Inventory Value", value: `₹${(totalValue / 1000).toFixed(1)}k`, sub: `Avg ₹${avgPrice.toFixed(0)} / item` },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .db-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 24px; animation: dbIn 0.4s ease both; }
        @keyframes dbIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        /* ── Header ── */
        .db-header { display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:12px; }
        .db-title { font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:${t.headingColor};letter-spacing:-0.03em;transition:color 0.35s; }
        .db-subtitle { font-size:0.85rem;color:${t.subColor};margin-top:3px;transition:color 0.35s; }
        .db-time { font-size:0.75rem;color:${t.labelColor};font-family:'DM Sans',sans-serif;transition:color 0.35s; }

        /* ── Stat cards ── */
        .db-stats { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px; }
        .db-stat {
          background:${t.cardBg};border:1px solid ${t.cardBorder};
          border-radius:16px;padding:20px;
          box-shadow:${t.cardShadow};
          transition:background 0.35s,border-color 0.35s,transform 0.2s;
          animation:statIn 0.5s ease both;
          position:relative;overflow:hidden;
        }
        .db-stat:hover { transform:translateY(-2px); }
        .db-stat-glow { position:absolute;top:-30px;right:-30px;width:90px;height:90px;border-radius:50%;filter:blur(30px);opacity:0.25;pointer-events:none; }
        .db-stat-icon { font-size:1.4rem;margin-bottom:10px;display:block; }
        .db-stat-label { font-size:0.72rem;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:${t.labelColor};margin-bottom:6px;transition:color 0.35s; }
        .db-stat-value { font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;letter-spacing:-0.03em;transition:color 0.35s; }
        .db-stat-sub { font-size:0.75rem;color:${t.subColor};margin-top:4px;transition:color 0.35s; }
        .db-stat-accent { position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 16px 16px; }

        @keyframes statIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* ── Section card ── */
        .db-card {
          background:${t.cardBg};border:1px solid ${t.cardBorder};
          border-radius:16px;padding:24px;
          box-shadow:${t.cardShadow};
          transition:background 0.35s,border-color 0.35s;
        }
        .db-card-title {
          font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;
          color:${t.headingColor};margin-bottom:20px;letter-spacing:-0.01em;
          transition:color 0.35s;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;
        }

        /* ── Category donut-like pills ── */
        .db-cat-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px; }
        .db-cat-card {
          border-radius:12px;padding:14px 16px;
          background:${t.categoryChipBg};border:1px solid ${t.categoryChipBorder};
          transition:background 0.2s,border-color 0.2s,transform 0.15s;
          cursor:default;
        }
        .db-cat-card:hover { transform:translateY(-1px); }
        .db-cat-name { font-size:0.8rem;font-weight:600;margin-bottom:8px;transition:color 0.35s; }
        .db-cat-stats { display:flex;gap:16px; }
        .db-cat-stat { font-size:0.72rem;color:${t.subColor};transition:color 0.35s; }
        .db-cat-stat strong { display:block;font-size:1.05rem;font-weight:700;color:${t.valueColor};transition:color 0.35s; }
        .db-cat-bar-track { height:4px;border-radius:2px;background:${t.barTrack};margin-top:10px;overflow:hidden;transition:background 0.35s; }
        .db-cat-bar-fill { height:4px;border-radius:2px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1); }

        /* ── Stock bar chart ── */
        .db-bars { display:flex;flex-direction:column;gap:12px; }
        .db-bar-row { display:grid;grid-template-columns:130px 1fr 52px;align-items:center;gap:12px; }
        .db-bar-label { font-size:0.8rem;color:${t.tableCellColor};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color 0.35s; }
        .db-bar-track { height:8px;border-radius:4px;background:${t.barTrack};overflow:hidden;transition:background 0.35s; }
        .db-bar-fill { height:8px;border-radius:4px;transition:width 0.9s cubic-bezier(0.4,0,0.2,1); }
        .db-bar-val { font-size:0.78rem;color:${t.subColor};text-align:right;transition:color 0.35s; }

        /* ── Filter chips ── */
        .db-filters { display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px; }
        .db-chip {
          padding:5px 14px;border-radius:20px;font-size:0.78rem;font-weight:500;
          border:1px solid ${t.categoryChipBorder};background:${t.categoryChipBg};
          color:${t.categoryChipColor};cursor:pointer;transition:all 0.18s;
        }
        .db-chip:hover { border-color:${t.categoryChipActiveBorder};color:${t.categoryChipActiveColor}; }
        .db-chip.active { background:${t.categoryChipActive};border-color:${t.categoryChipActiveBorder};color:${t.categoryChipActiveColor}; }

        /* ── Sort buttons ── */
        .db-sort { display:flex;gap:6px; }
        .db-sort-btn {
          padding:4px 12px;border-radius:8px;font-size:0.75rem;border:1px solid ${t.categoryChipBorder};
          background:${t.categoryChipBg};color:${t.categoryChipColor};cursor:pointer;transition:all 0.18s;
          font-family:'DM Sans',sans-serif;
        }
        .db-sort-btn.active { background:${t.categoryChipActive};border-color:${t.categoryChipActiveBorder};color:${t.categoryChipActiveColor}; }

        /* ── Table ── */
        .db-table { width:100%;border-collapse:collapse;font-size:0.85rem; }
        .db-table thead tr { border-bottom:1px solid ${t.divider}; }
        .db-table th { text-align:left;padding:0 8px 10px;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:${t.tableHeaderColor};transition:color 0.35s; }
        .db-table td { padding:11px 8px;color:${t.tableCellColor};border-bottom:1px solid ${t.tableRowBorder};transition:color 0.35s,background 0.18s; }
        .db-table tbody tr:hover td { background:${t.tableRowHover}; }
        .db-table tbody tr:last-child td { border-bottom:none; }

        .db-badge { display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:600; }
        .db-badge-low { background:${t.badgeLowBg};color:${t.badgeLowColor}; }
        .db-badge-ok { background:${t.badgeOkBg};color:${t.badgeOkColor}; }

        .db-progress-mini { width:60px;height:4px;border-radius:2px;background:${t.barTrack};overflow:hidden;display:inline-block;vertical-align:middle;margin-left:6px; }
        .db-progress-mini-fill { height:4px;border-radius:2px;background:linear-gradient(90deg,#6c47ff,#9b72ff); }

        /* ── Insights row ── */
        .db-insights { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px; }
        .db-insight {
          background:${t.cardBg};border:1px solid ${t.cardBorder};
          border-radius:14px;padding:18px;
          box-shadow:${t.cardShadow};
          transition:background 0.35s,border-color 0.35s;
        }
        .db-insight-label { font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;color:${t.labelColor};margin-bottom:6px;transition:color 0.35s; }
        .db-insight-val { font-family:'Syne',sans-serif;font-size:1.35rem;font-weight:700;color:${t.valueColor};transition:color 0.35s; }
        .db-insight-sub { font-size:0.75rem;color:${t.subColor};margin-top:3px;transition:color 0.35s; }
      `}</style>

      <div className="db-root">
        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <h1 className="db-title">Dashboard</h1>
            <p className="db-subtitle">Commodity statistics & inventory insights</p>
          </div>
          <span className="db-time">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        {/* ── KPI Stats ── */}
        <div className="db-stats">
          {stats.map((s, i) => (
            <div className="db-stat" key={s.label} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="db-stat-glow" style={{ background: STAT_ACCENTS[i].gradient.split(",")[1]?.trim().replace(")", "").replace("#", "rgba(") + ",0.5)" ?? "#6c47ff", background: STAT_ACCENTS[i].glow }} />
              <span className="db-stat-icon">{STAT_ACCENTS[i].icon}</span>
              <p className="db-stat-label">{s.label}</p>
              <p className="db-stat-value" style={{ color: i === 2 && Number(s.value) > 0 ? "#f87171" : i === 3 ? "#4ade80" : (dark ? "#fff" : "#111") }}>{s.value}</p>
              <p className="db-stat-sub">{s.sub}</p>
              <div className="db-stat-accent" style={{ background: STAT_ACCENTS[i].gradient }} />
            </div>
          ))}
        </div>

        {/* ── Key Insights row ── */}
        <div className="db-insights">
          {[
            { label: "Top Category by Value", val: catStats.sort((a,b)=>b.value-a.value)[0]?.name ?? "-", sub: `₹${((catStats[0]?.value??0)/1000).toFixed(1)}k total value` },
            { label: "Most Stocked Category", val: catStats.sort((a,b)=>b.stock-a.stock)[0]?.name ?? "-", sub: `${catStats.sort((a,b)=>b.stock-a.stock)[0]?.stock ?? 0} units` },
            { label: "Highest Value Item", val: [...products].sort((a,b)=>(b.price*b.stock)-(a.price*a.stock))[0]?.name ?? "-", sub: `₹${([...products].sort((a,b)=>(b.price*b.stock)-(a.price*a.stock))[0]?.price * [...products].sort((a,b)=>(b.price*b.stock)-(a.price*a.stock))[0]?.stock).toLocaleString()}` },
            { label: "Critical Low Stock", val: products.filter(p=>p.stock<10).length, sub: products.filter(p=>p.stock<10).length > 0 ? "Restock immediately" : "No critical items" },
          ].map(ins => (
            <div className="db-insight" key={ins.label}>
              <p className="db-insight-label">{ins.label}</p>
              <p className="db-insight-val">{ins.val}</p>
              <p className="db-insight-sub">{ins.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Category Breakdown ── */}
        <div className="db-card">
          <div className="db-card-title">
            <span>Category Breakdown</span>
            <span style={{ fontSize: "0.75rem", color: dark ? "#555" : "#bbb", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
              {categories.length - 1} categories · {totalProducts} SKUs
            </span>
          </div>
          <div className="db-cat-grid">
            {catStats.map((cat) => (
              <div className="db-cat-card" key={cat.name} style={{ borderColor: `${cat.color}30` }}>
                <p className="db-cat-name" style={{ color: cat.color }}>{cat.name}</p>
                <div className="db-cat-stats">
                  <div className="db-cat-stat"><strong>{cat.count}</strong>SKUs</div>
                  <div className="db-cat-stat"><strong>{cat.stock}</strong>Units</div>
                  <div className="db-cat-stat"><strong>₹{(cat.value/1000).toFixed(1)}k</strong>Value</div>
                  {cat.low > 0 && <div className="db-cat-stat"><strong style={{ color: "#f87171" }}>{cat.low}</strong>Low</div>}
                </div>
                <div className="db-cat-bar-track">
                  <div className="db-cat-bar-fill" style={{ width: animKey ? `${(cat.stock / totalCatStock) * 100}%` : "0%", background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stock Overview Bar Chart ── */}
        <div className="db-card">
          <div className="db-card-title">
            <span>Stock Overview</span>
            <div className="db-sort">
              {(["stock", "value", "name"] as const).map(s => (
                <button key={s} className={`db-sort-btn ${sortBy === s ? "active" : ""}`} onClick={() => setSortBy(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="db-bars">
            {[...products]
              .sort((a, b) => sortBy === "stock" ? b.stock - a.stock : sortBy === "value" ? (b.price * b.stock) - (a.price * a.stock) : a.name.localeCompare(b.name))
              .map((p) => {
                const width = (p.stock / maxStock) * 100;
                const isLow = p.stock < 20;
                return (
                  <div className="db-bar-row" key={p.id}>
                    <span className="db-bar-label" title={p.name}>{p.name}</span>
                    <div className="db-bar-track">
                      <div className="db-bar-fill" style={{
                        width: animKey ? `${width}%` : "0%",
                        background: isLow
                          ? "linear-gradient(90deg,#ef4444,#f87171)"
                          : `linear-gradient(90deg,${CAT_COLORS[categories.slice(1).indexOf(p.category) % CAT_COLORS.length]},${CAT_COLORS[(categories.slice(1).indexOf(p.category) + 1) % CAT_COLORS.length]})`,
                      }} />
                    </div>
                    <span className="db-bar-val" style={{ color: isLow ? "#f87171" : (dark ? "#888" : "#aaa") }}>{p.stock}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ── Products Table ── */}
        <div className="db-card">
          <div className="db-card-title">
            <span>All Products</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="db-filters" style={{ marginBottom: 0 }}>
                {categories.map((cat) => (
                  <button key={cat} className={`db-chip ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="db-table">
            <thead>
              <tr>
                {["Product", "Category", "Price", "Stock", "Value", "Status"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const isLow = p.stock < 20;
                const val = p.price * p.stock;
                const stockPct = Math.round((p.stock / maxStock) * 100);
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, color: dark ? "#e5e5e5" : "#111" }}>{p.name}</td>
                    <td>
                      <span style={{
                        padding: "2px 8px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600,
                        background: `${CAT_COLORS[categories.slice(1).indexOf(p.category) % CAT_COLORS.length]}18`,
                        color: CAT_COLORS[categories.slice(1).indexOf(p.category) % CAT_COLORS.length],
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td>₹{p.price}</td>
                    <td>
                      {p.stock}
                      <span className="db-progress-mini">
                        <span className="db-progress-mini-fill" style={{ width: `${stockPct}%`, background: isLow ? "#ef4444" : "#6c47ff" }} />
                      </span>
                    </td>
                    <td style={{ color: dark ? "#a3e635" : "#16a34a" }}>₹{val.toLocaleString()}</td>
                    <td>
                      <span className={`db-badge ${isLow ? "db-badge-low" : "db-badge-ok"}`}>
                        {isLow ? "⚠ Low" : "✓ OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Access Denied screen ─────────────────────────────────────────────────────
function AccessDenied({ dark, onRedirect }: { dark: boolean; onRedirect: () => void }) {
  const t = dark ? tokens.dark : tokens.light;
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "60vh", gap: 16, textAlign: "center",
      background: t.accessDeniedBg, border: `1px solid ${t.accessDeniedBorder}`,
      borderRadius: 20, padding: 40, margin: "auto", maxWidth: 420,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: "3rem" }}>🔒</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: dark ? "#fff" : "#111", letterSpacing: "-0.02em" }}>
        Access Restricted
      </h2>
      <p style={{ fontSize: "0.9rem", color: dark ? "#888" : "#777", lineHeight: 1.6 }}>
        The Dashboard is only accessible to <strong style={{ color: "#6c47ff" }}>Managers</strong>.<br />
        Your role does not have permission to view this page.
      </p>
      <button onClick={onRedirect} style={{
        marginTop: 8, padding: "10px 24px", borderRadius: 10, border: "none",
        background: "linear-gradient(135deg,#6c47ff,#9b72ff)", color: "#fff",
        fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.9rem",
        cursor: "pointer", boxShadow: "0 4px 16px rgba(108,71,255,0.35)",
      }}>
        Go to Products →
      </button>
    </div>
  );
}

