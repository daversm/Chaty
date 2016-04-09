var net 					   = require('net');
var socketsObject 	 = {};
var chatRooms			   = {gibson:[], fender:[]};
var commands		 	   = require('./app/helpers/handleCommands');
var isUserAndRoomSet = require('./app/helpers/isUsernameAndChatroomSet');

function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function receiveData(socket, data) {
	var cleanData = cleanInput(data);

	if(data[0] === 4 ){
		//console.log("EOT ERROR");
		return;
	}
	else if(cleanData === "!BYE") {
		commands.handleBye(socket, socketsObject, chatRooms);
	}
	else if(cleanData === "!LEAVE") {
		commands.handleLeave(socket, chatRooms, socketsObject, false);
	}
  else if(cleanData === "!ROOMS") {
    commands.handleRooms(socket, chatRooms);
	}
	else if (!socket.usernameSet){
		isUserAndRoomSet.setUsername(cleanData, socket, socketsObject);
  }
  else if(socket.chatRoom === 'NONE'){
    isUserAndRoomSet.setChatroom(cleanData, socket, socketsObject, chatRooms)
  }
  else{
		var usersInRoom = chatRooms[socket.chatRoom];

	  usersInRoom.forEach(function(user){
	    var socketInRoom = socketsObject[user];
	    socketInRoom.write('- ' + socket.username + ': ' + data);
	  });
  }
};

function closeSocket(socket) {
	commands.handleUpdateChatRooms(socket, socketsObject, chatRooms);
	delete socketsObject[socket.username];
	console.log(Object.keys(socketsObject));
	console.log(chatRooms);
};

function newSocket(socket) {
  socket.usernameSet = false;
  socket.chatRoom = 'NONE';
	socket.write('- Welcome to Chaty\n');
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

var server = net.createServer(newSocket);

server.on('error', function(err){
	console.log('------------------there was an error : server');
});

server.listen(8888);
