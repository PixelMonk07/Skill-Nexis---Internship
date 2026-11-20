
import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "User Authentication API is running!"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found."
    });
});

// Start server after database connection
const startServer = async () => {

    try {

        await connectDB();

        const PORT = process.env.PORT || 3500;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error("Server startup failed:", error.message);
        process.exit(1);

    }

};

startServer();
