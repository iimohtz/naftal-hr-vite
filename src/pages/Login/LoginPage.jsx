import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login }  = useApp()
  const navigate   = useNavigate()
  const [id,           setId]           = useState('')
  const [password,     setPassword]     = useState('')
  const [remember,     setRemember]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!id || !password) { setError('Both fields are required.'); return }
    setLoading(true); setError('')

    // Demo path
    const demoOk = login(id, password)
    if (demoOk) { navigate('/dashboard'); setLoading(false); return }

    // Real API
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user',  JSON.stringify(data.person))
      localStorage.setItem('unit',  JSON.stringify(data.unit ?? null))
      login(data.person)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid Employee ID or password.')
    }
    setLoading(false)
  }

  const fillDemo = (type) => {
    if (type === 'admin')   { setId('NFT-2024-00892'); setPassword('admin123') }
    if (type === 'manager') { setId('NF-4829');         setPassword('shift123') }
  }

  return (
    <div className={styles.page}>
      {/* Background: petroleum refinery silhouette feel */}
      <div className={styles.bg}>
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
        {/* Horizontal stripe lines (industrial) */}
        <div className={styles.bgStripes} />
      </div>

      <div className={`${styles.card} animate-scale-in`}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>
            {/* Naftal logo from public folder */}
            <img src="/naftal-logo-png_seeklogo-324747.webp" alt="Naftal" width="42" height="42" style={{ objectFit: 'contain' }} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoNaftal}>NAFTAL</span>
            <span className={styles.logoSync}>HR-SYNC</span>
          </div>
        </div>
        <div className={styles.logoDash} />

        <h1 className={styles.cardTitle}>System Authentication</h1>
        <p className={styles.cardSub}>OPERATIONAL UNIT ACCESS V4.1</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && (
            <div className={styles.errorBox} role="alert">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 4v3.5M7 9.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.fieldLabel}>EMPLOYEE ID</label>
            <input
              className={styles.input}
              type="text"
              placeholder="NF-000-000"
              value={id}
              onChange={e => setId(e.target.value)}
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>SECURE PASSWORD</label>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                }
              </button>
            </div>
          </div>

          <label className={styles.checkRow}>
            <input type="checkbox" className={styles.checkbox} checked={remember} onChange={e => setRemember(e.target.checked)} />
            <span>Recognize this workstation for 24 hours</span>
          </label>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? <span className={styles.spinner} />
              : <>ENTER <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></>
            }
          </button>
        </form>

        <div className={styles.demoHint}>
          <span className={styles.demoLabel}>DEMO ACCESS</span>
          <div className={styles.demoRow}>
            <button className={styles.demoBtn} onClick={() => fillDemo('admin')}>Admin Account</button>
            <span>·</span>
            <button className={styles.demoBtn} onClick={() => fillDemo('manager')}>Shift Manager</button>
          </div>
        </div>
      </div>
    </div>
  )
}
