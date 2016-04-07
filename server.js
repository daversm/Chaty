var net = require('net');
var rl = require('readline');
var sockets = {};
var chatRooms = {gibson:[], fender:[]};

function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}


function receiveData(socket, data) {

	var cleanData = cleanInput(data);
	if(cleanData === "!BYE") {
    socket.write('- Disconnected with Chaty!\n');
    socket.end();
	}
  else if(cleanData === "!ROOMS") {
    socket.write('- Active chat rooms: \n');
    Object.keys(chatRooms).forEach(function(key){
      socket.write('-   ' +  key + '(' + chatRooms[key].length + ')' + '\n');
    });
    socket.write('- End of list \n');
    checkIfUsernameChatRoomSet(socket);
	}
	else if (!socket.usernameSet){
    if(cleanData in sockets){
      socket.write('- Username already being used\n');
    }else{
      socket.write('- howdy: ' + cleanData + '\n');
      socket.username = cleanData;
      sockets[cleanData] = socket;

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
      chatRooms[cleanData].push(socket.username);
      socket.chatRoom = cleanData;
      console.log(chatRooms);
      socket.write('- Entering room: ' + cleanData + '\n');

      checkIfUsernameChatRoomSet(socket);
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

    var socketInRoom = sockets[user];
    socketInRoom.write(socket.username + ': ' + data);
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
	var i = sockets.indexOf(socket);
	if (i != -1) {
		sockets.splice(i, 1);
	}
};


function newSocket(socket) {
  console.log("new Connection");
  socket.id = Math.random() * 1000;
  socket.usernameSet = false;
  socket.chatRoom = 'NONE';

	socket.write('- Welcome to Chaty\n');
  socket.write('- Pick a username: \n');


	socket.on('data', function(data) {
		receiveData(socket, data);
	});
  /*
	socket.on('end', function() {
		closeSocket(socket);
	});

  socket.write('Your Id is: ' + socket.id);
  */
};

var server = net.createServer(newSocket);

server.listen(8888);
