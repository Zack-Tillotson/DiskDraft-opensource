import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import {Link} from 'react-router-dom';

export default class extends React.Component {
  render() {
    return (
      <InlineCss stylesheet={styles} componentName="container">
        <footer>

          <div className="social-section">
            <Link to="https://www.facebook.com/DiskDraft/">
              <img title="DiskDraft on Facebook" src="/assets/facebook-64.png" />
            </Link>
            <Link to="https://twitter.com/DiskDraft">
              <img title="DiskDraft on Twitter" src="/assets/twitter-64.png" />
            </Link>
          </div>

          <div className="usefulLinks">
            <div className="useful-section">
              <h3>For League Administrators</h3>
              <Link to="/login/">Log In</Link>
              <Link to="/faq/#admins">Admin FAQ</Link>
              <Link to="/dashboard/">Organization Dashboard</Link>
              <Link to="/faq/#sharing">Introducting DiskDraft to captains</Link>
            </div>
            <div className="useful-section">
              <h3>For Captains</h3>
              <Link to="/login/">Log In</Link>
              <Link to="/faq/#captains">Captain FAQ</Link>
              <Link to="http://ultiworld.com/2014/06/09/summer-league-drafting-101-ultimate-frisbee/">League Drafting 101</Link>
            </div>
            <div className="useful-section">
              <h3>About DiskDraft</h3>
              <Link to="mailto:ccDiskDraft@gmail.com">Contact Us</Link>
              <Link to="http://zacherytillotson.com">Our Company</Link>
              <Link to="">Site Map</Link>
            </div>
            <div className="useful-section">
              <h3>Things We Like</h3>
              <Link to="http://usetopscore.com/">TopScore</Link>
            </div>
          </div>

          <div className="logo-section">
            <a href="http://www.diskdraft.com/"><img src="/assets/logo-v2.png" /></a>
          </div>
          <div className="legalese">
            © 2015-2017 Zachery Tillotson. DiskDraft™ is a registered trademark of Zachery Tillotson. All Rights Reserved. Product name, logo, brands, and other trademarks featured or referred to within DiskDraft are the property of their respective trademark holders.
          </div>
        </footer>
      </InlineCss>
    );
  }
}