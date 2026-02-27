

import axios from 'axios';
import https from 'https';


const statusAxios = axios.create({
  timeout: 10000, 
  validateStatus: status => true, 
  httpsAgent: new https.Agent({
    rejectUnauthorized: false 
  })
});


export async function checkSiteStatus(site) {
  const startTime = Date.now();
  let status = 'operational';
  let statusText = 'Operational';
  let statusCode = null;
  let responseTime = null;
  let error = null;

  try {
    
    const response = await statusAxios.get(site.url, {
      timeout: 5000 
    });

    
    responseTime = Date.now() - startTime;

    
    statusCode = response.status;

    
    if (statusCode >= 500) {
      status = 'outage';
      statusText = 'Server Error';
    } else if (statusCode >= 400) {
      status = 'degraded';
      statusText = 'Client Error';
    } else if (responseTime > 3000) {
      status = 'degraded';
      statusText = 'Slow Response';
    } else if (statusCode >= 200 && statusCode < 300) {
      status = 'operational';
      statusText = 'Operational';
    } else {
      status = 'degraded';
      statusText = 'Unusual Response';
    }
  } catch (err) {
    
    error = err.message || 'Connection error';
    status = 'outage';
    statusText = 'Connection Failed';
    responseTime = Date.now() - startTime;
  }

  
  return {
    id: site.id,
    name: site.name,
    url: site.url,
    icon: site.icon,
    description: site.description,
    status,
    statusText,
    statusCode,
    responseTime,
    error,
    lastChecked: new Date(),
  };
}


export async function checkAllSites(sites) {
  try {
    const statusPromises = sites.map(site => checkSiteStatus(site));
    return await Promise.all(statusPromises);
  } catch (error) {
    console.error('Error checking sites:', error);
    return [];
  }
}


export function getSiteHistory(siteId) {
  
  

  const now = Date.now();
  const hourInMs = 3600000;
  const dayInMs = 86400000;

  
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const timestamp = new Date(now - (23 - i) * hourInMs);

    
    const status = Math.random() > 0.9 ? 'degraded' : 'operational';

    
    const responseTime = Math.floor(Math.random() * 400) + 100;

    return {
      timestamp,
      status,
      responseTime
    };
  });

  
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const timestamp = new Date(now - (29 - i) * dayInMs);

    
    const uptime = 99 + Math.random();

    
    const avgResponseTime = Math.floor(Math.random() * 200) + 150;

    return {
      timestamp,
      uptime,
      avgResponseTime
    };
  });

  return {
    hourlyData,
    dailyData
  };
}


export function calculateSystemHealth(siteStatuses) {
  if (!siteStatuses || siteStatuses.length === 0) {
    return {
      status: 'unknown',
      operationalPercentage: 0,
      averageResponseTime: 0,
      sitesWithIssues: []
    };
  }

  const operationalCount = siteStatuses.filter(site => site.status === 'operational').length;
  const operationalPercentage = Math.round((operationalCount / siteStatuses.length) * 100);

  
  const operationalSites = siteStatuses.filter(site => site.status === 'operational');
  const totalResponseTime = operationalSites.reduce((sum, site) => sum + (site.responseTime || 0), 0);
  const averageResponseTime = operationalSites.length > 0
    ? Math.round(totalResponseTime / operationalSites.length)
    : 0;

  
  const sitesWithIssues = siteStatuses
    .filter(site => site.status !== 'operational')
    .map(site => ({
      id: site.id,
      name: site.name,
      status: site.status,
      statusText: site.statusText
    }));

  
  let status = 'operational';
  if (siteStatuses.some(site => site.status === 'outage')) {
    status = 'outage';
  } else if (siteStatuses.some(site => site.status === 'degraded')) {
    status = 'degraded';
  }

  return {
    status,
    operationalPercentage,
    averageResponseTime,
    sitesWithIssues,
    totalSites: siteStatuses.length
  };
}
