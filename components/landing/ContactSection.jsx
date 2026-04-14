"use client";
 
import { useState } from "react";
import { Mail, MapPin, Link, Link2, Send } from "lucide-react";

// Contact info shown on the left side
const CONTACT_INFO = [
  {
    icon: Mail,
    text: "engineering@sovereignobs.io",
  },
  {
    icon: MapPin,
    text: "Distributed Infrastructure / Cloud Native",
  },
];
 
export default function ContactSection() {
  // Form state 
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
 
  // Handler called on every keystroke inside any input
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
 
  // Handler called when the button is clicked
  // ↓ Replace this with your actual API call / form service
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    setSubmitted(true);
  };
 
  return (
    <section
      id="contact"
      className="section"
      style={{
        background: "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)",
      }}
    >
      <div className="container">
 
        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
 
          {/* ── LEFT: CTA copy + contact info ── */}
          <div className="lg:col-span-6 flex flex-col gap-6">
 
            <p className="section-label">Get in Touch</p>
 
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
              }}
            >
              Ready to achieve
              <br />
              <span className="gradient-text">high-precision</span>
              <br />
              observability?
            </h2>
 
            <p className="section-subtitle">
              Connect with our engineering team for a technical deep-dive or
              request a customized platform demo.
            </p>
 
            {/* Contact info badges */}
            <div className="flex flex-col gap-3">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-3"
                  >
                    <span style={{ color: "var(--accent)" }}>
                      <Icon size={15} strokeWidth={1.75} />
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
 
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Link2, href: "https://github.com",   label: "GitHub" },
                { icon: Link,  href: "https://linkedin.com", label: "LinkedIn" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 38,
                      height: 38,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--bg-border)",
                      background: "var(--bg-surface)",
                      color: "var(--text-muted)",
                      transition: "border-color 150ms ease, color 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--bg-border)";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
          </div>
 
          {/* ── RIGHT: Contact form ── */}
          <div className="lg:col-span-6">
            <div className="card p-8">
              {submitted ? (
                // ── Success state ──────────────────────────────────────
                <div
                  className="flex flex-col items-center gap-4"
                  style={{ padding: "2rem 0", textAlign: "center" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-full)",
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid var(--green)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--green)",
                    }}
                  >
                    <Send size={20} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--text-primary)" }}>
                    Message sent!
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                // ── Form ──────────────────────────────────────────────
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
 
                  {/* Two-column row: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
                    {/* Name field */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="name"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
 
                    {/* Email field */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="email"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>
 
                  {/* Message textarea */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="message"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell us about your infrastructure..."
                      value={form.message}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
 
                  {/* Submit button — full width */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "0.8rem", fontSize: "0.875rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    <Send size={14} />
                    Request Demo
                  </button>
 
                </form>
              )}
            </div>
          </div>
 
        </div>
      </div>
    </section>
  );
}