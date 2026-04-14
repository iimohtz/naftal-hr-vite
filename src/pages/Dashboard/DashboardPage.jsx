import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { StatusBadge, Avatar } from '../../components/UI/UI'
import EmployeeProfileDrawer from '../../components/EmployeeProfileDrawer/EmployeeProfileDrawer'
import styles from './DashboardPage.module.css'

/* ── Doc Hub icons ──────────────────────────────────────────── */
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v10M6 9l4 4 4-4M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const PrintIcon    = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="7" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7V4h6v3M7 13h6M7 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const LogIcon      = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 4h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const ExportIcon   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 10l3-3 3 3M10 7v8M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const CloseIcon    = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>

/* ── Request type config ────────────────────────────────────── */
const TYPE_CONFIG = {
  Annual:    { color: '#FEDD00', bg: 'rgba(254,221,0,0.12)',  label: 'Annual Leave'   },
  Medical:   { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'Medical Leave'  },
  Gate:      { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', label: 'Gate Pass'      },
  Equipment: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', label: 'Equipment'      },
  Document:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Documents'      },
  Other:     { color: '#6B7280', bg: 'rgba(107,114,128,0.12)','label': 'Other'        },
}

function getTypeConf(type) {
  const key = Object.keys(TYPE_CONFIG).find(k => type?.includes(k)) || 'Other'
  return TYPE_CONFIG[key]
}

/* ─────────────────────────────────────────────────────────────
   DEMANDS DETAIL MODAL
   Opens when admin clicks a demand-type chart bar/card
   Shows all requests of that type with approve/reject + attendance
───────────────────────────────────────────────────────────── */
function DemandsDetailModal({ type, requests, employees, onClose, onUpdateStatus }) {
  const [filter, setFilter] = useState('ALL') // ALL | PENDING | APPROVED | REJECTED
  const conf = getTypeConf(type)

  const filtered = requests
    .filter(r => (r.type === type || (type === 'Gate' && r.type?.includes('Gate'))))
    .filter(r => filter === 'ALL' || r.status === filter)
    .sort((a, b) => {
      // pending first
      const order = { PENDING: 0, APPROVED: 1, REJECTED: 2 }
      return (order[a.status] ?? 3) - (order[b.status] ?? 3)
    })

  // find employee attendance for a request
  const getEmpData = (name) =>
    employees.find(e => e.name?.toLowerCase() === name?.toLowerCase()) || null

  const counts = {
    ALL:      requests.filter(r => r.type === type).length,
    PENDING:  requests.filter(r => r.type === type && r.status === 'PENDING').length,
    APPROVED: requests.filter(r => r.type === type && r.status === 'APPROVED').length,
    REJECTED: requests.filter(r => r.type === type && r.status === 'REJECTED').length,
  }

  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalBox}>
        {/* Header */}
        <div className={styles.modalHeader} style={{ borderTop: `4px solid ${conf.color}` }}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalTypeChip} style={{ background: conf.bg, color: conf.color }}>
              {conf.label}
            </div>
            <h2 className={styles.modalTitle}>Demand Requests</h2>
            <p className={styles.modalSub}>{counts.ALL} total · {counts.PENDING} pending review</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Filter tabs */}
        <div className={styles.modalFilters}>
          {['ALL','PENDING','APPROVED','REJECTED'].map(f => (
            <button
              key={f}
              className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(f)}
              style={filter === f ? { borderColor: conf.color, color: conf.color } : {}}
            >
              {f} <span className={styles.filterCount}>{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Request rows */}
        <div className={styles.modalBody}>
          {filtered.length === 0 ? (
            <div className={styles.noRequests}>No {filter !== 'ALL' ? filter.toLowerCase() : ''} requests found.</div>
          ) : (
            filtered.map(req => {
              const emp  = getEmpData(req.employee)
              const att  = emp ? Math.round((emp.present / emp.total) * 100) : null
              const effColor = emp
                ? emp.efficiency >= 90 ? '#15803D' : emp.efficiency >= 75 ? '#B45309' : '#B91C1C'
                : '#9CA3AF'

              return (
                <div key={req.id} className={styles.reqCard}>
                  {/* Left: employee info */}
                  <div className={styles.reqLeft}>
                    <Avatar name={req.employee} size={40} />
                    <div className={styles.reqEmpInfo}>
                      <span className={styles.reqEmpName}>{req.employee}</span>
                      <span className={styles.reqId}>{req.id}</span>
                      {emp && (
                        <span className={styles.reqDept}>{emp.dept} · {emp.role}</span>
                      )}
                    </div>
                  </div>

                  {/* Center: request details */}
                  <div className={styles.reqDetails}>
                    <div className={styles.reqDetailRow}>
                      <span className={styles.reqDetailLabel}>PERIOD</span>
                      <span className={styles.reqDetailVal}>
                        {req.from && req.to ? `${req.from} → ${req.to}` : req.date}
                        {req.days ? ` (${req.days} days)` : ''}
                      </span>
                    </div>
                    {req.note && (
                      <div className={styles.reqDetailRow}>
                        <span className={styles.reqDetailLabel}>NOTE</span>
                        <span className={styles.reqDetailVal}>{req.note}</span>
                      </div>
                    )}
                    {emp && (
                      <div className={styles.reqDetailRow}>
                        <span className={styles.reqDetailLabel}>ATTENDANCE</span>
                        <div className={styles.attInline}>
                          <div className={styles.attBarSmall}>
                            <div
                              className={styles.attFillSmall}
                              style={{ width: `${att}%`, background: effColor }}
                            />
                          </div>
                          <span className={styles.attPct} style={{ color: effColor }}>
                            {att}% ({emp.present}/{emp.total} days)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: status + actions */}
                  <div className={styles.reqRight}>
                    <StatusBadge status={req.status} />
                    {req.status === 'PENDING' && (
                      <div className={styles.reqActions}>
                        <button
                          className={styles.approveBtn}
                          onClick={() => onUpdateStatus(req.id, 'APPROVED')}
                        >
                          ✓ APPROVE
                        </button>
                        <button
                          className={styles.rejectBtn}
                          onClick={() => onUpdateStatus(req.id, 'REJECTED')}
                        >
                          ✕ REJECT
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   FULL HISTORY MODAL
   All requests across all types, filterable, sortable
───────────────────────────────────────────────────────────── */
function HistoryModal({ requests, employees, onClose, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter,   setTypeFilter]   = useState('ALL')
  const [search, setSearch] = useState('')

  const allTypes = [...new Set(requests.map(r => r.type).filter(Boolean))]

  const filtered = requests
    .filter(r => statusFilter === 'ALL' || r.status === statusFilter)
    .filter(r => typeFilter   === 'ALL' || r.type   === typeFilter)
    .filter(r => !search || r.employee?.toLowerCase().includes(search.toLowerCase()) || r.id?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const order = { PENDING: 0, APPROVED: 1, REJECTED: 2 }
      return (order[a.status] ?? 3) - (order[b.status] ?? 3)
    })

  const getEmpData = (name) =>
    employees.find(e => e.name?.toLowerCase() === name?.toLowerCase()) || null

  const pending  = requests.filter(r => r.status === 'PENDING').length
  const approved = requests.filter(r => r.status === 'APPROVED').length
  const rejected = requests.filter(r => r.status === 'REJECTED').length

  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modalBox} ${styles.modalBoxLarge}`}>
        <div className={styles.modalHeader} style={{ borderTop: '4px solid #FEDD00' }}>
          <div className={styles.modalHeaderLeft}>
            <h2 className={styles.modalTitle}>Requests History</h2>
            <p className={styles.modalSub}>
              {requests.length} total · {pending} pending · {approved} approved · {rejected} rejected
            </p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Toolbar */}
        <div className={styles.historyToolbar}>
          <input
            className={styles.historySearch}
            placeholder="Search employee or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className={styles.historySelect}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            className={styles.historySelect}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className={styles.modalBody}>
          {filtered.length === 0 ? (
            <div className={styles.noRequests}>No requests match your filters.</div>
          ) : (
            filtered.map(req => {
              const emp = getEmpData(req.employee)
              const att = emp ? Math.round((emp.present / emp.total) * 100) : null
              const effColor = emp
                ? emp.efficiency >= 90 ? '#15803D' : emp.efficiency >= 75 ? '#B45309' : '#B91C1C'
                : '#9CA3AF'
              const conf = getTypeConf(req.type)

              return (
                <div key={req.id} className={styles.reqCard}>
                  <div className={styles.reqLeft}>
                    <Avatar name={req.employee} size={38} />
                    <div className={styles.reqEmpInfo}>
                      <span className={styles.reqEmpName}>{req.employee}</span>
                      <span className={styles.reqId}>{req.id} · {req.date}</span>
                      {emp && <span className={styles.reqDept}>{emp.dept}</span>}
                    </div>
                  </div>

                  <div className={styles.reqDetails}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                      <span
                        className={styles.typeChipSmall}
                        style={{ background: conf.bg, color: conf.color }}
                      >
                        {req.type}
                      </span>
                      {req.days && <span className={styles.reqDetailVal}>{req.days} days</span>}
                    </div>
                    {req.from && req.to && (
                      <div className={styles.reqDetailRow}>
                        <span className={styles.reqDetailLabel}>PERIOD</span>
                        <span className={styles.reqDetailVal}>{req.from} → {req.to}</span>
                      </div>
                    )}
                    {req.note && (
                      <div className={styles.reqDetailRow}>
                        <span className={styles.reqDetailLabel}>NOTE</span>
                        <span className={styles.reqDetailVal}>{req.note}</span>
                      </div>
                    )}
                    {emp && (
                      <div className={styles.reqDetailRow}>
                        <span className={styles.reqDetailLabel}>ATT.</span>
                        <div className={styles.attInline}>
                          <div className={styles.attBarSmall}>
                            <div className={styles.attFillSmall} style={{ width:`${att}%`, background: effColor }} />
                          </div>
                          <span className={styles.attPct} style={{ color: effColor }}>{att}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.reqRight}>
                    <StatusBadge status={req.status} />
                    {req.status === 'PENDING' && (
                      <div className={styles.reqActions}>
                        <button className={styles.approveBtn} onClick={() => onUpdateStatus(req.id, 'APPROVED')}>✓ APPROVE</button>
                        <button className={styles.rejectBtn}  onClick={() => onUpdateStatus(req.id, 'REJECTED')}>✕ REJECT</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   DEMANDS CHARTS SECTION (admin only)
   Bar chart by type · Donut status chart · Attendance overview
───────────────────────────────────────────────────────────── */
function DemandsSection({ onOpenType, onOpenHistory }) {
  const { requests, employees } = useApp()

  // Group requests by type
  const byType = useMemo(() => {
    const map = {}
    requests.forEach(r => {
      const t = r.type || 'Other'
      if (!map[t]) map[t] = { total: 0, pending: 0, approved: 0, rejected: 0 }
      map[t].total++
      if (r.status === 'PENDING')  map[t].pending++
      if (r.status === 'APPROVED') map[t].approved++
      if (r.status === 'REJECTED') map[t].rejected++
    })
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total)
  }, [requests])

  const maxTotal = Math.max(...byType.map(([, v]) => v.total), 1)

  const totalReq  = requests.length
  const pending   = requests.filter(r => r.status === 'PENDING').length
  const approved  = requests.filter(r => r.status === 'APPROVED').length
  const rejected  = requests.filter(r => r.status === 'REJECTED').length

  // Attendance rate
  const active   = employees.filter(e => e.status === 'ACTIVE').length
  const attRate  = employees.length > 0 ? Math.round((active / employees.length) * 100) : 0

  // Donut SVG values
  const cx = 52, cy = 52, r = 40
  const circumference = 2 * Math.PI * r
  const pPct = totalReq ? pending  / totalReq : 0
  const aPct = totalReq ? approved / totalReq : 0
  const rPct = totalReq ? rejected / totalReq : 0
  const pDash = pPct * circumference
  const aDash = aPct * circumference
  const rDash = rPct * circumference
  const pOffset = 0
  const aOffset = -(pPct * circumference)
  const rOffset = -((pPct + aPct) * circumference)

  return (
    <div className={styles.demandsSection}>
      <div className={styles.demandsSectionHeader}>
        <div>
          <span className={styles.sectionTitle}>DEMANDS OVERVIEW</span>
          <span className={styles.demandsSub}>{totalReq} total requests · Click a type to review</span>
        </div>
        <button className={styles.historyBtn} onClick={onOpenHistory}>
          FULL HISTORY ›
        </button>
      </div>

      <div className={styles.chartsRow}>
        {/* ── Bar chart by type ── */}
        <div className={styles.barChart}>
          <div className={styles.chartTitle}>BY REQUEST TYPE</div>
          <div className={styles.bars}>
            {byType.map(([type, counts]) => {
              const conf = getTypeConf(type)
              const pct  = Math.round((counts.total / maxTotal) * 100)
              return (
                <div key={type} className={styles.barRow} onClick={() => onOpenType(type)} title={`View ${type} requests`}>
                  <span className={styles.barLabel}>{type}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${conf.color}, ${conf.color}BB)` }}
                    />
                    {counts.pending > 0 && (
                      <div
                        className={styles.barPendingOverlay}
                        style={{ width: `${Math.round((counts.pending / maxTotal) * 100)}%` }}
                      />
                    )}
                  </div>
                  <div className={styles.barCounts}>
                    <span className={styles.barTotal}>{counts.total}</span>
                    {counts.pending > 0 && (
                      <span className={styles.barPending}>{counts.pending} pending</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Donut status chart ── */}
        <div className={styles.donutCard}>
          <div className={styles.chartTitle}>BY STATUS</div>
          <div className={styles.donutWrap}>
            <svg width="104" height="104" viewBox="0 0 104 104">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth="14"/>
              {/* Pending - yellow */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FEDD00" strokeWidth="14"
                strokeDasharray={`${pDash} ${circumference}`}
                strokeDashoffset={pOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="butt"
              />
              {/* Approved - green */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#15803D" strokeWidth="14"
                strokeDasharray={`${aDash} ${circumference}`}
                strokeDashoffset={aOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="butt"
              />
              {/* Rejected - red */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#B91C1C" strokeWidth="14"
                strokeDasharray={`${rDash} ${circumference}`}
                strokeDashoffset={rOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="butt"
              />
              <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800" fontFamily="var(--font-display)" fill="var(--text)">{totalReq}</text>
              <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fontFamily="var(--font-display)" fill="var(--text-light)" letterSpacing="1">TOTAL</text>
            </svg>
            <div className={styles.donutLegend}>
              {[
                { label: 'Pending',  count: pending,  color: '#FEDD00' },
                { label: 'Approved', count: approved, color: '#15803D' },
                { label: 'Rejected', count: rejected, color: '#B91C1C' },
              ].map(item => (
                <div key={item.label} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: item.color }} />
                  <span className={styles.legendLabel}>{item.label}</span>
                  <span className={styles.legendCount}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Attendance rate card ── */}
        <div className={styles.attCard}>
          <div className={styles.chartTitle}>ATTENDANCE RATE</div>
          <div className={styles.attCircleWrap}>
            <svg width="104" height="104" viewBox="0 0 104 104">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth="14"/>
              <circle
                cx={cx} cy={cy} r={r} fill="none"
                stroke={attRate >= 90 ? '#15803D' : attRate >= 75 ? '#FEDD00' : '#B91C1C'}
                strokeWidth="14"
                strokeDasharray={`${(attRate / 100) * circumference} ${circumference}`}
                strokeDashoffset="0"
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="round"
              />
              <text x={cx} y={cy - 5} textAnchor="middle" fontSize="19" fontWeight="800" fontFamily="var(--font-display)" fill={attRate >= 90 ? '#15803D' : attRate >= 75 ? '#E5C800' : '#B91C1C'}>{attRate}%</text>
              <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-display)" fill="var(--text-light)" letterSpacing="0.5">ACTIVE</text>
            </svg>
            <div className={styles.attStats}>
              <div className={styles.attStatRow}>
                <span className={styles.attDot} style={{ background: '#15803D' }} />
                <span className={styles.attStatLabel}>Active</span>
                <span className={styles.attStatVal}>{active}</span>
              </div>
              <div className={styles.attStatRow}>
                <span className={styles.attDot} style={{ background: '#FEDD00' }} />
                <span className={styles.attStatLabel}>On Leave</span>
                <span className={styles.attStatVal}>{employees.filter(e=>e.status==='ON LEAVE').length}</span>
              </div>
              <div className={styles.attStatRow}>
                <span className={styles.attDot} style={{ background: '#6B7280' }} />
                <span className={styles.attStatLabel}>Inactive</span>
                <span className={styles.attStatVal}>{employees.filter(e=>e.status==='INACTIVE').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Clickable type cards (quick access) ── */}
      <div className={styles.typeCards}>
        {byType.map(([type, counts]) => {
          const conf = getTypeConf(type)
          return (
            <button key={type} className={styles.typeCard} onClick={() => onOpenType(type)}
              style={{ borderTop: `3px solid ${conf.color}` }}>
              <div className={styles.typeCardIcon} style={{ background: conf.bg, color: conf.color }}>
                {counts.pending > 0
                  ? <span className={styles.typeCardBadge}>{counts.pending}</span>
                  : null}
                <span className={styles.typeCardLetter}>{type.charAt(0)}</span>
              </div>
              <div className={styles.typeCardInfo}>
                <span className={styles.typeCardLabel}>{conf.label}</span>
                <span className={styles.typeCardTotal}>{counts.total} requests</span>
              </div>
              {counts.pending > 0 && (
                <span className={styles.typeCardPending}>{counts.pending} pending</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── KPI Strip ──────────────────────────────────────────────── */
function KpiStrip() {
  const { employees, requests, gatePasses } = useApp()
  const total   = employees.length
  const active  = employees.filter(e => e.status === 'ACTIVE').length
  const attRate = total > 0 ? Math.round((active / total) * 1000) / 10 : 0
  const pendGP  = gatePasses.filter(g => g.status === 'PENDING').length
  const pendReq = requests.filter(r => r.status === 'PENDING').length

  return (
    <div className={styles.kpiStrip}>
      {[
        { label: 'ACTIVE SHIFTS',   value: total.toLocaleString(),                             accent: 'var(--orange)',      border: 'var(--orange)'  },
        { label: 'ATTENDANCE RATE', value: `${attRate}%`,                                      accent: 'var(--green)',       border: 'var(--green)'   },
        { label: 'PENDING PASSES',  value: pendGP,                                             accent: 'var(--text)',        border: '#64748B'         },
        { label: 'LEAVE REQUESTS',  value: pendReq < 10 ? `0${pendReq}` : pendReq,            accent: 'var(--red)',         border: 'var(--red)'     },
      ].map((k, i) => (
        <div key={i} className={styles.kpiCard} style={{ borderTopColor: k.border }}>
          <span className={styles.kpiLabel}>{k.label}</span>
          <span className={styles.kpiValue} style={{ color: k.accent }}>{k.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ── My Employees ───────────────────────────────────────────── */
function MyEmployees({ onViewEmployee }) {
  const { employees } = useApp()
  const navigate = useNavigate()
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>MY EMPLOYEES</span>
        <button className={styles.linkBtn} onClick={() => navigate('/employees')}>DETAIL ›</button>
      </div>
      {employees.slice(0, 5).map(emp => (
        <div key={emp.id} className={styles.empRow}>
          <button className={styles.empClickable} onClick={() => onViewEmployee(emp)}>
            <Avatar name={emp.name} size={36} />
          </button>
          <div className={styles.empInfo}>
            <button className={styles.empNameBtn} onClick={() => onViewEmployee(emp)}>
              {emp.name}
            </button>
            <span className={styles.empId}>ID: {emp.id}</span>
          </div>
          <StatusBadge status={emp.status} />
          <button className={styles.viewBtn} onClick={() => onViewEmployee(emp)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
          </button>
        </div>
      ))}
    </div>
  )
}

/* ── Doc Hub ────────────────────────────────────────────────── */
function DocHubQuick() {
  const navigate = useNavigate()
  const docs = [
    { icon: <DownloadIcon />, label: 'PAYROLL', tab: 'payroll' },
    { icon: <PrintIcon />,    label: 'PASSES',  tab: 'passes'  },
    { icon: <LogIcon />,      label: 'LOGS',    tab: 'logs'    },
    { icon: <ExportIcon />,   label: 'EXPORT',  tab: 'export'  },
  ]
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>DOCUMENT HUB</span>
      </div>
      <div className={styles.docGrid}>
        {docs.map(d => (
          <button key={d.tab} className={styles.docItem} onClick={() => navigate(`/documents?tab=${d.tab}`)}>
            <span className={styles.docIcon}>{d.icon}</span>
            <span className={styles.docLabel}>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Gate Passes Panel ──────────────────────────────────────── */
function GatePassesPanel() {
  const { gatePasses } = useApp()
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>ACTIVE GATE PASSES</span>
        <button className={styles.linkBtn}>FULL LIST ›</button>
      </div>
      <table className={styles.miniTable}>
        <thead>
          <tr>{['REFERENCE','EMPLOYEE','DESTINATION','WINDOW','STATUS'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {gatePasses.slice(0, 4).map(gp => (
            <tr key={gp.id} className={styles.tr}>
              <td className={`${styles.td} ${styles.tdMono}`}>{gp.id}</td>
              <td className={`${styles.td} ${styles.tdBold}`}>{gp.employee}</td>
              <td className={styles.td}>{gp.destination}</td>
              <td className={`${styles.td} ${styles.tdOrange}`}>{gp.window}</td>
              <td className={styles.td}><StatusBadge status={gp.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Requests Quick Panel (now with working HISTORY button) ─── */
function RequestsPanel({ onOpenHistory }) {
  const { requests, updateRequestStatus } = useApp()
  const pending = requests.filter(r => r.status === 'PENDING').slice(0, 3)
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>REQUESTS</span>
        {/* ✅ HISTORY button now actually opens the history modal */}
        <button className={styles.linkBtn} onClick={onOpenHistory}>HISTORY ›</button>
      </div>
      <table className={styles.miniTable}>
        <thead>
          <tr>{['ID','EMPLOYEE','TYPE','DAYS','DATE','ACTIONS'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {pending.length === 0
            ? <tr><td colSpan={6} className={styles.emptyRow}>No pending requests</td></tr>
            : pending.map(req => (
              <tr key={req.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.tdMono}`}>{req.id}</td>
                <td className={`${styles.td} ${styles.tdBold}`}>{req.employee}</td>
                <td className={styles.td}>{req.type}</td>
                <td className={`${styles.td} ${styles.tdBold}`}>{req.days}</td>
                <td className={styles.td}>{req.date}</td>
                <td className={styles.td}>
                  <div className={styles.actionBtns}>
                    <button className={styles.approveBtn2} onClick={() => updateRequestStatus(req.id, 'APPROVED')}>APPROVE</button>
                    <button className={styles.reviewBtn}   onClick={() => updateRequestStatus(req.id, 'REJECTED')}>REJECT</button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

/* ── Manager Gate Passes ────────────────────────────────────── */
function GatePassesManager() {
  const { gatePasses } = useApp()
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>MY GATE PASSES</span>
      </div>
      <table className={styles.miniTable}>
        <thead>
          <tr>{['REFERENCE','TIME','WINDOW','STATUS'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {gatePasses.slice(0, 5).map(gp => (
            <tr key={gp.id} className={styles.tr}>
              <td className={`${styles.td} ${styles.tdMono}`}>{gp.id}</td>
              <td className={styles.td}>{gp.time}</td>
              <td className={`${styles.td} ${styles.tdOrange}`}>{gp.window}</td>
              <td className={styles.td}><StatusBadge status={gp.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── MAIN PAGE ──────────────────────────────────────────────── */
export default function DashboardPage() {
  const { currentUser, requests, employees, updateRequestStatus } = useApp()
  const isAdmin = currentUser?.type === 'admin'

  const [profileEmp,    setProfileEmp]    = useState(null)
  const [demandType,    setDemandType]    = useState(null) // type string | null
  const [showHistory,   setShowHistory]   = useState(false)

  return (
    <div className={styles.page}>
      <KpiStrip />

      {/* ── Admin: Demands charts (full width) ── */}
      {isAdmin && (
        <DemandsSection
          onOpenType={type => setDemandType(type)}
          onOpenHistory={() => setShowHistory(true)}
        />
      )}

      <div className={styles.grid}>
        <div className={styles.col}>
          {isAdmin && <MyEmployees onViewEmployee={setProfileEmp} />}
          <DocHubQuick />
        </div>
        <div className={styles.col}>
          {isAdmin  && <GatePassesPanel />}
          {isAdmin  && <RequestsPanel onOpenHistory={() => setShowHistory(true)} />}
          {!isAdmin && <GatePassesManager />}
        </div>
      </div>

      {/* ── Employee profile drawer ── */}
      {profileEmp && (
        <EmployeeProfileDrawer
          employee={profileEmp}
          onClose={() => setProfileEmp(null)}
          readOnly
        />
      )}

      {/* ── Demand type detail modal ── */}
      {demandType && (
        <DemandsDetailModal
          type={demandType}
          requests={requests}
          employees={employees}
          onClose={() => setDemandType(null)}
          onUpdateStatus={(id, status) => updateRequestStatus(id, status)}
        />
      )}

      {/* ── Full history modal ── */}
      {showHistory && (
        <HistoryModal
          requests={requests}
          employees={employees}
          onClose={() => setShowHistory(false)}
          onUpdateStatus={(id, status) => updateRequestStatus(id, status)}
        />
      )}
    </div>
  )
}
