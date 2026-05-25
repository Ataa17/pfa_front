import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="h-[calc(100dvh-5.5rem)] overflow-y-auto overflow-x-hidden p-4 md:p-8">
      <section className="bg-surface-low border border-outline-variant rounded-[32px] p-6 md:p-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-800 border border-outline-variant flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary-base" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h2>
        </div>

        <p className="text-sm text-outline-variant font-mono uppercase tracking-[0.12em] mb-6">
          Configure alerts, model behavior, and dashboard preferences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-outline-variant bg-blue-800 p-5">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-on-surface-variant mb-2">
              Notification Profile
            </p>
            <p className="text-on-surface text-sm">Email + Slack Webhook</p>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-blue-800 p-5">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-on-surface-variant mb-2">
              Forecast Refresh
            </p>
            <p className="text-on-surface text-sm">Every 5 minutes</p>
          </div>
        </div>
      </section>
    </div>
  )
}
