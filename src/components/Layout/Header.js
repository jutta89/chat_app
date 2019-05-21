import React, { Component } from 'react';
import { connect } from 'react-redux';
import ButtonLogOut from '../ButtonLogOut';
import Profil from '../Pages/Profil';

// Images
import logo from '../../img/logo-scroll.png';
import friends from '../../img/icons/fa/fa-user-friends.svg';
import tel from '../../img/icons/fa/fa-mobile.svg';
import user from "../../img/user.png";

import { 
    Navbar, 
    NavbarNav, 
    NavbarToggler, 
    Collapse, 
    NavItem, 
    MDBIcon, 
    MDBBadge} from 'mdbreact';

// HAMBURGER MENU
import { bubble as Menu } from 'react-burger-menu'

import {
    Link
} from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
        };
    this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    hasNewMessages = () => {
        for (var key in this.props.friendsMessages) {
            if (!this.props.friendsMessages.hasOwnProperty(key)) continue;
            if (this.props.friendsMessages[key]) return true;
        }
        return false;
    }

    // HAMBURGER MENU
    showSettings (event) {
        event.preventDefault();
    }
    
    render () {

        const newMessageIcon =  this.hasNewMessages() ? <MDBBadge color="success"><MDBIcon className="header-badge-ico" fab icon="envelope" /></MDBBadge> : null;
        const chatLink = this.props.login && this.props.login.sex && <Link to="/Chat"><MDBIcon className="mr-2" icon="comments" />Wiadomości {newMessageIcon}</Link>
        const settingsUser = this.props.login && this.props.login.sex && <Link to="/Settings"><MDBIcon className="mr-2" icon="cogs" />Ustawienia konta</Link>
        const coupleUser = this.props.login && this.props.login.sex && <Link to="/Friends"> <img className="mr-2" alt="icon"  src={friends} height="12" /> Pary</Link>

        const editProfile = this.props.login && this.props.login.sex ?                     
                            <Link to="/Profil">
                                <div className="hamburger-menu-user-hld mb-5">
                                    <div className="hamburger-menu-user__photo">
                                        <img src={user} alt="user-photo" className="hamburger-menu-user__photo__img"/>
                                    </div>
                                    <div className="hamburger-menu-user__text">
                                        <p className="hamburger-menu-user__text-name">
                                            { this.props.login && this.props.login.sex && this.props.login.name }
                                        </p>
                                        <p className="hamburger-menu-user__text-edit">
                                            Edytuj profil
                                        </p>
                                    </div>

                                </div>
                            </Link> 
                            : null;

        return (
            <header>  
                <Menu width={ 260 } right isOpen={ false } className={ "hamburger-menu" }>
                    {editProfile}
                    <NavItem>
                        <Link to="/"><MDBIcon className="mr-2" icon="home" /> Home</Link>
                    </NavItem>
                    <NavItem>
                        { chatLink }
                    </NavItem>
                    <NavItem>
                        { coupleUser }
                    </NavItem>
                    <NavItem>
                        { settingsUser }
                    </NavItem>
                    <NavItem>
                        <Link to="/About"> <img className="mr-2 mb-1" alt="icon"  src={tel} height="12" /> O aplikacji</Link>
                    </NavItem>

                    <NavItem>
                        <Link to="/PrivacyPolicy"><MDBIcon className="mr-2" icon="info" /> Polityka prywatności i cookies</Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/Regulations"><MDBIcon className="mr-2" icon="file" />Regulamin</Link>
                    </NavItem>
                    <div className="mt-4 mb-4 btn-app-download btn-app-download--menu active">
                        <a href="#" target="_blank"><i className="fa fa-android"></i></a>
                    </div>
                    <ButtonLogOut webSocketHandler={this.props.webSocketHandler}/>
                </Menu>

                <Navbar light expand="md" fixed="top" scrolling>
                { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                    <Collapse isOpen = { this.state.collapse } navbar>
                        <NavbarNav left>
                            <NavItem>
                                <Link className="nav-item--logo" to="/">
                                    <img className="logo--scroll" alt="Logo"  src={logo} height="60" />
                                </Link>
                            </NavItem>
                        </NavbarNav>
                        <NavbarNav right>
                            <NavItem>
                                <Link to="/"><MDBIcon className="mr-2" icon="home" /> Home</Link>
                            </NavItem>
                            <NavItem>
                                { chatLink }
                            </NavItem>
                            <NavItem>
                                { coupleUser }
                            </NavItem>
                            <NavItem>
                                { settingsUser }
                            </NavItem>
                            <NavItem>
                                <Link to="/About"> <img className="mr-2 mb-1" alt="icon"  src={tel} height="12" /> O aplikacji</Link>
                            </NavItem>
                        </NavbarNav>
                        <ButtonLogOut webSocketHandler={this.props.webSocketHandler}/>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    login: state.authentication.loggedUser,
    friendsMessages: state.chat.friendsMessages
})

export default connect(mapStateToProps, null)(Header);