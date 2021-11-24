/* eslint-disable radix */
/**
 *
 * NavigationWrapperComponent
 *
 */

// import React, { useEffect, useState, useRef } from 'react';
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col } from 'antd';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';
import qs from 'query-string';
import SideNav from 'components/SideNav/Loadable';
import TopTabNav from 'components/TopTabNav';
import AppBarComponent from 'components/AppBarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import pusher from 'services/pusher';

import { createStructuredSelector } from 'reselect';
import makeSelectUserSettingsPage from 'containers/UserSettingsPage/selectors';
import settingsReducer from 'containers/UserSettingsPage/reducer';
import settingsSaga from 'containers/UserSettingsPage/saga';
import {
  fetchBellStatus,
  postBellStatus,
  updateBellStatus,
} from 'containers/UserSettingsPage/actions';

import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';

const { Content } = Layout;

const MainLayout = styled(Layout)`
  background-color: ${Colors.background};

  ${props =>
    props.primary &&
    css`
      height: 100vh;
    `}

  .notification {
    position: relative;

    .bell-indicator {
      position: absolute;
      content: '';
      width: 6px;
      height: 6px;
      margin: auto;
      background: ${Colors.notificationDot};
      left: calc(50% + 7px);
      bottom: -8px;
      border-radius: 50%;
    }
  }
`;

const RightContentStyled = styled.div`
  min-width: 405px;
  max-width: 405px;
  position: sticky;
  top: 68px;
  height: calc(100vh - 68px);
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  > div {
    position: absolute;
    padding: 0px 30px 0px 0px;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;
  }
  > div::-webkit-scrollbar {
    display: none;
  }
`;

const TabHeaderWrapperStyled = styled.div`
  min-height: 80px;
  display: flex;
  align-items: center;
  position: sticky;
  top: ${props => (props.tabBar ? '68px' : '0px')};
  z-index: 90;
  background-color: ${Colors.background};

  box-shadow: 0 0 8px 8px ${Colors.background};

  > div > img {
    cursor: pointer;
  }
`;

const MenuIcon = styled.img`
  height: 28px;
  width: 28px;
  margin-left: 20px;
  object-fit: contain;
  position: relative;
`;

