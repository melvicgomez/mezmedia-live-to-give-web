/* eslint-disable no-nested-ternary */
/**
 *
 * AdminNavigationWrapperComponent
 *
 */

import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled, { css } from 'styled-components';
import { Layout, Row, Col } from 'antd';
import AppBarComponent from 'components/AppBarComponent';
import TopTabNav from 'components/TopTabNav';
import SideNav from 'components/SideNav/Loadable';
import { Colors } from 'theme/colors';

const { Content } = Layout;

const MainLayout = styled(Layout)`
  background-color: ${Colors.background};

  ${props =>
    props.primary &&
    css`
      height: 100vh;
    `}
`;

const TabHeaderWrapperStyled = styled.div`
  min-height: 80px;
  display: flex;
  align-items: ${props => (props.searchBar ? 'flex-end' : 'center')};
  position: sticky;
  top: ${props => (props.tabBar || props.searchBar ? '68px' : '0px')};
  z-index: 90;
  background-color: ${Colors.background};
  box-shadow: 0 0 8px 8px ${Colors.background};

  ${props =>
    props.searchBar &&
    css`
      padding-bottom: 10px;
    `}

  > div > img {
    cursor: pointer;
  }
`;

function AdminNavigationWrapperComponent({
  match,
  location,
  children,
  topTab,
}) {
  const [activeTab, setActiveTab] = useState('feeds');

  useEffect(() => {
    let tab = '';

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
    setActiveTab(tab);
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
          <SideNav match={match} admin />
          <Layout
            style={{
              marginLeft: '5px',
              backgroundColor: Colors.background,
              width: '612px',
              marginRight: '20px',
            }}
          >
            <Content style={{ width: '1100px' }}>
              {match.path === '/admin/users' ||
              match.path === '/admin/posts' ||
              match.path === '/admin/comments' ||
              match.path === '/admin/officials' ||
              match.path === '/admin/challenges' ||
              match.path === '/admin/live-sessions' ||
              match.path === '/admin/meetups' ||
              match.path === '/admin/teams' ||
              match.path === '/admin/dashboard' ||
              match.path === '/admin/polls' ? (
                <TabHeaderWrapperStyled searchBar>
                  {topTab}
                </TabHeaderWrapperStyled>
              ) : (
                <TabHeaderWrapperStyled tabBar>
                  <TopTabNav
                    match={match}
                    location={location}
                    getCurrentActiveTab={e => {
                      setActiveTab(e);
                    }}
                  />
                </TabHeaderWrapperStyled>
              )}

              <Row>
                <Col span={24}>
                  {React.cloneElement(children, {
                    tab: activeTab,
                  })}
                </Col>
              </Row>
            </Content>
          </Layout>
        </MainLayout>
      </div>
    </div>
  );
}

AdminNavigationWrapperComponent.propTypes = {
  // dispatch: PropTypes.func.isRequired,
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

export default compose(withConnect)(AdminNavigationWrapperComponent);
