import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ← MongoDB model

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const safeUser = (user) => ({
  id: user._id,        // ← MongoDB uses _id not id
  name: user.name,
  email: user.email,
  role: user.role,
  plan: user.plan,
  createdAt: user.createdAt,
});

const signup = async ({ name, email, password, role = "doctor" }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check duplicate
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: passwordHash,
    role,
  });

  const token = generateToken(user._id);
  return { user: safeUser(user), token };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user._id);
  return { user: safeUser(user), token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  return safeUser(user);
};

export { signup, login, getMe };