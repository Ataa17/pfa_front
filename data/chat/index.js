import fs from "fs"
import path from "path"

/**
 * Chat API helper
 * Accepts a body with `message` and `sessionId`:
 * {
 *   message: "...",
 *   sessionId: "user-2"
 * }
 *
 * Returns a single item (string) which is the `output`.
 */

const CHAT_ENDPOINT = (() => {
	// prefer environment vars if set
	if (typeof process !== "undefined") {
		if (process.env.chat) return process.env.chat
		if (process.env.CHAT) return process.env.CHAT
		if (process.env.NEXT_PUBLIC_CHAT) return process.env.NEXT_PUBLIC_CHAT
	}

	// fallback: try to read config/.env (project-local)
	try {
		const envPath = path.join(process.cwd(), "config", ".env")
		if (fs.existsSync(envPath)) {
			const raw = fs.readFileSync(envPath, "utf8")
			const m = raw.match(/^\s*chat\s*=\s*["']?\s*(.*?)\s*["']?\s*$/m)
			if (m && m[1]) return m[1].trim()
		}
	} catch (e) {
		// ignore
	}

	return ""
})()

/**
 * Send message to chat service and return a single output item (string).
 * @param {{message: string, sessionId: string}} body
 * @returns {Promise<string>} output
 */
async function sendChatMessage({ message, sessionId }) {
	if (!message) throw new Error("`message` is required")
	if (!sessionId) throw new Error("`sessionId` is required")
	if (!CHAT_ENDPOINT) throw new Error("Chat endpoint not configured (set CHAT or NEXT_PUBLIC_CHAT or process.env.chat)")

	const res = await fetch(CHAT_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message, sessionId }),
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(`Chat API error ${res.status}: ${text}`)
	}

	// try parse JSON, but accept plain text too
	const contentType = res.headers.get("content-type") || ""
	let data
	if (contentType.includes("application/json")) {
		data = await res.json()
	} else {
		const txt = await res.text()
		try {
			data = JSON.parse(txt)
		} catch (e) {
			return txt
		}
	}

	// normalize output: prefer `output`, then common keys, then first array item, then stringified fallback
	if (typeof data === "string") return data
	if (Array.isArray(data) && data.length > 0) return data[0]
	if (data && typeof data === "object") {
		return (
			data.output ?? data.reply ?? data.answer ?? data.response ?? data.message ?? JSON.stringify(data)
		)
	}

	return String(data)
}

export default sendChatMessage
export { sendChatMessage }
