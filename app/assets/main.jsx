import React from 'react';
import ReactDOM from 'react-dom';
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
  componentDidUpdate: function() {
    this.refs.dialog.scrollTop = this.refs.dialog.scrollHeight;
  },
  componentDidMount: function(){
    this.socket = io();
    var out = this;

    this.socket.on('chat message', function(msg){

      out.handleUpdateMsgs(msg);
    });

    this.socket.on('chat message imp', function(msg){

      out.handleUpdateMsgsImp(msg);
    });



    this.socket.on('chatRoomsList', function(rooms){
      out.arrayOfRooms = Object.keys(rooms).map(function(room){
        return (
          <Rooms title={room} count={rooms[room].length} handleClick={out.handleSelectRoom} />
        )
      });
      out.forceUpdate();
    });

  },
  handleSend: function(e){
    e.preventDefault();
    if(this.state.msg !== ""){
      this.setState({msg:''});
      this.socket.emit('chat message', this.state.msg );
    }
  },
  handleInput: function(e){
    this.setState({msg:e.target.value});
  },
  handleUpdateMsgs: function(msg){
    this.arrayOfMsg.push(msg);
    this.arrayOfMsgToRender = this.arrayOfMsg.map(function(m){
      return(
        <div className="txt">> {m}</div>
      )
    });
    this.forceUpdate();
  },
  handleUpdateMsgsImp: function(msg){
    this.arrayOfMsg.push(msg);
    this.arrayOfMsgToRender = this.arrayOfMsg.map(function(m){
      return(
        <div className="txt">> {m}</div>
      )
    });
    this.forceUpdate();
  },
  handleSelectRoom(room){
    //console.log("clicked");
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
            <div ref='dialog' key='dialog' className="dialog">
              {this.arrayOfMsgToRender}
            </div>
            <form className="userType" onSubmit={this.handleSend}>
              <input
                type="text"
                placeholder="You:"
                label="email"
                value={this.state.msg}
                onChange={this.handleInput}
              />
              <input id="doneButton" type="submit" value="send" />
            </form>
          </ div>
        </ div>
      </ div>
    );
  }
});

ReactDOM.render(
  <Chaty />,
  document.getElementById('chatyDiv')
);
