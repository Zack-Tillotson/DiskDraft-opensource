import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class DraftQueue extends React.Component {
  static propTypes = {
    comingDraftOrder: PropTypes.array.isRequired,
    onTeamSelect: PropTypes.func.isRequired,
  };

  handleTeamSelect = (teamId) => {
    this.props.selectContextTeam(teamId);
  };

  // Renders //

  renderDraftRounds = () => {

    const {
      comingDraftOrder,
      onTeamSelect,
    } = this.props;

    let draftIndex = 0;
    const ret = [];

    while(draftIndex < comingDraftOrder.slice(0, 8).length) {

      const selection = comingDraftOrder[draftIndex];

      if(draftIndex > 0 && selection.round !== comingDraftOrder[draftIndex - 1].round) {
        ret.push(
          <div key={`round-${selection.round}`} className="roundTitle">Round {selection.round}</div>
        );
      }

      const nowClass = draftIndex === 0 ? 'draftingNow' : '';
      const contextClass = selection.team.isContextTeam ? 'contextTeam' : '';

      ret.push(
        <div key={`selection-${selection.overallSelection}`}
          className={`selectionItem ${nowClass} ${contextClass}`}
          onClick={this.handleTeamSelect.bind(this, selection.team.id)}>
          {selection.overallSelection}. {selection.team.name}
        </div>
      );

      draftIndex++;

    }

    return ret;
  };

  render() {

    return (
      <InlineCss stylesheet={styles} namespace="draftQueue" componentName="container">
        <h3><i className="material-icons timeIcon">access_time</i> Drafting Now</h3>
        {this.renderDraftRounds()}
      </InlineCss>
    );
  }
}

export default DraftQueue;