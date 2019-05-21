import React, { Component } from 'react';
import { connect } from 'react-redux';
import {updateUser} from '../../actions/authentication';

import { 
    MDBIcon,
    MDBInput, 
    MDBAlert, 
    Animation 
} from "mdbreact";

import ProgressButton from 'react-progress-button'
import 'filepond/dist/filepond.min.css';

// 3 panels
import '@zendeskgarden/react-tabs/dist/styles.css';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import { Tabs, TabPanel } from '@zendeskgarden/react-tabs';
///

import update from 'immutability-helper';

/// IMAGE INPUT
import ImageUploader from 'react-images-upload';

/// IMAGES
import user from '../../img/user.png';
import male from '../../img/male.png';
import female from '../../img/female.png';
import happy from '../../img/icons-png/1f60a.png';
import sad from '../../img/icons-png/1f613.png';

import userEdit from '../../img/icons/fa/fa-user-edit.svg';

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

const date = new Date();
const year = date.getFullYear();


class ContentLeft extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            pictures: [],
            selectedKey: 'tab-2',
            minAge: props.localUser.acceptableAgeLowerLimit === 0 ? '18' : props.localUser.acceptableAgeLowerLimit,
            maxAge: props.localUser.acceptableAgeUpperLimit === 0 ? '120' : props.localUser.acceptableAgeUpperLimit,
            sex: props.localUser.acceptableSex,
            distance: props.localUser.acceptableDistance,
            desc: this.props.localUser.aboutMe ? this.props.localUser.aboutMe : '',
            hobby: '',
            message: null,
            age:  this.props.localUser.dateOfBirth,
            buttonState: '',
            edited: null,
            file: null,
            image: false,
        };
    }

    // to powinno byc w api 
    setAvatar = () => {
        const imageUrl = 'https://e-chatapp.pl:3111/photos/'+this.props.localUser.email+'/'+this.props.localUser.email+'.jpg?' + new Date().getTime();
        const img = new Image();
        console.log(imageUrl);
        img.onload = () => { this.setState({image: true}); console.log('true')};
        img.onerror = () => { this.setState({image: false});  console.log('false')};
        img.src = imageUrl;
    }

    componentDidMount = () => {
        this.setAvatar();
    };

    closeError = (event) => {
        this.setState ({
            message: null,
        })   
        return;
    }

    onUpdate = (values, handle, unencoded, tap, positions) => {
        this.setState({
            minAge: values[0],
            maxAge: values[1],
        });
    }
    
    // plec
    onSexChanged = (event) => {
        console.log(event);
        this.setState ({
            sex: event.target.value
        })
    }

    // opis
    onDescChanged = (event) => {
        console.log(event);
        this.setState ({
            desc: event.target.value
        })
    }

    // hobby
    onHobbyChanged = (event) => {
        console.log(event);
        this.setState ({
            hobby: event.target.value
        })
    }


    // SAVE SETTINGS
    saveSettings = () => {
        this.onSaveSettings(Math.round(this.state.minAge), Math.round(this.state.maxAge), parseInt(this.state.sex), Math.round(this.state.distance), this.state.desc, this.state.hobby, this.state.edited);
        this.setState({
            hobby: '',
            desc: '',
            edited: null,
        });
        setTimeout( () => 
            this.setState({
                message: 'Zapisano zmiany!',
            }),
        1000 );

        setTimeout( () => 
            this.setState ({
                message: null,
            }),
        3000 );

        // BUTTON SAVE
        this.setState({
            buttonState: 'loading'
        });
        // make asynchronous call
        setTimeout(() => {
            this.setState({
                buttonState: 'success',
            })
        }, 1000)
        setTimeout(() => {
            this.setState({
                buttonState: '',
            })
        }, 3000)
    }

    saveEditSettings = () => {
        this.setState({
            edited: 1,
        })
    }

    noEditSettings = () => {
        this.setState({
            edited: null,
        })
    }

    onSaveSettings = (minAge, maxAge, sex, distance, desc, hobby) => {
        let user = update(this.props.localUser, {$merge: { acceptableAgeLowerLimit: minAge, acceptableAgeUpperLimit: maxAge, acceptableSex: sex, acceptableDistance: distance }});
        if (desc !== '') {
            user.aboutMe = desc;
        }
        if (hobby !== '') {
            user.hobby = hobby;
        }
        delete user.status;
        const request = { ...user, TODO: 'UPDATE' }; // zmiana z ToDoUpdate
        this.props.webSocketHandler().getter().json(request);
        console.log(request);
        this.props.updateUser(user);
    }

    fileChanged = (event) => {
        console.log(event.target.files[0])
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                fileName: file.name,
                file: e.target.result
            })
        }
        if (file)
            reader.readAsDataURL(file);
    }

    uploadHandler = () => {
        if(this.state.file) {
            let formData = new FormData();
            formData.append('image_data', this.state.file.substring(22));
            formData.append('image_tag', this.props.localUser.email);
            const requestOptions = {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            };
            return fetch('https://e-chatapp.pl:3111', requestOptions).then(
                (response) => {
                    console.log('udalo sie');
                    this.setState({
                        file: null,
                        message: 'Zmieniono zdjęcie!',
                        
                    })
                    setTimeout( () => 
                        this.setState ({
                            message: null,
                        }),
                    3000 );
                    this.setAvatar();
                    return response.status;
                },
                (response) => {
                    console.log(response);
                    return response;
                },
            );
        }
    }
    
    render () {
        const aboutTextarea = this.state.edited 
                                ? <div className="pt-3">
                                    <MDBInput maxLength='300' type='textarea' value={this.state.desc} onChange={this.onDescChanged} label={'Opisz siebie...'} rows='1' /><p className="small">*maksymalnie 300 znaków</p>
                                </div> 
                                : (!this.props.localUser.aboutMe 
                                    ? <div> <MDBInput maxLength='300' type='textarea' value={this.state.desc} onChange={this.onDescChanged} label={'Opisz siebie...'} rows='1' /><p className="small">* maksymalnie 300 znaków</p></div> 
                                    : null);

        const buttonAboutEdit =  !this.state.edited && this.props.localUser.aboutMe
                            ? <div className="content-left-inner-edited"> <button onClick={this.saveEditSettings} type="button"  className="site-btn"><MDBIcon className="mr-2" icon="pencil" /> Edytuj</button> </div>
                            : this.props.localUser.aboutMe 
                                ? <div className="content-left-inner-edited"> <button onClick={this.noEditSettings} type="button"  className="site-btn site-btn--small mb-4"><MDBIcon className="mr-2" icon="times" /> Anuluj</button>
                                </div>
                                : null ;

        const hobbyTextarea = this.state.edited 
                            ? <div className="pt-3">
                                <MDBInput maxLength='300' type='textarea' value={this.state.hobby} onChange={this.onHobbyChanged} label={'Jakie masz hobby?'} rows='1' /><p className="small">* maksymalnie 300 znaków</p>
                            </div> 
                            : (!this.props.localUser.hobby 
                                ? <div> <MDBInput maxLength='300' type='textarea' value={this.state.hobby} onChange={this.onHobbyChanged} label={'Jakie masz hobby?'} rows='1' /><p className="small">*maksymalnie 300 znaków</p></div> 
                                : null);

        const buttonHobbyEdit =  !this.state.edited && this.props.localUser.hobby
                            ? <div className="content-left-inner-edited"> <button onClick={this.saveEditSettings} type="button"  className="site-btn"><MDBIcon className="mr-2" icon="pencil" /> Edytuj</button> </div>
                            : this.props.localUser.hobby 
                                ? <div className="content-left-inner-edited"> <button onClick={this.noEditSettings} type="button"  className="site-btn site-btn--small mb-4"><MDBIcon className="mr-2" icon="times" /> Anuluj</button>
                                </div>
                                : null ;

        const sadEmotikonAbout =  <p className="center mt-1 mb-5">Nie masz jeszcze opisu &nbsp;
                                        <img className="content-icon" src={sad} alt="icon" />              
                                    </p>;

        const sadEmotikonHobby =  <p className="center mt-1 mb-5">Nie masz jeszcze hobby &nbsp;
                                    <img className="content-icon" src={sad} alt="icon" />              
                                    </p>;

        const imageUrl = 'https://e-chatapp.pl:3111/photos/'+this.props.localUser.email+'/'+this.props.localUser.email+'.jpg?' + new Date().getTime();

        const imageProfile = this.state.image ? <div className="content-left__photo_img"><img src={imageUrl} alt={this.props.localUser.name} /></div>
                                    : <span className="content-left__photo__letter">{this.props.localUser.name}</span>;          

        return (
            <div className="content-left-hld">
                {this.state.message ? 
                <div onClick={this.closeError}>
                    <MDBAlert dismiss color="success">{ this.state.message }&nbsp;<img className="content-icon" src={happy} alt="icon" /></MDBAlert>
                </div>
                : null }

            <Animation type="slideInUp" >

                <div className="content-left-inner">

                    <div className="content-left__photo-hld">

                        {imageProfile}

                        <div className="content-left__photo__bubble">
                            <span className="content-left__photo__bubble-outer-dot">
                                <span className="content-left__photo__bubble-inner-dot"></span>
                            </span>
                        </div>
                    </div>

                    <p className="mt-1 pt-4 mb-3 font-weight-bold text-center">
                        { this.props.localUser.name },&nbsp;
                        { this.state.age ? year - ((this.state.age).slice(6, 10) ) : null }&nbsp;
                        { (this.props.localUser.sex === 2) ? <img src={female} alt="kobieta" className="content-left__gender" /> : <img src={male} alt="mezczyzna" className="content-left__gender" /> }
                    </p>


                    <div className="pt-1 mb-1 grey-text text-center d-flex justify-content-center">

                        <ThemeProvider>

                            <Tabs selectedKey={this.state.selectedKey} onChange={selectedKey => this.setState({ selectedKey })}>

                                <TabPanel label={<div> <img className="" alt="icon" src={userEdit} height="23" /> </div>} key="tab-1">
                                    <div>
                                        <p className="pt-1 mb-5 text-center content-panel__text">Edycja profilu</p> 
                                    </div>

                                    <Accordion>
                                        <AccordionItem>
                                            <AccordionItemTitle>
                                                <MDBIcon icon="camera-retro" />
                                                <h3>Zdjęcie</h3>
                                            </AccordionItemTitle>
                                            <AccordionItemBody>
                                                {this.state.file ?
                                                <ProgressButton type="button" onClick={this.uploadHandler} state={this.state.buttonState}>
                                                    <MDBIcon icon="check" /> Ok
                                                </ProgressButton>
                                                : null}
                                                <input type='file' onChange={this.fileChanged}></input>
                                            </AccordionItemBody>
                                        </AccordionItem>

                                        <AccordionItem>
                                            <AccordionItemTitle>
                                                <MDBIcon icon="edit" />
                                                <h3>O mnie</h3>
                                            </AccordionItemTitle>
                                            <AccordionItemBody>
                                                <ProgressButton type="button" onClick={this.saveSettings} state={this.state.buttonState}>
                                                    <MDBIcon icon="check" /> Ok
                                                </ProgressButton>
                                                <p className="mt-4 mb-4 center">
                                                    {this.props.localUser.aboutMe ? this.props.localUser.aboutMe : sadEmotikonAbout }
                                                    {this.props.localUser.aboutMe === " " || this.props.localUser.aboutMe === "  " || this.props.localUser.aboutMe === "   " ? sadEmotikonAbout : null }
                                                </p>
                                                {aboutTextarea}
                                                {buttonAboutEdit}
                                            </AccordionItemBody>
                                        </AccordionItem>

                                        <AccordionItem>

                                            <AccordionItemTitle>
                                                <MDBIcon icon="gamepad" />
                                                <h3>Moje hobby</h3>
                                            </AccordionItemTitle>

                                            <AccordionItemBody>
                                                <ProgressButton type="button"  onClick={this.saveSettings} state={this.state.buttonState}>
                                                    <MDBIcon icon="check" /> Ok
                                                </ProgressButton>
                                                <p className="mt-4 mb-4 center">
                                                    {this.props.localUser.hobby  ? this.props.localUser.hobby : sadEmotikonHobby }
                                                    {this.props.localUser.hobby === " " || this.props.localUser.hobby === "  " || this.props.localUser.hobby === "   " ? sadEmotikonHobby : null }
                                                </p>
                                                {hobbyTextarea}
                                                {buttonHobbyEdit}
                                            </AccordionItemBody>
                                        </AccordionItem>

                                    </Accordion>
                                    
                                </TabPanel>

                                <TabPanel label={<div> <MDBIcon icon="gear" /></div>} key="tab-2">
                                    <div>
                                        <p className="pt-1 mb-3 pb-3 text-center lead content-panel__text">Kryteria wyszukiwania</p>

                                        <Accordion>
                                            <AccordionItem>
                                                <AccordionItemTitle>
                                                    <MDBIcon icon="heart" />
                                                    <h3>Wiek rozmówcy</h3>
                                                </AccordionItemTitle>
                                                <AccordionItemBody>
                                                    <ProgressButton type="button" onClick={this.saveSettings} state={this.state.buttonState}>
                                                        <MDBIcon icon="check" /> Ok
                                                    </ProgressButton>
                                                    <div className="pt-5">
                                                        <Nouislider range={{ min: 18, max: 120 }} start={[this.state.minAge, this.state.maxAge]} connect onUpdate={this.onUpdate} />
                                                        <p className="pt-3 lead grey-text">
                                                            {this.state.minAge > 18 ? Math.round(this.state.minAge) : '18'} - {Math.round(this.state.maxAge)} lat
                                                        </p>
                                                    </div>
                                                </AccordionItemBody>
                                            </AccordionItem>

                                            <AccordionItem>
                                                <AccordionItemTitle>
                                                    <MDBIcon icon="transgender" />
                                                    <h3>Szukam</h3>
                                                </AccordionItemTitle>
                                                <AccordionItemBody>
                                                    <ProgressButton type="button" onClick={this.saveSettings} state={this.state.buttonState}>
                                                        <MDBIcon icon="check" /> Ok
                                                    </ProgressButton>
                                                    <div className="pt-2">
                                                        <select onChange={this.onSexChanged} value={this.state.sex} type="select">
                                                            <option value={2}>Kobiet</option>
                                                            <option value={1}>Mężczyzn</option>
                                                            <option value={3}>Kobiet i mężczyzn</option>
                                                        </select>
                                                    </div>
                                                </AccordionItemBody>
                                            </AccordionItem>

                                        </Accordion>
                                    </div>

                                </TabPanel>

                                <TabPanel label={<div> <MDBIcon icon="signal" /></div>} key="tab-3">
                                    <div>
                                        <p className="pt-1 mb-3 text-center content-panel__text">Statystyki</p>
                                        <div className="px-1 mb-3 pb-2 lead grey-text text-center">
                                            <p>Rozmowy pozytywne <img className="emotik" src={happy} alt="user" /> </p>
                                            <p className="pt-3 lead medium accent grey-text">
                                                {this.props.localUser.countPositiveDating}
                                            </p>
                                        </div>
                                        <div className="px-1 mb-3 pb-2 lead grey-text text-center">
                                            <p>Rozmowy negatywne <img className="emotik" src={sad} alt="user" />  </p>
                                            <p className="pt-3 lead medium accent grey-text">
                                                {this.props.localUser.countNegativeDating}
                                            </p>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>

                    </ThemeProvider>
                </div>

                </div>
                </Animation>
            </div>
        );
    }

}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => dispatch(updateUser(user))
    }
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentLeft);
