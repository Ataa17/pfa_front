 
import { Pencil } from "lucide-react";
 
// Pipeline step data
const STEPS = [
  {
    number: "01",
    label: "Ingestion",
    description: "Data collected from EC2 and cloud fleets via agents.",
    active: false,
  },
  {
    number: "02",
    label: "Monitoring",
    description: "System tracks metrics and resource utilization in real time.",
    active: false,
  },
  {
    number: "03",
    label: "AI Detection",
    description: "Unsupervised AI detects hidden anomalies and deviations.",
    active: false,
  },
  {
    number: "04",
    label: "LSTM Prediction",
    description: "Models forecast future trends and predict failure windows.",
    active: false,
  },
  {
    number: "05",
    label: "Alert Trigger",
    description: "Automated alerts sent before critical thresholds are reached.",
    active: true, // ← this step gets the accent blue treatment
  },
];
 
export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section"

      style={{
        background: "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 50%, var(--bg-base) 100%)",
      }}
    >
      <div className="container">
 
        {/* ── Section header (centered) ── */}
        <div
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          {/* Decorative pencil icon above the title */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "var(--radius-full)",
              background: "var(--accent-muted)",
              color: "var(--accent)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <Pencil size={18} strokeWidth={1.75} />
          </span>
 
          <p className="section-label">The Intelligent Pipeline</p>
 
          <h2 className="section-title">From raw metrics to predictive actions</h2>
 
          <p className="section-subtitle" style={{ textAlign: "center" }}>
            Every byte of telemetry flows through a purpose-built AI pipeline
            designed to surface insight before failure occurs.
          </p>
        </div>
 
        <div
          className="grid grid-cols-1 md:grid-cols-5 gap-6 relative"
        >

          <div
            aria-hidden="true"
            className="hidden md:block absolute"
            style={{
              top: 20, // vertically centered with the circles (circle height/2 = 20px)
              left: "calc(10% + 20px)",   // starts after first circle
              right: "calc(10% + 20px)",  // ends before last circle
              height: 1,
              background: "linear-gradient(to right, var(--bg-border), rgba(59,130,246,0.4), var(--bg-border))",
              zIndex: 0,
            }}
          />
 
          {STEPS.map((step) => (
            <div
              key={step.number}
              // pipeline-step CSS class: flex col, center aligned (from globals.css)
              className="pipeline-step"
              style={{ position: "relative", zIndex: 1 }}
            >
              {/* Number circle — .pipeline-number + .active from globals.css */}
              <div className={`pipeline-number ${step.active ? "active" : ""}`}>
                {step.number}
              </div>
 
              {/* Step label */}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: step.active ? "var(--text-accent)" : "var(--text-primary)",
                }}
              >
                {step.label}
              </p>
 
              {/* Step description */}
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  maxWidth: "16ch",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
 
      </div>
    </section>
  );
}
 