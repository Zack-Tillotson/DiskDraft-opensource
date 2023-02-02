import React from 'react';
import PropTypes from 'prop-types';
import firebaseSelector from '../../../firebase/selector';
import {connect} from 'react-redux';

class AuthGate extends React.Component {
  static propTypes = {

    // One child only pls!
    children: PropTypes.element.isRequired,

    // Firebase selector
    isLoggedIn: PropTypes.bool.isRequired,
    isFullyConnected: PropTypes.bool.isRequired,

  };

  render() {

    if(this.props.isLoggedIn && this.props.isFullyConnected) {
      return React.cloneElement(this.props.children, this.props);
    } else {
      return null;
    }

  }
}

export default connect(firebaseSelector)(AuthGate);
