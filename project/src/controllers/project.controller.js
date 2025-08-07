const Project = require('../models/Project');
const Notes = require("../models/Notes");
const Task = require("../models/Task");
const ActivityLogs = require('../models/ActivityLogs');

class ProjectController {
    ////add project
  async addProject(req, res) {
        try {
        const { name, description, startDate, endDate , createdBy } = req.body;

        const newProject = await Project.create({
            name,
            description,
            startDate,
            endDate,
            createdBy
        });

        return res.status(200).json({ state: "success", message: "Project created successfully", project: newProject });

    }  catch (error) {
            throw new Error(error.message);
        }
  }

  ////get all project

async getAllProjects(req, res) {
    try {
        const { page = 1, limit = 3 } = req.query;

        const projects = await Project.paginate({
            page: parseInt(page),
            limit: parseInt(limit),
            populate: 'createdBy'
        });

        return res.status(200).json({ state: "success", message: "get All tasks", ...projects });
    } catch (error) {
        throw new Error(error.message);
    }
}

///get project by id
async getOneProject(req, res) {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId).populate('createdBy');

        return res.status(200).json({
            state: "success",
            message: "Project fetched successfully",
            data: project
        });

    } catch (error) {
        throw new Error(error.message);
    }
}


  ////update project by id
  async updateProject(req, res) {
    try {
        const { id } = req.params;
        const { name, description, startDate, endDate } = req.body;


        const existingProject = await Project.findById(id);
        if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
        }

        if (name !== undefined) existingProject.name = name;
        if (description !== undefined) existingProject.description = description;
        if (startDate !== undefined) existingProject.startDate = startDate;
        if (endDate !== undefined) existingProject.endDate = endDate;


        await existingProject.save();

        return res.status(200).json({state: "success", message: "Project updated successfully", project: existingProject });

    } catch (error) {
      throw new Error(error.message);
    }
  }

    ///delete project by id
  async deleteProject(req, res) {
        try {
          const projectId = req.params.id;
          const taskIds = await Task.find({ project: projectId }).distinct("_id");
          const noteIds = await Notes.find({ task: { $in: taskIds } }).distinct("_id");

          await Notes.deleteMany({ task: { $in: taskIds } });
          if (noteIds.length > 0) {
                  await ActivityLogs.deleteMany({
                      "entityRef.entityType": "Notes",
                      "entityRef.entityId": { $in: noteIds }
                  });
          }
          if (taskIds.length > 0) {
                  await ActivityLogs.deleteMany({
                      "entityRef.entityType": "Task",
                      "entityRef.entityId": { $in: taskIds }
                  });
          }

          await Task.deleteMany({ project: projectId });

          await ActivityLogs.deleteMany({
                  "entityRef.entityType": "Project",
                  "entityRef.entityId": projectId
          });
          await Project.findByIdAndDelete(projectId);

          return res.status(200).json({
                  state: "success",
                  message: "Project and all related tasks, notes, and activity logs deleted successfully",
                  data: {}
          });

        } catch (error) {
              throw new Error(error.message);
        }
  }

  ///////delete all project

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
        const taskIds = await Task.find({ project: { $in: projectIds } }).distinct("_id");
        const noteIds = await Notes.find({ task: { $in: taskIds } }).distinct("_id");

        await Notes.deleteMany({ task: { $in: taskIds } });
        if (noteIds.length > 0) {
            await ActivityLogs.deleteMany({
                "entityRef.entityType": "Notes",
                "entityRef.entityId": { $in: noteIds }
            });
        }
        await Task.deleteMany({ project: { $in: projectIds } });
        if (taskIds.length > 0) {
            await ActivityLogs.deleteMany({
                "entityRef.entityType": "Task",
                "entityRef.entityId": { $in: taskIds }
            });
        }
        await ActivityLogs.deleteMany({
            "entityRef.entityType": "Project",
            "entityRef.entityId": { $in: projectIds }
        });

        await Project.deleteMany({});

        return res.status(200).json({
            state: "success",
            message: "All projects, tasks, notes, and activity logs deleted successfully",
            data: {}
        });

    } catch (error) {
        throw new Error(error.message);
    }
}


}


module.exports = new ProjectController();




