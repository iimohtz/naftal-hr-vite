import { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  StatusBadge,
  Avatar,
  Button,
  Modal,
  FormField,
  Input,
} from "../../components/UI/UI";
import styles from "./ProfilePage.module.css";

const WEEK_DATA = [
  { day: "SUN", enter: "08:00", leave: "16:30", status: "ON TIME" },
  { day: "MON", enter: "08:15", leave: "16:35", status: "LATE" },
  { day: "TUE", enter: "07:55", leave: "16:30", status: "EARLY ENTRY" },
  { day: "WED", enter: "08:00", leave: "16:30", status: "ON TIME" },
  { day: "THU", enter: "08:05", leave: "16:30", status: "ON TIME" },
];

const ACTIVITY_LOG = [
  {
    icon: "A",
    text: "APPROVED PAYROLL RUN: SECTOR 4",
    meta: "Today, 09:14 AM · #0822",
    tag: "SYSTEM",
    color: "var(--blue)",
  },
  {
    icon: "U",
    text: "UPDATED SECURITY PROTOCOLS",
    meta: "Yesterday, 04:30 PM",
    tag: "SECURITY",
    color: "var(--red)",
  },
  {
    icon: "R",
    text: "REVIEWED LEAVE REQUEST LR-0041",
    meta: "25 Oct 2023, 08:30 AM",
    tag: "HR",
    color: "var(--orange)",
  },
  {
    icon: "G",
    text: "APPROVED GATE PASS GP-882910",
    meta: "24 Oct 2023, 07:45 AM",
    tag: "SECURITY",
    color: "var(--green)",
  },
];

/* Mini Icons */
const IDIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect
      x="1"
      y="3"
      width="12"
      height="8"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M4.5 7h5M4.5 9.5h3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect
      x="1"
      y="3"
      width="12"
      height="8"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M4.5 1.5h5a1 1 0 011 1v9a1 1 0 01-1 1h-5a1 1 0 01-1-1v-9a1 1 0 011-1zM6.5 11h1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1.5a4 4 0 014 4c0 2.5-4 7-4 7S3 8 3 5.5a4 4 0 014-4z"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);
const CalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="1"
      y="3"
      width="14"
      height="12"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M1 7h14M5 1v4M11 1v4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M8 4v4l3 2"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

