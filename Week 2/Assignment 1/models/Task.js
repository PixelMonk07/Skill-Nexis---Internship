
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },

    description: {
        type: String,
        default: "",
        trim: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    dueDate: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
