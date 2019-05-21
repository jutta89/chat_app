import React, { Component } from 'react';
import image from '../../img/core-img/smile.svg';

import { connect } from 'react-redux';
import {showPanel} from '../../actions/authentication';

class About extends Component {

    componentDidMount = () => {
        this.props.localPanel(false)
    }

    render () {
        return (
            <div className="first-section">
                <div className="container vh-100">
                    <div className="col col-md-12">
                        <section>
                            <h1 className="py-5 font-weight-bold text-center ">Lorem ipsum</h1>
                            <p className="px-5 my-5 grey-text text-center animated bounceIn">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                            <div className="row mt-3">
                                <div className="col-md-4 animated bounceInLeft">
                                    <div className="row mb-2">
                                        <div className="col-2">
                                            <i className="fa fa-2x fa-group deep-purple-text"></i>
                                        </div>
                                        <div className="col-10 text-left">
                                            <h5 className="font-weight-bold">Lorem ipsum</h5>
                                            <p className="grey-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2">
                                            <i className="fa fa-2x fa-thumbs-up deep-purple-text"></i>
                                        </div>
                                        <div className="col-10 text-left">
                                            <h5 className="font-weight-bold">Lorem ipsum</h5>
                                            <p className="grey-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 pt-5 center-on-small-only flex-center">
                                    <img src={image} alt="" className="z-depth-0"></img>
                                </div>

                                <div className="col-md-4 animated bounceInRight">

                                <div className="row mb-2">
                                    <div className="col-2">
                                        <i className="fa fa-2x fa-heart deep-purple-text"></i>
                                    </div>
                                    <div className="col-10 text-left">
                                        <h5 className="font-weight-bold">Lorem ipsum</h5>
                                        <p className="grey-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-2">
                                        <i className="fa fa-2x fa-flash deep-purple-text"></i>
                                    </div>
                                    <div className="col-10 text-left">
                                        <h5 className="font-weight-bold">Lorem ipsum</h5>
                                        <p className="grey-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </section>
                    </div>
                </div>
            
            </div>
        );
    }
}


// ustawia stan
const mapDispatchToProps = dispatch => {
    return {
        localPanel: (on) => dispatch(showPanel(on))
    }
}


export default connect(null, mapDispatchToProps)(About);