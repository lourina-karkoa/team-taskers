const mongoose = require("mongoose")

// schema Task

const paginate = require('../plugins/paginate')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
    validate: {
      validator: function (value) {
        return this.startDate ? value > this.startDate : true;
      },
      message: "Due date must be after start date",
    },
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
    ref: "Project", //ref to Project model
    required: [true, "projectId is required"],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",  //ref to Users model
    required: [true, "Assigned user is required"],
  },
}, {
  timestamps: true
});
// paginate 
taskSchema.plugin(paginate);
const Task = mongoose.model("Task", taskSchema)
module.exports = Task;