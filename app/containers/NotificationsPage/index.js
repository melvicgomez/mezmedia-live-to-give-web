/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * NotificationsPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import { Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { reactLocalStorage } from 'reactjs-localstorage';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import SideProfileComponent from 'components/SideProfileComponent';
import NotificationCardComponent from 'components/NotificationCardComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectNotificationsPage from './selectors';
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

const NotificationList = styled.div`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  padding: 10px 0px;

  > div > div {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;
  }

  > div > div::-webkit-scrollbar {
    display: none;
  }
`;

const ItemSeperator = styled.div`
  height: 20px;
`;

export function NotificationsPage({ match, dispatch }) {
  useInjectReducer({ key: 'notificationsPage', reducer });
  useInjectSaga({ key: 'notificationsPage', saga });

  const user = reactLocalStorage.getObject('user');

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    getNotifications(1);
  }, []);

  const getNotifications = async (refresh = false) => {
    const hasMore = refresh ? true : hasNextPage;
    const page = refresh ? 1 : pageNum;

    if (hasMore) {
      setLoading(true);
      axiosInstance
        .get(`api/notifications?user_id=${user.user_id}&page=${page}`)
        .then(res => {
          setNotifications(
            page === 1 ? res.data.data : notifications.concat(res.data.data),
          );
          if (res.data.next_page_url) {
            setPageNum(page + 1);
            setHasNextPage(true);
          } else {
            setPageNum(page);
            setHasNextPage(false);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Notfications - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        match={match}
        rightContent={
          <div>
            <SideProfileComponent />
          </div>
        }
      >
        <PageWrapperStyled className="body white-text">
          <NotificationList style={{ overflow: 'hidden' }}>
            {loading && notifications.length === 0 ? (
              <Row justify="center">
                <Spin indicator={<LoadingSpinner spin />} />
              </Row>
            ) : (
              <InfiniteScroll
                dataLength={notifications.length}
                next={getNotifications}
                hasMore={hasNextPage}
                loader={
                  <Spin indicator={<LoadingSpinner type="bottom" spin />} />
                }
                refreshFunction={() => getNotifications(true)}
                endMessage={
                  !notifications.length && (
                    <div
                      className="h3 cyan-text"
                      style={{
                        textAlign: 'center',
                        padding: '80px 0px',
                      }}
                    >
                      <b>There is nothing here yet.</b>
                    </div>
                  )
                }
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                  <Row justify="center">
                    <Spin indicator={<LoadingSpinner type="refresh" spin />} />
                  </Row>
                }
                releaseToRefreshContent={
                  <Row justify="center">
                    <Spin indicator={<LoadingSpinner type="refresh" spin />} />
                  </Row>
                }
              >
                {notifications.map(notification => (
                  <div
                    key={notification.notification_id}
                    className="white-text"
                  >
                    <div
                      onClick={() => {
                        const deepLink = notification.deep_link.split('/')[0];
                        let urlObj = null;
                        // navigateToPage(notification);
                        switch (deepLink) {
                          case 'bcoin-history':
                            dispatch(
                              push({
                                pathname: `/user-profile`,
                                state: { tab: 'history' },
                              }),
                            );
                            break;

                          case 'settings':
                            urlObj = `/settings`;
                            break;

                          case 'rankings':
                            urlObj = `/ranking`;
                            break;

                          case 'club':
                            urlObj = `/my-clubs/${
                              notification.deep_link.split('/')[1]
                            }`;
                            break;

                          case 'challenges':
                            urlObj = `/challenges`;
                            break;

                          case 'team-challenge':
                          case 'individual-challenge':
                          case 'nontrack-challenge':
                            urlObj = `/challenges/${
                              notification.deep_link.split('/')[1]
                            }?tab=1`;
                            break;

                          case 'live-sessions':
                            urlObj = `/live-sessions`;
                            break;

                          case 'live-session':
                            urlObj = `/live-sessions/${
                              notification.deep_link.split('/')[1]
                            }?tab=1`;
                            break;

                          case 'meetups':
                            urlObj = `/meetups`;
                            break;

                          case 'meetup':
                            urlObj = `/meetups/${
                              notification.deep_link.split('/')[1]
                            }?tab=1`;
                            break;

                          case 'charities':
                            urlObj = `/charities`;
                            break;

                          case 'charity':
                            urlObj = `/charities/${
                              notification.deep_link.split('/')[1]
                            }?tab=1`;
                            break;

                          case 'activity-feed':
                            if (
                              notification.deep_link.split('/')[1] ===
                              'user-post'
                            ) {
                              urlObj = `/post/${
                                notification.deep_link.split('/')[2]
                              }`;
                            } else {
                              urlObj = `/activity-feed/official/${
                                notification.deep_link.split('/')[2]
                              }`;
                            }
                            break;

                          default:
                            break;
                        }
                        if (urlObj) {
                          dispatch(push(urlObj));
                        }
                      }}
                    >
                      <NotificationCardComponent data={notification} />
                    </div>
                    <ItemSeperator />
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </NotificationList>
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

NotificationsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notificationsPage: makeSelectNotificationsPage(),
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
)(NotificationsPage);
