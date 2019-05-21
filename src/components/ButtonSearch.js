import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import socket from 'sockette';

import BubbleChat  from './BubbleChat';
import { MDBAlert } from 'mdbreact';

import { css } from '@emotion/core';

import 'rc-progress/assets/index.css';

import {updateUser} from '../actions/authentication';
import { searchingStart, searchingStop, matchFound, chatOn, addMessage, matchRejected, chatEnd, acceptFriend, clearMatch, loadFriends, updateAllMessages, addNewUnreadMessage, updateAllFriends } from '../actions/chat';

// CHAT
import { 
    Widget, 
    addResponseMessage, 
    toggleWidget, 
    dropMessages } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

// IMAGES
import logo from "../img/user.png";
import CountdownTimer from "react-component-countdown-timer";
import love from '../img/icons/in-love.svg';
import sad from '../img/icons/sad.svg';
import think from '../img/icons/thinking.svg';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class ButtonSearch extends Component {

    componentWillMount() {
        this.props.webSocketHandler().setter(
            new socket(`wss://vps603762.ovh.net:8443/ChatApi/chat/${this.props.localUser.email}`, {
                timeout: 5e3,
                maxAttempts: 3,
                onopen: e => this.onOpen(e),
                onmessage: e => this.onMessage(e),
                onreconnect: e => this.onReconnect(e),
                onmaximum: e => console.log('Stop Attempting!', e),
                onclose: e => this.onClose(e),
                onerror: e => this.onError(e)
            }))
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.handleWindowBeforeUnload);
        window.addEventListener("unload", this.handleWindowUnload);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.handleWindowBeforeUnload);
        window.removeEventListener("unload", this.handleWindowUnload);
    }

    handleWindowBeforeUnload = (event) => {
        if (this.props.chatOn) {
            event.returnValue = 'Uwaga! Przeładowanie strony spowoduje przerwanie rozmowy!';
            return 'Uwaga! Przeładowanie strony spowoduje przerwanie rozmowy!';
        }
    }

    handleWindowUnload = () => {
        this.props.webSocketHandler().getter().close(1000);
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            info: 'Szukanie'
        }
    }

    state = {
        messageAccept: null,
        messageNoAccept: null,
        messageAdd: null,
        messageAcceptFail: null,
        messageAcceptFriend: null,
        messageFriendNoAccept: null,
        imageLoaded: false
    }

    setAvatar = () => {
        if (this.props.match) {
            const img = new Image();
            img.onload = () => { this.setState({imageLoaded: true})};
            img.onerror = () => { this.setState({imageLoaded: false})};
            img.src = this.getImage();
        }
    }

    onClickSearch = (event) => {
        if (this.props.searching) {
            const request = {
                TODO: 'GET_USER',
                want: false
            }
            this.props.webSocketHandler().getter().json(request);
            this.props.searchingStop();
            this.props.clearMatch();
            return;
        }
        const request = {
            TODO: 'GET_USER',
            want: true
        }
        this.props.webSocketHandler().getter().json(request);
        this.props.searchingStart();
    }

    onOpen = (e) => {
        console.log('Connected!', e);
        const request = {
            TODO: 'WELCOME',
            email: this.props.localUser.email,
            password: this.props.localUser.password,
        }
        this.props.webSocketHandler().getter().json(request);
    }

    onClose = (e) => {
        console.log('Close!', e);
        this.props.searchingStop();
        this.props.clearMatch();
    }

    onError = (e) => {
        console.log('Error!', e);
        this.props.searchingStop();
        this.props.clearMatch();
    }

    onReconnect = (e) => {
        console.log('Reconnecting...', e);
    }

    onMessage = (e) => {
        console.log('Received', e);
        const response = JSON.parse(e.data);
        if (response.TODO === 'WELCOME') {
            const friends = response.friends;
            delete response.TODO;
            delete response.friends;
            const friendsMessages = {};
            if(friends !== undefined) {
            friends.forEach(friend => {
                const friendObject = JSON.parse(friend);
                friendsMessages[friendObject.email] = friendObject.HAS_NOT_SHOWED_MESSAGES;
            })
            }
            this.props.loadFriends(friends, response, friendsMessages);
            return;
        }
        if (response.TODO === 'GET_USER') {
            this.props.matchFound(response);
            return;
        }
        if (response.TODO === 'START_DATING') {
            this.props.setChatOn();
            toggleWidget();
            dropMessages();
            return;
        }
        if (response.TODO === 'STOP_DATING') {
            this.props.matchRejected();
            this.setState ({
                message: 'Osoba odrzuciła rozmowę'
            });
            setTimeout( () => 
                this.setState ({
                    message: null,
                }),
            5000 );
            return;
        }
        if (response.TODO === 'MESSAGE') {
            const message = {
                author: response.sendUser,
                message: response.message,
                date: this.formatDate(new Date())
            }
            this.props.addMessage(message);
            if (this.props.match && message.author === this.props.match.email) {
                addResponseMessage(response.message)
                return;
            }
            const newMessage = `{"timeStamp":"${this.formatDate(new Date())}","recivedUser":"${response.recivedUser}","sendUser":"${response.sendUser}","message":"${response.message}"}`;
            const allMessagesFromUser = this.props.allMessages[response.sendUser] ? this.props.allMessages[response.sendUser] : [];
            const messagesForUser = [...allMessagesFromUser, newMessage];
            const updateMessages = {...this.props.allMessages, [response.sendUser]: messagesForUser};
            this.props.updateAllMessages(updateMessages);
            this.props.addNewUnreadMessage(response.sendUser, true);
            addResponseMessage(response.message)
            return;
        }

        if (response.TODO === 'END_DATING') {
            this.props.chatEnd();
            this.setState({
                timeToEnd: 'koniec czasu'
            });
        }

        if (response.TODO === 'RESULT_POSITIVE') {
            this.updateMessages();
            this.props.clearMatch();
            this.props.acceptFriend();
            this.setState ({
                messageAdd: 'Jeśli Twój rozmówca zakceptował znajomego zostaliście znajomymi. Możesz przejść do zakładki Wiadomości i kontynuować rozmowę!',
            });
            setTimeout( () => 
                this.setState ({
                    messageAdd: null,
                }),
            5000 );
        }

        if (response.TODO === 'RESULT_NEGATIVE') {
            this.props.clearMatch();
            this.props.acceptFriend();
            this.setState ({
                messageAcceptFail: 'Rozmówca nie zakceptował znajomości. Losuj dalej!',
            });
            setTimeout( () => 
                this.setState ({
                    messageAcceptFail: null,
                }),
            5000 );
        }

        if (response.TODO === 'TIME_TO_END') {
            this.setState({
                timeToEnd: response.TIME
            });
        }

        if (response.TODO === 'CHANGE_POSITIVE') {
            const user = { ...this.props.localUser };
            user.countPositiveDating = user.countPositiveDating + 1;
            this.props.updateUser(user);
        }

        if (response.TODO === 'CHANGE_NEGATIVE') {
            const user = { ...this.props.localUser };
            user.countNegativeDating = user.countNegativeDating + 1;
            this.props.updateUser(user);
        }
    }

    // AKCEPTACJA CHATU
    onClickAcceptPerson = (accept) => {
        const request = {
            TODO: 'ACCEPT_BEFORE',
            firstUser: this.props.localUser.email,
            secondUser: this.props.match.email,
            accept: accept
        };
        this.props.webSocketHandler().getter().json(request);
        this.setState ({
            messageAccept: 'Zaakceptowano znajomego! Poczekaj chwilę, jeśli druga osoba zakceptowała rozmowę za chwilę włączy się chat!',
        });
        setTimeout( () => 
            this.setState ({
                messageAccept: null,
            }),
        5000 );
    }

    // ODRZUCENIE CHATU 
    onClickDiscardPerson = () => {        
        this.props.clearMatch();
        this.setState ({
            messageNoAccept: 'Odrzuciłeś rozmowę. Losuj dalej!',
        });
        setTimeout( () => 
        this.setState ({
            messageNoAccept: null,
        }),
        5000 );
    }

    updateMessages = () => {
        if (this.props.messages.length > 0) {
            const newMessages = this.props.messages.map((message) => {
                return `{"timeStamp":"${message.date}","recivedUser":"${message.author === this.props.localUser.name ? this.props.match.email : this.props.localUser.email}","sendUser":"${message.author === this.props.localUser.name ? this.props.localUser.email : this.props.match.email}","message":"${message.message}"}`
            });
            
            const oldMessagesForUser = this.props.allMessages[this.props.match.email] ? this.props.allMessages[this.props.match.email] : [];
            const messagesForUser = [
                ...oldMessagesForUser,
                ...newMessages
            ];
            const oldAllMessages = this.props.allMessages ? this.props.allMessages : {};
            const updateMessages = {
                ...oldAllMessages,
                [this.props.match.email]: messagesForUser
            };
            this.props.updateAllMessages(updateMessages);
        }
        const newFriend = {
            HAS_ME_IN_FRIENDS: true,
            sex: this.props.match.sex,
            urlToImage: this.props.match.urlToImage,
            name: this.props.match.name,
            dateOfBirth: this.props.match.dateOfBirth,
            HAS_NOT_SHOWED_MESSAGES: false,
            email: this.props.match.email,
            aboutMe: this.props.match.aboutMe,
            hobby: this.props.match.hobby
        }

        const oldFriends = this.props.friends ? this.props.friends : [];
        const newFriends = [
            JSON.stringify(newFriend),
            ...oldFriends
        ]
        this.props.updateAllFriends(newFriends)
    }

    closeMessage = (event) => {
        this.setState ({
            messageAccept: null,
            messageNoAccept: null,
            message: null,
            messageAdd: null,
        })   
        return;
    }

    onClickAddPerson = (accept) => {
        const request = {
            TODO: 'ACCEPT_AFTER',
            firstUser: this.props.localUser.email,
            secondUser: this.props.match.email,
            accept: accept
        };
        this.setState ({
            messageAcceptFriend: 'Dodałeś znajomego! Poczekaj chwilę, jeśli druga osoba dodała Cię do znajomych będziesz mógł kontynuować rozmowę w zakładce Wiadomości',
        });
        setTimeout( () => 
            this.setState ({
                messageAcceptFriend: null,
            }),
        5000 );
        this.props.webSocketHandler().getter().json(request);
        this.props.searchingStop();
        if(!accept) {
            this.setState ({
                messageFriendNoAccept: 'Nie zakceptowałeś znajomego... Losuj dalej!',
            });
            setTimeout( () => 
                this.setState ({
                    messageFriendNoAccept: null,
                }),
            5000 );
        }
    }

    addMessage = (message) => {
        const request = {
            TODO: 'MESSAGE',
            recivedUser: this.props.match.email,
            sendUser: this.props.localUser.email,
            message: message,
        }
        this.props.webSocketHandler().getter().json(request);
        const fullMessage = {
            author: this.props.localUser.name,
            message: message,
            date: this.formatDate(new Date())
        }
        this.props.addMessage(fullMessage);
    }

    formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth()+1).padLeft()}-${date.getDate().padLeft()} ${date.getHours().padLeft()}:${date.getMinutes().padLeft()}:${date.getSeconds().padLeft()}.0`;
    }

    handleNewUserMessage = (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
        this.addMessage(newMessage);
    }

    getImage = () => {
        return 'https://e-chatapp.pl:3111/photos/'+this.props.match.email+'/'+this.props.match.email+'.jpg?' + new Date().getTime();
    }

    render () {
        let classNameLabel = 'switch ';
        if (!this.props.searching) {
            classNameLabel += 'switch-searching';
        }
        let classNameButton = 'col col-md-3 site-btn site-btn--search';
        if (this.props.searching) {
            classNameButton += 'col col-md-3 site-btn site-btn--search site-btn--effected';
        }

        const searchingIco = <div class="loading-dots"> Szukanie
                            <div class="loading-dots--dot"></div>
                            <div class="loading-dots--dot"></div>
                            <div class="loading-dots--dot"></div>
                            </div>
        const button = (
                        <button className={classNameButton} onClick={()=>this.onClickSearch()}>
                            <label className={classNameLabel}>
                                <input type="checkbox" checked></input>
                                <span className="slider round"></span>
                            </label>
                            <label>{!this.props.searching ? 'Losuj znajomego!' :  searchingIco }</label>
                        </button>
                        );

        // AKCEPTOWANIE ROZMOWY
        const buttonAccept = <button className="site-btn site-btn--accept site-btn--effected text-center" onClick={()=>this.onClickAcceptPerson(true)}>Akceptuj rozmowę</button>
        ;

        const buttonCancel = <button className="site-btn site-btn--no-accent text-center" onClick={this.onClickDiscardPerson}>Anuluj</button>;

        // AKCEPTOWANIE ZNAJOMEGO PO ROZMOWIE
        const buttonAddAccept = <button className="site-btn site-btn--effected text-center" onClick={()=>this.onClickAddPerson(true)}>Dodaj osobę</button>;

        const buttonAddCancel = <button className="site-btn text-center" onClick={()=>this.onClickAddPerson(false)}>Zakończ znajomość</button>;

        const date = new Date();
        const year = date.getFullYear();

        this.setAvatar();

        const imageFriend = this.props.match ? (this.state.imageLoaded ? <div className="bubble-chat__img-hld">
                                <img className="bubble-chat__img" src={this.getImage()} alt="" />
                            </div>
                            : <div className="bubble-chat__letter-hld"><span></span></div>) : null ;

        const person = 
        <div>
            <h2 className="text-center mb-3">Znaleziono rozmówcę! <img className="content-icon text-center" src={love} alt="icon" /></h2>

            {imageFriend}

            <p className="px-5 mb-1 pb-3 lead medium accent text-center">{ this.props.match ? this.props.match.name : null },&nbsp;  

            { this.props.match ? year - ((this.props.match.dateOfBirth).slice(6, 10) ) : null } </p>
            <p className="px-5 mb-1 pb-3 lead text-center">
                Płeć: { this.props.match ? (this.props.match.sex === 2 ? 'Kobieta' : 'Męzczyzna') : null }
            </p>
            <p className="lead mt-2 mb-1 text-center">
                Po akceptacji czat zacznie się za: 
            </p>
            <div className="text-center mb-3" style={{ margin:'auto', width: 70 }}>
                <CountdownTimer hideDay hideMinute hideHours color="#F5316F" count={10} noPoints secondTitle="sek." />
            </div>

            <div className="buttons-hld">
                { buttonAccept }
                { buttonCancel }
            </div>
        </div>
        ; 

        const addPersonModal = <div>
        <h2 className="text-center mb-3">Czy chcesz kontynuować znajomość? <img className="content-icon text-center" src={think} alt="icon" /></h2>

        {imageFriend}
        
        <p className="text-center">Osoba  <span className="t-accent">{ this.props.match ? this.props.match.name : 'Imię' }</span> zostanie dodana do Twojej listy znajomych</p>

        <div className="buttons-hld">
            { buttonAddAccept }
            { buttonAddCancel }
        </div>
        </div>; 

        const personQuestion = this.props.addPersonModal ? addPersonModal : person;

        return (
                <div className="container container-bottom-fixed">
                    {button}

                    { (this.props.canShowModal && !this.props.chatOn)
                        ? <BubbleChat>{personQuestion}</BubbleChat> 
                        : null }
                    { this.props.chatOn
                        && <Widget
                            title={"Czat z " + this.props.match.name}
                            subtitle={"Czas do końca rozmowy: " + this.state.timeToEnd }
                            senderPlaceHolder="Wpisz wiadomość"
                            autofocus={true}
                            profileAvatar={this.props.match && this.state.imageLoaded ? this.getImage() : logo}
                            titleAvatar={this.props.match && this.state.imageLoaded ? this.getImage() : logo}
                            handleNewUserMessage={this.handleNewUserMessage}
                        />}

                    {this.state.messageAccept ?
                        <div onClick={this.closeMessage}>
                            <MDBAlert dismiss color="success"><strong>Super!</strong> {this.state.messageAccept} <img className="content-icon" src={love} alt="icon" /> </MDBAlert>
                        </div>
                    : null}

                    {this.state.messageAcceptFriend ?
                        <div onClick={this.closeMessage}>
                            <MDBAlert dismiss color="success"><strong>Super!</strong> {this.state.messageAcceptFriend} <img className="content-icon" src={love} alt="icon" /> </MDBAlert>
                        </div>
                    : null}

                    {this.state.messageAcceptFail ?
                        <div onClick={this.closeMessage}>
                            <MDBAlert dismiss color="success"><img className="content-icon" src={sad} alt="icon" /> {this.state.messageAcceptFail} <img className="content-icon" src={love} alt="icon" /> </MDBAlert>
                        </div>
                    : null}

                    {this.state.messageNoAccept ?
                        <div onClick={this.closeMessage}>
                            
                            <MDBAlert dismiss color="warning"> <img className="content-icon" src={sad} alt="icon" /> {this.state.messageNoAccept} </MDBAlert>
                        </div>
                    : null}

                    {this.state.messageFriendNoAccept ?
                        <div onClick={this.closeMessage}>
                            <MDBAlert dismiss color="warning"> <img className="content-icon" src={sad} alt="icon" /> {this.state.messageFriendNoAccept} </MDBAlert>
                        </div>
                    : null}

                    {this.state.messageAdd ?
                        <div onClick={this.closeMessage}>
                            <MDBAlert dismiss color="success"><strong>Super!</strong> {this.state.messageAdd} <img className="content-icon" src={love} alt="icon" /> </MDBAlert>
                        </div>
                    : null}

                    {this.state.message ?
                        <div onClick={this.closeMessage}>
                            <MDBAlert dismiss color="warning">{this.state.message} <img className="content-icon" src={sad} alt="icon" /> </MDBAlert>
                        </div>
                    : null}

            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => dispatch(updateUser(user)),
        searchingStart: () => dispatch(searchingStart()),
        searchingStop: () => dispatch(searchingStop()),
        matchFound: (match) => dispatch(matchFound(match)),
        matchRejected: () => dispatch(matchRejected()),
        setChatOn: () => dispatch(chatOn()),
        chatEnd: () => dispatch(chatEnd()),
        addMessage: (message) => dispatch(addMessage(message)),
        acceptFriend: () => dispatch(acceptFriend()),
        clearMatch: () => dispatch(clearMatch()),
        loadFriends: (friends, allMessages, friendsMessages) => dispatch(loadFriends(friends, allMessages, friendsMessages)),
        updateAllMessages: (allMessages) => dispatch(updateAllMessages(allMessages)),
        addNewUnreadMessage: (email, hasMessages) => dispatch(addNewUnreadMessage(email, hasMessages)),
        updateAllFriends: (friends) => dispatch(updateAllFriends(friends)),
    }
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
    searching: state.chat.searching,
    match: state.chat.match,
    chatOn: state.chat.chatOn,
    messages: state.chat.messages,
    addPersonModal: state.chat.addPersonModal,
    acceptFriend: state.chat.acceptFriend,
    allMessages: state.chat.allMessages,
    friends: state.chat.friends,
    canShowModal: state.chat.canShowModal,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonSearch));