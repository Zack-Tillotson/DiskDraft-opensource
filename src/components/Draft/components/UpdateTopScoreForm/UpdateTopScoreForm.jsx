import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class UpdateTopScoreForm extends React.Component {
  static propTypes = {

    organization: PropTypes.object.isRequired,
    csrf: PropTypes.string.isRequired,
    ajaxResult: PropTypes.object.isRequired,

    closeForm: PropTypes.func.isRequired,
    updateApiCsrf: PropTypes.func.isRequired,
    runUpdateTopScore: PropTypes.func.isRequired,

  };

  getOrganizationEditUrl = () => {
    return `/dashboard/organizations/form/${this.props.organization.key}/`;
  };

  getCsrfLink = () => {
    return `https://${this.props.organization.topScoreUrl}/u/auth-key`;
  };

  getIsCsrfValid = () => {
    return !this.props.csrf || this.props.csrf.length > 50;
  };

  // Event handlers

  handleCloseClick = () => {
    this.props.closeForm();
  };

  handleRunClick = () => {
    this.props.runUpdateTopScore();
  };

  handleCsrfChange = ({target: {value}}) => {
    this.props.updateApiCsrf(value);
  };

  handleClientIdChange = ({target: {value}}) => {
    this.props.updateApiClientId(value);
  };

  // Renders //

  renderCsrfWarning = () => {
    if(this.getIsCsrfValid()) {
      return null;
    } else {
      return (
        <div className="csrfWarning">
          This does not look like a valid CSRF Token. Please copy the value labeled "Current CSRF Token [api_csrf]" from your TopScore website.
        </div>
      );
    }
  };

  render() {

    const {
      csrf,
      clientId,
      ajaxResult,
      organization,
    } = this.props;

    const isValidForm = (!!this.props.csrf && this.getIsCsrfValid())
      && (!!clientId || !!organization.topScoreUser);

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <div className="closeBtn" onClick={this.handleCloseClick}>Back</div>

        <h1>Update TopScore</h1>

        <section className="form">
          {!organization.topScoreUser && (
            <label htmlFor="clientId">
              Client ID [auth_token] (<a className="csrfLink" href={this.getCsrfLink()} target="_blank">Get Here</a>)
              <input type="text" value={clientId} onChange={this.handleClientIdChange} />
            </label>
          )}
          {!organization.topScoreUser && (
            <div className="usageWarning">
              <span className="usageWarningTitle">What is this?</span>
              &nbsp;
              <span className="explanationText">This token is similar to a user name. It is private to you, DiskDraft can store this information if you'd like but is not required for running a draft.</span>
            </div>
          )}

          <label htmlFor="csrf">
            Current CSRF Token [api_csrf] (<a className="csrfLink" href={this.getCsrfLink()} target="_blank">Get Here</a>)
            <input type="text" value={csrf} onChange={this.handleCsrfChange} />
          </label>
          {this.renderCsrfWarning()}
          <div className="usageWarning">
            <span className="usageWarningTitle">What is this?</span>
            &nbsp;
            <span className="explanationText">This token is similar to a temporary one hour password. It is private to you, DiskDraft does not store this information and will not transmit it except to your TopScore site.</span>
          </div>

          <div className="controlBtns">
            <button className="startBtn" onClick={this.handleRunClick} disabled={isValidForm ? false : 'disabled'}>Start</button>
          </div>
        </section>

        {ajaxResult.inProgress || ajaxResult.results.length > 0 && (
          <section className="results">
            <div className="resultCount">
              Update Teams {ajaxResult.results.length} / {ajaxResult.teamCount}
              &nbsp;
              {ajaxResult.inProgress && (
                <i className="material-icons sync">sync</i>
              )}
              {!ajaxResult.isProgress && ajaxResult.success && (
                <i className="material-icons success">done</i>
              ) || (
                <i className="material-icons fail">done</i>
              )}
            </div>
            {ajaxResult.results.map((result, index) => (
              <div key={result.name} className="resultRow">
                <div className="num">{index + 1}.</div>
                <div className="name">{result.name}</div>
                <div className="count">{result.playerCount} players</div>
                <div className="result">
                  {result.success && (
                    <i className="material-icons success">done</i>
                  ) || (
                    <i className="material-icons fail">error</i>
                  )}
                  {!result.success && ' Something went wrong, please verify the Client ID and CSRF Token values and try again'}
                </div>
              </div>
            ))}
          </section>
        )}

      </InlineCss>
    );
  }
}

export default UpdateTopScoreForm;