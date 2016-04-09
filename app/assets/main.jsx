import React from 'react';
import { render } from 'react-dom';

var Chaty = React.createClass({
  getInitialState: function(){
    return({currentChatRoom:'NONE', userName:''});
  },
  render:function(){
    return (
      <div>
        <div className="chatRooms"></ div>
        <div className="typingBox"></ div>
      </ div>
    );
  }
});

ReactDOM.render(
<Chaty />,
document.getElementById('chatyDiv')
);
