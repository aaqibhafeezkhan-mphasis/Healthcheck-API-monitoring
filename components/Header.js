import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Moon,
  Sun,
  Bell,
  Settings,
  Network,
  Cpu,
  Fingerprint,
  Activity
} from "lucide-react";

export default function Header({ toggleTheme, isDarkMode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? "py-3 px-4"
          : "py-6 px-4"
        }`}
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg-main to-transparent pointer-events-none -z-10"></div>

      <div className={`max-w-7xl mx-auto rounded-3xl transition-all duration-500 ${scrolled
          ? "glass-panel px-6 py-2 shadow-2xl scale-[0.99] border-white/20 dark:border-white/10"
          : "px-2 bg-transparent"
        }`}>
        <div className="flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                SENTINEL
              </span>
              <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] mt-1">
                Security Node
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 px-8 py-2 bg-slate-900/5 dark:bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <NavLink href="/" icon={<Network className="w-4 h-4" />} label="Network" active />
            <NavLink href="#" icon={<Cpu className="w-4 h-4" />} label="Core" />
            <NavLink href="#" icon={<Fingerprint className="w-4 h-4" />} label="Audit" />
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-3 text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-2xl transition-all duration-300 relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <button className="hidden sm:block p-3 text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-2xl transition-all duration-300">
              <Settings className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1"></div>

            <button
              onClick={toggleTheme}
              className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-slate-900/10"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, icon, label, active = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:text-indigo-500 ${active
          ? "text-indigo-500"
          : "text-slate-500 dark:text-slate-400"
        }`}
    >
      {icon}
      <span>{label}</span>
      {active && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"></div>}
    </Link>
  );
}
