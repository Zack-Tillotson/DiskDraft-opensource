import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

class TitlePromo extends React.Component {
  static propTypes = {
  };

  // Renders //

  render() {

    return (
      <InlineCss stylesheet={styles} namespace="titlePromo" componentName="container">
        <div className="logo"><a href="/"><img src="/assets/logo-v2.png" title="DiskDraft" /></a></div>
      </InlineCss>
    );
  }
}

export default TitlePromo;