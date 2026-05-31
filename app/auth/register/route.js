export const runtime = "nodejs"

import { proxyAuthPost } from "@/data/auth"

export async function POST(req) {
  return proxyAuthPost(req, "/auth/register")
}
