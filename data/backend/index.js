import fs from "fs"
import path from "path"

const BACKEND_BASE_URL = (() => {
  let raw = ""

  if (typeof process !== "undefined") {
    raw = process.env.backend || process.env.BACKEND || process.env.NEXT_PUBLIC_BACKEND || ""
  }

  if (!raw) {
    try {
      const envPath = path.join(process.cwd(), "config", ".env")
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8")
        const match = content.match(/^\s*backend\s*=\s*["']?\s*(.*?)\s*["']?\s*$/m)
        if (match && match[1]) raw = match[1].trim()
      }
    } catch (e) {
      // ignore
    }
  }

  if (!raw) return ""
  if (/^https?:\/\//i.test(raw)) return raw
  return `http://${raw}`
})()

function buildBackendUrl(pathname = "") {
  if (!BACKEND_BASE_URL) return ""
  const base = BACKEND_BASE_URL.replace(/\/+$/, "")
  const cleanedPath = String(pathname || "").replace(/^\/+/, "")
  return cleanedPath ? `${base}/${cleanedPath}` : base
}

export default BACKEND_BASE_URL
export { BACKEND_BASE_URL, buildBackendUrl }
