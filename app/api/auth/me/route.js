export const runtime = "nodejs"

import { proxyAuthMe } from "@/data/auth"

export async function GET(req) {
  return proxyAuthMe(req, "/auth/me")
}
