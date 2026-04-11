import { Play, ArrowRight, TrendingUp } from "lucide-react";

const STATS = [
  {
    label: "Network Throughput",
    value: "1.42 GB/s",
    delta: null,
    bar: { width: "68%", color: "var(--accent)" },
  },
  {
    label: "Active Containers",
    value: "8,291",
    delta: "+22.4% vs last 24h",
    bar: null,
  },
  {
    label: "Peak Resolution",
    value: "4.2m",
    delta: "AI root cause active",
    bar: null,
  },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="section"
      style={{
        paddingBottom: 0,
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h1
              className="animate-fade-up delay-200"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              High-Precision AIOps
              <br />
              for the <span className="gradient-text">Modern Cloud</span>
            </h1>

            <p
              className="section-subtitle animate-fade-up delay-300"
              style={{ fontSize: "1.1rem", maxWidth: "48ch" }}
            >
              Monitor EC2 instances, detect anomalies in real-time,
              and predict system failures using LSTM models
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-up delay-400">
              <a href="#contact" className="btn btn-primary" style={{ fontSize: "0.95rem", padding: "0.75rem 1.75rem" }}>
                Get Started
                <ArrowRight size={16} />
              </a>

              <a href="#how-it-works" className="btn btn-ghost" style={{ fontSize: "0.95rem", padding: "0.75rem 1.75rem" }}>
                <Play size={14} />
                Watch Demo
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block animate-fade-up delay-500">
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="status-dot" />
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Signal Line · Active
                </span>
                <span style={{
                  marginLeft: "auto",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--accent)"
                }}>
                  4.9ms
                </span>
              </div>

              <svg viewBox="0 0 400 160" style={{ width: "100%" }}>
                {[40, 80, 120].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}

                <defs>
                  <linearGradient id="sig-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.18)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                  </linearGradient>
                  <linearGradient id="sig-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                    <stop offset="60%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>

                <path
                  d="M0,130 C40,120 60,90 90,80 S140,50 170,60 S220,100 250,70 S300,20 330,40 S380,80 400,70 L400,160 L0,160 Z"
                  fill="url(#sig-fill)"
                />

                <path
                  d="M0,130 C40,120 60,90 90,80 S140,50 170,60 S220,100 250,70 S300,20 330,40 S380,80 400,70"
                  fill="none"
                  stroke="url(#sig-stroke)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle cx="250" cy="70" r="5" fill="var(--accent)" />
              </svg>

              <div className="flex justify-between mt-4">
                {["CPU: 34%", "MEM: 61%", "NET: 1.4 GB/s"].map((m) => (
                  <span key={m} style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--text-muted)"
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        

      </div>
    </section>
  );
}