import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class MiniPlayer extends React.Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  getAge = () => {
    return parseInt((Date.now() - new Date(this.props.player.birth_date)) / 365 / 24 / 60 / 60 / 1000);
  };

  isValidPlayer = () => {
    const {player} = this.props;

    return player && ['id', 'first_name', 'last_name', 'gender'].every(attr => player[attr]);
  };

  renderRoles = (player) => {
    const {role} = player;

    if(role instanceof Array) {
      return role.map(role => <div key={role}>{role}</div>);
    } else {
      return role;
    }
  };

  render() {

    const {player, className} = this.props;
    const includeClass = player._include ? 'include' : 'exclude';

    return (
      <InlineCss stylesheet={styles} componentName="container" className={className}>

        {this.isValidPlayer() && (

          <div className="validPlayer" key="valid">
            <div className="smallImage"><img src={player.image} /></div>
            <div className="primaryData">
              <div className="line">
                <div className="name">{player.first_name} {player.last_name}</div>
              </div>
              <div className="minorLine">
              {player.nickname && (
                (<div className="nickname">{player.nickname}</div>)
              )}
                <div className="email">{player.email_address}</div>
              </div>
              <div className="minorLine">
                <div className="gender">{player.gender}</div>
                <div className="age">, Age {this.getAge()}</div>
              </div>
            </div>
            <div className="secondaryData">
              <div className="attr">
                <div className="attrTitle">status</div>
                <div className="attrValue">{player.status}</div>
              </div>
              <div className="attr">
                <div className="attrTitle">role</div>
                <div className="attrValue">{this.renderRoles(player)}</div>
              </div>
            </div>
          </div>
        )}

        {!this.isValidPlayer() && (
          <div className="invalidPlayer" key="invalid">
            Invalid Player
          </div>
        )}

      </InlineCss>
    );
  }
}

export default MiniPlayer;