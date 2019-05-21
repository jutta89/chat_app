import React, { Component } from 'react';

import { connect } from 'react-redux';
import {showPanel} from '../../actions/authentication';

class PrivacyPolicy extends Component {

    componentDidMount = () => {
        this.props.localPanel(false)
    }

    render () {
        return (
            <div className="first-section">
                <div className="row">
                    <div className="container">
                        <div className="col col-md-12">
                            <section>
                                <h1 className="h1-polices-title t-page-title py-5 font-weight-bold text-center">Polityka<br></br> prywatności i cookies</h1>
                                <p className="px-5 mb-5 pb-3 lead grey-text text-center animated bounceIn">Polityka prywatności opisuje zasady przetwarzania przez nas informacji na Twój temat, w tym danych osobowych oraz ciasteczek, czyli tzw. cookies.</p>
                                <div className="col-md-12 animated bounceInLeft">
                                <ul className="content-page-list">
                                    <li>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</li>
                                    <li>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</li>
                                    <li>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</li>
                                    <li>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</li>
                                    <li>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</li>
                                </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        localPanel: (on) => dispatch(showPanel(on))
    }
}

export default connect(null, mapDispatchToProps)(PrivacyPolicy);