import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class OrganizationTitle extends React.Component {
  static propTypes = {

    config: PropTypes.object.isRequired,
    showNavigationControls: PropTypes.bool,

    onClick: PropTypes.func,
    onEditClick: PropTypes.func,

  };

  static defaultProps = {
    showNavigationControls: false,
  };

  handleClick = () => {
    this.props.onClick(this.props.pathKey);
  };

  handleEditClick = () => {
    this.props.onEditClick(this.props.pathKey);
  };

  // Renders //

  render() {

    const {
      config: {
        name,
        topScoreUrl,
      },
      onClick,
      showNavigationControls,
    } = this.props;

    const onClickClass = onClick ? 'activeClick' : 'inactiveClick';

    return (
      <InlineCss
        stylesheet={styles}
        componentName="container">
        <h2 onClick={this.handleClick} className={onClickClass}>
          {name}
        </h2>
        <div className="topScoreUrl">
          {topScoreUrl}
        </div>
        {showNavigationControls && (
          <div className="navControls">
            <div className="orgViewLink" onClick={this.handleClick}>
              View ›
            </div>
            <div className="orgEditLink" onClick={this.handleEditClick}>
              Edit ›
            </div>
          </div>
        )}
      </InlineCss>
    );
  }
}

export default OrganizationTitle;