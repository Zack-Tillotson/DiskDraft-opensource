import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

class PlayerList extends React.Component {
  getColumns = () => {
    return this.props.columns
      .filter(column => column.include && column.visible)
      .sort((a, b) => a.order - b.order);
  };

  getPlayers = () => {
    return this.props.players
      .filter(player => player._include);
  };

  getPlayerColumn = (player, column) => {
    switch(column.type.toLowerCase()) {
      case 'text':
      case 'number':
      case 'baggage group id':
      case 'weight':
      case 'height':
      case 'draft id':
      case 'gender':
      case 'age':
        return player[column.id];
      case 'image':
        return (
          <img src={player[column.id]} />
        );
    }
    return player[column.id];
  };

  render() {

    const {players} = this.props;
    let playerIndex = 1;

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <div>This needs to be replaced with the PlayerList that has a tighter, cleaner design</div>
        <div className="playerReview">
          <table>
            <thead>
              <tr>
                {this.getColumns()
                  .map(column => (
                    <td key={column.id}>
                      {column.display}
                    </td>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {this.getPlayers()
                .map(player => (
                <tr key={player.id}>
                  {this.getColumns().map(column => (
                    <td key={column.id}>
                      {this.getPlayerColumn(player, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </InlineCss>
    );
  }
}

export default PlayerList;