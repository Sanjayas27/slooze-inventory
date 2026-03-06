# Slooze Inventory Management

A role-based inventory management platform built with Next.js, featuring a Manager dashboard, product CRUD, and dark/light mode.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/slooze-inventory.git

# 2. Navigate into the project
cd slooze-inventory

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Accounts

| Role         | Email              | Password |
| ------------ | ------------------ | -------- |
| Manager      | manager@slooze.com | password |
| Store Keeper | store@slooze.com   | password |

---

## 📋 Features

### A) Login

- Email & password authentication with validation
- Role-based routing on login
- Dark / light mode toggle (persisted)

### B) Dashboard _(Manager only)_

- KPI cards: Total Products, Stock Units, Low Stock Alerts, Inventory Value
- Category breakdown with proportional bar charts
- Stock overview chart (sortable by stock / value / name)
- Full products table with category filter and search
- Key insights: Top category, highest value item, critical low stock

### C) Products _(Manager + Store Keeper)_

- View all products with search and category filter chips
- Sortable columns (Name / Price / Stock)
- Low stock alert banner (items under 20 units)
- Color-coded category tags and stock status badges

### D) Add / Edit / Delete Products _(Manager only)_

- Add new products via modal with validation
- Edit existing products (pre-filled form)
- Delete with confirmation dialog
- All changes persist via localStorage and sync live to the Dashboard

---

## 👥 Role-Based Access

| Feature        | Manager | Store Keeper |
| -------------- | ------- | ------------ |
| View Dashboard | ✅      | ❌           |
| View Products  | ✅      | ✅           |
| Add Product    | ✅      | ❌           |
| Edit Product   | ✅      | ❌           |
| Delete Product | ✅      | ❌           |

- Sidebar nav items are filtered by role
- Unauthorized routes redirect automatically
- Restricted buttons are hidden per role

---

## 🌗 Dark / Light Mode

Theme is toggled from the sidebar or top bar and persisted across all pages via `localStorage` (`slooze-theme` key).

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Inline styles with CSS-in-JS (no Tailwind dependency)
- **Fonts**: Syne + DM Sans (Google Fonts)
- **State**: React Context API + localStorage
- **Auth**: Mock auth via AuthContext (ready for real API swap)

---

## 🌐 Deployment

Deployed on Vercel: [YOUR_VERCEL_LINK_HERE]

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home / Landing page
│   ├── (auth)/login/page.tsx     # Login page
│   └── (app)/
│       ├── layout.tsx            # App shell with ProductsProvider
│       ├── dashboard/page.tsx    # Manager dashboard
│       └── products/page.tsx     # Products page
├── components/
│   └── AppLayout.tsx             # Sidebar + topbar layout
└── context/
    ├── AuthContext.tsx           # Auth state & mock login
    └── ProductsContext.tsx       # Shared products store
```
