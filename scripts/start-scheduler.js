

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHECK_INTERVAL = 60 * 1000; 

function runChecker() {
    console.log(`[${new Date().toISOString()}] Starting health check cycle...`);

    const child = spawn('node', [path.join(__dirname, 'check-status.js')], {
        stdio: 'inherit'
    });

    child.on('close', (code) => {
        console.log(`[${new Date().toISOString()}] Cycle finished with code ${code}. Next check in 60s.`);
        setTimeout(runChecker, CHECK_INTERVAL);
    });
}

console.log('API Monitoring Scheduler started. Checking every 60 seconds.');
runChecker();
