import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class OrganizationForm extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    isOwner: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
  };

  getInputs = () => {
    let name = this.props.form.inputs.name;
    let topScoreUrl = this.props.form.inputs.topScoreUrl;
    if(this.props.isOwner) {
      name = this.refs.orgName.value;
      topScoreUrl = this.refs.topScoreUrl.value;
    }
    const topScoreUser = this.refs.topScoreUser.value;
    return {name, topScoreUrl, topScoreUser};
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    const pathKey = this.props.form.pathKey;
    const organization = this.getInputs();

    if(pathKey) {
      organization.pathKey = pathKey;
    }

    this.props.onSubmit(organization);
  };

  handleTopScoreValidation = () => {

    event.preventDefault();

    const pathKey = this.props.form.pathKey;
    const organization = this.getInputs();

    if(pathKey) {
      organization.pathKey = pathKey;
    }

    this.props.onValidate(organization);
  };

  handleTopScoreAuthLinkClick = () => {
    window.open(`https://${this.getInputs().topScoreUrl}/u/auth-key/`, '_blank');
  };

  handleDeleteClick = () => {

    const pathKey = this.props.form.pathKey;
    const organization = this.getInputs();

    if(pathKey) {
      organization.pathKey = pathKey;
    }

    this.props.onDeleteClick(organization);
  };

  render() {

    const {
      form: {
        pathKey,
        inputs: {
          name,
          topScoreUrl,
          topScoreUser,
        },
        isRequesting,
        isSubmitted,
        validation: {
          name: nameValidation,
          topScoreApi,
          topScoreEvents,
          topScoreRegs,
          topScoreTeams,
        },
      },
      isOwner,
    } = this.props;

    const topScoreApiError = !topScoreApi || !topScoreEvents || !topScoreRegs || !topScoreTeams;
    const isRequestingClass = isRequesting ? 'requesting' : 'notRequesting';

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <form className="orgForm" onSubmit={this.handleFormSubmit}>
          <div className="rightPromo">
            <div className="promoTitle">Why You'll Love It</div>
            <div style={{display: 'none'}}>'</div>
            <ul>
              <li>See all your leagues in one place.</li>
              <li>Create drafts from your TopScore site leagues.</li>
              <li>Save draft data directly back to your site.</li>
              <li>Player data is secure and private.</li>
            </ul>
          </div>
          <div className={`mainFormContent ${isRequestingClass}`}>
            {isOwner && (
              <div className="ownerSection">
                <div className="createPromotion">
                  Draft stress free with easy integrations to your TopScore site.
                </div>
                <label htmlFor="orgName">
                  Organization Name
                </label>
                <input ref="orgName"
                    name="orgName"
                    id="orgName"
                    type="text"
                    placeholder="Organization Name, eg 'Metropolis Super Ultimate League'"
                    defaultValue={name} />
                {isSubmitted && !nameValidation && (
                  <div className="validation">
                    The organization name must not be empty.
                  </div>
                )}
                <div className="topScoreSection">
                  <label htmlFor="topScoreUrl">
                    TopScore Domain
                  </label>
                  <input ref="topScoreUrl"
                      name="topScoreUrl"
                      id="topScoreUrl"
                      type="text"
                      placeholder="TopScore URL, eg 'msul.usetopscore.com'"
                      defaultValue={topScoreUrl} />
                </div>
              </div>
            )}
            <div className="privateSection">
              <h3>Private Information</h3>
              <div className="sectionDescription">This information is private to your account. Other members of the league are not able to view or use it.</div>
              <div className="sectionBody">
                <label htmlFor="topScoreUser">
                  Client ID [auth_token]
                </label>
                <input ref="topScoreUser"
                    name="topScoreUser"
                    id="topScoreUser"
                    type="text"
                    placeholder="Secret auth_token from your TopScore site"
                    defaultValue={topScoreUser} />
                <div className="inputExplanation">
                  The TopScore client ID is an authentication token the API uses to verify your identity. Find it
                  <span className="helpLink" onClick={this.handleTopScoreAuthLinkClick}>here</span>.
                  <div className="validationSection">
                    <div className="valiateTopScoreBtn" onClick={this.handleTopScoreValidation}>
                      Verify Permissions
                    </div>
                  </div>
                  <div className="sectionDescription">In order to import league data you will need permission to view Event, Team, and Registration information.</div>
                </div>
                {isRequesting && (
                  <div className="spinner">Please wait...</div>
                )}
                {isSubmitted && (
                  <div className="validation">
                    <div className="validationItem">
                      <div className="validationTitle">Site Domain</div>
                      <div className={topScoreApi === false ? 'invalid' : 'valid'}>
                        {topScoreApi === false && (
                          <i className="material-icons">&#xE000;</i>
                        ) || (
                          <i className="material-icons">&#xE876;</i>
                        )}
                      </div>
                    </div>
                    <div className="validationItem">
                      <div className="validationTitle">Events</div>
                      <div className={topScoreEvents === false ? 'invalid' : 'valid'}>
                        {topScoreEvents === false && (
                          <i className="material-icons">&#xE000;</i>
                        ) || (
                          <i className="material-icons">&#xE876;</i>
                        )}
                      </div>
                    </div>
                    <div className="validationItem">
                      <div className="validationTitle">Teams</div>
                      <div className={topScoreTeams === false ? 'invalid' : 'valid'}>
                        {topScoreTeams === false && (
                          <i className="material-icons">&#xE000;</i>
                        ) || (
                          <i className="material-icons">&#xE876;</i>
                        )}
                      </div>
                    </div>
                    <div className="validationItem">
                      <div className="validationTitle">Registrations</div>
                      <div className={topScoreRegs === false ? 'invalid' : 'valid'}>
                        {topScoreRegs === false && (
                          <i className="material-icons">&#xE000;</i>
                        ) || (
                          <i className="material-icons">&#xE876;</i>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="submissionButtons">
                  <div className="submitBtn" onClick={this.handleFormSubmit}>Save</div>
                </div>
                {pathKey && (
                  <div className="deleteSection">
                    <div className="deleteBtnLabel">Delete this organization</div>
                    <div className="deleteWarning" onClick={this.handleDeleteClick}>
                      <i className="material-icons">&#xE002;</i>
                      <div className="deleteBtn">Delete</div>
                      <i className="material-icons">&#xE002;</i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </InlineCss>
    );
  }
}

export default OrganizationForm;