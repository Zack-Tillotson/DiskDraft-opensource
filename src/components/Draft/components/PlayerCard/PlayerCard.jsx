import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class PlayerCard extends React.Component {
  static propTypes = {
    activePlayer: PropTypes.object,
  };

  // Renders //

  render() {

    const {
      activePlayer,
    } = this.props;

    const noteClass = !!activePlayer ? `playerNote${activePlayer._note}` : '';

    const heightCm = activePlayer.height || 0;
    const heightIn = Math.round(heightCm / 2.54 % 12);
    const heightFt = parseInt(heightCm / 2.54 / 12); // 30.45 cm per ft

    const heightImp = !!heightCm && heightCm > 0 && `${heightFt}'${heightIn}"` || '-'; // '

    return (
      <InlineCss stylesheet={styles} componentName="container" className={`playerCard ${noteClass}`}>
        <div className="image"><img src={activePlayer.image} /></div>
        <div className="textAttrs">
          <div className="attrLine name">{activePlayer.first_name} {activePlayer.last_name}</div>
          <div className="attrLine vector">Vector: {activePlayer.vector}</div>
          <div className="attrLine genderAge">
            <div className="gender">{activePlayer.gender}</div>, <div className="age">{activePlayer.age}</div>
          </div>
          <div className="attrLine heightWeight">
            <div className="height">{[heightImp, activePlayer.weight].join(', ')}</div>
          </div>
        </div>
      </InlineCss>
    );
  }
}

export default PlayerCard;