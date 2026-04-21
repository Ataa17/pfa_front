"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send ,Sparkles } from "lucide-react"
import UserMessage from "@/ui/chat/user-message"
import AIMessage from "@/ui/chat/ai-message"
import TypingDots from "@/ui/chat/typing-dots"

export default function ChatPage() {
  const [sessionId, setSessionId] = useState("user-1")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    // optionally read sessionId from url ?sessionId=...
    try {
      const params = new URLSearchParams(window.location.search)
      const s = params.get("sessionId")
      if (s) setSessionId(s)
    } catch (e) {}
  }, [])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return
    const text = input.trim()
    const typingId = `typing-${Date.now()}`

    // Append the user message and a typing placeholder for the AI
    setMessages((m) => [...m, { type: "user", text }, { type: "ai-typing", id: typingId }])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      })

      const data = await res.json()
      if (res.ok) {
        // Replace typing placeholder with actual AI message
        setMessages((prev) => prev.map((msg) => (msg.type === "ai-typing" && msg.id === typingId ? { type: "ai", text: data.output } : msg)))
      } else {
        setMessages((prev) => prev.map((msg) => (msg.type === "ai-typing" && msg.id === typingId ? { type: "ai", text: `Error: ${data.error || data}` } : msg)))
      }
    } catch (err) {
      setMessages((prev) => prev.map((msg) => (msg.type === "ai-typing" && msg.id === typingId ? { type: "ai", text: `Error: ${err.message || err}` } : msg)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="h-[90vh] flex flex-col bg-background text-white">
      <div className="flex-1 overflow-auto min-h-0 px-6 py-6 pb-24" ref={messagesContainerRef}>
        <div className="w-full mx-auto flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center w-full">
                <div className="mb-4">
                  <Sparkles className="size-10 text-blue-400 opacity-90" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Your AWS assistant is online start talking to it right now !
                </h3>
                <p className="mt-2 text-sm text-slate-300">Ask a general question about AWS services...</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i}>
                  {m.type === "user" ? (
                    <UserMessage>{m.text}</UserMessage>
                  ) : m.type === "ai" ? (
                    <AIMessage>{m.text}</AIMessage>
                  ) : m.type === "ai-typing" ? (
                    <AIMessage>
                      <TypingDots />
                    </AIMessage>
                  ) : null}
                </div>
              ))
            )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 p-4">
        <div className="w-full mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask a general question about AWS services..."
            className="flex-1 rounded-md px-3 py-2 bg-slate-800 text-white outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-sm aspect-square bg-blue-600 p-2 disabled:opacity-50 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="size-5 text-white" />
          </button>
        </div>
      </div>
    </main>
  )
}
