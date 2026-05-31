import { buildBackendUrl } from "@/data/backend"

const JSON_HEADERS = { "Content-Type": "application/json" }

function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  })
}

async function readAuthBody(req) {
  const raw = await req.text()
  if (!raw) return { error: "Request body is required." }

  const contentType = req.headers.get("content-type") || ""

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(raw)
    return {
      data: {
        email: params.get("email") || "",
        password: params.get("password") || "",
      },
    }
  }

  try {
    return { data: JSON.parse(raw) }
  } catch (err) {
    return { error: "Invalid JSON body." }
  }
}

async function proxyAuthPost(req, endpoint) {
  const url = buildBackendUrl(endpoint)

  if (!url) {
    return jsonResponse(
      { error: "Backend not configured (set backend in config/.env)." },
      500
    )
  }

  const { data, error } = await readAuthBody(req)

  if (error) {
    return jsonResponse({ error }, 400)
  }

  const { email, password } = data || {}

  if (!email || !password) {
    return jsonResponse({ error: "email and password required" }, 400)
  }

  const res = await fetch(url, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  })

  const contentType = res.headers.get("content-type") || "application/json"
  const payload = await res.text()

  return new Response(payload, {
    status: res.status,
    headers: { "Content-Type": contentType },
  })
}

async function proxyAuthMe(req, endpoint) {
  const url = buildBackendUrl(endpoint)

  if (!url) {
    return jsonResponse(
      { error: "Backend not configured (set backend in config/.env)." },
      500
    )
  }

  const authorization = req.headers.get("authorization") || ""

  if (!authorization) {
    return jsonResponse({ error: "Authorization header required" }, 401)
  }

  const res = await fetch(url, {
    headers: { Authorization: authorization },
  })

  const contentType = res.headers.get("content-type") || "application/json"
  const payload = await res.text()

  return new Response(payload, {
    status: res.status,
    headers: { "Content-Type": contentType },
  })
}

export { proxyAuthPost, proxyAuthMe }
