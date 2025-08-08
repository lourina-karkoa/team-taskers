const Notes = require('../models/Notes');
const Task = require('../models/Task');
const logActivity = require('../helpers/logActivity.helper');
const Project = require('../models/Project');
const sendNotification = require('../helpers/Notification');


class Note {

    // add note to a task
    addNote = async (req, res) => {
        try {
            const taskId = req.params.taskId;
            const {content , important} = req.body;

            const isExist = await Task.findById(taskId);
            if (!isExist) {
                return res.status(404).json({ message: "Task not found !" })
            }

            const note = new Notes({
                task: taskId,
                author: req.user.id,
                content,
                important: important || false
            });

            await note.save();
            //Activit-logs
            await logActivity('ADD_NOTE', note.author, 'Notes', note._id);

            // sendNotification to manger
            if (note.important) {
                const editingUserName = req.user.name;                
                const project = await Project.findById(isExist.projectId).populate("createdBy");
                const managerId = project?.createdBy?._id.toString();

                if (managerId) {
                    const io = req.app.get("io");
                    const userSockets = req.app.get("userSockets");

                    await sendNotification(io, userSockets, {
                        userId: managerId,
                        type: "important_note_added",
                        message: `${editingUserName} added an IMPORTANT note to task "${isExist.title}"`,
                        relatedId: isExist._id
                    });
                }
            }
            return res.status(201).json({ message: "A note has been added successfully", note: note })

        } catch (error) {
            throw new Error(error.message);
        }

    }
    // edit note 
    updateNote = async (req, res) => {
        try {
            const noteId = req.params.noteId;
            const content = req.body.content;

            const isExist = await Notes.findById(noteId);
            if (!isExist) {
                return res.status(404).json({ message: "Note not found !" })
            }

            if (isExist.author.toString() != req.user.id) {
                return res.status(403).json({ message: "You are not allowed to edit this note." })
            }

            const edit = await Notes.findByIdAndUpdate(noteId, { content }, { new: true });

            return res.status(200).json({ message: "A note has been updated successfully", note: edit })

        } catch (error) {
            throw new Error(error.message);
        }

    }
    // delete note by id (manager,TeamMember)
    deleteNote = async (req, res) => {
        try {
            const noteId = req.params.noteId;

            const isExist = await Notes.findById(noteId);
            if (!isExist) {
                return res.status(404).json({ message: "Note not found !" })
            }

            if (isExist.author.toString() !== req.user.id && req.user.role !== 'Manager') {
                return res.status(403).json({ message: "You are not allowed to delete this note." })
            }

            const note = await Notes.findByIdAndDelete(noteId);

            return res.status(200).json({ message: "A note has been deleted successfully" })

        } catch (error) {
            throw new Error(error.message);
        }

    }
    // fetch note by id 
    getNoteById = async (req, res) => {
        try {
            const noteId = req.params.noteId;

            const isExist = await Notes.findById(noteId).populate('author task', 'name email role title');
            if (!isExist) {
                return res.status(404).json({ message: "Note not found !" })
            }
            return res.status(200).json({ message: "A note has been fetched successfully", note: isExist })

        } catch (error) {
            throw new Error(error.message);
        }

    }
    // fetch all notes by task id
    getNotesByTask = async (req, res) => {
        try {
            const taskId = req.params.taskId;

            const notes = await Notes.find({ task: taskId })
                .populate('author task', 'name email role title')
                .sort({ createdAt: 1 });

            return res.status(200).json({ message: "All notes have been brought successfully", notes: notes })

        } catch (error) {
            throw new Error(error.message);
        }

    }

}

module.exports = new Note()