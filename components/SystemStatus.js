import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Database,
  Globe
} from "lucide-react";

const SystemStatus = ({ sites, source = "local" }) => {
  const calculateOverallStatus = () => {
    if (!sites || sites.length === 0) return "operational";

    if (sites.some(s => s.status === "outage")) return "outage";
    if (sites.some(s => s.status === "degraded")) return "degraded";
    return "operational";
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "operational":
        return {
          title: "All Systems Nominal",
          description: "Your infrastructure is performing at peak efficiency without any detected anomalies.",
          icon: <ShieldCheck className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />,
          statusColor: "emerald",
          accentColor: "#10b981",
        };
      case "degraded":
        return {
          title: "Partial Performance Lag",
          description: "We've detected latency spikes in some sub-systems. Engineering teams are investigating.",
          icon: <ShieldAlert className="h-10 w-10 text-amber-500" strokeWidth={1.5} />,
          statusColor: "amber",
          accentColor: "#f59e0b",
        };
      case "outage":
        return {
          title: "Critical Service Failure",
          description: "Major outage detected across core endpoints. Immediate remediation in progress.",
          icon: <ShieldX className="h-10 w-10 text-rose-500" strokeWidth={1.5} />,
          statusColor: "rose",
          accentColor: "#ef4444",
        };
      default:
        return {
          title: "Synchronizing Data...",
          description: "Connecting to secure nodes to fetch the latest infrastructure metrics.",
          icon: <HelpCircle className="h-10 w-10 text-slate-500" strokeWidth={1.5} />,
          statusColor: "slate",
          accentColor: "#64748b",
        };
    }
  };

  const overallStatus = calculateOverallStatus();
  const config = getStatusConfig(overallStatus);

  const calculateOperationalPercentage = () => {
    if (!sites || sites.length === 0) return 100;
    const operationalCount = sites.filter(s => s.status === "operational").length;
    return Math.round((operationalCount / sites.length) * 100);
  };

  const operationalPercentage = calculateOperationalPercentage();

  return (
    <div className="premium-card relative group overflow-visible">
      {}
      <div
        className="absolute -inset-1 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000"
        style={{ backgroundColor: config.accentColor }}
      ></div>

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left flex-grow">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-current opacity-10 blur-xl rounded-full"></div>
            <div className="relative p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 transform group-hover:rotate-6 transition-transform duration-500">
              {config.icon}
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                {config.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg italic">
                {config.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-${config.statusColor}-500/10 text-${config.statusColor}-500 border border-${config.statusColor}-500/20`}>
                <span className={`status-pulse bg-${config.statusColor}-500 mr-2`}></span>
                {overallStatus.toUpperCase()}
              </span>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                {source === "spring-boot" ? (
                  <Database className="w-3 h-3 text-indigo-500" />
                ) : (
                  <Globe className="w-3 h-3 text-emerald-500" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {source === "spring-boot" ? "Spring Boot Integrated" : "Local Data Nodes"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Live Refresh Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-4">
          <svg className="w-40 h-40 transform -rotate-90">
            {}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-100 dark:text-white/5"
            />
            {}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeDasharray={439.8}
              strokeDashoffset={439.8 - (439.8 * operationalPercentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-[2000ms] ease-out shadow-2xl"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={config.accentColor} />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {operationalPercentage}%
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-1">
              Availability
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
