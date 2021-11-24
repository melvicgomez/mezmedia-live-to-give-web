/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/**
 *
 * ActivityFeedMyPostComponent
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from 'services';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled, { css } from 'styled-components';
import { Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import UserPostCardComponent from 'components/UserPostCardComponent';
import BackToTopComponent from 'components/BackToTopComponent';

import pusher from 'services/pusher';

import { reactLocalStorage } from 'reactjs-localstorage';

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

function ActivityFeedMyPostComponent() {
  const user = reactLocalStorage.getObject('user');
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const incomingFeedRef = useRef([]);
  const [incomingFeed, setIncomingFeed] = useState([]);

  // for clean up unmount
  const unmounted = useRef(false);

  useEffect(() => {
    pusher.bind('new-feed', function(data) {
      const tempNewFeed = JSON.parse(data.feed);
      const feedExists =
        incomingFeedRef.current.findIndex(
          feed => feed.feed_id === tempNewFeed.feed_id,
        ) >= 0;

      if (!feedExists) {
        if (tempNewFeed.user_id === user.user_id) {
          const tempF = [...incomingFeedRef.current];
          tempF.unshift(tempNewFeed);
          incomingFeedRef.current = tempF;
          setIncomingFeed(tempF);
        }
      }
    });
  }, [incomingFeedRef]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getFeeds();
    return () => {
      unmounted.current = true;
    };
  }, []);

  const getFeeds = (refresh = false) => {
    const hasMoreFeeds = refresh ? true : hasNextPage;
    const page = refresh ? 1 : pageNum;
    if (page === 1) {
      incomingFeedRef.current = [];
      setIncomingFeed([]);
    }
    if (hasMoreFeeds) {
      setLoading(true);

      axiosInstance
        .get(
          `api/activity-feed?page=${page}&is_user_post=1&user_id=${
            user.user_id
          }`,
        )
        .then(res => {
          if (!unmounted.current) {
            const feedList = refresh
              ? res.data.data
              : feeds.concat(res.data.data);
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

  const actionOnFeed = (id, action) => {
    if (action === 'delete') {
      axiosInstance.delete(`api/activity-feed/${id}`).then(() => {
        const newFeedList = feeds.filter(feed => feed.feed_id !== id);
        setFeeds(newFeedList);
        const newIncomingFeed = incomingFeedRef.current.filter(
          feed => feed.feed_id !== id,
        );
        setIncomingFeed(newIncomingFeed);
      });
    }
  };

  return (
    <FeedList>
      {loading && incomingFeed.concat(feeds).length === 0 ? (
        <Row justify="center">
          <Spin indicator={<LoadingSpinner spin />} />
        </Row>
      ) : (
        <>
          <InfiniteScroll
            dataLength={incomingFeed.concat(feeds).length}
            next={getFeeds}
            hasMore={hasNextPage}
            loader={<Spin indicator={<LoadingSpinner type="bottom" spin />} />}
            refreshFunction={() => getFeeds(true)}
            endMessage={
              !incomingFeed.concat(feeds).length && (
                <div
                  className="h3 cyan-text"
                  style={{
                    textAlign: 'center',
                    padding: '80px 0px',
                  }}
                >
                  <b>You haven’t made any Posts yet.</b>
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
            {incomingFeed.concat(feeds).map(feed => (
              <div key={feed.feed_id}>
                <UserPostCardComponent
                  feed={feed}
                  actionOnFeed={actionOnFeed}
                />
                <ItemSeperator />
              </div>
            ))}
          </InfiniteScroll>
          {!!incomingFeed.concat(feeds).length && <BackToTopComponent />}
        </>
      )}
    </FeedList>
  );
}

ActivityFeedMyPostComponent.propTypes = {};

export default ActivityFeedMyPostComponent;
