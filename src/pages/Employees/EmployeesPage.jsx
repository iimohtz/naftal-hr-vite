import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { StatusBadge, Button, Avatar, Pagination, Modal, FormField, Input, Select, Textarea } from '../../components/UI/UI'
import styles from './EmployeesPage.module.css'

const DEPTS   = ['ALL', 'OPERATIONS', 'LOGISTICS', 'REFINERY OPS', 'MAINTENANCE', 'HSE UNIT', 'INDUSTRIAL IT', 'MEDICAL UNIT']
const PER_PAGE = 8

/* ── Employee Form Modal ───────────────────────────────────── */
function EmployeeFormModal({ employee, onClose }) {
  const { addEmployee, updateEmployee } = useApp()
  const isEdit = Boolean(employee)
  const empty  = { id:'', name:'', dept:'OPERATIONS', role:'', status:'ACTIVE', email:'', phone:'', location:'', shift:'Morning', joinDate:'', present:0, total:22, overtime:0, efficiency:100 }
  const [form, setForm]   = useState(isEdit ? { ...employee } : empty)
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.id.trim())   e.id   = 'Employee ID is required'
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.role.trim()) e.role = 'Operational role is required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    isEdit ? updateEmployee(form.id, form) : addEmployee(form)
    onClose()
  }

  return (
    <Modal isOpen onClose={onClose} title={isEdit ? `EDIT — ${employee.id}` : 'ADD NEW EMPLOYEE'} subtitle={isEdit ? 'Modify personnel record' : 'Register new personnel to the directory'} width={680}>
      <div className={styles.formGrid}>
        <FormField label="Employee ID" required error={errors.id}>
          <Input value={form.id} onChange={e => set('id', e.target.value)} placeholder="NF-0000" disabled={isEdit} />
        </FormField>
        <FormField label="Full Name" required error={errors.name}>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="First Last" />
        </FormField>
        <FormField label="Department">
          <Select value={form.dept} onChange={e => set('dept', e.target.value)}>
            {DEPTS.slice(1).map(d => <option key={d}>{d}</option>)}
          </Select>
        </FormField>
        <FormField label="Operational Role" required error={errors.role}>
          <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Site Manager" />
        </FormField>
        <FormField label="Email Address" required error={errors.email}>
          <Input value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@naftal.dz" />
        </FormField>
        <FormField label="Phone Number">
          <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+213 5XX XXX XXX" />
        </FormField>
        <FormField label="Work Location">
          <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="HQ, Algiers" />
        </FormField>
        <FormField label="Shift">
          <Select value={form.shift} onChange={e => set('shift', e.target.value)}>
            {['Morning','Evening','Night'].map(s => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Join Date">
          <Input type="date" value={form.joinDate} onChange={e => set('joinDate', e.target.value)} />
        </FormField>
        <FormField label="Status">
          <Select value={form.status} onChange={e => set('status', e.target.value)}>
            {['ACTIVE','ON LEAVE','INACTIVE'].map(s => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
      </div>

      {isEdit && (
        <div className={styles.attendanceGrid}>
          <div className={styles.attendanceTitle}>ATTENDANCE — THIS MONTH</div>
          <div className={styles.attendanceCols}>
            <FormField label="Present Days"><Input type="number" value={form.present}    onChange={e => set('present',    +e.target.value)} /></FormField>
            <FormField label="Total Days">  <Input type="number" value={form.total}      onChange={e => set('total',      +e.target.value)} /></FormField>
            <FormField label="Overtime (h)"><Input type="number" value={form.overtime}   onChange={e => set('overtime',   +e.target.value)} /></FormField>
            <FormField label="Efficiency %"><Input type="number" value={form.efficiency} onChange={e => set('efficiency', +e.target.value)} /></FormField>
          </div>
        </div>
      )}

      <div className={styles.modalFooter}>
        <Button variant="secondary" onClick={onClose}>CANCEL</Button>
        <Button variant="primary"   onClick={handleSubmit}>{isEdit ? 'SAVE CHANGES' : 'ADD EMPLOYEE'}</Button>
      </div>
    </Modal>
  )
}

/* ── Employee Detail Modal ─────────────────────────────────── */
function EmployeeDetailModal({ employee, onClose, onEdit }) {
  const { deleteEmployee } = useApp()
  const attPct = Math.round((employee.present / employee.total) * 100)

  const handleDelete = () => {
    if (window.confirm(`Remove ${employee.name} from the directory? This cannot be undone.`)) {
      deleteEmployee(employee.id); onClose()
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={employee.name} subtitle={`${employee.id} · ${employee.role}`} width={620}>
      <div className={styles.detailBody}>
        <div className={styles.detailHead}>
          <Avatar name={employee.name} size={64} />
          <div className={styles.detailHeadInfo}>
            <h2 className={styles.detailName}>{employee.name}</h2>
            <p className={styles.detailRole}>{employee.role}</p>
            <StatusBadge status={employee.status} />
          </div>
        </div>

        <div className={styles.infoGrid}>
          {[['Employee ID',employee.id],['Department',employee.dept],['Email',employee.email],['Phone',employee.phone],['Location',employee.location],['Shift',employee.shift],['Join Date',employee.joinDate]].map(([label, val]) => (
            <div key={label} className={styles.infoItem}>
              <span className={styles.infoLabel}>{label.toUpperCase()}</span>
              <span className={styles.infoVal}>{val || '—'}</span>
            </div>
          ))}
        </div>

        <div className={styles.statsBox}>
          <div className={styles.statsTitle}>ATTENDANCE — THIS MONTH</div>
          <div className={styles.statsRow}>
            <div className={styles.statItem}><span className={styles.statItemLabel}>PRESENT</span>    <span className={styles.statItemVal}>{employee.present}/{employee.total}</span></div>
            <div className={styles.statItem}><span className={styles.statItemLabel}>OVERTIME</span>   <span className={styles.statItemVal} style={{ color:'var(--orange)' }}>{employee.overtime}h</span></div>
            <div className={styles.statItem}><span className={styles.statItemLabel}>EFFICIENCY</span> <span className={styles.statItemVal}>{employee.efficiency}%</span></div>
          </div>
          <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width:`${attPct}%` }} /></div>
          <div className={styles.progressLabel}>{attPct}% attendance rate this month</div>
        </div>
      </div>

      <div className={styles.modalFooter}>
        <Button variant="danger"    onClick={handleDelete}>DELETE RECORD</Button>
        <div style={{ flex:1 }} />
        <Button variant="secondary" onClick={onClose}>CLOSE</Button>
        <Button variant="primary"   onClick={() => { onClose(); onEdit(employee) }}>EDIT RECORD</Button>
      </div>
    </Modal>
  )
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function EmployeesPage() {
  const { employees } = useApp()
  const [deptFilter, setDeptFilter] = useState('ALL')
  const [search,     setSearch]     = useState('')
  const [sortBy,     setSortBy]     = useState('id')
  const [page,       setPage]       = useState(1)
  const [addOpen,    setAddOpen]    = useState(false)
  const [editEmp,    setEditEmp]    = useState(null)
  const [detailEmp,  setDetailEmp]  = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return employees
      .filter(e => deptFilter === 'ALL' || e.dept === deptFilter)
      .filter(e => !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q))
      .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : sortBy === 'dept' ? a.dept.localeCompare(b.dept) : a.id.localeCompare(b.id))
  }, [employees, deptFilter, search, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const shown      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const activeCount   = employees.filter(e => e.status === 'ACTIVE').length
  const onLeaveCount  = employees.filter(e => e.status === 'ON LEAVE').length
  const inactiveCount = employees.filter(e => e.status === 'INACTIVE').length

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>EMPLOYEE DIRECTORY</h1>
          <p className={styles.pageSub}>Real-time personnel management and operational status.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setAddOpen(true)}
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}>
          ADD EMPLOYEE
        </Button>
      </div>

      <div className={styles.kpiBar}>
        {[
          { label:'TOTAL HEADCOUNT', value:employees.length.toLocaleString(), color:'var(--orange)', border:'var(--orange)' },
          { label:'ACTIVE NOW',      value:activeCount.toLocaleString(),       color:'var(--green)',  border:'var(--green)'  },
          { label:'ON LEAVE',        value:onLeaveCount,                        color:'var(--text)',   border:'#64748B'        },
          { label:'INACTIVE',        value:inactiveCount,                       color:'var(--red)',    border:'var(--red)'    },
        ].map((k,i) => (
          <div key={i} className={styles.kpiItem} style={{ borderTopColor: k.border }}>
            <span className={styles.kpiLabel}>{k.label}</span>
            <span className={styles.kpiVal}   style={{ color: k.color }}>{k.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <span className={styles.filterLabel}>DEPT:</span>
            {DEPTS.map(d => (
              <button key={d} className={`${styles.filterBtn} ${deptFilter === d ? styles.filterBtnActive : ''}`} onClick={() => { setDeptFilter(d); setPage(1) }}>
                {d === 'ALL' ? 'ALL DEPTS' : d}
              </button>
            ))}
          </div>
          <div className={styles.toolbarRight}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIco} width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 10l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              <input className={styles.searchInput} placeholder="Search name, ID, role…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
              {search && <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>}
            </div>
            <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="id">SORT: ID</option>
              <option value="name">SORT: NAME</option>
              <option value="dept">SORT: DEPT</option>
            </Select>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>{['ID CODE','EMPLOYEE','DEPARTMENT','ROLE','SHIFT','STATUS','ATTENDANCE','ACTIONS'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {shown.length === 0
                ? <tr><td colSpan={8}><div className={styles.emptyState}><svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity="0.3"><circle cx="18" cy="12" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><p>No employees match your criteria.</p></div></td></tr>
                : shown.map(emp => (
                  <tr key={emp.id} className={styles.tr}>
                    <td className={styles.td}><span className={styles.idCell}>{emp.id}</span></td>
                    <td className={styles.td}>
                      <div className={styles.empCell}>
                        <Avatar name={emp.name} size={32} />
                        <div className={styles.empCellText}>
                          <span className={styles.empCellName}>{emp.name}</span>
                          <span className={styles.empCellEmail}>{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}><span className={styles.deptCell}>{emp.dept}</span></td>
                    <td className={styles.td}><span className={styles.roleCell}>{emp.role}</span></td>
                    <td className={styles.td}><span className={styles.shiftCell}>{emp.shift}</span></td>
                    <td className={styles.td}><StatusBadge status={emp.status} /></td>
                    <td className={styles.td}>
                      <div className={styles.attCell}>
                        <div className={styles.attBar}><div className={styles.attFill} style={{ width:`${Math.round((emp.present/emp.total)*100)}%`, background: emp.efficiency>=90?'var(--green)':emp.efficiency>=75?'var(--amber)':'var(--red)' }}/></div>
                        <span className={styles.attLabel}>{emp.present}/{emp.total}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="View" onClick={() => setDetailEmp(emp)}>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><ellipse cx="7.5" cy="7.5" rx="6.5" ry="4" stroke="currentColor" strokeWidth="1.4"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                        </button>
                        <button className={styles.actionBtn} title="Edit" onClick={() => setEditEmp(emp)}>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10.5 1.5l3 3L5 13H2v-3L10.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.actionBtnPrint}`} title="Print">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2.5" y="5.5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5.5V3h5v2.5M5 10h5M5 12.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalRecords={filtered.length} perPage={PER_PAGE} />
      </div>

      {addOpen   && <EmployeeFormModal onClose={() => setAddOpen(false)} />}
      {editEmp   && <EmployeeFormModal employee={editEmp} onClose={() => setEditEmp(null)} />}
      {detailEmp && <EmployeeDetailModal employee={detailEmp} onClose={() => setDetailEmp(null)} onEdit={emp => setEditEmp(emp)} />}
    </div>
  )
}
