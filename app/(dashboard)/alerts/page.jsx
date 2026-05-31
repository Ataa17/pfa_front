"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Terminal, Eye, Rocket, ArrowRight, CheckCircle2, Server, Cpu } from "lucide-react";

const alertsData = [
    {
        id: "inc-045-23",
        title: "High CPU Utilization on Production Server",
        description: "CPU utilization has exceeded 90% for the last 15 minutes on instance i-0a823f99e41b.",
        status: "critical",
        isResolved: false,
        isMitigating: false,
        mitigationProgress: 0,
        mitigationLogs: [],
        nodes: [
            { id: "node-1", name: "CloudWatch Alarm", type: "cloudwatch", status: "error", details: "CPU > 90%" },
            { id: "node-2", name: "EC2 Instance", type: "ec2", status: "error", details: "i-0a823f99e41b" },
            { id: "node-3", name: "Auto-Scaling Group", type: "asg", status: "warning", details: "Scaling activity" },
        ],
        logs: [
            { timestamp: "16:01:15", level: "CRITICAL", service: "EC2", message: "Instance i-0a823f99e41b CPU utilization at 98.2%" },
            { timestamp: "16:00:45", level: "WARNING", service: "CloudWatch", message: "Alarm 'high-cpu-prod' triggered" },
            { timestamp: "15:58:30", level: "INFO", service: "EC2", message: "Instance i-0a823f99e41b CPU utilization at 85.7%" },
        ],
    },
    {
        id: "inc-046-23",
        title: "Increased Latency on Staging Environment",
        description: "API response times have increased by 50% on the staging environment.",
        status: "warning",
        isResolved: false,
        isMitigating: false,
        mitigationProgress: 0,
        mitigationLogs: [],
        nodes: [
            { id: "node-4", name: "SNS Notification", type: "sns", status: "warning", details: "Latency alert" },
            { id: "node-5", name: "Lambda Function", type: "lambda", status: "warning", details: "cold-start" },
            { id: "node-6", name: "API Gateway", type: "apigw", status: "ok", details: "us-east-1" },
        ],
        logs: [
            { timestamp: "16:05:22", level: "WARNING", service: "APIGateway", message: "p99 latency at 1500ms for /users" },
            { timestamp: "16:04:10", level: "INFO", service: "Lambda", message: "Function 'user-service-staging' experiencing cold starts" },
        ],
    },
];

