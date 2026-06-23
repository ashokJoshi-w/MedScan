import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const BASE = "http://localhost:3001";

async function req(url, opts = {}) {
  const res = await fetch(`${BASE}${url}`, opts);
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function main() {
  console.log("1. Signup...");
  const signup = await req("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test", email: "test2@test.com", password: "password123" }),
  });
  console.log("   status:", signup.status, signup.status === 201 ? "OK" : signup.body);

  console.log("2. Analyze without token...");
  const noAuth = await req("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "prescription", textInput: "Tab Paracetamol 500mg" }),
  });
  console.log("   status:", noAuth.status, "expected 401:", noAuth.status === 401);

  const token = signup.body.token;
  console.log("3. Analyze with token...");
  const withAuth = await req("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mode: "prescription", textInput: "Tab Paracetamol 500mg TDS x 3 days" }),
  });
  console.log("   status:", withAuth.status);
  if (withAuth.status !== 200) console.log("   error:", withAuth.body.error || withAuth.body.message);

  const usersFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "server/data/users.json");
  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  console.log("4. Users persisted:", users.length, "user(s)");
}

main().catch((e) => console.error("FAIL:", e.message));
