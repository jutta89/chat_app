import React, { Component } from 'react';
import { connect } from 'react-redux';

import {showPanel} from '../../actions/authentication';
import {updateAllFriends} from '../../actions/chat';

import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardTitle, 
    MDBCardText, 
    MDBBtn, 
    MDBCardFooter, 
    MDBModal, 
    MDBModalBody, 
    MDBModalHeader, 
    MDBModalFooter,
    Animation,
    MDBIcon } from "mdbreact";

// IMAGES
import sad from '../../img/icons/sad.svg';
import thinking from '../../img/icons/thinking.svg';

class Friends extends Component {

    componentDidMount = () => {
        this.props.localPanel(true);
    }

    state = {
        modal: {},
        rotated: {},
        images: {},
        imagesChecked: false
    }
    
    toggle = (email) => {
        const state = this.state.modal[email] ? !this.state.modal[email] : true
        this.setState({
            modal: {...this.state.modal, [email]: state}
        });
    }

    buttonRotateClick = (index) => {
        let rotated = {};
        if (this.state.rotated[index]) {
            rotated = {...this.state.rotated, [index]: false}
        }
        else {
            rotated = {...this.state.rotated, [index]: true}
        }
        this.setState({
            rotated: rotated
        }); 
    }

    setAvatar = (email) => {
        const imageUrl = 'https://e-chatapp.pl:3111/photos/'+email+'/'+email+'.jpg?' + new Date().getTime();
        const img = new Image();
        img.onload = () => { this.setState({images: {...this.state.images, [email]: true}})};
        img.onerror = () => { this.setState({images: {...this.state.images, [email]: false}})};
        img.src = imageUrl;
    }

    deleteUser = (email) => {
        const request = {
            TODO: 'DELETE_FRIEND',
            firstUser: this.props.localUser.email,
            secondUser: email,
        }
        this.props.webSocketHandler().getter().json(request);
        const newFriends = this.props.friends.filter(friend => {
            const friendObject = JSON.parse(friend);
            return friendObject.email !== email;
        });
        this.props.updateAllFriends(newFriends);
        this.setState({
            modal: {...this.state.modal, [email]: false}
        });
    }

    render () {
        if (this.props.friends && this.props.friends.length > 0 && !this.state.imagesChecked) {
            this.props.friends.forEach(friend => {
                const friendObject = JSON.parse(friend);
                this.setAvatar(friendObject.email);
            });
            this.setState({
                imagesChecked: true
            })
        }

        const filteredFriends = this.props.friends &&  this.props.friends.filter(friend => {
            const friendObject = JSON.parse(friend);
            return friendObject.HAS_ME_IN_FRIENDS;
        })

        const friends = filteredFriends && filteredFriends.map((friend, index) => {
            const friendObject = JSON.parse(friend);

            const urlToImage = 'https://e-chatapp.pl:3111/photos/'+friendObject.email+'/'+friendObject.email+'.jpg?' + new Date().getTime();

            const friendImage = this.state.images[friendObject.email] ? <img src={urlToImage} className="friends-list__img" alt={friendObject.name} /> 
                                :
                                <span className="friends-list__img friends-list__photo__letter">
                                    <span>
                                        { friendObject.name } {friendObject.age}
                                    </span>
                                </span>;

            return (
                <MDBCard className={ !this.state.rotated[index]
                    ? "friends-list__card-item w-25 pt-3"
                    : "friends-list__card-item w-25 pt-3 is-rotated"} key={index}>

                    <MDBCardBody className={'card-body-user friends-list__body-item'} >
                        {friendImage}
                        <MDBCardTitle className="pt-4">{friendObject.name}</MDBCardTitle>
                        <MDBCardText className="pt-3">
                            <span className="friends-list__title" >o sobie</span>
                            <span className="friends-list__label" >
                                {friendObject.aboutMe}
                            </span>
                        <hr></hr>
                        </MDBCardText>
                        <MDBCardText className="pt-2 pb-2">
                            {/* funkcja po  */}
                            <span onClick={() => this.buttonRotateClick(index)} className="friends-list__button" ><MDBIcon className="mr-2 friends-list__button-ico" icon="undo" /> Więcej informacji</span>
                        </MDBCardText>
                    </MDBCardBody>

                    <MDBCardBody className={'card-body-user friends-list__body-item__back'}>
                        <MDBCardText className="pt-3">
                            <span className="friends-list__title" >hobby</span>
                            <hr></hr>
                            <span className="friends-list__label" >{friendObject.hobby} </span>
                        </MDBCardText>
                        <MDBCardText className="friends-list__button-hld pt-2 pb-2" onClick={() => this.buttonRotateClick(index)} >
                            <span className="friends-list__button" ><MDBIcon className="mr-2 friends-list__button-ico" icon="undo" /> Wróć</span>
                        </MDBCardText>
                    </MDBCardBody>

                    <MDBCardFooter color="">
                        <button className="site-btn site-btn--friends-delete" onClick={() => this.toggle(friendObject.email)}>
                            <i className="fa fa-minus-circle mr-1" aria-hidden="true"></i> Usuń znajomego
                        </button>
                    </MDBCardFooter>
                </MDBCard>
            );
        })

        const modalDelete =  this.props.friends &&  this.props.friends.map((friend, index) => {
            const friendObject = JSON.parse(friend);
                return (
                        <MDBModal key={index} isOpen={this.state.modal[friendObject.email]} toggle={() => this.toggle(friendObject.email)} centered>
                            <MDBModalHeader toggle={() => this.toggle(friendObject.email)}>Czy na pewno usunąć znajomego?</MDBModalHeader>
                            <MDBModalBody>
                                Czy na pewno chcesz, żeby {friendObject.name} nie był już na Twojej liście znajomych? &nbsp;
                                    <img className="content-icon" src={thinking} alt="icon" />
                            </MDBModalBody>
                            <MDBModalFooter>
                            <MDBBtn color="success" onClick={() => this.toggle(friendObject.email)}>Anuluj</MDBBtn>
                            <MDBBtn color="danger" onClick={() => this.deleteUser(friendObject.email)}>Usuń ze znajomych</MDBBtn>
                            </MDBModalFooter>
                        </MDBModal>
                );
            })

        const noFriends =   <div className="col col-md-12">
                                <p className="lead py-1 pt-5">Nie masz jeszcze znajomych &nbsp;
                                    <img className="content-icon" src={sad} alt="icon" />
                                </p>
                            </div>
        const classNameCouples = filteredFriends && filteredFriends.length ? 'friends-hld' : 'friends-hld card';

        return (
            <div>
                <Animation type="slideInUp" >
                    <div className="row">
                        <div className="first-section l-section-couple mt-4 col col-md-12">
                            <div className={classNameCouples}>
                                {filteredFriends && filteredFriends.length > 0 ? friends : noFriends}
                            </div>
                        </div>
                    </div>
                </Animation>
                {modalDelete}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        localPanel: (on) => dispatch(showPanel(on)),
        updateAllFriends: (friends) => dispatch(updateAllFriends(friends))
    }
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
    friends: state.chat.friends,
})

export default connect(mapStateToProps, mapDispatchToProps)(Friends);