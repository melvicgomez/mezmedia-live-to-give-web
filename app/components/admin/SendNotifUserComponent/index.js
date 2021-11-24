/**
 *
 * SendNotifUserComponent
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import api from 'services';
// import { Colors } from 'theme/colors';
// import { Row } from 'antd';
import TextAreaComponent from 'components/admin/TextAreaComponent';
import { Row } from 'antd';

const StyledWrapper = styled.div`
  padding: 16px 0px;

  .text-input {
    text-align: left;
    padding: 10px 26px;
  }
`;

function SendNotifUserComponent({ match }) {
  const userId = match.params.id;

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
        message="You successfully sent a direct message to this user."
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
                    .post(`/api/message-direct-user`, {
                      user_id: userId,
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

          <div>
            <div className="bodyBold">Deeplinking</div>
            <ul>
              <li>To deep link, enter the correct category and ID</li>
              <li>
                To test of the deeplink is correct, send one to yourself first.
              </li>
            </ul>
            <div className="bodyBold">Links</div>
            <ul className="bodyBold">
              <li>
                team-challenge/<span className="delete-text">challengeID</span>
              </li>
              <li>
                individual-challenge/
                <span className="delete-text">challengeID</span>
              </li>
              <li>
                nontrack-challenge/
                <span className="delete-text">challengeID</span>
              </li>
            </ul>

            <p className="bodyBold" style={{ marginBottom: 14 }}>
              <div>
                live-session/<span className="delete-text">livesessionID</span>
              </div>
              <div>
                meetup/<span className="delete-text">meetupID</span>
              </div>
            </p>

            <p className="bodyBold" style={{ marginBottom: 14 }}>
              <div>
                activity-feed/official-post/
                <span className="delete-text">feedID</span>
              </div>
            </p>

            <p className="bodyBold" style={{ marginBottom: 14 }}>
              <div>bcoin-history</div>
              <div>settings</div>
              <div>charities</div>
              <div>rankings</div>
            </p>
          </div>
        </div>
      </Row>
    </StyledWrapper>
  );
}

SendNotifUserComponent.propTypes = {};

export default memo(SendNotifUserComponent);
