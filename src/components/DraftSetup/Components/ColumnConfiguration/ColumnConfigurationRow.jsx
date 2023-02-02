import React from 'react';

import { columnTypes } from '../../columnTypes';

export default function(containerProps) {
  class ColumnConfigurationRow extends React.Component {
    static defaultProps = containerProps;

    handleInputChange = (id, attr, event) => {
      try {
        window.inputChangeId = document.activeElement.id;
      } catch (e) {}

      let value = event.target.value;

      if (attr === 'include' || attr === 'primary') {
        value = event.target.checked;
      }

      this.props.updateColumnAttribute(id, attr, value);
    };

    handleRemoveClick = (id) => {
      this.props.updateColumnAttribute(id, 'include', false);
    };

    render() {
      const { dragHandle, item: column } = this.props;

      return (
        <div className="colConfColumn" key={column.id}>
          {dragHandle(
            <div className="sort dragTarget">
              <div className="hamburger">
                ☰
              </div>
            </div>
          )}
          <div className="colName">
            <input
              type="text"
              ref="input"
              className="displayInput"
              id={`input-display-${column.id}`}
              value={column.display}
              placeholder={column.id}
              onChange={this.handleInputChange.bind(this, column.id, 'display')}
            />
          </div>
          <div className="colPrimary">
            <label htmlFor={`input-primary-${column.id}`}>
              In Summary
              <input
                type="checkbox"
                checked={column.primary}
                id={`input-primary-${column.id}`}
                onChange={this.handleInputChange.bind(
                  this,
                  column.id,
                  'primary'
                )}
              />
            </label>
          </div>
          <div className="colType">
            <select
              disabled={column.required}
              value={column.type}
              id={`input-type-${column.id}`}
              disabled={!column.include}
              onChange={this.handleInputChange.bind(this, column.id, 'type')}>
              {columnTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="remove">
            {column.required &&
              <span className="requiredMessage">
                Required
              </span>}
            {!column.required &&
              <span
                className="controlLink"
                onClick={this.handleRemoveClick.bind(this, column.id)}>
                Remove
              </span>}
          </div>
        </div>
      );
    }
  }

  return ColumnConfigurationRow;
}
