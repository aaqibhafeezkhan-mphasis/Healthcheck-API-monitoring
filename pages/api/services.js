import { getServices, saveService } from '../../lib/db';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { name, url, description, icon, category } = req.body;

        if (!name || !url) {
            return res.status(400).json({ error: 'Name and URL are required' });
        }

        
        const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

        try {
            const newService = saveService({
                name,
                url: cleanUrl,
                description,
                icon,
                category
            });
            return res.status(201).json(newService);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to save service', message: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const services = getServices();
            return res.status(200).json(services);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch services', message: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
