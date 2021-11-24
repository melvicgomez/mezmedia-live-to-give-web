/* eslint-disable func-names */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * OfficialPostLibraryComponent
 *
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axiosInstance from 'services';
import { push } from 'connected-react-router';
import qs from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled, { css } from 'styled-components';
import { Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import OfficialPostCardComponent from 'components/OfficialPostCardComponent';
import BackToTopComponent from 'components/BackToTopComponent';
import SearchPopupComponent from 'components/SearchPopupComponent';

import pusher from 'services/pusher';
import { Colors } from 'theme/colors';

import { reactLocalStorage } from 'reactjs-localstorage';

const FeedList = styled.div`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  padding-bottom: 10px;

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

const StickyFilterBar = styled(Row)`
  position: sticky;
  row-gap: 0px;
  top: calc(80px + 67px);
  z-index: 9999;
  background-color: ${Colors.background};
  box-shadow: 0 0 6px 5px ${Colors.background};
  padding: 10px 0;
  margin-bottom: 10px;
  z-index: 3;
`;

function OfficialPostLibraryComponent({ dispatch, location }) {
  const user = reactLocalStorage.getObject('user');

  const qsParams = qs.parse(location.search);
  const currentSearch = qsParams.search || '';

  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState([]);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [pageNum, setPageNum] = useState(1);

  const incomingFeedRef = useRef([]);
  const [incomingFeed, setIncomingFeed] = useState([]);

  // for clean up unmount
  const unmounted = useRef(false);

  useMemo(() => {
    pusher.bind('new-feed', function(data) {
      const tempNewFeed = JSON.parse(data.feed);
      if (tempNewFeed.is_official === 1) {
        const tempF = [...incomingFeedRef.current];
        tempF.unshift(tempNewFeed);
        incomingFeedRef.current = tempF;
        setIncomingFeed(tempF);
      }
    });
  }, [incomingFeedRef]);

  useEffect(() => {
    getFeeds();
    window.scrollTo(0, 0);
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
          `api/activity-feed?is_official=1&page=${page}&user_id=${
            user.user_id
          }&search=${currentSearch}`,
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

  const viewOfficialPostDetails = id => {
    dispatch(push(`activity-feed/official/${id}`));
  };

  return (
    <FeedList>
      {loading && incomingFeed.concat(feeds).length === 0 ? (
        <Row justify="center">
          <Spin indicator={<LoadingSpinner spin />} />
        </Row>
      ) : (
        <>
          <StickyFilterBar justify="space-between" align="center">
            <SearchPopupComponent location={location} dispatch={dispatch} />
          </StickyFilterBar>

          <InfiniteScroll
            dataLength={incomingFeed.concat(feeds).length}
            next={getFeeds}
            hasMore={hasNextPage}
            loader={<Spin indicator={<LoadingSpinner type="bottom" spin />} />}
            refreshFunction={() => getFeeds(true)}
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
                <OfficialPostCardComponent
                  feed={feed}
                  onClick={() => viewOfficialPostDetails(feed.feed_id)}
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

OfficialPostLibraryComponent.propTypes = {};

export default OfficialPostLibraryComponent;
