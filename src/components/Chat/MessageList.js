import React, { Component } from 'react';
import Message from './Message';


class MessageList extends Component {

    mapPosts = (posts) => {
        return posts.map((message, index)=>(
            <Message key={index} message={message.message} author={message.author}/> 
        ))
    }

    render () {
        const Messages = this.props.messages ? this.mapPosts(this.props.messages) : null ; 
        return (
            <div className="">
                { Messages }
            </div>
        );
    }
}

export default MessageList;