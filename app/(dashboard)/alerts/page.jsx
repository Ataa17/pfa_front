"use client"
import { useState } from "react";
import { motion } from "framer-motion";
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
                        Priority Queue
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
                            className={`group relative p-6 rounded-xl border-l-4 overflow-hidden transition-all duration-300 ${isCritical ? 'border-error-base' : 'border-tertiary-base'
                                } ${isSelected
                                    ? 'bg-surface-raised shadow-2xl ring-1 ring-on-surface/15'
                                    : 'bg-surface hover:bg-surface-raised/75'
                                }`}
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
                                    <button
                                        onClick={() => setViewingLogsAlert(alert)}
                                        className="px-5 py-2.5 bg-surface hover:bg-surface-raised text-xs font-bold font-sans tracking-wide rounded border border-on-surface/10 hover:border-on-surface/30 hover:text-on-surface text-on-surface-variant flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                                    >
                                        <Terminal className="w-4 h-4 text-primary-base" />
                                        View Log
                                    </button>

                                    <button
                                        onClick={() => setSelectedAlert(alert)}
                                        className={`px-5 py-2.5 text-xs font-bold font-sans tracking-wide rounded flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg ${isSelected
                                            ? 'bg-gradient-to-br from-primary-base to-blue-600 text-white shadow-primary-base/20'
                                            : 'bg-surface-raised text-primary-base/80 border border-primary-base/30 hover:bg-surface-raised/50'
                                            }`}
                                    >
                                        <Terminal className="w-4 h-4" />
                                        {isSelected ? 'Investigating' : 'Investigate'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="space-y-6 pt-6">
                <div className="flex items-center gap-4 mb-2 select-none">
                    <div className="h-px flex-1 bg-on-surface/10"></div>
                    <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-on-surface/40 font-mono">
                        Infrastructure Correlation Map • {selectedAlert.id}
                    </h4>
                    <div className="h-px flex-1 bg-on-surface/10"></div>
                </div>

                <div className="bg-surface-raised rounded-3xl p-12 relative overflow-hidden border border-on-surface/5">
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#dfe2eb 1px, transparent 1px)",
                            backgroundSize: "24px 24px"
                        }}
                    ></div>

                    <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 max-w-5xl mx-auto">
                        {selectedAlert.nodes.map((node, index) => {
                            const isLast = index === selectedAlert.nodes.length - 1;
                            const isNodeError = node.status === 'error';
                            const isNodeWarning = node.status === 'warning';

                            let nodeBorderColorClass = 'border-secondary-base shadow-secondary-base/10';
                            if (isNodeError) nodeBorderColorClass = 'border-error-base shadow-error-base/20';
                            if (isNodeWarning) nodeBorderColorClass = 'border-tertiary-base shadow-tertiary-base/15';

                            return (
                                <div key={node.id} className="flex flex-col md:flex-row items-center flex-1 justify-between w-full md:w-auto">
                                    <div className="flex flex-col items-center gap-3 group shrink-0 select-none">
                                        <div className={`w-20 h-20 bg-surface border-2 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-105 ${nodeBorderColorClass}`}>
                                            {renderNodeIcon(node.type, node.status)}
                                        </div>

                                        <div className="text-center font-sans">
                                            <p className="text-xs font-bold text-on-surface tracking-wide">
                                                {node.name}
                                            </p>
                                            <p className={`font-mono text-[9px] font-bold uppercase mt-1 ${isNodeError ? 'text-error-base' : isNodeWarning ? 'text-tertiary-base' : 'text-secondary-base'}`}>
                                                {node.details}
                                            </p>
                                        </div>
                                    </div>

                                    {!isLast && (
                                        <div className="flex-1 h-[2px] bg-gradient-to-r from-on-surface/10 to-on-surface/20 relative w-[2px] md:w-auto h-12 md:h-[2px] my-4 md:my-0">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-raised px-2 text-on-surface/40 select-none">
                                                <ArrowRight className="w-4 h-4 animate-pulse transform md:rotate-0 rotate-90" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="pt-8 border-t border-on-surface/10">
                <div className="flex flex-col items-center text-center max-w-lg mx-auto space-y-8 select-none">
                    <div className="space-y-2">
                        <p className="text-tertiary-base text-xs uppercase tracking-widest font-black font-mono">
                            Recommended Mitigation Plan
                        </p>

                        <p className="text-on-surface/70 text-sm font-sans leading-relaxed">
                            The AIOps observer predicts resource exhaustion. Automated mitigation patterns are available.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 w-full">
                        {selectedAlert.isMitigating ? (
                            <div className="w-full space-y-3 bg-surface p-6 rounded-2xl border border-primary-base/20">
                                <div className="flex justify-between items-center text-xs font-mono font-bold">
                                    <span className="text-primary-base animate-pulse">AUTONOMOUS MITIGATION ACTIVE...</span>
                                    <span className="text-on-surface">{selectedAlert.mitigationProgress}%</span>
                                </div>
                                <div className="w-full bg-surface-raised h-2 rounded-full overflow-hidden relative">
                                    <div
                                        className="bg-gradient-to-r from-primary-base to-blue-600 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${selectedAlert.mitigationProgress}%` }}
                                    ></div>
                                </div>
                                <div className="h-28 overflow-y-auto bg-surface-raised p-3 rounded-lg border border-on-surface/5 font-mono text-[10px] text-on-surface-variant space-y-1.5 text-left">
                                    {selectedAlert.mitigationLogs.map((mLog, i) => (
                                        <div key={i} className="flex gap-2 items-start">
                                            <span className="text-primary-base shrink-0">●</span>
                                            <span>{mLog}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : selectedAlert.isResolved ? (
                            <div className="p-4 bg-secondary-base/10 border border-secondary-base/35 rounded-xl flex items-center gap-3 text-left w-full select-none">
                                <CheckCircle2 className="w-6 h-6 text-secondary-base" />
                                <div>
                                    <span className="font-mono text-xs font-bold text-secondary-base uppercase block leading-none">Incident Mitigated</span>
                                    <span className="text-[11px] text-on-surface/60 mt-1 block leading-normal">System returned to nominal operational capacity.</span>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleTriggerMitigation(selectedAlert.id)}
                                className="group relative px-12 py-5 bg-primary-base text-white font-black tracking-widest uppercase rounded-full shadow-[0_20px_50px_rgba(26,108,240,0.3)] hover:shadow-[0_20px_70px_rgba(26,108,240,0.55)] transition-all duration-300 active:scale-95 overflow-hidden border border-blue-400/20 cursor-pointer"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Mitigate
                                    <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </button>
                        )}
                    </div>
                </div>
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

