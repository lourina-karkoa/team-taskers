const express = require("express");
const applyHelmet = require('./config/helmet');//helmet
const generalLimiter = require('./config/ratelimit');//rate-limit
const routerAuth = require("./routes/auth.routes") //import auth
const routerProject = require("./routes/projects.routes")//project

const path = require("path");//path
const tasksPath = require("./routes/tasks.routes");//import task-router
const ActivitiesLogRouters = require('./routes/ActivityLogs.routes');//import activity-router
const ExportPdfRouters = require('./routes/exportPDF.routes');//import pdf-router
const NotesRouters = require('./routes/notes.routes');//import notes-router
const errorHandler = require("./middlewares/errorhandler.middleware");//error-handeler
const cleanInput = require('./middlewares/security.middleware');//security
const logger = require("morgan");//logar
const cors = require("cors");//cors


const app = express();

//helmet
app.use(applyHelmet);
//rate-limit
app.use(generalLimiter);

// middlewares
app.use(logger("dev"));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public/uploads')));
app.use(express.urlencoded({ extended: true }));

//security
app.use(cleanInput);

// routers

app.use('/api/auth' , routerAuth); // auth APIs 

app.use("/api/users", require("./routes/users.routes")); // User APIs

app.use("/api/tasks",tasksPath); // Task APIs

app.use("/api/activity-logs",ActivitiesLogRouters);// Activity-logs APIs

app.use("/api/export",ExportPdfRouters); //Export-PDF APIS

app.use('/api/notes',NotesRouters); //Notes APIS

app.use('/api/project' , routerProject); // project APIS


//app.use(notFound)
app.use(errorHandler);
// const notFound = require("./middlewares/notFound.middleware");




module.exports = app;