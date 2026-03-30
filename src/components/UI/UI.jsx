import styles from './UI.module.css'

/* ─────────────────────────────────────────────────────────────
   StatusBadge
───────────────────────────────────────────────────────────── */
const STATUS_MAP = {
  'ACTIVE':      'green',
  'ON LEAVE':    'amber',
  'INACTIVE':    'grey',
  'APPROVED':    'green',
  'PENDING':     'orange',
  'REJECTED':    'red',
  'ON TIME':     'green',
  'LATE':        'amber',
  'EARLY ENTRY': 'orange',
}

export function StatusBadge({ status, outlined = false }) {
  const variant = STATUS_MAP[status] || 'grey'
  return (
    <span className={`${styles.badge} ${styles[`badge--${variant}`]} ${outlined ? styles['badge--outlined'] : ''}`}>
      {status}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Button
───────────────────────────────────────────────────────────── */
export function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, fullWidth = false, icon, type = 'button', className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[`btn--${variant}`]} ${styles[`btn--${size}`]} ${fullWidth ? styles['btn--full'] : ''} ${className}`}
    >
      {icon && <span className={styles.btnIcon}>{icon}</span>}
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────
   Card
───────────────────────────────────────────────────────────── */
export function Card({ title, subtitle, action, children, noPad = false, className = '' }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || action) && (
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            {title    && <span className={styles.cardTitle}>{title}</span>}
            {subtitle && <span className={styles.cardSubtitle}>{subtitle}</span>}
          </div>
          {action && <div className={styles.cardHeaderAction}>{action}</div>}
        </div>
      )}
      <div className={noPad ? '' : styles.cardBody}>{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Modal
───────────────────────────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, subtitle, children, width = 640 }) {
  if (!isOpen) return null
  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modalBox} animate-scale-in`} style={{ maxWidth: width }}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>{title}</h3>
            {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Form helpers
───────────────────────────────────────────────────────────── */
export function FormField({ label, required, error, children }) {
  return (
    <div className={styles.formField}>
      {label && (
        <label className={styles.formLabel}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {error && <span className={styles.formError}>{error}</span>}
    </div>
  )
}

export function Input({ value, onChange, placeholder, type = 'text', disabled = false, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={styles.input}
      {...rest}
    />
  )
}

export function Select({ value, onChange, children, disabled = false }) {
  return (
    <select value={value} onChange={onChange} disabled={disabled} className={styles.select}>
      {children}
    </select>
  )
}

export function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={styles.textarea}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   Pagination
───────────────────────────────────────────────────────────── */
export function Pagination({ page, totalPages, onPageChange, totalRecords, perPage }) {
  const start = (page - 1) * perPage + 1
  const end   = Math.min(page * perPage, totalRecords)
  const delta = 2
  const pages = []
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i)

  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        SHOWING {start}–{end} OF {totalRecords} RECORDS
      </span>
      <div className={styles.paginationControls}>
        <button className={styles.pageBtn} onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
        {page > 3 && <><button className={styles.pageBtn} onClick={() => onPageChange(1)}>1</button><span className={styles.pageDots}>…</span></>}
        {pages.map(p => (
          <button key={p} className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`} onClick={() => onPageChange(p)}>{p}</button>
        ))}
        {page < totalPages - 2 && <><span className={styles.pageDots}>…</span><button className={styles.pageBtn} onClick={() => onPageChange(totalPages)}>{totalPages}</button></>}
        <button className={styles.pageBtn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Avatar
───────────────────────────────────────────────────────────── */
export function Avatar({ name, size = 36 }) {
  const initials = name ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'
  const colors   = ['#C04008','#1D4ED8','#15803D','#B45309','#6D28D9','#0F766E']
  const color    = colors[name ? name.charCodeAt(0) % colors.length : 0]
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   EmptyState
───────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, message, action }) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <p className={styles.emptyTitle}>{title}</p>
      {message && <p className={styles.emptyMessage}>{message}</p>}
      {action}
    </div>
  )
}
