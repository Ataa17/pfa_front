import { Eye } from "lucide-react";
 
// Small metric badges shown below the body copy
const BADGES = [
  { label: "99.97% Uptime SLA" },
  { label: "< 1ms Detection Latency" },
  { label: "SOC-2 Compliant" },
  { label: "Multi-Cloud Ready" },
];
 
export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
 
        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
 
          {/* ── LEFT: Text content ── */}
          <div className="lg:col-span-7 flex flex-col gap-7">
 
            {/* Mono label */}
            <p className="section-label">The Mission</p>
 
            {/* Large heading with gradient accent word */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
              }}
            >
              The{" "}
              <span className="gradient-text">Sovereign</span>
              <br />
              Observer.
            </h2>
 
            {/* First paragraph */}
            <p className="section-subtitle">
              Traditional monitoring was built for servers. Sovereign Observer
              was built for dynamic, ephemeral cloud ecosystems. In a complex
              world, clarity is the ultimate luxury.
            </p>
 
            {/* Second paragraph */}
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: "54ch" }}>
              Our platform provides the "God's eye view" of your infrastructure,
              turning raw noise into actionable intelligence. We don't alert you
              that something is broken; we tell you{" "}
              <em style={{ color: "var(--text-accent)", fontStyle: "normal", fontWeight: 500 }}>
                why it's going to break tomorrow.
              </em>
            </p>
 
            {/* Metric badges row */}
            <div className="flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <span
                  key={b.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--bg-border)",
                    background: "var(--bg-surface)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--text-secondary)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
 
          {/* ── RIGHT: Visual monitor card ── */}
          <div className="lg:col-span-5 hidden lg:block">
            <div
              className="card"
              style={{ padding: "1.75rem", overflow: "hidden" }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between mb-5"
                style={{ borderBottom: "1px solid var(--bg-border)", paddingBottom: "1rem" }}
              >
                <div className="flex items-center gap-2">
                  <Eye size={14} style={{ color: "var(--accent)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Signal Line · Active
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--green)" }}>
                  ● Live
                </span>
              </div>
 
              {/* Signal SVG — two lines: normal + anomaly */}
              <svg
                viewBox="0 0 360 120"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", display: "block", marginBottom: "1.5rem" }}
              >
                <defs>
                  <linearGradient id="about-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="about-green" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(34,197,94,0.2)" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
 
                {/* Grid */}
                {[30, 60, 90].map((y) => (
                  <line key={y} x1="0" y1={y} x2="360" y2={y}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
 
                {/* Green "normal" baseline line */}
                <path
                  d="M0,80 C60,78 100,75 160,77 S260,80 360,78"
                  fill="none"
                  stroke="url(#about-green)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />
 
                {/* Blue "live signal" line */}
                <path
                  d="M0,80 C40,75 70,65 100,60 S150,30 180,40 S230,85 260,70 S310,50 360,55"
                  fill="none"
                  stroke="url(#about-grad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
 
              {/* Bottom legend */}
              <div className="flex gap-5">
                {[
                  { color: "var(--accent)", label: "Live signal" },
                  { color: "var(--green)", label: "Normal range" },
                ].map((leg) => (
                  <div key={leg.label} className="flex items-center gap-2">
                    <div style={{ width: 24, height: 2, background: leg.color, borderRadius: 99 }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                      {leg.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </section>
  );
}