import React, { Component } from 'react';
import { Animation } from "mdbreact";

class BubbleChat extends Component {

    render () {
        return (
            <Animation type="fadeIn" duration="1s">

                <div className="bubble">
                    {this.props.children}
                </div>
            </Animation>
        );
    }
}

export default BubbleChat;