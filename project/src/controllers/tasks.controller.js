const mongoose = require("mongoose");
const Task = require("../models/Task");
const logActivity = require("../helpers/logActivity");
const asyncHandler = require("express-async-handler");
const sendNotification = require("../helpers/Notification");

const getAllTaskes = asyncHandler(async (req, res) => {
      // const {status , dueDate ,projectId ,assignedTo } = req.query;

      //if (status && dueDate && projectId && assignedTo){
      //tasks = await Task.find({ شي للفلترة  }).populate("projectId").populate("assignedTo") ; }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const tasks = await Task.find()
            .populate({
                  path: "projectId",
                  select: "-manager"
            })
            .populate("assignedTo", "name email role image");
      return res.status(200).json(tasks);
});

const getTaskById = asyncHandler(async (req, res) => {

      const task = await Task.findById(req.params.id).select(req.user.role === "TeamMember" ? "-projectId" : "");
      if (task) {
            return res.status(200).json(task);
      } else {
            return res.status(404).json({ message: "Task not Found" })
      }
});



const createTask = asyncHandler(async (req, res) => {
      const {
            title,
            description,
            dueDate,
            priority,
            status,
            projectId,
            assignedTo: assigneeId
      } = req.body;

      const task = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            projectId,
            assignedTo: assigneeId
      });

      const result = await task.save();


      const io = req.app.get("io");
      const userSockets = req.app.get("userSockets");


      await sendNotification(io, userSockets, {
            userId: assigneeId,
            type: "new_task",
            message: `New task assigned  ${title}`,
            relatedId: task._id
      });

      res.status(201).json(result);
});



const MANAGER_ID = "64f123abc456def789012345"; // عدّلها حسب ID المدير

const updateTask = asyncHandler(async (req, res) => {
      let updateData = {};

      if ("status" in req.body && req.user.role === "TeamMember") {
            updateData = { status: req.body.status };
      } else if (req.user.role === "Manager") {
            updateData = req.body;
      } else {
            return res.status(403).json({ message: "Not allowed to update these fields." });
      }

      const task = await Task.findById(req.params.id);
      if (!task) {
            return res.status(404).json({ message: "Task not found." });
      }

      const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
      ).select(req.user.role === "TeamMember" ? "-projectId" : "");

      // 📌 إشعار المدير عند تعديل الحالة
      if ("status" in req.body) {
            await sendNotification(
                  req.app.get("io"),
                  req.app.get("userSockets"),
                  {
                        userId: MANAGER_ID,
                        type: "task_status_update",
                        message: `🔄 تم تحديث حالة المهمة: ${task.title} → ${req.body.status}`,
                        relatedId: task._id
                  }
            );
      }

      return res.status(200).json(updatedTask);
});

module.exports = { updateTask };

const deleteTask = asyncHandler(async (req, res) => {

      const task = await Task.findById(req.params.id);
      if (task) {
            await Task.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Task has been deleted" });
      } else {
            return res.status(404).json({ message: "Task not Found" })
      }
});



module.exports = {
      getAllTaskes,
      getTaskById,
      createTask,
      updateTask,
      deleteTask
}



