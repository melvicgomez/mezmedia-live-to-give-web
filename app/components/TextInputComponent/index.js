/**
 *
 * TextInputComponent
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Colors } from 'theme/colors';
import styled, { css } from 'styled-components';

import { Input } from 'antd';

const StyledInput = styled.div`
  margin-bottom: 20px;

  > .ant-input:focus,
  .ant-input:active,
  .ant-input:hover {
    border-color: ${props =>
      props.error ? Colors.error : Colors.pureWhite} !important;
  }

  .input-title {
    margin-bottom: 6px;
  }

  .input-caption {
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 0 20px;
    line-height: 16px;
  }

  ${props =>
    props.admin &&
    css`
      display: flex;
      flex-direction: row;
      margin-bottom: 25px;

      p {
        margin-bottom: 6px;
        width: 250px;
        min-width: 250px;
        padding-top: 10px;
      }
    `}
`;

function TextInputComponent({
  type,
  size,
  defaultValue,
  onChange,
  hasError,
  value,
  placeholder,
  title,
  caption,
  onFocus,
  onBlur,
  maxLength,
  admin,
}) {
  const [isFocused, setIsFocues] = useState(true);
  return (
    <StyledInput admin={admin ? 1 : 0} error={hasError ? 1 : 0}>
      {!!title && <p className="bodyBold white-text input-title">{title}</p>}
      <Input
        className={`bodyBold text-input center ${hasError ? 'has-error' : ''}`}
        placeholder={isFocused ? placeholder : ''}
        value={value}
        type={type}
        size={size}
        maxLength={maxLength}
        defaultValue={defaultValue}
        onChange={e => {
          onChange(e.target.value);
        }}
        onFocus={() => {
          setIsFocues(false);
          if (onFocus) onFocus();
        }}
        onBlur={() => {
          setIsFocues(true);
          if (onBlur) onBlur();
        }}
      />
      {!!caption && (
        <p className="captionBold white-text input-caption">{caption}</p>
      )}
    </StyledInput>
  );
}

TextInputComponent.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  hasError: PropTypes.bool,
  title: PropTypes.string,
  caption: PropTypes.string,
  maxLength: PropTypes.number,
  admin: PropTypes.bool,
};

TextInputComponent.defaultProps = {
  type: 'text',
  size: 'medium',
  defaultValue: '',
  value: '',
  hasError: false,
  title: '',
  caption: '',
  maxLength: null,
  admin: false,
};

export default memo(TextInputComponent);
