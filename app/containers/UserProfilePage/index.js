/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/**
 *
 * UserProfilePage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import styled, { css } from 'styled-components';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import ClubAvatarComponent, {
  getCurrentRankName,
} from 'components/ClubAvatarComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import BcoinValueComponent from 'components/BcoinValueComponent';
import { reactLocalStorage } from 'reactjs-localstorage';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { Row, Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Colors } from 'theme/colors';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserProfilePage from './selectors';
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
  margin-right: 12px;
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

const HistoryList = styled.div`
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

const DividerLine = styled.div`
  height: 1px;
  background-color: ${Colors.pureWhite};
  margin-top: 35px;
  margin-bottom: 25px;
`;

export function UserProfilePage({ match, location }) {
  useInjectReducer({ key: 'userProfilePage', reducer });
  useInjectSaga({ key: 'userProfilePage', saga });

  const user = reactLocalStorage.getObject('user');

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`api/club-interest?user_id=${user.user_id}`)
      .then(response => {
        setData(
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

  const MyProfile = () => (
    <PageWrapperStyled className="white-text">
      {!isLoading ? (
        <div>
          <p className="white-text h2" style={{ marginBottom: '10px' }}>
            Achievements
          </p>
          {data.map((category, index) => (
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
      )}
    </PageWrapperStyled>
  );

  const History = () => {
    const [loading, setLoading] = useState(true);
    const [bcoinHistory, setBcoinHistory] = useState([]);

    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageNum, setPageNum] = useState(1);

    // for clean up unmount
    const unmounted = useRef(false);

    useEffect(() => {
      getHistory();

      return () => {
        unmounted.current = true;
      };
    }, []);

    const getHistory = (refresh = false) => {
      const hasMoreData = refresh ? true : hasNextPage;
      const page = refresh ? 1 : pageNum;

      if (hasMoreData) {
        setLoading(true);
        axiosInstance
          .get(`api/bcoins?page=${page}&user_id=${user.user_id}`)
          .then(res => {
            if (!unmounted.current) {
              const historyList = bcoinHistory.concat(res.data.data);
              setBcoinHistory(historyList);
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
      <PageWrapperStyled className="white-text">
        <HistoryList style={{ overflow: 'hidden' }}>
          {loading && bcoinHistory.length === 0 ? (
            <Row justify="center">
              <Spin indicator={<LoadingSpinner spin />} />
            </Row>
          ) : (
            <InfiniteScroll
              dataLength={bcoinHistory.length}
              next={getHistory}
              hasMore={hasNextPage}
              loader={
                <Spin indicator={<LoadingSpinner type="bottom" spin />} />
              }
              refreshFunction={() => getHistory(true)}
              endMessage={
                !bcoinHistory.length && (
                  <div
                    className="h3 cyan-text"
                    style={{
                      textAlign: 'center',
                      padding: '80px 0px',
                    }}
                  >
                    <b>
                      There is nothing here yet. Take part in an activity now!
                    </b>
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
              {bcoinHistory.map(history => (
                <div key={history.transaction_id} className="white-text">
                  <div className="captionBold">{`${moment
                    .utc(history.created_at)
                    .local()
                    .format('DD MMM')} at ${moment
                    .utc(history.created_at)
                    .local()
                    .format('h:mmA')}`}</div>
                  <Row
                    wrap={false}
                    justify="spce-between"
                    align="middle"
                    style={{ marginTop: '6px' }}
                  >
                    <Col
                      flex="auto"
                      className="body"
                      style={{ marginRight: '25px' }}
                    >
                      {history.description}
                    </Col>
                    <Col flex="none">
                      <BcoinValueComponent
                        bcoinValue={history.amount}
                        isHistory
                        textStyle={{ color: Colors.positive }}
                        style={{ paddingLeft: '20px' }}
                      />
                    </Col>
                  </Row>
                  <DividerLine />
                </div>
              ))}
            </InfiniteScroll>
          )}
        </HistoryList>
      </PageWrapperStyled>
    );
  };

  const PageWrapper = ({ tab }) =>
    tab === 'profile' ? <MyProfile /> : <History />;
  return (
    <div>
      <Helmet>
        <title>My Profile - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        location={location}
        match={match}
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

// UserProfilePage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  userProfilePage: makeSelectUserProfilePage(),
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
)(UserProfilePage);
