const express = require("express");
const app = express();
const routerAuth = require("./routes/auth.routes")

// import
const logger = require("morgan");
const cors = require("cors");
const errorHandler = require("./middlewares/errorhandler.middleware");
const path = require("path")

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
// app.use();
// app.use();

// auth
app.use('/api/auth' , routerAuth)


app.use(errorHandler);

module.exports = app;