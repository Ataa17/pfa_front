import { Activity } from "lucide-react";
 
const FOOTER_LINKS = [
  { label: "Documentation", href: "#" },
  { label: "System Status", href: "#" },
  { label: "Privacy",       href: "#" },
  { label: "Security",      href: "#" },
];
 
export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--bg-border)",
        paddingBlock: "2.5rem",
      }}
    >
      <div className="container">
 
        {/* ── Top row: brand + links ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
 
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  background: "var(--accent)",
                  borderRadius: 6,
                  color: "#fff",
                }}
              >
                <Activity size={13} strokeWidth={2.5} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                AIOPS Monitoring
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                marginLeft: 34, // aligns with brand name (icon width + gap)
              }}
            >
              AI-Precision Infrastructure Intelligence
            </p>
          </div>
 
          {/* Footer links */}
          <nav className="flex flex-wrap gap-5">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="footer-link">
                {link.label}
              </a>
            ))}
          </nav>
 
        </div>
 
        {/* Thin divider */}
        <div className="divider" style={{ marginBlock: "1.5rem" }} />
 
        {/* ── Copyright row ── */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            textAlign: "center",
            letterSpacing: "0.06em",
          }}
        >
          © {new Date().getFullYear()} AIOPS Monitoring — AI-Precision Infrastructure Intelligence.
        </p>
 
      </div>
    </footer>
  );
}