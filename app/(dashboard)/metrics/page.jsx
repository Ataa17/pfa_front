"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
	AreaChart,
	Area,
	Line,
	XAxis,
	CartesianGrid,
	Tooltip,
} from "recharts"
import {
	TrendingUp,
	Clock,
	ShieldCheck,
	Search,
	Bell,
	Settings,
	Download,
	ChevronLeft,
	ChevronRight,
} from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const MOCK_CHART_DATA = [
	{ time: "15:45", actual: 40, forecast: null },
	{ time: "15:50", actual: 45, forecast: null },
	{ time: "15:55", actual: 42, forecast: null },
	{ time: "16:00", actual: 60, forecast: 60 },
	{ time: "16:05", actual: null, forecast: 65 },
	{ time: "16:10", actual: null, forecast: 55 },
	{ time: "16:15", actual: null, forecast: 70 },
	{ time: "16:20", actual: null, forecast: 62 },
	{ time: "16:25", actual: null, forecast: 68 },
]

const MOCK_EVENTS = [
	{
		id: "1",
		timestamp: "15:42:01.004",
		resourceId: "i-0a82b3d4e5f6g",
		action: "LSTM recurrent state updated",
		status: "success",
		latency: "12.4ms",
	},
	{
		id: "2",
		timestamp: "15:41:58.982",
		resourceId: "db-primary-main",
		action: "Auto-scaling group initialized",
		status: "success",
		latency: "45.0ms",
	},
	{
		id: "3",
		timestamp: "15:41:55.210",
		resourceId: "lb-us-east-1",
		action: "Anomalous spike detected",
		status: "warning",
		latency: "112.8ms",
	},
	{
		id: "4",
		timestamp: "15:41:50.004",
		resourceId: "i-9k2j4l5m6n7o",
		action: "Kernel optimization complete",
		status: "success",
		latency: "8.2ms",
	},
]

const METRICS_KPIS = [
	{
		icon: TrendingUp,
		value: "12",
		detail: "+4 workloads this month",
		color: "primary",
		badge: "ACTIVE STREAMS",
	},
	{
		icon: Clock,
		value: "4.12",
		subValue: "ms",
		detail: "Median inference latency",
		color: "secondary",
		badge: "PERFORMANCE",
	},
	{
		icon: ShieldCheck,
		value: "98.4",
		subValue: "%",
		detail: "Model confidence",
		progress: 98.4,
		color: "tertiary",
		badge: "ACCURACY",
	},
]

function StatusBadge({ status }) {
	const styles = {
		success: "text-[#56d8b3] bg-[#56d8b3]/10 border-[#56d8b3]/40",
		warning: "text-[#f3a2a4] bg-[#f3a2a4]/10 border-[#f3a2a4]/40",
		error: "text-[#f3a2a4] bg-[#f3a2a4]/10 border-[#f3a2a4]/40",
	}

	const dots = {
		success: "bg-[#56d8b3]",
		warning: "bg-[#f3a2a4]",
		error: "bg-[#f3a2a4]",
	}

	const key = styles[status] ? status : "success"

	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.16em]",
				styles[key]
			)}
		>
			<div className={cn("w-1.5 h-1.5 rounded-full", dots[key])} />
			{status}
		</div>
	)
}

function StatCard({ icon: Icon, value, subValue, detail, color, badge, progress, delay }) {
	const colorMap = {
		primary: {
			container: "bg-blue-800",
			icon: "text-primary-base",
			detail: "text-primary-base",
			bar: "bg-primary-base",
		},
		secondary: {
			container: "bg-surface-container",
			icon: "text-secondary-base",
			detail: "text-on-surface-variant",
			bar: "bg-secondary-base",
		},
		tertiary: {
			container: "bg-surface-container",
			icon: "text-tertiary-base",
			detail: "text-on-surface-variant",
			bar: "bg-tertiary-base",
		},
	}

	const palette = colorMap[color] || colorMap.primary
	const numericProgress = Number(progress)
	const clampedProgress = Number.isFinite(numericProgress) ? Math.min(100, Math.max(0, numericProgress)) : 0
	const progressTone =
		clampedProgress >= 85
			? "bg-[#56d8b3]"
			: clampedProgress >= 60
				? "bg-[#f8c16f]"
				: "bg-[#f3a2a4]"

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
			className="bg-blue-800 border border-outline-variant rounded-3xl p-6 flex flex-col gap-4 hover:border-on-surface-variant/30 transition-colors"
		>
			<div className="flex justify-between items-start">
				<span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.18em]">{badge}</span>
				<div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", palette.container)}>
					<Icon className={cn("w-5 h-5", palette.icon)} />
				</div>
			</div>

			<div>
				<div className="text-3xl font-semibold text-on-surface tabular-nums leading-none">
					{value}
					{subValue && <span className="text-lg font-medium text-on-surface-variant ml-1">{subValue}</span>}
				</div>
				<p className={cn("text-xs mt-3 font-mono uppercase tracking-[0.14em]", palette.detail)}>{detail}</p>
			</div>

			{progress !== undefined && (
				<div className="w-full h-2 bg-[#202838] rounded-full overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${clampedProgress}%` }}
						transition={{ duration: 1, ease: "easeOut" }}
						className={cn("h-full rounded-full", progressTone)}
					/>
				</div>
			)}
		</motion.div>
	)
}

