import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import fullSelector from '../../state/selector';
import fullDispatcher from '../../state/dispatcher';

import DraggableList from 'react-draggable-list';
import InlineCss from "react-inline-css";
import styles from './styles';

import TeamRow from './TeamRow';

class TeamConfigurationTable extends React.Component {
  static propTypes = {

    teams: PropTypes.array.isRequired,
    updateTeamDraftOrder: PropTypes.func.isRequired,

    teamNameEditId: PropTypes.number.isRequired,
    startTeamNameEdit: PropTypes.func.isRequired,
    submitTeamNameEdit: PropTypes.func.isRequired,

    teamBaggageAssignId: PropTypes.number.isRequired,
    baggageSearchedPlayers: PropTypes.array.isRequired,
    startAssignBaggage: PropTypes.func.isRequired,
    endAssignBaggage: PropTypes.func.isRequired,
    assignBaggage: PropTypes.func.isRequired,

  };

  handleListOrderChange = (teams) => {
    this.props.updateTeamDraftOrder(teams.map(team => team.id));
  };

  // Renders //

  render() {

    const {
      teams,
      updateTeamDraftOrder,
      ...restProps
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <div ref="teamList">
          <DraggableList
            itemKey="id"
            template={TeamRow(restProps)}
            list={teams}
            onMoveEnd={this.handleListOrderChange}
            useContainer={this.refs.teamList} />
        </div>
      </InlineCss>
    );
  }
}

function selector(state) {
  const full = fullSelector(state);
  return full.higher.teamConfigurationTable;
}

function dispatcher(dispatch, ownProps) {
  const full = fullDispatcher(dispatch, ownProps);
  return full.uiActions.teamConfigurationTable;
}

export default connect(selector, dispatcher)(TeamConfigurationTable);