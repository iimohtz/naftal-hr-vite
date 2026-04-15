import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import AppLayout      from './components/AppLayout/AppLayout'
import ToastContainer from './components/Toast/Toast'
import LoginPage      from './pages/Login/LoginPage'
import DashboardPage  from './pages/Dashboard/DashboardPage'
import EmployeesPage  from './pages/Employees/EmployeesPage'
import DocumentsPage  from './pages/Documents/DocumentsPage'
import ProfilePage    from './pages/Profile/ProfilePage'

/* ─────────────────────────────────────────────────────────────
   ProtectedRoute – redirect to /login if no token present
───────────────────────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { currentUser } = useApp()
  const token = localStorage.getItem('token')

  // Allow access if we have a token OR an active session in context
  // (covers demo login which sets context but uses 'demo-token')
  if (!token && !currentUser) return <Navigate to="/login" replace />
  return children
}

/* ─────────────────────────────────────────────────────────────
   AdminRoute – reads from AppContext (normalized user) so that
   currentUser.type === 'admin' is always accurate regardless of
   how the raw localStorage object is shaped.
   Previously it read user.role from localStorage directly, which
   broke because the raw API person object has no role/type field.
───────────────────────────────────────────────────────────── */
function AdminRoute({ children }) {
  const { currentUser } = useApp()
  const token = localStorage.getItem('token')

  if (!token && !currentUser) return <Navigate to="/login" replace />

  // currentUser.type is set to 'admin' by normalizeUser() in AppContext
  // whenever ADMIN_IDS includes the user's numeric id OR they are a director
  if (currentUser?.type !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}

function AppShell() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={<ProtectedRoute><AppLayout /></ProtectedRoute>}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route
              path="employees"
              element={
                <AdminRoute>
                  <EmployeesPage />
                </AdminRoute>
              }
            />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="profile"   element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}