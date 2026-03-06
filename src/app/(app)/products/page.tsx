"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useProducts, type Product } from "@/context/ProductsContext";

// ─── Theme tokens (same system as login / AppLayout / Dashboard) ──────────────
const tokens = {
  dark: {
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardShadow: "0 2px 20px rgba(0,0,0,0.35)",
    headingColor: "#fff",
    subColor: "#888",
    labelColor: "#666",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    inputColor: "#fff",
    placeholder: "#444",
    tableHeaderColor: "#555",
    tableHeaderBg: "rgba(255,255,255,0.03)",
    tableRowBorder: "rgba(255,255,255,0.06)",
    tableRowHover: "rgba(255,255,255,0.04)",
    tableCellColor: "#ccc",
    badgeLowBg: "rgba(239,68,68,0.12)",
    badgeLowColor: "#f87171",
    badgeOkBg: "rgba(34,197,94,0.1)",
    badgeOkColor: "#4ade80",
    chipBg: "rgba(255,255,255,0.04)",
    chipBorder: "rgba(255,255,255,0.08)",
    chipColor: "#888",
    chipActiveBg: "rgba(108,71,255,0.18)",
    chipActiveBorder: "rgba(108,71,255,0.4)",
    chipActiveColor: "#a78bfa",
    modalOverlay: "rgba(0,0,0,0.7)",
    modalBg: "#161616",
    modalBorder: "rgba(255,255,255,0.1)",
    divider: "rgba(255,255,255,0.07)",
    emptyColor: "#555",
    countColor: "#555",
  },
  light: {
    cardBg: "#fff",
    cardBorder: "rgba(0,0,0,0.07)",
    cardShadow: "0 2px 16px rgba(0,0,0,0.06)",
    headingColor: "#111",
    subColor: "#888",
    labelColor: "#aaa",
    inputBg: "#f9f9f9",
    inputBorder: "rgba(0,0,0,0.12)",
    inputColor: "#111",
    placeholder: "#bbb",
    tableHeaderColor: "#aaa",
    tableHeaderBg: "rgba(0,0,0,0.02)",
    tableRowBorder: "rgba(0,0,0,0.05)",
    tableRowHover: "rgba(0,0,0,0.02)",
    tableCellColor: "#444",
    badgeLowBg: "rgba(239,68,68,0.08)",
    badgeLowColor: "#ef4444",
    badgeOkBg: "rgba(34,197,94,0.08)",
    badgeOkColor: "#16a34a",
    chipBg: "rgba(0,0,0,0.03)",
    chipBorder: "rgba(0,0,0,0.08)",
    chipColor: "#888",
    chipActiveBg: "rgba(108,71,255,0.08)",
    chipActiveBorder: "rgba(108,71,255,0.3)",
    chipActiveColor: "#6c47ff",
    modalOverlay: "rgba(0,0,0,0.4)",
    modalBg: "#fff",
    modalBorder: "rgba(0,0,0,0.08)",
    divider: "rgba(0,0,0,0.07)",
    emptyColor: "#bbb",
    countColor: "#bbb",
  },
};

const CAT_COLORS = ["#6c47ff","#00c9a7","#f59e0b","#ef4444","#3b82f6","#ec4899","#8b5cf6","#10b981"];

