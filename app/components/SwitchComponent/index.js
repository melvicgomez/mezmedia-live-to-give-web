/**
 *
 * SwitchComponent
 *
 */

import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Colors } from 'theme/colors';

const CustomSwitch = styled.div`
  display: flex;
  align-items: center;
  .switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 14px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #00000020;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 0px;
    bottom: -3px;
    background-color: ${Colors.mediumGray};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  .slider:after {
    background-color: ${Colors.primary};
  }

  input:checked + .slider {
    background-color: ${Colors.secondary};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
    background-color: ${Colors.primary};
  }
`;

function SwitchComponent({ style, onChange, status }) {
  const [checked, setChecked] = useState(status);

  const toogle = () => {
    const updatedState = !checked;
    setChecked(updatedState);
    onChange(updatedState);
  };

  return (
    <CustomSwitch style={style}>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={toogle} />
        <span className="slider round" />
      </label>
    </CustomSwitch>
  );
}

SwitchComponent.propTypes = {};

export default SwitchComponent;
