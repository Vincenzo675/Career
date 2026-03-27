import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  primary:        "#0A66C2",
  primaryDark:    "#004182",
  primaryLight:   "#EBF5FB",
  primaryMid:     "#2D8EE8",
  card:           "#FFFFFF",
  bg:             "#F3F6F9",
  surface:        "#EEF3F8",
  onSurface:      "#1B2733",
  onSurfaceMid:   "#4A6179",
  onSurfaceLow:   "#8DA6BA",
  border:         "#D8E6F0",
  green:          "#057642",
  greenBg:        "#E8F5EE",
  red:            "#CC1016",
  redBg:          "#FDEAEA",
  amber:          "#B45309",
  amberBg:        "#FEF3C7",
  purple:         "#6D28D9",
  purpleBg:       "#EDE9FE",
  shadow:         "0 1px 4px rgba(10,102,194,0.08), 0 2px 12px rgba(10,102,194,0.06)",
  shadowMd:       "0 4px 20px rgba(10,102,194,0.13)",
  r:              14,
  rSm:            8,
  rLg:            20,
};

// ─── ROUTER (simple hash-based) ────────────────────────────────────────────
const RouterCtx = createContext(null);
function useRouter() { return useContext(RouterCtx); }

function Router({ children }) {
  const [route, setRoute] = useState({ path: "/", params: {} });
  const navigate = (path, params = {}) => setRoute({ path, params });
  const goBack = () => navigate("/");
  return (
    <RouterCtx.Provider value={{ route, navigate, goBack }}>
      {children}
    </RouterCtx.Provider>
  );
}

// ─── THEME ─────────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ dark: false, toggle: () => {} });
function useTheme() { return useContext(ThemeCtx); }
function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <div style={{ colorScheme: dark ? "dark" : "light" }}>{children}</div>
    </ThemeCtx.Provider>
  );
}

// ─── TOAST ─────────────────────────────────────────────────────────────────
const ToastCtx = createContext({ show: () => {} });
function useToast() { return useContext(ToastCtx); }
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type = "default") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div style={{ position: "fixed", bottom: 100, left: 16, right: 16, zIndex: 999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: t.type === "success" ? C.green : t.type === "error" ? C.red : C.onSurface,
                color: "#fff", borderRadius: 12, padding: "10px 16px",
                fontSize: 13, fontWeight: 500, boxShadow: C.shadowMd,
                fontFamily: "sans-serif", maxWidth: 420, margin: "0 auto", width: "100%",
                pointerEvents: "none",
              }}
            >{t.msg}</motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

// ─── ICON SVGs ─────────────────────────────────────────────────────────────
const Ic = {
  Home: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  Briefcase: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>,
  Msg: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Bell: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Heart: ({ filled, ...p }) => <svg {...p} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Comment: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Share: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  More: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
  Spark: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>,
  Bookmark: ({ filled, ...p }) => <svg {...p} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Pin: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Dollar: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Clock: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Users: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Back: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Settings: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Edit: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Send: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Clip: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Check: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CheckCheck: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 13 13"/><path d="M7 13L1 7l4-4"/><path d="M3 5l4 4"/></svg>,
  Swap: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>,
  ChevR: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevL: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Eye: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Download: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Save: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Grad: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  File: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Shield: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Moon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Type: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Image: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  XCircle: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  CheckCircle: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  UserPlus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Camera: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  X: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Phone: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
};

const icon = (I, size = 20, color = "currentColor", extra = {}) => (
  <I width={size} height={size} style={{ color, flexShrink: 0, ...extra }} />
);

// ─── PRIMITIVE COMPONENTS ──────────────────────────────────────────────────
const Avatar = ({ name = "?", size = 40, src, style = {} }) => {
  const COLORS = ["#0A66C2","#057642","#6D28D9","#B45309","#CC1016","#0E7490"];
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: src ? "transparent" : color,
      backgroundImage: src ? `url(${src})` : undefined,
      backgroundSize: "cover", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: "#fff",
      fontFamily: "sans-serif", overflow: "hidden", ...style,
    }}>
      {!src && initials}
    </div>
  );
};

const Card = ({ children, onClick, style = {}, variant = "elevated" }) => {
  const base = {
    background: C.card, borderRadius: C.r, overflow: "hidden",
    cursor: onClick ? "pointer" : "default",
    transition: "transform 0.15s",
    boxShadow: variant === "outlined" ? "none" : C.shadow,
    border: variant === "outlined" ? `1.5px solid ${C.border}` : "none",
    ...style,
  };
  return (
    <div onClick={onClick}
      style={base}
      onMouseDown={e => { if (onClick) e.currentTarget.style.transform = "scale(0.985)"; }}
      onMouseUp={e => { if (onClick) e.currentTarget.style.transform = "scale(1)"; }}
      onTouchStart={e => { if (onClick) e.currentTarget.style.transform = "scale(0.985)"; }}
      onTouchEnd={e => { if (onClick) e.currentTarget.style.transform = "scale(1)"; }}
    >{children}</div>
  );
};

const Chip = ({ label, active, onClick, small }) => (
  <button onClick={onClick} style={{
    padding: small ? "4px 10px" : "7px 14px",
    borderRadius: 99, border: `1.5px solid ${active ? C.primary : C.border}`,
    background: active ? C.primaryLight : C.card,
    color: active ? C.primary : C.onSurfaceMid,
    fontSize: small ? 11 : 13, fontWeight: active ? 600 : 500,
    cursor: "pointer", whiteSpace: "nowrap", fontFamily: "sans-serif",
    transition: "all 0.18s",
  }}>{label}</button>
);

const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{
    width: 44, height: 26, borderRadius: 99,
    background: on ? C.primary : C.onSurfaceLow,
    display: "flex", alignItems: "center",
    padding: "2px", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
  }}>
    <div style={{
      width: 22, height: 22, borderRadius: "50%", background: "#fff",
      transform: on ? "translateX(18px)" : "translateX(0)",
      transition: "transform 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
    }} />
  </div>
);

