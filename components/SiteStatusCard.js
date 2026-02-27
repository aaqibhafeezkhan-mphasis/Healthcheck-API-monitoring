import React from "react";
import Link from "next/link";
import { ExternalLink, BarChart2, Clock, Activity, Zap, Shield, ArrowUpRight } from "lucide-react";

const SiteStatusCard = ({ site }) => {
  const {
    id,
    name,
    description,
    url,
    icon,
    status,
    statusText,
    lastChecked,
    responseTime,
    category
  } = site;

  const config = {
    operational: {
      color: "emerald",
      icon: <Zap className="h-5 w-5 text-emerald-500" />,
      label: "Healthy",
      bgStyle: "bg-emerald-500/5",
    },
    degraded: {
      color: "amber",
      icon: <Activity className="h-5 w-5 text-amber-500" />,
      label: "Degraded",
      bgStyle: "bg-amber-500/5",
    },
    outage: {
      color: "rose",
      icon: <Activity className="h-5 w-5 text-rose-500" />,
      label: "Down",
      bgStyle: "bg-rose-500/5",
    }
  }[status] || {
    color: "slate",
    icon: <Activity className="h-5 w-5 text-slate-500" />,
    label: "Unknown",
    bgStyle: "bg-slate-500/5",
  };

  const formatTime = (date) => {
    if (!date) return "--:--";
    try {
      const d = new Date(date);
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch (e) { return "--:--"; }
  };

  return (
    <div className={`premium-card group transition-all duration-700 ${config.bgStyle}`}>
      {}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-transparent to-${config.color}-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-grow">
          <div className="relative">
            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl shadow-2xl border border-white/20 dark:border-white/5 group-hover:rotate-[360deg] transition-transform duration-1000">
              {icon || '🔗'}
            </div>
            <div className={`absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full border border-white/20 shadow-lg`}>
              <div className={`w-3 h-3 rounded-full bg-${config.color}-500 animate-pulse`}></div>
            </div>
          </div>

          <div className="space-y-1.5 flex-grow">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                {name}
              </h3>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-lg border border-slate-200 dark:border-white/5">
                {category || "Internal"}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg italic">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-${config.color}-500/10 text-${config.color}-500 border border-${config.color}-500/20 shadow-lg shadow-${config.color}-500/5`}>
              {statusText}
            </span>
          </div>

          <div className="flex gap-3">
            <Link
              href={url}
              target="_blank"
              onClick={(e) => { if (!url || url === '#') e.preventDefault(); }}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-500 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-900/5 hover:-translate-y-1 transition-all group/btn"
              title="Launch Endpoint"
            >
              <ArrowUpRight className="h-5 w-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href={`/site/${id}`}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-500 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-900/5 hover:-translate-y-1 transition-all"
              title="Node Analytics"
            >
              <BarChart2 className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {}
      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-white/5">
            <Activity className="h-4 w-4 text-indigo-500" />
            <span className="text-slate-900 dark:text-slate-200 tracking-normal text-sm font-bold ml-1">{responseTime || '--'}</span>
            <span className="ml-1 opacity-50">Pulse Rate</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-white/5">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-slate-900 dark:text-slate-200 tracking-normal text-sm font-bold ml-1">{formatTime(lastChecked)}</span>
            <span className="ml-1 opacity-50">Last Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-2 group/uptime">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <div key={i} className={`w-1.5 h-6 rounded-full ${i > 2 ? 'bg-emerald-500' : 'bg-emerald-500/20'} opacity-80 group-hover/uptime:scale-y-125 transition-transform`} style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
          <div className="ml-2 flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Stability</span>
            <span className="text-xs font-bold text-emerald-500">99.98% High Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteStatusCard;
