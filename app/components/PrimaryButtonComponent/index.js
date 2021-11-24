/**
 *
 * PrimaryButtonComponent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';

const ParticipateButton = styled(Button)`
  background-image: ${props =>
    props.disabled ? Colors.disabled : Colors.blueGradient} !important;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 16px;
  border: 0px;
  outline: 0px;
  height: 46px;
  display: flex;
  align-items: center;
  box-shadow: ${Colors.shadow} 0px 2px 2px 0px;

  &:hover,
  :focus {
    background: ${Colors.blueGradient};
    color: ${Colors.pureWhite};
  }

  > .ant-btn-loading-icon {
    margin: 0px 5px 5px 0px;
  }

  :disabled {
    background-color: ${Colors.mediumGray} !important;
    color: ${Colors.pureWhite};

    :hover {
      color: ${Colors.pureWhite};
    }
  }
`;

const RightIcon = styled.img`
  margin-left: 10px;
  width: 11px;
  height: 19px;
`;

function PrimaryButtonComponent({
  label,
  onClick,
  loading,
  disabled,
  style,
  iconRight,
}) {
  return (
    <ParticipateButton
      style={style}
      className="bodyBold white-text"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      {label}
      {!loading && iconRight ? <RightIcon src={Images.rightArrow} /> : null}
    </ParticipateButton>
  );
}

PrimaryButtonComponent.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  iconRight: PropTypes.bool,
};

PrimaryButtonComponent.defaultProps = {
  loading: false,
  disabled: false,
  iconRight: true,
};

export default PrimaryButtonComponent;
