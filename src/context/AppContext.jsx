import { createContext, useContext, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────
   ADMIN ACCESS LIST
   Add the numeric DB id of every person who should have admin
   access (i.e. directors / DRH). Matches person.id from the API.
   ───────────────────────────────────────────────────────────── */
export const ADMIN_IDS = [1]

/* ─────────────────────────────────────────────────────────────
   Helper – build a consistent user object from whatever the API
   or the demo path gives us.
   API shape:  data.person  → { id, first_name, last_name,
                                 position, email, phone_ip, unit_id }
               data.unit    → { id, unit_name, unit_type, director_id }
   ───────────────────────────────────────────────────────────── */
export function normalizeUser(person, unit) {
  if (!person) return null

  const numericId  = Number(person.id)
  const firstName  = person.first_name  || person.firstName  || ''
  const lastName   = person.last_name   || person.lastName   || ''
  const fullName   = (firstName && lastName)
    ? `${firstName} ${lastName}`
    : person.name || 'Unknown'

  // A person is admin if their numeric id is in ADMIN_IDS
  // OR if they are the director of their own unit (director_id === person.id)
  const isDirector = unit ? Number(unit.director_id) === numericId : false
  const isAdmin    = ADMIN_IDS.includes(numericId) || isDirector

  return {
    // Keep all raw API fields intact for reference
    ...person,

    // Canonical fields used across the whole UI
    id:          String(person.id ?? ''),
    name:        fullName,                                    // full name for Avatar initials
    firstName,
    lastName,
    displayName: fullName,                                    // shown in Topbar
    email:       person.email       || '',
    phone:       person.phone_ip    || person.phone || '',    // DB field is phone_ip
    position:    person.position    || '',                    // e.g. "Directeur Informatique"
    unit_name:   unit?.unit_name    || '',                    // e.g. "Direction Informatique"
    unit_id:     person.unit_id     || null,
    director_id: unit?.director_id  || null,

    // Auth / role
    type:        isAdmin ? 'admin' : 'user',
    badge:       isAdmin ? 'HR TERMINAL MANAGER' : (person.position || 'EMPLOYEE'),
    role:        person.position    || '',

    // Session (populated server-side if available, otherwise defaults)
    ip:          person.ip          || '—',
    sessionId:   person.sessionId   || '—',
  }
}

/* ─── Seed Data ────────────────────────────────────────────── */
const SEED_EMPLOYEES = [
  { id:'NF-4829', name:'Amine Benali',    dept:'REFINERY OPS',  role:'SITE MANAGER',      status:'ACTIVE',   email:'amine.benali@naftal.dz',    phone:'+213 550 001 001', location:'Zone B – Refinery',    overtime:12.5, present:22, total:22, efficiency:98,  joinDate:'2019-03-12', shift:'Morning'  },
  { id:'NF-9102', name:'Sarah Mansouri',  dept:'LOGISTICS',     role:'FLEET ANALYST',     status:'ACTIVE',   email:'sarah.mansouri@naftal.dz',  phone:'+213 550 001 002', location:'HQ, Algiers',          overtime:8,    present:20, total:22, efficiency:91,  joinDate:'2020-06-05', shift:'Morning'  },
  { id:'NF-1273', name:'Karim Hamidi',    dept:'MAINTENANCE',   role:'SAFETY OFFICER',    status:'ON LEAVE', email:'karim.hamidi@naftal.dz',    phone:'+213 550 001 003', location:'Station HMD-04',       overtime:0,    present:18, total:22, efficiency:82,  joinDate:'2018-01-20', shift:'Evening'  },
  { id:'NF-3304', name:'Leila Brahimi',   dept:'HSE UNIT',      role:'HSE SPECIALIST',    status:'ACTIVE',   email:'leila.brahimi@naftal.dz',   phone:'+213 550 001 004', location:'HQ, Algiers',          overtime:6,    present:22, total:22, efficiency:100, joinDate:'2021-09-01', shift:'Morning'  },
  { id:'NF-5512', name:'Omar Touati',     dept:'INDUSTRIAL IT', role:'LEAD ARCHITECT',    status:'ACTIVE',   email:'omar.touati@naftal.dz',     phone:'+213 550 001 005', location:'HQ, Algiers',          overtime:14,   present:21, total:22, efficiency:95,  joinDate:'2017-02-15', shift:'Morning'  },
  { id:'NF-8842', name:'Ahmed Mansour',   dept:'OPERATIONS',    role:'FIELD ENGINEER',    status:'ACTIVE',   email:'ahmed.mansour@naftal.dz',   phone:'+213 550 001 006', location:'Site A – Maintenance', overtime:10,   present:20, total:22, efficiency:91,  joinDate:'2020-11-08', shift:'Night'    },
  { id:'NF-1290', name:'Fatima Zohra',    dept:'OPERATIONS',    role:'ANALYST',           status:'ACTIVE',   email:'fatima.zohra@naftal.dz',    phone:'+213 550 001 007', location:'HQ, Algiers',          overtime:4,    present:22, total:22, efficiency:100, joinDate:'2022-04-22', shift:'Morning'  },
  { id:'NF-4412', name:'Omar Belkacem',   dept:'LOGISTICS',     role:'COORDINATOR',       status:'ACTIVE',   email:'omar.belkacem@naftal.dz',   phone:'+213 550 001 008', location:'Zone B – Refinery',    overtime:9,    present:21, total:22, efficiency:95,  joinDate:'2019-08-17', shift:'Evening'  },
  { id:'NF-0091', name:'Karim Haddad',    dept:'MAINTENANCE',   role:'TECHNICIAN',        status:'ACTIVE',   email:'karim.haddad@naftal.dz',    phone:'+213 550 001 009', location:'Station HMD-04',       overtime:7,    present:22, total:22, efficiency:100, joinDate:'2021-03-03', shift:'Morning'  },
  { id:'NF-3321', name:'Nadia Brahimi',   dept:'HSE UNIT',      role:'SAFETY OFFICER',    status:'ON LEAVE', email:'nadia.brahimi@naftal.dz',   phone:'+213 550 001 010', location:'HQ, Algiers',          overtime:0,    present:15, total:22, efficiency:68,  joinDate:'2020-07-11', shift:'Morning'  },
  { id:'NF-7731', name:'Yassine Larbi',   dept:'OPERATIONS',    role:'SUPERVISOR',        status:'ACTIVE',   email:'yassine.larbi@naftal.dz',   phone:'+213 550 001 011', location:'Zone B – Refinery',    overtime:11,   present:22, total:22, efficiency:100, joinDate:'2016-01-29', shift:'Morning'  },
  { id:'NF-2210', name:'Lila Amrani',     dept:'MEDICAL UNIT',  role:'NURSE',             status:'ACTIVE',   email:'lila.amrani@naftal.dz',     phone:'+213 550 001 012', location:'HQ, Algiers',          overtime:3,    present:20, total:22, efficiency:91,  joinDate:'2022-10-14', shift:'Evening'  },
  { id:'NF-6601', name:'Mehdi Kaci',      dept:'REFINERY OPS',  role:'PROCESS ENGINEER',  status:'ACTIVE',   email:'mehdi.kaci@naftal.dz',      phone:'+213 550 001 013', location:'Zone B – Refinery',    overtime:16,   present:22, total:22, efficiency:100, joinDate:'2015-05-07', shift:'Morning'  },
  { id:'NF-3390', name:'Samira Ouali',    dept:'INDUSTRIAL IT', role:'SYSTEMS ANALYST',   status:'ACTIVE',   email:'samira.ouali@naftal.dz',    phone:'+213 550 001 014', location:'HQ, Algiers',          overtime:5,    present:21, total:22, efficiency:95,  joinDate:'2021-12-19', shift:'Morning'  },
  { id:'NF-8810', name:'Rachid Bouzid',   dept:'LOGISTICS',     role:'LOGISTICS MANAGER', status:'INACTIVE', email:'rachid.bouzid@naftal.dz',   phone:'+213 550 001 015', location:'Warehouse A',          overtime:0,    present:0,  total:22, efficiency:0,   joinDate:'2018-02-02', shift:'Morning'  },
]

const SEED_GATE_PASSES = [
  { id:'GP-882910', employee:'Ahmed Zitouni',  destination:'Zone B – Refinery Area',   window:'08:00 – 18:00', status:'APPROVED', time:'09:14', date:'25 Oct 2023', reason:'Maintenance inspection'  },
  { id:'GP-883012', employee:'Sara Mehdi',     destination:'Central Archive Unit',     window:'14:00 – 16:30', status:'PENDING',  time:'03:10', date:'25 Oct 2023', reason:'Document retrieval'      },
  { id:'GP-883045', employee:'Omar Touati',    destination:'Station HMD-04 Main Gate', window:'06:00 – 22:00', status:'APPROVED', time:'08:15', date:'24 Oct 2023', reason:'Infrastructure audit'    },
  { id:'GP-883100', employee:'Karim Haddad',   destination:'External Contractor Hub',  window:'09:00 – 11:00', status:'PENDING',  time:'11:45', date:'25 Oct 2023', reason:'Vendor meeting'          },
  { id:'GP-098',    employee:'Ahmed Zitouni',  destination:'Site A – Maintenance',     window:'09:00 – 14:00', status:'APPROVED', time:'07:30', date:'23 Oct 2023', reason:'Equipment check'         },
  { id:'GP-099',    employee:'Sara Mehdi',     destination:'HQ – Admin',              window:'10:30 – 12:30', status:'PENDING',  time:'09:00', date:'25 Oct 2023', reason:'HR appointment'          },
  { id:'GP-097',    employee:'Mehdi Kaci',     destination:'Zone C – Storage',         window:'07:00 – 15:00', status:'APPROVED', time:'06:45', date:'22 Oct 2023', reason:'Stock verification'      },
]

const SEED_REQUESTS = [
  { id:'LR-0041', employee:'Yassine Larbi',  type:'Annual',  days:12, status:'PENDING',  date:'25 Oct 2023', from:'01 Nov 2023', to:'12 Nov 2023', note:'Annual family vacation'       },
  { id:'LR-0042', employee:'Lila Amrani',    type:'Medical', days:3,  status:'PENDING',  date:'25 Oct 2023', from:'26 Oct 2023', to:'28 Oct 2023', note:'Medical follow-up required'   },
  { id:'LR-0038', employee:'Karim Hamidi',   type:'Annual',  days:7,  status:'APPROVED', date:'20 Oct 2023', from:'23 Oct 2023', to:'29 Oct 2023', note:'Personal leave'               },
  { id:'LR-0035', employee:'Omar Belkacem',  type:'Medical', days:2,  status:'APPROVED', date:'15 Oct 2023', from:'17 Oct 2023', to:'18 Oct 2023', note:'Dental surgery recovery'      },
  { id:'LR-0030', employee:'Fatima Zohra',   type:'Annual',  days:5,  status:'REJECTED', date:'10 Oct 2023', from:'15 Oct 2023', to:'19 Oct 2023', note:'Rejected – peak period'       },
  { id:'LR-0028', employee:'Sarah Mansouri', type:'Annual',  days:10, status:'APPROVED', date:'01 Oct 2023', from:'05 Oct 2023', to:'14 Oct 2023', note:'Vacation'                     },
]

const SEED_NOTIFICATIONS = [
  { id:1, text:'Payroll run #0822 for Sector 4 approved',        time:'Today 09:14 AM',     category:'SYSTEM',   read:false },
  { id:2, text:'Security protocols updated by IT department',    time:'Yesterday 04:30 PM', category:'SECURITY', read:false },
  { id:3, text:'Leave request LR-0041 is pending your review',  time:'25 Oct 08:00',        category:'HR',       read:true  },
  { id:4, text:'New employee NF-3390 added to the directory',    time:'24 Oct 10:15',        category:'HR',       read:true  },
  { id:5, text:'Gate pass GP-883100 awaiting approval',         time:'25 Oct 11:45',        category:'SECURITY', read:false },
]

/* ─── Context ────────────────────────────────────────────── */
const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Rehydrate from localStorage on first load
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw  = localStorage.getItem('user')
      const unit = JSON.parse(localStorage.getItem('unit') || 'null')
      if (!raw) return null
      const person = JSON.parse(raw)
      // If already normalized (has .name set), just return as-is
      // Otherwise run through normalizeUser
      if (person?.firstName !== undefined || person?.first_name) {
        return normalizeUser(person, unit)
      }
      return person // demo user already normalized at login time
    } catch { return null }
  })

  const [employees,     setEmployees]     = useState(SEED_EMPLOYEES)
  const [gatePasses,    setGatePasses]    = useState(SEED_GATE_PASSES)
  const [requests,      setRequests]      = useState(SEED_REQUESTS)
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS)
  const [toasts,        setToasts]        = useState([])

  /* ── Auth ── */
  const login = useCallback((personOrId, password) => {
    // ── Real API path: called with the person object from data.person
    if (typeof personOrId === 'object' && personOrId !== null) {
      const unit = JSON.parse(localStorage.getItem('unit') || 'null')
      const normalized = normalizeUser(personOrId, unit)
      setCurrentUser(normalized)
      localStorage.setItem('user', JSON.stringify(personOrId)) // raw for re-hydration
      return true
    }

    // ── Demo path: called with (id string, password string)
    const DEMO_USERS = {
      'NFT-2024-00892': {
        password: 'admin123',
        person: {
          id: 'NFT-2024-00892', first_name: 'Admin', last_name: 'User',
          position: 'HR Terminal Manager', email: 'admin@naftal.dz',
          phone_ip: '+213 550 123 456', unit_id: null,
        },
        unit: { unit_name: 'Direction RH', unit_type: 'direction', director_id: 'NFT-2024-00892' },
      },
      'NF-4829': {
        password: 'shift123',
        person: {
          id: 'NF-4829', first_name: 'Amine', last_name: 'K.',
          position: 'Shift Manager', email: 'amine.k@naftal.dz',
          phone_ip: '+213 550 001 001', unit_id: 2,
        },
        unit: { unit_name: 'Zone B – Refinery', unit_type: 'service', director_id: null },
      },
    }

    const demo = DEMO_USERS[personOrId?.toUpperCase?.()]
    if (demo && demo.password === password) {
      const normalized = normalizeUser(demo.person, demo.unit)
      setCurrentUser(normalized)
      localStorage.setItem('user', JSON.stringify(demo.person))
      localStorage.setItem('unit', JSON.stringify(demo.unit))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('unit')
    localStorage.removeItem('token')
  }, [])

  /* ── Toast ── */
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800)
  }, [])

  /* ── Employees ── */
  const addEmployee    = useCallback((emp)        => { setEmployees(prev => [emp, ...prev]);                                  addToast(`Employee ${emp.name} added successfully.`)        }, [addToast])
  const updateEmployee = useCallback((id, data)   => { setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e)); addToast('Employee record updated.')                     }, [addToast])
  const deleteEmployee = useCallback((id)         => { setEmployees(prev => prev.filter(e => e.id !== id));                   addToast('Employee removed from directory.', 'warning')    }, [addToast])

  /* ── Gate Passes ── */
  const addGatePass          = useCallback((gp)          => { setGatePasses(prev => [gp, ...prev]);                                            addToast(`Gate pass ${gp.id} submitted.`)                                                          }, [addToast])
  const updateGatePassStatus = useCallback((id, status)  => { setGatePasses(prev => prev.map(g => g.id === id ? { ...g, status } : g));        addToast(`Gate pass ${id} ${status.toLowerCase()}.`, status === 'APPROVED' ? 'success' : 'warning') }, [addToast])

  /* ── Requests ── */
  const addRequest          = useCallback((req)         => { setRequests(prev => [req, ...prev]);                                             addToast(`Request ${req.id} submitted for review.`)                                                   }, [addToast])
  const updateRequestStatus = useCallback((id, status)  => { setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));          addToast(`Request ${id} marked as ${status.toLowerCase()}.`, status === 'APPROVED' ? 'success' : 'warning') }, [addToast])

  /* ── Notifications ── */
  const markNotificationRead    = useCallback((id) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)) }, [])
  const markAllNotificationsRead = useCallback(()  => { setNotifications(prev => prev.map(n => ({ ...n, read: true })))                  }, [])

  const value = {
    currentUser, login, logout,
    employees, addEmployee, updateEmployee, deleteEmployee,
    gatePasses, addGatePass, updateGatePassStatus,
    requests, addRequest, updateRequestStatus,
    notifications, markNotificationRead, markAllNotificationsRead,
    toasts, addToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}