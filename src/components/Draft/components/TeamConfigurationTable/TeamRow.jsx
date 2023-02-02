import React from 'react';
import PropTypes from 'prop-types';

import PlayerTable from '../../../Shared/components/PlayerTable';
import PlayerSummaryTable from '../PlayerSummaryTable';

export default function(containerProps) {
  class TeamRow extends React.Component {
    static propTypes = {

      item: PropTypes.object.isRequired, // aka team

      teamNameEditId: PropTypes.number.isRequired,
      startTeamNameEdit: PropTypes.func.isRequired,
      submitTeamNameEdit: PropTypes.func.isRequired,

      teamBaggageAssignId: PropTypes.number.isRequired,
      baggageSearchedPlayers: PropTypes.array.isRequired,
      startAssignBaggage: PropTypes.func.isRequired,
      endAssignBaggage: PropTypes.func.isRequired,
      assignBaggage: PropTypes.func.isRequired,

    };

    static defaultProps = containerProps;

    handleStartNameEdit = () => {
      this.props.startTeamNameEdit(this.props.item.id);
    };

    handleTeamNameSubmit = (event) => {
      event.preventDefault();
      this.props.submitTeamNameEdit(this.props.item.id, this.refs.nameEdit.value);
    };

    handleStartAssignBaggage = () => {
      this.props.startAssignBaggage(this.props.item.id);
    };

    handleEndAssignBaggage = () => {
      this.props.endAssignBaggage();
    };

    handleSubmitAssignBaggage = () => {
      this.props.endAssignBaggage();
    };

    handleAssignPlayer = (shouldAdd, playerId) => {
      const {baggageSearchedPlayers, item: {players}} = this.props;
      const player = [...baggageSearchedPlayers, ...players].find(player => player.draftId == playerId);
      this.props.assignBaggage(shouldAdd, this.props.item.id, player);
    };

    handleSelectionFormInputChange = (event) => {
      this.props.playerSearchTermChanged(event.target.value);
    };

    componentDidMount() {
      if(this.refs.assignSearch) {
        this.refs.assignSearch.focus();
        this.refs.assignSearch.setSelectionRange(this.refs.assignSearch.value.length, this.refs.assignSearch.value.length);
      }
    }

    // Renders //

    renderDraftOrder = () => {
      const {draftId} = this.props.item;
      switch(draftId % 10) {
        case 1: return `${draftId}st`;
        case 2: return `${draftId}nd`;
        case 3: return `${draftId}rd`;
        default: return `${draftId}th`;
      }
    };

    render() {

      const {
        item: team,
        columns,
        index,
        dragHandle,
        teamNameEditId,
        teamBaggageAssignId,
        searchTerm,
        baggageSearchedPlayers,
      } = this.props;

      return (
        <div className="teamRow" key={team.id}>
          {dragHandle(
            <div className="dragTarget">
              <div className="hamburger">
                ☰
              </div>
            </div>
          )}
          <div className="draftOrder">
            <div className="draftOrderTitle">Drafts</div>
            <div className="draftOrderValue">{this.renderDraftOrder()}</div>
          </div>
          {teamNameEditId === team.id && (
            <div className="teamName editable">
              <form onSubmit={this.handleTeamNameSubmit}>
                <input ref="nameEdit" type="text" className="teamNameInput" defaultValue={team.name} placeholder={team.name} />
                <button>Submit</button>
              </form>
            </div>
          ) || (
            <div className="teamName" onClick={this.handleStartNameEdit}>
              {team.name}
            </div>
          )}
          <div className="captains">
            {team.captains.length > 0 && (
              <PlayerSummaryTable
                columns={columns}
                players={team.captains}
                onPlayerSelect={this.handleAssignPlayer.bind(this, false)} />
            ) || 'No captains assigned'}

            {teamBaggageAssignId !== team.id && (
              <i className="material-icons openAssignForm" onClick={this.handleStartAssignBaggage}>add_box</i>
            )}
          </div>
          {teamBaggageAssignId === team.id && (
              <div className="assigningBaggage">
                <input ref="assignSearch"
                  type="text"
                  className="assignSearchInput"
                  value={searchTerm}
                  placeholder="Search by ID or name"
                  onChange={this.handleSelectionFormInputChange} />
                <button onClick={this.handleEndAssignBaggage}>Done</button>
                {baggageSearchedPlayers.length > 0 && (
                  <div className="fullWidth playerSelect">
                    <PlayerTable
                      players={baggageSearchedPlayers}
                      columns={columns}
                      showBaggage={true}
                      onPlayerSelect={this.handleAssignPlayer.bind(this, true)} />
                  </div>
                )}
              </div>
            )}
        </div>
      );
    }
  }

  return TeamRow;
}