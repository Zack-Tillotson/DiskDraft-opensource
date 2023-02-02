import React from 'react';
import PropTypes from 'prop-types';
import InlineCss from "react-inline-css";
import {withRouter} from 'react-router';
import firebaseSelector from '../../../firebase/selector';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';

class AuthRedirector extends React.Component {
  static propTypes = {

    // Parameter props
    isLoginRequired: PropTypes.bool.isRequired,
    redirectTarget: PropTypes.string.isRequired,

    // Firebase selector
    isLoggedIn: PropTypes.bool.isRequired,
    isFullyConnected: PropTypes.bool.isRequired,
    authConnected: PropTypes.bool.isRequired,

  };

  static defaultProps = {
    isLoginRequired: true,
    redirectTarget: '/login/'
  }

  componentDidMount() {
    this.checkAuthRequirement();
  }

  componentDidUpdate() {
    this.checkAuthRequirement();
  }

  checkAuthRequirement = () => {
    const {
      authConnected,
      isLoginRequired,
      isLoggedIn,
      redirectTarget,
      history,
    } = this.props;

    const shouldRedirect = authConnected && isLoginRequired !== isLoggedIn;

    if(shouldRedirect) {
      history.push(redirectTarget);
    }
  };

  render() {
    if(!this.props.authConnected) return null;
    return this.props.children;
  }
}

export default withRouter(connect(firebaseSelector)(AuthRedirector));