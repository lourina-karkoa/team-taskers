require("dotenv").config();

const app = require("./app");
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});


const connectedUsers = new Map(); // userId => socket.id



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

    

    
