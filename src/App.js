import React, { Component } from 'react';
import { connect } from 'react-redux';

// Pages
import HomePage from './components/Pages/HomePage';
import Chat from './components/Pages/Chat';
import About from './components/Pages/About';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import Regulations from './components/Pages/Regulations';
import Friends from './components/Pages/Friends';
import Settings from './components/Pages/Settings';
import Profil from './components/Pages/Profil';

// Images
import logo from './img/logo-scroll.png';
import bg1 from './img/core-img/1.png';
import bg2 from './img/core-img/2.png';

// SKROLLR
import { ParallaxProvider } from 'react-skrollr';

import {
  Link
} from 'react-router-dom';

import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

// Layoyts
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ContentLeft from './components/Layout/ContentLeft';

// ButtonSearch
import ButtonSearch from './components/ButtonSearch';

class App extends Component {

    state = {
        ws: null
    }

    webSocketHandler = () => {
        return {
        getter: () => { return this.state.ws },
        setter: (ws) => this.setState({ ws })
        };
    }

    render() {
        const settings = (this.props.localUser && this.props.localUser.sex) && <Route path="/settings" component={ Settings }/>;

        const chat = (this.props.localUser && this.props.localUser.sex) ? <Route path="/chat" render={(props) => <Chat {...props} webSocketHandler={this.webSocketHandler} />} /> : null;

        const profil = (this.props.localUser && this.props.localUser.sex) ? <Route path="/Profil" render={(props) => <Profil {...props} webSocketHandler={this.webSocketHandler} />} /> : null;

        const friends = (this.props.localUser && this.props.localUser.sex) ? <Route path="/friends" render={(props) => <Friends {...props} webSocketHandler={this.webSocketHandler} />} /> : null;

        const buttonSearch = this.props.localUser  &&  this.props.localUser.sex ? <ButtonSearch webSocketHandler={this.webSocketHandler}/> : null;

        const contentLeft = this.props.localUser  &&  this.props.localUser.sex &&  this.props.showPanel ?  <div className="col col-md-3 app-sidebar off-768"> <ContentLeft webSocketHandler={this.webSocketHandler}/></div> : null;

        // OBRAZKI
        const headerImg = this.props.localUser  &&  this.props.localUser.sex &&  !this.props.showPanel ?  <img className="welcome-first-shape" src={bg1} alt="image" /> : null;
        const headerImgHome = this.props.showPanel &&  !this.props.localUser ?  <img className="welcome-first-shape" src={bg1} alt="b" /> : null;
        const headerImgHome2 = !this.props.showPanel &&  !this.props.localUser  ?  <img className="welcome-first-shape" src={bg1} alt="b" /> : null;

        var className = 'col col-md-12';
        if (this.props.localUser  &&  this.props.localUser.sex &&  this.props.showPanel) {
            className = 'col col-md-9  app-content';
        }

        var appClassName = 'App container-fluid';
        if (this.props.localUser && this.props.showPanel) {
            appClassName = 'App container-fluid app-no-scroll header-img-off';
        }

        return (
            <ParallaxProvider
            init={{
                smoothScrollingDuration: 500,
                smoothScrolling: true,
                forceHeight: false
            }}
            >
            <div className={ appClassName }>
                <BrowserRouter> 
                    <div className="vh-100">
                    <Header webSocketHandler={this.webSocketHandler} />
                    <Link to="/" >
                    <img className="logo" alt="ChatApp" src={logo} height="100" />
                    </Link>
                    <div className="welcome-bg-shape">
                        {headerImg}
                        {headerImgHome}
                        {headerImgHome2}
                        <img className="welcome-second-shape" src={bg2} alt="image" />
                    </div>
                    { buttonSearch }
                    <div className="container-fluid l-section-app">
                        {contentLeft}
                        <div className={className}>
                        <Switch>
                            <Route exact path="/" component={ HomePage } />
                            { chat }
                            <Route path="/About" component={ About }/>
                            <Route path="/Regulations" component={ Regulations }/>
                            <Route path="/PrivacyPolicy" component={ PrivacyPolicy }/>
                            { profil }
                            { friends }
                            { settings }
                            <Route component={ HomePage } /> 
                        </Switch>
                        </div>
                    </div>
                    </div>
                </BrowserRouter>
                <Footer/>
            </div>
            </ParallaxProvider>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
    showPanel: state.authentication.showPanel,
})

export default connect(mapStateToProps, mapDispatchToProps)(App);