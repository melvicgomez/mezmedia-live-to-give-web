/* eslint-disable react/no-array-index-key */
/**
 *
 * PollPopupComponent
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Radio, Modal } from 'antd';
import axiosInstance from 'services';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';

const Popup = styled(Modal)`
  background-color: ${Colors.pureWhite} !important;
  border-radius: 16px;
  padding-bottom: 0px;
  margin: 20px 0px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.pureWhite};
  }

  .ant-modal-content {
    box-shadow: 0px !important;
    width: 430px;

    > button {
      top: -5px;

      .ant-modal-close-x {
        font-size: 23px;
      }
    }
  }

  .ant-modal-body {
    padding: 0px !important;
  }
`;

const PollPhoto = styled.img`
  height: 265px;
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
`;

const OptionSection = styled.div`
  background-color: ${Colors.pureWhite};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 15px 30px 0px;

  > div {
    padding: 0px 0px 8px;
  }

  .ant-radio {
    margin-top: 5px;
  }

  .ant-radio-inner {
    border: 2px solid ${Colors.bodyText} !important;
    width: 18px !important;
    height: 18px !important;

    ::after {
      width: 10px;
      height: 10px;
      top: 2px;
      left: 2px;
    }
  }

  .ant-radio-wrapper {
    display: flex;
    align-items: center;
    white-space: pre-line;
    padding: 8px 0px !important;
  }
`;

function PollPopupComponent({ poll, visibility, dismissModal }) {
  const [selectedAns, setSelectedAns] = useState(1);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);

  const submitPollAns = () => {
    axiosInstance
      .post('api/store-poll-answer', {
        poll_id: poll.poll_id,
        answer: selectedAns,
      })
      .then(() => {
        setSubmitModalVisible(true);
      });
  };

  return (
    <Popup
      className="darkGrey-text"
      centered
      visible={visibility}
      onCancel={dismissModal}
      footer={null}
      closeIcon={
        <img
          src={Images.closeIcon}
          style={{ height: '20px', width: '20px' }}
          alt="close"
        />
      }
    >
      <div className="white-text" style={{ width: '430px', minWidth: '430px' }}>
        {!!poll.image_cover && (
          <PollPhoto
            src={`${process.env.IMAGE_URL_PREFIX}poll/${poll.poll_id}/${
              poll.image_cover
            }`}
          />
        )}
        <OptionSection className="white-text">
          <div className="h3 darkGrey-text">{poll.title}</div>

          <Radio.Group
            onChange={async e => {
              setSelectedAns(e.target.value);
            }}
            value={selectedAns}
          >
            {[
              poll.option_one,
              poll.option_two,
              poll.option_three,
              poll.option_four,
            ].map((option, i) => (
              <div key={i}>
                <Radio
                  className="body darkGrey-text"
                  value={i + 1}
                  defaultChecked={false}
                  style={{ display: 'flex', alignItems: 'flex-start' }}
                >
                  {option}
                </Radio>
              </div>
            ))}
          </Radio.Group>
        </OptionSection>
        <Row justify="center">
          <PrimaryButtonComponent
            style={{
              padding: '0px 30px',
              margin: '10px 0px 35px',
            }}
            label="Submit"
            onClick={submitPollAns}
          />
        </Row>
      </div>
      <ConfirmationPopupComponent
        visibility={submitModalVisible}
        dismissModal={() => {
          setSubmitModalVisible(false);
          setTimeout(() => {
            dismissModal();
          }, 200);
        }}
        title="Thank You!"
        message="Your answer has been submitted. Thanks for taking part in this poll!"
        actionRequire={false}
      />
    </Popup>
  );
}

PollPopupComponent.propTypes = {
  poll: PropTypes.object,
  visibility: PropTypes.bool,
  dismissModal: PropTypes.func,
};

export default PollPopupComponent;
