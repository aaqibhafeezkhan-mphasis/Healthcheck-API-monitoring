import React from "react";
import { Github, Heart, Shield, Terminal, Zap, Cpu, Globe } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 pb-12 overflow-hidden">
      {}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20"></div>
                <div className="relative p-2.5 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-500/20">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                  SENTINEL
                </h2>
                <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] mt-1">
                  Autonomous Monitoring Group
                </span>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed italic">
              Advanced infrastructure surveillance and real-time health diagnostics for enterprise-scale application ecosystems.
              Built for reliability, designed for speed.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <FooterBadge icon={<Zap className="w-3 h-3 text-amber-500" />} label="Hyper-Sync" />
              <FooterBadge icon={<Cpu className="w-3 h-3 text-indigo-500" />} label="Neural Edge" />
              <FooterBadge icon={<Globe className="w-3 h-3 text-emerald-500" />} label="Global Mesh" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-10">
            <div className="flex gap-4">
              <SocialLink href="https://github.com/aaqibhafeezkhan-mphasis/Healthcheck-API-monitoring" icon={<Github className="w-6 h-6" />} />
              <SocialLink href="#" icon={<Terminal className="w-6 h-6" />} />
            </div>

            <div className="text-center md:text-right space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                System Status: Operational
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                © {year} Sentinel Monitoring Systems
              </p>
              <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center md:justify-end gap-2">
                Engineered with <Heart className="h-3 w-3 text-rose-500 fill-current" /> by the DeepMind Core Team
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="hover:text-indigo-500 cursor-pointer transition-colors">Security Protocol</span>
            <span className="hover:text-indigo-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-indigo-500 cursor-pointer transition-colors">Audit Logs</span>
          </div>
          <div className="px-3 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-widest">
            Build REL-02.94-STABLE
          </div>
        </div>
      </div>
    </footer>
  );
};

function FooterBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-all hover:border-indigo-500/30">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 hover:-translate-y-1 transition-all shadow-xl shadow-slate-900/5"
    >
      {icon}
    </a>
  );
}

export default Footer;
