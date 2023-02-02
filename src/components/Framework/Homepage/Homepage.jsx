import React from 'react';
import InlineCss from "react-inline-css";

import {Link} from 'react-router-dom';

import Page from '../Page';

import styles from './styles';

class Homepage extends React.Component {
  render() {
    return (
      <Page showNavigation={false}>
        <InlineCss stylesheet={styles} componentName="container">
          <div className="hero-section">
            <div className="hero-section-inner">
              <h1>Sports leagues should be fun. And now they are.</h1>
              <div className="subheadline">Stress free drafting.</div>
              <div className="actionSection">
                <div className="action">
                  <div className="actionTitle">League Administrators</div>
                  <Link to="/dashboard/">Start Now</Link>
                </div>
                <div className="action">
                  <div className="actionTitle">Captains Drafting Now</div>
                  <Link to="/joinDraft/">Join Your Draft</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="features-section">
            <h3>Administering a draft has never been easier.</h3>
            <div className="feature-subheadline">With DiskDraft, it's easy to:</div>
            <div className="feature-list">
              <div className="feature">
                <div className="feature-image">
                  <i className="material-icons">add_circle_outline</i>
                </div>
                <div className="feature-text">Import data from TopScore in seconds.</div>
              </div>
              <div className="feature">
                <div className="feature-image">
                  <i className="material-icons">tab</i>
                </div>
                <div className="feature-text">Run the draft through our fast, secure website.</div>
              </div>
              <div className="feature">
                <div className="feature-image">
                  <i className="material-icons">save</i>
                </div>
                <div className="feature-text">Save the teams back to TopScore with one click.</div>
              </div>
            </div>
          </div>

          <div className="call-to-action-section">
            <div className="call-to-action-section-inner">
              <h3>Drafting shouldn't be the hard part of running a league.</h3>
              <Link to="/login/">Check it out</Link>
              <div className="subheadline">Your plan should be: Set up the draft in minutes, share it with all of your captains, get everyone together, sit back and drink a beer, accept everyone's praise.</div>
            </div>
          </div>

          <div className="features-section">
            <h3>Your security is a priority. We treat your player's data as if it were our own.</h3>
            <div className="feature-couplet">
              <div className="feature">
                <div className="feature-image">
                  <i className="material-icons">lock_outline</i>
                </div>
                <h4>Secure Connection</h4>
                <div className="feature-text"><b>All connections are encrypted.</b> This helps prevent others from accessing your league's personal information.</div>
              </div>
              <div className="feature">
                <div className="feature-image">
                  <i className="material-icons">call_missed_outgoing</i>
                </div>
                <h4>Manage Access</h4>
                <div className="feature-text"><b>You see and can manage</b> who has access to your league's data. Data access is closed once the draft has expired, the data wont get leaked.</div>
              </div>
            </div>
          </div>

        </InlineCss>
      </Page>
    );
  }
}

export default Homepage;