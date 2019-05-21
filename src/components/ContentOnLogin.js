import React, { Component } from 'react';

import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardTitle, 
    MDBCardText, 
    Animation } from "mdbreact";

// IMAGES
import smile from '../img/icons/happy.svg';
import chatico from '../img/icons/smile.svg';
import buttonImg from '../img/imageClick.png';
import chatImg from '../img/image-chat.png';
import chatOn from '../img/chat-on.png';
import coupleYes from '../img/couple-yes.png';

class ContentOnLogin extends Component {
    state = {
        flipped: false
    }

    handleFlipping = () => {
        this.setState({ flipped: !this.state.flipped });
    }

    render () {
        return (
            <Animation type="slideInUp" >
                <div className="row">
                    <div className="first-section col col-md-12">
                        <MDBCard className="w-100 mb-5 pt-3 pb-4">
                            <MDBCardBody>
                                <MDBCardTitle  tag="h4" className="mb-2 text-muted">    
                                    Witaj&nbsp;
                                    <span className="t-accent">
                                        { this.props.userName }
                                    </span>!&nbsp; 
                                    <img className="content-icon" src={smile} alt="smile" />
                                </MDBCardTitle>
                                <MDBCardText>
                                    Zalogowałeś się pomyślnie do aplikacji. Teraz mozesz przejść do chatowania!&nbsp;
                                    <img className="content-icon" src={smile} alt="smile" />
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                        <MDBCard className="w-100 mb-5 pt-3 pb-4">
                            <MDBCardBody>
                                <MDBCardTitle>   
                                    Jak korzystać z aplikacji?
                                    <img alt="ico" className="ml-2 mr-2 content-icon" src={chatico} />
                                </MDBCardTitle>
                                <MDBCardText className="pt-5 d-flex flex-wrap align-items-center justify-content-flex-start vertical-align-middle">
                                    <img className="content-on-login__img-button" src={buttonImg} alt="img" />
                                    <p className="pt-4 pb-2 content-on-login__card__text">
                                        By zacząć losowanie kliknij przycisk <span className="t-accent">&nbsp;Losuj rozmówcę</span>.
                                    </p>
                                </MDBCardText>
                                <MDBCardText className="d-flex flex-wrap align-items-center justify-content-flex-end vertical-align-middle">
                                    <p className="pt-2 pb-2 content-on-login__card__text">
                                        Znaleziono rozmówcę! By zacząć chat kliknij w button<span className="t-accent">&nbsp;Akceptuj </span>.
                                        Pośpiesz się! &nbsp;
                                        <span className="t-accent">Masz 10 sekund!</span>
                                    </p>
                                    <img className="content-on-login__img-2 mr-2 ml-5" src={chatImg} alt="img" />
                                </MDBCardText>
                                <MDBCardText className="d-flex flex-wrap align-items-center justify-content-flex-start vertical-align-middle">
                                    <img className="content-on-login__img-3 mr-5" src={chatOn} alt="img" />
                                    <p className="pt-2 pb-2 content-on-login__card__text">
                                        Uruchomi się <span className="t-accent">&nbsp;Chat</span>, który potrwa<span className="t-accent">&nbsp;5 minut</span>...
                                    </p>
                                </MDBCardText>
                                <MDBCardText className="d-flex flex-wrap align-items-center justify-content-flex-start vertical-align-middle">
                                    <p className="pt-2 pb-2 content-on-login__card__text">
                                        ... i zostaniesz zapytany, czy chcesz <span className="t-accent">&nbsp;dodać znajomego do kontaktów</span>. Na decyzję masz<span className="t-accent">&nbsp;10 sekund</span>!
                                    </p>
                                    <img className="content-on-login__img-4 mr-2 ml-5" src={coupleYes} alt="img" />
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </div>
                </div>
            </Animation>
        );
    }
}

export default ContentOnLogin;

