import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';


var Chaty = React.createClass({
  getInitialState: function(){
    this.arrayOfMsg = [];
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
  render:function(){

    return (
      <div className="main">
        <div className="title">talkin folk</div>
        <div className="chatBox">
          <div className="chatRooms"></ div>
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