export default function AlertsPage() {
    const [alerts, setAlerts] = useState(alertsData);
    const [selectedAlert, setSelectedAlert] = useState(alerts[0]);
    const [viewingLogsAlert, setViewingLogsAlert] = useState(null);

    const ALERT_GLASS = "isolate bg-[#0f1724]/70 backdrop-blur-2xl";
    const BLUE_SHADOW = "shadow-[0_12px_40px_-10px_rgba(59,130,246,0.45)] ring-1 ring-blue-400/20";
    const [openLogId, setOpenLogId] = useState(null);

    const openIncidentsCount = alerts.filter(a => !a.isResolved).length;

    const handleTriggerMitigation = (id) => {
        setAlerts(prevAlerts =>
            prevAlerts.map(alert => {
                if (alert.id === id) {
                    const newAlert = { ...alert, isMitigating: true, mitigationProgress: 0, mitigationLogs: ["Initiating mitigation protocol..."] };
                    const interval = setInterval(() => {
                        setAlerts(currentAlerts => currentAlerts.map(a => {
                            if (a.id === id && a.isMitigating) {
                                const newProgress = a.mitigationProgress + 10;
                                const newLogs = [...a.mitigationLogs, `Scaling resources... (${newProgress}%)`];
                                if (newProgress >= 100) {
                                    clearInterval(interval);
                                    return { ...a, isMitigating: false, isResolved: true, mitigationProgress: 100, mitigationLogs: [...newLogs, "Mitigation complete. System nominal."] };
                                }
                                return { ...a, mitigationProgress: newProgress, mitigationLogs: newLogs };
                            }
                            return a;
                        }));
                    }, 1000);
                    return newAlert;
                }
                return alert;
            })
        );
    };

    const renderNodeIcon = (type, status) => {
        const isError = status === 'error';
        const isWarning = status === 'warning';

        let colorClass = 'text-secondary-base';
        if (isError) colorClass = 'text-error-base';
        if (isWarning) colorClass = 'text-tertiary-base';

        switch (type) {
            case 'ec2':
                return <Server className={`w-8 h-8 ${colorClass}`} />;
            case 'cloudwatch':
                return <Eye className={`w-8 h-8 ${colorClass}`} />;
            case 'sns':
                return <motion.div animate={isError ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }}><AlertTriangle className={`w-8 h-8 ${colorClass}`} /></motion.div>;
            case 'lambda':
                return <Rocket className={`w-8 h-8 ${colorClass}`} />;
            default:
                return <Cpu className={`w-8 h-8 ${colorClass}`} />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
        >
            <div className="flex items-end justify-between border-b border-on-surface/10 pb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: "#3b82f6" }}>
                        Active Alarms
                    </h2>
                    <p className="text-sm text-outline-variant font-mono mt-2 uppercase tracking-[0.12em]">
                        The AIOps Observer has detected {openIncidentsCount} anomalous event chains requiring manual verification.
                    </p>
                </div>
                <div className="text-right select-none">
                    <div className="font-mono text-5xl font-black text-error-base tracking-tight">
                        {openIncidentsCount.toString().padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-on-surface/40 font-bold mt-1">
                        Open Incidents
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => {
                    const isCritical = alert.status === 'critical';
                    const isSelected = selectedAlert.id === alert.id;

                    return (
                        <div
                            key={alert.id}
                            className={`relative p-6 rounded-xl overflow-hidden transition-all duration-300 border border-transparent border-l-4 border-l-transparent ${ALERT_GLASS} ${isSelected ? 'bg-surface-raised' : 'bg-surface'} hover:border-l-blue-500 hover:border-t-transparent hover:border-r-transparent hover:border-b-transparent hover:shadow-[0_12px_40px_-10px_rgba(59,130,246,0.45)]`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => setSelectedAlert(alert)}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border tracking-widest uppercase ${isCritical
                                            ? 'bg-error-base/20 text-error-base border-error-base/40'
                                            : 'bg-tertiary-base/20 text-tertiary-base border-tertiary-base/40'
                                            }`}>
                                            {alert.status}
                                        </span>
                                        <span className="font-mono text-xs text-on-surface/40 font-bold">
                                            ID: {alert.id}
                                        </span>
                                        {alert.isResolved && (
                                            <span className="text-[10px] font-mono font-bold bg-secondary-base/10 text-secondary-base border border-secondary-base/20 px-1.5 py-0.2 rounded uppercase">
                                                MITIGATED
                                            </span>
                                        )}
                                    </div>

                                    <h3 className={`text-xl font-bold tracking-tight mb-2 font-sans transition-colors ${isSelected ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'
                                        }`}>
                                        {alert.title}
                                    </h3>

                                    <p className="text-on-surface/60 text-xs italic max-w-2xl font-serif">
                                        &ldquo;{alert.description}&rdquo;
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 select-none">
                                    <Popover
                                        open={openLogId === alert.id}
                                        onOpenChange={(open) => setOpenLogId(open ? alert.id : null)}
                                    >
                                        <PopoverTrigger asChild>
                                            <button
                                                className="px-5 py-2.5 bg-surface hover:bg-surface-raised text-xs font-bold font-sans tracking-wide rounded border border-on-surface/10 hover:border-on-surface/30 hover:text-on-surface text-on-surface-variant flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                                            >
                                                <Terminal className="w-4 h-4 text-primary-base" />
                                                View Log
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            side="left"
                                            align="center"
                                            sideOffset={12}
                                            className="w-96 border border-white/10 bg-[#0f1724]/85 text-white backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(59,130,246,0.5)]"
                                            onMouseEnter={() => setOpenLogId(alert.id)}
                                            onMouseLeave={() => setOpenLogId(null)}
                                        >
                                            <div className="space-y-3 p-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-blue-200/70">Event Logs</p>
                                                    <p className="text-sm font-semibold text-white mt-1">{alert.id}</p>
                                                </div>
                                                <div className="rounded-md border border-white/10 overflow-hidden text-xs font-mono max-h-44 overflow-y-auto">
                                                    <div className="p-3 space-y-2 bg-background/30">
                                                        {alert.logs.map((log, index) => (
                                                            <div key={index} className="flex gap-3 items-start">
                                                                <span className="text-on-surface-variant/60 text-[11px] w-14">{log.timestamp}</span>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 border uppercase tracking-wider rounded ${log.level === 'CRITICAL' ? 'bg-error-base/20 text-error-base border-error-base/40' : log.level === 'WARNING' ? 'bg-tertiary-base/10 text-tertiary-base border-tertiary-base/25' : 'bg-primary-base/20 text-primary-base/80 border-primary-base/30'}`}>
                                                                            {log.level}
                                                                        </span>
                                                                        <span className="text-primary-base font-bold">[{log.service}]</span>
                                                                    </div>
                                                                    <div className="text-on-surface-variant text-sm">{log.message}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                    <button
                                        onClick={() => window.open('https://console.aws.amazon.com/', '_blank')}
                                        className="px-5 py-2.5 text-xs font-bold font-sans tracking-wide rounded flex items-center gap-2 transition-all active:scale-95 cursor-pointer bg-surface-raised text-blue-600 border border-blue-300/20 hover:bg-surface-raised/50 hover:shadow-[0_10px_30px_-12px_rgba(59,130,246,0.45)] hover:ring-1 hover:ring-blue-400/20"
                                    >
                                        <Terminal className="w-4 h-4" />
                                        Investigate
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

           

            

            {viewingLogsAlert && (
                <div className="fixed inset-0 bg-background/90 backdrop-blur-2xl flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-raised border border-on-surface/15 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
                        <div className="px-6 py-4 bg-surface border-b border-on-surface/10 flex justify-between items-center select-none">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-primary-base" />
                                <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
                                    Event Logs — {viewingLogsAlert.id}
                                </span>
                            </div>
                            <button
                                onClick={() => setViewingLogsAlert(null)}
                                className="text-xs text-on-surface/50 hover:text-on-surface border border-on-surface/10 px-2.5 py-1 rounded transition-colors font-mono cursor-pointer"
                            >
                                CLOSE
                            </button>
                        </div>

                        <div className="p-6 font-mono text-xs text-on-surface-variant space-y-3 bg-background/55 max-h-96 overflow-y-auto">
                            <div className="text-on-surface-variant/50 text-[10px] mb-4 border-b border-white/5 pb-2">
                                Pulling event logs...
                            </div>
                            {viewingLogsAlert.logs.map((log, index) => (
                                <div key={index} className="flex gap-4 hover:bg-white/5 p-1 rounded">
                                    <span className="text-on-surface-variant/60 select-none shrink-0">{log.timestamp}</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 border uppercase tracking-wider rounded shrink-0 ${log.level === 'CRITICAL' ? 'bg-error-base/20 text-error-base border-error-base/40' :
                                        log.level === 'WARNING' ? 'bg-tertiary-base/10 text-tertiary-base border-tertiary-base/25' :
                                            'bg-primary-base/20 text-primary-base/80 border-primary-base/30'
                                        }`}>
                                        {log.level}
                                    </span>
                                    <span className="text-primary-base font-bold shrink-0">[{log.service}]</span>
                                    <span className="text-on-surface-variant">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

