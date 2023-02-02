import React from 'react';
import InlineCss from 'react-inline-css';
import styles from './styles';

class Body extends React.Component {
  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.props.children}
      </InlineCss>
    );
  }
}

export default Body;