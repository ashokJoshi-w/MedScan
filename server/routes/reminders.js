import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Reminder from "../models/Reminder.js";

const router = express.Router();

// GET /api/reminders — all reminders for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reminders — create a new reminder
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }
    const reminder = await Reminder.create({
      userId: req.user.id,
      title: title.trim(),
      description: description || "",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/reminders/:id — update a reminder (toggle active, edit title/desc)
router.patch("/:id", protect, async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    const update = {};
    if (title !== undefined) update.title = title.trim();
    if (description !== undefined) update.description = description;
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true, runValidators: true }
    );
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(reminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/reminders/:id — delete a reminder
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
