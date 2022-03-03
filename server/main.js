const app = require('express');
const socket = require('socket.io');
const port = process.env.port || 3000

const express = app();

const server = express.listen(port, () => {
    console.log(`'server started at http://localhost:'${port}`);
})

// path should lead to folder containing previos code
express.use(app.static('public'));

const io = socket(server);

//track players room

//track VARIABLES

// establish connection
io.on("connection", (socket) => {
    console.log("connection established ", socket.id);

    //Create Game Listener
    socket.on("createGame", (data) => {
        // do all the things you need to setup game
    })

    //Join Game Listener

    //Listener for Player 1's Choice


    //Listener to Player 2's Choice


    //evaluate resultafter getting both choices


})


// you can create functions out here to help find the winner, etc