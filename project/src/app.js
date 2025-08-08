const express = require("express");
//helmet
const applyHelmet = require('./../src/middlewares/helmet.middleware');
//rate-time
const generalLimiter = require('./../src/middlewares/ratelimit.middleware');
const routerAuth = require("./routes/auth.routes") //import auth
const routerProject = require("./routes/projects.routes")//project
const path = require("path");
const tasksPath = require("./routes/tasks.routes");
const ActivitiesLogRouters = require('./routes/ActivityLogs.routes');
const ExportPdfRouters = require('./routes/exportPDF.routes');
const NotesRouters = require('./routes/notes.routes');
const errorHandler = require("./middlewares/errorhandler.middleware");
const cleanInput = require('./middlewares/security.middleware');
const logger = require("morgan");
const cors = require("cors");

const app = express();

//helmet
app.use(applyHelmet);
//rate-time
app.use(generalLimiter);

// middlewares
app.use(logger("dev"));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));
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