import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = express.Router();
const dirname = path.dirname(fileURLToPath(import.meta.url));

router.get(/^\/(?:index(?:\.html)?)?\/?$/, (_req, res) => {
    res.sendFile(path.join(dirname, "..", "views", "index.html"));
});

export default router;