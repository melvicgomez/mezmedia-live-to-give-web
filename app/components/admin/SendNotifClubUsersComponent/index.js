/**
 *
 * SendNotifClubUsersComponent
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Row, Select } from 'antd';

import TextAreaComponent from 'components/admin/TextAreaComponent';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';

import { Colors } from 'theme/colors';
import api from 'services';

const { Option } = Select;

const StyledWrapper = styled.div`
  padding: 16px 0px;

  .text-input {
    text-align: left;
    padding: 10px 26px;
  }
`;

const Label = styled.p`
  margin-bottom: 6px;
  width: 250px;
  min-width: 250px;
  padding-top: 10px;
`;

const TypeSelector = styled(Select)`
  width: 100% !important;
  margin-bottom: 25px;
  border: 2px solid ${Colors.pureWhite} !important;
  border-radius: 16px !important;

  > .ant-select-selector {
    height: 48px !important;
    background-color: ${Colors.textInput} !important;
    border-radius: 16px !important;
    border: none !important;
    display: flex !important;
    align-items: center !important;
    padding: 0px 26px !important;
  }
`;

function SendNotifClubUsersComponent() {
  useEffect(() => {
    api.get('api/club-interest').then(res => {
      const tagList = [];
      Object.keys(res.data).forEach(key => {
        res.data[key].forEach(d => {
          const interestData = {
            id: d.interest_id,
            name: d.interest_name
              .split(' ')
              .slice(0, -1)
              .join(' '),
            type: 'interest',
          };
          tagList.push(interestData);
        });
      });
      setInterestList(tagList);
    });
  }, []);

  const [interestList, setInterestList] = useState([]);

  const [title, setTitle] = useState('');
  const [bodyMessage, setBodyMessage] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(
    'Select Live to Give Club',
  );

  return (
    <StyledWrapper>
      <ConfirmationPopupComponent
        actionRequire={false}
        visibility={showAlertPopup}
        dismissModal={() => {
          setShowAlertPopup(false);
        }}
        title="Notification Sent!"
        message={`You successfully sent a messge to ${selectedInterest} members.`}
      />
      <Row justify="space-between" wrap={false}>
        <div style={{ width: '645px', marginTop: '5px' }}>
          <TextInputComponent
            title="Title"
            defaultValue={title}
            value={title}
            admin
            placeholder="Title of Notifcation"
            onChange={value => {
              setTitle(value);
            }}
          />
          <TextAreaComponent
            value={bodyMessage}
            onChange={setBodyMessage}
            placeholder="Notification Message"
            label="Message"
          />

          <Row wrap={false}>
            <Label className="bodyBold white-text">Interest / CLub</Label>
            <TypeSelector
              defaultValue={selectedInterest}
              showArrow={false}
              className="bodyBold"
              style={{
                width: 120,
                color:
                  selectedInterest === 'Select Live to Give Club'
                    ? Colors.placeholderTextColor
                    : Colors.pureWhite,
              }}
              onChange={value => {
                setSelectedInterest(value);
              }}
              dropdownStyle={{ zIndex: 999999 }}
            >
              {interestList.map(option => (
                <Option
                  key={option.name}
                  value={option.name}
                  className="bodyBold darkGrey-text"
                >
                  {option.name}
                </Option>
              ))}
            </TypeSelector>
          </Row>

          <TextInputComponent
            title="Deeplink"
            defaultValue={deepLink}
            value={deepLink}
            admin
            placeholder="Deeplink e.g. nontrack-challenge/13"
            onChange={value => {
              setDeepLink(value);
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ minWidth: 250 }} />
            <div
              style={{
                flex: 1,
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <PrimaryButtonComponent
                disabled={
                  !title.trim() ||
                  !bodyMessage.trim() ||
                  selectedInterest.trim() === 'Select Live to Give Club'
                }
                loading={isLoading}
                iconRight
                label="SEND"
                onClick={() => {
                  setIsLoading(true);
                  api
                    .post(`/api/message-club-members`, {
                      title,
                      message: bodyMessage,
                      deep_link: deepLink,
                      interest_id: interestList.find(i =>
                        i.name.includes(selectedInterest),
                      ).id,
                    })
                    .finally(() => {
                      setShowAlertPopup(true);
                      setIsLoading(false);
                      setTitle('');
                      setBodyMessage('');
                      setDeepLink('');
                      selectedInterest('Select Live to Give Club');
                    });
                }}
              />
            </div>
          </div>
        </div>
      </Row>
    </StyledWrapper>
  );
}

SendNotifClubUsersComponent.propTypes = {};

export default memo(SendNotifClubUsersComponent);
