import React, { useState, useEffect } from 'react';
import { Settings, X, Globe, Type, Send, Server, Shield, Key, Lock, User, Link, Trash2, AlertTriangle } from 'lucide-react';
import { updateService, deleteService } from '../lib/springBootApi';

const EditServiceForm = ({ site, onServiceUpdated, onServiceDeleted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name: site.name || '',
        url: site.url || '',
        category: site.category || 'API',
        owner: site.owner || '',
        criticality: site.criticality || 'NORMAL',
        authType: site.authType || 'NONE',
        keycloakReferenceId: site.keycloakReferenceId || '',
        username: site.username || '',
        password: '', // Secrets are never sent back from the API
        apiKey: '',
        token: '',
        tokenUrl: site.tokenUrl || '',
        clientId: site.clientId || '',
        clientSecret: ''
    });

    const isMounted = React.useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedService = await updateService(site.id, {
                serviceName: formData.name,
                healthUrl: formData.url,
                owner: formData.owner,
                criticality: formData.criticality,
                category: formData.category,
                active: true,
                authType: formData.authType,
                keycloakReferenceId: formData.keycloakReferenceId,
                username: formData.username,
                password: formData.password,
                apiKey: formData.apiKey,
                token: formData.token,
                tokenUrl: formData.tokenUrl,
                clientId: formData.clientId,
                clientSecret: formData.clientSecret
            });

            if (onServiceUpdated) onServiceUpdated(updatedService);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to update service:', error);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteService(site.id);
            if (onServiceDeleted) onServiceDeleted(site.id);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to delete service:', error);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                }}
                className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 focus:outline-none transition-colors"
                aria-label="Manage service"
            >
                <Settings className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                        <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            Manage Service: {site.name}
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="px-4 py-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                    {showDeleteConfirm ? (
                                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-900/30">
                                            <div className="flex items-center mb-3">
                                                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                                                <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Confirm Deletion</h4>
                                            </div>
                                            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                                                Are you sure you want to delete this service? This action cannot be undone and all history for this service will be lost.
                                            </p>
                                            <div className="flex space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={handleDelete}
                                                    disabled={loading}
                                                    className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    {loading ? "Deleting..." : "Yes, Delete"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="inline-flex justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
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
                                                        value={formData.owner}
                                                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auth Type</label>
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Shield className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <select
                                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                            value={formData.authType}
                                                            onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                                                        >
                                                            <option value="NONE">None</option>
                                                            <option value="BASIC">Basic Auth</option>
                                                            <option value="API_KEY">API Key</option>
                                                            <option value="BEARER">Bearer Token</option>
                                                            <option value="OAUTH2">OAuth 2.0</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Security & Keycloak Configuration</h4>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keycloak Reference ID</label>
                                                        <div className="relative rounded-md shadow-sm">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Key className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                placeholder="Keycloak Client ID or User Reference"
                                                                value={formData.keycloakReferenceId}
                                                                onChange={(e) => setFormData({ ...formData, keycloakReferenceId: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {(formData.authType === 'BASIC' || formData.authType === 'API_KEY' || formData.authType === 'BEARER' || formData.authType === 'OAUTH2') && (
                                                    <p className="text-[10px] text-yellow-600 dark:text-yellow-500 mb-4 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded">
                                                        Note: For security, secrets are never sent back to the browser. Leave blank to keep existing secrets, or enter new ones to update them in Keycloak.
                                                    </p>
                                                )}

                                                {formData.authType === 'BASIC' && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                                            <div className="relative rounded-md shadow-sm">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <User className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                    value={formData.username}
                                                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                                            <div className="relative rounded-md shadow-sm">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Lock className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                                <input
                                                                    type="password"
                                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                    placeholder="Leave blank to keep current"
                                                                    value={formData.password}
                                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.authType === 'API_KEY' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New API Key</label>
                                                        <div className="relative rounded-md shadow-sm">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Key className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="password"
                                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                placeholder="Leave blank to keep current"
                                                                value={formData.apiKey}
                                                                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.authType === 'BEARER' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Static Token</label>
                                                        <div className="relative rounded-md shadow-sm">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Shield className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="password"
                                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                placeholder="Leave blank to keep current"
                                                                value={formData.token}
                                                                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.authType === 'OAUTH2' && (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Token URL</label>
                                                            <div className="relative rounded-md shadow-sm">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Link className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                                <input
                                                                    type="url"
                                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                    value={formData.tokenUrl}
                                                                    onChange={(e) => setFormData({ ...formData, tokenUrl: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                                                                <div className="relative rounded-md shadow-sm">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <User className="h-4 w-4 text-gray-400" />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                        value={formData.clientId}
                                                                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Client Secret</label>
                                                                <div className="relative rounded-md shadow-sm">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Lock className="h-4 w-4 text-gray-400" />
                                                                    </div>
                                                                    <input
                                                                        type="password"
                                                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white border py-2"
                                                                        placeholder="Leave blank to keep current"
                                                                        value={formData.clientSecret}
                                                                        onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-200 dark:border-gray-700">
                                    {!showDeleteConfirm && (
                                        <>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                            >
                                                {loading ? "Updating..." : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="w-full inline-flex justify-center rounded-md border border-red-300 dark:border-red-900 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1.5" />
                                                Delete
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditServiceForm;
