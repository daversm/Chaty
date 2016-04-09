import React from 'react';
import { render } from 'react-dom';


var Chaty = React.createClass({
  getInitialState: function(){
    return({currentChatRoom:'NONE', userName:''});
  },
  render:function(){
    return (
      <div className="chatBox">
        <div className="chatRooms"></ div>
        <div className="typingBox"></ div>
      </ div>
    );
  }
});

render(
<Chaty />,
document.getElementById('chatyDiv')
);
