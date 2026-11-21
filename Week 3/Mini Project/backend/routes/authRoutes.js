import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function createToken(userId) {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "development-secret",
        { expiresIn: "7d" }
    );
}

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "Name, email and password are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existing = await User.findOne({ email: email.trim().toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "An account with that email already exists." });
        }

        const user = await User.create({ name: name.trim(), email: email.trim(), password });
        res.status(201).json({
            message: "Registration successful.",
            token: createToken(user._id),
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.json({
            token: createToken(user._id),
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/profile", requireAuth, (req, res) => {
    res.json({
        user: { id: req.user._id, name: req.user.name, email: req.user.email }
    });
});

export default router;
