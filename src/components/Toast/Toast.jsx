import { useApp } from '../../context/AppContext'
import styles from './Toast.module.css'

const ICONS = {
  success: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 6v4M8 12h.01M7.1 2.5L1.4 12a1 1 0 00.9 1.5h11.4a1 1 0 00.9-1.5L9 2.5a1 1 0 00-1.8 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  error:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  info:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7.5V11M8 5.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
}

export default function ToastContainer() {
  const { toasts } = useApp()
  if (!toasts.length) return null

  return (
    <div className={styles.container} role="region" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[`toast--${toast.type || 'success'}`]}`}>
          <span className={styles.toastIcon}>{ICONS[toast.type] || ICONS.success}</span>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
