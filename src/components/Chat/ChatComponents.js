import React, { Component } from 'react';
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

class ChatComponents extends Component {

    addMessage = (message) => {
        const fullMessage = {
            authorUid: this.props.user.uid,
            targetUid: this.props.targetUid,
            message: message,
            author: this.props.user.displayName,
            timestamp: Date.now()
        }
    }

    render () {
        return (
            <div className="container">
                <div className="container container-chat">
                        <MessageList messages={this.props.messages} />
                        <MessageInput addMessage={(message) => this.props.addMessage(message)}/>
                    </div>
            </div>
        );
    }

};

export default ChatComponents;

