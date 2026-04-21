"use client"

import React from "react"

export default function TypingDots({ className = "" }) {
  return (
    <div className={`typing-dots flex items-center gap-2 ${className}`} aria-hidden>
      <span className="dot w-2 h-2 rounded-full bg-white" style={{ animation: "typingBounce 1s infinite" }} />
      <span className="dot w-2 h-2 rounded-full bg-white" style={{ animation: "typingBounce 1s infinite 0.15s" }} />
      <span className="dot w-2 h-2 rounded-full bg-white" style={{ animation: "typingBounce 1s infinite 0.3s" }} />

      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35 }
          40% { transform: translateY(-6px); opacity: 1 }
        }
      `}</style>
    </div>
  )
}
