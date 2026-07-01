import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Report from "../models/Report.js";

const router = express.Router();

// GET /api/reports — all reports for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reports/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    await Report.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;