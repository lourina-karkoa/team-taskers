const express = require("express");
const app = express();
const routerAuth = require("./routes/auth.routes")

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


//app.use(notFound)
app.use(errorHandler);



// auth
app.use('/api/auth' , routerAuth)




module.exports = app;