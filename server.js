var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 8000;

var messages = [];
var users = {};

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
});

var server = app.listen(port, function(){

});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){

	socket.on("new_user", function(data){
		users[socket.id] = data.name;
		socket.emit("initial_messages", {messages: messages});
		var new_message = data.name + " has joined the chat!";
		messages.push(new_message);
		socket.broadcast.emit("user_connected", {message: new_message});
	});

	socket.on("message_submit", function(data) {
			messages.push(data.message);
			io.emit("new_message", {message: data.message});
	});

	socket.on("disconnect", function() {

		var new_message = users[socket.id] + " has left the chat.";

		socket.broadcast.emit("user_disconnected", {message: new_message});
	})
});