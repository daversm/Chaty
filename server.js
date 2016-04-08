var net 			= require('net');
var SocketsObject 	= {};
var chatRooms = {gibson:[], fender:[]};
const commands 	= require('./app/helpers/handleCommands.js');

function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}


function receiveData(socket, data) {

	var cleanData = cleanInput(data);
	if(cleanData === "!BYE") {
		commands.handleBye(socket);
	}
	else if(cleanData === "!LEAVE") {
		commands.handleLeave(socket, chatRooms, SocketsObject, false);
	}
  else if(cleanData === "!ROOMS") {
    commands.handleRooms(socket, chatRooms);
	}
	else if (!socket.usernameSet){
    if(cleanData in SocketsObject){
      socket.write('- Username already being used\n');
    }else{
      socket.write('- howdy: ' + cleanData + '\n');
      socket.username = cleanData;
      SocketsObject[cleanData] = socket;

      socket.usernameSet = true;
    }
    checkIfUsernameChatRoomSet(socket);
  }
  else if(socket.chatRoom === 'NONE'){
    if(! (cleanData in chatRooms)){
      socket.write('- Chat room -' + cleanData + '- not found\n');
      checkIfUsernameChatRoomSet(socket);
    }else{
      socket.chatRoom === cleanData;

			chatRooms[cleanData].forEach(function(user){
				SocketsObject[user].write('- '+ socket.username + ' ENTERED the room\n');
			});

      chatRooms[cleanData].push(socket.username);
      socket.chatRoom = cleanData;
      socket.write('- Entering room: ' + cleanData + '\n');


      checkIfUsernameChatRoomSet(socket);
			console.log(SocketsObject);
			console.log(chatRooms);
    }
  }
  else{
    sendMsgToAllUsers(socket, data);
  }
};

function sendMsgToAllUsers(socket, data){
  var usersInRoom = chatRooms[socket.chatRoom];
  usersInRoom.forEach(function(user){
    console.log(user);

    var socketInRoom = SocketsObject[user];
    socketInRoom.write('- ' + socket.username + ': ' + data);
  });

};

function checkIfUsernameChatRoomSet(socket){
  if (!socket.usernameSet){
    socket.write('- Pick a username:\n');
  }
  else if(socket.chatRoom === 'NONE'){
    socket.write('- Pick a chat room (use !ROOMS to see all rooms):\n');

  }
}

function closeSocket(socket) {
	if(socket.charRoom !== 'NONE'){
		commands.handleLeave(socket, chatRooms, SocketsObject, true);
	}
	delete SocketsObject[socket.username];
	console.log(SocketsObject);
	console.log(chatRooms);
};


function newSocket(socket) {
  //console.log("new Connection");
  socket.usernameSet = false;
  socket.chatRoom = 'NONE';

	socket.write('- Welcome to Chaty\n');
  socket.write('- Pick a username: \n');


	socket.on('data', function(data) {
		receiveData(socket, data);
	});

	socket.on('end', function() {
		closeSocket(socket);
	});

};

var server = net.createServer(newSocket);

server.listen(8888);
