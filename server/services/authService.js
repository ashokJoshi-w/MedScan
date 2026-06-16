const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── In-memory user store (replace with your DB) ───────────────────────────
// Example with MongoDB/Mongoose — swap the functions below with real DB calls.
const users = new Map(); // email → user object

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// ─── signup ────────────────────────────────────────────────────────────────
const signup = async ({ name, email, password, role = "doctor" }) => {
  const normalizedEmail = email.toLowerCase().trim();

  if (users.has(normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);

  const token = generateToken(user.id);
  return { user: safeUser(user), token };
};

// ─── login ────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.get(normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user.id);
  return { user: safeUser(user), token };
};

// ─── getMe ────────────────────────────────────────────────────────────────
const getMe = async (userId) => {
  for (const user of users.values()) {
    if (user.id === userId) return safeUser(user);
  }
  throw new Error("User not found.");
};

module.exports = { signup, login, getMe };

// ────────────────────────────────────────────────────────────────────────────
// MONGOOSE EXAMPLE — replace the Map above with these if using MongoDB:
//
// const User = require("../models/User");
//
// const signup = async ({ name, email, password, role }) => {
//   const exists = await User.findOne({ email: email.toLowerCase() });
//   if (exists) throw new Error("An account with this email already exists.");
//   const user = await User.create({ name, email: email.toLowerCase(), password, role });
//   const token = generateToken(user._id);
//   return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
// };
//
// const login = async ({ email, password }) => {
//   const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
//   if (!user || !(await user.comparePassword(password)))
//     throw new Error("Invalid email or password.");
//   const token = generateToken(user._id);
//   return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
// };
