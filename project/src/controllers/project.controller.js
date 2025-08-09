const Project = require('../models/Project');
const Notes = require("../models/Notes");
const Task = require("../models/Task");
const ActivityLogs = require('../models/ActivityLogs');
const logActivity = require('../helpers/logActivity.helper');

class ProjectController {

    ///add project
  async addProject(req, res) {
    try {
        const { name, description, startDate, endDate} = req.body;
        
        const existProject = await Project.findOne({name:name.trim()})
        if(existProject){
            return res.status(400).json({status:"faild",message:`A project is already in the name ${existProject.name}`})
        }
        const newProject = await Project.create({
            name,
            description,
            startDate,
            endDate,
            createdBy:req.user.id
        });
       
        
        //Activit-logs
        await logActivity('CREATE_PROJECT',newProject.createdBy,'Project',newProject._id);
        return res.status(201).json({ state: "success", message: "Project created successfully", project: newProject });

    }  catch (error) {
            throw new Error(error.message);
        }
  }

  ///update project by id
  async updateProject(req, res) {
    try {
        const { id } = req.params;
        const { name, description, startDate, endDate } = req.body;

        const update = await Project.findByIdAndUpdate(id,{ name, description, startDate, endDate },{new:true})
        //Activit-logs
        await logActivity('PROJECT_UPDATE',update.createdBy,'Project',id);
        return res.status(200).json({state: "success", message: "Project updated successfully", project: update });

    } catch (error) {
      throw new Error(error.message);
    }
  }

    ///delete project by id
  async deleteProject(req, res) {
        try {
          const projectId = req.params.id;
          
          
          const project = await Project.findById(projectId);
        
            
          if(!project){    
             return res.status(404).json({status:"faild",message:"project not found !"})
          }
          
          const tasks = await Task.find({projectId:projectId});
          const taskIds = tasks.map(task =>task._id);
          await Notes.deleteMany({task:{$in:taskIds}});
          await Task.deleteMany({projectId:projectId});

          await Project.findByIdAndDelete(projectId);

          //Activit-logs
          await logActivity('PROJECT_DELETED',req.user.id,'Project',projectId);
          return res.status(200).json({
                  state: "success",
                  message: "Project and all related tasks, notes, deleted successfully",
                  
          });

        } catch (error) {
              throw new Error(error.message);
        }
  }

  ///delete all project

  async deleteAllProject(req, res) {
    try {
        const projectIds = await Project.find().distinct("_id");

        if (projectIds.length === 0) {
            return res.status(200).json({
                state: "success",
                message: "No projects found to delete",
                data: {}
            });
        }
        const taskIds = await Task.find({ projectId: { $in: projectIds } }).distinct("_id");
        console.log(taskIds);
        
        const noteIds = await Notes.find({ task: { $in: taskIds } }).distinct("_id");

        await Notes.deleteMany({ task: { $in: taskIds } });
       
        await Task.deleteMany({ projectId: { $in: projectIds } });

        await Project.deleteMany({});

        return res.status(200).json({
            state: "success",
            message: "All projects, tasks, notes, and activity logs deleted successfully",

        });

    } catch (error) {
        throw new Error(error.message);
    }
}

  ////get all project

async getAllProjects(req, res) {
    try {
         const page = parseInt(req.query.page) ||1;

        const projects = await Project.paginate({
            page: parseInt(page),
            populatePath: 'createdBy',
            populateSel:'name email role'
        });

        return res.status(200).json({ state: "success", message: "get All tasks", Projects:projects });
    } catch (error) {
        throw new Error(error.message);
    }
}

///get project by id
async getOneProject(req, res) {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId).populate('createdBy','name email role');
        if(!project){
            return res.status(400).json({
            state: "faild",
            message: "Project not found",
        });
        }
        return res.status(200).json({
            state: "success",
            message: "Project fetched successfully",
            data: project
        });

    } catch (error) {
        throw new Error(error.message);
    }
}

}


module.exports = new ProjectController();




