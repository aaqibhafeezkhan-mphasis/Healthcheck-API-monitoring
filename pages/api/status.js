import { getLatestStatus, getHistory } from "../../lib/db";
import { calculateSystemHealth } from "../../lib/services/statusChecker";
import { getSpringBootServices, getSpringBootHistory, mapSpringBootToFrontend } from "../../lib/springBootApi";

export default async function handler(req, res) {
  const { siteId } = req.query;

  try {
    
    
    const sbServices = await getSpringBootServices();

    
    const sbHistory = await getSpringBootHistory();

    let sitesWithStatus;
    let source = "local";

    if (sbServices && sbServices.length >= 0) {
      
      sitesWithStatus = mapSpringBootToFrontend(sbServices, sbHistory);
      source = "spring-boot";
    } else {
      
      sitesWithStatus = getLatestStatus();
    }

    
    if (siteId) {
      const site = sitesWithStatus.find((s) => s.id === siteId);
      if (!site) {
        return res.status(404).json({ error: "Service not found" });
      }

      
      if (source === "local") {
        const allHistory = getHistory();
        site.history = allHistory.filter(h => h.serviceId === siteId);
      }
      

      return res.status(200).json({ site, source });
    }

    
    const healthMetrics = calculateSystemHealth(sitesWithStatus);

    return res.status(200).json({
      timestamp: new Date().toISOString(),
      overall: healthMetrics.status,
      metrics: healthMetrics,
      sites: sitesWithStatus,
      lastChecked: sitesWithStatus.length > 0 ? sitesWithStatus[0].lastChecked : null,
      source,
    });
  } catch (error) {
    console.error("Error in status API:", error);
    return res.status(500).json({
      error: "Failed to fetch status data",
      message: error.message,
    });
  }
}
