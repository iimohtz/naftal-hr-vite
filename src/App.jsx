import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import AppLayout     from './components/AppLayout/AppLayout'
import ToastContainer from './components/Toast/Toast'
import LoginPage     from './pages/Login/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import EmployeesPage from './pages/Employees/EmployeesPage'
import DocumentsPage from './pages/Documents/DocumentsPage'
import ProfilePage   from './pages/Profile/ProfilePage'

function ProtectedRoute({ children }) {
  const { currentUser } = useApp()
  return currentUser ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { currentUser } = useApp()
  if (!currentUser)              return <Navigate to="/login"     replace />
  if (currentUser.type !== 'admin') return <Navigate to="/dashboard" replace />
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
            <Route path="employees" element={<AdminRoute><EmployeesPage /></AdminRoute>} />
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
