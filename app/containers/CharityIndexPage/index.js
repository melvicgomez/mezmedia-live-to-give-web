/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * CharityIndexPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import axiosInstance from 'services';
import InfiniteScroll from 'react-infinite-scroll-component';
import CharityCardComponent from 'components/CharityCardComponent';
import styled, { css } from 'styled-components';
import { Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCharityIndexPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

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

export function CharityIndexPage({ match, dispatch }) {
  useInjectReducer({ key: 'charityIndexPage', reducer });
  useInjectSaga({ key: 'charityIndexPage', saga });

  const CharityList = () => {
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(false);

    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageNum, setPageNum] = useState(1);

    useEffect(() => {
      getCharities(1);
    }, []);

    const getCharities = async (page = 1, reload) => {
      const hasMore = reload ? true : hasNextPage;

      if (hasMore) {
        axiosInstance
          .get(`api/charity?page=${page}`)
          .then(res => {
            setCharities(
              page === 1 ? res.data.data : charities.concat(res.data.data),
            );
            if (res.data.next_page_url) {
              setPageNum(page + 1);
              setHasNextPage(true);
              setLoading(true);
            } else {
              setHasNextPage(false);
              setLoading(false);
            }
          })
          .catch(() => {
            setLoading(false);
          });
      }
    };

    const viewCharitiesDetails = id => {
      dispatch(push(`charities/${id}`));
    };

    return (
      <FeedList style={{ overflow: 'hidden' }}>
        {loading && charities.length === 0 ? (
          <Row justify="center">
            <Spin indicator={<LoadingSpinner spin />} />
          </Row>
        ) : (
          <InfiniteScroll
            draggable="true"
            onDrag={e => e.stopPropagation()}
            dataLength={charities.length}
            next={() => getCharities(pageNum, false)}
            hasMore={hasNextPage}
            loader={
              <Row justify="center">
                <Spin indicator={<LoadingSpinner spin />} />
              </Row>
            }
            refreshFunction={() => {
              getCharities(1, true);
            }}
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
            {charities.map((charity, i) => (
              <div key={i}>
                <div
                  onClick={() => {
                    viewCharitiesDetails(charity.charity_id);
                  }}
                >
                  <CharityCardComponent charity={charity} />
                </div>
                <ItemSeperator />
              </div>
            ))}
          </InfiniteScroll>
        )}
      </FeedList>
    );
  };

  return (
    <div>
      <Helmet>
        <title>Charities - Live to Give</title>
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
        <PageWrapperStyled>
          <CharityList />
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

CharityIndexPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  charityIndexPage: makeSelectCharityIndexPage(),
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
)(CharityIndexPage);