export default function ProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name"|"price"|"stock">("name");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Theme sync (same localStorage key as login page)
  useEffect(() => {
    const saved = localStorage.getItem("slooze-theme");
    if (saved) setDark(saved === "dark");
    setMounted(true);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("slooze-theme");
      if (saved) setDark(saved === "dark");
    }, 300);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // ── Role gate ──────────────────────────────────────────────────────────────
  if (!user) { router.replace("/login"); return null; }
  const isManager = user.role === "MANAGER";
  const isStoreKeeper = user.role === "STORE_KEEPER";
  if (!isManager && !isStoreKeeper) {
    return <AccessDenied dark={dark} onRedirect={() => router.push("/login")} />;
  }

  const t = dark ? tokens.dark : tokens.light;

  // ── Derived data ───────────────────────────────────────────────────────────
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const catColorMap: Record<string, string> = {};
  categories.slice(1).forEach((c, i) => { catColorMap[c] = CAT_COLORS[i % CAT_COLORS.length]; });

  const filtered = products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let val = 0;
      if (sortBy === "name") val = a.name.localeCompare(b.name);
      else if (sortBy === "price") val = a.price - b.price;
      else val = a.stock - b.stock;
      return sortDir === "asc" ? val : -val;
    });

  const lowStockCount = products.filter(p => p.stock < 20).length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleSort = (col: "name"|"price"|"stock") => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName(""); setCategory(""); setPrice(""); setStock("");
    setSaveError("");
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name); setCategory(product.category);
    setPrice(product.price.toString()); setStock(product.stock.toString());
    setSaveError("");
    setShowModal(true);
  };

  const saveProduct = () => {
    if (!name.trim() || !category.trim() || !price || !stock) {
      setSaveError("All fields are required.");
      return;
    }
    if (Number(price) <= 0 || Number(stock) < 0) {
      setSaveError("Price must be > 0 and stock ≥ 0.");
      return;
    }
    if (editingProduct) {
      updateProduct({ id: editingProduct.id, name: name.trim(), category: category.trim(), price: Number(price), stock: Number(stock) });
    } else {
      addProduct({ name: name.trim(), category: category.trim(), price: Number(price), stock: Number(stock) });
    }
    setShowModal(false);
  };

  const confirmDelete = (id: string) => setDeleteConfirm(id);
  const executeDelete = () => {
    if (deleteConfirm) { deleteProduct(deleteConfirm); setDeleteConfirm(null); }
  };

  const SortIcon = ({ col }: { col: string }) => (
    <span style={{ opacity: sortBy === col ? 1 : 0.3, marginLeft: 4, fontSize: "0.65rem" }}>
      {sortBy === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .pp-root { font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;gap:22px;animation:ppIn 0.4s ease both; }
        @keyframes ppIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        .pp-header { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px; }
        .pp-title { font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:${t.headingColor};letter-spacing:-0.03em;transition:color 0.35s; }
        .pp-subtitle { font-size:0.82rem;color:${t.subColor};margin-top:3px;transition:color 0.35s; }

        .pp-add-btn {
          display:flex;align-items:center;gap:7px;
          padding:9px 18px;border-radius:10px;border:none;
          background:linear-gradient(135deg,#6c47ff,#9b72ff);
          color:#fff;font-family:'Syne',sans-serif;font-size:0.875rem;font-weight:600;
          cursor:pointer;letter-spacing:0.01em;
          box-shadow:0 4px 14px rgba(108,71,255,0.35);
          transition:opacity 0.2s,transform 0.15s,box-shadow 0.2s;
        }
        .pp-add-btn:hover { opacity:0.9;box-shadow:0 6px 20px rgba(108,71,255,0.45); }
        .pp-add-btn:active { transform:scale(0.97); }

        /* ── Toolbar ── */
        .pp-toolbar { display:flex;align-items:center;flex-wrap:wrap;gap:10px; }
        .pp-search-wrap { position:relative;flex:1;min-width:200px;max-width:320px; }
        .pp-search-icon { position:absolute;left:12px;top:50%;transform:translateY(-50%);color:${t.placeholder};pointer-events:none; }
        .pp-search {
          width:100%;background:${t.inputBg};border:1px solid ${t.inputBorder};
          border-radius:10px;padding:9px 12px 9px 36px;
          font-size:0.875rem;color:${t.inputColor};font-family:'DM Sans',sans-serif;
          outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.35s,color 0.35s;
        }
        .pp-search::placeholder { color:${t.placeholder}; }
        .pp-search:focus { border-color:rgba(108,71,255,0.5);box-shadow:0 0 0 3px rgba(108,71,255,0.1); }

        .pp-chips { display:flex;flex-wrap:wrap;gap:7px; }
        .pp-chip {
          padding:5px 13px;border-radius:20px;font-size:0.78rem;font-weight:500;
          border:1px solid ${t.chipBorder};background:${t.chipBg};color:${t.chipColor};
          cursor:pointer;transition:all 0.18s;white-space:nowrap;
        }
        .pp-chip:hover { border-color:${t.chipActiveBorder};color:${t.chipActiveColor}; }
        .pp-chip.active { background:${t.chipActiveBg};border-color:${t.chipActiveBorder};color:${t.chipActiveColor}; }

        .pp-count { font-size:0.78rem;color:${t.countColor};white-space:nowrap;transition:color 0.35s; }

        /* ── Alert banner ── */
        .pp-alert {
          display:flex;align-items:center;gap:10px;
          padding:12px 16px;border-radius:12px;
          background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);
          font-size:0.85rem;color:#f87171;
          animation:ppIn 0.3s ease both;
        }

        /* ── Table card ── */
        .pp-table-card {
          background:${t.cardBg};border:1px solid ${t.cardBorder};
          border-radius:16px;overflow:hidden;
          box-shadow:${t.cardShadow};
          transition:background 0.35s,border-color 0.35s;
        }
        .pp-table { width:100%;border-collapse:collapse;font-size:0.855rem; }
        .pp-table thead tr { background:${t.tableHeaderBg};border-bottom:1px solid ${t.divider}; }
        .pp-table th {
          padding:12px 16px;text-align:left;
          font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;
          color:${t.tableHeaderColor};cursor:pointer;user-select:none;
          transition:color 0.35s;white-space:nowrap;
        }
        .pp-table th:hover { color:${t.chipActiveColor}; }
        .pp-table th.no-sort { cursor:default; }
        .pp-table td { padding:12px 16px;color:${t.tableCellColor};border-bottom:1px solid ${t.tableRowBorder};transition:color 0.35s,background 0.18s; }
        .pp-table tbody tr:hover td { background:${t.tableRowHover}; }
        .pp-table tbody tr:last-child td { border-bottom:none; }

        .pp-badge { display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:600; }
        .pp-badge-low { background:${t.badgeLowBg};color:${t.badgeLowColor}; }
        .pp-badge-ok { background:${t.badgeOkBg};color:${t.badgeOkColor}; }

        .pp-cat-tag { padding:2px 9px;border-radius:20px;font-size:0.72rem;font-weight:600; }

        .pp-action-btn {
          display:inline-flex;align-items:center;gap:5px;
          padding:5px 11px;border-radius:8px;border:none;
          font-size:0.78rem;font-weight:500;font-family:'DM Sans',sans-serif;
          cursor:pointer;transition:background 0.18s,transform 0.12s;
        }
        .pp-action-btn:active { transform:scale(0.95); }
        .pp-edit-btn { background:rgba(108,71,255,0.1);color:#a78bfa; }
        .pp-edit-btn:hover { background:rgba(108,71,255,0.18); }
        .pp-del-btn { background:rgba(239,68,68,0.08);color:#f87171; }
        .pp-del-btn:hover { background:rgba(239,68,68,0.15); }

        .pp-empty { padding:48px;text-align:center;color:${t.emptyColor};font-size:0.9rem;transition:color 0.35s; }

        /* ── Modal ── */
        .pp-overlay {
          position:fixed;inset:0;background:${t.modalOverlay};
          display:flex;align-items:center;justify-content:center;
          z-index:200;padding:20px;
          animation:fadeIn 0.2s ease;
          backdrop-filter:blur(4px);
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .pp-modal {
          width:100%;max-width:420px;
          background:${t.modalBg};border:1px solid ${t.modalBorder};
          border-radius:20px;padding:28px;
          box-shadow:0 20px 60px rgba(0,0,0,0.4);
          animation:modalIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
          transition:background 0.35s,border-color 0.35s;
        }
        @keyframes modalIn { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .pp-modal-title { font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:700;color:${t.headingColor};margin-bottom:20px;letter-spacing:-0.02em;transition:color 0.35s; }

        .pp-field { margin-bottom:14px; }
        .pp-field-label { font-size:0.72rem;font-weight:500;text-transform:uppercase;letter-spacing:0.07em;color:${t.labelColor};margin-bottom:6px;transition:color 0.35s; }
        .pp-field-input {
          width:100%;background:${t.inputBg};border:1px solid ${t.inputBorder};
          border-radius:10px;padding:10px 14px;
          font-size:0.9rem;color:${t.inputColor};font-family:'DM Sans',sans-serif;
          outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.35s,color 0.35s;
        }
        .pp-field-input::placeholder { color:${t.placeholder}; }
        .pp-field-input:focus { border-color:rgba(108,71,255,0.5);box-shadow:0 0 0 3px rgba(108,71,255,0.1); }

        .pp-modal-error { font-size:0.8rem;color:#f87171;padding:8px 12px;border-radius:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);margin-bottom:14px;animation:ppIn 0.2s ease; }

        .pp-modal-actions { display:flex;justify-content:flex-end;gap:10px;margin-top:6px; }
        .pp-cancel-btn {
          padding:9px 18px;border-radius:10px;border:1px solid ${t.chipBorder};
          background:transparent;color:${t.subColor};font-family:'DM Sans',sans-serif;
          font-size:0.875rem;cursor:pointer;transition:background 0.18s;
        }
        .pp-cancel-btn:hover { background:${t.tableRowHover}; }
        .pp-save-btn {
          padding:9px 20px;border-radius:10px;border:none;
          background:linear-gradient(135deg,#6c47ff,#9b72ff);
          color:#fff;font-family:'Syne',sans-serif;font-size:0.875rem;font-weight:600;
          cursor:pointer;box-shadow:0 3px 12px rgba(108,71,255,0.3);
          transition:opacity 0.2s,transform 0.15s;
        }
        .pp-save-btn:hover { opacity:0.9; }
        .pp-save-btn:active { transform:scale(0.97); }

        /* ── Delete confirm ── */
        .pp-del-modal { max-width:360px; }
        .pp-del-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:${t.headingColor};margin-bottom:10px;transition:color 0.35s; }
        .pp-del-body { font-size:0.875rem;color:${t.subColor};margin-bottom:22px;line-height:1.6;transition:color 0.35s; }
        .pp-del-confirm-btn {
          padding:9px 20px;border-radius:10px;border:none;
          background:linear-gradient(135deg,#ef4444,#f87171);
          color:#fff;font-family:'Syne',sans-serif;font-size:0.875rem;font-weight:600;
          cursor:pointer;box-shadow:0 3px 12px rgba(239,68,68,0.3);
          transition:opacity 0.2s;
        }
        .pp-del-confirm-btn:hover { opacity:0.9; }
      `}</style>

      <div className="pp-root">
        {/* ── Header ── */}
        <div className="pp-header">
          <div>
            <h1 className="pp-title">Products</h1>
            <p className="pp-subtitle">
              {isManager ? "Manage inventory — add, edit or remove products" : "Browse and update stock levels"}
            </p>
          </div>
          {isManager && (
            <button className="pp-add-btn" onClick={openAddModal}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </button>
          )}
        </div>

        {/* ── Low stock alert ── */}
        {lowStockCount > 0 && (
          <div className="pp-alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <strong>{lowStockCount} item{lowStockCount > 1 ? "s" : ""} below restock threshold</strong> — stock under 20 units
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="pp-toolbar">
          <div className="pp-search-wrap">
            <svg className="pp-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="pp-search" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="pp-chips">
            {categories.map(cat => (
              <button key={cat} className={`pp-chip ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <span className="pp-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ── Table ── */}
        <div className="pp-table-card">
          <table className="pp-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")}>Name <SortIcon col="name" /></th>
                <th className="no-sort">Category</th>
                <th onClick={() => toggleSort("price")}>Price <SortIcon col="price" /></th>
                <th onClick={() => toggleSort("stock")}>Stock <SortIcon col="stock" /></th>
                {isManager && <th className="no-sort">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={isManager ? 5 : 4} className="pp-empty">No products found</td></tr>
              ) : (
                filtered.map(p => {
                  const isLow = p.stock < 20;
                  const catColor = catColorMap[p.category] ?? "#6c47ff";
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500, color: dark ? "#e5e5e5" : "#111" }}>{p.name}</td>
                      <td>
                        <span className="pp-cat-tag" style={{ background: `${catColor}18`, color: catColor }}>{p.category}</span>
                      </td>
                      <td>₹{p.price.toLocaleString()}</td>
                      <td>
                        <span className={`pp-badge ${isLow ? "pp-badge-low" : "pp-badge-ok"}`}>
                          {isLow ? "⚠" : "✓"} {p.stock}
                        </span>
                      </td>
                      {isManager && (
                        <td>
                          <div style={{ display: "flex", gap: 7 }}>
                            <button className="pp-action-btn pp-edit-btn" onClick={() => openEditModal(p)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              Edit
                            </button>
                            <button className="pp-action-btn pp-del-btn" onClick={() => confirmDelete(p.id)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="pp-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="pp-modal">
            <h2 className="pp-modal-title">{editingProduct ? "Edit Product" : "Add New Product"}</h2>

            {saveError && <div className="pp-modal-error">{saveError}</div>}

            {[
              { label: "Product Name", val: name, set: setName, placeholder: "e.g. Basmati Rice 5kg", type: "text" },
              { label: "Category", val: category, set: setCategory, placeholder: "e.g. Grains", type: "text" },
              { label: "Price (₹)", val: price, set: setPrice, placeholder: "e.g. 250", type: "number" },
              { label: "Stock (units)", val: stock, set: setStock, placeholder: "e.g. 100", type: "number" },
            ].map(f => (
              <div className="pp-field" key={f.label}>
                <p className="pp-field-label">{f.label}</p>
                <input
                  className="pp-field-input"
                  type={f.type}
                  placeholder={f.placeholder}
                  value={f.val}
                  onChange={e => { f.set(e.target.value); setSaveError(""); }}
                  onKeyDown={e => { if (e.key === "Enter") saveProduct(); if (e.key === "Escape") setShowModal(false); }}
                />
              </div>
            ))}

            <div className="pp-modal-actions">
              <button className="pp-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="pp-save-btn" onClick={saveProduct}>{editingProduct ? "Save Changes" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="pp-overlay" onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="pp-modal pp-del-modal">
            <p style={{ fontSize: "2rem", marginBottom: 12 }}>🗑️</p>
            <h2 className="pp-del-title">Delete Product?</h2>
            <p className="pp-del-body">
              <strong style={{ color: dark ? "#e5e5e5" : "#111" }}>
                {products.find(p => p.id === deleteConfirm)?.name}
              </strong>
              {" "}will be permanently removed from inventory. This cannot be undone.
            </p>
            <div className="pp-modal-actions">
              <button className="pp-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="pp-del-confirm-btn" onClick={executeDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Access Denied ────────────────────────────────────────────────────────────
function AccessDenied({ dark, onRedirect }: { dark: boolean; onRedirect: () => void }) {
  return (
    <div style={{
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      minHeight:"60vh",gap:16,textAlign:"center",
      background: dark ? "rgba(239,68,68,0.06)" : "rgba(239,68,68,0.04)",
      border:`1px solid ${dark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}`,
      borderRadius:20,padding:40,margin:"auto",maxWidth:420,
      fontFamily:"'DM Sans',sans-serif",
    }}>
      <span style={{ fontSize:"3rem" }}>🔒</span>
      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.4rem",fontWeight:700,color:dark?"#fff":"#111",letterSpacing:"-0.02em" }}>
        Access Restricted
      </h2>
      <p style={{ fontSize:"0.9rem",color:dark?"#888":"#777",lineHeight:1.6 }}>
        You don't have permission to view this page.
      </p>
      <button onClick={onRedirect} style={{
        marginTop:8,padding:"10px 24px",borderRadius:10,border:"none",
        background:"linear-gradient(135deg,#6c47ff,#9b72ff)",color:"#fff",
        fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:"0.9rem",
        cursor:"pointer",boxShadow:"0 4px 16px rgba(108,71,255,0.35)",
      }}>
        Back to Login
      </button>
    </div>
  );
}
