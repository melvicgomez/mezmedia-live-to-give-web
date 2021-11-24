/**
 *
 * SendNotificationsContainer
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import SendNotifClubUsersComponent from 'components/admin/SendNotifClubUsersComponent';
import SendNotifAllUsersComponent from 'components/admin/SendNotifAllUsersComponent';

import { Row } from 'antd';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectSendNotificationsContainer from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

const RightContentStyled = styled.div`
  position: sticky;
  top: 148px;
  height: calc(100vh - 148px);
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export function SendNotificationsContainer({ match, location }) {
  useInjectReducer({ key: 'sendNotificationsContainer', reducer });
  useInjectSaga({ key: 'sendNotificationsContainer', saga });

  const PageWrapper = ({ tab }) => (
    <PageWrapperStyled className="white-text">
      <Row justify="space-between" wrap={false}>
        <div style={{ width: '645px' }}>
          {tab === 'club-users-notif' ? (
            <SendNotifClubUsersComponent />
          ) : (
            <SendNotifAllUsersComponent />
          )}
        </div>
        <RightContentStyled>
          <div style={{ padding: '0px 20px' }}>
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

            <div className="bodyBold" style={{ marginBottom: 14 }}>
              <div>
                live-session/<span className="delete-text">livesessionID</span>
              </div>
              <div>
                meetup/<span className="delete-text">meetupID</span>
              </div>
            </div>

            <div className="bodyBold" style={{ marginBottom: 14 }}>
              <div>
                activity-feed/official-post/
                <span className="delete-text">feedID</span>
              </div>
            </div>

            <div className="bodyBold" style={{ marginBottom: 14 }}>
              <div>bcoin-history</div>
              <div>settings</div>
              <div>charities</div>
              <div>rankings</div>
            </div>
          </div>
        </RightContentStyled>
      </Row>
    </PageWrapperStyled>
  );

  return (
    <div>
      <Helmet>
        <title>Admin Panel - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AdminNavigationWrapperComponent match={match} location={location}>
        <PageWrapper />
      </AdminNavigationWrapperComponent>
    </div>
  );
}

SendNotificationsContainer.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sendNotificationsContainer: makeSelectSendNotificationsContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SendNotificationsContainer);
