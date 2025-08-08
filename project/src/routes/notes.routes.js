const express = require("express");
const notesRouter = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const noteController = require('../controllers/notes.controller');
const validateObjectId = require('../middlewares/validateObjectId.middleware');
const {    
    validateNote,
    validateUpdateNote
} = require('../validation/notes.validate')

// routes

notesRouter.post('/add/:taskId',[auth,,validateObjectId("taskId"),...validateNote],noteController.addNote);
notesRouter.put('/update/:noteId',[auth,validateObjectId("noteId"),...validateUpdateNote],noteController.updateNote);
notesRouter.delete('/delete/:noteId',[auth,role(["Manager","TeamMember"]),validateObjectId("noteId")],noteController.deleteNote);
notesRouter.get('/getNoteByid/:noteId',[auth,validateObjectId("noteId")],noteController.getNoteById);
notesRouter.get('/getNotes/:taskId',[auth,validateObjectId("taskId")],noteController.getNotesByTask);
module.exports = notesRouter