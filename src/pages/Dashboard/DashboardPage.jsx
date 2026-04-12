import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { StatusBadge, Avatar } from '../../components/UI/UI'
import EmployeeProfileDrawer from '../../components/EmployeeProfileDrawer/EmployeeProfileDrawer'
import styles from './DashboardPage.module.css'

/* ── Icons ─────────────────────────────────────────────────── */
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v10M6 9l4 4 4-4M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const PrintIcon    = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="7" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7V4h6v3M7 13h6M7 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const LogIcon      = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 4h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
const ExportIcon   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 10l3-3 3 3M10 7v8M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>

/* ── KPI Strip ─────────────────────────────────────────────── */
function KpiStrip() {
  const { employees, requests, gatePasses } = useApp()
  const total   = employees.length
  const active  = employees.filter(e => e.status === 'ACTIVE').length
  const attRate = Math.round((active / total) * 1000) / 10
  const pendGP  = gatePasses.filter(g => g.status === 'PENDING').length
  const pendReq = requests.filter(r => r.status === 'PENDING').length

  return (
    <div className={styles.kpiStrip}>
      {[
        { label: 'ACTIVE SHIFTS',   value: total.toLocaleString(), accent: 'var(--orange)', border: 'var(--orange)' },
        { label: 'ATTENDANCE RATE', value: `${attRate}%`,          accent: 'var(--green)',  border: 'var(--green)'  },
        { label: 'PENDING PASSES',  value: pendGP,                 accent: 'var(--text)',   border: '#64748B'        },
        { label: 'LEAVE REQUESTS',  value: pendReq < 10 ? `0${pendReq}` : pendReq, accent: 'var(--red)', border: 'var(--red)' },
      ].map((k, i) => (
        <div key={i} className={styles.kpiCard} style={{ borderTopColor: k.border }}>
          <span className={styles.kpiLabel}>{k.label}</span>
          <span className={styles.kpiValue} style={{ color: k.accent }}>{k.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ── My Employees ──────────────────────────────────────────── */
function MyEmployees({ onViewEmployee }) {
  const { employees } = useApp()
  const navigate = useNavigate()
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>MY EMPLOYEES</span>
        <button className={styles.linkBtn} onClick={() => navigate('/employees')}>DETAIL <span>›</span></button>
      </div>
      {employees.slice(0, 5).map(emp => (
        <div key={emp.id} className={styles.empRow}>
          {/* Clicking the avatar or name opens the profile drawer */}
          <button className={styles.empClickable} onClick={() => onViewEmployee(emp)} title="View profile">
            <Avatar name={emp.name} size={36} />
          </button>
          <div className={styles.empInfo}>
            <button className={styles.empNameBtn} onClick={() => onViewEmployee(emp)}>
              {emp.name}
            </button>
            <span className={styles.empId}>ID: {emp.id}</span>
          </div>
          <StatusBadge status={emp.status} />
          <button className={styles.viewBtn} onClick={() => onViewEmployee(emp)} title="View employee profile">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
          </button>
        </div>
      ))}
    </div>
  )
}

/* ── Document Hub Quick ────────────────────────────────────── */
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
        {docs.map((d) => (
          <button key={d.tab} className={styles.docItem} onClick={() => navigate(`/documents?tab=${d.tab}`)}>
            <span className={styles.docIcon}>{d.icon}</span>
            <span className={styles.docLabel}>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Gate Passes Panel ─────────────────────────────────────── */
function GatePassesPanel() {
  const { gatePasses } = useApp()
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>ACTIVE GATE PASSES</span>
        <button className={styles.linkBtn}>FULL LIST <span>›</span></button>
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

/* ── Requests Panel ────────────────────────────────────────── */
function RequestsPanel() {
  const { requests, updateRequestStatus } = useApp()
  const pending = requests.filter(r => r.status === 'PENDING').slice(0, 3)
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>REQUESTS</span>
        <button className={styles.linkBtn}>HISTORY <span>›</span></button>
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
                    <button className={styles.approveBtn} onClick={() => updateRequestStatus(req.id, 'APPROVED')}>APPROVE</button>
                    <button className={styles.reviewBtn}  onClick={() => updateRequestStatus(req.id, 'REJECTED')}>REJECT</button>
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

/* ── Manager Gate Passes ───────────────────────────────────── */
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

/* ── Main ──────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { currentUser } = useApp()
  const isAdmin = currentUser?.type === 'admin'
  const [profileEmp, setProfileEmp] = useState(null)

  return (
    <div className={styles.page}>
      <KpiStrip />
      <div className={styles.grid}>
        <div className={styles.col}>
          {isAdmin && <MyEmployees onViewEmployee={setProfileEmp} />}
          <DocHubQuick />
        </div>
        <div className={styles.col}>
          {isAdmin  && <GatePassesPanel />}
          {isAdmin  && <RequestsPanel />}
          {!isAdmin && <GatePassesManager />}
        </div>
      </div>

      {/* Floating profile drawer */}
      {profileEmp && (
        <EmployeeProfileDrawer
          employee={profileEmp}
          onClose={() => setProfileEmp(null)}
          readOnly
        />
      )}
    </div>
  )
}
