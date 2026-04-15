# NAFTAL HR-SYNC
### Operational Unit Management System — V4.1
#### Built with Vite + React

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server  (opens http://localhost:3000)
npm start

# 3. Production build
npm run build

# 4. Preview production build
npm run preview
```

---

## Demo Credentials

| Role              | Employee ID    | Password   |
|-------------------|----------------|------------|
| Administrator     | NFT-2024-00892 | admin123   |
| Shift Manager     | NF-4829        | shift123   |

---

## Project Structure

```
naftal-hr-vite/
├── index.html                          ← Vite entry HTML (root level)
├── vite.config.js                      ← Vite configuration
├── package.json
├── .eslintrc.cjs
├── .env
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                        ← App entry point
    ├── App.jsx                         ← Router & protected routes
    ├── styles/
    │   └── globals.css                 ← CSS variables & global reset
    ├── context/
    │   └── AppContext.jsx              ← Global state (auth, employees, passes, requests)
    ├── components/
    │   ├── UI/
    │   │   ├── UI.jsx                  ← Button, Card, Modal, Badge, Avatar, Pagination…
    │   │   └── UI.module.css
    │   ├── Sidebar/
    │   │   ├── Sidebar.jsx
    │   │   └── Sidebar.module.css
    │   ├── Topbar/
    │   │   ├── Topbar.jsx
    │   │   └── Topbar.module.css
    │   ├── AppLayout/
    │   │   ├── AppLayout.jsx
    │   │   └── AppLayout.module.css
    │   └── Toast/
    │       ├── Toast.jsx
    │       └── Toast.module.css
    └── pages/
        ├── Login/
        │   ├── LoginPage.jsx
        │   └── LoginPage.module.css
        ├── Dashboard/
        │   ├── DashboardPage.jsx
        │   └── DashboardPage.module.css
        ├── Employees/
        │   ├── EmployeesPage.jsx
        │   └── EmployeesPage.module.css
        ├── Documents/
        │   ├── DocumentsPage.jsx
        │   └── DocumentsPage.module.css
        └── Profile/
            ├── ProfilePage.jsx
            └── ProfilePage.module.css
```

---

## Key Differences vs CRA version

| Feature             | CRA                    | Vite                        |
|---------------------|------------------------|-----------------------------|
| Entry HTML          | `public/index.html`    | `index.html` (root level)   |
| Entry JS            | `src/index.js`         | `src/main.jsx`              |
| Start command       | `npm start`            | `npm start` (aliases `vite`)|
| Build tool          | Webpack                | Vite (ESBuild + Rollup)     |
| Module type         | CommonJS               | ES Modules (`"type":"module"`) |
| Env prefix          | `REACT_APP_`           | `VITE_`                     |
| Config file         | none / CRA internals   | `vite.config.js`            |
| Cold start          | ~8–15s                 | ~300ms                      |
| HMR                 | Slow                   | Instant                     |
| Build output        | `build/`               | `dist/`                     |

---

## Features

- **Login** — Role-based auth (Admin / Shift Manager), protected routes
- **Dashboard** — Live KPIs, employee list, gate passes, leave requests with approve/reject
- **Employee Directory** *(Admin)* — Search, filter by dept, sort, paginate (8/page), add/edit/delete, attendance bars
- **Document Hub** — Payroll table, Gate Pass management, Activity Log, Export center, Quick Action panel
- **Profile** — Weekly attendance, activity log, session security, edit profile/password modals
- **Notifications** — Bell with unread badge, per-item read state, mark all read
- **Toasts** — Success / warning / error feedback on every action

---

## Backend Integration

Replace the state operations in `src/context/AppContext.jsx` with `async/await` API calls.
The entire UI layer requires **zero changes**.

```js
// Before (in-memory)
const addEmployee = useCallback((emp) => {
  setEmployees(prev => [emp, ...prev])
}, [])

// After (real API)
const addEmployee = useCallback(async (emp) => {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(emp),
  })
  const saved = await res.json()
  setEmployees(prev => [saved, ...prev])
}, [token])
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Build tool | Vite 5                              |
| Framework  | React 18                            |
| Routing    | React Router v6                     |
| Styling    | CSS Modules + CSS Custom Properties |
| Fonts      | Barlow Condensed + Barlow (Google)  |
| Charts     | Recharts (installed, ready to use)  |
| State      | React Context + useState            |

---

*Delivered for NAFTAL — Entreprise Nationale de Raffinage et de Distribution des Produits Pétroliers*
