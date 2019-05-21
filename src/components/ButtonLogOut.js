import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/authentication';
import { withRouter } from 'react-router';
import 'font-awesome/css/font-awesome.min.css';

class ButtonLogOut extends Component {

    onLogout = () => {
        this.props.logoutFunc();
        if (this.props.webSocketHandler().getter()) {
            this.props.webSocketHandler().getter().close();
        }
        this.props.history.push('/')
    }

    render () {
        const button = (<button className="site-btn site-btn--logout  site-btn--iconed" onClick={()=>this.onLogout()}>
                            <i className="fa fa-sign-out mr-3" aria-hidden="true"></i> 
                            <label>Wyloguj </label>
                        </button>);
        const content = this.props.login ? button : null;
        return content;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutFunc: () => dispatch(logout())
    }
}

const mapStateToProps = (state) => ({
    login: state.authentication.loggedUser,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonLogOut));