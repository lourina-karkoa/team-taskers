const express = require("express");
const app = express();

// import
const logger = require("morgan");
const cors = require("cors");

const errorHandler = require("./middlewares/errorhandler.middleware");

// const notFound = require("./middlewares/notFound.middleware");


const path = require("path")
const tasksPath = require("./routes/tasks.routes")

// middlewares
app.use(logger("dev"));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public/uploads')));
app.use(express.urlencoded({ extended: true }));

// routers

app.use("/api/users", require("./routes/users.routes"));
// app.use();


app.use("/api/tasks",tasksPath);


//app.use(notFound)
app.use(errorHandler);



module.exports = app;