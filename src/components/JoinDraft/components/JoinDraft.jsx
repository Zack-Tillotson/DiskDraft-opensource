import React from 'react';

import Page from '../../Framework/Page';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import selector from '../state/selector';
import dispatcher from '../state/dispatcher';

import LoginForm from '../../Framework/LoginForm';

class DraftPage extends React.Component {
  static propTypes = {

  };

  // Lifecylce hooks //

  // Data management //

  // Event handlers //

  handleChange = ({target: {value}}) => {
    this.props.changeInput(value);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if(!!this.refs.input.value.length) {
      this.props.submitJoin();
    }
  };

  // Renders //

  renderLoadingMessage = () => {
    return (
      <InlineCss stylesheet={styles} componentName="container">
        <div className="loader"><span>{'Disk'}</span><span>{'Draft'}</span></div>
      </InlineCss>
    );
  };

  render() {
    
    const {
      firebase,
      form: {
        input,
        inProgress,
        isError,
      },
    } = this.props;

    return (
      <Page>
        <InlineCss stylesheet={styles} componentName="container">

          {!firebase.isLoggedIn && (
            <div className="requiresLogin">
              <div className="loginRequirementExplanation">
                To join please authenticate through one of these trusted third party services.
              </div>
              <LoginForm />
            </div>
          )}

          {firebase.isLoggedIn && (
            <div className="joinForm">
              <h1>Join A Draft</h1>
              <div className="formDesc">
                Your league administrator will give you a seven character draft token, enter it here and join the draft.
              </div>
              {inProgress && 'Loading...'}
              {!inProgress && (
                <form className="draftForm" onSubmit={this.handleSubmit}>
                  <input
                    ref="input"
                    type="text"
                    value={input}
                    placeholder="eg ABCD123"
                    onChange={this.handleChange} />
                  <button>Submit</button>
                </form>
              )}
              {isError && (
                <div className="errorMsg">
                  Sorry that is not a valid draft token. Please verify the value with your draft administrator.
                </div>
              )}
            </div>
          )}

        </InlineCss>
      </Page>
    );
  }
}

export default connect(selector, dispatcher)(DraftPage);