

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    
    const dataFilePath = path.join(process.cwd(), 'public', 'status-data.json');

    
    if (!fs.existsSync(dataFilePath)) {
      return res.status(404).json({
        error: 'Status data not found',
        message: 'The status data file has not been generated yet. Please wait for the scheduled job to run.'
      });
    }

    
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const statusData = JSON.parse(fileContent);

    
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120'); 

    
    return res.status(200).json({
      ...statusData,
      source: 'static',
      servedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error serving static status data:', error);
    return res.status(500).json({
      error: 'Failed to serve static status data',
      message: error.message
    });
  }
}
