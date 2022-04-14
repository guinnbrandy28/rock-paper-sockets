// if you want to deploy or use ngrok, you want to use the static version of your html being served on the server, with just a '/' here in the io.connection.
const socket = io.connect("http://localhost:3000");
let currentRoom = undefined;
//console.log('socket created...and starting', socket);

socket.emit('startGame', {name: 'Player1'});

socket.on('initGame', (data) => {
    //console.log('initGame...', data);
    data && data.existingGame ? $("#join-game").show() : $("#new-game").show();
});

//New Game Created Listener
socket.on("newGame", (data) => {
    currentRoom = data.roomID;
    // console.log('currentRoom...', currentRoom);
    // console.log('newGame...', socket, data);
    $("#new-game").hide();
    $("#waiting-game").show();
});

$("#new-game" ).click(function(e) {
    e.preventDefault();
    //console.log('createGame...', socket);
    socket.emit("createGame", { name: 'Player1' });
});

//Join Game Event Emitter
$("#join-game" ).click(function(e) {
    e.preventDefault();
    //console.log('joinGame...', socket);
    socket.emit("joinGame", { name: 'Player2', room: currentRoom });
});

//Select Choice function
socket.on("makeChoice", () => {
    $("#join-game").hide();
    $("#waiting-game").hide();
    $(".make-choice").show();
});

$("#rock").click(function(e) {
    e.preventDefault();
    selectChoice('rock');
});

$("#paper").click(function(e) {
    e.preventDefault();
    selectChoice('paper');
});

$("#socket").click(function(e) {
    e.preventDefault();
    selectChoice('socket');
});

function selectChoice(choice){
    $(".make-choice").hide();
    $("#loading").show();
    //console.log('make-choice...selectChoice...', choice);
    socket.emit("choiceMade", { choice: choice });
}

//Result Event Listener
socket.on("gameOver", (data) => {
    //console.log('gameOver...', data);
    $("#loading").hide();
    $("#game-result").html(data.outcome);
    $("#game-result").show();    
});