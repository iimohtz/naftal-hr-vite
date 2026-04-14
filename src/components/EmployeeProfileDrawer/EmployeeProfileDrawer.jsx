import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { StatusBadge, Avatar } from '../UI/UI'
import styles from './EmployeeProfileDrawer.module.css'

/* ── Mini icons ─────────────────────────────────────────────── */
const IDIcon       = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 7h5M4.5 9.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const EmailIcon    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/></svg>
const PhoneIcon    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M4.5 1.5h5a1 1 0 011 1v9a1 1 0 01-1 1h-5a1 1 0 01-1-1v-9a1 1 0 011-1zM6.5 11h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const LocationIcon = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1.5a4 4 0 014 4c0 2.5-4 7-4 7S3 8 3 5.5a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>
const DeptIcon     = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 5V3.5A1.5 1.5 0 016 2h2a1.5 1.5 0 011.5 1.5V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const ShiftIcon    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const CalIcon      = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h12M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
const CloseIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
const EditIcon     = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
const DeleteIcon   = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4M6 7v4M8 7v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><rect x="2.5" y="4" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>

/* ─────────────────────────────────────────────────────────────
   EmployeeProfileDrawer
   Props:
     employee  – the employee object (all fields from the form)
     onClose   – called when the user closes the drawer
     onEdit    – (optional) opens the edit form for this employee
     readOnly  – hides Edit/Delete buttons (e.g. when opened from Documents)
─────────────────────────────────────────────────────────────── */
export default function EmployeeProfileDrawer({ employee, onClose, onEdit, readOnly = false }) {
  const { deleteEmployee, addToast } = useApp()

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!employee) return null

  const attPct = employee.total > 0
    ? Math.round((employee.present / employee.total) * 100)
    : 0

  const effColor =
    employee.efficiency >= 90 ? 'var(--green)' :
    employee.efficiency >= 75 ? 'var(--amber)' :
    'var(--red)'

  const handleDelete = () => {
    if (window.confirm(`Remove ${employee.name} from the directory? This cannot be undone.`)) {
      deleteEmployee(employee.id)
      addToast(`${employee.name} removed from directory.`, 'warning')
      onClose()
    }
  }

  const metaRows = [
    { icon: <IDIcon />,       label: 'Employee ID',  val: employee.id       },
    { icon: <EmailIcon />,    label: 'Email',         val: employee.email    },
    { icon: <PhoneIcon />,    label: 'Phone',         val: employee.phone    },
    { icon: <LocationIcon />, label: 'Location',      val: employee.location },
    { icon: <DeptIcon />,     label: 'Department',    val: employee.dept     },
    { icon: <ShiftIcon />,    label: 'Shift',         val: employee.shift    },
    { icon: <CalIcon />,      label: 'Join Date',     val: employee.joinDate },
  ]

  return (
    /* Backdrop */
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Drawer panel */}
      <div className={styles.drawer}>

        {/* ── Header ── */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.headerLabel}>EMPLOYEE PROFILE</span>
            <span className={styles.headerSub}>{employee.id}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close profile">
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className={styles.drawerBody}>

          {/* Hero card */}
          <div className={styles.heroCard}>
            <Avatar name={employee.name} size={72} />
            <div className={styles.heroInfo}>
              <h2 className={styles.heroName}>{employee.name}</h2>
              <p className={styles.heroRole}>{employee.role}</p>
              <div className={styles.heroStatus}>
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>PERSONAL INFORMATION</div>
            <div className={styles.metaList}>
              {metaRows.map(({ icon, label, val }) => (
                <div key={label} className={styles.metaRow}>
                  <span className={styles.metaIcon}>{icon}</span>
                  <div className={styles.metaContent}>
                    <span className={styles.metaLabel}>{label}</span>
                    <span className={styles.metaVal}>{val || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>ATTENDANCE — THIS MONTH</div>
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>PRESENT</span>
                <span className={styles.statVal}>{employee.present}/{employee.total}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>OVERTIME</span>
                <span className={styles.statVal} style={{ color: 'var(--orange)' }}>{employee.overtime}h</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>EFFICIENCY</span>
                <span className={styles.statVal} style={{ color: effColor }}>{employee.efficiency}%</span>
              </div>
            </div>

            {/* Attendance bar */}
            <div className={styles.barWrap}>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${attPct}%`, background: effColor }} />
              </div>
              <span className={styles.barLabel}>{attPct}% attendance rate this month</span>
            </div>

            {/* Efficiency bar */}
            <div className={styles.barWrap}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span className={styles.metaLabel}>EFFICIENCY INDEX</span>
                <span className={styles.metaLabel}>{employee.efficiency}%</span>
              </div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${employee.efficiency}%`, background: effColor }} />
              </div>
            </div>
          </div>

          {/* Contract info (if available) */}
          {(employee.contract_type || employee.contract_start_date) && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>CONTRACT</div>
              <div className={styles.metaList}>
                {employee.contract_type && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}><DeptIcon /></span>
                    <div className={styles.metaContent}>
                      <span className={styles.metaLabel}>Contract Type</span>
                      <span className={styles.metaVal}>{employee.contract_type}</span>
                    </div>
                  </div>
                )}
                {employee.contract_start_date && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}><CalIcon /></span>
                    <div className={styles.metaContent}>
                      <span className={styles.metaLabel}>Start Date</span>
                      <span className={styles.metaVal}>{employee.contract_start_date}</span>
                    </div>
                  </div>
                )}
                {employee.contract_end_date && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}><CalIcon /></span>
                    <div className={styles.metaContent}>
                      <span className={styles.metaLabel}>End Date</span>
                      <span className={styles.metaVal}>{employee.contract_end_date}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer actions ── */}
        {!readOnly && (
          <div className={styles.drawerFooter}>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              <DeleteIcon /> DELETE RECORD
            </button>
            <div style={{ flex: 1 }} />
            <button className={styles.editBtn} onClick={() => { onClose(); onEdit(employee) }}>
              <EditIcon /> EDIT RECORD
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
