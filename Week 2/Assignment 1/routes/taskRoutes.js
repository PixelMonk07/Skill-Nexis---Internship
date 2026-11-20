import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// CREATE TASK
router.post("/", async (req, res) => {

    try {

        const { title, description, priority, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required."
            });
        }

        const newTask = await Task.create({
            title,
            description,
            priority,
            dueDate
        });

        res.status(201).json({
            message: "Task created successfully!",
            task: newTask
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});

// GET ALL TASKS
router.get("/", async (req, res) => {

    try {

        const tasks = await Task.find();

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// GET SINGLE TASK
router.get("/:id", async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.status(200).json({
            task
        });

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid task ID."
            });
        }

        res.status(500).json({
            message: error.message
        });

    }

});

// UPDATE TASK
router.put("/:id", async (req, res) => {

    try {

        const { title, description, completed, priority, dueDate } = req.body;

        if (title !== undefined && (
            typeof title !== "string" || !title.trim()
        )) {
            return res.status(400).json({
                message: "Title cannot be empty."
            });
        }

        const updates = {};

        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (completed !== undefined) updates.completed = completed;
        if (priority !== undefined) updates.priority = priority;
        if (dueDate !== undefined) updates.dueDate = dueDate;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.status(200).json({
            message: "Task updated successfully!",
            task: updatedTask
        });

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid task ID."
            });
        }

        res.status(400).json({
            message: error.message
        });

    }

});

// DELETE TASK
router.delete("/:id", async (req, res) => {

    try {

        const deletedTask = await Task.findByIdAndDelete(
            req.params.id
        );

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.status(200).json({
            message: "Task deleted successfully!",
            task: deletedTask
        });

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid task ID."
            });
        }

        res.status(500).json({
            message: error.message
        });

    }

});

export default router;