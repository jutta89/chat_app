import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/authentication';
import ContentOnLogin from './ContentOnLogin';
import Register from './Pages/Register';
import strings from '../res/strings';

import { MDBAlert } from 'mdbreact';

// IMAGES
import phone from '../img/core-img/phone.png';

class Primary extends Component {
    state = {
        login : "",
        pass : "",
        message: null
    }

    constructor(props) {
        super(props);
    }

    onLoginChanged = (event) => {
        this.setState ({
            login: event.target.value
        })
    }

    onPassChanged = (event) => {
        this.setState ({
            pass: event.target.value
        })
    }

    onSubmitClick = (event) => {
        event.preventDefault(); //

        this.props.localLogin(this.state.login, this.state.pass).then(result => {
            console.log(result);
            this.setState({ message: result}); 
                setTimeout( () => 
                this.setState ({
                    message: null,
                }),
            3000 );
        }); 
    }

    closeError = (event) => {
        this.setState ({
            message: null,
        })   
        return;
    }

    render () {
        const Header = this.props.text ? this.props.text : 
            null
        ;
        const error = this.state.message && 
            <div onClick={this.closeError}>
                <MDBAlert color="danger" dismiss onClick={this.closeError} > 
                    <strong>Błąd!</strong> { strings.error462 } 
                </MDBAlert>
            </div>
        
        const loginForm = (
            <div className="row vh-100 mt-2">
                <div className="vh-100 col col-md-8 d-flex flex-column justify-content-center">
                    <h1 className="t-title t-title-big"> Chat <span className="t-title-dark"> APP</span> </h1>   
                    <h4 className="t-title-gray">Nie masz jeszcze konta? 
                    Pierwsze logowanie do aplikacji jest jednocześnie rejestracją!
                    Zacznij chatować już teraz!</h4>
                    
                    <div className="row animated bounceInLeft">
                        <form className="form-log-in col col md-6" onSubmit={(event)=>this.onSubmitClick(event)}>

                            <input type="email" name="email" data-error="Wypełnij to pole" required onChange={(event)=>this.onLoginChanged(event)} value={this.state.login} placeholder="Adres e-mail" className="" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" ></input>

                            <input onChange={this.onPassChanged} 
                                required 
                                value={this.state.pass} 
                                placeholder="Hasło*" 
                                type="password" 
                                name="password"
                                // autocomplete="new-password"
                                // minlength="4"
                                // pattern="(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$"
                                data-error="Wypełnij to pole" 
                                >
                            </input>

                            <button className="site-btn site-btn--effected site-btn--log-in site-btn--iconed" type="submit" >
                                <i className="fa fa-user mr-3"aria-hidden="true"></i> 
                                <span>Zaloguj</span>
                                <div className="login-info-hld">
                                    <div className="login-info"> 
                                        <span className="text"> Pierwsze logowanie jest rejestracją!</span> 
                                        </div> 
                                    </div>
                            </button>
                        </form>
                        
                        <div className="col col-md-6">
                            <div className="app-download-area">
                                <div className="btn-app-download active">
                                    <a href="#" target="_blank"><i className="fa fa-android"></i><p className="mb-0"><span>available on</span> Google Store</p></a>
                                </div>
                            </div>
                        </div>
                        <p className="p-password-info animated bounceInUp px-5 mb-5 pb-3 lead grey-text text-center">
                            *dla Twojego bezpieczeństwa hasło musi mieć minimum  <span className="t-accent">4 znaki</span>.
                            {/* i zawierać co najmniej <span className="t-accent">jedną cyfrę</span> i co najmniej <span className="t-accent">jedną wielką literę</span>. */}
                        </p>
                    </div>
                </div>

                <div className="col col-md-3 welcome-mobile-device d-flex flex-column justify-content-center">
                    <img className="phone-first" src={phone} alt="phone" />
                </div>
            </div>)

        const loginOnContent = <ContentOnLogin userPass={ this.state.pass } userName={ this.props.localUser && this.props.localUser.name } />; 

        const loginOnFirstContent = <Register />; 

        const ContentPage = this.props.localUser
            ? (this.props.localUser.sex ? loginOnContent : loginOnFirstContent)
            : loginForm;

        var classNameLogin = this.props.localUser ?  'col col-md-12 h-100' : 'container h-100' ;

        return (
            <div className="container-fluid vh-100">
                <div className="vh-100">
                    <div className="vh-100 row align-items-center">
                        <div className={classNameLogin}>
                            { Header }
                            <div className="vh-100">
                                <h1>{ this.props.children }</h1>
                                { ContentPage }
                                { error }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        localLogin: (username, password) => dispatch(login(username, password)),
    }
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
    firstLogin: state.authentication.firstLogin,
})

export default connect(mapStateToProps, mapDispatchToProps)(Primary); 