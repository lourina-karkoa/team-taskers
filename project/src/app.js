const express = require("express");

//////helmet
const applyHelmet = require('./../src/middlewares/helmet.middleware');
///rate-time
const generalLimiter = require('./../src/middlewares/ratelimit.middleware');


const app = express();
///import auth
const routerAuth = require("./routes/auth.routes")
///import project
//project
const routerProject = require("./routes/projects.routes")

// import
const logger = require("morgan");
const cors = require("cors");



const errorHandler = require("./middlewares/errorhandler.middleware");
const cleanInput = require('./middlewares/security.middleware');

// const notFound = require("./middlewares/notFound.middleware");


const path = require("path")
const tasksPath = require("./routes/tasks.routes");
const ActivitiesLogRouters = require('./routes/ActivityLogs.routes');
const ExportPdfRouters = require('./routes/exportPDF.routes');
const NotesRouters = require('./routes/notes.routes');


/////helmet
app.use(applyHelmet);

///rate-time
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

app.use("/api/users", require("./routes/users.routes"));

// app.use();
app.use("/api/tasks",tasksPath);
// Activity-logs APIs
app.use("/api/activity-logs",ActivitiesLogRouters);
//Export-PDF APIS
app.use("/api/export",ExportPdfRouters);
//Notes APIS
app.use('/api/notes',NotesRouters)


//app.use(notFound)
app.use(errorHandler);



// auth
app.use('/api/auth' , routerAuth)

// project
app.use('/api/project' , routerProject)



module.exports = app;