export default function MetricsPage() {
	const router = useRouter()
	const chartContainerRef = useRef(null)
	const [chartWidth, setChartWidth] = useState(0)
	const [eventPage, setEventPage] = useState(1)

	useEffect(() => {
		const updateChartWidth = () => {
			const nextWidth = chartContainerRef.current?.clientWidth ?? 0
			setChartWidth(nextWidth)
		}

		updateChartWidth()

		if (!chartContainerRef.current || typeof ResizeObserver === "undefined") {
			return
		}

		const observer = new ResizeObserver(updateChartWidth)
		observer.observe(chartContainerRef.current)

		return () => observer.disconnect()
	}, [])

	const chartHeight = chartWidth < 640 ? 300 : chartWidth < 1024 ? 340 : 390
	const eventsPerPage = 4
	const totalEventPages = Math.max(1, Math.ceil(MOCK_EVENTS.length / eventsPerPage))
	const pagedEvents = MOCK_EVENTS.slice((eventPage - 1) * eventsPerPage, eventPage * eventsPerPage)
	const emptyRows = Math.max(0, eventsPerPage - pagedEvents.length)

	const handleOpenAlerts = () => {
		router.push("/alerts")
	}

	const handleOpenSettings = () => {
		router.push("/settings")
	}

	const handlePreviousEvents = () => {
		setEventPage((prev) => Math.max(1, prev - 1))
	}

	const handleNextEvents = () => {
		setEventPage((prev) => Math.min(totalEventPages, prev + 1))
	}

	return (
		<div className="h-[calc(100dvh-5.5rem)] overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-8">
			<div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
				<div>
					<h2 className="text-2xl md:text-3xl font-bold tracking-tight">Predictive Metrics Workspace</h2>
					<p className="text-sm text-outline-variant font-mono mt-2 uppercase tracking-[0.12em]">
						Throughput forecast and event telemetry for sovereign-observer-v4
					</p>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
					<div className="relative w-full sm:w-72">
						<Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
						<input
							type="text"
							placeholder="Search resources..."
							className="w-full rounded-xl border border-outline-variant bg-surface-low px-10 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-base"
						/>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handleOpenAlerts}
							aria-label="Open alerts"
							className="p-2 rounded-xl border border-outline-variant bg-surface-low text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant/40 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/60"
						>
							<Bell className="w-4 h-4" />
						</button>
						<button
							type="button"
							onClick={handleOpenSettings}
							aria-label="Open settings"
							className="p-2 rounded-xl border border-outline-variant bg-surface-low text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant/40 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/60"
						>
							<Settings className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="xl:col-span-3 bg-surface-low border border-outline-variant rounded-[32px] p-6 md:p-8 flex flex-col min-h-[470px] relative overflow-hidden"
				>
					<div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

					<div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
						<div>
							<h3 className="text-xl font-semibold">Throughput Forecast</h3>
							<p className="text-sm text-outline-variant font-mono mt-1 uppercase tracking-[0.12em]">
								40-minute LSTM projection window
							</p>
						</div>

						<div className="flex items-center gap-4 bg-blue-800/60 border border-outline-variant px-4 py-2 rounded-2xl">
							<div className="flex items-center gap-2">
								<div className="w-4 h-[2px] bg-primary-base" />
								<span className="text-[10px] font-mono uppercase tracking-[0.14em] text-on-surface-variant">
									Actual
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-[2px] border-t border-dashed border-secondary-base" />
								<span className="text-[10px] font-mono uppercase tracking-[0.14em] text-on-surface-variant">
									Forecast
								</span>
							</div>
						</div>
					</div>

					<div ref={chartContainerRef} className="relative flex-1 min-h-[320px] h-[320px] md:h-[360px] lg:h-[390px] min-w-0">
						{chartWidth > 0 && (
							<AreaChart width={chartWidth} height={chartHeight} data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
								<defs>
									<linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#60a5fa" stopOpacity={0.28} />
										<stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid stroke="#1f2a3a" strokeDasharray="3 3" vertical={false} />
								<XAxis
									dataKey="time"
									axisLine={false}
									tickLine={false}
									tick={{ fill: "#7f8aa5", fontSize: 11, fontFamily: "JetBrains Mono" }}
									dy={8}
								/>
								<Tooltip
									cursor={{ stroke: "#334155", strokeWidth: 1 }}
									contentStyle={{
										background: "#111827",
										border: "1px solid #1f2a3a",
										borderRadius: "14px",
									}}
									itemStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono", color: "#e5e7eb" }}
									labelStyle={{ fontSize: "11px", color: "#94a3b8", fontFamily: "JetBrains Mono" }}
								/>
								<Area
									type="monotone"
									dataKey="actual"
									stroke="#60a5fa"
									strokeWidth={3}
									fillOpacity={1}
									fill="url(#colorActual)"
									connectNulls
								/>
								<Line
									type="monotone"
									dataKey="forecast"
									stroke="#67e8f9"
									strokeWidth={2}
									strokeDasharray="8 5"
									dot={false}
									connectNulls
								/>
							</AreaChart>
						)}
					</div>

					<div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#56d8b3]/40 bg-[#56d8b3]/10">
							<div className="w-1.5 h-1.5 rounded-full bg-[#56d8b3] animate-pulse" />
							<span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#56d8b3] font-bold">
								Model Optimal
							</span>
						</div>

						<button className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-primary-base hover:underline">
							<Download className="w-4 h-4" />
							Export Forecast (.csv)
						</button>
					</div>
				</motion.div>

				<div className="flex flex-col gap-6">
					{METRICS_KPIS.map((card, i) => (
						<StatCard key={card.badge} {...card} delay={0.18 + i * 0.08} />
					))}
				</div>
			</section>

			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.25 }}
				className="bg-surface-low border border-outline-variant rounded-[32px] overflow-hidden"
			>
				<div className="px-6 md:px-8 py-5 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold">Recent Activity</h3>
						<p className="text-xs font-mono uppercase tracking-[0.12em] text-outline-variant mt-1">
							Telemetry events from active nodes
						</p>
					</div>
					<button className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-primary-base hover:underline">
						<Download className="w-4 h-4" />
						Download Event Log
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full min-w-[900px] text-left border-collapse">
						<thead>
							<tr className="border-b border-outline-variant/30">
								<th className="px-6 py-4 text-[12px] font-bold text-[#60a5fa] uppercase tracking-[0.18em]">
									Timestamp
								</th>
								<th className="px-6 py-4 text-[12px] font-bold text-[#60a5fa] uppercase tracking-[0.18em]">
									Resource ID
								</th>
								<th className="px-6 py-4 text-[12px] font-bold text-[#60a5fa] uppercase tracking-[0.18em]">
									Action
								</th>
								<th className="px-6 py-4 text-[12px] font-bold text-[#60a5fa] uppercase tracking-[0.18em]">
									Status
								</th>
								<th className="px-6 py-4 text-[12px] font-bold text-[#60a5fa] uppercase tracking-[0.18em] text-right">
									Latency
								</th>
							</tr>
						</thead>

						<tbody>
							{pagedEvents.map((event) => (
								<tr
									key={event.id}
									className="transition-all hover:bg-on-surface/5 border-b border-outline-variant/10"
								>
									<td className="px-6 py-5 font-mono text-xs text-on-surface-variant tabular-nums">{event.timestamp}</td>
									<td className="px-6 py-5 font-mono text-xs text-primary-base">{event.resourceId}</td>
									<td
										className={cn(
											"px-6 py-5 text-sm font-medium",
											event.status === "warning" ? "text-[#f3a2a4]" : "text-on-surface"
										)}
									>
										{event.action}
									</td>
									<td className="px-6 py-5">
										<StatusBadge status={event.status} />
									</td>
									<td className="px-6 py-5 text-right font-mono text-xs text-on-surface-variant tabular-nums">
										{event.latency}
									</td>
								</tr>
							))}
							{Array.from({ length: emptyRows }).map((_, index) => (
								<tr key={`empty-row-${index}`} className="border-b border-outline-variant/10">
									<td colSpan={5} className="px-6 py-5">
										<div className="h-[22px]" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="px-6 md:px-8 py-3 bg-blue-800/60 border-t border-outline-variant/30 flex justify-between items-center">
					<span className="text-[10px] font-mono uppercase tracking-[0.14em] text-on-surface-variant">
						Streaming active connections...
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={handlePreviousEvents}
							disabled={eventPage === 1}
							aria-label="Show previous events"
							className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<button
							type="button"
							onClick={handleNextEvents}
							disabled={eventPage === totalEventPages}
							aria-label="Show next events"
							className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</motion.section>
		</div>
	)
}
