import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class HelpTab extends React.Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    clearColors: PropTypes.func.isRequired,
  };

  handleClearColorClick = () => {
    if(confirm('Are you sure? This can not be undone.')) {
      this.props.clearColors();
    }
  };

  // Renders //

  render() {

    const {
      isAdmin,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <h1>Tips and Tricks</h1>

        <section>
          <h3>Player Status Icons</h3>
          <p>The draft status of players are determined relative to your current team:</p>
          <div className="statuses">
            <div className="status">
              <img title="Drafted" src="/assets/icons/Drafted.png" />
              <div className="description">This player has been drafted by another team or is baggaged to a player drafted by another team.</div>
            </div>
            <div className="status">
              <img title="Drafted By Your Team" src="/assets/icons/TeamDrafted.png" />
              <div className="description">This player has been drafted by your team.</div>
            </div>
            <div className="status">
              <img title="Baggage on Your Team" src="/assets/icons/TeamBaggaged.png" />
              <div className="description">This player is baggaged to someone drafted by your team and has not yet been themselves drafted by your team. You will need to draft this player before the end of the draft.</div>
            </div>
            <div className="status">
              <img title="Limited by Vector" src="/assets/icons/VectorLimited.png" />
              <div className="description">This player is temporarily not legal for your team to draft. A player may not be drafted unless their vector is greater than all of the vectors of undrafted baggage on your team.</div>
            </div>
            <div className="status">
              <img title="Limited by Gender" src="/assets/icons/GenderLimited.png" />
              <div className="description">This player is not legal to draft. By drafting this player your team would have too many men or women.</div>
            </div>
          </div>
          <button onClick={this.handleClearColorClick}>Clear All Colors</button>
        </section>

        <section>
          <h3>Color Coding Players</h3>
          <p>As a captain you may set each player's background color, this is useful for marking players you prefer. This color is private to you and can not be seen by other captains.</p>
        </section>

        {isAdmin && (
          <div>

            <h2>Admin Help</h2>
            <p className="minorNote">The following help sections only apply to draft administrators.</p>

            <section>
              <h3>Updating Player Information</h3>
              <p>If a player's information needs to be updated during the draft you can easily update it on the Players tab by holding the "Alt" key and clicking on the wrong information. Enter the correct information then save by pressing "Enter" or cancel by pressing the "Esc".</p>
            </section>

            <section>
              <h3>Draft Override</h3>
              <p>On the Dashboard tab you can use the Quick Draft Form to easily enter captain selections. Normal drafting rules will be enforced</p>
              <p>If you need to override those rules (eg. Allowing a vector-limited selection) you may force-submit the selection via the 'Override Submit' button in the lower left of the Dashboard's Quick Draft Form.</p>
            </section>

            <section>
              <h3>Saving to TopScore</h3>
              <p>After the draft is complete you may save the selections to TopScore with the 'Update TopScore' button on the Dashboard tab.</p>
              <p>Two pieces of information are required by the TopScore API, client_id and the api_csrf, both of these can be found on the "/u/auth-key" page of your TopScore site. Copy them from your site to DiskDraft's "Update TopScore" form, this information is not saved and will not be used for any other purpose than the Update TopScore form.</p>
              <p>After you copy the information into the DiskDraft form, click "Start" to update TopScore. The form will make one request for each team and can take up to a few seconds per team.</p>
            </section>

          </div>
        )}

      </InlineCss>
    );
  }
}

export default HelpTab;
