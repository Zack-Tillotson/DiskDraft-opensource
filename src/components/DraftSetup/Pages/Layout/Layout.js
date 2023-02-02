import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';

import Page from '../../../Framework/Page';

import WizardNavigator from '../../components/WizardNavigator';
import ColumnConfiguration from '../../components/ColumnConfiguration';

class Layout extends React.Component {
  static propTypes = {

    // From firebase selector

    firebase: PropTypes.object.isRequired,

    // From local dashboard selector

    // Own props
    step: PropTypes.string.isRequired,


  };

  // Lifecylce hooks //

  componentDidMount() {
    this.props.beginDraftSync(this.props.params.draftId);
    if(this.props.draftMeta.organizationKey) {
      this.props.beginOrganizationSync(this.props.draftMeta.organizationKey);
    }
  }

  componentWillReceiveProps(newProps) {
    newProps.beginDraftSync(newProps.params.draftId);
    if(newProps.draftMeta.organizationKey) {
      newProps.beginOrganizationSync(newProps.draftMeta.organizationKey);
    }
  }

  componentWillUnmount() {
    this.props.endDraftSync();
    this.props.endOrganizationSync();
  }

  getDraftEvent = () => {

    const {draftMeta, organization} = this.props;
    if('eventKey' in draftMeta && 'events' in organization) {
      return organization.events[draftMeta.eventKey];
    } else {
      return {}
    }

  };

  getUserId = () => {
    const {authInfo = {}} = this.props.firebase;
    return authInfo.uid;
  };

  getStatus = () => {
    return this.props.draftMeta.status;
  };

  getNextStepLink = () => {
    const {step} = this.props;
    switch(step) {
      case 'dashboard':
        return `/draftSetup/${this.props.params.draftId}/players/`;
      case 'players':
        return `/draftSetup/${this.props.params.draftId}/columns/`;
      case 'columns':
        return `/draftSetup/${this.props.params.draftId}/teams/`;
      case 'teams':
        return `/draftSetup/${this.props.params.draftId}/settings/`;
      case 'settings':
        return `/draftSetup/${this.props.params.draftId}/`;
    }
  };

  getPrevStepLink = () => {
    const {step} = this.props;
    switch(step) {
      case 'players':
        return `/draftSetup/${this.props.params.draftId}/`;
      case 'columns':
        return `/draftSetup/${this.props.params.draftId}/players/`;
      case 'teams':
        return `/draftSetup/${this.props.params.draftId}/columns/`;
      case 'settings':
        return `/draftSetup/${this.props.params.draftId}/teams/`;
    }
  };

  getCurrentStepName = () => {
    const {step} = this.props;
    return step.charAt(0).toUpperCase() + step.slice(1);
  };

  handleSubmit = () => {

    const result = this.props.submitStep(this.props.step);

    if(result) {
      this.props.router.push(this.getNextStepLink());
    }
  };

  handleBack = () => {
    this.props.router.push(this.getPrevStepLink());
  };

  // Renders //

  getNavigation = () => {
    const {
      draftMeta,
      wizard,
      params: {
        draftId,
      },
      step,
      organization,
    } = this.props;

    return (
      <div className="leftColumn wizardControls">
        <WizardNavigator
          draftId={draftId}
          status={draftMeta.status}
          step={step}
          stepsComplete={wizard.stepsComplete}
          organization={organization}
          event={this.getDraftEvent()}
          organizationKey={draftMeta.organizationKey} />
      </div>
    );
  };

  render() {

    const {
      isSynced,
      draftMeta,
      wizard,
      params: {
        draftId,
      },
      location,
      players,
      columns,
      organization,
      children,
      step,
    } = this.props;

    return (
      <Page navigation={this.getNavigation()}>
        <InlineCss stylesheet={styles} componentName="container">

          {wizard.isRequesting && (
            <div className="spinner">
              <div className="foreground">Please Wait...</div>
            </div>
          )}

          {(!isSynced.draftMeta || !isSynced.organization) && (
            <div className="loading">
              Loading draft setup data...
            </div>
          ) || (
            <div className="postLoadContent">

              <div className="mainContent">

                {children}

                <div className="footerNavCtls">

                  {step !== 'dashboard' && (
                    <div className="submitCtl back" onClick={this.handleBack}>
                      Back
                    </div>
                  )}

                  {step !== 'dashboard' && (
                    <div className="submitCtl" onClick={this.handleSubmit}>
                      Next
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}
        </InlineCss>
      </Page>
    );
  }
}

export default withRouter(connect(selector, dispatcher)(Layout));