const express = require("express");
const exportPdfRouter = express.Router();
const exportPdfController = require('../controllers/exportPdf.controller');
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validateObjectId = require('../middlewares/validateObjectId.middleware')


exportPdfRouter.get('/project-task/:projectId',[auth,role(["Manager"]),validateObjectId("projectId")],exportPdfController.exportProject);
exportPdfRouter.get('/projects-Report',[auth,role(["Manager"])],exportPdfController.exportAllProject);

module.exports = exportPdfRouter