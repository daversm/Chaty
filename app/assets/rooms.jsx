import React from 'react';

module.exports = React.createClass({
  getInitialState: function(){
    return({title:this.props.title, count:this.props.count});
  },
  render: function(){
    return(
      <div className="roomButton">{this.props.title + " : "+ this.props.count}</div>
    )
  }
});
