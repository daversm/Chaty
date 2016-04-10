import React from 'react';
import { render } from 'react-dom';


var Chaty = React.createClass({
  getInitialState: function(){
    return({currentChatRoom:'NONE', userName:''});
  },
  render:function(){
    return (
      <div className="main">
        <div className="title">talkin folk</div>
        <div className="chatBox">
          <div className="chatRooms"></ div>
          <div className="typingBox">
            <div className="dialog"></div>
            <div className="userType">
              <input
                type="text"
                placeholder="username:"
                label="email"
                value={this.state.email}
                onChange={this.handleUserNameChange}
              />
            <input id="doneButton" type="submit" value="send" />
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
