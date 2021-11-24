/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/**
 *
 * CharitySelectionComponent
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Radio, Modal } from 'antd';
import api from 'services';
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
    width: 830px;

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

const OptionSection = styled.div`
  background-color: ${Colors.pureWhite};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 30px 30px 0px;

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

function CharitySelectionComponent({ options, visibility, dismissModal }) {
  const [submitModalVisible, setSubmitModalVisible] = useState(false);

  const [isShow, setIsShow] = useState(visibility);
  const [selectedCharity, setSelectedCharity] = useState(0);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    setIsShow(visibility);
  }, [visibility]);

  let finalCharities = [...options];
  if (options.length > 1)
    finalCharities = finalCharities.concat({
      charity_id: 0,
      charity_name: 'Both Charities',
      description:
        'Your fundraising will be split evenly across both charities above.',
    });
  return (
    <Popup
      destroyOnClose
      className="darkGrey-text"
      centered
      visible={isShow}
      footer={null}
      closeIcon={false}
      closable={false}
    >
      <div className="white-text">
        <OptionSection className="white-text">
          <div
            className="h3 darkGrey-text"
            style={{
              alignItems: 'flex-start',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={Images.bcoinBlueIcon}
              alt="Bcoin icon"
              style={{ height: '20px', width: '20px', marginRight: 10 }}
            />
            It’s time to pick a charity!
          </div>
          <div className="bodyBold darkGrey-text">
            <p style={{ marginBottom: 10 }}>
              The Live to Give Campaign is coming to an end and what a journey
              it’s been!
            </p>
            <p style={{ marginBottom: 10 }}>
              It’s time to celebrate what’s been achieved both on a personal
              level through taking part, as well as our collective impact
              through earning B Coins.
            </p>
            <p style={{ marginBottom: 10 }}>
              {options.length > 1
                ? 'For every B Coin you earned, a GBP Sterling amount has been calculated which Barclays will donate to your charity of choice in your office location. Please select below which charity you would like to assign your fundraising to.'
                : 'For every B Coin you earned, a GBP Sterling amount has been calculated which Barclays will donate to Habitat for Humanity Australia.'}
            </p>
          </div>

          {options.length > 1 ? (
            <Radio.Group
              onChange={e => setSelectedCharity(e.target.value)}
              value={selectedCharity}
            >
              {finalCharities.map((option, i) => (
                <div key={i}>
                  <Radio
                    className="darkGrey-text"
                    value={i}
                    defaultChecked={i === 0}
                    style={{ display: 'flex', alignItems: 'flex-start' }}
                  >
                    <div className="bodyBold">{option.charity_name}</div>
                    <div className="body">{option.description}</div>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          ) : (
            <div className="darkGrey-text" style={{ marginLeft: 30 }}>
              <div className="bodyBold">
                {finalCharities.length > 0
                  ? finalCharities[0].charity_name
                  : ''}
              </div>
              <div className="body">
                {finalCharities.length > 0 ? finalCharities[0].description : ''}
              </div>
            </div>
          )}
        </OptionSection>
        <Row justify="center">
          <PrimaryButtonComponent
            style={{
              padding: '0px 30px',
              margin: '10px 0px 35px',
            }}
            label={options.length > 1 ? 'Submit' : "Let's Go"}
            onClick={() => {
              if (finalCharities.length > 1) setConfirmPopup(true);
              else {
                if (!buttonLoading) {
                  setButtonLoading(true);
                  api
                    .post(`/api/check-charity-expiration`, {
                      charity_id: finalCharities[selectedCharity].charity_id,
                    })
                    .finally(() => {
                      setButtonLoading(false);
                      setSubmitModalVisible(true);
                    });
                }
              }
            }}
          />
        </Row>
      </div>
      <ConfirmationPopupComponent
        visibility={submitModalVisible}
        dismissModal={() => {
          setTimeout(() => {
            setSubmitModalVisible(false);
            setIsShow(false);
            dismissModal();
          }, 200);
        }}
        title="Thank You!"
        message={`Thank you for your engagement on Live to Give and your contribution to ${
          finalCharities.length > 0
            ? selectedCharity === 2
              ? `${finalCharities[0].charity_name} and ${
                  finalCharities[1].charity_name
                }`
              : finalCharities[selectedCharity].charity_name
            : ''
        }.`}
        actionRequire={false}
      />

      <ConfirmationPopupComponent
        actionRequired
        visibility={confirmPopup}
        dismissModal={() => {
          setConfirmPopup(false);
        }}
        title="Your Chosen Charity"
        message={`Thank you for choosing to donate your funds raised to ${
          finalCharities.length > 0
            ? selectedCharity === 2
              ? `${finalCharities[0].charity_name} and ${
                  finalCharities[1].charity_name
                }`
              : finalCharities[selectedCharity].charity_name
            : ''
        }. Please confirm your selection.`}
        leftAction={() => {
          if (!buttonLoading) {
            setButtonLoading(true);
            api
              .post(`/api/check-charity-expiration`, {
                charity_id: finalCharities[selectedCharity].charity_id,
              })
              .finally(() => {
                setButtonLoading(false);
                setConfirmPopup(false);
                setSubmitModalVisible(true);
              });
          }
        }}
        rightAction={() => {
          setConfirmPopup(false);
        }}
      />
    </Popup>
  );
}

CharitySelectionComponent.propTypes = {
  options: PropTypes.array,
  visibility: PropTypes.bool,
  dismissModal: PropTypes.func,
};

export default CharitySelectionComponent;
