import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContentLeft from '../Layout/ContentLeft';
import {showPanel} from '../../actions/authentication';

class Profil extends Component {

    state = {
        ws: null
    }

    componentDidMount = () => {
        this.props.localPanel(true)
    }

    render() {
        const contentLeft = this.props.localUser  &&  this.props.localUser.sex &&  this.props.showPanel ?  <div className="col col-md-3 app-sidebar--profile"> <ContentLeft webSocketHandler={this.props.webSocketHandler}/></div> : null;

        return (
            <div className="">
                {contentLeft}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        localPanel: (on) => dispatch(showPanel(on)),
    }
}

const mapStateToProps = (state) => ({
    localUser: state.authentication.loggedUser,
    showPanel: state.authentication.showPanel,
})

export default connect(mapStateToProps, mapDispatchToProps)(Profil);