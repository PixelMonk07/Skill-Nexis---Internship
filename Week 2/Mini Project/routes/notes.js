import express from "express";
import { randomUUID } from "node:crypto";
import authMiddleware from "../middleware/authMiddleware.js";
import { readDB, writeDB } from "../data/store.js";

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);


// GET ALL NOTES
router.get("/", (req, res) => {
    const db = readDB();

    const userNotes = db.notes.filter(
        note => note.userId === req.user.id
    );

    res.status(200).json({
        count: userNotes.length,
        notes: userNotes
    });
});


// CREATE NOTE
router.post("/", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required."
        });
    }

    const db = readDB();

    const newNote = {
        id: randomUUID(),
        userId: req.user.id,
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    db.notes.push(newNote);
    writeDB(db);

    res.status(201).json({
        message: "Note created successfully.",
        note: newNote
    });
});


// GET SINGLE NOTE
router.get("/:id", (req, res) => {
    const db = readDB();

    const note = db.notes.find(
        note =>
            note.id === req.params.id &&
            note.userId === req.user.id
    );

    if (!note) {
        return res.status(404).json({
            message: "Note not found."
        });
    }

    res.status(200).json({ note });
});


// UPDATE NOTE
router.put("/:id", (req, res) => {
    const { title, content } = req.body;
    const db = readDB();

    const note = db.notes.find(
        note =>
            note.id === req.params.id &&
            note.userId === req.user.id
    );

    if (!note) {
        return res.status(404).json({
            message: "Note not found."
        });
    }

    if (
        typeof title !== "string" || !title.trim() ||
        typeof content !== "string" || !content.trim()
    ) {
        return res.status(400).json({
            message: "Valid title and content are required."
        });
    }

    note.title = title.trim();
    note.content = content.trim();
    note.updatedAt = new Date().toISOString();

    writeDB(db);

    res.status(200).json({
        message: "Note updated successfully.",
        note
    });
});


// DELETE NOTE
router.delete("/:id", (req, res) => {
    const db = readDB();

    const noteIndex = db.notes.findIndex(
        note =>
            note.id === req.params.id &&
            note.userId === req.user.id
    );

    if (noteIndex === -1) {
        return res.status(404).json({
            message: "Note not found."
        });
    }

    db.notes.splice(noteIndex, 1);
    writeDB(db);

    res.status(200).json({
        message: "Note deleted successfully."
    });
});

export default router;