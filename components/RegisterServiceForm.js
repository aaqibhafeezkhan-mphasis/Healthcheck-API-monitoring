import React, { useState } from 'react';
import { Plus, X, Globe, Type, Send, Server } from 'lucide-react';
import { registerService } from '../lib/springBootApi';

const RegisterServiceForm = ({ onServiceAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        category: 'API',
        owner: '',
        criticality: 'NORMAL'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newService = await registerService({
                serviceName: formData.name,
                healthUrl: formData.url,
                owner: formData.owner,
                criticality: formData.criticality,
                category: formData.category,
                active: true,
            });

            onServiceAdded(newService);
            setIsOpen(false);
            setFormData({ name: '', url: '', description: '', category: 'API', owner: '', criticality: 'NORMAL' });
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
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-600 text-xs sm:text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Register service node"
            >
                <Plus className="-ml-1 mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Add Service
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 sm:mx-0 sm:h-10 sm:w-10">
                                        <Server className="h-6 w-6 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                            Register New Service
                                        </h3>
                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <p>Add a new API endpoint or site to monitor its status and latency.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="px-4 py-5 sm:p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Type className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    required
                                                    type="text"
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                    placeholder="E.g. Authentication API"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Health URL</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Globe className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    required
                                                    type="url"
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                    placeholder="https://api.example.com/health"
                                                    value={formData.url}
                                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                            <select
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2 px-3"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="API">API Engine</option>
                                                <option value="Database">Database</option>
                                                <option value="App">Application</option>
                                                <option value="External">External Integration</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                            <select
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2 px-3"
                                                value={formData.criticality}
                                                onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                                            >
                                                <option value="NORMAL">Normal</option>
                                                <option value="HIGH">High</option>
                                                <option value="CRITICAL">Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team / Owner</label>
                                            <input
                                                type="text"
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2 px-3"
                                                placeholder="e.g. Core Engineering"
                                                value={formData.owner}
                                                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {loading ? "Registering..." : "Add Service"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterServiceForm;
