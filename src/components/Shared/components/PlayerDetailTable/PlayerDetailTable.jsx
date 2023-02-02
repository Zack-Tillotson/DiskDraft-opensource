import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class PlayerDetailTable extends React.Component {
  static propTypes = {

    player: PropTypes.object,
    columns: PropTypes.array,

  };

  // Renders //

  renderColumnValue = (type, value, player) => {

    switch(type.toLowerCase()) {
      case 'text':
      case 'number':
      case 'baggage group id':
      case 'weight':
      case 'draft id':
      case 'gender':
      case 'age':
        return value;
      case 'height':

        const heightCm = value;
        const heightIn = Math.round(heightCm / 2.54 % 12);
        const heightFt = parseInt(heightCm / 2.54 / 12); // 30.45 cm per ft

        const heightImp = !!heightCm && heightCm > 0 && `${heightFt}'${heightIn}"` || '-'; // '

        return heightImp;
      case 'image & name':
        return ([
          this.renderColumnValue('image', player.image),
          ' ',
          this.renderColumnValue('text', player.first_name),
          ' ',
          this.renderColumnValue('text', player.last_name),
        ]);
      case 'image':
        return (
          <img className="playerImage" src={value} />
        );
    }

    return value;

  };

  render() {
    const {player, columns} = this.props;

    return (
      <InlineCss className="secondaryAttributes" componentName="container" stylesheet={styles}>
        <table>
          <thead>
            <tr>
              <td className="attrCol"></td>
              <td className="playerCol">Player</td>
              {player.baggage instanceof Array && player.baggage.map((bag, index) => (
                <td key={bag.id} className="bagCol">{index === 0 && 'Baggage'}</td>
              ))}
            </tr>
          </thead>
          <tbody>
              {columns
                .map(col => (
                <tr key={col.id}>
                  <td className="attrCol">{col.display}</td>
                  <td className="playerCol">{this.renderColumnValue(col.type, player[col.id], player)}</td>
                  {player.baggage instanceof Array && player.baggage.map(bag => (
                    <td key={bag.id} className="bagCol">{this.renderColumnValue(col.type, bag[col.id], bag)}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </InlineCss>
    );
  }
}

export default PlayerDetailTable;