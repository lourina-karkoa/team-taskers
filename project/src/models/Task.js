const mongoose= require("mongoose")


const taskSchema = new mongoose.Schema({
title: {
    type: String,
    required: [true, "Title is required"]
  },
description: {
    type: String,
    required: [true, "Description is required"]
  },
dueDate: {
    type : Date,
    required: [true, "DueDate is required"]
  },  
priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
status: {
    type: String,
    enum: ["in_progress", "completed", "delayed"],
    default: "in_progress",
  },
projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "projectId is required"],
  },
assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Assigned user is required"],
  },
}, { 
    timestamps: true 
});
const Task = mongoose.model("Task", taskSchema)
module.exports = Task;