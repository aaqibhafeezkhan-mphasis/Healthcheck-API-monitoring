import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SiteStatusCard from "../components/SiteStatusCard";
import RefreshButton from "../components/RefreshButton";
import RegisterServiceForm from "../components/RegisterServiceForm";
import { initializeDarkMode, toggleDarkMode } from "../lib/utils";
import { getSpringBootServices, getSpringBootHistory, triggerSpringBootRefresh, mapSpringBootToFrontend } from "../lib/springBootApi";
import {
    BarChart2,
    RefreshCw
} from "lucide-react";

export default function Sites() {
    const [darkMode, setDarkMode] = useState(false);
    const [sites, setSites] = useState([]);
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

        const interval = setInterval(fetchData, 30000);
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

            setSites(mappedSites);
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
                <title>Site Status | API Monitoring</title>
                <meta
                    name="description"
                    content="Detailed list of monitored API site statuses"
                />
            </Head>

            <Header toggleTheme={handleToggleDarkMode} isDarkMode={darkMode} />

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <div className="flex items-center mb-3 sm:mb-0">
                                <BarChart2
                                    className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2"
                                    strokeWidth={2}
                                />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Site Status List
                                </h2>
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

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5">
                                {sites.length > 0 ? (
                                    sites.map((site) => (
                                        <SiteStatusCard
                                            key={site.id}
                                            site={site}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <RefreshCw className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                                            No sites found.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
