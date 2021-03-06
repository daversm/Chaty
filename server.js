var net 					   = require('net');
var express          = require('express');
var socketsObject 	 = {};
var chatRooms			   = {gibson:[], fender:[]};
var commands		 	   = require('./app/helpers/handleCommands');
var isUserAndRoomSet = require('./app/helpers/isUsernameAndChatroomSet');
var server 					 = net.createServer(newSocket);
var app 						 = express();
var http 						 = require('http').Server(app);
var io 							 = require('socket.io')(http);

app.use("/public", express.static('app/public'));

function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function receiveData(socket, data) {
	var cleanData = cleanInput(data);

	if(data[0] === 4 ){
		//console.log("EOT ERROR");
		return;
	}
	else if(cleanData === "!HELP"){
		commands.handleHelp(socket);
	}
	else if(cleanData === "!USERS"){
		commands.handleUsers(socket, chatRooms);
	}
	else if(cleanData === "!BYE") {
		commands.handleBye(socket, socketsObject, chatRooms, io);
	}
	else if(cleanData === "!LEAVE") {
		commands.handleLeave(socket, chatRooms, socketsObject, io);
	}
  else if(cleanData === "!ROOMS") {
    commands.handleRooms(socket, chatRooms);
	}
	else if(cleanData.split(" ")[0] === "!PRIVATE"){
		commands.handlePrivate(socket, socketsObject, chatRooms, cleanData);
	}
	else if (!socket.usernameSet){
		isUserAndRoomSet.setUsername(cleanData, socket, socketsObject);
  }
  else if(socket.chatRoom === 'NONE'){
    isUserAndRoomSet.setChatroom(cleanData, socket, socketsObject, chatRooms, io)
  }
  else{
		var usersInRoom = chatRooms[socket.chatRoom];

	  usersInRoom.forEach(function(user){
	    var socketInRoom = socketsObject[user];
			if(socketInRoom.isWebSocket === true){
				socketInRoom.emit('chat message', socket.username + ': ' + cleanData);
			}else{
	    	socketInRoom.write('- ' + socket.username + ': ' + cleanData  + '\n');
			}
	  });
  }
};

function closeSocket(socket) {
	commands.handleUpdateChatRooms(socket, socketsObject, chatRooms, io);
	delete socketsObject[socket.username];
	console.log(Object.keys(socketsObject));
	console.log(chatRooms);
};

function handleWebSocket(socket, msg){
	var cleanData = cleanInput(msg);

	if(socket.usernameSet === false){
		isUserAndRoomSet.setUsername(cleanData, socket, socketsObject);
	}else if(socket.chatRoom === 'NONE'){
		isUserAndRoomSet.checkIfUsernameChatRoomSet(socket);
	}
	else{
		var usersInRoom = chatRooms[socket.chatRoom];

	  usersInRoom.forEach(function(user){
	    var socketInRoom = socketsObject[user];
			if(socketInRoom.isWebSocket){
				socketInRoom.emit('chat message', socket.username + ': ' + cleanData);
			}else{
	    	socketInRoom.write('- ' + socket.username + ': ' + cleanData + '\n');
			}
	  });
	}
}

function newSocket(socket) {
  socket.usernameSet = false;
  socket.chatRoom = 'NONE';
	socket.isWebSocket = false;
	socket.write('- Welcome to Chaty (use !HELP for list of commands)\n');
  socket.write('- Pick a username: \n');

	socket.on('error', function(err){
		//console.log('------------------there was an error : socket');
		closeSocket(socket);
	});

	socket.on('data', function(data) {
		receiveData(socket, data);
	});

	socket.on('end', function() {
		closeSocket(socket);
	});
};

app.get('/', function(req, res){
  res.sendfile('./app/views/index.html');
});

io.on('connection', function(socket){
	socket.on('error', function(){

  });

  console.log('a user connected');
	socket.isWebSocket = true;
	socket.usernameSet = false;
  socket.chatRoom = 'NONE';

	socket.emit('chatRoomsList', chatRooms);
	socket.emit('chat message', 'Howdy there');
	socket.emit('chat message imp', 'Please pick a username');

	socket.on('chat message', function(msg){
    handleWebSocket(socket, msg);
  });

	socket.on('selectRoom', function(room){
		if(socket.usernameSet){
			commands.handleLeave(socket, chatRooms, socketsObject, io);
    	isUserAndRoomSet.setChatroom(room, socket, socketsObject, chatRooms, io);
		}else{
			isUserAndRoomSet.checkIfUsernameChatRoomSet(socket);
		}
  });

	socket.on('disconnect', function(){
		commands.handleUpdateChatRooms(socket, socketsObject, chatRooms, io);
    delete socketsObject[socket.username];
  });


});

server.on('error', function(err){
	console.log('------------------there was an error : server');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

server.listen(8888);
