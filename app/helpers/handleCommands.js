module.exports = {

  checkIfUsernameChatRoomSet: function(socket){
    if (!socket.usernameSet){
      socket.write('- Pick a username:\n');
    }
    else if(socket.chatRoom === 'NONE'){
      socket.write('- Pick a chat room (use !ROOMS to see all rooms):\n');
    }
  },
  handlePrivate: function(socket, socketsObject, chatRooms, cleanData){
    var arrayOfData = cleanData.split(" ");
    var sendToUser = arrayOfData[1];
    if(socket.usernameSet === false || socket.chatRoom === 'NONE'){
      socket.write('- Must be in a room to send private message\n')
      this.checkIfUsernameChatRoomSet(socket);
    }
    else if(chatRooms[socket.chatRoom].indexOf(sendToUser) != -1){
      var msg = arrayOfData.slice(2, arrayOfData.length).join(" ");
      socketsObject[sendToUser].write('- PRIVATE message from ' + socket.username + ': ' + msg +'\n' );
    }
    else{
      socket.write('- user: ' + sendToUser + ' is not in this room\n');
    }
  },

  handleLeave: function(socket, chatRooms, socketsObject, io){
    if(socket.isWebSocket === true){
      if(socket.chatRoom !== 'NONE'){
      	socket.emit('chat message', 'Left room: ' + socket.chatRoom);
  			var indexOfuserInRoom = chatRooms[socket.chatRoom].indexOf(socket.username);
  			chatRooms[socket.chatRoom].splice(indexOfuserInRoom,1);
  			var currentRoom = socket.chatRoom;
  			socket.chatRoom = 'NONE';
  			console.log(currentRoom);
  			chatRooms[currentRoom].forEach(function(user){
  				console.log(user);
          if(socketsObject[user].isWebSocket === true){
            socketsObject[user].emit('chat message imp', socket.username + ' LEFT the room');
          }else{
  				  socketsObject[user].write('- '+ socket.username + ' LEFT the room\n');
          }
  			});
  		}
    }else{
      if(socket.chatRoom !== 'NONE'){
      	socket.write('- Left room: ' + socket.chatRoom + '\n');
  			var indexOfuserInRoom = chatRooms[socket.chatRoom].indexOf(socket.username);
  			chatRooms[socket.chatRoom].splice(indexOfuserInRoom,1);
  			var currentRoom = socket.chatRoom;
  			socket.chatRoom = 'NONE';
  			console.log(currentRoom);
  			chatRooms[currentRoom].forEach(function(user){
  				console.log(user);
          if(socketsObject[user].isWebSocket === true){
            socketsObject[user].emit('chat message imp', socket.username + ' LEFT the room');
          }else{
  				  socketsObject[user].write('- '+ socket.username + ' LEFT the room\n');
          }
  			});
  		}else{
  			socket.write('- You are not in any room currently\n');
		  }

      this.checkIfUsernameChatRoomSet(socket);
    }
    io.emit('chatRoomsList', chatRooms);

  },

  handleBye: function(socket, socketsObject, chatRooms, io){
    this.handleUpdateChatRooms(socket, socketsObject, chatRooms, io);
    socket.write('- Disconnected with Chaty!\n');
    socket.end();
  },
  handleHelp: function(socket){
    socket.write('- !BYE : exit chaty \n');
		socket.write('- !LEAVE : leave a chat room \n');
    socket.write('- !USERS : list of users in room \n');
		socket.write('- !ROOMS : list of rooms \n');
		socket.write('- !HELP : list of commands \n');
    this.checkIfUsernameChatRoomSet(socket);
  },
  handleUsers: function(socket, chatRooms){
    if(socket.chatRoom !== 'NONE'){
      socket.write('- List of users in room\n');
      chatRooms[socket.chatRoom].forEach(function(user){
        socket.write('-   ' + user + '\n');
      });
      socket.write('- End of list\n');
    }else{
      socket.write('- Need to be in a chat room to see users\n');
      this.checkIfUsernameChatRoomSet(socket);
    }
  },

  handleRooms: function(socket, chatRooms){
    socket.write('- Active chat rooms: \n');
    Object.keys(chatRooms).forEach(function(key){
      socket.write('-   ' +  key + '(' + chatRooms[key].length + ')' + '\n');
    });
    socket.write('- End of list \n');
    this.checkIfUsernameChatRoomSet(socket);
  },

  handleUpdateChatRooms: function(socket, socketsObject, chatRooms, io){
    if(socket.chatRoom !== 'NONE'){
			var indexOfuserInRoom = chatRooms[socket.chatRoom].indexOf(socket.username);
			chatRooms[socket.chatRoom].splice(indexOfuserInRoom,1);
			var currentRoom = socket.chatRoom;
			socket.chatRoom = 'NONE';
			chatRooms[currentRoom].forEach(function(user){
        if(socketsObject[user].isWebSocket){
  				socketsObject[user].emit('chat message imp', socket.username + ' LEFT the room');
  			}else{
				  socketsObject[user].write('- '+ socket.username + ' LEFT the room\n');
        }
			});
		}
    io.emit('chatRoomsList', chatRooms);
  }

};
