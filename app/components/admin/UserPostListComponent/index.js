/**
 *
 * UserPostListComponent
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

function UserPostListComponent({ match }) {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [pageNum, setPageNum] = useState(1);

  // for clean up unmount
  const unmounted = useRef(false);

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

    if (hasMoreFeeds) {
      setLoading(true);

      axiosInstance
        .get(
          `api/admin/users-get-feed-posts?page=${page}&user_id=${
            match.params.id
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
            loader={<Spin indicator={<LoadingSpinner type="bottom" spin />} />}
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
                  <b>No Posts Available.</b>
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
            {feeds.map(feed => (
              <div key={feed.feed_id}>
                <UserPostCardComponent feed={feed} admin />
                <ItemSeperator />
              </div>
            ))}
          </InfiniteScroll>
          {feeds.length > 1 && <BackToTopComponent />}
        </>
      )}
    </FeedList>
  );
}

UserPostListComponent.propTypes = {};

export default UserPostListComponent;
