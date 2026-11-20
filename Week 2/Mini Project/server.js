import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import rootRouter from "./routes/root.js";
import authRouter from "./routes/auth.js";
import notesRouter from "./routes/notes.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(dirname, "public")));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);

// Homepage
app.use("/", rootRouter);

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            message: "API endpoint not found."
        });
    }

    res.status(404);

    if (req.accepts("html")) {
        res.sendFile(path.join(dirname, "views", "404.html"));
    } else {
        res.json({ message: "404 Not Found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});