function EditProfileModal({ user, onClose }) {
  const { addToast } = useApp();
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
  });
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="EDIT PROFILE"
      subtitle="Update your account information"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Full Name">
          {" "}
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </FormField>
        <FormField label="Email">
          {" "}
          <Input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </FormField>
        <FormField label="Phone">
          {" "}
          <Input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </FormField>
        <FormField label="Location">
          {" "}
          <Input
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
          />
        </FormField>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            paddingTop: 8,
            borderTop: "1px solid var(--border)",
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addToast("Profile updated successfully.");
              onClose();
            }}
          >
            SAVE CHANGES
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ChangePasswordModal({ onClose }) {
  const { addToast } = useApp();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [err, setErr] = useState("");
  const handleSave = () => {
    if (!form.current) {
      setErr("Enter your current password.");
      return;
    }
    if (form.next.length < 6) {
      setErr("New password must be at least 6 characters.");
      return;
    }
    if (form.next !== form.confirm) {
      setErr("Passwords do not match.");
      return;
    }
    addToast("Password changed successfully.");
    onClose();
  };
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="CHANGE PASSWORD"
      subtitle="Update your secure access credential"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {err && (
          <div
            style={{
              background: "var(--red-bg)",
              border: "1px solid var(--red-border)",
              borderRadius: "var(--radius)",
              padding: "10px 14px",
              color: "var(--red)",
              fontSize: 12,
            }}
          >
            {err}
          </div>
        )}
        <FormField label="Current Password">
          {" "}
          <Input
            type="password"
            value={form.current}
            onChange={(e) =>
              setForm((f) => ({ ...f, current: e.target.value }))
            }
            placeholder="••••••••"
          />
        </FormField>
        <FormField label="New Password">
          {" "}
          <Input
            type="password"
            value={form.next}
            onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))}
            placeholder="••••••••"
          />
        </FormField>
        <FormField label="Confirm Password">
          {" "}
          <Input
            type="password"
            value={form.confirm}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirm: e.target.value }))
            }
            placeholder="••••••••"
          />
        </FormField>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            paddingTop: 8,
            borderTop: "1px solid var(--border)",
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={handleSave}>
            UPDATE PASSWORD
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function ProfilePage() {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.type === "admin";
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  const stats = isAdmin
    ? { present: 22, total: 22, overtime: "14.5h", efficiency: 98 }
    : { present: 20, total: 22, overtime: "12.5h", efficiency: 91 };
  const session = {
    lastLogin: "25 OCT 2023  08:00 AM",
    ip: currentUser?.ip || "192.168.1.104",
    sessionId: currentUser?.sessionId || "#NFT-0000-XX",
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {isAdmin ? "ADMINISTRATOR PROFILE" : "MY PROFILE"}
          </h1>
          <p className={styles.pageSub}>
            SYSTEM ACCESS LEVEL:{" "}
            {isAdmin ? "TIER 1 OPERATIONAL CONTROL" : "TIER 2 SHIFT MANAGEMENT"}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left */}
        <div className={styles.leftCol}>
          <div className={styles.identityCard}>
            <div className={styles.avatarWrap}>
              <Avatar name={currentUser?.name} size={88} />
              <div className={styles.avatarBadge}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9l-3 1.5.5-3.5L2 4.5 5.5 4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.idName}>
              {currentUser?.name?.toUpperCase()}
            </div>
            <div className={styles.idRole}>{currentUser?.role}</div>
            <div className={styles.idMeta}>
              {[
                { key:'id',       icon:<IDIcon/>,       val:currentUser?.id       },
                { key:'email',    icon:<EmailIcon/>,    val:currentUser?.email    },
                { key:'phone',    icon:<PhoneIcon/>,    val:currentUser?.phone    },
                { key:'location', icon:<LocationIcon/>, val:currentUser?.location },
              ].map(({ key, icon, val }) => (
                <div key={key} className={styles.idMetaRow}>
                  <span className={styles.idMetaIcon}>{icon}</span>
                  <span className={styles.idMetaVal}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.attCard}>
            <div className={styles.attHeader}>
              <span className={styles.attTitle}>PERSONAL ATTENDANCE</span>
              <span className={styles.attBadge}>THIS MONTH</span>
            </div>
            <div className={styles.attStats}>
              <div className={styles.attStat}>
                <span className={styles.attStatLabel}>PRESENT DAYS</span>
                <span className={styles.attStatVal}>
                  {stats.present}/{stats.total}
                </span>
              </div>
              <div className={styles.attStat}>
                <span className={styles.attStatLabel}>OVERTIME</span>
                <span
                  className={styles.attStatVal}
                  style={{ color: "var(--orange)" }}
                >
                  {stats.overtime}
                </span>
              </div>
            </div>
            <div className={styles.effRow}>
              <span className={styles.attStatLabel}>EFFICIENCY INDEX</span>
              <span className={styles.effVal}>{stats.efficiency}%</span>
            </div>
            <div className={styles.effTrack}>
              <div
                className={styles.effFill}
                style={{ width: `${stats.efficiency}%` }}
              />
            </div>
          </div>

          <div className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <span className={styles.sessionTitle}>SESSION SECURITY</span>
              <div className={styles.sessionStatus}>
                <span className={styles.sessionDot} />
                <span className={styles.sessionStatusText}>SECURED</span>
              </div>
            </div>
            <div className={styles.sessionGrid}>
              <div className={styles.sessionItem}>
                <span className={styles.sessionLabel}>LAST LOGIN</span>
                <span className={styles.sessionVal}>{session.lastLogin}</span>
              </div>
              <div className={styles.sessionItem}>
                <span className={styles.sessionLabel}>IP ADDRESS</span>
                <span className={styles.sessionVal}>{session.ip}</span>
              </div>
              <div
                className={styles.sessionItem}
                style={{ gridColumn: "1 / -1" }}
              >
                <span className={styles.sessionLabel}>SESSION ID</span>
                <span
                  className={styles.sessionVal}
                  style={{
                    color: "var(--orange)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                  }}
                >
                  {session.sessionId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className={styles.rightCol}>
          <div className={styles.weekCard}>
            <div className={styles.weekHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalIcon />
                <span className={styles.weekTitle}>
                  WEEKLY ATTENDANCE OVERVIEW
                </span>
              </div>
              <span className={styles.weekRange}>
                WEEK 43 · OCT 2023 (SUN–THU)
              </span>
            </div>
            {WEEK_DATA.map((day) => (
              <div key={day.day} className={styles.weekRow}>
                <span className={styles.weekDay}>{day.day}</span>
                <div className={styles.weekTimes}>
                  <div className={styles.weekTime}>
                    <span className={styles.weekTimeLabel}>ENTER</span>
                    <span className={styles.weekTimeVal}>{day.enter}</span>
                  </div>
                  <div className={styles.weekTimeDivider}>–</div>
                  <div className={styles.weekTime}>
                    <span className={styles.weekTimeLabel}>LEAVE</span>
                    <span className={styles.weekTimeVal}>{day.leave}</span>
                  </div>
                </div>
                <StatusBadge status={day.status} />
              </div>
            ))}
          </div>

          <div className={styles.logCard}>
            <div className={styles.logHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ClockIcon />
                <span className={styles.logTitle}>RECENT ACTIVITY LOG</span>
              </div>
              <button className={styles.fullLogBtn}>FULL LOG ›</button>
            </div>
            {ACTIVITY_LOG.map((item, i) => (
              <div key={i} className={styles.logItem}>
                <div
                  className={styles.logIconWrap}
                  style={{ background: `${item.color}18`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div className={styles.logContent}>
                  <span className={styles.logText}>{item.text}</span>
                  <span className={styles.logMeta}>{item.meta}</span>
                </div>
                <span className={styles.logTag} style={{ color: item.color }}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setEditOpen(false)}
        />
      )}
      {pwdOpen && <ChangePasswordModal onClose={() => setPwdOpen(false)} />}
    </div>
  );
}
