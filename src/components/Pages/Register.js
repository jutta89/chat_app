import React, { Component } from 'react';
import { register } from '../../actions/authentication';
import { connect } from 'react-redux';
import strings from '../../res/strings';

import DatePicker from 'react-date-picker'

import {showPanel} from '../../actions/authentication';
import { MDBAlert, MDBInput } from 'mdbreact';

import { sha256 } from 'js-sha256';

import {
    Link
} from 'react-router-dom';

// IMAGES
import smile from '../../img/icons/happy.svg';
import thinking from '../../img/icons/thinking.svg';
import logo from '../../img/logo.png';
import registerImg from '../../img/core-img/smile.svg';

class Register extends Component {

    componentDidMount = () => {
        this.props.localPanel(true)
        this.setState({
            birth: null
        })
    }

    state = {
        birth : new Date(),
        sex : '',
        message: null,
        datePicked: false,
        name: '',
        passTested: '',
    }

    closeError = (event) => {
        this.setState ({
            message: null,
        })
        return; 
    }

    onNameChanged = (event) => {
        this.setState ({
            name: event.target.value
        })
    }

    onPassChanged = (event) => {
        this.setState ({
            passTested: event.target.value
        })
    }

    onbirthChanged = (date) => {
        this.setState ({
            birth: date,
            datePicked: true
        })
    }

    onSexChanged = (event) => {
        console.log(event);
        this.setState ({
            sex: event.target.value
        })
    }

    onSubmitClick = (event) => {
        
        event.preventDefault(); 

        if (this.state.datePicked && this.state.sex && this.state.name && this.state.passTested){
            if (sha256(this.state.passTested) !== this.props.localUser.password) {
                this.setState({ 
                    passTested: '',
                    message: 'validatePassword'
                });
                return;
            } 
            this.props.localRegister(this.props.localUser.email, this.state.name, this.state.passTested, this.state.birth, this.state.sex).then(result => {
                console.log(this.state.login);
                this.setState({ message: result});
                setTimeout( () => 
                    this.setState ({
                        message: null,
                    }),
                5000 );  
            });
        }
        else {
            this.setState({ message: 'validate'});
            setTimeout( () => 
                this.setState ({
                    message: null,
                }),
            5000 );  
        }
    }

    getMaxYear = () => {
        let date = new Date();
        date.setFullYear(date.getFullYear() - 18);
        return date;
    }

    render () {
        let error = null;
        if (this.state.message === 'ok') {
            error = 
            <div onClick={this.closeError}>
            <MDBAlert dismiss color="success">{ strings.register_sucess }</MDBAlert>
            </div>;
            setTimeout( () => 
            this.setState ({
                    message: null,
                }),
            5000 );  
        }
        else if (this.state.message === 'validate') {
            error = 
            <div onClick={this.closeError}>
            <MDBAlert dismiss color="danger"><strong>Błąd!</strong> Wpisz wszystkie dane.</MDBAlert>
            </div>
            ;
            this.state.message = null;
            setTimeout( () => 
            this.setState ({
                    message: null,
                }),
            5000 );  
        }
        else if (this.state.message === 'validatePassword') {
            error = 
            <div onClick={this.closeError}>
            <MDBAlert dismiss color="danger"><strong>Błąd!</strong> Wpisałeś inne hasło, niż w poprzednim oknie.</MDBAlert>
            </div>
            ;
            this.state.message = null;
            setTimeout( () => 
            this.setState ({
                    message: null,
                }),
            5000 );  
        }
        else if (this.state.message) {
            error = 
            <div onClick={this.closeError}>
            <MDBAlert dismiss color="danger"><strong>Błąd!</strong> { strings.register_error }</MDBAlert>
            </div>
            setTimeout( () => 
            this.setState ({
                    message: null,
                }),
            5000 );  
            ;
        }

        const calendar = <i class="fa fa-calendar"></i>;

        const registerForm = (

            <form className="form-register" onSubmit={(event)=>this.onSubmitClick(event)}>
                
                <input maxLength='20' onChange={(event)=>this.onNameChanged(event)} data-error="Wypełnij pole z imieniem" required  value={this.state.name} placeholder="Podaj imię" type="text"  className="" pattern="[a-zA-ZąĄććęęłŁńŃóÓśŚżŻŹŹ ]+"></input>

                <input onChange={(event)=>this.onPassChanged(event)} data-error="Hasło musi mieć " required  value={this.state.passTested} placeholder="Powtórz hasło" type="password" ></input>

                <DatePicker
                    clearIcon={null}
                    onChange={this.onbirthChanged}
                    value={this.state.birth}
                    maxDate={this.getMaxYear()}
                    required
                    name="Data urodzenia"
                    calendarIcon={calendar}
                />

                <input className="input__sex-change" onChange={this.onSexChanged} value={this.state.sex}  type="text" name="plec" placeholder="Wybierz płeć" required list="plcie" />
                <datalist id="plcie">
                    <option value="K" label="Kobieta"></option>
                    <option value="M" label="Mężczyzna"></option>
                </datalist>

                <button className="site-btn site-btn--effected" type="submit" >Zarejestruj</button>

                <MDBInput required unchecked type="checkbox" id="checkbox2" className="form-checkbox" />
                
                <p className="animated bounceInUp px-5 mb-5 pb-3 lead grey-text checbox-text">
                    Rejestrując się, wyrażasz zgodę na <Link to="/Regulations">Regulamin</Link> oraz <Link to="/PrivacyPolicy">Politykę prywatności</Link>
                </p>

            </form>
            )

        return (
            <div className="first-section">
                <div className="container">
                    <div className="col col-md-12">
                        <img src={logo} alt="logo" className="reg-img-logo mb-1"></img>
                        <h1 className="py-5 mb-1 mt-1 font-weight-bold text-center">Dołącz do ChatApp! To bardzo proste!</h1>
                        <p className="py-6 mb-1 grey-text text-center">Cześć <b><span className="t-accent">{ this.props.localUser.name }</span> </b><img className="content-icon" src={smile} alt="smile" /> Wygląda na to, że logujesz się pierwszy raz  <img className="content-icon" src={thinking} alt="thinking" /></p>
                        <p className="px-5 mt-4 mb-2 pb-4 lead grey-text text-center animated bounceIn">
                            Dokończ rejestrację wypełniając ponisze pola*. <br></br>
                        </p>
 
                        <div className="row flex-center ">
                            <div className="col-md-5 mb-1  animated  bounceInLeft">
                                { registerForm }
                            </div>
                            <div className="col-md-3 center-on-small-only flex-center animated  bounceInRight reg-img-1-hld">
                                <img src={registerImg} alt="image" className="reg-img-1"></img>
                            </div>
                        </div>

                        <p className="px-5 mt-4 mb-2 pb-4 lead grey-text text-center animated bounceIn">
                            *Konto zostanie założone po wypełnieniu wszystkich pól. By przerwać rejestrację konta kliknij przycisk <b>Wyloguj</b>.
                        </p>
                    </div>
                </div>
                { error }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        localRegister: (email, name, password, birth, sex) => dispatch(register(email, name, password, birth, sex)),
        localPanel: (on) => dispatch(showPanel(on))

    }
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
})

export default connect(mapStateToProps, mapDispatchToProps)(Register); 




