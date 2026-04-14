import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './Topbar.module.css'

const BellIcon   = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5a6 6 0 016 6v3.75l1.5 1.5v.75H1.5v-.75L3 11.25V7.5a6 6 0 016-6zM7.5 15a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>

const CAT_COLORS = { SYSTEM: 'var(--blue)', SECURITY: 'var(--red)', HR: 'var(--orange)' }

export default function Topbar() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const [showNotif, setShowNotif] = useState(false)
  const [search,    setSearch]    = useState('')
  const ref = useRef(null)
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const displayName   = currentUser?.displayName || currentUser?.name || '—'
  const roleLabel     = currentUser?.position || currentUser?.badge || ''
  const avatarInitial = (currentUser?.firstName || currentUser?.name || '?').charAt(0).toUpperCase()

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.searchBox}>
          <span className={styles.searchIco}><SearchIcon /></span>
          <input
            className={styles.searchInput}
            placeholder="SEARCH…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.notifWrap} ref={ref}>
          <button
            className={`${styles.iconBtn} ${showNotif ? styles.iconBtnActive : ''}`}
            onClick={() => setShowNotif(s => !s)}
            aria-label={`${unread} unread notifications`}
          >
            <BellIcon />
            {unread > 0 && <span className={styles.badge}>{unread > 9 ? '9+' : unread}</span>}
          </button>

          {showNotif && (
            <div className={`${styles.panel} animate-fade-in`}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>NOTIFICATIONS</span>
                {unread > 0 && <button className={styles.markAll} onClick={markAllNotificationsRead}>MARK ALL READ</button>}
              </div>
              <div className={styles.list}>
                {notifications.length === 0 && <div className={styles.empty}>No notifications</div>}
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className={styles.dot} style={{ background: CAT_COLORS[n.category] || 'var(--orange)' }} />
                    <div className={styles.notifBody}>
                      <span className={styles.notifText}>{n.text}</span>
                      <div className={styles.notifMeta}>
                        <span style={{ color: CAT_COLORS[n.category], fontFamily:'var(--font-display)', fontWeight:700, fontSize:9, letterSpacing:'0.1em' }}>{n.category}</span>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                    </div>
                    {!n.read && <span className={styles.unreadDot} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.userChip}>
          <div className={styles.chipTexts}>
            <span className={styles.chipName}>{displayName}</span>
            <span className={styles.chipRole}>{roleLabel}</span>
          </div>
          <div className={styles.chipAvatar}>{avatarInitial}</div>
        </div>
      </div>
    </header>
  )
}
