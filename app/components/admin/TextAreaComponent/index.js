/**
 *
 * TextAreaComponent
 *
 */

import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Colors } from 'theme/colors';
import { Row, Input } from 'antd';

const { TextArea } = Input;

const Label = styled.p`
  margin-bottom: 6px;
  width: 250px;
  min-width: 250px;
  padding-top: 10px;
`;

const TextAreaInputSection = styled(Row)`
  border-radius: 16px;
  width: 100%;
  height: auto !important;
  color: ${Colors.bodyText};
  box-shadow: inset 0px 1px 2px 0px #00000035;
  background-color: ${Colors.textInput};
  border: 2px solid ${Colors.pureWhite};
  padding: 10px 15px;
  margin-bottom: 25px;

  > textarea {
    width: 100%;
    color: ${Colors.pureWhite};
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

function TextAreaComponent({ value, onChange, placeholder, label }) {
  const [isFocused, setIsFocued] = useState(false);

  return (
    <Row wrap={false}>
      <Label className="bodyBold white-text">{label}</Label>
      <TextAreaInputSection type="desc" align="middle">
        <TextArea
          value={value}
          onChange={e => {
            onChange(e.target.value);
          }}
          placeholder={isFocused ? '' : placeholder}
          className="bodyBold"
          bordered={false}
          autoSize={{ minRows: 6, maxRows: 6 }}
          onFocus={() => setIsFocued(true)}
          onBlur={() => setIsFocued(false)}
        />
      </TextAreaInputSection>
    </Row>
  );
}

TextAreaComponent.propTypes = {};

export default TextAreaComponent;
