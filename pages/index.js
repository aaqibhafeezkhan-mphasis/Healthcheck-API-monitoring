import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import SystemStatus from "../components/SystemStatus";
import SiteStatusCard from "../components/SiteStatusCard";
import RefreshButton from "../components/RefreshButton";
import RegisterServiceForm from "../components/RegisterServiceForm";
import { initializeDarkMode, toggleDarkMode } from "../lib/utils";
import { getSpringBootServices, getSpringBootHistory, triggerSpringBootRefresh, mapSpringBootToFrontend } from "../lib/springBootApi";
import { calculateSystemHealth } from "../lib/services/statusChecker";
import {
  CheckCircle,
  Clock,
  Server,
  BarChart2,
  RefreshCw,
  Activity,
} from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [sites, setSites] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const isMounted = useRef(false);

  useEffect(() => {
    setDarkMode(initializeDarkMode());

    if (!isMounted.current) {
      fetchData();
      isMounted.current = true;
    }

    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (forceRefresh = false) => {
    if (refreshing) return;

    try {
      if (!sites.length) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      if (forceRefresh) {
        await triggerSpringBootRefresh();
      }

      const [sbServices, sbHistory] = await Promise.all([
        getSpringBootServices(),
        getSpringBootHistory(),
      ]);

      const mappedSites = mapSpringBootToFrontend(sbServices, sbHistory);
      const healthMetrics = calculateSystemHealth(mappedSites);

      setSites(mappedSites);
      setMetrics(healthMetrics);
      setLastUpdated(new Date());

    } catch (error) {
      console.error("Failed to fetch status data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleDarkMode = () => {
    toggleDarkMode(setDarkMode);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""} transition-colors duration-300`}
    >
      <Head>
        <title>API Monitoring Dashboard</title>
        <meta
          name="description"
          content="Real-time status of monitored API interfaces"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <Header toggleTheme={handleToggleDarkMode} isDarkMode={darkMode} />

      <main className="flex-grow py-4 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <SystemStatus sites={sites} />

              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <CheckCircle
                        className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Operational
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.operationalPercentage}%
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {metrics.totalSites} monitored sites
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <Clock
                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Avg Response Time
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.averageResponseTime} ms
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        For operational sites
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex items-center">
                    <div className="bg-red-100 dark:bg-red-900/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <Server
                        className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Sites with Issues
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.sitesWithIssues.length}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {metrics.sitesWithIssues.length > 0
                          ? "Requires attention"
                          : "All systems operational"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <BarChart2
                      className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 mr-2"
                      strokeWidth={2}
                    />
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        Site Status
                      </h2>
                      <Link
                        href="/sites"
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        (View All)
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <RegisterServiceForm onServiceAdded={() => fetchData(true)} />
                    <RefreshButton
                      onRefresh={() => fetchData(true)}
                      lastUpdated={lastUpdated}
                      isRefreshing={refreshing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-5">
                  {sites.length > 0 ? (
                    sites.map((site, index) => (
                      <SiteStatusCard
                        key={site.id}
                        site={site}
                        onServiceUpdated={() => fetchData()}
                        onServiceDeleted={() => fetchData()}
                        className={
                          index % 2 === 0
                            ? "transform hover:-translate-y-1"
                            : "transform hover:translate-y-1"
                        }
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <RefreshCw className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-center text-base sm:text-lg">
                        No sites found.
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-center text-xs sm:text-sm mt-1">
                        Try adding a service to begin monitoring
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