const Skeleton = ({ w = "100%", h = 16, r = 6, style = {} }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: `linear-gradient(90deg,${C.surface} 25%,${C.bg} 50%,${C.surface} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", ...style }} />
);

const Btn = ({ children, onClick, disabled, variant = "primary", style = {} }) => {
  const styles = {
    primary: { background: disabled ? C.onSurfaceLow : C.primary, color: "#fff" },
    secondary: { background: C.surface, color: C.onSurfaceMid, border: `1.5px solid ${C.border}` },
    ghost: { background: "transparent", color: C.primary },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      borderRadius: 99, border: "none", cursor: disabled ? "not-allowed" : "pointer",
      padding: "11px 20px", fontSize: 14, fontWeight: 600, fontFamily: "sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      transition: "all 0.15s", opacity: disabled ? 0.5 : 1, ...styles[variant], ...style,
    }}>{children}</button>
  );
};

const Divider = () => <div style={{ height: 1, background: C.border }} />;

const SectionHeader = ({ title, action, onAction }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
    <span style={{ fontSize: 15, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{title}</span>
    {action && <button onClick={onAction} style={{ fontSize: 12, color: C.primary, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>{action}</button>}
  </div>
);

// ─── COMING SOON SHEET ─────────────────────────────────────────────────────
const ComingSoon = ({ feature, desc, onClose }) => (
  <div onClick={e => e.target === e.currentTarget && onClose()} style={{
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center",
  }}>
    <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
      transition={{ type: "spring", stiffness: 360, damping: 36 }}
      style={{ background: C.card, borderRadius: "24px 24px 0 0", padding: "20px 20px 36px", width: "100%", maxWidth: 480 }}
    >
      <div style={{ width: 40, height: 4, borderRadius: 99, background: C.border, margin: "0 auto 20px" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🚀</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.onSurface, fontFamily: "sans-serif", marginBottom: 6 }}>Coming Soon!</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.primary, fontFamily: "sans-serif", marginBottom: 6 }}>{feature}</div>
        <div style={{ fontSize: 13, color: C.onSurfaceMid, fontFamily: "sans-serif", lineHeight: 1.55, marginBottom: 20 }}>
          {desc || "We're building this feature now. Stay tuned for updates!"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 20 }}>
          {["Resume AI","Video Interviews","Salary Insights","Smart Alerts"].map(f => (
            <span key={f} style={{ padding: "5px 12px", background: C.primaryLight, color: C.primary, borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: "sans-serif" }}>{f}</span>
          ))}
        </div>
        <Btn onClick={onClose} style={{ width: "100%" }}>Got it!</Btn>
      </div>
    </motion.div>
  </div>
);

// ─── EDIT PROFILE SHEET ────────────────────────────────────────────────────
const EditProfileSheet = ({ onClose }) => {
  const { show } = useToast();
  const [name, setName] = useState("John Doe");
  const [headline, setHeadline] = useState("Senior Frontend Engineer at Google");
  const [location, setLocation] = useState("Mountain View, CA");
  const [about, setAbout] = useState("Passionate frontend engineer with 5+ years of experience building scalable web applications.");
  const [website, setWebsite] = useState("https://johndoe.dev");

  const handleSave = () => {
    show("Profile updated! ✨", "success");
    onClose();
  };

  const fieldStyle = {
    width: "100%", background: C.surface, borderRadius: 12,
    padding: "11px 14px", fontSize: 14, color: C.onSurface,
    border: `1.5px solid ${C.border}`, outline: "none", fontFamily: "sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
        transition={{ type: "spring", stiffness: 360, damping: 36 }}
        style={{ background: C.card, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, maxHeight: "92vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon(Ic.X, 18, C.onSurfaceMid)}
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>Edit Profile</span>
          <button onClick={handleSave} style={{ padding: "7px 16px", background: C.primary, color: "#fff", border: "none", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>Save</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <Avatar name={name} size={76} style={{ border: `3px solid ${C.card}`, boxShadow: C.shadow }} />
              <button onClick={() => show("Photo upload coming soon! 📷")} style={{
                position: "absolute", bottom: 0, right: 0, width: 28, height: 28,
                background: C.primary, borderRadius: "50%", border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                {icon(Ic.Camera, 14, "#fff")}
              </button>
            </div>
            <span style={{ fontSize: 12, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>Tap to change photo</span>
          </div>

          {/* Fields */}
          {[
            { label: "Full Name", value: name, set: setName, placeholder: "Your full name" },
            { label: "Headline", value: headline, set: setHeadline, placeholder: "e.g. Senior Engineer at Google" },
            { label: "Location", value: location, set: setLocation, placeholder: "City, Country" },
            { label: "Website", value: website, set: setWebsite, placeholder: "https://yoursite.com" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.onSurfaceMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>{label}</div>
              <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={fieldStyle} />
            </div>
          ))}

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.onSurfaceMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>
              About <span style={{ color: C.onSurfaceLow }}>({about.length}/2600)</span>
            </div>
            <textarea value={about} onChange={e => setAbout(e.target.value.slice(0, 2600))} rows={4}
              placeholder="Tell your story..." style={{ ...fieldStyle, resize: "none" }} />
          </div>

          {[
            { label: "✏️ Edit Skills" },
            { label: "✏️ Edit Experience" },
            { label: "✏️ Edit Education" },
          ].map(({ label }) => (
            <button key={label} onClick={() => show("Full editor coming soon! 🔧")} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 14px", background: C.surface, borderRadius: 12, border: `1.5px solid ${C.border}`,
              fontSize: 14, fontWeight: 500, color: C.onSurface, cursor: "pointer", fontFamily: "sans-serif",
            }}>
              {label}
              <span style={{ fontSize: 12, color: C.onSurfaceLow }}>Coming soon →</span>
            </button>
          ))}
          <div style={{ height: 16 }} />
        </div>
      </motion.div>
    </div>
  );
};

// ─── TOP BAR ───────────────────────────────────────────────────────────────
const TopBar = ({ title, onBack, right, style = {} }) => (
  <div style={{
    position: "sticky", top: 0, zIndex: 30,
    background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${C.border}`,
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 12px", ...style,
  }}>
    {onBack && (
      <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {icon(Ic.Back, 20, C.onSurface)}
      </button>
    )}
    <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{title}</span>
    {right}
  </div>
);

// ─── BOTTOM NAV ────────────────────────────────────────────────────────────
const TABS = [
  { path: "/", Icon: Ic.Home, label: "Home" },
  { path: "/jobs", Icon: Ic.Briefcase, label: "Jobs" },
  { path: "/messages", Icon: Ic.Msg, label: "Messages" },
  { path: "/notifications", Icon: Ic.Bell, label: "Notifications" },
  { path: "/profile", Icon: Ic.User, label: "Profile" },
];

const HIDDEN_PATHS = ["/job/", "/chat/", "/create-post", "/resume-builder", "/settings", "/search", "/employer", "/applicants"];

const BottomNav = () => {
  const { route, navigate } = useRouter();
  if (HIDDEN_PATHS.some(p => route.path.startsWith(p))) return null;
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: C.card, borderTop: `1px solid ${C.border}`,
      boxShadow: "0 -2px 12px rgba(10,102,194,0.07)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-around", maxWidth: 480, margin: "0 auto", height: 72, alignItems: "stretch" }}>
        {TABS.map(({ path, Icon, label }) => {
          const active = route.path === path;
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 3, border: "none", background: "transparent", cursor: "pointer", position: "relative",
            }}>
              <div style={{
                width: 48, height: 28, borderRadius: 14,
                background: active ? C.primaryLight : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}>
                {icon(Icon, 22, active ? C.primary : C.onSurfaceLow)}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? C.primary : C.onSurfaceLow, fontFamily: "sans-serif" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// ─── FAB ───────────────────────────────────────────────────────────────────
const FAB = ({ label, onClick }) => (
  <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      position: "fixed", bottom: 88, right: 16, zIndex: 40,
      background: C.primaryLight, color: C.primary, border: "none",
      borderRadius: 18, padding: "14px 20px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: C.shadowMd, fontFamily: "sans-serif",
    }}
  >
    {icon(Ic.Plus, 20, C.primary)}
    <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
  </motion.button>
);

// ═══════════════════════════════════════════════════════════════════════════
// ─── SCREENS ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─── HOME ──────────────────────────────────────────────────────────────────
const INIT_POSTS = [
  { id: 1, user: "Sarah Chen", role: "Senior Product Designer at Google", time: "2h", text: "Excited to share that our team just shipped a major redesign! 🚀 The new dashboard reduces task completion time by 40%. Always grateful for an amazing team.", likes: 142, comments: 23, image: true, liked: false },
  { id: 2, user: "Marcus Johnson", role: "Engineering Manager at Meta", time: "4h", text: "Hot take: The best code is the code you don't write. Spent this week removing 12,000 lines of legacy code and our app is faster than ever. 💨", likes: 89, comments: 45, liked: false },
  { id: 3, user: "Priya Patel", role: "Hiring | VP of Engineering at Stripe", time: "6h", text: "We're hiring! Looking for passionate engineers who want to build the future of payments. Remote-friendly, great benefits. DM me or check out our careers page. 🎯", likes: 234, comments: 67, hiring: true, liked: false },
  { id: 4, user: "Alex Rivera", role: "UX Researcher at Netflix", time: "1d", text: "Just published my research on how streaming UI patterns affect content discovery. Key finding: horizontal scroll carousels increase engagement by 28% vs grid layouts. 📊", likes: 56, comments: 12, liked: false },
];

