import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "../data/users.json");

const users = new Map();

const loadUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) return;
    const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    for (const user of data) {
      users.set(user.email, user);
    }
  } catch (err) {
    console.error("Failed to load users:", err.message);
  }
};

const saveUsers = () => {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify([...users.values()], null, 2));
};

loadUsers();

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
  saveUsers();

  const token = generateToken(user.id);
  return { user: safeUser(user), token };
};

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

const getMe = async (userId) => {
  for (const user of users.values()) {
    if (user.id === userId) return safeUser(user);
  }
  throw new Error("User not found.");
};

export { signup, login, getMe };
