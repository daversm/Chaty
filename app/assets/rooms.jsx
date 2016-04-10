import React from 'react';

module.exports = React.createClass({
  getInitialState: function(){
    return({title:this.props.title, count:this.props.count});
  },
  handeClick: function(){
    this.props.handleClick(this.props.title);
  },
  render: function(){
    return(
      <div className="roomButton" onClick={this.handeClick}>{this.props.title + " : "+ this.props.count}</div>
    )
  }
});
