import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SiteMetrics from '../../components/SiteMetrics';
import HistoricalChart from '../../components/HistoricalChart';
import { getSiteHistory } from '../../lib/services/statusChecker';
import { initializeDarkMode, toggleDarkMode } from '../../lib/utils';
import { getSpringBootServices, getSpringBootHistory, mapSpringBootToFrontend } from '../../lib/springBootApi';
import { calculateSystemHealth } from '../../lib/services/statusChecker';
import { ArrowLeft, ExternalLink, Activity, Clock, Shield, Network, Zap, Cpu } from 'lucide-react';
import axios from 'axios';

export default function SiteDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [darkMode, setDarkMode] = useState(false);
  const [site, setSite] = useState(null);
  const [siteHistory, setSiteHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(false);

  useEffect(() => {
    setDarkMode(initializeDarkMode());
  }, []);

  useEffect(() => {
    if (!id || isMounted.current) return;

    const fetchSiteData = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const [sbServices, sbHistory] = await Promise.all([
          getSpringBootServices(),
          getSpringBootHistory(),
        ]);

        if (!sbServices) {
          throw new Error('Could not connect to Sentinel Node');
        }

        const mappedSites = mapSpringBootToFrontend(sbServices, sbHistory);
        const targetSite = mappedSites.find(s => s.id === id);

        if (!targetSite) {
          setError('Synchronisation with node failed.');
          return;
        }

        setSite(targetSite);

        if (targetSite.history && targetSite.history.length > 0) {
          setSiteHistory({
            hourlyData: targetSite.history,
            dailyData: []
          });
        }
      } catch (err) {
        console.error('Error fetching site data:', err);
        setError('Synchronisation with node failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
    isMounted.current = true;
  }, [id]);

  const handleToggleDarkMode = () => {
    toggleDarkMode(setDarkMode);
  };

  if (!id) return null;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''} transition-colors duration-500 relative overflow-hidden`}>
      <Head>
        <title>{site ? `${site.name} | Sentinel Intelligence` : 'Node Pulse...'}</title>
      </Head>

      {}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <Header toggleTheme={handleToggleDarkMode} isDarkMode={darkMode} />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in">
          <Link href="/" className="group flex items-center gap-4 px-6 py-3 rounded-2xl glass-panel text-slate-500 hover:text-indigo-500 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:border-indigo-500/30">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Hub
          </Link>

          {site && (
            <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Secure Live Stream</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <Activity className="absolute inset-0 m-auto h-10 w-10 text-indigo-500 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Encrypted Node</p>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Initializing Connection...</h2>
            </div>
          </div>
        ) : error ? (
          <div className="premium-card border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-8 animate-in">
            <div className="mx-auto w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center border border-rose-500/20 shadow-2xl shadow-rose-500/10">
              <Activity className="w-12 h-12 text-rose-500" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Connection Terminated</h2>
              <p className="text-slate-500 font-medium italic text-lg">{error}</p>
            </div>
            <button onClick={() => router.reload()} className="px-8 py-4 bg-rose-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-rose-500/25 active:scale-95 transition-all">Retry Handshake</button>
          </div>
        ) : site ? (
          <div className="space-y-12 animate-in">
            {}
            <div className="premium-card p-10 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]"></div>

              <div className="flex flex-col md:flex-row items-center gap-10 flex-grow text-center md:text-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10"></div>
                  <div className="relative h-32 w-32 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl border border-white/20 dark:border-white/5 group-hover:rotate-6 transition-transform duration-500">
                    {site.icon}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                      {site.name}
                    </h1>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-500/20">
                      {site.category || "Sentinel Node"}
                    </span>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xl max-w-2xl leading-relaxed italic">
                    {site.description}
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-indigo-500 hover:border-indigo-500/30 transition-all border border-transparent">
                      <Network className="w-4 h-4" />
                      {new URL(site.url).hostname}
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-50" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                <StatCard label="CORE PULSE" value={`${site.responseTime}ms`} icon={<Zap className="w-4 h-4 text-indigo-500" />} />
                <StatCard label="UPTIME" value="99.98%" icon={<Shield className="w-4 h-4 text-emerald-500" />} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-12">
                <SiteMetrics site={site} />

                <div className="premium-card p-10 space-y-8 group/security">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Parameters</h3>
                  <div className="space-y-4">
                    <SecurityItem icon={<Shield className="text-emerald-500" />} label="SSL PROTOCOL" value="SECURE" />
                    <SecurityItem icon={<Cpu className="text-indigo-500" />} label="ENCRYPTION" value="AES-256" />
                    <SecurityItem icon={<Clock className="text-amber-500" />} label="SYNC" value="REAL-TIME" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <HistoricalChart
                  siteHistory={siteHistory}
                  siteId={id}
                  siteName={site.name}
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />

      <style jsx global>{`
        .animate-in {
            opacity: 0;
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-3 min-w-[160px] text-center md:text-left group/stat">
      <div className="flex items-center justify-center md:justify-start gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        {icon}
        {label}
      </div>
      <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:scale-110 transition-transform origin-left">{value}</div>
    </div>
  );
}

function SecurityItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">{icon}</div>
        <span className="text-[10px] font-black text-slate-400 tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-black text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
