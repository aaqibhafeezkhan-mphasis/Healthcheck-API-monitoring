import React from "react";
import { RefreshCw, Clock } from "lucide-react";

const RefreshButton = ({ onRefresh, lastUpdated, isRefreshing }) => {
  const handleRefresh = async () => {
    if (isRefreshing) return;
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const formatTime = (date) => {
    if (!date) return "Never";
    try {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) { return "Never"; }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="flex flex-col items-end sm:items-start mr-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Surveillance</span>
        {lastUpdated && (
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center">
            <Clock className="h-3 w-3 mr-1 text-indigo-500" />
            <span>Last Sync: {formatTime(lastUpdated)}</span>
          </span>
        )}
      </div>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-lg shadow-sm text-white transition-all duration-200 uppercase tracking-wider ${isRefreshing
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-indigo-500/20 active:scale-95"
          }`}
        aria-label="Refresh status data"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
            Sync Data
          </>
        )}
      </button>
    </div>
  );
};

export default RefreshButton;
