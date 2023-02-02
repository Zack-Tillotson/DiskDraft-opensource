import React, {Suspense, lazy} from 'react';
import {connect} from 'react-redux';

import { BrowserRouter, Route } from 'react-router-dom';

import firebase from '../firebase';
import firebaseDispatcher from '../firebase/dispatcher';
import frameworkDispatcher from '../components/Framework/state/dispatcher';

import AuthRedirector from '../components/Framework/withAuth/AuthRedirector';

const selector = (state) => {
  return {};
}

const dispatcher = (dispatch, ownProps) => {
  const firebase = firebaseDispatcher(dispatch, ownProps);
  const framework = frameworkDispatcher(dispatch, ownProps);
  return {...firebase, ...framework}
}

const Homepage = lazy(() => import('../components/Framework/Homepage'));
const Login = lazy(() => import('../components/Framework/Login'));
const Register = lazy(() => import('../components/Framework/Register'));
const Dashboard = lazy(() => import('../components/Dashboard/Pages/Dashboard'));
const Organizations = lazy(() => import('../components/Dashboard/Pages/Organizations'));
const OrganizationForm = lazy(() => import('../components/Dashboard/Pages/OrganizationForm'));
const Event = lazy(() => import('../components/Dashboard/Pages/Event'));
const DraftSetup = lazy(() => import('../components/DraftSetup/Pages/DraftSetup'));
const Players = lazy(() => import('../components/DraftSetup/Pages/Players'));
const Columns = lazy(() => import('../components/DraftSetup/Pages/Columns'));
const Teams = lazy(() => import('../components/DraftSetup/Pages/Teams'));
const Settings = lazy(() => import('../components/DraftSetup/Pages/Settings'));
const Draft = lazy(() => import('../components/Draft/Pages/Draft'));
const AddOrganizationMember = lazy(() => import('../components/Dashboard/Pages/AddOrganizationMember'));
const JoinDraft = lazy(() => import('../components/JoinDraft'));


class Application extends React.Component {
  componentDidMount() {
    this.props.monitorConnection();
  }

  onRouteChange = () => {
    this.props.routeChanged();
  };

  render() {
    return (
      <BrowserRouter onUpdate={this.onRouteChange}>
        <Suspense fallback={<div>Loading...</div>}>
          <Route exact path="/" component={() => <AuthRedirector isLoginRequired={false} redirectTarget="/dashboard/"><Homepage /></AuthRedirector>} />
          <Route exact path="/login/" component={() => <AuthRedirector isLoginRequired={false} redirectTarget="/dashboard/"><Login /></AuthRedirector>} />
          <Route exact path="/register/" component={() => <AuthRedirector isLoginRequired={false} redirectTarget="/dashboard/"><Register /></AuthRedirector>} />
          <Route exact path="/dashboard/" component={() => <AuthRedirector><Dashboard /></AuthRedirector>} />
          <Route exact path="/dashboard/organizations/" component={() => <AuthRedirector><Organizations /></AuthRedirector>} />
          <Route exact path="/dashboard/organizations/form/" component={() => <AuthRedirector><OrganizationForm /></AuthRedirector>} />
          <Route exact path="/dashboard/organizations/form/:organizationId/" component={() => <AuthRedirector><OrganizationForm /></AuthRedirector>} />
          <Route exact path="/dashboard/organizations/:organizationId/event/:eventId/" component={() => <AuthRedirector><Event /></AuthRedirector>} />
          <Route exact path="/draftSetup/:draftId/" component={() => <AuthRedirector><DraftSetup /></AuthRedirector>} />
          <Route exact path="/draftSetup/:draftId/players/" component={() => <AuthRedirector><Players /></AuthRedirector>} />
          <Route exact path="/draftSetup/:draftId/columns/" component={() => <AuthRedirector><Columns /></AuthRedirector>} />
          <Route exact path="/draftSetup/:draftId/teams/" component={() => <AuthRedirector><Teams /></AuthRedirector>} />
          <Route exact path="/draftSetup/:draftId/settings/" component={() => <AuthRedirector><Settings /></AuthRedirector>} />
          <Route exact path="/draft/:draftId/" component={() => <AuthRedirector><Draft /></AuthRedirector>} />
          <Route exact path="/joinOrganization/:joinKey/" component={() => <AuthRedirector><AddOrganizationMember /></AuthRedirector>} />
          <Route exact path="/joinDraft/"  component={() => <AuthRedirector><JoinDraft /></AuthRedirector>} />
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default connect(selector, dispatcher)(Application);
