export const runtime = 'nodejs'

import sendChatMessage from "@/data/chat"

export async function POST(req) {
  try {
    const body = await req.json()
    const { message, sessionId } = body || {}

    if (!message || !sessionId) {
      return new Response(JSON.stringify({ error: "message and sessionId required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const output = await sendChatMessage({ message, sessionId })

    return new Response(JSON.stringify({ output }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("/api/chat error:", err)
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
