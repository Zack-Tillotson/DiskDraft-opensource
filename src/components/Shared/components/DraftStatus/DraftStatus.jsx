import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

const statuses = {
  noDraft: 'no-draft',
  setup: 'setup',
  pending: 'pending',
  active: 'active',
  complete: 'complete',
}

class DraftStatus extends React.Component {
  static propTypes = {
    status: PropTypes.object,
    onCreate: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  handleCreateClick = (event) => {
    this.props.onCreate();
  };

  handleViewSetupClick = (event) => {
    this.props.onViewSetup();
  };

  handleRemoveDraft = (event) => {
    if(window.confirm('Delete the draft? This can not be undone!')) {
      this.props.onRemove();
    }
  };

  handleViewDraftClick = (event) => {
    this.props.onView();
  };

  getStatus = () => {

    const {status = {}} = this.props;

    if(!('status' in status)) {
      return statuses.noDraft;
    } else if(status.status === 'prepublished') {
      return statuses.setup;
    } else {
      return statuses.pending;
    }
  };

  getDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {month: 'short', day: 'numeric', year: 'numeric'});
  };

  render() {

    const status = this.getStatus();
    const {organization} = this.props;

    let statusTitle;
    if(status === statuses.noDraft) {
      statusTitle = 'Not Started';
    } else if(status === statuses.setup) {
      statusTitle = 'In Setup';
    } else if(status === statuses.pending) {
      statusTitle = 'Ready to draft';
    } else if(status === statuses.active) {
      statusTitle = 'Drafting now';
    } else if(status === statuses.complete) {
      statusTitle = 'Complete';
    }

    return (
      <InlineCss
        stylesheet={styles}
        componentName="container"
        className="draftStatus">

        <h2>Draft Status: {statusTitle}</h2>

        <table className="actionOptions">
          <tbody>

            {(status === statuses.pending || status === statuses.active) && (
              <tr className={`viewDraft actionOption`} onClick={this.handleViewDraftClick}>
                <td className="actionIcon bigLink"><i className="material-icons statusIcon">visibility</i></td>
                <td className="actionTitle bigLink">View Draft</td>
                <td className="actionDetail">This is the link to this event's draft. Share it with your captains before the drat so that they can view players, make notes, etc.</td>
              </tr>
            )}

            {status === statuses.noDraft && (
              <tr className={`actionOption`} onClick={this.handleCreateClick}>
                <td className="actionIcon"><i className="material-icons statusIcon">label_outline</i></td>
                <td className="actionTitle">Start A Draft</td>
                <td className="actionDetail">Go through the quick draft setup process. You will be able to import data from TopScore or an external file.</td>
              </tr>
            )}

            {(status === statuses.setup || status === statuses.pending) && (
              <tr className={`actionOption`} onClick={this.handleViewSetupClick}>
                <td className="actionIcon"><i className="material-icons statusIcon">build</i></td>
                <td className="actionTitle">Resume Setup</td>
                <td className="actionDetail">Continue configuring your draft. You can modify the draft information at any time until the draft begins.</td>
              </tr>
            )}

            {status === statuses.complete && (
              <tr className={`actionOption`} onClick={this.handleViewDraftClick}>
                <td className="actionIcon"><i className="material-icons statusIcon">pageview</i></td>
                <td className="actionTitle">View Summary</td>
                <td className="actionDetail">View the draft summary.</td>
              </tr>
            )}

            {status !== statuses.noDraft && (
              <tr className={`actionOption deleteAction`} onClick={this.handleRemoveDraft}>
                <td className="actionIcon"><i className="material-icons statusIcon">visibility_off</i></td>
                <td className="actionTitle">Delete Draft</td>
                <td className="actionDetail">Remove all information associated with the draft - players, teams, draft selections, settings, etc. <b>This can not be undone!</b></td>
              </tr>
            )}
          </tbody>
        </table>

      </InlineCss>
    );
  }
}

export default DraftStatus;