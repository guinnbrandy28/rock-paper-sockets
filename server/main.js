const app = require('express');
const socket = require('socket.io');
const port = process.env.port || 3000
const cors = require('cors')

const express = app();

const server = express.listen(port, () => {
    console.log(`'server started at http://localhost:'${port}`);
})


// path should lead to folder containing previos code
express.use(app.static('public'));

const io = socket(server, { cors: {} });

//track players in rooms
let rooms = {}
//track VARIABLES


// establish connection
io.on("connection", (socket) => {
    console.log("connection established ", socket.id);

    //Create Game Listener
    socket.on("createGame", (data) => {
        const roomID = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
        socket.join(roomID);
        rooms[roomID] = { player1: { name: data.name, choice: '' }, player2: { name: '', choice: '' } };
        socket.emit("newGame", { roomID: roomID });
        console.log(rooms);
    })

    //Join Game Listener

    //Listener for Player 1's Choice


    //Listener to Player 2's Choice


    //evaluate resultafter getting both choices


})


// you can create functions out here to help find the winner, etc