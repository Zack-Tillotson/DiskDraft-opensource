import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

class TeamList extends React.Component {
  render() {

    const {teams} = this.props;
    let index = 1;

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <table className="teamTable">
          <tbody>
            {teams.map(team => (
              <tr className="team" key={team.id}>
                <td className="teamIndex">
                  {index++}.
                </td>
                <td>
                  {team.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </InlineCss>
    );
  }
}

export default TeamList;