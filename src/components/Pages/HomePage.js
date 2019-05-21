import React, { Component } from 'react';
import Primary from '../Primary';
import { connect } from 'react-redux';
import {showPanel} from '../../actions/authentication';

class HomePage extends Component {

    componentDidMount = () => {
        this.props.localPanel(true)
    }

    render () {
        return (
                <div className="container-fluid">
                    <Primary text=""></Primary> 
                </div>
        );
    }
    
}

const mapDispatchToProps = dispatch => {
    return {
        localPanel: (on) => dispatch(showPanel(on))
    }
}

export default connect(null, mapDispatchToProps)(HomePage);
