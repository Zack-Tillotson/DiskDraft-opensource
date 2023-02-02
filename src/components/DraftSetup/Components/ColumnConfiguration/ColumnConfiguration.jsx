import React from 'react';

import InlineCss from 'react-inline-css';
import styles from './styles';

import { columnTypes } from '../../columnTypes';

import DraggableList from 'react-draggable-list';
import ColumnConfigurationRow from './ColumnConfigurationRow';

class ColumnConfiguration extends React.Component {
  getColumns = (onlyIncluded = true) => {
    return this.props.columns
      .filter(
        column =>
          column.visible &&
          ((onlyIncluded && column.include) ||
            (!onlyIncluded && !column.include))
      )
      .sort((a, b) => a.order - b.order);
  };

  handleColumnSortChange = (list, item, oldIndex, newIndex) => {
    let newOrder;

    if (newIndex > 0) {
      newOrder = list[newIndex - 1].order + 0.001;
    } else {
      newOrder = list[1].order - 0.001;
    }

    this.props.updateColumnAttribute(item.id, 'order', newOrder);
  };

  handleInputChange = (id, attr, event) => {
    let value = event.target.value;

    if (attr === 'include') {
      value = event.target.checked;
    }

    this.props.updateColumnAttribute(id, attr, value);
  };

  handleAddColumn = (event) => {
    this.props.updateColumnAttribute(event.target.value, 'include', true);
  };

  componentDidUpdate() {
    try {
      // Godhacky, I blame the draggable lib
      if (window.inputChangeId.indexOf('input-display') === 0) {
        const ele = document.getElementById(window.inputChangeId);
        ele.focus();
        ele.value = ele.value;
      }
    } catch (e) {}
  }

  render() {
    const { players } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <div className="columnConfiguration">
          <div className="colConfColumn rowLabel">
            <div className="sort">Sort</div>
            <div className="colName">Label</div>
            <div className="colType">Type</div>
            <div className="remove">&nbsp;</div>
          </div>
          <div ref="tbody" className="columnList">
            <DraggableList
              list={this.getColumns()}
              itemKey="id"
              template={ColumnConfigurationRow(this.props)}
              onMoveEnd={this.handleColumnSortChange}
              useContainer={this.refs.tbody}
            />
          </div>
        </div>

        <div className="excludedColumns">
          <div className="exCoTitle">Include Column:</div>
          <select onChange={this.handleAddColumn} value="">
            <option value="" disabled />
            {this.getColumns(false)
              .sort(
                (a, b) => (a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1)
              )
              .map(column => (
                <option key={column.id} value={column.id}>
                  {column.display || column.id}
                </option>
              ))}
          </select>
        </div>

      </InlineCss>
    );
  }
}

export default ColumnConfiguration;
