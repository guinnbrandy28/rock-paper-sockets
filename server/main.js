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
let existingGame = undefined;


// establish connection
io.on("connection", (socket) => {
    //console.log("connection established ", socket.id);

    socket.on("startGame", (data) => {
        //console.log("server...listen start...", existingGame, data, socket);    
        socket.emit("initGame", {existingGame: existingGame});
    });
    
    //Create Game Listener
    socket.on("createGame", (data) => {
        //console.log("server...createGame...", socket.id);
        const roomID = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
        socket.join(roomID);
        existingGame = roomID;
        rooms[roomID] = { player1: { name: data.name, choice: '', socket: socket }, player2: { name: '', choice: '', socket: undefined } };       
        socket.emit("newGame", { roomID: roomID });        
    });

    //Join Game Listener
    socket.on("joinGame", (data) => {
        //console.log("joining game...sever...", existingGame, data, socket);    
        if(existingGame){
            rooms[existingGame].player2.name = data.name;
            rooms[existingGame].player2.socket = socket;
            rooms[existingGame].player1.socket.emit("makeChoice", {existingGame: existingGame, room: existingGame, name: rooms[existingGame].player1.name });
            rooms[existingGame].player2.socket.emit("makeChoice", {existingGame: existingGame, room: existingGame, name: data.name });
            //existingGame = undefined;
        }
        else{
            console.log('start new game ... TODO'); ///let them know you are waiting for another player
        }       
    });

    //Listener for Player 1's Choice
    //Listener to Player 2's Choice
    socket.on("choiceMade", (data) => {
        console.log("...server..existingGame",existingGame);
        console.log("server...choiceMade...", data);
        if(rooms[existingGame].player1.socket.id === socket.id){
            rooms[existingGame].player1.choice = data.choice;
            if(rooms[existingGame].player2.choice) {
                gameOver(existingGame, rooms);                 
            }
        }
        else{
            rooms[existingGame].player2.choice = data.choice;
            if(rooms[existingGame].player1.choice) {
                gameOver(existingGame, rooms);                 
            }
        }
        
    });

    //evaluate resultafter getting both choices
    function gameOver(existingGame, rooms) {        
        let outcome = scoreGame(rooms[existingGame]);
        console.log("server...gameOver...", outcome);
        if (outcome.result === 'tie-game') {
            rooms[existingGame].player1.socket.emit("gameOver", { outcome: `Tie game, you both chose ${outcome.summary}` });
            rooms[existingGame].player2.socket.emit("gameOver", { outcome: `Sorry you lost ${rooms[existingGame].player2.name}.` });
        } else if (outcome.result === 'player1-winner') {
            rooms[existingGame].player1.socket.emit("gameOver", { outcome: `Congratulations you won ${rooms[existingGame].player1.name}, ${outcome.summary}!` });
            rooms[existingGame].player2.socket.emit("gameOver", { outcome: `Sorry you lost ${rooms[existingGame].player2.name}, ${outcome.summary}.` });
        } else {
            rooms[existingGame].player1.socket.emit("gameOver", { outcome: `Sorry you lost ${rooms[existingGame].player1.name}, ${outcome.summary}.` });
            rooms[existingGame].player2.socket.emit("gameOver", { outcome: `Congratulations you won ${rooms[existingGame].player2.name}, ${outcome.summary}!` });
        }
    }
});

function scoreGame(room) {
    console.log('room on server...room.player1', room.player1);
    console.log('room on server...room.player2', room.player2);
    if(room.player1.choice === room.player2.choice) return {result:'tie-game', summary: room.player1.choice }; //rock<socket socket<paper paper<rock

    if(room.player1.choice === 'rock' && room.player2.choice === 'socket') return {result:'player1-winner', summary: 'rock beats socket' };
    if(room.player2.choice === 'rock' && room.player2.choice === 'paper') return {result:'player2-winner', summary: 'paper beats rock' };

    if(room.player1.choice === 'socket' && room.player2.choice === 'rock') return {result:'player2-winner', summary: 'rock beats socket' };
    if(room.player1.choice === 'socket' && room.player2.choice === 'paper') return {result:'player1-winner', summary: 'socket beats paper' };

    if(room.player1.choice === 'paper' && room.player2.choice === 'rock') return {result:'player1-winner', summary: 'paper beats rock' };
    if(room.player1.choice === 'paper' && room.player2.choice === 'socket') return {result:'player2-winner', summary: 'socket beats paper' };
}

