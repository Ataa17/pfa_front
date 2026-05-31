"use client"

import { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  Server,
  Zap,
  Activity,
  ChevronRight,
  Eye,
  AlertCircle,
  LineChart,
  Cpu,
} from "lucide-react"
import { motion } from "motion/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import instances from "@/data/instances"

export default function DashboardPage() {
  const [openInstanceId, setOpenInstanceId] = useState(null)
  const closeTimerRef = useRef(null)

  const openPopover = (id) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpenInstanceId(id)
  }

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setOpenInstanceId(null)
    }, 120)
  }

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  const activeInstances = 3
  const activeAnomalies = 1
  const activeAlarms = 2

  const kpis = [
    {
      label: "Active Instances",
      val: String(activeInstances),
      sub: "Running",
      icon: Server,
      color: "text-primary-base",
      border: "border-primary-base/20",
    },
    {
      label: "Active Anomalies",
      val: String(activeAnomalies).padStart(2, "0"),
      sub: "Detected",
      icon: Activity,
      color: "text-tertiary-base",
      border: "border-tertiary-base/20",
    },
    {
      label: "Active Alarms",
      val: String(activeAlarms).padStart(2, "0"),
      sub: "Unresolved",
      icon: AlertCircle,
      color: "text-error-base",
      border: "border-error-base/20",
    },
  ]

  const pipelineSteps = [
    { id: "monitoring", label: "Monitoring", icon: Eye, color: "secondary-base", active: true },
    { id: "anomaly", label: "Anomaly", icon: AlertTriangle, color: "tertiary-base", active: true },
    {
      id: "prediction",
      label: "Prediction",
      icon: LineChart,
      color: "primary-base",
      active: false,
    },
    { id: "rc", label: "Root Cause", icon: Cpu, color: "on-surface-variant", active: false },
    { id: "action", label: "Action", icon: Zap, color: "on-surface-variant", active: false },
  ]

  const glassCard =
    "isolate bg-[#0f1724]/70 border border-white/12 backdrop-blur-2xl shadow-[0_12px_60px_-22px_rgba(59,130,246,0.45)] ring-1 ring-white/10"
  const glassTile =
    "bg-white/5 border-white/20 backdrop-blur-xl shadow-[0_10px_30px_-18px_rgba(96,165,250,0.35)]"
  const glassIcon =
    "bg-white/10 shadow-[0_8px_24px_-14px_rgba(59,130,246,0.6)] ring-1 ring-white/20 backdrop-blur"

  const getStepColorClasses = (color, active) => {
    if (!active) {
      return {
        container: glassTile,
        icon: "text-on-surface-variant",
        text: "text-on-surface-variant/40",
        bar: "bg-outline-variant/10",
      }
    }

    switch (color) {
      case "secondary-base":
        return {
          container: glassTile,
          icon: "text-secondary-base",
          text: "text-secondary-base",
          bar: "bg-secondary-base",
        }
      case "tertiary-base":
        return {
          container: glassTile,
          icon: "text-tertiary-base",
          text: "text-tertiary-base",
          bar: "bg-tertiary-base",
        }
      case "primary-base":
        return {
          container: glassTile,
          icon: "text-primary-base",
          text: "text-primary-base",
          bar: "bg-blue-800",
        }
      default:
        return {
          container: glassTile,
          icon: "text-on-surface-variant",
          text: "text-on-surface-variant/40",
          bar: "bg-outline-variant/10",
        }
    }
  }

  const getCpuStyles = (inst) => {
    if (inst.stressed) {
      return {
        panel: "bg-[#2b2623] border-[#3e352f]",
        value: "text-[#f3a2a4]",
        tag: "text-[#f3a2a4]",
        bar: "bg-[#f3a2a4]",
      }
    }

    if (inst.tag === "NOMINAL") {
      return {
        panel: "bg-[#151b27] border-[#1f2a3a]",
        value: "text-[#5f6780]",
        tag: "text-[#5f6780]",
        bar: "bg-[#56d8b3]",
      }
    }

    return {
      panel: "bg-[#151b27] border-[#1f2a3a]",
      value: "text-[#5f6780]",
      tag: "text-[#5f6780]",
      bar: "bg-blue-800",
    }
  }

  return (
    <div className="h-[calc(100dvh-5.5rem)] overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`aspect-[2/1] rounded-3xl p-6 flex flex-col justify-between hover:border-on-surface-variant/30 transition-colors group ${glassCard}`}
          >
            <div
              className={`h-1/2 aspect-square rounded-2xl p-3 flex items-center justify-center transition-all bg-surface-container`}
            >
              <kpi.icon className={`w-full h-full ${kpi.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                {kpi.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-on-surface">{kpi.val}</span>
                <span className={`text-[12px] uppercase font-bold tracking-tight ${kpi.color}`}>
                  {kpi.sub}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface-low border border-outline-variant rounded-4xl p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-medium">Observer Intelligence Pipeline</h3>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-800 animate-pulse shadow-[0_0_8px_rgba(30,64,175,0.6)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
          </div>
        </div>

        <div className="flex items-center overflow-x-auto">
          {pipelineSteps.map((step, i) => {
            const colors = getStepColorClasses(step.color, step.active)
            return (
              <div key={step.id} className="flex-1 min-w-45 flex items-center">
                <div className="flex-1 flex flex-col items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${colors.container}`}
                  >
                    <step.icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="text-center">
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${colors.text}`}>
                      {step.label}
                    </span>
                  </div>
                  <div className={`h-px w-full ${colors.bar.replace("base", "base/50")}`} />
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="w-8 flex justify-center -mt-8">
                    <ChevronRight className="w-3 h-3 text-outline-variant" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Active EC2 Infrastructure</h3>
            <p className="text-sm text-outline-variant font-mono mt-1">
              Resource allocation and real-time load analytics
            </p>
          </div>
          <button className="text-xs font-mono text-primary-base font-bold hover:underline text-left md:text-right">
            Download Report (.json)
          </button>
        </div>

        <div className="bg-surface-low border border-outline-variant rounded-4xl p-4 md:p-8 flex flex-col overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className=" border-b border-outline-variant/30">
                <th className="px-6 py-4 text-[13px] font-bold text-[#60a5fa] uppercase tracking-[0.2em]">
                  Instance ID
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#60a5fa] uppercase tracking-[0.2em] text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#60a5fa] uppercase tracking-[0.2em]">
                  Instance Type
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#60a5fa] uppercase tracking-[0.2em] w-1/3">
                  CPU Utilization (Real-Time)
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#60a5fa] uppercase tracking-[0.2em] text-right">
                  Throughput
                </th>
              </tr>
            </thead>
            <tbody>
              {instances.map((inst) => (
                <Popover
                  key={inst.id}
                  open={openInstanceId === inst.id}
                  onOpenChange={(open) => setOpenInstanceId(open ? inst.id : null)}
                >
                  <PopoverTrigger asChild>
                    <tr
                      className="transition-all hover:bg-on-surface/5 group border-b border-outline-variant/10 cursor-pointer"
                      tabIndex={0}
                      onMouseEnter={() => openPopover(inst.id)}
                      onMouseLeave={scheduleClose}
                    >
                      <td className="px-6 py-6 transition-all">
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${inst.stressed ? "text-primary-base" : "text-on-surface"}`}>
                            {inst.id}
                          </span>
                          <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-tighter">
                            {inst.region}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <div
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
                              inst.stressed
                                ? "text-[#f3a2a4] bg-[#f3a2a4]/10 border-[#f3a2a4]/40"
                                : "text-[#56d8b3] bg-[#56d8b3]/10 border-[#56d8b3]/40"
                            }`}
                          >
                            {inst.status}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-on-surface">{inst.type}</td>
                      <td className="px-6 py-4">
                        <div
                          className={`rounded-xl border px-4 py-4 ${getCpuStyles(inst).panel}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-lg font-mono font-semibold ${getCpuStyles(inst).value}`}>
                              {inst.cpu}%
                            </span>
                            <span
                              className={`text-[11px] uppercase tracking-[0.16em] font-semibold ${getCpuStyles(inst).tag}`}
                            >
                              {inst.tag}
                            </span>
                          </div>
                          <div className="h-3 w-full bg-[#202838] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${inst.cpu}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${getCpuStyles(inst).bar}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right text-sm font-semibold tabular-nums">{inst.throughput}</td>
                    </tr>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={12}
                    className="w-80 border border-white/10 bg-[#0f1724]/85 text-white backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(59,130,246,0.5)]"
                    onMouseEnter={() => openPopover(inst.id)}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-200/70">Metrics Summary</p>
                        <p className="text-sm font-semibold text-white mt-1">{inst.id}</p>
                      </div>
                      <div className="rounded-lg border border-white/10 overflow-hidden">
                        <table className="w-full text-xs">
                          <tbody>
                            <tr className="border-b border-white/10">
                              <td className="px-3 py-2 text-white/70">CPU Usage</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.cpu}%</td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="px-3 py-2 text-white/70">Memory Usage</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.memory}%</td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="px-3 py-2 text-white/70">GPU Utilization</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.gpuUtilization}%</td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="px-3 py-2 text-white/70">GPU Memory</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.gpuMemoryUtilization}%</td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="px-3 py-2 text-white/70">Network In</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.networkIn}</td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="px-3 py-2 text-white/70">Network Out</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.networkOut}</td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="px-3 py-2 text-white/70">Disk Read Ops</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.diskReadOps}</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 text-white/70">Disk Write Ops</td>
                              <td className="px-3 py-2 text-right font-semibold text-white">{inst.diskWriteOps}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
