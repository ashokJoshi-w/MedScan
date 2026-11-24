import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Vitals from "../models/Vitals.js";

const router = express.Router();

// GET /api/vitals — all vitals for logged-in user, newest first
router.get("/", protect, async (req, res) => {
  try {
    const vitals = await Vitals.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/vitals — save a new vitals reading
router.post("/", protect, async (req, res) => {
  try {
    const { bp, heartRate, temperature, bloodSugar, weight } = req.body;

    const vitals = await Vitals.create({
      userId: req.user.id,
      bp: bp || undefined,
      heartRate: heartRate ? Number(heartRate) : undefined,
      temperature: temperature ? Number(temperature) : undefined,
      bloodSugar: bloodSugar ? Number(bloodSugar) : undefined,
      weight: weight ? Number(weight) : undefined,
    });

    res.status(201).json(vitals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/vitals/:id — delete a single vitals record
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Vitals.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Vitals record not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
