

import axios from 'axios';


export async function fetchStatusData({ preferStatic = false, refresh = false } = {}) {
  
  const realTimeEndpoint = '/api/status';
  const staticEndpoint = '/api/static-status';

  
  const primaryEndpoint = preferStatic ? staticEndpoint : realTimeEndpoint;
  const fallbackEndpoint = preferStatic ? realTimeEndpoint : staticEndpoint;

  try {
    
    const response = await axios.get(primaryEndpoint, {
      params: { refresh },
      timeout: 5000 
    });

    return {
      ...response.data,
      source: response.data.source || (preferStatic ? 'static' : 'real-time'),
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Failed to fetch from ${primaryEndpoint}, trying fallback`, error.message);

    try {
      
      const fallbackResponse = await axios.get(fallbackEndpoint, {
        timeout: 5000 
      });

      return {
        ...fallbackResponse.data,
        source: fallbackResponse.data.source || (preferStatic ? 'real-time' : 'static'),
        fetchedAt: new Date().toISOString(),
        usingFallback: true
      };
    } catch (fallbackError) {
      console.error('Failed to fetch status data from both endpoints', fallbackError.message);
      throw new Error('Failed to fetch status data');
    }
  }
}


export async function fetchSiteHistory(siteId) {
  try {
    
    const response = await axios.get('/api/static-status');

    if (response.data && response.data.historical) {
      const { hourly, daily } = response.data.historical;

      
      const siteHourly = hourly[siteId] || {};
      const siteDaily = daily[siteId] || {};

      
      const hourlyData = Object.entries(siteHourly).map(([timestamp, data]) => ({
        timestamp,
        ...data
      })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const dailyData = Object.entries(siteDaily).map(([date, data]) => ({
        date,
        ...data
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        hourlyData,
        dailyData
      };
    }

    
    const historyResponse = await axios.get(`/api/status`, {
      params: { siteId }
    });

    return historyResponse.data.history || { hourlyData: [], dailyData: [] };
  } catch (error) {
    console.error(`Error fetching history for site ${siteId}:`, error);
    return { hourlyData: [], dailyData: [] };
  }
}


export function calculateAvailability(historicalData) {
  if (!historicalData || !historicalData.hourlyData || historicalData.hourlyData.length === 0) {
    return 100; 
  }

  const hourlyData = historicalData.hourlyData;
  const operationalCount = hourlyData.filter(data =>
    data.status === 'operational'
  ).length;

  return Math.round((operationalCount / hourlyData.length) * 100);
}


export function formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown';

  try {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return timestamp;
  }
}
