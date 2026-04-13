import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useSearchParams } from "react-router-dom";
import {
  StatusBadge,
  Button,
  Modal,
  FormField,
  Input,
  Select,
  Textarea,
  Avatar,
} from "../../components/UI/UI";
import EmployeeProfileDrawer from "../../components/EmployeeProfileDrawer/EmployeeProfileDrawer";
import styles from "./DocumentsPage.module.css";

/* ── Tab Icons ─────────────────────────────────────────────── */
const PayrollIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M11 3v14M7 7l4-4 4 4M7 15l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const PassIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect
      x="2"
      y="6"
      width="18"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M2 10h18M6 14h2M10 14h6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
const LogIcon2 = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M6 5h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M8 10h6M8 13h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
const ExportIcon2 = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M8 11l3-3 3 3M11 8v10M4 18h14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TABS = [
  { key: "payroll", label: "PAYROLL", icon: <PayrollIcon /> },
  { key: "passes", label: "PASSES", icon: <PassIcon /> },
  { key: "logs", label: "LOGS", icon: <LogIcon2 /> },
  { key: "export", label: "EXPORT", icon: <ExportIcon2 /> },
];

/* ── Payroll Tab ───────────────────────────────────────────── */
// Receives onViewEmployee so clicking a name opens the profile drawer
function PayrollTab({ onViewEmployee }) {
  const { employees, addToast } = useApp();
  const [month, setMonth] = useState("OCT 2023");

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabToolbar}>
        <div className={styles.tabLeft}>
          <div className={styles.liveDot} />
          <span className={styles.tabCardTitle}>PAYROLL OVERVIEW</span>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            {["OCT 2023", "SEP 2023", "AUG 2023", "JUL 2023"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => addToast("Payroll report generated for " + month)}
        >
          GENERATE REPORT
        </Button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[
                "EMPLOYEE ID",
                "NAME",
                "DEPARTMENT",
                "PRESENT",
                "OVERTIME",
                "EFFICIENCY",
                "ACTION",
              ].map((h) => (
                <th key={h} className={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.tdId}`}>{emp.id}</td>
                <td className={styles.td}>
                  {/* Clicking avatar or name opens the profile drawer */}
                  <div className={styles.nameCell}>
                    <button
                      className={styles.empAvatarBtn}
                      onClick={() => onViewEmployee(emp)}
                      title="View profile"
                    >
                      <Avatar name={emp.name} size={28} />
                    </button>
                    <button
                      className={styles.empNameBtn}
                      onClick={() => onViewEmployee(emp)}
                      title="View profile"
                    >
                      {emp.name}
                    </button>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.deptLabel}>{emp.dept}</span>
                </td>
                <td className={styles.td}>
                  {emp.present}/{emp.total}
                </td>
                <td className={`${styles.td} ${styles.tdOT}`}>
                  {emp.overtime}h
                </td>
                <td className={styles.td}>
                  <div className={styles.effCell}>
                    <div className={styles.effBar}>
                      <div
                        className={styles.effFill}
                        style={{
                          width: `${emp.efficiency}%`,
                          background:
                            emp.efficiency >= 90
                              ? "var(--green)"
                              : emp.efficiency >= 75
                                ? "var(--amber)"
                                : "var(--red)",
                        }}
                      />
                    </div>
                    <span>{emp.efficiency}%</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.printBtn}
                    onClick={() =>
                      addToast(`Payroll slip for ${emp.name} sent to printer.`)
                    }
                    title="Print"
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect
                        x="2"
                        y="5"
                        width="11"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <path
                        d="M4.5 5V3h6v2M4.5 9h6M4.5 11.5h4"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Add Gate Pass Modal ────────────────────────────────────── */
function AddGatePassModal({ onClose }) {
  const { addGatePass, addToast } = useApp();
  const [form, setForm] = useState({
    employee: "",
    destination: "",
    date: "",
    windowStart: "",
    windowEnd: "",
    reason: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.employee || !form.destination) {
      addToast("Employee and destination are required.", "error");
      return;
    }
    const id = `GP-${Math.floor(Math.random() * 90000 + 10000)}`;
    addGatePass({
      id,
      employee: form.employee,
      destination: form.destination,
      date: form.date || "Today",
      window: `${form.windowStart} – ${form.windowEnd}`,
      status: "PENDING",
      time: new Date().toTimeString().slice(0, 5),
      reason: form.reason,
    });
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="NEW GATE PASS"
      subtitle="Issue a new access authorization"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <FormField label="Employee Name" required>
            <Input
              value={form.employee}
              onChange={(e) => set("employee", e.target.value)}
              placeholder="Full name"
            />
          </FormField>
          <FormField label="Date">
            {" "}
            <Input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </FormField>
          <FormField label="Window Start">
            {" "}
            <Input
              type="time"
              value={form.windowStart}
              onChange={(e) => set("windowStart", e.target.value)}
            />
          </FormField>
          <FormField label="Window End">
            {" "}
            <Input
              type="time"
              value={form.windowEnd}
              onChange={(e) => set("windowEnd", e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Destination" required>
          <Input
            value={form.destination}
            onChange={(e) => set("destination", e.target.value)}
            placeholder="e.g. Zone B – Refinery Area"
          />
        </FormField>
        <FormField label="Reason / Notes">
          <Textarea
            value={form.reason}
            onChange={(e) => set("reason", e.target.value)}
            placeholder="Purpose of the visit…"
            rows={3}
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
          <Button variant="primary" onClick={handleSubmit}>
            CREATE PASS
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Passes Tab ────────────────────────────────────────────── */
function PassesTab() {
  const { gatePasses, updateGatePassStatus } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabToolbar}>
        <div className={styles.tabLeft}>
          <div className={styles.accentBar} />
          <span className={styles.tabCardTitle}>GATE PASSES</span>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
          + NEW PASS
        </Button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[
                "REFERENCE",
                "EMPLOYEE",
                "DESTINATION",
                "DATE",
                "WINDOW",
                "STATUS",
                "ACTIONS",
              ].map((h) => (
                <th key={h} className={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gatePasses.map((gp) => (
              <tr key={gp.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.tdId}`}>{gp.id}</td>
                <td className={`${styles.td} ${styles.tdBold}`}>
                  {gp.employee}
                </td>
                <td className={styles.td}>{gp.destination}</td>
                <td className={styles.td}>{gp.date}</td>
                <td className={`${styles.td} ${styles.tdOrange}`}>
                  {gp.window}
                </td>
                <td className={styles.td}>
                  <StatusBadge status={gp.status} />
                </td>
                <td className={styles.td}>
                  {gp.status === "PENDING" ? (
                    <div className={styles.rowActions}>
                      <button
                        className={styles.approveBtn}
                        onClick={() => updateGatePassStatus(gp.id, "APPROVED")}
                      >
                        APPROVE
                      </button>
                      <button
                        className={styles.rejectBtn}
                        onClick={() => updateGatePassStatus(gp.id, "REJECTED")}
                      >
                        REJECT
                      </button>
                    </div>
                  ) : (
                    <span className={styles.resolvedText}>Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addOpen && <AddGatePassModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}

/* ── Logs Tab ──────────────────────────────────────────────── */
function LogsTab() {
  const { gatePasses } = useApp();
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabToolbar}>
        <div className={styles.tabLeft}>
          <div className={styles.accentBar} />
          <span className={styles.tabCardTitle}>
            ACTIVITY LOG // GATE PASSES
          </span>
        </div>
        <span className={styles.liveFeed}>
          <span className={styles.livePulse} />
          LIVE DATA FEED
        </span>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[
                "REFERENCE",
                "EMPLOYEE",
                "DESTINATION",
                "DATE",
                "WINDOW",
                "STATUS",
              ].map((h) => (
                <th key={h} className={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gatePasses.map((gp) => (
              <tr key={gp.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.tdId}`}>{gp.id}</td>
                <td className={`${styles.td} ${styles.tdBold}`}>
                  {gp.employee}
                </td>
                <td className={styles.td}>
                  <span className={styles.destLabel}>{gp.destination}</span>
                </td>
                <td className={styles.td}>{gp.date}</td>
                <td className={`${styles.td} ${styles.tdOrange}`}>
                  {gp.window}
                </td>
                <td className={styles.td}>
                  <StatusBadge status={gp.status} outlined />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Export Tab ────────────────────────────────────────────── */
function ExportTab() {
  const { addToast } = useApp();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const handleAttendanceReport = async () => {
    addToast("Generating Attendance Report…");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resume/download?id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        },
      );
      if (!response.ok) throw new Error("Failed to download");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "PresenceResume.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      addToast("Failed to download report.", "error");
    }
  };

  const exports = [
    {
      icon: "📊",
      label: "Employee Directory",
      fmt: "CSV",
      desc: "Full personnel list with roles and current status",
      onClick: () => addToast("Exporting Employee Directory as CSV…"),
    },
    {
      icon: "📋",
      label: "Attendance Report",
      fmt: "PDF",
      desc: "Monthly summary of all employee attendance records",
      onClick: handleAttendanceReport,
    },
    {
      icon: "🚪",
      label: "Gate Pass Log",
      fmt: "XLSX",
      desc: "All gate passes with timestamps and destinations",
      onClick: () => addToast("Exporting Gate Pass Log as XLSX…"),
    },
    {
      icon: "📝",
      label: "Leave Requests History",
      fmt: "PDF",
      desc: "Pending and historical leave requests with decisions",
      onClick: () => addToast("Exporting Leave Requests as PDF…"),
    },
    {
      icon: "💰",
      label: "Payroll Summary",
      fmt: "XLSX",
      desc: "This month's payroll overview with overtime breakdown",
      onClick: () => addToast("Exporting Payroll Summary as XLSX…"),
    },
    {
      icon: "🔒",
      label: "Security Audit Log",
      fmt: "PDF",
      desc: "Session logs, access events, and protocol changes",
      onClick: () => addToast("Exporting Security Audit Log as PDF…"),
    },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabToolbar}>
        <div className={styles.tabLeft}>
          <div className={styles.accentBar} />
          <span className={styles.tabCardTitle}>EXPORT CENTER</span>
        </div>
      </div>
      <div className={styles.exportGrid}>
        {exports.map((ex, i) => (
          <div key={i} className={styles.exportItem}>
            <span className={styles.exportIcon}>{ex.icon}</span>
            <div className={styles.exportInfo}>
              <span className={styles.exportLabel}>{ex.label}</span>
              <span className={styles.exportDesc}>{ex.desc}</span>
            </div>
            <div className={styles.exportRight}>
              <span className={styles.exportFmt}>{ex.fmt}</span>
              <Button variant="primary" size="sm" onClick={ex.onClick}>
                EXPORT
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Quick Action Panel ────────────────────────────────────── */
function QuickActionPanel() {
  const { currentUser, addRequest, addGatePass, addToast } = useApp();
  const [type, setType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [destination, setDestination] = useState("");
  const [reasonType, setReasonType] = useState("personal");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!type) {
      addToast("Please select a request type.", "error");
      return;
    }
    if (dateFrom && dateTo && new Date(dateTo) < new Date(dateFrom)) {
      addToast("End date cannot be before start date.", "error");
      return;
    }
    if (timeFrom && timeTo && timeTo <= timeFrom) {
      addToast("End time must be after start time.", "error");
      return;
    }
    setSending(true);
    const token = localStorage.getItem("token");

    const payload = {
      type: type,
      reason_type: reasonType,
      date_from: dateFrom || null,
      date_to: dateTo || null,
      time_from: timeFrom || null,
      time_to: timeTo || null,
      destination: destination || null,
      note: note || null,
      status: "PENDING",
    };

    if (type === "Gate Pass") {
      const id = `GP-${Math.floor(Math.random() * 90000 + 10000)}`;
      const timeWindow = timeFrom && timeTo ? `${timeFrom} – ${timeTo}` : "TBD";
      const dateWindow = dateFrom && dateTo ? `${dateFrom} – ${dateTo}` : "TBD";
      addGatePass({
        id,
        employee: currentUser?.name || "Unknown",
        destination: destination || "TBD",
        date: dateFrom || "Today",
        window: `${dateWindow} · ${timeWindow}`,
        status: "PENDING",
        time: new Date().toTimeString().slice(0, 5),
        reason: note,
        reasonType,
        timeFrom,
        timeTo,
      });
    } else {
      const id = `LR-${String(Math.floor(Math.random() * 9000 + 1000))}`;
      const days =
        dateFrom && dateTo
          ? Math.max(
              1,
              Math.ceil((new Date(dateTo) - new Date(dateFrom)) / 86400000),
            )
          : 1;
      addRequest({
        id,
        employee: currentUser?.name || "Unknown",
        type: type.replace(" Leave", ""),
        days,
        status: "PENDING",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        from: dateFrom,
        to: dateTo,
        timeFrom,
        timeTo,
        destination,
        reasonType,
        note,
      });
    }
    console.log("REQUEST PAYLOAD:", JSON.stringify(payload, null, 2));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Server error");
      }

      addToast(`${type} submitted successfully.`);
    } catch (err) {
      addToast(`Submitted locally. Sync failed: ${err.message}`, "warning");
    }

    setType("");
    setDateFrom("");
    setDateTo("");
    setTimeFrom("");
    setTimeTo("");
    setDestination("");
    setReasonType("personal");
    setNote("");
    setSending(false);
  };

  return (
    <div className={styles.quickPanel}>
      <div className={styles.quickHeader}>
        <span className={styles.quickTitle}>QUICK ACTION</span>
        <span className={styles.quickSub}>INTERNAL SUBMISSION TERMINAL</span>
      </div>

      <div className={styles.quickBody}>
        <FormField label="Request Type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">SELECT REQUEST TYPE…</option>
            <option>Annual Leave</option>
            <option>Medical Leave</option>
            <option>Gate Pass</option>
            <option>Activité Relax</option>
          </Select>
        </FormField>
        <FormField label="Duration / Period">
          <div className={styles.dateRow}>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </FormField>
        <FormField label="Time (optional)">
          <div className={styles.dateRow}>
            <Input
              type="time"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
            />
            <Input
              type="time"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              min={timeFrom || undefined}
              style={
                timeFrom && timeTo && timeTo <= timeFrom
                  ? { borderColor: "var(--red)" }
                  : {}
              }
            />
          </div>
          {timeFrom && timeTo && timeTo <= timeFrom && (
            <span
              style={{
                color: "var(--red)",
                fontSize: "0.72rem",
                marginTop: 4,
                display: "block",
              }}
            >
              End time must be after {timeFrom}
            </span>
          )}
        </FormField>
        <FormField label="Destination (optional)">
          <Input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Head Office, Site B…"
          />
        </FormField>
        <FormField label="Reason Category">
          <div className={styles.radioRow}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="reasonType"
                value="personal"
                checked={reasonType === "personal"}
                onChange={() => setReasonType("personal")}
              />
              <span>Personal</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="reasonType"
                value="work"
                checked={reasonType === "work"}
                onChange={() => setReasonType("work")}
              />
              <span>Work</span>
            </label>
          </div>
        </FormField>
        <FormField label="Internal Note / Justification">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter justification…"
            rows={5}
          />
        </FormField>
      </div>

      <div className={styles.quickFooter}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? "SENDING…" : "SEND"}
          {!sending && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Button>
        <div className={styles.signedBy}>
          SIGNED: {currentUser?.name?.toUpperCase()} · ID:{" "}
          {currentUser?.id?.slice(-5)}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "payroll",
  );
  const [profileEmp, setProfileEmp] = useState(null); // drawer target

  return (
    <div className={styles.page}>
      <div className={styles.mainCol}>
        <div className={styles.hubCard}>
          <div className={styles.hubTitle}>DOCUMENT HUB</div>
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.contentCard}>
          {/* Pass onViewEmployee only to PayrollTab since that's where employee rows are */}
          {activeTab === "payroll" && (
            <PayrollTab onViewEmployee={setProfileEmp} />
          )}
          {activeTab === "passes" && <PassesTab />}
          {activeTab === "logs" && <LogsTab />}
          {activeTab === "export" && <ExportTab />}
        </div>
      </div>

      <QuickActionPanel />

      {/* Floating profile drawer — read-only from Documents (no edit/delete) */}
      {profileEmp && (
        <EmployeeProfileDrawer
          employee={profileEmp}
          onClose={() => setProfileEmp(null)}
          readOnly
        />
      )}
    </div>
  );
}
