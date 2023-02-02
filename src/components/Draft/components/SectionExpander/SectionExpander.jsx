import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class SectionExpander extends React.Component {
  static propTypes = {
    expandedDetail: PropTypes.bool.isRequired,
    toggleDetailSize: PropTypes.func.isRequired,
  };

  // Renders //

  render() {

    const {expandedDetail, toggleDetailSize} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container" onClick={toggleDetailSize}>
        {expandedDetail && '︽'}
        {!expandedDetail && '︾'}
      </InlineCss>
    );
  }
}

export default SectionExpander;