const Project = require('../models/Project');
const Users = require('./../models/Users');

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

        return res.status(200).json({ message: "Project created successfully", project: newProject });

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

        return res.status(200).json({ message: "Done", ...projects });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        return res.status(200).json({ message: "Project updated successfully", project: existingProject });

    } catch (error) {
      throw new Error(error.message);
    }
  }

  ///delete project by id
  async deleteProject(req, res) {
        try {
            const id = req.id;

            const project = await Project.deleteOne(id);

            return res.status(200).json({ message: "Done", project })

        } catch (error) {
           throw new Error(error.message);
        }
  }
}

module.exports = new ProjectController();




