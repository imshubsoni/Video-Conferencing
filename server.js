var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
});

app.get("/:room", function(req,res){
	res.render("room",{roomId: req.params.room});
});

io.on("connection", socket =>{
	socket.on("join-room", (roomId, userId) => {
		socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    });
});

server.listen(3000, function(req,res){
	console.log("Server started!");
});