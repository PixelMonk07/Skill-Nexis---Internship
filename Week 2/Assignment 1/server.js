
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to To-Do List REST API"
    });
});

app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "API endpoint not found."
    });
});

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3500;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
};

startServer();
