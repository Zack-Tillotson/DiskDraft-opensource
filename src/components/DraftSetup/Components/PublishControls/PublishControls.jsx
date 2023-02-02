import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';
import moment from 'moment';

class PublishControls extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    draftUrl: PropTypes.string.isRequired,
    lastPublishDate: PropTypes.number,
    onPublishDraft: PropTypes.func.isRequired,
  };

  handlePublishClick = (event) => {
    const saveSetup = this.refs.saveSetupInput.checked;
    this.props.onPublishDraft(saveSetup);
  };

  render() {

    const {
      status,
      draftUrl,
      lastPublishDate,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <div className="publishControls notReadyToPublish">
          <div className="publishTitle">Status: <span className="publishTitleValue">{status}</span></div>
          <div className="statusExplanation">An unpublished draft is only available to be setup and only by organization members. A published draft is visible to anyone you share the link with.</div>
          <div className="publishControl">
            <div className="ctlButton" onClick={this.handlePublishClick}>
              {status === 'published' && 'Update' || 'Publish'}
            </div>
            {!!lastPublishDate && (
              <div className="lastPublishDate">
                Published: <b>{moment(lastPublishDate).format('MMM DD YYYY, h:mm:ss a')}</b>
              </div>
            )}
            <div>
              <input type="checkbox" defaultChecked="checked" id="saveSetupInput" name="saveSetupInput" ref="saveSetupInput" />
              <label htmlFor="saveSetupInput">Remember Configuration</label>
              <div className="statusExplanation">If checked then the organization will have the column configuration and settings available to import for the next draft.</div>
            </div>
          </div>
          {status === 'published' && (
            <div className="publishControl">
              <a href={draftUrl} className="ctlButton important">Link to Draft</a>
            </div>
          )}
        </div>

      </InlineCss>
    );
  }
}

export default PublishControls;