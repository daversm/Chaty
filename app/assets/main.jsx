import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import Rooms from './rooms'


var Chaty = React.createClass({
  getInitialState: function(){
    this.arrayOfMsg = [];
    this.arrayOfRooms = [];
    this.arrayOfMsgToRender = this.arrayOfMsg.map(function(m){
      return(
        <p>{m}</p>
      )
    });
    return( {currentChatRoom:'NONE', userName:'', msg: "" });
  },
  componentDidMount: function(){
    this.socket = io();
    var out = this;

    this.socket.on('chat message', function(msg){
      console.log("recived something");
      out.handleUpdateMsgs(msg);
    });



    this.socket.on('chatRoomsList', function(rooms){
      //console.log(rooms);
      out.arrayOfRooms = Object.keys(rooms).map(function(room){
        return (
          <Rooms title={room} count={rooms[room].length} handleClick={out.handleSelectRoom} />
        )
      });
      out.forceUpdate();
    });

  },
  handleSend: function(){
    this.setState({msg:''});
    this.socket.emit('chat message', this.state.msg );
  },
  handleInput: function(e){
    this.setState({msg:e.target.value});
  },
  handleUpdateMsgs: function(msg){
    this.arrayOfMsg.push(msg);
    this.arrayOfMsgToRender = this.arrayOfMsg.map(function(m){
      return(
        <p className="small">> {m}</p>
      )
    });
    this.forceUpdate();
  },
  handleSelectRoom(room){
    this.socket.emit('selectRoom', room);
  },
  render:function(){

    return (
      <div className="main">
        <div className="title">talkin folk</div>
        <div className="chatBox">
          <div className="chatRooms">
            <p className="large">rooms</p>
            {this.arrayOfRooms}
          </ div>
          <div className="typingBox">
            <div className="dialog">
              {this.arrayOfMsgToRender}
            </div>
            <div className="userType">
              <input
                type="text"
                placeholder="You:"
                label="email"
                value={this.state.msg}
                onChange={this.handleInput}
              />
            <input id="doneButton" type="submit" value="send" onClick={this.handleSend} />
            </div>
          </ div>
        </ div>
      </ div>
    );
  }
});

render(
<Chaty />,
document.getElementById('chatyDiv')
);