const HomeScreen = () => {
  const { navigate } = useRouter();
  const { show } = useToast();
  const [posts, setPosts] = useState(INIT_POSTS);
  const [loading, setLoading] = useState(true);
  const [cs, setCs] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  const toggleLike = id => setPosts(p => p.map(x => x.id === id ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x));

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/profile")}>
            <Avatar name="John Doe" size={36} style={{ cursor: "pointer" }} />
          </button>
          <button onClick={() => navigate("/search")} style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.surface,
            borderRadius: 99, padding: "9px 14px", border: `1px solid ${C.border}`, cursor: "pointer",
          }}>
            {icon(Ic.Search, 16, C.onSurfaceLow)}
            <span style={{ fontSize: 14, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>Search jobs, people...</span>
          </button>
          <button onClick={() => navigate("/create-post")} style={{
            width: 38, height: 38, borderRadius: "50%", background: C.primaryLight,
            border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            {icon(Ic.Plus, 18, C.primary)}
          </button>
        </div>
      </div>

      {/* AI Banner */}
      <div style={{ padding: "14px 14px 0" }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`, borderRadius: C.r, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icon(Ic.Spark, 20, "#fff")}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "sans-serif" }}>Improve your resume ✨</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "sans-serif" }}>AI detected 3 ways to boost your profile</div>
          </div>
          <button onClick={() => navigate("/resume-builder")} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 99, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>View</button>
        </motion.div>
      </div>

      {/* Feed */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? [1, 2].map(i => (
          <Card key={i} style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <Skeleton w={44} h={44} r={22} />
              <div style={{ flex: 1 }}>
                <Skeleton h={13} style={{ marginBottom: 6 }} />
                <Skeleton w="60%" h={11} />
              </div>
            </div>
            <Skeleton h={12} style={{ marginBottom: 5 }} />
            <Skeleton h={12} w="80%" style={{ marginBottom: 5 }} />
            <Skeleton h={12} w="65%" />
          </Card>
        )) : posts.map((post, idx) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
            <Card variant="elevated">
              <div style={{ padding: 16 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Avatar name={post.user} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.user}</span>
                      {post.hiring && <span style={{ padding: "2px 8px", background: C.primary, color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>🔥 Hiring</span>}
                    </div>
                    <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.role}</div>
                    <div style={{ fontSize: 11, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{post.time}</div>
                  </div>
                  <button onClick={() => setCs({ f: "Post Options", d: "Report, hide, or manage posts." })} style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon(Ic.More, 18, C.onSurfaceLow)}
                  </button>
                </div>

                {/* Content */}
                <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: C.onSurface, fontFamily: "sans-serif" }}>{post.text}</div>

                {post.image && (
                  <div style={{ marginTop: 10, background: `linear-gradient(135deg, ${C.primaryLight}, ${C.surface})`, borderRadius: C.rSm, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 32 }}>📊</span>
                  </div>
                )}

                {/* Engagement line */}
                <div style={{ marginTop: 8, marginBottom: 4, fontSize: 11, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>
                  ❤️ {post.likes.toLocaleString()} · {post.comments} comments
                </div>

                {/* Actions */}
                <div style={{ borderTop: `1px solid ${C.border}`, display: "flex", paddingTop: 4 }}>
                  {[
                    { Icon: Ic.Heart, label: "Like", active: post.liked, action: () => toggleLike(post.id), activeColor: C.red },
                    { Icon: Ic.Comment, label: "Comment", active: false, action: () => show(`Opening comments on ${post.user}'s post...`), activeColor: C.primary },
                    { Icon: Ic.Share, label: "Share", active: false, action: () => show(`Link to ${post.user}'s post copied! 🔗`, "success"), activeColor: C.primary },
                  ].map(({ Icon, label, active, action, activeColor }) => (
                    <button key={label} onClick={action} style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      padding: "8px 0", border: "none", background: "transparent", cursor: "pointer", borderRadius: C.rSm,
                    }}>
                      <Icon width={17} height={17} style={{ color: active ? activeColor : C.onSurfaceMid }} filled={active} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: active ? activeColor : C.onSurfaceMid, fontFamily: "sans-serif" }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div style={{ height: 100 }} />
      <FAB label="Create Post" onClick={() => navigate("/create-post")} />
      <AnimatePresence>
        {cs && <ComingSoon feature={cs.f} desc={cs.d} onClose={() => setCs(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ─── JOBS ──────────────────────────────────────────────────────────────────
const INIT_JOBS = [
  { id: 1, title: "Senior React Developer", company: "Google", location: "Mountain View, CA", salary: "$180k–$250k", type: "Full-time", match: 95, saved: false, posted: "2d ago" },
  { id: 2, title: "Product Designer", company: "Figma", location: "San Francisco, CA", salary: "$150k–$200k", type: "Full-time", match: 88, saved: true, posted: "1d ago" },
  { id: 3, title: "ML Engineer", company: "OpenAI", location: "Remote", salary: "$200k–$350k", type: "Full-time", match: 72, saved: false, posted: "5h ago" },
  { id: 4, title: "iOS Developer", company: "Apple", location: "Cupertino, CA", salary: "$170k–$240k", type: "Full-time", match: 65, saved: false, posted: "3d ago" },
  { id: 5, title: "DevOps Engineer", company: "Netflix", location: "Remote", salary: "$160k–$220k", type: "Contract", match: 80, saved: true, posted: "1w ago" },
];
const FILTERS = ["Remote", "Full-time", "Part-time", "$100k+", "Entry Level"];

const JobsScreen = () => {
  const { navigate } = useRouter();
  const { show } = useToast();
  const [tab, setTab] = useState("recommended");
  const [activeFilters, setActiveFilters] = useState([]);
  const [jobs, setJobs] = useState(INIT_JOBS);
  const [appliedIds, setAppliedIds] = useState([]);

  const toggleFilter = f => setActiveFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);
  const toggleSave = (id, e) => {
    e.stopPropagation();
    const job = jobs.find(j => j.id === id);
    setJobs(p => p.map(j => j.id === id ? { ...j, saved: !j.saved } : j));
    show(job.saved ? "Removed from saved" : "Job saved! 🔖", "success");
  };
  const handleApply = (title, id, e) => {
    e.stopPropagation();
    if (appliedIds.includes(id)) { show("Already applied! ✅"); return; }
    setAppliedIds(p => [...p, id]);
    show(`Applied to ${title}! 🎉`, "success");
  };

  const displayJobs = tab === "saved" ? jobs.filter(j => j.saved)
    : tab === "applied" ? jobs.filter(j => appliedIds.includes(j.id))
    : jobs;

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ padding: "12px 14px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, borderRadius: 99, padding: "9px 14px", border: `1px solid ${C.border}` }}>
            {icon(Ic.Search, 16, C.onSurfaceLow)}
            <input placeholder="Search jobs..." style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: C.onSurface, outline: "none", fontFamily: "sans-serif" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "0 14px 10px", overflowX: "auto" }}>
          {FILTERS.map(f => <Chip key={f} label={f} active={activeFilters.includes(f)} onClick={() => toggleFilter(f)} />)}
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {["recommended", "saved", "applied"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "11px 0", border: "none", background: "transparent",
              fontSize: 13, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? C.primary : C.onSurfaceMid,
              borderBottom: `2.5px solid ${tab === t ? C.primary : "transparent"}`,
              cursor: "pointer", fontFamily: "sans-serif", textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {displayJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 15, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>No {tab} jobs yet</div>
          </div>
        )}
        {displayJobs.map((job, idx) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card onClick={() => navigate("/job/" + job.id, { job })}>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <Avatar name={job.company} size={46} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{job.title}</div>
                        <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{job.company}</div>
                      </div>
                      <button onClick={e => toggleSave(job.id, e)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                        <Ic.Bookmark width={20} height={20} filled={job.saved} style={{ color: job.saved ? C.primary : C.onSurfaceLow }} />
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>
                        {icon(Ic.Pin, 12, C.onSurfaceLow)} {job.location}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>
                        {icon(Ic.Dollar, 12, C.onSurfaceLow)} {job.salary}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ padding: "3px 10px", background: job.match >= 90 ? C.greenBg : C.primaryLight, color: job.match >= 90 ? C.green : C.primary, borderRadius: 99, fontSize: 11, fontWeight: 700, fontFamily: "sans-serif" }}>{job.match}% match</span>
                        <span style={{ fontSize: 11, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{job.posted}</span>
                      </div>
                      <button onClick={e => handleApply(job.title, job.id, e)} style={{
                        padding: "6px 16px", background: appliedIds.includes(job.id) ? C.greenBg : C.primary,
                        color: appliedIds.includes(job.id) ? C.green : "#fff",
                        border: "none", borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif",
                      }}>
                        {appliedIds.includes(job.id) ? "✅ Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div style={{ height: 90 }} />
    </div>
  );
};

// ─── JOB DETAILS ───────────────────────────────────────────────────────────
const JOB_DATA = {
  title: "Senior React Developer", company: "Google", location: "Mountain View, CA",
  salary: "$180k – $250k", type: "Full-time", posted: "2 days ago", applicants: 142,
  description: "We're looking for an experienced React developer to join our team and help build the next generation of Google products. You'll work with a world-class team of engineers and designers to create beautiful, performant web applications used by millions.",
  requirements: [
    "5+ years of experience with React and TypeScript",
    "Strong understanding of state management (Redux, Zustand)",
    "Experience with testing frameworks (Jest, React Testing Library)",
    "Knowledge of CI/CD pipelines and deployment strategies",
    "Excellent communication and collaboration skills",
  ],
  benefits: ["Health Insurance", "401k Match", "Remote Flexible", "Learning Budget", "Gym Membership"],
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Testing"],
};

const JobDetailsScreen = () => {
  const { goBack } = useRouter();
  const { show } = useToast();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <TopBar
        onBack={goBack}
        right={
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => { setSaved(s => !s); show(saved ? "Removed from saved" : "Job saved! 🔖", "success"); }} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic.Bookmark width={20} height={20} filled={saved} style={{ color: saved ? C.primary : C.onSurfaceLow }} />
            </button>
            <button onClick={() => show("Job link copied! 🔗", "success")} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {icon(Ic.Share, 18, C.onSurfaceLow)}
            </button>
          </div>
        }
      />

      <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 110 }}>
        {/* Company header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <Avatar name={JOB_DATA.company} size={72} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 21, fontWeight: 800, color: C.onSurface, fontFamily: "sans-serif" }}>{JOB_DATA.title}</div>
          <div style={{ fontSize: 14, color: C.onSurfaceMid, fontFamily: "sans-serif", marginTop: 2 }}>{JOB_DATA.company}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[{ Icon: Ic.Pin, text: JOB_DATA.location }, { Icon: Ic.Clock, text: JOB_DATA.posted }].map(({ Icon, text }) => (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>
                {icon(Icon, 13, C.onSurfaceLow)} {text}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
            {[{ Icon: Ic.Dollar, text: JOB_DATA.salary }, { Icon: Ic.Users, text: `${JOB_DATA.applicants} applicants` }].map(({ Icon, text }) => (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>
                {icon(Icon, 13, C.onSurfaceLow)} {text}
              </span>
            ))}
          </div>
        </div>

        {/* Match card */}
        <Card style={{ background: C.primaryLight, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>95%</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primaryDark, fontFamily: "sans-serif" }}>Great Match! 🎯</div>
            <div style={{ fontSize: 12, color: C.primaryMid, fontFamily: "sans-serif" }}>Your skills align well with this role</div>
          </div>
        </Card>

        {/* Description */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="Description" />
          <div style={{ fontSize: 14, lineHeight: 1.65, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{JOB_DATA.description}</div>
        </Card>

        {/* Requirements */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="Requirements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {JOB_DATA.requirements.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, marginTop: 6, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.onSurfaceMid, fontFamily: "sans-serif", lineHeight: 1.5 }}>{r}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Skills */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="Skills Required" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {JOB_DATA.skills.map(s => <Chip key={s} label={s} />)}
          </div>
        </Card>

        {/* Benefits */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="Benefits" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {JOB_DATA.benefits.map(b => <Chip key={b} label={b} active />)}
          </div>
        </Card>
      </div>

      {/* Sticky Apply Button */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.border}`, padding: "12px 14px 24px",
      }}>
        <button onClick={() => {
          if (applied) { show("Already applied! ✅"); return; }
          setApplied(true); show("Application submitted! 🎉", "success");
        }} style={{
          width: "100%", padding: "14px 0", borderRadius: 99, border: "none",
          background: applied ? C.green : C.primary, color: "#fff",
          fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif",
          boxShadow: `0 4px 16px ${applied ? C.green : C.primary}55`,
        }}>
          {applied ? "✅ Applied!" : "Apply Now 🚀"}
        </button>
      </div>
    </div>
  );
};

// ─── MESSAGES ──────────────────────────────────────────────────────────────
const CONVOS = [
  { id: 1, name: "Sarah Chen", message: "Thanks for the portfolio review! I'll make those changes.", time: "2m", unread: 2 },
  { id: 2, name: "Marcus Johnson", message: "Are you available for a quick call tomorrow?", time: "15m", unread: 0 },
  { id: 3, name: "Priya Patel", message: "We'd love to schedule an interview with you!", time: "1h", unread: 1 },
  { id: 4, name: "Google Recruiter", message: "Hi! I came across your profile and wanted to...", time: "3h", unread: 0 },
  { id: 5, name: "Alex Rivera", message: "Great article! I shared it with my team.", time: "1d", unread: 0 },
  { id: 6, name: "Design Community", message: "Emily: Has anyone tried the new Figma update?", time: "2d", unread: 5 },
];

const MessagesScreen = () => {
  const { navigate } = useRouter();
  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "12px 14px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.onSurface, fontFamily: "sans-serif", marginBottom: 10 }}>Messages</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, borderRadius: 99, padding: "9px 14px", border: `1px solid ${C.border}` }}>
          {icon(Ic.Search, 16, C.onSurfaceLow)}
          <input placeholder="Search messages..." style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: C.onSurface, outline: "none", fontFamily: "sans-serif" }} />
        </div>
      </div>
      <div>
        {CONVOS.map((conv, i) => (
          <div key={conv.id}>
            <button onClick={() => navigate("/chat/" + conv.id, { conv })} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", background: conv.unread > 0 ? `${C.primaryLight}80` : C.card,
              border: "none", cursor: "pointer", textAlign: "left",
            }}>
              <Avatar name={conv.name} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: conv.unread > 0 ? 700 : 600, color: C.onSurface, fontFamily: "sans-serif" }}>{conv.name}</span>
                  <span style={{ fontSize: 11, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{conv.time}</span>
                </div>
                <div style={{ fontSize: 12, color: conv.unread > 0 ? C.onSurface : C.onSurfaceMid, fontFamily: "sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2, fontWeight: conv.unread > 0 ? 600 : 400 }}>
                  {conv.message}
                </div>
              </div>
              {conv.unread > 0 && (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.primary, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", flexShrink: 0 }}>{conv.unread}</div>
              )}
            </button>
            {i < CONVOS.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── CHAT ──────────────────────────────────────────────────────────────────
const INIT_MSGS = [
  { id: 1, sender: "them", text: "Hi! I saw your profile and I'm really impressed with your experience.", time: "10:30 AM", read: true },
  { id: 2, sender: "me", text: "Thank you! I appreciate you reaching out. I'd love to learn more about the opportunity.", time: "10:32 AM", read: true },
  { id: 3, sender: "them", text: "We're looking for a senior React developer to lead our frontend team. Would you be interested in chatting more about this?", time: "10:35 AM", read: true },
  { id: 4, sender: "me", text: "Absolutely! That sounds like a great fit. When would be a good time for a call?", time: "10:38 AM", read: true },
  { id: 5, sender: "them", text: "How about tomorrow at 2 PM PST? I can send you a calendar invite.", time: "10:40 AM", read: false },
];

const ChatScreen = () => {
  const { goBack, route } = useRouter();
  const { show } = useToast();
  const [messages, setMessages] = useState(INIT_MSGS);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const convName = route.params?.conv?.name || "Sarah Chen";

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    setMessages(p => [...p, { id: p.length + 1, sender: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false }]);
    setText("");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon(Ic.Back, 20, C.onSurface)}
        </button>
        <Avatar name={convName} size={38} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{convName}</div>
          <div style={{ fontSize: 11, color: C.green, fontFamily: "sans-serif", fontWeight: 600 }}>● Online</div>
        </div>
        <button onClick={() => show("Video calls coming soon! 📹")} style={{ width: 36, height: 36, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon(Ic.Phone, 18, C.onSurfaceMid)}
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "me" ? "flex-end" : "flex-start" }}>
            {msg.sender !== "me" && <Avatar name={convName} size={28} style={{ marginRight: 8, alignSelf: "flex-end" }} />}
            <div style={{
              maxWidth: "78%", borderRadius: msg.sender === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px",
              background: msg.sender === "me" ? C.primary : C.card,
              color: msg.sender === "me" ? "#fff" : C.onSurface,
              boxShadow: C.shadow,
            }}>
              <div style={{ fontSize: 14, lineHeight: 1.5, fontFamily: "sans-serif" }}>{msg.text}</div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 10, color: msg.sender === "me" ? "rgba(255,255,255,0.6)" : C.onSurfaceLow, fontFamily: "sans-serif" }}>{msg.time}</span>
                {msg.sender === "me" && (msg.read
                  ? <Ic.CheckCheck width={13} height={13} style={{ color: "rgba(255,255,255,0.7)" }} />
                  : <Ic.Check width={13} height={13} style={{ color: "rgba(255,255,255,0.7)" }} />
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={convName} size={26} style={{ marginRight: 6 }} />
          <div style={{ background: C.card, borderRadius: "18px 18px 18px 4px", padding: "10px 16px", display: "flex", gap: 4, alignItems: "center", boxShadow: C.shadow }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.onSurfaceLow, animation: `typing 1.1s ${d}s infinite` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "10px 12px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button onClick={() => show("File picker coming soon! 📎")} style={{ width: 38, height: 38, borderRadius: "50%", background: C.primaryLight, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon(Ic.Clip, 17, C.primary)}
        </button>
        <div style={{ flex: 1, background: C.surface, borderRadius: 99, padding: "9px 14px", border: `1px solid ${C.border}` }}>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message..." style={{ width: "100%", border: "none", background: "transparent", fontSize: 14, color: C.onSurface, outline: "none", fontFamily: "sans-serif" }} />
        </div>
        <button onClick={send} disabled={!text.trim()} style={{
          width: 40, height: 40, borderRadius: "50%", border: "none",
          background: text.trim() ? C.primary : C.surface,
          cursor: text.trim() ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s",
        }}>
          {icon(Ic.Send, 17, text.trim() ? "#fff" : C.onSurfaceLow)}
        </button>
      </div>
    </div>
  );
};

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
const INIT_NOTIFS = [
  { id: 1, type: "job", Icon: Ic.Briefcase, title: "New job match!", desc: "Senior React Developer at Google matches your profile (95%)", time: "5m", read: false },
  { id: 2, type: "like", Icon: Ic.Heart, title: "Sarah Chen liked your post", desc: '"Excited to share that our team just shipped..."', time: "15m", read: false },
  { id: 3, type: "message", Icon: Ic.Msg, title: "New message from Priya Patel", desc: "We'd love to schedule an interview with you!", time: "1h", read: false },
  { id: 4, type: "connection", Icon: Ic.UserPlus, title: "Marcus Johnson connected with you", desc: "Engineering Manager at Meta", time: "2h", read: true },
  { id: 5, type: "job", Icon: Ic.Briefcase, title: "Application update", desc: "Your application for Product Designer at Figma has been viewed", time: "4h", read: true },
  { id: 6, type: "like", Icon: Ic.Heart, title: "23 people liked your post", desc: '"Hot take: The best code is the code you don\'t write..."', time: "6h", read: true },
  { id: 7, type: "job", Icon: Ic.Briefcase, title: "3 new jobs match your skills", desc: "React, TypeScript, Node.js positions available", time: "1d", read: true },
];

const NOTIF_COLORS = {
  job:        { bg: C.primaryLight, color: C.primary },
  like:       { bg: C.redBg, color: C.red },
  message:    { bg: C.primaryLight, color: C.primaryMid },
  connection: { bg: C.greenBg, color: C.green },
};

const NotificationsScreen = () => {
  const { navigate } = useRouter();
  const { show } = useToast();
  const [notifs, setNotifs] = useState(INIT_NOTIFS);

  const handleTap = n => {
    setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x));
    if (n.type === "job") navigate("/jobs");
    else if (n.type === "message") navigate("/messages");
    // FIX: original split by " connected" gave wrong index — now use title directly
    else if (n.type === "connection") show(`Viewing ${n.title.replace(" connected with you", "")}'s profile`);
    else show(n.title);
  };

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: C.onSurface, fontFamily: "sans-serif" }}>Notifications</span>
        <button onClick={() => { setNotifs(p => p.map(n => ({ ...n, read: true }))); show("All marked as read ✅", "success"); }}
          style={{ fontSize: 12, color: C.primary, fontWeight: 600, background: C.primaryLight, border: "none", padding: "6px 12px", borderRadius: 99, cursor: "pointer", fontFamily: "sans-serif" }}>
          Mark all read
        </button>
      </div>
      <div>
        {notifs.map((n, idx) => {
          const clr = NOTIF_COLORS[n.type] || NOTIF_COLORS.job;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}>
              <button onClick={() => handleTap(n)} style={{
                width: "100%", display: "flex", alignItems: "flex-start", gap: 12,
                padding: "14px 14px", background: n.read ? C.card : `${C.primaryLight}90`,
                border: "none", cursor: "pointer", textAlign: "left",
                borderLeft: `3px solid ${n.read ? "transparent" : C.primary}`,
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: clr.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {icon(n.Icon, 20, clr.color)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: C.onSurface, fontFamily: "sans-serif" }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.desc}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{n.time}</span>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary }} />}
                </div>
              </button>
              <Divider />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── PROFILE ───────────────────────────────────────────────────────────────
const ProfileScreen = () => {
  const { navigate } = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [cs, setCs] = useState(null);

  const skills = ["React", "TypeScript", "Node.js", "Python", "AWS", "GraphQL", "Figma", "Leadership"];
  const experience = [
    { role: "Senior Frontend Engineer", company: "Google", period: "2022 – Present", desc: "Leading frontend architecture for Google Cloud Console." },
    { role: "Frontend Developer", company: "Meta", period: "2019 – 2022", desc: "Built React components for the Meta Business Suite." },
  ];
  const education = [
    { degree: "M.S. Computer Science", school: "Stanford University", year: "2019" },
    { degree: "B.S. Computer Science", school: "UC Berkeley", year: "2017" },
  ];

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      {/* Hero */}
      <div style={{ background: C.card, boxShadow: C.shadow }}>
        <div style={{ height: 96, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})` }} />
        <div style={{ padding: "0 14px 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -36 }}>
            <button onClick={() => setShowEdit(true)}>
              <Avatar name="John Doe" size={72} style={{ border: `3px solid ${C.card}`, cursor: "pointer", boxShadow: C.shadow }} />
            </button>
            <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
              <button onClick={() => navigate("/settings")} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {icon(Ic.Settings, 18, C.onSurfaceMid)}
              </button>
              {/* FIX: Edit button now opens EditProfileSheet */}
              <button onClick={() => setShowEdit(true)} style={{ padding: "8px 16px", background: C.primary, color: "#fff", border: "none", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                {icon(Ic.Edit, 14, "#fff")} Edit
              </button>
            </div>
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, color: C.onSurface, fontFamily: "sans-serif", marginTop: 8 }}>John Doe</div>
          <div style={{ fontSize: 13, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>Senior Frontend Engineer at Google</div>
          <div style={{ fontSize: 12, color: C.onSurfaceLow, fontFamily: "sans-serif", marginTop: 2 }}>Mountain View, CA • 500+ connections</div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            {[{ label: "Profile views", value: "1,248" }, { label: "Post impressions", value: "8.2k" }].map(s => (
              <button key={s.label} onClick={() => setCs({ f: "Profile Analytics", d: "Detailed insights on who viewed and engaged with your profile." })} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, fontFamily: "sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{s.label}</div>
              </button>
            ))}
          </div>

          {/* Employer toggle */}
          <button onClick={() => navigate("/employer")} style={{
            marginTop: 12, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px", background: C.primaryLight, borderRadius: 12, border: "none", cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {icon(Ic.Swap, 18, C.primary)}
              <span style={{ fontSize: 13, fontWeight: 600, color: C.primary, fontFamily: "sans-serif" }}>Switch to Employer Mode</span>
            </div>
            {icon(Ic.ChevR, 16, C.primaryMid)}
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 90 }}>
        {/* About */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="About" action="Edit" onAction={() => setShowEdit(true)} />
          <div style={{ fontSize: 14, lineHeight: 1.65, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>
            Passionate frontend engineer with 5+ years of experience building scalable web applications. I love creating beautiful, accessible user interfaces and mentoring junior developers.
          </div>
        </Card>

        {/* Skills */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="Skills" action="+ Add" onAction={() => setCs({ f: "Edit Skills", d: "Add and endorse skills to help recruiters find you." })} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map(s => <Chip key={s} label={s} onClick={() => setCs({ f: `${s} Endorsements`, d: `See who endorsed ${s} and endorse others.` })} />)}
          </div>
        </Card>

        {/* Experience */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="Experience" action="+ Add" onAction={() => setCs({ f: "Edit Experience", d: "Add and update your work history." })} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {experience.map((exp, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {icon(Ic.Briefcase, 20, C.onSurfaceMid)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{exp.role}</div>
                      <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{exp.company} • {exp.period}</div>
                      <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif", marginTop: 2 }}>{exp.desc}</div>
                    </div>
                    <button onClick={() => setCs({ f: "Edit Experience" })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      {icon(Ic.Edit, 14, C.onSurfaceLow)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Education */}
        <Card variant="outlined" style={{ padding: 16 }}>
          <SectionHeader title="Education" action="+ Add" onAction={() => setCs({ f: "Edit Education", d: "Add and update your educational background." })} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {education.map((edu, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {icon(Ic.Grad, 20, C.onSurfaceMid)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{edu.degree}</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{edu.school} • {edu.year}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Resume Builder */}
        <Card onClick={() => navigate("/resume-builder")} style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, background: C.card }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon(Ic.File, 20, C.primary)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>Resume Builder</div>
            <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>Build and export your resume</div>
          </div>
          {icon(Ic.ChevR, 18, C.onSurfaceLow)}
        </Card>
      </div>

      <AnimatePresence>
        {showEdit && <EditProfileSheet onClose={() => setShowEdit(false)} />}
        {cs && <ComingSoon feature={cs.f} desc={cs.d} onClose={() => setCs(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ─── SETTINGS ──────────────────────────────────────────────────────────────
const SettingsScreen = () => {
  const { goBack, navigate } = useRouter();
  const { dark, toggle } = useTheme();
  const { show } = useToast();
  const [fontSize, setFontSize] = useState(16);
  const [activeStatus, setActiveStatus] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [cs, setCs] = useState(null);

  const handleFontSize = () => {
    const next = fontSize >= 20 ? 14 : fontSize + 2;
    setFontSize(next);
    document.documentElement.style.fontSize = `${next}px`;
    show(`Font size: ${next}px`, "success");
  };

  const Section = ({ title, children }) => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingLeft: 4, fontFamily: "sans-serif" }}>{title}</div>
      <div style={{ background: C.card, borderRadius: C.r, overflow: "hidden", boxShadow: C.shadow }}>{children}</div>
    </div>
  );

  const Row = ({ Icon, label, sub, right, onClick }) => (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: "transparent", border: "none", cursor: "pointer", borderBottom: `1px solid ${C.border}`, textAlign: "left", boxSizing: "border-box" }}>
      {icon(Icon, 20, C.onSurfaceMid)}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.onSurface, fontFamily: "sans-serif" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{sub}</div>}
      </div>
      {right}
    </button>
  );

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <TopBar title="Settings" onBack={goBack} />
      <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>
        <Section title="Account">
          <Row Icon={Ic.User} label="Edit Profile" sub="Update your personal info" onClick={() => navigate("/profile")} right={icon(Ic.ChevR, 18, C.onSurfaceLow)} />
          <Row Icon={Ic.Shield} label="Password & Security" sub="Manage your account security" onClick={() => setCs({ f: "Password & Security", d: "Two-factor auth, login history, and trusted devices." })} right={icon(Ic.ChevR, 18, C.onSurfaceLow)} />
        </Section>

        <Section title="Privacy">
          <Row Icon={Ic.Eye} label="Profile Visibility" sub="Control who sees your profile" onClick={() => setCs({ f: "Profile Visibility", d: "Choose who can view your profile, posts, and connections." })} right={icon(Ic.ChevR, 18, C.onSurfaceLow)} />
          <Row Icon={Ic.Phone} label="Active Status" sub="Show when you're online"
            onClick={() => { setActiveStatus(s => !s); show(activeStatus ? "Active status hidden" : "Active status visible", "success"); }}
            right={<Toggle on={activeStatus} onToggle={() => { setActiveStatus(s => !s); }} />}
          />
        </Section>

        <Section title="Notifications">
          <Row Icon={Ic.Bell} label="Push Notifications" sub="Manage notification preferences"
            onClick={() => setPushNotifs(s => !s)}
            right={<Toggle on={pushNotifs} onToggle={() => setPushNotifs(s => !s)} />}
          />
          <Row Icon={Ic.Msg} label="Email Digest" sub="Weekly job and network updates" onClick={() => setCs({ f: "Email Digest Settings", d: "Control how often we email you about your network and jobs." })} right={icon(Ic.ChevR, 18, C.onSurfaceLow)} />
        </Section>

        <Section title="Accessibility">
          <Row Icon={dark ? Ic.Sun : Ic.Moon} label="Dark Mode" sub={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggle}
            right={<Toggle on={dark} onToggle={toggle} />}
          />
          <Row Icon={Ic.Type} label="Font Size" sub={`Current: ${fontSize}px — tap to cycle`}
            onClick={handleFontSize}
            right={<span style={{ fontSize: 14, fontWeight: 700, color: C.primary, fontFamily: "sans-serif" }}>{fontSize}</span>}
          />
        </Section>

        {/* Resume Builder entry */}
        <button onClick={() => navigate("/resume-builder")} style={{
          display: "flex", alignItems: "center", gap: 12,
          background: `linear-gradient(135deg, ${C.primaryLight}, ${C.surface})`,
          borderRadius: C.r, padding: 16, border: "none", cursor: "pointer", width: "100%",
        }}>
          <span style={{ fontSize: 28 }}>📝</span>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>Resume Builder</div>
            <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>Create your perfect resume</div>
          </div>
          {icon(Ic.ChevR, 18, C.onSurfaceLow)}
        </button>
      </div>

      <AnimatePresence>
        {cs && <ComingSoon feature={cs.f} desc={cs.d} onClose={() => setCs(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ─── RESUME BUILDER ────────────────────────────────────────────────────────
const STEPS = ["Personal Info", "Education", "Experience", "Skills", "Projects"];

const ResumeBuilderScreen = () => {
  const { goBack } = useRouter();
  const { show } = useToast();
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) { show("Skill already added!"); return; }
    setSkills(p => [...p, newSkill.trim()]);
    setNewSkill("");
    show(`Added "${newSkill.trim()}" ✨`, "success");
  };

  const fieldStyle = { width: "100%", background: C.surface, borderRadius: 10, padding: "11px 12px", fontSize: 14, color: C.onSurface, border: `1.5px solid ${C.border}`, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box" };

  const FormField = ({ label, textarea }) => (
    <div>
      <div style={{ fontSize: 12, color: C.onSurfaceMid, marginBottom: 5, fontFamily: "sans-serif", fontWeight: 500 }}>{label}</div>
      {textarea
        ? <textarea placeholder={label} rows={3} style={{ ...fieldStyle, resize: "none" }} />
        : <input placeholder={label} style={fieldStyle} />
      }
    </div>
  );

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
        <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon(Ic.Back, 20, C.onSurface)}
        </button>
        <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>Resume Builder</span>
        <button onClick={() => show("Resume Preview coming soon! 👁️")} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon(Ic.Eye, 18, C.onSurfaceMid)}
        </button>
      </div>

      {/* Stepper — FIX: connector width adjusted to fit 5 steps without overflow */}
      <div style={{ padding: "14px 14px", overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", minWidth: 280 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <button onClick={() => setStep(i)} style={{
                  width: 32, height: 32, borderRadius: "50%", border: i === step ? `2px solid ${C.primary}` : "none",
                  background: i < step ? C.primary : i === step ? C.primaryLight : C.surface,
                  color: i < step ? "#fff" : i === step ? C.primary : C.onSurfaceMid,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "sans-serif",
                }}>
                  {i < step ? icon(Ic.Check, 14, "#fff") : i + 1}
                </button>
                <span style={{ fontSize: 9, marginTop: 3, color: i === step ? C.primary : C.onSurfaceLow, fontWeight: i === step ? 700 : 400, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                  {s.split(" ")[0]}
                </span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? C.primary : C.border, margin: "0 4px", marginBottom: 16 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 140 }}>
        {step === 0 && (
          <Card variant="outlined" style={{ padding: 16 }}>
            <SectionHeader title="Personal Information" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Full Name", "Email", "Phone", "LinkedIn URL", "Location"].map(f => <FormField key={f} label={f} />)}
            </div>
          </Card>
        )}
        {step === 1 && (
          <Card variant="outlined" style={{ padding: 16 }}>
            <SectionHeader title="Education" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Degree", "Institution", "Field of Study", "Graduation Year", "GPA"].map(f => <FormField key={f} label={f} />)}
            </div>
            <button onClick={() => show("Another education entry added!")} style={{ marginTop: 12, fontSize: 13, color: C.primary, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>+ Add another education</button>
          </Card>
        )}
        {step === 2 && (
          <Card variant="outlined" style={{ padding: 16 }}>
            <SectionHeader title="Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Job Title", "Company", "Start Date", "End Date"].map(f => <FormField key={f} label={f} />)}
              <FormField label="Description" textarea />
            </div>
            <button onClick={() => show("Another experience entry added!")} style={{ marginTop: 12, fontSize: 13, color: C.primary, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>+ Add another experience</button>
          </Card>
        )}
        {step === 3 && (
          <Card variant="outlined" style={{ padding: 16 }}>
            <SectionHeader title="Skills" />
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()}
                placeholder="Add a skill" style={{ ...fieldStyle, flex: 1 }} />
              <Btn onClick={addSkill} style={{ padding: "0 16px", height: 44, flexShrink: 0 }}>Add</Btn>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skills.map(s => (
                <button key={s} onClick={() => setSkills(p => p.filter(x => x !== s))} style={{
                  padding: "6px 14px", background: C.primaryLight, color: C.primary, border: "none", borderRadius: 99,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif",
                }}>{s} ✕</button>
              ))}
            </div>
          </Card>
        )}
        {step === 4 && (
          <Card variant="outlined" style={{ padding: 16 }}>
            <SectionHeader title="Projects" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Project Name", "Tech Stack", "Link"].map(f => <FormField key={f} label={f} />)}
              <FormField label="Description" textarea />
            </div>
            <button onClick={() => show("Another project added!")} style={{ marginTop: 12, fontSize: 13, color: C.primary, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}>+ Add another project</button>
          </Card>
        )}

        {/* Live Preview */}
        <div style={{ background: `linear-gradient(135deg, ${C.primaryLight}, ${C.surface})`, borderRadius: C.r, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 8, fontFamily: "sans-serif" }}>📄 Live Preview</div>
          <div style={{ background: C.card, borderRadius: C.rSm, padding: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.onSurface, fontFamily: "sans-serif" }}>John Doe</div>
            <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>Senior Frontend Engineer</div>
            <div style={{ fontSize: 11, color: C.onSurfaceLow, fontFamily: "sans-serif", marginTop: 2 }}>Mountain View, CA • john@email.com</div>
            {skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {skills.map(s => <span key={s} style={{ padding: "2px 8px", background: C.primaryLight, color: C.primary, borderRadius: 4, fontSize: 10, fontWeight: 600, fontFamily: "sans-serif" }}>{s}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderTop: `1px solid ${C.border}`, padding: "12px 14px 24px" }}>
        <div style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto" }}>
          {step > 0 && (
            <Btn variant="secondary" onClick={() => setStep(s => s - 1)} style={{ paddingLeft: 14, paddingRight: 18 }}>
              {icon(Ic.ChevL, 16, C.onSurfaceMid)} Back
            </Btn>
          )}
          <Btn variant="secondary" onClick={() => show("Draft saved! 💾", "success")} style={{ flex: 1 }}>
            {icon(Ic.Save, 16, C.onSurfaceMid)} Save Draft
          </Btn>
          {step < STEPS.length - 1
            ? <Btn onClick={() => setStep(s => s + 1)} style={{ flex: 1 }}>Next</Btn>
            : <Btn onClick={() => show("Exporting PDF... 📄", "success")} style={{ flex: 1 }}>
                {icon(Ic.Download, 16, "#fff")} Export PDF
              </Btn>
          }
        </div>
      </div>
    </div>
  );
};

// ─── SEARCH ────────────────────────────────────────────────────────────────
const SearchScreen = () => {
  const { goBack, navigate } = useRouter();
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState("people");
  const [query, setQuery] = useState("");
  const recentSearches = ["React Developer", "Product Designer", "Google", "Remote jobs"];
  const suggestions = [
    { name: "Sarah Chen", role: "Senior Product Designer at Google", type: "person" },
    { name: "Google", role: "Technology Company • 150k+ employees", type: "company" },
    { name: "React Developer", role: "12,000+ open positions", type: "job" },
  ];

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
          <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon(Ic.Back, 20, C.onSurface)}
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.surface, borderRadius: 99, padding: "9px 14px", border: `1px solid ${C.border}` }}>
            {icon(Ic.Search, 16, C.onSurfaceLow)}
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..."
              style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: C.onSurface, outline: "none", fontFamily: "sans-serif" }} />
          </div>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {["People", "Jobs", "Companies"].map(t => (
            <button key={t} onClick={() => setActiveTab(t.toLowerCase())} style={{
              flex: 1, padding: "10px 0", border: "none", background: "transparent",
              fontSize: 13, fontWeight: activeTab === t.toLowerCase() ? 700 : 500,
              color: activeTab === t.toLowerCase() ? C.primary : C.onSurfaceMid,
              borderBottom: `2.5px solid ${activeTab === t.toLowerCase() ? C.primary : "transparent"}`,
              cursor: "pointer", fontFamily: "sans-serif",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 14px" }}>
        {!query && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.onSurfaceLow, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontFamily: "sans-serif" }}>Recent</div>
            {recentSearches.map(s => (
              <button key={s} onClick={() => setQuery(s)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", background: "transparent", border: "none", cursor: "pointer", borderRadius: C.rSm, textAlign: "left" }}>
                {icon(Ic.Search, 15, C.onSurfaceLow)}
                <span style={{ fontSize: 14, color: C.onSurface, fontFamily: "sans-serif" }}>{s}</span>
              </button>
            ))}
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.onSurfaceLow, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontFamily: "sans-serif" }}>Suggestions</div>
          {suggestions.map(s => (
            <button key={s.name} onClick={() => {
              // FIX: suggestions now navigate to relevant screen based on activeTab/type
              if (s.type === "job") navigate("/jobs");
              else if (s.type === "person" || s.type === "company") show(`Viewing ${s.name}'s profile`);
            }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", background: "transparent", border: "none", cursor: "pointer", borderRadius: C.rSm, textAlign: "left" }}>
              <Avatar name={s.name} size={36} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.onSurface, fontFamily: "sans-serif" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{s.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── EMPLOYER ──────────────────────────────────────────────────────────────
const EmployerScreen = () => {
  const { goBack, navigate } = useRouter();
  const { show } = useToast();
  const [cs, setCs] = useState(null);
  const stats = [
    { label: "Total Views", value: "12.4k", Icon: Ic.Eye, change: "+18%" },
    { label: "Applicants", value: "342", Icon: Ic.Users, change: "+24%" },
    { label: "Active Jobs", value: "8", Icon: Ic.Briefcase, change: "+2" },
  ];
  const myJobs = [
    { title: "Senior React Developer", applicants: 45, views: 1200, status: "Active" },
    { title: "Product Designer", applicants: 32, views: 890, status: "Active" },
    { title: "Backend Engineer", applicants: 28, views: 650, status: "Paused" },
  ];

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <TopBar title="Employer Dashboard" onBack={goBack} />
      <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 90 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {stats.map((s, idx) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }}>
              <Card style={{ padding: 12, textAlign: "center" }}>
                {icon(s.Icon, 20, C.primary, { display: "block", margin: "0 auto 4px" })}
                <div style={{ fontSize: 18, fontWeight: 800, color: C.onSurface, fontFamily: "sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 10, color: C.green, fontWeight: 700, fontFamily: "sans-serif" }}>{s.change}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>Your Job Listings</div>
        {myJobs.map(job => (
          <Card key={job.title} onClick={() => navigate("/applicants")} style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{job.title}</div>
              <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, fontFamily: "sans-serif", background: job.status === "Active" ? C.greenBg : C.surface, color: job.status === "Active" ? C.green : C.onSurfaceMid }}>{job.status}</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{icon(Ic.Users, 13, C.onSurfaceLow)} {job.applicants} applicants</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{icon(Ic.Eye, 13, C.onSurfaceLow)} {job.views} views</span>
            </div>
          </Card>
        ))}
      </div>

      <FAB label="Post Job" onClick={() => setCs({ f: "Post a Job", d: "Create and publish a new job listing to reach thousands of qualified candidates." })} />
      <AnimatePresence>
        {cs && <ComingSoon feature={cs.f} desc={cs.d} onClose={() => setCs(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ─── APPLICANTS ────────────────────────────────────────────────────────────
const ApplicantsScreen = () => {
  const { goBack, navigate } = useRouter();
  const { show } = useToast();
  const [applicants, setApplicants] = useState([
    { name: "Emily Zhang", role: "Senior Frontend Engineer", match: 95, status: "New" },
    { name: "James Wilson", role: "Full Stack Developer", match: 88, status: "New" },
    { name: "Ana Garcia", role: "React Developer", match: 82, status: "New" },
    { name: "David Kim", role: "Frontend Engineer", match: 76, status: "New" },
  ]);

  const STATUS_COLORS = {
    New: { bg: C.primaryLight, color: C.primary },
    Reviewed: { bg: C.surface, color: C.onSurfaceMid },
    Shortlisted: { bg: C.greenBg, color: C.green },
    Rejected: { bg: C.redBg, color: C.red },
  };

  const updateStatus = (name, status) => {
    setApplicants(p => p.map(a => a.name === name ? { ...a, status } : a));
    if (status === "Shortlisted") show(`${name} shortlisted! ✅`, "success");
    if (status === "Rejected") show(`${name} rejected`);
  };

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>
      <TopBar title="Applicants" onBack={goBack} right={<span style={{ fontSize: 13, color: C.onSurfaceLow, fontFamily: "sans-serif" }}>{applicants.length} total</span>} />
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 40 }}>
        {applicants.map(a => {
          const sc = STATUS_COLORS[a.status] || STATUS_COLORS.New;
          return (
            <Card key={a.name} style={{ padding: 14 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <Avatar name={a.name} size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>{a.role}</div>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color, fontFamily: "sans-serif" }}>{a.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.primary, fontWeight: 700, fontFamily: "sans-serif", marginTop: 4 }}>{a.match}% match</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <button onClick={() => updateStatus(a.name, "Shortlisted")} disabled={a.status === "Shortlisted"} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", background: C.primary, color: "#fff", border: "none", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: a.status === "Shortlisted" ? "not-allowed" : "pointer", opacity: a.status === "Shortlisted" ? 0.5 : 1, fontFamily: "sans-serif" }}>
                      {icon(Ic.CheckCircle, 13, "#fff")} Shortlist
                    </button>
                    <button onClick={() => updateStatus(a.name, "Rejected")} disabled={a.status === "Rejected"} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", background: C.surface, color: C.onSurfaceMid, border: `1px solid ${C.border}`, borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: a.status === "Rejected" ? "not-allowed" : "pointer", opacity: a.status === "Rejected" ? 0.5 : 1, fontFamily: "sans-serif" }}>
                      {icon(Ic.XCircle, 13, C.onSurfaceMid)} Reject
                    </button>
                    <button onClick={() => { navigate("/messages"); show("Opening chat with " + a.name); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", background: C.surface, color: C.onSurfaceMid, border: `1px solid ${C.border}`, borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>
                      {icon(Ic.Msg, 13, C.onSurfaceMid)} Message
                    </button>
                    <button onClick={() => show("Opening resume for " + a.name + " 📄")} style={{ width: 34, height: 34, background: C.surface, border: `1px solid ${C.border}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      {icon(Ic.File, 15, C.onSurfaceMid)}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── CREATE POST ────────────────────────────────────────────────────────────
const CreatePostScreen = () => {
  const { goBack } = useRouter();
  const { show } = useToast();
  const [text, setText] = useState("");
  const [isHiring, setIsHiring] = useState(false);

  const handlePost = () => {
    if (!text.trim()) return;
    show("Post published! 🚀", "success");
    goBack();
  };

  return (
    <div style={{ minHeight: "100%", background: C.card, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon(Ic.Back, 20, C.onSurface)}
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>Create Post</span>
        </div>
        <button onClick={handlePost} disabled={!text.trim()} style={{
          padding: "8px 20px", background: text.trim() ? C.primary : C.surface,
          color: text.trim() ? "#fff" : C.onSurfaceLow, border: "none", borderRadius: 99,
          fontSize: 14, fontWeight: 700, cursor: text.trim() ? "pointer" : "not-allowed",
          fontFamily: "sans-serif", transition: "all 0.2s",
        }}>Post</button>
      </div>

      {/* User row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
        <Avatar name="John Doe" size={38} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>John Doe</div>
          <div style={{ fontSize: 12, color: C.onSurfaceMid, fontFamily: "sans-serif" }}>Posting publicly</div>
        </div>
      </div>

      {/* Text area */}
      <div style={{ flex: 1, padding: "0 14px" }}>
        <textarea value={text} onChange={e => setText(e.target.value.slice(0, 500))}
          placeholder="What's on your mind? ✨"
          autoFocus
          style={{ width: "100%", minHeight: 160, border: "none", outline: "none", resize: "none", fontSize: 16, lineHeight: 1.6, color: C.onSurface, background: "transparent", fontFamily: "sans-serif", boxSizing: "border-box" }} />
        <div style={{ textAlign: "right", fontSize: 12, color: text.length > 400 ? C.red : C.onSurfaceLow, fontFamily: "sans-serif" }}>{text.length}/500</div>
      </div>

      {/* Bottom actions */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 14px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
        <button onClick={() => show("Image picker coming soon! 📸")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", background: "transparent", border: "none", cursor: "pointer", borderRadius: C.rSm }}>
          {icon(Ic.Image, 20, C.primary)}
          <span style={{ fontSize: 14, color: C.onSurface, fontFamily: "sans-serif" }}>Add image or file</span>
        </button>
        <button onClick={() => setIsHiring(h => !h)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", background: "transparent", border: "none", cursor: "pointer", borderRadius: C.rSm }}>
          <Toggle on={isHiring} onToggle={() => setIsHiring(h => !h)} />
          <span style={{ fontSize: 14, color: C.onSurface, fontFamily: "sans-serif" }}>Mark as hiring</span>
          {isHiring && <span style={{ marginLeft: "auto", padding: "3px 10px", background: C.primary, color: "#fff", borderRadius: 99, fontSize: 11, fontWeight: 700, fontFamily: "sans-serif" }}>🔥 ON</span>}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ─── ROUTER SWITCH ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const Screen = () => {
  const { route } = useRouter();
  const p = route.path;
  if (p === "/") return <HomeScreen />;
  if (p === "/jobs") return <JobsScreen />;
  if (p.startsWith("/job/")) return <JobDetailsScreen />;
  if (p === "/messages") return <MessagesScreen />;
  if (p.startsWith("/chat/")) return <ChatScreen />;
  if (p === "/notifications") return <NotificationsScreen />;
  if (p === "/profile") return <ProfileScreen />;
  if (p === "/settings") return <SettingsScreen />;
  if (p === "/resume-builder") return <ResumeBuilderScreen />;
  if (p === "/create-post") return <CreatePostScreen />;
  if (p === "/search") return <SearchScreen />;
  if (p === "/employer") return <EmployerScreen />;
  if (p === "/applicants") return <ApplicantsScreen />;
  return <HomeScreen />;
};

// ─── CSS KEYFRAMES ─────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 0; height: 0; }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-4px);opacity:1} }
    body { font-family: 'Roboto', sans-serif; background: #F3F6F9; overscroll-behavior: none; }
    input, textarea, button { font-family: inherit; }
  `}</style>
);

// ─── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <ThemeProvider>
          <ToastProvider>
            {/* Phone shell */}
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              minHeight: "100vh", background: "#111827", padding: 20,
            }}>
              <div style={{
                width: 390, height: 844,
                background: "#111", borderRadius: 50,
                padding: "14px 5px 10px",
                boxShadow: "0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 2px #222",
                position: "relative", flexShrink: 0,
              }}>
                {/* Dynamic Island */}
                <div style={{
                  position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)",
                  width: 120, height: 34, background: "#000", borderRadius: 20, zIndex: 100,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #2a2a2a" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a1a1a" }} />
                </div>

                {/* Screen */}
                <div style={{
                  width: "100%", height: "100%", borderRadius: 42, overflow: "hidden",
                  background: C.bg, display: "flex", flexDirection: "column", position: "relative",
                }}>
                  {/* Status bar */}
                  <div style={{ height: 50, background: "rgba(255,255,255,0.97)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 22px 8px", flexShrink: 0, zIndex: 40, position: "relative" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.onSurface, fontFamily: "sans-serif" }}>9:41</span>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {/* Signal */}
                      <svg width="16" height="12" viewBox="0 0 16 12">
                        {[0,1,2,3].map((i) => <rect key={i} x={i*4} y={12-(i+1)*3} width="3" height={(i+1)*3} rx="1" fill={C.onSurface} />)}
                      </svg>
                      {/* WiFi */}
                      <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
                        <path d="M12 14l0 0" stroke={C.onSurface} strokeWidth="3" strokeLinecap="round"/>
                        <path d="M8 11c1.1-1.1 2.6-1.8 4-1.8s2.9.7 4 1.8" stroke={C.onSurface} strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <path d="M5 7.5C7 5.5 9.4 4.5 12 4.5s5 1 7 3" stroke={C.onSurface} strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <path d="M2 4C5.1 1.1 8.4 0 12 0s6.9 1.1 10 4" stroke={C.onSurface} strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                      {/* Battery */}
                      <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <div style={{ width: 22, height: 11, borderRadius: 3, border: `1.5px solid ${C.onSurface}`, padding: "1.5px 2px", display: "flex" }}>
                          <div style={{ width: "80%", background: C.green, borderRadius: 1 }} />
                        </div>
                        <div style={{ width: 2, height: 5, background: C.onSurface, borderRadius: 1 }} />
                      </div>
                    </div>
                  </div>

                  {/* Page content */}
                  <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", overflowY: "auto" }}>
                      <Screen />
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <BottomNav />
                </div>
              </div>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </Router>
    </>
  );
}
