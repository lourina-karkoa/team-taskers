const mongoose = require("mongoose");
const Task = require("../models/Task");

const asyncHandler = require("express-async-handler");
const logActivity = require('../helpers/logActivity.helper');

const getAllTaskes = asyncHandler (async(req, res) => {
            // const {status , dueDate ,projectId ,assignedTo } = req.query;
            let tasks ;
            //if (status && dueDate && projectId && assignedTo){
                 //tasks = await Task.find({ شي للفلترة  }).populate("projectId").populate("assignedTo") ; }
            
            tasks = await Task.find( ).populate("projectId").populate("assignedTo");
      
            return res.status(200).json(tasks);
    } );

const getTaskById = asyncHandler (async(req, res) => {

            const task = await Task.findById(req.params.id).select(req.user.role === "TeamMember" ? "-projectId" : "");
            if (task) {
                  return res.status(200).json(task);
            }else{
                  return res.status(404).json({message : "Task not Found"})
            }
    } );

const createTask = asyncHandler (async(req, res) => {
        
      const task = new Task ({
            title : req.body.title ,
            description : req.body.description ,
            dueDate: req.body.dueDate  ,
            priority : req.body.priority ,
            status :  req.body.status ,
            projectId : req.body.projectId ,
            assignedTo : req.body.assignedTo
      });

      // Log activity
      await logActivity('CREATE_TASK',req.user._id,'Task',task._id);

      const result =  await task.save();
      res.status(201).json(result);
            
    } );

const updateTask = asyncHandler (async(req, res) => {

            let updateData = {};

            if ("status" in req.body && req.user.role === "TeamMember") {
                  updateData = { status: req.body.status };
            } else if (req.user.role === "Manager") {
                  updateData = req.body;
            }else {
                  return res.status(403).json({ message: "Not allowed to update these fields." });
            } 

           const updatedTask = await Task.findByIdAndUpdate(
                            req.params.id,
                            { $set: updateData },
                            {new: true}
                            ).select(req.user.role === "TeamMember" ? "-projectId" : "");
 
           if (!updatedTask) {
           return res.status(404).json({ message: "Task not found." });
           }

           // Log activity
           await logActivity('UPDATE_TASK',req.user._id,'Task',updatedTask._id);

           return res.status(200).json(updatedTask);

    });

const deleteTask = asyncHandler (async(req, res) => {

            const task = await Task.findById(req.params.id);
            if (task) {
                  await Task.findByIdAndDelete(req.params.id);
                  return res.status(200).json({message : "Task has been deleted"});
            }else{
                  return res.status(404).json({message : "Task not Found"})
            }
    } );


    
module.exports ={
      getAllTaskes,
      getTaskById,
      createTask,
      updateTask,
      deleteTask
}



