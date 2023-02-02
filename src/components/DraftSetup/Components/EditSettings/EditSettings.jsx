import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class EditSettings extends React.Component {
  static propTypes = {
    settings: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleChange = (name, value, event) => {
    this.props.onChange(name, value);
  };

  handleMulticolumnRemove = (name, valueToRemove, event) => {
    const setting = this.props.settings.find(setting => setting.id === name);
    const value = setting.value.filter(val => val !== valueToRemove);
    this.props.onChange(name, value);
  };

  handleMulticolumnAdd = (name, event) => {
    const setting = this.props.settings.find(setting => setting.id === name);
    const valueToAdd = this.refs[`multicolumn-${name}`].value;
    const value = [...setting.value, valueToAdd];
    this.props.onChange(name, value);
  };

  handleRangeChange = (setting, event) => {
    const {id, min, max} = setting;
    const {value} = event.target;
    this.props.onChange(id, value)
  };

  // Renders //

  getCheckbox = (setting) => {
    return (
      <div className={`fauxCheckbox ${setting.value && 'checked' || ''}`}
        onClick={this.handleChange.bind(this, setting.id, !setting.value)} />
    );
  };

  getMulticolumn = (setting) => {
    return (
      <div className="multicolumnSelect">
        <div className="currentValues">
          {(setting.value || []).map(value => (
            <div key={value}
              className="currentValue"
              onClick={this.handleMulticolumnRemove.bind(this, setting.id, value)}>
              <span className="xIcon">×</span> {value}
            </div>
          ))}
        </div>
        <div className="addSelector">
          <select ref={`multicolumn-${setting.id}`}>
            {this.props.columns.map(column => (
              <option key={column.id} value={column.id}>{column.display}</option>
            ))}
          </select>
          <div className="controlLink" onClick={this.handleMulticolumnAdd.bind(this, setting.id)}>
            Add
          </div>
        </div>
      </div>
    );
  };

  getRange = (setting) => {

    const {min, max, value, label} = setting;

    const labelValue = label(value);

    return (
      <div className="rangeSetting" ref={`range-${setting.id}`}>
        <input type="range" defaultValue={value} id={`range-${setting.id}`} min={min} max={max} step={30} onChange={this.handleRangeChange.bind(this, setting)} />
        <div className="valueLabel">{labelValue}</div>
      </div>
    );
  };

  render() {

    const {
      settings,
      onChange,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container" className="editSettings">
        {settings.map(setting => {
          const settingId = `setting-${setting.id}`;
          return (
            <div className="setting" key={setting.id}>
              <label htmlFor={settingId}>
                {setting.type === 'checkbox' && this.getCheckbox(setting)}
                {setting.text}
              </label>
              {setting.type === 'multicolumn' && this.getMulticolumn(setting)}
              {setting.type === 'range' && this.getRange(setting)}
              <div className="detailText">{setting.detailText}</div>
            </div>
          );
        })}
      </InlineCss>
    );
  }
}

export default EditSettings;