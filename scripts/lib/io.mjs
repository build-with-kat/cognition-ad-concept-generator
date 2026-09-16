import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(new URL("../..", import.meta.url).pathname);

export function readInput(name) {
  return fs.readFileSync(path.join(ROOT, "inputs", name), "utf8");
}

export function readStage(name) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "data", "stages", name), "utf8"));
}

export function writeStage(name, value) {
  const dir = path.join(ROOT, "data", "stages");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), JSON.stringify(value, null, 2));
  console.log(`wrote data/stages/${name}`);
}

export function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`no JSON object in model output:\n${text.slice(0, 500)}`);
  return JSON.parse(raw.slice(start, end + 1));
}

export function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`\nMISSING SECRET: ${name}. Set it and re-run. Refusing to ship fake ads.\n`);
    process.exit(1);
  }
  return v;
}
