import SystemMonitoringRepository from "../models/systemMonitoringRepository.js";
import pool from "../config/db.js";

export const getSystemStats = async (req, res) => {
  try {
    const stats = await SystemMonitoringRepository.getStats(pool);
    return res.status(200).json(stats);
  } catch {
    return res.status(500).json({ message: "Error fetching system stats." });
  }
};

export const searchSystemData = async (req, res) => {
  try {
    const { funeralhome, user, deceased } = req.query;

    if (!funeralhome && !user && !deceased) {
      return res.status(400).json({
        message:
          "At least one search parameter is required: funeralhome, user or deceased",
      });
    }

    const results = await SystemMonitoringRepository.search(pool, {
      funeralhome,
      user,
      deceased,
    });

    return res.status(200).json({
      query: { funeralhome, user, deceased },
      results,
    });
  } catch (error) {
    console.error("searchSystemData error:", error);
    return res.status(500).json({ message: "Error searching system data." });
  }
};
