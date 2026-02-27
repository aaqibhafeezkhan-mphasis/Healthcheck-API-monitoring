import React from "react";
import { RefreshCcw, Clock, Zap } from "lucide-react";

const RefreshButton = ({ onRefresh, lastUpdated, isRefreshing }) => {
  const formatTime = (date) => {
    if (!date) return "--:--";
    try {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) { return "--:--"; }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">Last Data Sync</span>
        <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
          {isRefreshing ? (
            <span className="flex items-center gap-1.5 text-indigo-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Syncing...
            </span>
          ) : (
            <>
              <Zap className="w-3 h-3 text-indigo-500 fill-current" />
              {formatTime(lastUpdated)}
            </>
          )}
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`relative p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:border-indigo-500/30 transition-all active:scale-90 shadow-xl shadow-slate-900/5 disabled:opacity-50 group overflow-hidden`}
      >
        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <RefreshCcw className={`relative z-10 w-5 h-5 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
      </button>
    </div>
  );
};

export default RefreshButton;
