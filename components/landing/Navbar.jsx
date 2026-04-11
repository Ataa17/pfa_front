
"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
// navigation links
const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About",        href: "#about" },
  { label: "Contact",      href: "#contact" },
];
export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "var(--bg-border)",
        backgroundColor: "rgba(10, 12, 15, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="container">
        <nav
          className="flex items-center justify-between"
          style={{ height: "64px" }}
        >
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span
              className="flex items-center justify-center rounded-md"
              style={{
                width: 32,
                height: 32,
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              <Activity size={16} strokeWidth={2.5} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              AIOPS Monitoring
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-1 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="btn btn-ghost hidden sm:inline-flex">
              Sign In
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}