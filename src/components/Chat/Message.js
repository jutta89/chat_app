import React, { Component } from 'react';

class Message extends Component {
    render () {
        return (
            <div>
                <p className="chat-user">{ this.props.author }</p>
                <p>{ this.props.message }</p>
            </div>
        );
    }
}

export default Message;