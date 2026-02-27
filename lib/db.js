import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SERVICES_FILE = path.join(DATA_DIR, 'monitored_services.json');
const HISTORY_FILE = path.join(DATA_DIR, 'service_status_history.json');


export const initDb = () => {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SERVICES_FILE)) {
        fs.writeFileSync(SERVICES_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(HISTORY_FILE)) {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
    }
};

export const getServices = () => {
    initDb();
    const data = fs.readFileSync(SERVICES_FILE, 'utf8');
    return JSON.parse(data);
};

export const saveService = (service) => {
    initDb();
    const services = getServices();
    const newService = {
        id: service.id || Math.random().toString(36).substr(2, 9),
        name: service.name,
        url: service.url,
        description: service.description || '',
        icon: service.icon || '🔗',
        category: service.category || 'API',
        createdAt: new Date().toISOString()
    };
    services.push(newService);
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2));
    return newService;
};

export const getHistory = () => {
    initDb();
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
};

export const saveHistoryBatch = (batch) => {
    initDb();
    const history = getHistory();
    const updatedHistory = [...history, ...batch];

    
    const trimmedHistory = updatedHistory.slice(-1000);

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmedHistory, null, 2));
};

export const getLatestStatus = () => {
    const history = getHistory();
    const services = getServices();

    return services.map(service => {
        const serviceHistory = history
            .filter(h => h.serviceId === service.id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const lastCheck = serviceHistory[0] || {};

        return {
            ...service,
            status: lastCheck.status || 'unknown',
            statusText: lastCheck.statusText || 'Pending Check',
            responseTime: lastCheck.responseTime || 0,
            lastChecked: lastCheck.timestamp || null
        };
    });
};
