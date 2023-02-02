import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class OrganizationLink extends React.Component {
  static propTypes = {

    config: PropTypes.object.isRequired,
    pathKey: PropTypes.string.isRequired,
    events: PropTypes.array.isRequired,

    onClick: PropTypes.func,

  };

  handleClick = () => {
    this.props.onClick(this.props.pathKey);
  };

  // Renders //

  render() {

    const {
      config: {
        name,
        topScoreUrl,
      },
    } = this.props;

    return (
      <InlineCss
        stylesheet={styles}
        componentName="container" onClick={this.handleClick}>
        <div className="orgName">
          {name}
        </div>
        <div className="topScoreUrl">{topScoreUrl}</div>
      </InlineCss>
    );
  }
}

export default OrganizationLink;