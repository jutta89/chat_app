import React, { Component } from 'react';

class MessageInput extends Component {

    state = {
        text: ""
    }

    onEnterSend = (event) => {
        if(event.keyCode === 13 && event.shiftKey === false) {
            this.sendMessage(event);
        }
    }

    sendMessage = (event) => {
        event.preventDefault(); 
        if (this.state.text.trim().length > 0) {
            this.props.addMessage(this.state.text);
            this.setState({text: ""});
            this.textInput.focus();
        }
    }

    onTextChanged = (event) => {
        this.setState ({
            text: event.target.value
        })
    }

    render () {
        return (
            <form className="" onSubmit={this.sendMessage}>
                <textarea
                    className="chat__input"
                    ref={(input) => { this.textInput = input; }}
                    onChange={this.onTextChanged} value={this.state.text} 
                    name="" type="text" 
                    rows="2" 
                    onKeyDown={this.onEnterSend}>
                    <label></label>
                </textarea>
                <button className="site-btn site-btn--chat" type="submit">
                    Wyslij wiadomość
                </button>
            </form>
        );
    }
}

export default MessageInput;