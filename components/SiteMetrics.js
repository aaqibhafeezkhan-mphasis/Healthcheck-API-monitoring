import React from 'react';
import { Activity, Clock, Server, Monitor, ShieldCheck, ShieldAlert, ShieldX, Database } from 'lucide-react';

const SiteMetrics = ({ site }) => {
  if (!site) return null;

  const { responseTime, status, lastChecked } = site;

  const health = {
    operational: {
      icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
      text: 'NODE SECURED',
      color: 'emerald',
      label: 'Operational'
    },
    degraded: {
      icon: <ShieldAlert className="h-8 w-8 text-amber-500" />,
      text: 'DEGRADED FEED',
      color: 'amber',
      label: 'Performance Lag'
    },
    outage: {
      icon: <ShieldX className="h-8 w-8 text-rose-500" />,
      text: 'NODE DOWN',
      color: 'rose',
      label: 'Critical Outage'
    }
  }[status] || {
    icon: <Activity className="h-8 w-8 text-slate-500" />,
    text: 'UNKNOWN STATUS',
    color: 'slate',
    label: 'Checking...'
  };

  const getResponseIndicator = (time) => {
    if (!time) return { color: 'bg-slate-200 dark:bg-slate-700', text: 'Stalled', theme: 'slate' };
    if (time < 200) return { color: 'bg-emerald-500', text: 'Lightning', theme: 'emerald' };
    if (time < 500) return { color: 'bg-indigo-500', text: 'Optimal', theme: 'indigo' };
    if (time < 1000) return { color: 'bg-amber-500', text: 'Delayed', theme: 'amber' };
    return { color: 'bg-rose-500', text: 'Critical', theme: 'rose' };
  };

  const resInd = getResponseIndicator(responseTime);

  const formatTime = (date) => {
    if (!date) return 'Inactive';
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="premium-card space-y-10 group">
      <div className="flex items-center gap-3">
        <Server className="w-5 h-5 text-indigo-500" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Node Surveillance
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {}
        <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden transition-all hover:bg-white dark:hover:bg-white/10 group/item">
          <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] blur-2xl group-hover/item:scale-150 transition-transform duration-700"></div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Integrity Status</div>
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-${health.color}-500/10 border border-${health.color}-500/20`}>
              {health.icon}
            </div>
            <div>
              <div className={`text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight`}>
                {health.text}
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest mt-1 text-${health.color}-500`}>
                {health.label}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden group/item">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-${resInd.theme}-500/5 blur-2xl`}></div>
          <div className="flex justify-between items-center mb-6">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Signal Latency</div>
            <div className={`text-sm font-black text-slate-900 dark:text-white`}>{responseTime || '--'} ms</div>
          </div>
          <div className="relative h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full ${resInd.color} rounded-full transition-all duration-[1500ms] ease-out shadow-lg`}
              style={{ width: `${Math.min(100, (responseTime || 0) / 10)}%` }}
            ></div>
          </div>
          <div className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] flex justify-between">
            <span className="flex items-center gap-1.5"><Activity className={`w-3 h-3 text-${resInd.theme}-500`} /> Level: {resInd.text}</span>
            <span>Ref: 10s Window</span>
          </div>
        </div>

        {}
        <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Clock className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Authorization Sync</div>
            <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatTime(lastChecked)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMetrics;
