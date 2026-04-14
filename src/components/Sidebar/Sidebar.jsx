import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import styles from './Sidebar.module.css'

const DashboardIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
const EmployeesIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 15c0-3.038 2.462-5.5 5.5-5.5S12 11.962 12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12.5 8a2.5 2.5 0 100-5M17 15c0-2.485-1.902-4.5-4.25-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const DocumentIcon  = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M10 1H4a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6l-6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 1v5h5M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const ProfileIcon   = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const SignOutIcon   = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>

export default function Sidebar() {
  const { currentUser, logout } = useApp()
  const navigate  = useNavigate()
  const isAdmin   = currentUser?.type === 'admin'

  const displayName   = currentUser?.name || '—'
  const avatarInitial = (currentUser?.firstName || currentUser?.name || '?').charAt(0).toUpperCase()
  const roleLabel     = currentUser?.position || currentUser?.badge || currentUser?.role || ''

  const navItems = [
    { to: '/dashboard', label: 'DASHBOARD', icon: <DashboardIcon /> },
    ...(isAdmin ? [{ to: '/employees', label: 'EMPLOYEES', icon: <EmployeesIcon /> }] : []),
    { to: '/documents', label: 'DOCUMENTS', icon: <DocumentIcon /> },
    { to: '/profile',   label: 'PROFILE',   icon: <ProfileIcon /> },
  ]

  return (
    <aside className={styles.sidebar}>
      {/* ── Brand ── */}
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          {/* Naftal logo from public folder */}
          <img src="/naftal-logo-png_seeklogo-324747.webp" alt="Naftal" width="36" height="36" style={{ objectFit: 'contain' }} />
        </div>
        <div className={styles.brandWords}>
          <span className={styles.brandMain}>NAFTAL</span>
          <span className={styles.brandSub}>HR-SYNC · V4.1</span>
        </div>
      </div>

      {/* Yellow gradient accent stripe */}
      <div className={styles.stripe} />

      {/* ── Nav ── */}
      <nav className={styles.nav} aria-label="Navigation">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{avatarInitial}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userRole}>{roleLabel}</span>
          </div>
        </div>
        <button className={styles.signOutBtn} onClick={() => { logout(); navigate('/login') }}>
          <SignOutIcon />
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  )
}
