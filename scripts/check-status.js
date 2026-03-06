

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DATA_DIR = path.join(__dirname, '../data');
const SERVICES_FILE = path.join(DATA_DIR, 'monitored_services.json');
const HISTORY_FILE = path.join(DATA_DIR, 'service_status_history.json');
const PUBLIC_DATA_FILE = path.join(__dirname, '../public/status-data.json');


const statusAxios = axios.create({
  timeout: 10000,
  validateStatus: status => true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});


function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(SERVICES_FILE)) fs.writeFileSync(SERVICES_FILE, JSON.stringify([]));
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
}

async function checkService(service) {
  const healthUrl = `${service.url}/actuator/health`;
  const startTime = Date.now();
  let status = 'outage';
  let statusText = 'Connection Failed';
  let responseTime = 0;
  let statusCode = null;

  try {
    console.log(`Checking ${service.name} at ${healthUrl}...`);
    const response = await statusAxios.get(healthUrl);
    responseTime = Date.now() - startTime;
    statusCode = response.status;

    
    
    if (statusCode === 200) {
      const data = response.data;
      if (data && (data.status === 'UP' || data.status === 'operational')) {
        status = 'operational';
        statusText = 'UP';
      } else if (data && (data.status === 'DOWN' || data.status === 'outage')) {
        status = 'outage';
        statusText = 'DOWN';
      } else {
        
        status = 'operational';
        statusText = 'UP (Status OK)';
      }
    } else if (statusCode >= 500) {
      status = 'outage';
      statusText = `Error ${statusCode}`;
    } else {
      status = 'degraded';
      statusText = `Warning ${statusCode}`;
    }
  } catch (err) {
    responseTime = Date.now() - startTime;
    status = 'outage';
    statusText = err.code === 'ECONNABORTED' ? 'Timeout' : 'Unreachable';
  }

  return {
    serviceId: service.id,
    serviceName: service.name,
    status,
    statusText,
    responseTime,
    timestamp: new Date().toISOString()
  };
}

async function runScheduler() {
  ensureFiles();

  const services = JSON.parse(fs.readFileSync(SERVICES_FILE, 'utf8'));
  if (services.length === 0) {
    console.log('No services registered for monitoring.');
    return;
  }

  const results = [];
  for (const service of services) {
    const result = await checkService(service);
    results.push(result);
  }

  
  const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  const updatedHistory = [...history, ...results].slice(-2000); 
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(updatedHistory, null, 2));

  
  const summary = {
    timestamp: new Date().toISOString(),
    sites: services.map(s => {
      const lastCheck = results.find(r => r.serviceId === s.id);
      return {
        ...s,
        status: lastCheck.status,
        statusText: lastCheck.statusText,
        responseTime: lastCheck.responseTime,
        lastChecked: lastCheck.timestamp
      };
    })
  };
  fs.writeFileSync(PUBLIC_DATA_FILE, JSON.stringify(summary, null, 2));

  console.log(`Completed monitoring cycle for ${services.length} services.`);
}

runScheduler().catch(err => {
  console.error('Scheduler Error:', err);
  process.exit(1);
});
