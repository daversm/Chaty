module.exports = {
  checkIfUsernameChatRoomSet: function(socket){
    if(socket.isWebSocket === true){
      if (!socket.usernameSet){
        socket.emit('chat message imp', 'Pick a username');
      }
      else if(socket.chatRoom === 'NONE'){
        socket.emit('chat message imp', 'Click a chat room from the rooms section');
      }
    }else{
      if (!socket.usernameSet){
        socket.write('- Pick a username:\n');
      }
      else if(socket.chatRoom === 'NONE'){
        socket.write('- Pick a chat room (use !ROOMS to see all rooms):\n');
      }
    }
  },

  setUsername: function(cleanData, socket, socketsObject){
    if(socket.isWebSocket === true){
      if(cleanData in socketsObject){
        socket.emit('chat message imp', 'The username - '+ cleanData + ' - is taken');
      }else{
        socket.emit('chat message', 'Alrighty your username : ' + cleanData);
        socket.username = cleanData;
        socketsObject[cleanData] = socket;
        socket.usernameSet = true;
      }
    }else{
      if(cleanData in socketsObject){
        socket.write('- Username already being used\n');
      }else{
        socket.write('- howdy: ' + cleanData + '\n');
        socket.username = cleanData;
        socketsObject[cleanData] = socket;
        socket.usernameSet = true;
      }
    }

    this.checkIfUsernameChatRoomSet(socket);
  },

  setChatroom: function(cleanData, socket, socketsObject, chatRooms, io){
    if(socket.isWebSocket === true){
      if(! (cleanData in chatRooms)){
        socket.emit('chat message imp', 'error entering room');
        this.checkIfUsernameChatRoomSet(socket);
      }else{
        socket.chatRoom === cleanData;

  			chatRooms[cleanData].forEach(function(user){
          if(socketsObject[user].isWebSocket === true){
            socketsObject[user].emit('chat message imp', socket.username + ' ENTERED the room');
          }else{
  				  socketsObject[user].write('- '+ socket.username + ' ENTERED the room\n');
          }
  			});

        chatRooms[cleanData].push(socket.username);
        socket.chatRoom = cleanData;
        socket.emit('chat message imp', 'You are now in room: ' + cleanData);

        this.checkIfUsernameChatRoomSet(socket);
  			console.log(Object.keys(socketsObject));
  			console.log(chatRooms);
      }
    }else{
      if(! (cleanData in chatRooms)){
        socket.write('- Chat room -' + cleanData + '- not found\n');
        this.checkIfUsernameChatRoomSet(socket);
      }else{
        socket.chatRoom === cleanData;

  			chatRooms[cleanData].forEach(function(user){
          if(socketsObject[user].isWebSocket){
            console.log('YUP YUP YUP');
            socketsObject[user].emit('chat message imp', socket.username + ' ENTERED the room');
          }else{
  				  socketsObject[user].write('- '+ socket.username + ' ENTERED the room\n');
          }
  			});

        chatRooms[cleanData].push(socket.username);
        socket.chatRoom = cleanData;
        socket.write('- You are now in room: ' + cleanData + ' (use !USERS to see active users)\n');

        this.checkIfUsernameChatRoomSet(socket);
  			console.log(Object.keys(socketsObject));
  			console.log(chatRooms);
      }
    }
    io.emit('chatRoomsList', chatRooms);
  }

};
