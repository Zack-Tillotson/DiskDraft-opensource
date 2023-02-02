import React from 'react';
import PropTypes from 'prop-types';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import Image from 'react-imageloader';

import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import firebaseSelector from '../../../firebase/selector';
import firebaseDispatcher from '../../../firebase/dispatcher';

import frameworkSelector from '../state/selector';
import frameworkDispatcher from '../state/dispatcher';

class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    authInfo: PropTypes.object,
    requestLogout: PropTypes.func.isRequired,
    menu: PropTypes.object.isRequired,
    showNavigation: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    showNavigation: true,
  };

  render() {

    const {
      menu: {
        isNavOpen
      },
      children,
      isLoggedIn,
      authInfo,
      requestLogout,
      toggleMenu,
      showNavigation,
    } = this.props;

    const isOpenClass = isNavOpen ? 'nav-open' : 'nav-close';
    const logoHref = isLoggedIn ? '/dashboard/' : '/';

    return (
      <InlineCss stylesheet={styles} componentName="component">
        <header>
          <Link to={logoHref}>
            <div className="imageContainer"><img src="/assets/logo-v2.png" /></div>
          </Link>
          {showNavigation && (
            <div className={`menuOpenClose ${isOpenClass}`} onClick={toggleMenu}>
              {!isNavOpen && '☰'}
              {isNavOpen && '✕'}
            </div>
          )}
          {showNavigation && (
            <nav className={isOpenClass}>
              {isLoggedIn && (
                <div className="userContent">
                  <Image className="userImage" src={authInfo.image}>
                    <img className="default" src="/assets/default-user.jpg" />
                  </Image>
                  <div className="userInfo">
                    <div className="userName">{authInfo.name}</div>
                    <div className="logoutLink" onClick={requestLogout}>Logout</div>
                  </div>
                </div>
              )}
              {!isLoggedIn && (
                <div className="userContent">
                  <Link to="/login/">Login</Link>
                </div>
              )}
              {children && (
                <div className="navContent">
                  {children}
                </div>
              )}
            </nav>
          )}
        </header>
      </InlineCss>
    );
  }
}

function selector(state) {
  const firebase = firebaseSelector(state);
  const framework = frameworkSelector(state);

  return {...firebase, ...framework}
}

function dispatcher(dispatch, ownProps) {
  const firebase = firebaseDispatcher(dispatch, ownProps);
  const framework = frameworkDispatcher(dispatch, ownProps);

  return {...firebase, ...framework}
}

export default connect(selector, dispatcher)(Header);