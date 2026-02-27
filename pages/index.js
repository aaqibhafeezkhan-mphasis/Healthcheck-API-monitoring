import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SystemStatus from "../components/SystemStatus";
import SiteStatusCard from "../components/SiteStatusCard";
import RegisterServiceForm from "../components/RegisterServiceForm";
import RefreshButton from "../components/RefreshButton";
import { initializeDarkMode, toggleDarkMode } from "../lib/utils";
import { getSpringBootServices, getSpringBootHistory, mapSpringBootToFrontend } from "../lib/springBootApi";
import { calculateSystemHealth } from "../lib/services/statusChecker";
import {
  ShieldCheck,
  Zap,
  LayoutGrid,
  RefreshCcw,
  Activity,
  History,
  AlertCircle
} from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [sites, setSites] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState("local");

  const isMounted = useRef(false);

  useEffect(() => {
    setDarkMode(initializeDarkMode());

    if (!isMounted.current) {
      fetchData();
      isMounted.current = true;
    }

    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (forceRefresh = false) => {
    if (refreshing) return;

    try {
      if (!sites.length) setLoading(true);
      else setRefreshing(true);

      
      const [sbServices, sbHistory] = await Promise.all([
        getSpringBootServices(),
        getSpringBootHistory(),
      ]);

      const mappedSites = mapSpringBootToFrontend(sbServices, sbHistory);
      const healthMetrics = calculateSystemHealth(mappedSites);

      setSites(mappedSites);
      setMetrics(healthMetrics);
      setLastUpdated(new Date());
      setDataSource("spring-boot");
    } catch (error) {
      console.error("Failed to fetch from Spring Boot:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleDarkMode = () => {
    toggleDarkMode(setDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""} transition-colors duration-500 relative overflow-hidden`}>
      <Head>
        <title>Sentinel | Enterprise API Health Monitoring</title>
        <meta name="description" content="Premium real-time API status monitoring and service reliability dashboard" />
      </Head>

      {}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <Header toggleTheme={handleToggleDarkMode} isDarkMode={darkMode} />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <Activity className="absolute inset-0 m-auto h-8 w-8 text-indigo-500 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Establishing Secure Connection</p>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Synchronizing Pulse...</h2>
            </div>
          </div>
        ) : (
          <>
            <section className="animate-in">
              <SystemStatus sites={sites} source={dataSource} />
            </section>

            {metrics && (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in" style={{ animationDelay: '0.1s' }}>
                <MetricCard
                  title="Global Availability"
                  value={`${metrics.operationalPercentage}%`}
                  subtitle={`${metrics.totalSites} Monitored Endpoints`}
                  icon={<ShieldCheck className="w-6 h-6" />}
                  color="emerald"
                />
                <MetricCard
                  title="Network Latency"
                  value={`${metrics.averageResponseTime}ms`}
                  subtitle="Average Response Time"
                  icon={<Zap className="w-6 h-6" />}
                  color="indigo"
                />
                <MetricCard
                  title="Active Incidents"
                  value={metrics.sitesWithIssues.length}
                  subtitle={metrics.sitesWithIssues.length === 0 ? "All Systems Nominal" : "Critical Attention Required"}
                  icon={<AlertCircle className="w-6 h-6" />}
                  color={metrics.sitesWithIssues.length > 0 ? "rose" : "slate"}
                />
              </section>
            )}

            <section className="space-y-10 animate-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <LayoutGrid className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Infrastructure Pulse</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="status-pulse bg-emerald-500"></div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Live Monitoring Active</span>
                      {dataSource === "spring-boot" && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold border border-indigo-500/20">Spring Boot API</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <RefreshButton
                    onRefresh={() => fetchData(true)}
                    lastUpdated={lastUpdated}
                    isRefreshing={refreshing}
                  />
                  <RegisterServiceForm onServiceAdded={() => fetchData(true)} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {sites.length > 0 ? (
                  sites.map((site, index) => (
                    <div key={site.id} className="animate-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <SiteStatusCard site={site} />
                    </div>
                  ))
                ) : (
                  <div className="premium-card py-24 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-full border border-dashed border-slate-300 dark:border-white/10 animate-float">
                      <History className="w-16 h-16 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Awaiting Integration</h3>
                      <p className="text-slate-500 max-w-sm mx-auto">Click 'Register New Service' to establish your first monitored endpoint or check your Spring Boot configuration.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      <style jsx global>{`
        .animate-in {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }) {
  const colorMap = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
    slate: 'text-slate-400 bg-slate-400/10'
  };

  return (
    <div className="premium-card group">
      <div className={`absolute -right-12 -bottom-12 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 ${colorMap[color].split(' ')[0]}`}></div>
      <div className="relative z-10 flex flex-col h-full space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</span>
          <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
            {icon}
          </div>
        </div>
        <div>
          <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
