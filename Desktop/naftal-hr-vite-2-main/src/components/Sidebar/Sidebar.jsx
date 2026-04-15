import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import styles from './Sidebar.module.css'

const DashboardIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
const EmployeesIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 15c0-3.038 2.462-5.5 5.5-5.5S12 11.962 12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12.5 8a2.5 2.5 0 100-5M17 15c0-2.485-1.902-4.5-4.25-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const DocumentIcon  = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M10 1H4a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6l-6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 1v5h5M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const ProfileIcon   = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const SignOutIcon   = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const BrandIcon     = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1"  y="1"  width="7" height="7" rx="1" fill="white" opacity="0.9"/>
    <rect x="10" y="1"  width="7" height="7" rx="1" fill="white" opacity="0.6"/>
    <rect x="1"  y="10" width="7" height="7" rx="1" fill="white" opacity="0.6"/>
    <rect x="10" y="10" width="7" height="7" rx="1" fill="white" opacity="0.3"/>
  </svg>
)

export default function Sidebar() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  // currentUser.type is set to 'admin' by normalizeUser() in AppContext
  // whenever the numeric id is in ADMIN_IDS or the user is a unit director
  const isAdmin = currentUser?.type === 'admin'

  // ── Display name: prefer the normalized full name ──────────────
  // normalizeUser() sets .name = first_name + ' ' + last_name
  const displayName = currentUser?.name || '—'

  // ── Avatar initial: first letter of first_name, fallback to full name ──
  const avatarInitial =
    (currentUser?.firstName || currentUser?.name || '?')
      .charAt(0)
      .toUpperCase()

  // ── Sub-label under name: position title ──────────────────────
  const roleLabel =
    currentUser?.position ||
    currentUser?.badge    ||
    currentUser?.role     ||
    ''

  const navItems = [
    { to: '/dashboard', label: 'DASHBOARD', icon: <DashboardIcon /> },
    ...(isAdmin ? [{ to: '/employees', label: 'EMPLOYEES', icon: <EmployeesIcon /> }] : []),
    { to: '/documents', label: 'DOCUMENTS', icon: <DocumentIcon /> },
    { to: '/profile',   label: 'PROFILE',   icon: <ProfileIcon />  },
  ]

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandLogo}>
          <img src="/naftal-logo-png_seeklogo-287188.webp" alt="Naftal Logo" className={styles.brandLogoImg} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>NAFTAL</span>
          <span className={styles.brandSub}>HR-SYNC · V4.1</span>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          {/* Avatar: first letter of first name */}
          <div className={styles.userAvatar}>{avatarInitial}</div>
          <div className={styles.userDetails}>
            {/* Full name: firstname + lastname from DB */}
            <span className={styles.userName}>{displayName}</span>
            {/* Position title from DB */}
            <span className={styles.userRole}>{roleLabel}</span>
          </div>
        </div>
        <button className={styles.signOutBtn} onClick={handleLogout}>
          <SignOutIcon /><span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  )
}