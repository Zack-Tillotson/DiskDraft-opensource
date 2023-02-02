import React from 'react';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import {Link, withRouter} from 'react-router';

import Layout from '../Layout';
import StepStatus from '../../components/StepStatus';
import PublishControls from '../../components/PublishControls';

class DraftSetupPage extends React.Component {
  getIsReadyToPublish = () => {
    const {wizard} = this.props;
    return Object.values(wizard.stepsComplete).reduce((soFar, val) => (soFar && val), true);
  };

  // Renders //

  render() {

    const {wizard, draftMeta, params: {draftId}} = this.props;

    return (
      <Layout {...this.props} step="dashboard">

        <h2>Draft Setup</h2>

        <StepStatus stepsComplete={wizard.stepsComplete} draftId={draftId} />

        {this.getIsReadyToPublish() && (
          <PublishControls
            status={draftMeta.status}
            draftUrl={`/draft/${draftMeta.pathKey}/`}
            lastPublishDate={draftMeta.lastPublishDate}
            onPublishDraft={this.props.publishDraft} />
        )}

      </Layout>
    );
  }
}

export default withRouter(connect(selector, dispatcher)(DraftSetupPage));