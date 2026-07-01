import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Report from "../models/Report.js";
import Vitals from "../models/Vitals.js";

const router = express.Router();

// GET /api/dashboard/stats
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const [reports, prescriptions, vitals] = await Promise.all([
      Report.countDocuments({ userId, type: "report" }),
      Report.countDocuments({ userId, type: "prescription" }),
      Vitals.countDocuments({ userId }),
    ]);

    res.json({
      reports,
      prescriptions,
      vitals,
      total: reports + prescriptions + vitals,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;