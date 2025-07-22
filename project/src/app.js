const express = require("express");
const app = express();

// import
const logger = require("morgan");
const cors = require("cors");
// const errorHandler = require("./middlewares/errorhandler.middleware");
const path = require("path");
// middlewares
app.use(logger("dev"));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public/uploads')));
app.use(express.urlencoded({ extended: true }));

// app.use();
// app.use();

// app.use(errorHandler);

module.exports = app;