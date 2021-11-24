/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * MeetupIndexPage
 *
 */

import React, { memo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import qs from 'query-string';
import axiosInstance from 'services';
import { Colors } from 'theme/colors';
import InfiniteScroll from 'react-infinite-scroll-component';
import InterestFeedCardComponent from 'components/InterestFeedCardComponent';
import SearchPopupComponent from 'components/SearchPopupComponent';
import styled, { css } from 'styled-components';
import { Row, Spin, Dropdown, Radio } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { reactLocalStorage } from 'reactjs-localstorage';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import BackToTopComponent from 'components/BackToTopComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectMeetupIndexPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const FeedList = styled.div`
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

const ItemSeperator = styled.div`
  height: 20px;
`;

const DropdownItem = styled.div`
  box-shadow: 0px 1px 5px 3px #00000020;
  background-color: ${Colors.pureWhite};
`;

const SelectedFilter = styled.div`
  color: ${Colors.pureWhite};
  margin-bottom: 15px;
  cursor: pointer;
`;

const StickyFilterBar = styled(Row)`
  position: sticky;
  row-gap: 0px;
  top: calc(80px + 67px);
  z-index: 9999;
  background-color: ${Colors.background};
  box-shadow: 0 0 6px 5px ${Colors.background};
  margin-bottom: 10px;
  margin-top: -20px;
  z-index: 3;
  padding-top: 10px;
`;

export function MeetupIndexPage({ match, dispatch, location }) {
  useInjectReducer({ key: 'meetupIndexPage', reducer });
  useInjectSaga({ key: 'meetupIndexPage', saga });

  const user = reactLocalStorage.getObject('user');

  const AllMeetup = () => {
    const qsParams = qs.parse(location.search);
    const currentSearch = qsParams.search || '';
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageNum, setPageNum] = useState(1);

    const [isPastIndex, setIsPastIndex] = useState(0);

    const [visible, setVisible] = useState(false);
    const myInterests = qsParams.my_interest
      ? parseInt(qsParams.my_interest)
      : 0;
    // for clean up unmount
    const unmounted = useRef(false);

    useEffect(() => {
      getFeeds();
      return () => {
        unmounted.current = true;
      };
    }, []);

    const getFeeds = (refresh = false) => {
      const hasMore = refresh ? true : hasNextPage;
      const page = refresh ? 1 : pageNum;

      if (hasMore) {
        setLoading(true);
        axiosInstance
          .get(
            `api/meetup?page=${page}&per_page=20&user_id=${
              user.user_id
            }&my_interest=${myInterests}&search=${currentSearch}`,
          )
          .then(res => {
            if (!unmounted.current) {
              const feedList =
                page === 1
                  ? res.data.ongoing_activity.concat(res.data.data)
                  : feeds.concat(res.data.data);
              if (page === 1) {
                setIsPastIndex(res.data.ongoing_activity.length);
              }
              setFeeds(feedList);
              if (res.data.next_page_url) {
                setPageNum(page + 1);
                setHasNextPage(true);
                setLoading(true);
              } else {
                setPageNum(page);
                setHasNextPage(false);
                setLoading(false);
              }
            }
          })
          .catch(() => {
            setLoading(false);
          });
      }
    };

    return (
      <FeedList style={{ position: 'relative' }}>
        <StickyFilterBar justify="space-between" align="center">
          <SearchPopupComponent location={location} dispatch={dispatch} />
          <div />
          <Dropdown
            getPopupContainer={trigger => trigger.parentElement}
            overlay={
              <DropdownItem
                style={{
                  boxShadow: '0px 1px 5px 3px #00000020',
                  backgroundColor: Colors.pureWhite,
                }}
              >
                <Radio.Group
                  onChange={e => {
                    // setMyInterests(e.target.value === 'All' ? 0 : 1);
                    dispatch(
                      push(
                        `${
                          location.pathname
                        }?search=${currentSearch}&my_interest=${
                          e.target.value === 'All' ? 0 : 1
                        }`,
                      ),
                    );
                  }}
                  value={myInterests === 0 ? 'All' : 'My Clubs'}
                >
                  {['All', 'My Clubs'].map((option, i) => (
                    <div key={i} style={{ padding: '5px 10px' }}>
                      <Radio value={option} style={{ padding: '5px' }}>
                        {option}
                      </Radio>
                    </div>
                  ))}
                </Radio.Group>
              </DropdownItem>
            }
            onVisibleChange={flag => {
              setVisible(flag);
            }}
            visible={visible}
            overlayStyle={{ zIndex: 4, width: '150px' }}
            trigger="click"
            placement="bottomRight"
          >
            <SelectedFilter className="bodyLink">
              Show: {myInterests === 0 ? 'All' : 'My Clubs'}
            </SelectedFilter>
          </Dropdown>
        </StickyFilterBar>
        {loading && feeds.length === 0 ? (
          <Row justify="center">
            <Spin indicator={<LoadingSpinner spin />} />
          </Row>
        ) : (
          <>
            <InfiniteScroll
              dataLength={feeds.length}
              next={getFeeds}
              hasMore={hasNextPage}
              loader={
                <Spin indicator={<LoadingSpinner type="bottom" spin />} />
              }
              refreshFunction={() => getFeeds(true)}
              endMessage={
                !feeds.length && (
                  <div
                    className="h3 cyan-text"
                    style={{
                      textAlign: 'center',
                      padding: '80px 0px',
                    }}
                  >
                    <b>No Available Meetups.</b>
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
              {feeds.map((feed, i) => (
                <div key={feed.meetup_id}>
                  {i === isPastIndex && (
                    <div
                      className="h2 white-text"
                      style={{ marginBottom: '20px' }}
                    >
                      Past Meetups
                    </div>
                  )}
                  <div
                    onClick={() => {
                      dispatch(push(`meetups/${feed.meetup_id}?tab=1`));
                    }}
                  >
                    <InterestFeedCardComponent
                      feed={{
                        ...feed,
                        participants_count: feed.participants_count,
                        is_joined_meetup: feed.is_joined_meetup,
                      }}
                      clubInterest={feed.club_interest}
                      type="meetup"
                    />
                  </div>
                  <ItemSeperator />
                </div>
              ))}
            </InfiniteScroll>
            {!!feeds.length && <BackToTopComponent />}
          </>
        )}
      </FeedList>
    );
  };

  const MyMeetup = () => {
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageNum, setPageNum] = useState(1);

    const [isPastIndex, setIsPastIndex] = useState(0);

    // for clean up unmount
    const unmounted = useRef(false);

    useEffect(() => {
      getFeeds();
      return () => {
        unmounted.current = true;
      };
    }, []);

    const getFeeds = (refresh = false) => {
      const hasMore = refresh ? true : hasNextPage;
      const page = refresh ? 1 : pageNum;

      if (hasMore) {
        setLoading(true);
        axiosInstance
          .get(
            `api/meetup?page=${page}&per_page=20&user_id=${
              user.user_id
            }&is_part_of=1`,
          )
          .then(res => {
            if (!unmounted.current) {
              const feedList =
                page === 1
                  ? res.data.ongoing_activity.concat(res.data.data)
                  : feeds.concat(res.data.data);
              if (page === 1) {
                setIsPastIndex(res.data.ongoing_activity.length);
              }
              setFeeds(feedList);
              if (res.data.next_page_url) {
                setPageNum(page + 1);
                setHasNextPage(true);
                setLoading(true);
              } else {
                setPageNum(page);
                setHasNextPage(false);
                setLoading(false);
              }
            }
          })
          .catch(() => {
            setLoading(false);
          });
      }
    };

    return (
      <FeedList>
        {loading && feeds.length === 0 ? (
          <Row justify="center">
            <Spin indicator={<LoadingSpinner spin />} />
          </Row>
        ) : (
          <>
            <InfiniteScroll
              dataLength={feeds.length}
              next={getFeeds}
              hasMore={hasNextPage}
              loader={
                <Spin indicator={<LoadingSpinner type="bottom" spin />} />
              }
              refreshFunction={() => getFeeds(true)}
              endMessage={
                !feeds.length && (
                  <div
                    className="h3 cyan-text"
                    style={{
                      textAlign: 'center',
                      padding: '80px 0px',
                    }}
                  >
                    <b>You are not participating in any Meetups yet.</b>
                    <div
                      className="h3 cyan-text"
                      style={{
                        textAlign: 'center',
                        paddingTop: '10px',
                      }}
                    >
                      <b>
                        Click{' '}
                        <span
                          className="bodyLink"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            dispatch(
                              push({
                                pathname: `/meetups`,
                                state: { tab: 'all' },
                              }),
                            );
                          }}
                        >
                          here
                        </span>{' '}
                        to browse all Meetups
                      </b>
                    </div>
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
              {feeds.map((feed, i) => (
                <div key={i}>
                  {i === isPastIndex && (
                    <div
                      className="h2 white-text"
                      style={{ marginBottom: '20px' }}
                    >
                      Past Meetups
                    </div>
                  )}
                  <div
                    onClick={() => {
                      dispatch(push(`meetups/${feed.meetup_id}?tab=2`));
                    }}
                  >
                    <InterestFeedCardComponent
                      feed={{
                        ...feed,
                        participants_count: feed.participants_count,
                        is_joined_meetup: feed.is_joined_meetup,
                      }}
                      clubInterest={feed.club_interest}
                      type="meetup"
                    />
                  </div>
                  <ItemSeperator />
                </div>
              ))}
            </InfiniteScroll>
            {!!feeds.length && <BackToTopComponent />}
          </>
        )}
      </FeedList>
    );
  };

  const PageWrapper = ({ tab }) =>
    tab === 'all-meetups' ? <AllMeetup /> : <MyMeetup />;

  return (
    <div>
      <Helmet>
        <title>Meetups - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        match={match}
        location={location}
        rightContent={
          <div>
            <SideProfileComponent />
          </div>
        }
      >
        <PageWrapper />
      </NavigationWrapperComponent>
    </div>
  );
}

MeetupIndexPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  meetupIndexPage: makeSelectMeetupIndexPage(),
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
)(MeetupIndexPage);
