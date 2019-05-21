import React, { Component } from "react";
import { connect } from "react-redux";

import { 
  MDBCard, 
  MDBCardBody, 
  MDBIcon, 
  MDBBadge, 
  MDBDropdown, 
  Animation,
  MDBDropdownToggle, 
  MDBDropdownMenu, 
  MDBDropdownItem } from "mdbreact";

import { showPanel } from "../../actions/authentication";
import { updateAllMessages, addNewUnreadMessage } from "../../actions/chat";

// IMAGES
import man from "../../img/user.png";

Number.prototype.padLeft = function(base, chr) {
  var len = String(base || 10).length - String(this).length + 1;
  return len > 0 ? new Array(len).join(chr || "0") + this : this;
};

class Chat extends Component {
    state = {
        user: {},
        messageContent: "",
        showDropMenu: false,
        lastMessage: null,
        images: {},
        imagesChecked: false
    };

    componentDidMount = () => {
        this.props.localPanel(true);
        this.scrollToBottom();
    };

    componentDidUpdate() {
        this.scrollToBottom();
    }

    getImage = (email) => {
        return 'https://e-chatapp.pl:3111/photos/'+email+'/'+email+'.jpg?' + new Date().getTime();
    }

    setAvatar = (email) => {
        const imageUrl = 'https://e-chatapp.pl:3111/photos/'+email+'/'+email+'.jpg?' + new Date().getTime();
        const img = new Image();
        img.onload = () => { this.setState({images: {...this.state.images, [email]: true}})};
        img.onerror = () => { this.setState({images: {...this.state.images, [email]: false}})};
        img.src = imageUrl;
    }

    onUserSelect = user => {
        const lastMessage = this.getLastMessage(user);
        this.setState({
            user: {
            ...user
            },
            lastMessage: lastMessage
    });

    this.setAvatar(user);
    this.messageRead(lastMessage)
    this.props.addNewUnreadMessage(user.email, false);
    };

    getLastMessage = (user) => {
        const messages = this.props.allMessages[user.email]
            ? this.props.allMessages[user.email]
                .map(message => JSON.parse(message))
                .sort((a, b) => this.compare(a, b))
            : [];

        if (messages && messages.length > 0) {
            return messages[messages.length - 1];
        }

        return null;
    }

    messageRead = message => {
        if (!message || message.sendUser === this.props.localUser.email) {
            return;
        }
        const request = {
            TODO: "WAS_SHOWED",
            recivedUser: message.recivedUser,
            sendUser: message.sendUser,
            message: message.message,
            timeStamp: this.formatDate(new Date())
        }
        console.log(request);
        
        this.props
            .webSocketHandler()
            .getter()
            .json(request);

        this.props.addNewUnreadMessage(message.sendUser, false);
    }

    compare = (a, b) => {
        if (a.timeStamp < b.timeStamp) return -1;
        if (a.timeStamp > b.timeStamp) return 1;
        return 0;
    };

    onTextChange = event => {
        this.setState({
            messageContent: event.target.value
        });
    };

    formatDate = date => {
        return `${date.getFullYear()}-${(
            date.getMonth() + 1
        ).padLeft()}-${date
            .getDate()
            .padLeft()} ${date
            .getHours()
            .padLeft()}:${date
            .getMinutes()
            .padLeft()}:${date.getSeconds().padLeft()}.0`;
        };

    onSubmitClick = event => {
        event.preventDefault(); 
        if (!this.state.messageContent) {
            return;
        }

        const newMessage = `{"timeStamp":"${this.formatDate(
            new Date()
        )}","recivedUser":"${this.state.user.email}","sendUser":"${
            this.props.localUser.email
        }","message":"${this.state.messageContent}"}`;

        const oldMessagesForUser = this.props.allMessages[this.state.user.email] ? this.props.allMessages[this.state.user.email] : [];

        const messagesForUser = [
            ...oldMessagesForUser,
            newMessage
        ];

        const oldAllMessages = this.props.allMessages ? this.props.allMessages : {};

        const updateMessages = {
            ...oldAllMessages,
            [this.state.user.email]: messagesForUser
        };

        this.props.updateAllMessages(updateMessages);

        this.addMessage(this.state.messageContent);
        this.setState({
            messageContent: ""
        });
    };

    addMessage = message => {
        const request = {
            TODO: "MESSAGE",
            recivedUser: this.state.user.email,
            sendUser: this.props.localUser.email,
            message: message
        };
        this.props
            .webSocketHandler()
            .getter()
            .json(request);
    };

    removeMessages = email => {
        const request = {
            TODO: "DELETE_ALL_MESSAGE",
            firstUser: this.props.localUser.email,
            secondUser: email
        };

        this.props
            .webSocketHandler()
            .getter()
            .json(request);
            console.log(request);
            this.removeMessagesFromView(email);
        };

        removeMessagesFromView = email => {
            const { [email]: value, ...result } = this.props.allMessages;
            this.props.updateAllMessages(result);
        };

        scrollToBottom() {
            const scrollHeight = this.messageList.scrollHeight;
            const height = this.messageList.clientHeight;
            const maxScrollTop = scrollHeight - height;
            this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }

        applyStyle = (element, myMessage, text) => {
            const newClassName = myMessage
                ? `my-message-${element}`
                : `friend-message-${element}`;
            return <span className={newClassName}> {text} </span>;
        };

