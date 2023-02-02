import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class SelectionCountdown extends React.Component {
  static propTypes = {
    turnsTillSelection: PropTypes.number.isRequired,
    hasMoreSelections: PropTypes.bool.isRequired,
  };

  // Renders //

  render() {

    const {
      turnsTillSelection,
      hasMoreSelections,
    } = this.props;

    if(!hasMoreSelections) {
      return null;
    }

    const isYouNowClassname = turnsTillSelection === 0 ? 'yourTurn' : '';

    return (
      <InlineCss stylesheet={styles} namespace="selectionCountdown" componentName="container" className={isYouNowClassname}>
        {turnsTillSelection === 0 && (
          <div className="selctionCount">Your turn!</div>
        )}
        {turnsTillSelection === 1 && (
          <div className="selctionCount">Your turn is next</div>
        )}
        {turnsTillSelection > 1 && (
          <div className="selctionCount">You go in {turnsTillSelection} turns</div>
        )}
      </InlineCss>
    );
  }
}

export default SelectionCountdown;
