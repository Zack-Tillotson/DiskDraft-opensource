import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class MainTabs extends React.Component {
  static propTypes = {

    availableTabs: PropTypes.array.isRequired,
    selectedTab: PropTypes.string.isRequired,

    selectTab: PropTypes.func.isRequired,

  };

  // Renders //

  render() {

    const {

      availableTabs,
      selectedTab,

      selectTab,

    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container" className="main-tabs">
        {availableTabs.map(tab => {
          const activeClass = tab === selectedTab ? 'active': '';
          return (
            <div key={tab}
              className={`main-tab ${tab.toLowerCase()} ${activeClass}`}
              onClick={this.props.selectTab.bind(this, tab)}>
              {tab}
            </div>
          );
        })}
      </InlineCss>
    );
  }
}

export default MainTabs;