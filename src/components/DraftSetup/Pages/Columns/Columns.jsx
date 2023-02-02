import React from 'react';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import WizardNavigator from '../../components/WizardNavigator';
import Layout from '../Layout';
import EditSettings from '../../components/EditSettings';
import ColumnConfiguration from '../../components/ColumnConfiguration';
import PlayerTable from '../../../Shared/components/PlayerTable';
import PlayerDetailTable from '../../../Shared/components/PlayerDetailTable';

class ColumnsPage extends React.Component {
  getColumns = () => {
    const {columns} = this.props;
    return columns.filter(column => column.include && column.visible);
  };

  handlePlayerSelect = (id, player) => {
    const {
      players,
      selectDetailPlayer,
    } = this.props;

    const index = players.indexOf(player);
    if(index >= 0) {
      selectDetailPlayer(index);
    }
  };

  handleOrgDataImport = () => {
    this.props.importOrganizationData();
  };

  handleDeleteOrgData = () => {
    this.props.deleteOrganizationData();
  };

  // Renders //

  render() {

    const {
      players,
      columns,
      wizard: {
        columnStep: {
          activePlayerIndex,
          orgImport,
        },
      },
    } = this.props;

    const activeStep = location.pathname.split('/').reverse()[1];

    return (
      <Layout {...this.props} step="columns">

        <h2>Configure Player Views</h2>

        <ul className="stepExplanation">
          <li>Configure how captains see players.</li>
          <li>"In Summary" columns will be seen in the full player table.</li>
          <li>"Remove" columns which won't be seen even in the detail view.</li>
          <li>Try to select the correct column type, when in doubt choose "Text".</li>
        </ul>

        <div className="importCtls section">
          <h3>Organization Configuration</h3>

          <div className="controlLink" onClick={this.handleOrgDataImport}>
            <i className="material-icons">cloud</i> Import prior organization configuration data.
          </div>

          {typeof orgImport === 'boolean' && orgImport && (
            <div className="substepSuccess success">
              <i className="material-icons">done</i> Imported organization configuration data.
            </div>
          )}

          <div className="controlLink hidden" onClick={this.handleDeleteOrgData}>
            <i className="material-icons">cloud</i> Delete prior organization configuration data.
          </div>

        </div>

        <div className="section">

          <h3>Preview</h3>

          <p className="optionalStep spacey">
            Setup and review how players will be seen. Add, remove, and reorder columns. This information will be saved between drafts. Certain column names are required and reserved for DiskDraft use: "ID", "DraftID", "Vector", "Height", "Gender".
          </p>

          <div className="playerPreview">

            <div className="primaryTable">

              <h4>Players Summary</h4>

              <PlayerTable
                players={players}
                columns={columns.filter(column => column.include && column.visible)}
                showSort={false}
                showAllVisibleColumns={false}
                showStatus={false}
                showBaggage={false}
                onPlayerSelect={this.handlePlayerSelect} />

            </div>

            <div className="secondaryDetail">

              <h4>Detailed View</h4>

              {!!players && players.length > activePlayerIndex && (
                <PlayerDetailTable
                  player={players[activePlayerIndex]}
                  columns={this.getColumns()} />
              )}

            </div>

          </div>

        </div>

        <div className="section">

          <h3>Setup Columns</h3>

          <ColumnConfiguration
            players={players}
            columns={columns}
            updateColumnAttribute={this.props.updateColumnAttribute} />

        </div>

      </Layout>
    );
  }
}

export default connect(selector, dispatcher)(ColumnsPage);