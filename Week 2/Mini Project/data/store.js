import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(dirname, "db.json");

export function readDB() {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

export function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}