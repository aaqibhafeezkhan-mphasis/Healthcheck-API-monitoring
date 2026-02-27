import React, { useState } from 'react';
import { Plus, X, Globe, Type, Tag, Send, Sparkles, Shield, User, AlertCircle } from 'lucide-react';

const RegisterServiceForm = ({ onServiceAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        icon: '🔗',
        category: 'API',
        owner: '',
        criticality: 'NORMAL'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            
            const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || 'http://localhost:8080';
            const res = await fetch(`${SPRING_BOOT_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceName: formData.name,
                    healthUrl: formData.url,
                    owner: formData.owner,
                    criticality: formData.criticality,
                    active: true,
                })
            });
            if (res.ok) {
                const newService = await res.json();
                onServiceAdded(newService);
                setIsOpen(false);
                setFormData({ name: '', url: '', description: '', icon: '🔗', category: 'API', owner: '', criticality: 'NORMAL' });
            } else {
                console.error('Failed to register service:', res.status, await res.text());
            }
        } catch (error) {
            console.error('Failed to register service:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-indigo-500/25 active:scale-95 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Plus className="relative z-10 w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                <span className="relative z-10">Register Node</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-fade-in" onClick={() => setIsOpen(false)}></div>

                    <div className="relative premium-card w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] border-white/10 dark:border-white/5 animate-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -z-10"></div>

                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Initialize Node</h2>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">New Surveillance Target</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Node Identifier</label>
                                        <div className="relative group">
                                            <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Service Name"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-3xl outline-none transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-400"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Target Endpoint URL</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                required
                                                type="url"
                                                placeholder="https://api.sentinel.io"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-3xl outline-none transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-400"
                                                value={formData.url}
                                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Classification</label>
                                        <div className="relative">
                                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <select
                                                className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-3xl outline-none appearance-none transition-all text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest cursor-pointer"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="API">API Node</option>
                                                <option value="Microservice">Microservice</option>
                                                <option value="Database">Database</option>
                                                <option value="Web">Web Front</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Criticality</label>
                                        <div className="relative">
                                            <AlertCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <select
                                                className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-3xl outline-none appearance-none transition-all text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest cursor-pointer"
                                                value={formData.criticality}
                                                onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                                            >
                                                <option value="NORMAL">Normal</option>
                                                <option value="HIGH">High Priority</option>
                                                <option value="CRITICAL">Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Node Asset (Icon)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-3xl outline-none transition-all text-center text-2xl"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Custodian (Owner)</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Lead Engineer or Department"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-3xl outline-none transition-all text-slate-900 dark:text-white font-bold placeholder:text-slate-400"
                                            value={formData.owner}
                                            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-4 disabled:opacity-50 relative overflow-hidden group/submit"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover/submit:opacity-100 transition-opacity"></div>
                                    {loading ? (
                                        <div className="relative z-10 w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Send className="relative z-10 w-5 h-5 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />
                                            <span className="relative z-10">Authorize Node Deployment</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterServiceForm;
