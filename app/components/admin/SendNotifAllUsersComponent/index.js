/**
 *
 * SendNotifAllUsersComponent
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Row } from 'antd';

import TextAreaComponent from 'components/admin/TextAreaComponent';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';

import api from 'services';

const StyledWrapper = styled.div`
  padding: 16px 0px;

  .text-input {
    text-align: left;
    padding: 10px 26px;
  }
`;
function SendNotifAllUsersComponent() {
  const [title, setTitle] = useState('');
  const [bodyMessage, setBodyMessage] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  return (
    <StyledWrapper>
      <ConfirmationPopupComponent
        actionRequire={false}
        visibility={showAlertPopup}
        dismissModal={() => {
          setShowAlertPopup(false);
        }}
        title="Notification Sent!"
        message="You successfully sent a messge to all users in Live to Give."
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
                disabled={!title.trim() || !bodyMessage.trim()}
                loading={isLoading}
                iconRight
                label="SEND"
                onClick={() => {
                  setIsLoading(true);
                  api
                    .post(`/api/message-all-users`, {
                      title,
                      message: bodyMessage,
                      deep_link: deepLink,
                    })
                    .finally(() => {
                      setShowAlertPopup(true);
                      setIsLoading(false);
                      setTitle('');
                      setBodyMessage('');
                      setDeepLink('');
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

SendNotifAllUsersComponent.propTypes = {};

export default memo(SendNotifAllUsersComponent);
