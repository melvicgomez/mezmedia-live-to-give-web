/* eslint-disable no-nested-ternary */
/**
 *
 * TopTabNav
 *
 */

import React, { useState, useEffect } from 'react';
import { Menu, Row } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import { Colors } from 'theme/colors';
import PropTypes from 'prop-types';

const MenuBar = styled(Menu)`
  background-color: ${Colors.background};
  border-bottom: 0px !important;

  & > .ant-menu-item-selected,
  .ant-menu-item-active {
    border-bottom: 3px solid ${Colors.primary} !important;
    color: ${Colors.primary} !important;
  }
`;

const MenuItem = styled(Menu.Item)`
  margin: ${props =>
    props.admin ? '0px 30px 0px 0px' : '0px 60px 0px 0px'} !important;
`;

const CreateIcon = styled(Row)`
  border-radius: 50px;
  height: 16px;
  width: 16px;
  align-content: center;
  margin-right: 8px;
  margin-top: 3px;
  background-color: ${Colors.primary};
`;
function TopTabNav({ match, location, dispatch, getCurrentActiveTab }) {
  const [current, setCurrent] = useState('feeds');

  const handleClick = e => {
    setCurrent(e.key);
    getCurrentActiveTab(e.key);
  };

  useEffect(() => {
    let tab = '';
    if (match.path.startsWith('/activity-feed')) {
      if (match.path === '/activity-feed') {
        if (location && location.state) {
          tab =
            location.state.tab === 'my'
              ? 'posts'
              : location.state.tab === 'library'
              ? 'library'
              : 'feeds';
        } else {
          tab = 'feeds';
        }
      }
      if (match.path.startsWith('/activity-feed/official')) tab = 'library';

      if (
        match.path.startsWith('/activity-feed/challenges') ||
        match.path.startsWith('/activity-feed/live-sessions') ||
        match.path.startsWith('/activity-feed/meetups')
      ) {
        tab = 'feeds';
      }
    }

    if (match.path.startsWith('/challenges')) {
      if (match.path === '/challenges') {
        if (location && location.state) {
          tab =
            location.state.tab === 'all' ? 'all-challenges' : 'my-challenges';
        } else {
          tab = 'my-challenges';
        }
      }
      if (location && location.search) {
        tab =
          new URLSearchParams(location.search).get('tab') === '1' ||
          (!new URLSearchParams(location.search).get('tab') &&
            (new URLSearchParams(location.search).get('search') ||
              new URLSearchParams(location.search).get('search') === ''))
            ? 'all-challenges'
            : 'my-challenges';
      }
    }

    if (match.path.startsWith('/live-sessions')) {
      if (match.path === '/live-sessions') {
        if (location && location.state) {
          tab = location.state.tab === 'all' ? 'all-lives' : 'my-lives';
        } else {
          tab = 'my-lives';
        }
      }
      if (location && location.search) {
        tab =
          new URLSearchParams(location.search).get('tab') === '1' ||
          new URLSearchParams(location.search).get('search') ||
          new URLSearchParams(location.search).get('search') === ''
            ? 'all-lives'
            : 'my-lives';
      }
    }

    if (match.path.startsWith('/meetups')) {
      if (match.path === '/meetups') {
        if (location && location.state) {
          tab = location.state.tab === 'all' ? 'all-meetups' : 'my-meetups';
        } else {
          tab = 'my-meetups';
        }
      }
      if (location && location.search) {
        tab =
          new URLSearchParams(location.search).get('tab') === '1' ||
          new URLSearchParams(location.search).get('search') ||
          new URLSearchParams(location.search).get('search') === ''
            ? 'all-meetups'
            : 'my-meetups';
      }
    }

    if (match.path.startsWith('/my-clubs')) tab = 'my-clubs';
    if (match.path === '/about-live-to-give') tab = 'about';
    if (match.path.startsWith('/charities')) tab = 'charities';
    if (match.path === '/ranking') tab = 'rankings';
    if (match.path === '/user-profile') {
      if (location && location.state) {
        tab = location.state.tab === 'history' ? 'history' : 'profile';
      } else {
        tab = 'profile';
      }
    }
    if (match.path === '/settings') tab = 'settings';
    if (match.path === '/notifications') tab = 'notifications';

    if (match.path.startsWith('/admin/users')) {
      if (location && location.state) {
        tab =
          location.state.tab === 'posts'
            ? 'user-posts'
            : location.state.tab === 'comments'
            ? 'user-comments'
            : location.state.tab === 'challenges'
            ? 'user-challenges'
            : location.state.tab === 'lives'
            ? 'user-lives'
            : location.state.tab === 'meetups'
            ? 'user-meetups'
            : location.state.tab === 'history'
            ? 'user-history'
            : location.state.tab === 'user-notification'
            ? 'user-notification'
            : 'user-details';
      } else {
        tab = 'user-details';
      }
    }

    if (match.path.startsWith('/admin/notifications')) {
      if (location && location.state) {
        tab =
          location.state.tab === 'all-users-notif'
            ? 'all-users-notif'
            : 'club-users-notif';
      } else {
        tab = 'club-users-notif';
      }
    }
    setCurrent(tab);
  }, [location, match]);

  return (
    <Row
      wrap={false}
      justify="space-between"
      align="middle"
      style={{ width: '100%' }}
    >
      <MenuBar
        className="white-text"
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
        {match.path.includes('/activity-feed') ? (
          <MenuItem
            key="feeds"
            className="h3"
            onClick={() => {
              dispatch(
                push({ pathname: `/activity-feed`, state: { tab: 'all' } }),
              );
            }}
          >
            Activity Feed
          </MenuItem>
        ) : null}
        {match.path.includes('/activity-feed') ? (
          <MenuItem
            key="posts"
            className="h3"
            onClick={() => {
              dispatch(
                push({ pathname: `/activity-feed`, state: { tab: 'my' } }),
              );
            }}
          >
            My Posts
          </MenuItem>
        ) : null}
        {match.path.includes('/activity-feed') ? (
          <MenuItem
            key="library"
            className="h3"
            onClick={() => {
              dispatch(
                push({ pathname: `/activity-feed`, state: { tab: 'library' } }),
              );
            }}
          >
            Library
          </MenuItem>
        ) : null}
        {match.path.startsWith('/my-clubs') ? (
          <MenuItem key="my-clubs" className="h3">
            My Clubs
          </MenuItem>
        ) : null}
        {match.path.startsWith('/challenges') ? (
          <MenuItem
            key="my-challenges"
            className="h3"
            onClick={() => {
              dispatch(push({ pathname: `/challenges`, state: { tab: 'my' } }));
            }}
          >
            My Challenges
          </MenuItem>
        ) : null}
        {match.path.startsWith('/challenges') ? (
          <MenuItem
            key="all-challenges"
            className="h3"
            onClick={() => {
              dispatch(
                push({ pathname: `/challenges`, state: { tab: 'all' } }),
              );
            }}
          >
            All Challenges
          </MenuItem>
        ) : null}
        {match.path.startsWith('/live-sessions') ? (
          <MenuItem
            key="my-lives"
            className="h3"
            onClick={() => {
              dispatch(
                push({ pathname: `/live-sessions`, state: { tab: 'my' } }),
              );
            }}
          >
            My Live Sessions
          </MenuItem>
        ) : null}
        {match.path.startsWith('/live-sessions') ? (
          <MenuItem
            key="all-lives"
            className="h3"
            onClick={() => {
              dispatch(
                push({ pathname: `/live-sessions`, state: { tab: 'all' } }),
              );
            }}
          >
            All Live Sessions
          </MenuItem>
        ) : null}
        {match.path.startsWith('/meetups') ? (
          <MenuItem
            key="my-meetups"
            className="h3"
            onClick={() => {
              dispatch(push({ pathname: `/meetups`, state: { tab: 'my' } }));
            }}
          >
            My Meetups
          </MenuItem>
        ) : null}
        {match.path.startsWith('/meetups') ? (
          <MenuItem
            key="all-meetups"
            className="h3"
            onClick={() => {
              dispatch(push({ pathname: `/meetups`, state: { tab: 'all' } }));
            }}
          >
            All Meetups
          </MenuItem>
        ) : null}
        {match.path.startsWith('/charities') ? (
          <MenuItem key="charities" className="h3">
            Charities
          </MenuItem>
        ) : null}
        {match.path === '/ranking' ? (
          <MenuItem key="rankings" className="h3">
            Rankings
          </MenuItem>
        ) : null}
        {match.path === '/user-profile' ? (
          <MenuItem key="profile" className="h3">
            My Profile
          </MenuItem>
        ) : null}
        {match.path === '/user-profile' ? (
          <MenuItem key="history" className="h3">
            History
          </MenuItem>
        ) : null}
        {match.path === '/settings' ? (
          <MenuItem key="settings" className="h3">
            Settings
          </MenuItem>
        ) : null}
        {match.path === '/notifications' ? (
          <MenuItem key="notifications" className="h3">
            Notifications
          </MenuItem>
        ) : null}
        {match.path === '/about-live-to-give' ? (
          <MenuItem key="about" className="h3">
            About Live to Give
          </MenuItem>
        ) : null}
        {/* admin */}
        {match.path.startsWith('/admin/users') &&
        match.path !== '/admin/users' ? (
          <>
            <MenuItem
              admin={1}
              key="user-details"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'details' },
                  }),
                );
              }}
            >
              User Details
            </MenuItem>
            <MenuItem
              admin={1}
              key="user-posts"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'posts' },
                  }),
                );
              }}
            >
              User Posts
            </MenuItem>
            <MenuItem
              admin={1}
              key="user-comments"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'comments' },
                  }),
                );
              }}
            >
              User Comments
            </MenuItem>
            <MenuItem
              admin={1}
              key="user-challenges"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'challenges' },
                  }),
                );
              }}
            >
              Challenges
            </MenuItem>
            <MenuItem
              admin={1}
              key="user-lives"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'lives' },
                  }),
                );
              }}
            >
              Live Sessions
            </MenuItem>
            <MenuItem
              admin={1}
              key="user-meetups"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'meetups' },
                  }),
                );
              }}
            >
              Meetups
            </MenuItem>
            <MenuItem
              admin={1}
              key="user-history"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'history' },
                  }),
                );
              }}
            >
              History
            </MenuItem>

            <MenuItem
              admin={1}
              key="user-notification"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/users/${match.params.id}`,
                    state: { tab: 'user-notification' },
                  }),
                );
              }}
            >
              Send Notification
            </MenuItem>
          </>
        ) : null}

        {match.path === '/admin/notifications' ? (
          <>
            <MenuItem
              admin={1}
              key="club-users-notif"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/notifications`,
                    state: { tab: 'club-users-notif' },
                  }),
                );
              }}
            >
              Send to Club Members
            </MenuItem>

            <MenuItem
              admin={1}
              key="all-users-notif"
              className="h3"
              onClick={() => {
                dispatch(
                  push({
                    pathname: `/admin/notifications`,
                    state: { tab: 'all-users-notif' },
                  }),
                );
              }}
            >
              Send to All Users
            </MenuItem>
          </>
        ) : null}
      </MenuBar>
      {(match.path.startsWith('/challenges') ||
        match.path.startsWith('/live-sessions') ||
        match.path.startsWith('/meetups')) && (
        <Row
          wrap={false}
          align="middle"
          className="bodyBold"
          style={{ cursor: 'pointer', color: Colors.mediumGray }}
          onClick={() => {
            if (match.path.startsWith('/challenges')) {
              dispatch(push('../challenges/suggestion'));
            } else if (match.path.startsWith('/live-sessions')) {
              dispatch(push('../live-sessions/suggestion'));
            } else {
              dispatch(push('../meetups/suggestion'));
            }
          }}
        >
          <CreateIcon justify="center" className="white-text">
            +
          </CreateIcon>
          {match.path.startsWith('/challenges')
            ? 'Suggest a Challenge'
            : match.path.startsWith('/live-sessions')
            ? 'Suggest a Live Session'
            : 'Suggest a Virtual Meetup'}
        </Row>
      )}
    </Row>
  );
}

TopTabNav.propTypes = {
  match: PropTypes.object,
  getCurrentActiveTab: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(TopTabNav);