        onInputFocus = () => {
            const lastMessage = this.getLastMessage(this.state.user);

            if (lastMessage && JSON.stringify(this.state.lastMessage) !== JSON.stringify(lastMessage) && lastMessage.recivedUser === this.props.localUser.email) {
                this.messageRead(lastMessage);
                this.setState({
                lastMessage: lastMessage
                });
        }
    }

    render() {
        if (this.props.friends && this.props.friends.length > 0 && !this.state.imagesChecked) {
            this.props.friends.forEach(friend => {
                const friendObject = JSON.parse(friend);
                this.setAvatar(friendObject.email);
            });
            this.setState({
                imagesChecked: true
            })
            this.setAvatar(this.props.localUser.email);
        }

        const newMessages =   <MDBBadge color="success">
                                <MDBIcon fab icon="envelope" />
                                </MDBBadge>;

        const friends =
            this.props.friends &&
            this.props.friends.map((friend, index) => {
            const friendObject = JSON.parse(friend);
            return (
                <MDBCardBody
                    className={
                        friendObject.email === this.state.user.email
                        ? "card-body-user user--active"
                        : "card-body-user user--disabled" 
                    }
                    onClick={() => this.onUserSelect(friendObject)}
                    key={index}
                >
                    <img src={this.state.images[friendObject.email] ? this.getImage(friendObject.email) : man} className="chat-list__img" alt={friendObject.name} />
                    <span className="chat-list__label">{this.props.friendsMessages[friendObject.email] ? newMessages : null } {friendObject.name} </span>
                    <MDBDropdown className="chat-list__button">
                        <MDBDropdownToggle caret color="">
                        <MDBIcon icon="ellipsis-h" />
                        </MDBDropdownToggle>
                        <MDBDropdownMenu basic>
                            <MDBDropdownItem onClick={() => this.removeMessages(friendObject.email)}>Usuń wiadomości</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBCardBody>
            );
        });

        if (
            Object.keys(this.state.user).length === 0 &&
            this.props.friends &&
            this.props.friends.length > 0
            ) {
                this.onUserSelect(JSON.parse(this.props.friends[0]));
            }

        const messages = this.props.allMessages[this.state.user.email]
            ? this.props.allMessages[this.state.user.email]
                .map(message => JSON.parse(message))
                .sort((a, b) => this.compare(a, b))
            : [];
        
        const messageList = messages.map((message, index) => {

            const myMessage = message.sendUser === this.props.localUser.email;

            const name = this.applyStyle(
            "name",
            myMessage,
            myMessage ? this.props.localUser.name : this.state.user.name
            );
            const date = this.applyStyle("date", myMessage, message.timeStamp.slice(0, 16));
            
            const content = this.applyStyle("message", myMessage, message.message);

            return (
                <MDBCardBody
                    className={
                    myMessage
                        ? "card-body-message my-message"
                        : "card-body-message friend-message"
                    }
                    key={index}
                >
                    <div className="my-message-avatar-hld">
                    <img src={this.state.images[message.sendUser] ? this.getImage(message.sendUser) : man} className="my-message-avatar" alt="avatar" /> {name}
                    </div>
                    {date}
                    {content}
                </MDBCardBody>
            );
        });

        const messageForm = this.state.user.email ? (this.state.user.HAS_ME_IN_FRIENDS ? (
            <form onSubmit={event => this.onSubmitClick(event)}>
                <input
                    className="message-input"
                    type="text"
                    onChange={this.onTextChange}
                    value={this.state.messageContent}
                    onFocus={this.onInputFocus}
                />
                <button
                    className="site-btn site-btn--round site-btn--message-send"
                    type="submit"
                />
            </form>
        ):
        (<input
            className="message-input"
            type="text"
            value="Nie jesteś już znajomym z tym użytkownikiem"
            disabled
        />)): "Nie masz jeszcze znajomych - rozpocznij nową rozmowę!";

        const messageClassName = this.props.friends && this.props.friends.length > 0
            ? "col col-md-12 container-chat-hld"
            : "col col-md-12";

        return (
            <Animation type="slideInUp">
                <div className="first-section l-section-chat">
                    <div className={messageClassName}>
                    {this.props.friends && this.props.friends.length > 0 ? (
                        <div className="sidebar">
                        <MDBCard className="w-100 mb-5 pt-4 pb-4"> {friends} </MDBCard>
                        </div>
                    ) : null}
                    <MDBCard className="w-100 mb-5 pt-4 pb-4 message-list-hld">
                        <div
                            className="message-list"
                            ref={div => {
                                this.messageList = div;
                            }}
                            >
                            {messageList}
                            </div>
                            <div className="message-send lead pb-4 px-4">
                            {this.props.friends && this.props.friends.length > 0
                                ? this.state.user.email
                                ? messageForm
                                : null
                                : "Nie masz jeszcze rozmów"}
                        </div>
                    </MDBCard>
                    </div>
                </div>
            </Animation>
        );
    }
    }

    const mapDispatchToProps = dispatch => {
        return {
        localPanel: on => dispatch(showPanel(on)),
        updateAllMessages: messages => dispatch(updateAllMessages(messages)),
        addNewUnreadMessage: (email, hasMessages) => dispatch(addNewUnreadMessage(email, hasMessages))
        };
    };

    const mapStateToProps = state => ({
        localUser: state.authentication.loggedUser,
        friends: state.chat.friends,
        allMessages: state.chat.allMessages,
        friendsMessages: state.chat.friendsMessages
    });

    export default connect(mapStateToProps,mapDispatchToProps)(Chat);
