/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/**
 *
 * UserInfoPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { replace } from 'connected-react-router';
import api from 'services';
import { Helmet } from 'react-helmet';
import { Row, Spin } from 'antd';
import { Colors } from 'theme/colors';
import { LoadingOutlined } from '@ant-design/icons';
import ClubAvatarComponent, {
  getCurrentRankName,
} from 'components/ClubAvatarComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import AddBcoinComponent from 'components/AddBcoinComponent';
import UserPostListComponent from 'components/admin/UserPostListComponent';
import UserCommentListComponent from 'components/admin/UserCommentListComponent';
import EventListComponent from 'components/admin/EventListComponent';
import UserHistoryComponent from 'components/admin/UserHistoryComponent';
import SendNotifUserComponent from 'components/admin/SendNotifUserComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserInfoPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: ${props => (props.type === 'bottom' ? '20px' : '40px')};

  ${props =>
    props.type === 'refresh'
      ? css`
          font-size: 30px;
          margin-bottom: 15px;
        `
      : null}
`;

const ClubName = styled.div`
  margin: 10px 0px;
`;

const ClubRankCard = styled.div`
  width: 190px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin-right: 15px;
  margin-bottom: 15px;
  overflow: hidden;

  .rank-name {
    height: 29px;
  }

  .progress {
    background-color: ${Colors.mediumGray};
    height: 43px;
  }

  .club-detail {
    padding: 10px;

    .club-name {
      text-align: center;
      margin: 5px 0px 10px;
      line-height: 16px;
      height: 50px;
    }

    .activity {
      text-align: center;
      line-height: 16px;
    }
  }
`;

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

export function UserInfoPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'userInfoPage', reducer });
  useInjectSaga({ key: 'userInfoPage', saga });

  const userId = match.params.id;

  const [tempUserData, setTempUserData] = useState();
  const [clubInterest, setClubInterest] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addBcoinPopup, setAddBcoinPopup] = useState(false);
  const [suspendAcctLoading, setSuspendAcctLoading] = useState(false);
  const [confimSuspendAcct, setConfimSuspendAcct] = useState(false);

  useEffect(() => {
    api.get(`api/user/${userId}`).then(res => {
      const data = res.data.data.user;
      setTempUserData(data);
    });

    setIsLoading(true);
    api
      .get(`api/club-interest?user_id=${userId}`)
      .then(response => {
        setClubInterest(
          Object.keys(response.data).map(key => ({
            club_name: key,
            interests: response.data[key],
          })),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getCurrentRankColor = (totalActivities = 0) => {
    if (totalActivities === 0)
      return {
        color: '#239AB5',
        progress: '1',
      };
    else if (totalActivities >= 1 && totalActivities <= 2) {
      return {
        color: '#B28757',
        progress: `${3 - totalActivities}`,
      };
    }
    if (totalActivities >= 3 && totalActivities <= 5) {
      return {
        color: '#959595',
        progress: `${6 - totalActivities}`,
      };
    }
    if (totalActivities >= 6 && totalActivities <= 8) {
      return {
        color: '#D4BE41',
        progress: `${9 - totalActivities}`,
      };
    }
    if (totalActivities >= 9 && totalActivities <= 11) {
      return {
        color: '#B08FC7',
        progress: `${12 - totalActivities}`,
      };
    }
    if (totalActivities >= 12) {
      return {
        color: '#C1EEFF',
        progress: '0',
      };
    }
  };

  const Details = () =>
    !isLoading ? (
      <div style={{ marginLeft: 20 }}>
        {clubInterest.map((category, index) => (
          <div key={index}>
            <ClubName className="h3 cyan-text">{category.club_name}</ClubName>
            <Row>
              {category.interests.map((club, i) => {
                const totalActivities =
                  club.challenges_done_count +
                  club.meetups_done_count +
                  club.live_session_done_count;

                return (
                  <ClubRankCard key={i}>
                    <Row
                      className="bodyBold white-text rank-name"
                      justify="center"
                      align="middle"
                      style={{
                        backgroundColor: getCurrentRankColor(totalActivities)
                          .color,
                      }}
                    >
                      {totalActivities > 0
                        ? getCurrentRankName(1, totalActivities)
                            .replace(' Member', '')
                            .toUpperCase()
                        : 'BASIC'}
                    </Row>
                    <div className="club-detail">
                      <Row justify="center">
                        <ClubAvatarComponent
                          isMember={1}
                          totalActivities={totalActivities}
                          iconName={club.icon_name || 'running'}
                        />
                      </Row>
                      <Row
                        justify="center"
                        className="captionBold cyan-text club-name"
                      >
                        {club.interest_name}
                      </Row>
                      <Row
                        justify="center"
                        className="captionBold darkGrey-text activity"
                      >
                        Completed {totalActivities} activities
                      </Row>
                    </div>

                    <Row
                      className="caption darkGrey-text progress"
                      justify="center"
                      align="middle"
                    >
                      <span className="captionBold">{`${
                        getCurrentRankColor(totalActivities).progress
                      } more `}</span>
                      &nbsp;to level up
                    </Row>
                  </ClubRankCard>
                );
              })}
            </Row>
          </div>
        ))}
      </div>
    ) : (
      <Row justify="center">
        <Spin indicator={<LoadingSpinner spin />} />
      </Row>
    );

  const PageWrapper = ({ tab }) => (
    <PageWrapperStyled className="white-text">
      <ConfirmationPopupComponent
        actionRequire
        visibility={confimSuspendAcct}
        dismissModal={() => {
          setConfimSuspendAcct(false);
        }}
        title="Suspend Account"
        message="Do you wish to suspend this user account?"
        leftAction={() => {
          if (!suspendAcctLoading) {
            setSuspendAcctLoading(true);
            api.delete(`api/user/${userId}`).finally(() => {
              setConfimSuspendAcct(false);
              dispatch(replace('../../../admin/users'));
              setSuspendAcctLoading(false);
            });
          }
        }}
        rightAction={() => {
          setConfimSuspendAcct(false);
        }}
      />
      <AddBcoinComponent
        userId={userId}
        visibility={addBcoinPopup}
        onCancel={() => {
          setAddBcoinPopup(false);
        }}
      />

      <Row justify="space-between" wrap={false}>
        <div style={{ width: '645px', marginTop: '5px' }}>
          {tab === 'user-posts' ? (
            <UserPostListComponent match={match} />
          ) : tab === 'user-comments' ? (
            <UserCommentListComponent match={match} />
          ) : tab === 'user-challenges' ||
            tab === 'user-lives' ||
            tab === 'user-meetups' ? (
            <EventListComponent
              match={match}
              type={
                tab === 'user-challenges'
                  ? 'challenge'
                  : tab === 'user-lives'
                  ? 'lives'
                  : 'meetup'
              }
            />
          ) : tab === 'user-history' ? (
            <UserHistoryComponent match={match} />
          ) : tab === 'user-notification' ? (
            <SendNotifUserComponent match={match} />
          ) : (
            <Details />
          )}
        </div>
        <RightContentStyled>
          <div style={{ marginBottom: '20px' }}>
            <SideProfileComponent admin id={parseInt(userId, 10)} />
            <div style={{ marginTop: 6, display: 'flex' }}>
              {tempUserData ? (
                tempUserData.privilege ? (
                  <div style={{ marginRight: 6 }}>
                    <PrimaryButtonComponent
                      disabled={
                        tempUserData
                          ? tempUserData.privilege === 'suspended'
                          : false
                      }
                      onClick={() => {
                        setConfimSuspendAcct(true);
                      }}
                      label={
                        tempUserData
                          ? tempUserData.privilege === 'suspended'
                            ? 'Suspended'
                            : 'Suspend Account'
                          : false
                      }
                      iconRight={false}
                    />
                  </div>
                ) : null
              ) : null}

              {tab === 'user-history' ? (
                <div style={{ marginRight: 6 }}>
                  <PrimaryButtonComponent
                    onClick={() => {
                      setAddBcoinPopup(true);
                    }}
                    label="Add B Coin"
                    iconRight={false}
                  />
                </div>
              ) : null}
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

UserInfoPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userInfoPage: makeSelectUserInfoPage(),
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
)(UserInfoPage);
