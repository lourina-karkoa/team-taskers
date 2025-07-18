require("dotenv").config();

const app = require("./app");

const mongoose = require("mongoose");

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log("Connected to the database successfully")
        app.listen(PORT, () => {
            console.log(`Running successfully on the port ${PORT}`)
        })
    })
    .catch(error => {
    console.log(error.message);
    })

    