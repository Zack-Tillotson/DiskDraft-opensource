import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from 'react-inline-css';
import styles from './styles';

import Header from '../Header';
import Body from '../Body';
import Footer from '../Footer';

class Page extends React.Component {
  static propTypes = {
    navigation: PropTypes.element,
    showNavigation: PropTypes.bool,
  };

  static defaultProps = {
    navigation: null,
    showNavigation: true,
  };

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <Header children={this.props.navigation} showNavigation={this.props.showNavigation} />
        <Body>
          {this.props.children}
        </Body>
        <Footer />
      </InlineCss>
    );
  }
}

export default Page;