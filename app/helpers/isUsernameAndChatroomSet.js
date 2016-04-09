module.exports = {
  checkIfUsernameChatRoomSet: function(socket){
    if (!socket.usernameSet){
      socket.write('- Pick a username:\n');
    }
    else if(socket.chatRoom === 'NONE'){
      socket.write('- Pick a chat room (use !ROOMS to see all rooms):\n');
    }
  },

  setUsername: function(cleanData, socket, socketsObject){
    if(cleanData in socketsObject){
      socket.write('- Username already being used\n');
    }else{
      socket.write('- howdy: ' + cleanData + '\n');
      socket.username = cleanData;
      socketsObject[cleanData] = socket;
      socket.usernameSet = true;
    }

    this.checkIfUsernameChatRoomSet(socket);
  },

  setChatroom: function(cleanData, socket, socketsObject, chatRooms){
    if(! (cleanData in chatRooms)){
      socket.write('- Chat room -' + cleanData + '- not found\n');
      this.checkIfUsernameChatRoomSet(socket);
    }else{
      socket.chatRoom === cleanData;

			chatRooms[cleanData].forEach(function(user){
				socketsObject[user].write('- '+ socket.username + ' ENTERED the room\n');
			});

      chatRooms[cleanData].push(socket.username);
      socket.chatRoom = cleanData;
      socket.write('- Entering room: ' + cleanData + '\n');

      this.checkIfUsernameChatRoomSet(socket);
			console.log(Object.keys(socketsObject));
			console.log(chatRooms);
    }
  }

};
