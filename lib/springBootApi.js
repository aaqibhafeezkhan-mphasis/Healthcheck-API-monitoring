import axios from 'axios';


const SPRING_BOOT_BASE_URL = process.env.SPRING_BOOT_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: SPRING_BOOT_BASE_URL,
    timeout: 10000,
});


export const getSpringBootServices = async () => {
    try {
        const response = await api.get('/services');
        return response.data;
    } catch (error) {
        console.error('Error fetching /services from Health-Check_Utility:', error.message);
        return null;
    }
};


export const getSpringBootHistory = async () => {
    try {
        const response = await api.get('/monitor/history');
        return response.data;
    } catch (error) {
        console.error('Error fetching /monitor/history from Health-Check_Utility:', error.message);
        return null;
    }
};


export const mapSpringBootToFrontend = (services, history) => {
    if (!services || services.length === 0) return [];

    return services.map(svc => {
        
        const svcHistory = history
            ? history
                .filter(h => h.serviceId === svc.id)
                .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
            : [];

        
        const latest = svcHistory[0] || {};

        const status = latest.status === 'UP'
            ? 'operational'
            : latest.status === 'DOWN'
                ? 'outage'
                : 'unknown';

        const statusText = latest.status === 'UP'
            ? 'Operational'
            : latest.status === 'DOWN'
                ? 'Service Down'
                : 'Checking...';

        return {
            id: svc.id.toString(),
            name: svc.serviceName,
            url: svc.healthUrl,
            description: `Owner: ${svc.owner || 'System'} | Criticality: ${svc.criticality || 'Normal'}`,
            icon: svc.criticality === 'HIGH'
                ? '🚨'
                : svc.serviceName.toLowerCase().includes('db') || svc.serviceName.toLowerCase().includes('data')
                    ? '🗄️'
                    : '🔗',
            category: svc.criticality || 'API',
            status,
            statusText,
            responseTime: latest.responseTime || 0,
            lastChecked: latest.checkedAt || null,
            history: svcHistory.map(h => ({
                status: h.status === 'UP' ? 'operational' : 'outage',
                responseTime: h.responseTime,
                timestamp: h.checkedAt,
            })),
        };
    });
};
