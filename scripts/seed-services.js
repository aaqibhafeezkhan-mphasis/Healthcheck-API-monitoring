

const http = require('http');

const services = [
    {
        serviceName: 'Admin Service',
        healthUrl: 'http://localhost:8088/adminservice/api/health/ping',
        owner: 'Platform Team',
        criticality: 'HIGH',
        active: true,
    },
    {
        serviceName: 'ServiceNow Integration',
        healthUrl: 'https://dev324542.service-now.com',
        owner: 'Integration Team',
        criticality: 'MEDIUM',
        active: true,
    },
    {
        serviceName: 'MySQL Database',
        healthUrl: 'http://localhost:3306',
        owner: 'DBA Team',
        criticality: 'HIGH',
        active: true,
    },
    {
        serviceName: 'Azure OpenAI',
        healthUrl: 'https://reampfoundryproject.cognitiveservices.azure.com/',
        owner: 'AI Team',
        criticality: 'MEDIUM',
        active: true,
    },
];

async function registerService(service) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(service);
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: '/services',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ Registered: ${service.serviceName} (status ${res.statusCode})`);
                    resolve(JSON.parse(body));
                } else {
                    console.error(`❌ Failed to register ${service.serviceName}: ${res.statusCode} - ${body}`);
                    resolve(null);
                }
            });
        });

        req.on('error', (err) => {
            console.error(`❌ Error registering ${service.serviceName}:`, err.message);
            resolve(null);
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('🚀 Seeding services into Health-Check_Utility API at http://localhost:8080...\n');
    for (const svc of services) {
        await registerService(svc);
    }
    console.log('\n✅ Done! Refresh your dashboard at http://localhost:3000');
}

main();
