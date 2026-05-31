"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, UserRound, Mail, ShieldCheck, RefreshCw, AlertTriangle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const GLASS_CARD =
  "bg-[#0f1724]/70 border border-white/12 backdrop-blur-2xl shadow-[0_12px_60px_-22px_rgba(59,130,246,0.45)] ring-1 ring-white/10"

function InfoTile({ label, value, Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-blue-200/70 mb-2">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-sm text-white/90 break-words">{value || "N/A"}</p>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError("")

      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          throw new Error("Missing access token.")
        }

        const res = await fetch("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          throw new Error(data?.error || data?.message || "Failed to load profile.")
        }

        setProfile(data)
      } catch (err) {
        setError(err?.message || "Failed to load profile.")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const profileSummary = useMemo(() => {
    if (!profile) return { name: "Profile", email: "", initials: "?" }

    const name = profile.name || profile.full_name || profile.username || profile.display_name || profile.email || "Profile"
    const email = profile.email || profile.mail || profile.username || ""
    const initials = String(name)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"

    return { name, email, initials }
  }, [profile])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("auth_user")
    router.push("/signin")
  }

  return (
    <div className="h-[calc(100dvh-5.5rem)] overflow-y-auto overflow-x-hidden p-4 md:p-8 flex items-center justify-center">
      <section className={cn("w-full max-w-4xl rounded-[32px] p-6 md:p-8", GLASS_CARD)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-[0_8px_24px_-14px_rgba(59,130,246,0.6)]">
            <Settings className="w-5 h-5 text-primary-base" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Profile Settings</h2>
            <p className="text-xs font-mono uppercase tracking-[0.12em] text-blue-200/70 mt-1">
              Loaded from /auth/me
            </p>
          </div>
        </div>

        <p className="text-sm text-white/65 font-mono uppercase tracking-[0.12em] mb-6">
          Account details and runtime preferences.
        </p>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
            Loading profile from the backend...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-[#f3a2a4]/30 bg-[#f3a2a4]/10 p-6 text-sm text-[#f3a2a4]">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-xl font-bold text-blue-200">
                  {profileSummary.initials}
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-blue-200/70">Signed in as</p>
                  <h3 className="text-2xl font-semibold text-white mt-1">{profileSummary.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{profileSummary.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoTile label="Name" value={profile.name || profile.full_name || profile.username || profile.display_name} Icon={UserRound} />
                <InfoTile label="Email" value={profile.email || profile.mail || profile.username} Icon={Mail} />
                <InfoTile label="Role" value={profile.role || profile.user_role || profile.type} Icon={ShieldCheck} />
                <InfoTile label="Status" value={profile.status || profile.state || "Active"} Icon={RefreshCw} />
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[#f3a2a4]/25 bg-[#f3a2a4]/10 px-4 py-3 text-sm font-semibold text-[#f3a2a4] transition-all hover:bg-[#f3a2a4]/15 hover:shadow-[0_12px_30px_-16px_rgba(239,68,68,0.45)] active:scale-[0.99]"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-blue-200/70">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Backend payload</span>
              </div>

              <pre className="max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-[#09111f]/80 p-4 text-[11px] leading-5 text-white/80 whitespace-pre-wrap break-words">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
