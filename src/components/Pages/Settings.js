import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sha256 } from 'js-sha256';

import { deleteUser, changePass } from '../../actions/authentication';

import strings from '../../res/strings';

import {showPanel} from '../../actions/authentication';

import { 
    MDBAlert,  
    MDBCard, 
    MDBListGroup, 
    MDBListGroupItem, 
    Animation, 
    MDBModal,
    MDBBtn, 
    MDBModalBody,
    MDBModalHeader, 
    MDBModalFooter } from 'mdbreact';

import thinking from '../../img/icons/thinking.svg';

class Settings extends Component {

    state = {
        pass : "",
        messageDelete: "",
        messageDeleteSuccess: "",
        messageChangePass: "",
        messageChangePassSuccess: "",
        passTest: "",
        newPass: "",
        newPassTest: "",
        modal: false,
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    closeError = (event) => {
        this.setState ({
            messageDelete: null,
            messageChangePass: null,
            messageChangePassSuccess: null,
            messageVariousPass: null,
            messageActualVariousPass: null,
        })   
        return;
    }

    componentDidMount = () => {
        this.props.localPanel(true);
    }

    onPassChanged = (event) => {
        this.setState ({
            pass: event.target.value
        })
    }

    onSubmitClick = (event) => {
        event.preventDefault(); 
        this.toggle();
    }

    deleteAccount = () => {
        this.props.localDeleteUser(this.props.localUser.email, this.state.pass).then(result => {
            this.setState({ messageDelete: result, modal: false}); 
            setTimeout( () => 
                this.setState ({
                    messageDelete: null,
                    messageDeleteSuccess: null,
                }),
            3000 );
        });
    }


    // zmiana hasla
    onPassTested = (event) => {
        this.setState ({
            passTest: event.target.value
        })
    }

    onPassChoose = (event) => {
        // nowe haslo 1
        this.setState ({
            newPass: event.target.value
        })
    }

    onPassChooseTest = (event) => {
        // nowe haslo 2
        this.setState ({
            newPassTest: event.target.value
        })
    }

    // Button zmiana hasla
    onSubmitClickChoose = (event) => {
        event.preventDefault(); // nie odswieza strony

        // SPRAWDZENIE CZY UZYTOWNIK WPISAL DOBRE HASLO
        if(this.props.localUser.password !== sha256(this.state.passTest)) {
            this.setState({
                messageActualVariousPass: 'ddd', passTest: '', 
            });
            setTimeout( () => 
                this.setState ({
                    messageActualVariousPass: null,
                    }),
            5000 );
        }

        // SPRAWDZENIE CZY HASLA Z INPUTOW SA TAKIE SAME
        else {
            if(this.state.newPass !== this.state.newPassTest) {
                this.setState({
                    messageVariousPass: 'ddd', newPass: '', newPassTest: '', 
                });
                setTimeout( () => 
                    this.setState ({
                            messageVariousPass: null,
                        }),
                5000 );
            }
    
            else {
                // wysyla na serwer
                this.props.localPassword(this.props.localUser.email, this.state.passTest, this.state.newPass).then(result => {
        
                    this.setState({ messageChangePass: result, messageChangePassSuccess: 'zmieniono', passTest: '', newPass: '', newPassTest: '' }); // result
                    setTimeout( () => 
                    this.setState ({
                            messageChangePass: null,
                            messageChangePassSuccess: null,
                        }),
                    3000 );
                }); 
            }
        }
    }

    render () {
        const error_delete =  this.state.messageDelete && 
                        <div onClick={this.closeError}>
                            <MDBAlert dismiss color="danger">
                                <strong>Błąd!</strong> {strings.delete_error}
                            </MDBAlert>
                        </div>;

        const error_change = this.state.messageChangePass && 
                        <div onClick={this.closeError}>
                            <MDBAlert dismiss color="danger">
                                <strong>Błąd!</strong> {strings.change_error}
                            </MDBAlert>
                        </div>;

        const error_change_various = this.state.messageVariousPass && 
                <div onClick={this.closeError}>
                    <MDBAlert dismiss color="danger">
                        <strong>Błąd!</strong> {strings.variousPass_error}
                    </MDBAlert>
                </div>;

        const error_change_actual_various = this.state.messageActualVariousPass && 
            <div onClick={this.closeError}>
                <MDBAlert dismiss color="danger">
                    <strong>Błąd!</strong> {strings.various_actual_pass_error}
                </MDBAlert>
            </div>;

        const success_change = this.state.messageChangePassSuccess && 
            <div onClick={this.closeError}>
                <MDBAlert dismiss color="success">
                    <strong>Sukces!</strong> zmieniono hasło
                </MDBAlert>
            </div>;

        return (
            <div className="first-section">

                <MDBModal isOpen={this.state.modal} toggle={this.toggle} centered>
                    <MDBModalHeader toggle={this.toggle}>Czy na pewno usunąć konto?</MDBModalHeader>
                    <MDBModalBody>
                        Czy na pewno chcesz usunąć konto? &nbsp;
                            <img className="content-icon" src={thinking} alt="icon" />
                    </MDBModalBody>
                    <MDBModalFooter>
                    <MDBBtn color="success" onClick={this.toggle}>Anuluj</MDBBtn>

                    <MDBBtn color="danger" onClick={() => this.deleteAccount()}>Usuń</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>

                <div className="col-md-12 mb-5">
                            <h1 className="py-5 font-weight-bold text-center">Ustawienia konta</h1>
                    
                <Animation type="slideInUp" >
                    <MDBCard className="w-100 mb-5">
                        <MDBListGroup>
                            <MDBListGroupItem>
                                <div className="col col-md-5">
                                    <p className="mb-4 pt-5 lead font-weight-bold grey-text text-left">
                                        Nazwa konta<br></br>
                                    </p>
                                    <p className="lead grey-text text-left">
                                        {this.props.localUser.name}
                                    </p>
                                </div>
                                <div className="col col-md-5">
                                    <p className="mb-4 pt-5 lead font-weight-bold grey-text text-left">
                                        Adres e-mail przypisany do konta
                                    </p>
                                    <p className="lead grey-text text-left">
                                        {this.props.localUser.email}
                                    </p>
                                </div>
                            </MDBListGroupItem>

                            <MDBListGroupItem>
                                <div className="col col-md-12">
                                    <p className="pt-5 lead font-weight-bold grey-text text-left">
                                        Zmień hasło
                                    </p>
                                    <p className="lead grey-text text-left">
                                        Aby zmienić hasło wpisz stare hasło a następnie nowe
                                    </p>
                                    <form className="form-log-in" onSubmit={(event)=>this.onSubmitClickChoose(event)}>
                                        <input onChange={this.onPassTested} value={this.state.passTest} placeholder="Aktualne hasło" type="password" data-error="Wypełnij to pole" required></input>
                                        <input onChange={this.onPassChoose} value={this.state.newPass} placeholder="Nowe hasło" type="password" data-error="Wypełnij to pole" required></input>
                                        <input onChange={this.onPassChooseTest} value={this.state.newPassTest} placeholder="Powtórz nowe hasło" type="password" data-error="Wypełnij to pole" required></input>
                                        <button className="site-btn site-btn--iconed" type="submit" >
                                            <i className="fa fa-key mr-3" aria-hidden="true"></i> 
                                            <span>Zmień hasło</span>
                                        </button>
                                    </form>
                                </div>
                            </MDBListGroupItem>

                            <MDBListGroupItem className="pb-5" >
                                <div className="col col-md-12">
                                    <p className="pt-5 lead font-weight-bold grey-text text-left">
                                    Usuń konto
                                    </p>
                                    <p className="lead grey-text text-left">
                                        Aby usunąć konto wpisz hasło.
                                    </p>
                                    <form className="form-log-in" onSubmit={(event)=>this.onSubmitClick(event)}>
                                        <input onChange={this.onPassChanged} value={this.state.pass} placeholder="Hasło" type="password" data-error="Wypełnij to pole" required></input>
                                        <button className="site-btn site-btn--removed site-btn--iconed" type="submit" >
                                            <i className="fa fa-user-times mr-3" aria-hidden="true"></i> 
                                            <span>Usuń konto</span>
                                        </button>
                                    </form>
                                </div>
                            </MDBListGroupItem>

                        </MDBListGroup>
                    </MDBCard>
                </Animation>

                { error_change }
                { error_change_actual_various }
                { error_change_various }
                { error_delete }
                { success_change }
            </div>
        </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        localDeleteUser: (username, password) => dispatch(deleteUser(username, password)),
        localPanel: (on) => dispatch(showPanel(on)),
        localPassword: (username, password, newPassword) => dispatch(changePass(username, password, newPassword)),
    }
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

