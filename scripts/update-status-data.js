

const fs = require('fs');
const path = require('path');
const axios = require('axios');


const API_URL = process.env.API_URL || 'http://localhost:3000/api/status';
const OUTPUT_PATH = path.join(__dirname, '../public/status-data.json');


async function fetchStatusData() {
  try {
    console.log(`Fetching status data from ${API_URL}...`);
    const response = await axios.get(API_URL, {
      params: { refresh: 'true' } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching status data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}


function saveStatusData(data) {
  try {
    
    let existingData = {};
    if (fs.existsSync(OUTPUT_PATH)) {
      const fileContent = fs.readFileSync(OUTPUT_PATH, 'utf8');
      existingData = JSON.parse(fileContent);
    }

    
    const updatedData = {
      ...data,
      historical: existingData.historical || { hourly: {}, daily: {} }
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updatedData, null, 2));
    console.log(`Status data saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error saving status data:', error.message);
    throw error;
  }
}


async function main() {
  try {
    const statusData = await fetchStatusData();
    saveStatusData(statusData);
    console.log('Status data update completed successfully.');
  } catch (error) {
    console.error('Failed to update status data:', error);
    process.exit(1);
  }
}


main();
