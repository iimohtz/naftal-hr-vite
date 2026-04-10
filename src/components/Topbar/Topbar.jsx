import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './Topbar.module.css'

const BellIcon   = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5a6 6 0 016 6v3.75l1.5 1.5v.75H1.5v-.75L3 11.25V7.5a6 6 0 016-6zM7.5 15a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>

const CATEGORY_COLORS = { SYSTEM: 'var(--blue)', SECURITY: 'var(--red)', HR: 'var(--orange)' }

export default function Topbar() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const [showNotif, setShowNotif] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const notifRef = useRef(null)

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Display name shown in the top-right chip ───────────────────
  // normalizeUser() in AppContext sets .name = first_name + ' ' + last_name
  // and .displayName to the same value.
  const displayName =
    currentUser?.displayName ||
    currentUser?.name        ||
    '—'

  // ── Sub-label: position title from the DB ──────────────────────
  const roleLabel =
    currentUser?.position ||
    currentUser?.badge    ||
    currentUser?.role     ||
    ''

  // ── Avatar initial: first letter of first name ─────────────────
  const avatarInitial =
    (currentUser?.firstName || currentUser?.name || '?')
      .charAt(0)
      .toUpperCase()

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input
            className={styles.searchInput}
            placeholder="SEARCH"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.topbarRight}>
        {/* ── Notifications ── */}
        <div className={styles.notifWrap} ref={notifRef}>
          <button
            className={`${styles.iconBtn} ${showNotif ? styles.iconBtnActive : ''}`}
            onClick={() => setShowNotif(s => !s)}
            aria-label={`Notifications – ${unread} unread`}
          >
            <BellIcon />
            {unread > 0 && (
              <span className={styles.notifBadge}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {showNotif && (
            <div className={`${styles.notifPanel} animate-fade-in`}>
              <div className={styles.notifHeader}>
                <span className={styles.notifTitle}>NOTIFICATIONS</span>
                {unread > 0 && (
                  <button className={styles.notifMarkAll} onClick={markAllNotificationsRead}>
                    MARK ALL READ
                  </button>
                )}
              </div>
              <div className={styles.notifList}>
                {notifications.length === 0 && (
                  <div className={styles.notifEmpty}>No notifications</div>
                )}
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`${styles.notifItem} ${!n.read ? styles.notifItemUnread : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div
                      className={styles.notifDot}
                      style={{ background: CATEGORY_COLORS[n.category] || 'var(--orange)' }}
                    />
                    <div className={styles.notifContent}>
                      <span className={styles.notifText}>{n.text}</span>
                      <div className={styles.notifMeta}>
                        <span className={styles.notifCat} style={{ color: CATEGORY_COLORS[n.category] }}>
                          {n.category}
                        </span>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                    </div>
                    {!n.read && <span className={styles.notifUnreadDot} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.divider} />

        {/* ── User chip ── */}
        <div className={styles.userChip}>
          <div className={styles.userTexts}>
            {/* Full name: firstname + lastname from DB */}
            <span className={styles.userChipName}>{displayName}</span>
            {/* Position title from DB */}
            <span className={styles.userChipRole}>{roleLabel}</span>
          </div>
          {/* Avatar: first letter of first name */}
          <div className={styles.userChipAvatar}>{avatarInitial}</div>
        </div>
      </div>
    </header>
  )
}