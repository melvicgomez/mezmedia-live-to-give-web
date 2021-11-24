/**
 *
 * AddBcoinComponent
 *
 */

import React, { memo, useState } from 'react';
import { Modal, Row, Input } from 'antd';
// import PropTypes from 'prop-types';
import api from 'services';
import styled from 'styled-components';
import { Colors } from 'theme/colors';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
const { TextArea } = Input;

const Popup = styled(Modal)`
  background-color: ${Colors.darkGrey} !important;
  border-radius: 16px;
  padding-bottom: 0px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.darkGrey};
  }

  > .ant-modal-content {
    box-shadow: 0px !important;
    padding: 25px 10px 10px;
    width: 400px;

    > div > div {
      margin-bottom: 15px;
    }
    > button {
      top: -5px;
    }

    .ant-modal-close-x {
      color: ${Colors.white};
    }
  }

  .text-input {
    text-align: left;
  }
`;

const CommentInputSection = styled(Row)`
  border-radius: 16px;
  height: auto !important;
  box-shadow: inset 0px 1px 2px 0px #00000035;
  background-color: ${Colors.textInput};
  border: 2px solid ${Colors.pureWhite};
  padding: 10px 15px;

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
function AddBcoinComponent({ visibility, onCancel, userId }) {
  const [isFocused, setIsFocused] = useState(0);
  const [bcoinAmount, setBcoinAmount] = useState(0);
  const [bcoinDesc, setBcoinDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Popup centered visible={visibility} onCancel={onCancel} footer={null}>
        <TextInputComponent
          type="number"
          title="B Coin Amount"
          defaultValue={bcoinAmount}
          value={bcoinAmount}
          placeholder="Enter B Coin Amount"
          onChange={value => {
            setBcoinAmount(value);
          }}
        />

        <p
          className="bodyBold white-text input-title"
          style={{ marginBottom: 6 }}
        >
          Description
        </p>
        <CommentInputSection align="middle" className="white-text">
          <TextArea
            value={bcoinDesc}
            onChange={({ target: { value } }) => {
              setBcoinDesc(value);
            }}
            placeholder={isFocused ? '' : 'Enter Description'}
            className="bodyBold"
            bordered={false}
            autoSize={{ minRows: 3, maxRows: 3 }}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
          />
        </CommentInputSection>

        <Row justify="center">
          <PrimaryButtonComponent
            loading={isLoading}
            iconRight
            label="Submit"
            onClick={() => {
              setIsLoading(true);
              api
                .post(`api/bcoins`, {
                  user_id: userId,
                  amount: bcoinAmount,
                  description: bcoinDesc,
                  deep_link: 'settings',
                })
                .finally(() => {
                  setIsLoading(false);
                  onCancel();
                });
            }}
          />
        </Row>
      </Popup>
    </div>
  );
}

AddBcoinComponent.propTypes = {};

export default memo(AddBcoinComponent);
