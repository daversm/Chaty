module.exports = {

  checkIfUsernameChatRoomSet: function(socket){
    if (!socket.usernameSet){
      socket.write('- Pick a username:\n');
    }
    else if(socket.chatRoom === 'NONE'){
      socket.write('- Pick a chat room (use !ROOMS to see all rooms):\n');

    }
  },

  handleLeave: function(socket, chatRooms, socketsObject){
    if(socket.chatRoom !== 'NONE'){
    	socket.write('- Left room: ' + socket.chatRoom + '\n');
			var indexOfuserInRoom = chatRooms[socket.chatRoom].indexOf(socket.username);
			chatRooms[socket.chatRoom].splice(indexOfuserInRoom,1);
			var currentRoom = socket.chatRoom;
			socket.chatRoom = 'NONE';
			console.log(currentRoom);
			chatRooms[currentRoom].forEach(function(user){
				console.log(user);
				socketsObject[user].write('- '+ socket.username + ' LEFT the room\n');
			});
		}else{
			socket.write('- You are not in any room currently\n');
		}
		this.checkIfUsernameChatRoomSet(socket);
  },

  handleBye: function(socket, socketsObject, chatRooms){
    this.handleUpdateChatRooms(socket, socketsObject, chatRooms);
    socket.write('- Disconnected with Chaty!\n');
    socket.end();
  },

  handleRooms: function(socket, chatRooms){
    socket.write('- Active chat rooms: \n');
    Object.keys(chatRooms).forEach(function(key){
      socket.write('-   ' +  key + '(' + chatRooms[key].length + ')' + '\n');
    });
    socket.write('- End of list \n');
    this.checkIfUsernameChatRoomSet(socket);
  },

  handleUpdateChatRooms: function(socket, socketsObject, chatRooms){
    if(socket.chatRoom !== 'NONE'){
			var indexOfuserInRoom = chatRooms[socket.chatRoom].indexOf(socket.username);
			chatRooms[socket.chatRoom].splice(indexOfuserInRoom,1);
			var currentRoom = socket.chatRoom;
			socket.chatRoom = 'NONE';
			chatRooms[currentRoom].forEach(function(user){
				socketsObject[user].write('- '+ socket.username + ' LEFT the room\n');
			});
		}
  }

};
