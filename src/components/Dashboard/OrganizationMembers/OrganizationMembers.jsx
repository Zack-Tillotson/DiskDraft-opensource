import React from 'react';
import Clipboard from 'react-copy-to-clipboard';
import moment from 'moment';

import Image from 'react-imageloader';

import InlineCss from "react-inline-css";
import styles from './styles';

class OrganizationMembers extends React.Component {
  static propTypes = {
  };

  getJoinDate = (member) => {
    return moment(member.joined).format('MMM DD, YYYY');
  };

  getAddMemberLink = () => {
    const {newMemberKey} = this.props;
    return `${location.origin}/joinOrganization/${newMemberKey}/`;
  };

  handleInputClick = (event) => {
    event.target.select();
  };

  handleAddMemberClick = () => {
    this.props.onAddMember();
  };

  handleRemoveMemberLinkClick = () => {
    this.props.onAddMemberClose();
  };

  // Renders //

  render() {

    const {
      members,
      newMemberKey
    } = this.props;
    
    return (
      <InlineCss stylesheet={styles} componentName="container">
        {Object.keys(members).map(uid => {
          const member = members[uid];
          return (
            <div className="member" key={member.joined}>
              <Image className="memberImage" src={member.image}>
                <img className="default" src="/assets/default-user.jpg" />
              </Image>
              <div className="memberDetail">
                <div className="name">{member.name}</div>
                <div className="joinDate">Joined: {this.getJoinDate(member)}</div>
              </div>
            </div>
          );
        })}

        {!newMemberKey && (
          <div className="addMember" onClick={this.handleAddMemberClick}>+ Add Member</div>
        )}

        {!!newMemberKey && (
          <div className="addMemberLink">
            <div className="memberCallToAction">Send this invitation link</div>
            <input type="text" id="addMemberLink" readOnly={true} value={this.getAddMemberLink()} onClick={this.handleInputClick} />
            <Clipboard text={this.getAddMemberLink()}>
              <span className="copyLink">Copy</span>
            </Clipboard>
            <div className="explanation">
              Send this to the person you would like to add to the organization. This link is only good for one person and expires in a week.
            </div>
            <div className="removeMemberLink" onClick={this.handleRemoveMemberLinkClick}>Done</div>
          </div>
        )}
      </InlineCss>
    );
  }
}

export default OrganizationMembers;