function NavigationWrapperComponent({
  children,
  rightContent,
  match,
  dispatch,
  location,
  settings,
}) {
  useInjectReducer({ key: 'userSettingsPage', reducer: settingsReducer });
  useInjectSaga({ key: 'userSettingsPage', saga: settingsSaga });
  const user = reactLocalStorage.getObject('user');

  const [activeTab, setActiveTab] = useState('feeds');

  useEffect(() => {
    if (!match.path.startsWith('/notifications'))
      dispatch(fetchBellStatus(user.user_id));

    if (match.path.startsWith('/notifications'))
      dispatch(postBellStatus(user.user_id));
  }, []);

  pusher.bind('new-comment', data => {
    if (user.user_id === parseInt(data.user_id))
      if (user.user_id !== data.comment.user_id) {
        dispatch(
          updateBellStatus({
            bell_show: true,
            isLoading: false,
          }),
        );
      }
  });

  pusher.bind('new-like', data => {
    if (user.user_id === parseInt(data.user_id))
      if (data.likeCount > 0)
        if (data.source_user_id !== user.user_id) {
          dispatch(
            updateBellStatus({
              bell_show: true,
              isLoading: false,
            }),
          );
        }
  });

  pusher.bind('new-official-post', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('new-challenge', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('new-live-session', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('new-meetup', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('bcoin-awarded', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('admin-club-message', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('challenge-ending-reminder', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('starting-reminder-live-session', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('starting-reminder-meetup', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  pusher.bind('admin-message', data => {
    if (parseInt(data.user_id) === user.user_id) {
      dispatch(
        updateBellStatus({
          bell_show: true,
          isLoading: false,
        }),
      );
    }
  });

  useEffect(() => {
    let tempPath = 'feeds';
    const qsSearch = location ? qs.parse(location.search) : {};
    if (match.path.startsWith('/activity-feed')) {
      if (match.path === '/activity-feed') {
        if (location && location.state) {
          if (location.state.tab === 'my') {
            tempPath = 'posts';
          } else if (location.state.tab === 'library') {
            tempPath = 'library';
          } else {
            tempPath = 'feeds';
          }
        }
      } else if (match.path.startsWith('/activity-feed/official')) {
        tempPath = 'library';
      }

      if (qsSearch.search || qsSearch.search === '') {
        if (location && location.state) {
          if (location.state.tab === 'my') {
            tempPath = 'posts';
          } else if (location.state.tab === 'library') {
            tempPath = 'library';
          } else {
            tempPath = 'feeds';
          }
        }
      }
    }

    if (match.path === '/my-clubs') tempPath = 'my-clubs';
    if (match.path === '/charities') tempPath = 'charities';
    // if (match.path === '/user-profile') tempPath = 'profile';
    if (match.path === '/user-profile') {
      if (location && location.state) {
        if (location.state.tab === 'profile') {
          tempPath = 'profile';
        } else {
          tempPath = 'history';
        }
      } else tempPath = 'profile';
    }
    if (match.path === '/settings') tempPath = 'settings';
    if (match.path === '/notifications') tempPath = 'notifications';

    if (match.path.startsWith('/meetups') || match.path === '/meetups') {
      if (location && location.state) {
        if (location.state.tab === 'my') {
          tempPath = 'my-meetups';
        } else {
          tempPath = 'all-meetups';
        }
      }
      if (qsSearch.search || qsSearch.search === '') {
        tempPath = 'all-meetups';
      }
    }

    if (
      match.path.startsWith('/live-sessions') ||
      match.path === '/live-sessions'
    ) {
      if (location && location.state) {
        if (location.state.tab === 'my') {
          tempPath = 'my-lives';
        } else {
          tempPath = 'all-lives';
        }
      }
      if (qsSearch.search || qsSearch.search === '') {
        tempPath = 'all-lives';
      }
    }

    if (match.path.startsWith('/challenges') || match.path === '/challenges') {
      if (location && location.state) {
        if (location.state.tab === 'my') {
          tempPath = 'my-challenges';
        } else {
          tempPath = 'all-challenges';
        }
      }
      if (qsSearch.search || qsSearch.search === '') {
        tempPath = 'all-challenges';
      }
    }
    setActiveTab(tempPath);
  }, [location]);

  return (
    <div>
      <AppBarComponent />
      <div
        style={{
          maxWidth: 1366,
          margin: 'auto',
          paddingTop: 68,
        }}
      >
        <MainLayout>
          <SideNav match={match} />
          <Layout
            style={{
              marginLeft: '5px',
              backgroundColor: Colors.background,
              width: '612px',
              marginRight: '35px',
            }}
          >
            <Content style={{ width: '612px' }}>
              <TabHeaderWrapperStyled tabBar>
                <TopTabNav
                  match={match}
                  location={location}
                  getCurrentActiveTab={e => {
                    setActiveTab(e);
                  }}
                />
              </TabHeaderWrapperStyled>

              <Row style={{ marginTop: 6 }}>
                <Col span={24}>
                  {React.cloneElement(children, {
                    tab: activeTab,
                  })}
                </Col>
              </Row>
            </Content>
          </Layout>
          <RightContentStyled id="scrollableDiv">
            <div style={{ paddingBottom: '20px' }}>
              <TabHeaderWrapperStyled>
                <Row
                  justify="end"
                  align="middle"
                  style={{
                    width: '100%',
                    paddingRight: '10px',
                    position: 'sticky',
                    top: '0px',
                  }}
                >
                  {user.privilege === 'moderator' && (
                    <PrimaryButtonComponent
                      style={{
                        padding: '0px 20px',
                        marginiRght: '10px',
                        marginTop: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      label="Admin Panel"
                      onClick={() => dispatch(push('../../admin/dashboard'))}
                      iconRight={false}
                    />
                  )}
                  <MenuIcon
                    src={
                      match.path === '/user-profile'
                        ? Images.jumpToRankIcon
                        : Images.profileIcon
                    }
                    onClick={() => dispatch(push('../../user-profile'))}
                  />
                  <MenuIcon
                    src={
                      match.path === '/settings'
                        ? Images.settingSelectedIcon
                        : Images.settingIcon
                    }
                    onClick={() => dispatch(push('../../settings'))}
                  />

                  <div className="notification">
                    <MenuIcon
                      src={
                        match.path === '/notifications'
                          ? Images.notificationSelectedIcon
                          : Images.notificationIcon
                      }
                      onClick={() => {
                        dispatch(push('../../notifications'));
                      }}
                    />
                    <span
                      className={settings.bell_show ? 'bell-indicator' : ''}
                    />
                  </div>
                </Row>
              </TabHeaderWrapperStyled>
              {rightContent || null}
            </div>
          </RightContentStyled>
        </MainLayout>
      </div>
    </div>
  );
}

NavigationWrapperComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  settings: makeSelectUserSettingsPage(),
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

export default compose(withConnect)(NavigationWrapperComponent);
