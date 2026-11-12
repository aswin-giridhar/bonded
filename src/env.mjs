// Minimal .env loader — no dependencies, so a clean clone runs with `npm start`.
import { readFileSync, existsSync } from "node:fs";

const path = new URL("../.env", import.meta.url);
if (existsSync(path)) {
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] !== "") process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

export function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in.`);
  return v;
}
