import React, {
    Component
} from 'react';
import {
    Container,
    Col,
    Row,
    Footer
} from 'mdbreact';


class FooterPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    sendMessage = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return ( 
            <Footer className="pt-4 font-medium" color="unique-color-dark">

                <Container className="text-center text-md-left  mt-5">
                    <Row>
                        <Col md="3">
                            <h4 className="title">  ChatAPP </h4> 
                            <p>Weszelkie prawa zastrzeżone. </p> 
                        </Col>
                        <Col md="3">
                            <h4 className="title"> Pobierz aplikację! </h4> 
                            <div className="app-download-area--footer">
                                <div className="btn-app-download btn-app-download--footer active">
                                    <a href="#" target="_blank"> 
                                        < i className="fa fa-android"> </i>
                                    </a>
                                </div> 
                            </div> 
                        </Col>
                        <Col md="3">
                            <h4 className="title">Informacje prawne </h4> 
                            <ul>
                                <li className="list-unstyled">
                                    <a href="/PrivacyPolicy"> Polityka prywatności i cookies </a> 
                                    </li> 
                                <li className="list-unstyled">
                                    <a href="/Regulations"> Regulamin </a> 
                                </li> 
                            </ul> 
                        </Col>
                        <Col md="3">
                            <h4 className="title">Kontakt </h4> 
                            <ul className="mb-5">
                                <li className="list-unstyled">
                                E: < a href="mailto:#">mail@gmail.com </a> 
                                </li> 
                            </ul>
                        </Col> 
                    </Row> 
                </Container>

                <Container fluid className="text-center font-small mt-5 text-md-left">
                    <Row>
                        <Col md="12">
                        <div className="mb-5 flex-center">
                            <a href="#" target="_blank" className="fb-ic">
                                <i className="fa fa-facebook fa-lg white-text mr-md-5 mr-3 fa-2x"> </i> 
                            </a> 
                            <a href="#" target="_blank" className="gplus-ic">
                                <i className= "fa fa-google-plus fa-lg white-text mr-md-5 mr-3 fa-2x"> </i> 
                            </a>
                            <a href="#" target="_blank" className="ins-ic">
                                <i className="fa fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x"> </i> 
                            </a> 
                        </div> 
                        </Col> 
                    </Row> 
                </Container>                

                <div className="footer-copyright text-center pt-5 pb-5 mt-5">
                    <Container fluid className="font-medium">
                    &copy; {
                        new Date().getFullYear()
                    }
                    &nbsp;Copyright by <a href="/">ChatApp</a> 
                    </Container> 
                </div>
            </Footer>
        );
    }
}

export default FooterPage;