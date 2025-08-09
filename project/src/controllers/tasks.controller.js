const mongoose = require("mongoose");
const Task = require("../models/Task");
const sendNotification = require("../helpers/Notification");
const Notes = require("../models/Notes");
const Project = require("../models/Project");
const ActivityLogs = require("../models/ActivityLogs");

class TasksController {
      // get All Taskes
      async getAllTaskes(req, res) {
            try {
                  // const {status , dueDate ,projectId ,assignedTo } = req.query;

                  //if (status && dueDate && projectId && assignedTo){
                  //tasks = await Task.find({ شي للفلترة  }).populate("projectId").populate("assignedTo") ; }

                  const tasks = await Task.find()
                        .populate({
                              path: "projectId",
                              select: "title description _id"
                        })
                        .populate("assignedTo", "name email role image");
                  return res.status(200).json({ state: "success", message: "All tasks", data: tasks });

            } catch (error) {
                  throw new Error(error.message);
            }
      };

      // get Taske by id
      async getTaskById(req, res) {
            try {

                  const id = req.params.id

                  const task = await Task.findById(id).select(req.user.role === "TeamMember" ? "-projectId" : "");

                  return res.status(200).json({ state: "success", message: "Specific tasks", data: task });

            } catch (error) {
                  throw new Error(error.message);

            }

      };

      // Add Task
      async createTask(req, res) {
            try {

                  const { title, description, startDate, dueDate, priority, status, projectId, assignedTo } = req.body;

                  const task = await Task.create({
                        title,
                        description,
                        startDate,
                        dueDate,
                        priority,
                        status,
                        projectId,
                        assignedTo
                  });

                  // send Notifcation
                  const io = req.app.get("io");
                  const userSockets = req.app.get("userSockets");

                  await sendNotification(io, userSockets, {
                        userId: assignedTo,
                        type: "new_task",
                        message: `New task assigned to ypu titled : ${title}`,
                        relatedId: task._id
                  });

                  return res.status(200).json({ state: "success", message: "Added task successfully", data: task });

            } catch (error) {
                  throw new Error(error.message);
            }

      };

      // edit status || edit Task data
      async updateTask(req, res) {
            try {
                  const taskId = req.params.id;
                  let updates = req.body;

                  if (req.user.role === "TeamMember") {
                        
                        const task = await Task.findById(taskId);

                        if (!task.assignedTo.equals(req.user._id)) {
                              return res.status(403).json({
                                    state: "error",
                                    message: "You can only update tasks assigned to you",
                                    data: null
                              });
                        }

                        if (!updates.status || Object.keys(updates).length > 1) {
                              return res.status(403).json({
                                    state: "error",
                                    message: "You can only update the task status",
                                    data: null
                              });
                        }

                        updates = { status: updates.status };
                  }

                  const updatedTask = await Task.findByIdAndUpdate(
                        taskId,
                        { $set: updates },
                        { new: true }
                  );

                  // sendNotification to manger
                  const editingUserName = req.user.name;
                  const project = await Project.findById(updatedTask.projectId).populate("createdBy");
                  const managerId = project?.createdBy._id.toString();

                  if (managerId) {
                        const io = req.app.get("io");
                        const userSockets = req.app.get("userSockets");
                        await sendNotification(io, userSockets, {
                              userId: managerId,
                              type: "task_updated",
                              message: `"${updatedTask.title}" was updated by ${editingUserName} to ${updates.status}`,
                              relatedId: updatedTask._id
                        });
                  }

                  return res.status(200).json({
                        state: "success",
                        message: "Task updated successfully",
                        data: updatedTask
                  });

            } catch (error) {
                  throw new Error(error.message);
            }
      }


      // delete Task
      async deleteTask(req, res) {
            try {
                  const id = req.params.id; // Task ID

                  const noteIds = await Notes.find({ task: id }).distinct("_id");
                  await Notes.deleteMany({ task: id });

                  await ActivityLogs.deleteMany({
                        "entityRef.entityType": "Task",
                        "entityRef.entityId": id
                  });

                  if (noteIds.length > 0) {
                        await ActivityLogs.deleteMany({
                              "entityRef.entityType": "Notes",
                              "entityRef.entityId": { $in: noteIds }
                        });
                  }

                  await Task.findByIdAndDelete(id);

                  return res.status(200).json({
                        state: "success",
                        message: "Task and related data deleted successfully",
                        data: {},
                  });

            } catch (error) {
                  throw new Error(error.message);
            }
      }

      // deleta All task
      async deleteAllTasks(req, res) {
            try {
                  const taskIds = await Task.find().distinct("_id");

                  if (taskIds.length === 0) {
                        return res.status(200).json({
                              state: "success",
                              message: "No tasks found to delete",
                              data: {}
                        });
                  }

                  const noteIds = await Notes.find({ task: { $in: taskIds } }).distinct("_id");

                  await Notes.deleteMany({ task: { $in: taskIds } });

                  await ActivityLogs.deleteMany({
                        "entityRef.entityType": "Task",
                        "entityRef.entityId": { $in: taskIds }
                  });

                  if (noteIds.length > 0) {
                        await ActivityLogs.deleteMany({
                              "entityRef.entityType": "Notes",
                              "entityRef.entityId": { $in: noteIds }
                        });
                  }

                  await Task.deleteMany({});

                  return res.status(200).json({
                        state: "success",
                        message: "All tasks and related data deleted successfully",
                        data: {}
                  });

            } catch (error) {
                  throw new Error(error.message);
            }
      }


}
module.exports = new TasksController();
