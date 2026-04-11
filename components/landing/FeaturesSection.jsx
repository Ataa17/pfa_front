import {
  Brain,
  LineChart,
  Cloud,
  Bell,
  Search,
  LayoutDashboard,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Anomaly Detection",
    description:
      "Detect unusual network behavior automatically with real-time confidence scores from Isolation Forest models.",
    visual: (
      // A simple confidence score bar
      <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Confidence Score
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)" }}>
            94%
          </span>
        </div>
        <div style={{ height: 3, background: "var(--bg-elevated)", borderRadius: 99 }}>
          <div style={{ width: "94%", height: "100%", background: "var(--accent)", borderRadius: 99 }} />
        </div>
      </div>
    ),
  },
  {
    icon: LineChart,
    title: "Predictive Analytics (LSTM)",
    description:
      "Forecast CPU load and predict resource spikes up to 72 hours before they happen using LSTM time-series models.",
    visual: (
      // Mini sparkline bars
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end", marginTop: "1rem", height: 36 }}>
        {[60, 80, 40, 90, 55, 70, 85, 45, 95, 60].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: i === 8 ? "var(--accent)" : "var(--bg-elevated)",
              borderRadius: 3,
              border: i === 8 ? "1px solid var(--accent)" : "none",
            }}
          />
        ))}
      </div>
    ),
  },
  {
    icon: Cloud,
    title: "Cloud Monitoring",
    description:
      "Track EC2 instances, cluster health, CPU usage, and global uptime from one unified observability view.",
    visual: null,
  },
  {
    icon: Bell,
    title: "Alerts & Notifications",
    description:
      "Multi-channel real-time alerts with native CloudWatch and Slack integration. Never miss a critical event.",
    visual: null,
  },
  {
    icon: Search,
    title: "Root Cause Analysis",
    description:
      "Identify exactly why anomalies happen with automated dependency trace mapping across your entire stack.",
    visual: null,
  },
  {
    icon: LayoutDashboard,
    title: "Interactive Dashboard",
    description:
      "Clean, high-performance UI optimized for real-time streaming infrastructure metrics and drill-down views.",
    visual: null,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section">
      <div className="container">
            <div className="flex flex-col gap-3 mb-14">
         <p className="section-label">Precision Intelligence</p>
          <h2 className="section-title" style={{ maxWidth: "22ch" }}>
            Eliminating technical debt through automated observability
          </h2>
        </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => {
            // Destructure each feature's icon component into Icon variable
            const Icon = feature.icon;
 
            return (
              <div
                key={feature.title}
                className="card flex flex-col gap-4 p-6"
              >
                {/* Icon container — small accent-tinted square */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--accent-muted)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                </div>
 
                {/* Card title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    lineHeight: 1.3,
                  }}
                >
                  {feature.title}
                </h3>
 
                {/* Card description */}
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {feature.description}
                </p>
 
                {/* Optional decorative visual — only renders if not null */}
                {feature.visual}
              </div>
            );
          })}
        </div>
 
      </div>
    </section>
  );
}
   
      