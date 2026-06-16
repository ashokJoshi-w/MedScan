const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
} = require("../services/authService");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    const result = await signup({ name, email, password, role });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const result = await login({ email, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// GET /api/auth/me  (protected)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await getMe(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;