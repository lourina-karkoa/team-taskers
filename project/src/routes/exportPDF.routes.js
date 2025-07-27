const express = require("express");
const exportPdfRouter = express.Router();
const exportPdfController = require('../controllers/exportPdf.controller');

// exportPdfController.get('export/project-task/:projectId',userController.exportProject);
// 
module.exports = exportPdfRouter