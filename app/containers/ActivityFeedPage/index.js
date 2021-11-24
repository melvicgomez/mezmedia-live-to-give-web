/* eslint-disable radix */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * ActivityFeedPage
 *
 */

import React, { memo, useState, useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import { push } from 'connected-react-router';
import qs from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled, { css } from 'styled-components';
import { Row, Col, Spin, Carousel, Radio, Dropdown } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import BackToTopComponent from 'components/BackToTopComponent';
import InterestFeedCardComponent from 'components/InterestFeedCardComponent';
import UserPostCardComponent from 'components/UserPostCardComponent';
import PollPopupComponent from 'components/PollPopupComponent';
import CharitySelectionComponent from 'components/CharitySelectionComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import OfficialPostCardComponent from 'components/OfficialPostCardComponent';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import CommunityGuidelinesComponent from 'components/CommunityGuidelinesComponent';
import CreatePostFormComponent from 'components/CreatePostFormComponent';
import ActivityFeedMyPostComponent from 'components/ActivityFeedMyPostComponent';
import OfficialPostLibraryComponent from 'components/OfficialPostLibraryComponent';
import SearchPopupComponent from 'components/SearchPopupComponent';

import pusher from 'services/pusher';

import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Helmet } from 'react-helmet';
import SideProfileComponent from 'components/SideProfileComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectActivityFeedPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import TutorialSlideComponent from '../../components/TutorialSlideComponent';

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

const FeaturedCarousel = styled(Carousel)`
  border-radius: 16px;
  overflow: hidden;

  .ant-carousel .slick-dots-bottom {
    bottom: 0px;
  }

  .event-caption {
    position: absolute;
    top: 20px;
    width: 100%;
    text-align: center;
    padding: 0px 30px;
  }
`;

const ItemSeperator = styled.div`
  height: 20px;
`;

const CarouselImage = styled.img`
  height: 292px;
  width: 100%;
  object-fit: cover;
  -khtml-user-select: none;
  -o-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const SelectedFilter = styled.div`
  color: ${Colors.pureWhite};
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 0px 5px 6px ${Colors.background};
  position: sticky;
`;

const DropdownItem = styled.div`
  box-shadow: 0px 1px 5px 3px #00000020;
  background-color: ${Colors.pureWhite};
`;

const MakePostStrip = styled.div`
  padding: 20px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin-bottom: 20px;
`;

const WritePost = styled(Row)`
  width: 100%;
`;

const CommentInput = styled(Row)`
  border-radius: 16px;
  border: 2px solid ${Colors.mediumGray};
  margin-left: 20px;
  padding-left: 20px;
  height: 46px !important;
  color: ${Colors.bodyText};
  box-shadow: inset 0px 1px 2px 0px #00000035;
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
  margin-top: 10px;
  z-index: 3;
`;

export function ActivityFeedPage({ match, dispatch, location }) {
  useInjectReducer({ key: 'activityFeedPage', reducer });
  useInjectSaga({ key: 'activityFeedPage', saga });
  // reactLocalStorage.remove('user');
  // reactLocalStorage.remove('token');

  const qsParams = qs.parse(location.search);
  const currentSearch = qsParams.search || '';

  const user = reactLocalStorage.getObject('user');

  const ActivityFeed = () => {
    const [feeds, setFeeds] = useState([]);
    const [featuredActivity, setFeaturedActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    // handle non-filtered feeds
    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageNum, setPageNum] = useState(1);

    const [modalVisible, setModalVisible] = useState(false);
    const myInterests = qsParams.my_interest
      ? parseInt(qsParams.my_interest)
      : 0;

    const [showGuideline, setShowGuideline] = useState(false);

    const incomingFeedRef = useRef([]);
    const [incomingFeed, setIncomingFeed] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [tutorialVisible, setTutorialVisible] = useState(false);

    const [poll, setPoll] = useState(null);
    const [pollVisible, setPollVisible] = useState(false);

    const [charitySelectionOptions, setCharitySelectionOptions] = useState([]);
    const [charitySelectionModal, setCharitySelectionModal] = useState(false);

    const [visible, setVisible] = useState(false);

    // for clean up unmount
    const unmounted = useRef(false);

    useMemo(() => {
      pusher.bind('new-feed', function(data) {
        const tempNewFeed = JSON.parse(data.feed);
        incomingFeedRef.current.unshift(tempNewFeed);
        setIncomingFeed(incomingFeedRef.current);
      });
    }, []);

    useEffect(() => {
      if (!user.tutorial_web_done) {
        setTutorialVisible(true);
      }

      axiosInstance.get(`api/poll`).then(res => {
        if (res.data.poll && !res.data.user_response) {
          setPoll(res.data.poll);
          setPollVisible(true);
        }
      });

      axiosInstance.get(`api/check-charity-expiration`).then(res => {
        setCharitySelectionOptions(res.data.charities);
        setCharitySelectionModal(res.data.show_modal);
      });
    }, []);

    useEffect(() => {
      getFeeds();
      window.scrollTo(0, 0);
      return () => {
        unmounted.current = true;
      };
    }, []);

    const getFeeds = () => {
      if (pageNum === 1) {
        incomingFeedRef.current = [];
        setIncomingFeed([]);
      }

      if (hasNextPage) {
        axiosInstance
          .get('api/activity-feed', {
            params: {
              page: pageNum,
              user_id: user.user_id,
              featured: 1,
              is_announcement: 1,
              my_interest: myInterests,
              search: currentSearch,
            },
          })
          .then(res => {
            if (!unmounted.current) {
              const feedList = feeds.concat(res.data.data);
              setFeeds(feedList);
              if (res.data.next_page_url) {
                setPageNum(pageNum + 1);
                setHasNextPage(true);
                setLoading(true);
                setFeaturedActivity(res.data.featured_activities);
              } else {
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

    const refreshList = async my_interest => {
      setLoading(true);
      incomingFeedRef.current = [];
      setIncomingFeed([]);

      await axiosInstance
        .get('api/activity-feed', {
          params: {
            user_id: user.user_id,
            page: 1,
            featured: 1,
            is_announcement: 1,
            my_interest,
            search: currentSearch,
          },
        })
        .then(res => {
          setFeeds(res.data.data);
          setFeaturedActivity(res.data.featured_activities);
          if (res.data.next_page_url) {
            setPageNum(2);
            setHasNextPage(true);
            setLoading(true);
          } else {
            setPageNum(1);
            setHasNextPage(false);
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    };

    const actionOnFeed = (id, action) => {
      if (action === 'flag') {
        axiosInstance
          .post('api/activity-feed-flag', {
            user_id: user.user_id,
            feed_id: id,
          })
          .then(() => {
            const newFeedList = [...feeds].filter(feed => feed.feed_id !== id);
            const newIncomingFeed = incomingFeedRef.current.filter(
              feed => feed.feed_id !== id,
            );
            setIncomingFeed(newIncomingFeed);
            setFeeds(newFeedList);
          });
      } else {
        axiosInstance.delete(`api/activity-feed/${id}`).then(() => {
          const newFeedList = [...feeds].filter(feed => feed.feed_id !== id);
          const newIncomingFeed = incomingFeedRef.current.filter(
            feed => feed.feed_id !== id,
          );
          setIncomingFeed(newIncomingFeed);
          setFeeds(newFeedList);
        });
      }
    };

    const agreeGuideline = () => {
      axiosInstance
        .post('api/user', { user_id: user.user_id, community_guidelines: 1 })
        .then(res => {
          reactLocalStorage.setObject('user', res.data.data.user);
          user.community_guidelines = res.data.data.user.community_guidelines;
          setShowGuideline(false);
          setModalVisible(true);
        })
        .catch(() => {
          setShowGuideline(false);
        });
    };

    const viewFeedDetails = (id, type) => {
      if (type === 'challenge') {
        dispatch(push(`activity-feed/challenges/${id}`));
      } else if (type === 'lives') {
        dispatch(push(`activity-feed/live-sessions/${id}`));
      } else {
        dispatch(push(`activity-feed/meetups/${id}`));
      }
    };

    const SampleNextArrow = props => {
      const { className, style, onClick } = props;
      return (
        <div
          className={className}
          style={{
            ...style,
            display: 'block',
            right: '10px',
          }}
          onClick={onClick}
        >
          <img
            src={Images.rightArrowBordered}
            alt="next"
            style={{ width: '17px', height: '25px' }}
          />
        </div>
      );
    };

    const SamplePrevArrow = props => {
      const { className, style, onClick } = props;
      return (
        <div
          className={className}
          style={{
            ...style,
            display: 'block',
            left: '10px',
            zIndex: 9,
          }}
          onClick={onClick}
        >
          <img
            src={Images.leftArrowBordered}
            alt="prev"
            style={{ width: '17px', height: '25px' }}
          />
        </div>
      );
    };

    const settings = {
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
    };

    const getImageLink = item => {
      let prefix = process.env.IMAGE_URL_PREFIX;
      prefix += item.live_id
        ? `live-session/${item.live_id}/`
        : item.meetup_id
        ? `meetup/${item.meetup_id}/`
        : `challenge/${item.challenge_id}/`;

      prefix += item.image_cover;

      return prefix;
    };

    const viewOfficialPostDetails = id => {
      dispatch(push(`activity-feed/official/${id}`));
    };

    const navigate = () => {
      const data = featuredActivity[currentIndex];
      if (data.challenge_id) {
        viewFeedDetails(data.challenge_id, 'challenge');
      } else if (data.live_id) {
        viewFeedDetails(data.live_id, 'lives');
      } else if (data.meetup_id) {
        viewFeedDetails(data.meetup_id, 'meetup');
      }
    };

    return (
      <FeedList>
        <TutorialSlideComponent
          modalVisible={tutorialVisible}
          dismissModal={() => setTutorialVisible(false)}
        />
        {loading && incomingFeed.concat(feeds).length === 0 ? (
          <Row justify="center">
            <Spin indicator={<LoadingSpinner spin />} />
          </Row>
        ) : (
          <>
            <div>
              <FeaturedCarousel
                autoplay
                arrows
                {...settings}
                beforeChange={(from, to) => setCurrentIndex(to)}
              >
                {featuredActivity.map((activity, i) => (
                  <div key={i} onClick={navigate}>
                    <div style={{ position: 'relative' }}>
                      <CarouselImage
                        src={`${getImageLink(activity)}`}
                        alt="featured"
                      />
                      <Row
                        justify="center"
                        className="white-text h3 event-caption"
                        style={{
                          textShadow: `1px 1px 4px ${Colors.black}`,
                          fontSize: '20px',
                        }}
                      >
                        {activity.title}
                      </Row>
                    </div>
                  </div>
                ))}
              </FeaturedCarousel>
            </div>
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
                      onChange={async e => {
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
            <InfiniteScroll
              style={{ overflow: 'inherit' }}
              dataLength={incomingFeed.concat(feeds).length}
              next={getFeeds}
              hasMore={hasNextPage}
              loader={
                <Row justify="center">
                  <Spin indicator={<LoadingSpinner type="bottom" spin />} />
                </Row>
              }
              endMessage={
                !incomingFeed.concat(feeds).length && (
                  <div
                    className="h3 cyan-text"
                    style={{
                      textAlign: 'center',
                      padding: '80px 0px',
                    }}
                  >
                    <b>No Activity Feed Available</b>
                  </div>
                )
              }
              refreshFunction={() => refreshList(myInterests)}
              pullDownToRefresh={!tutorialVisible}
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
              <MakePostStrip className="h3 cyan-text">
                <WritePost>
                  <Col flex="none">
                    <UserAvatarComponent user={user} />
                  </Col>
                  <Col flex="auto">
                    <CommentInput
                      align="middle"
                      onClick={() => {
                        if (user.community_guidelines) {
                          setModalVisible(true);
                        } else {
                          setShowGuideline(true);
                        }
                      }}
                    >
                      Make a post...
                    </CommentInput>
                  </Col>
                </WritePost>
              </MakePostStrip>
              {incomingFeed.concat(feeds).map(feed => (
                <div key={feed.feed_id}>
                  {feed.feed_type === 'feed' ? (
                    <>
                      <UserPostCardComponent
                        feed={feed}
                        actionOnFeed={actionOnFeed}
                      />
                      <ItemSeperator />
                    </>
                  ) : null}
                  {feed.feed_type === 'challenge' ? (
                    <>
                      <div
                        onClick={() => {
                          viewFeedDetails(feed.challenge_id, 'challenge');
                        }}
                      >
                        <InterestFeedCardComponent
                          feed={{
                            ...feed.challenge,
                            participants_count:
                              feed.challenge.participants_count,
                            is_joined_challenge: feed.challenge.is_joined,
                          }}
                          clubInterest={feed.challenge.club_interest}
                          type="challenge"
                        />
                      </div>
                      <ItemSeperator />
                    </>
                  ) : null}
                  {feed.feed_type === 'live session' ? (
                    <>
                      <div
                        onClick={() => {
                          viewFeedDetails(feed.live_id, 'lives');
                        }}
                      >
                        <InterestFeedCardComponent
                          feed={{
                            ...feed.live_session,
                            participants_count:
                              feed.live_session.participants_count,
                            is_joined_live_session: feed.live_session.is_joined,
                          }}
                          clubInterest={feed.live_session.club_interest}
                          type="lives"
                        />
                      </div>
                      <ItemSeperator />
                    </>
                  ) : null}
                  {feed.feed_type === 'meetup' ? (
                    <>
                      <div
                        onClick={() => {
                          viewFeedDetails(feed.meetup_id, 'meetup');
                        }}
                      >
                        <InterestFeedCardComponent
                          feed={{
                            ...feed.meetup,
                            participants_count: feed.meetup.participants_count,
                            is_joined_meetup: feed.meetup.is_joined,
                          }}
                          clubInterest={feed.meetup.club_interest}
                          type="meetup"
                        />
                      </div>
                      <ItemSeperator />
                    </>
                  ) : null}
                  {feed.feed_type === 'official' ||
                  feed.feed_type === 'announcement' ? (
                    <>
                      <OfficialPostCardComponent
                        feed={feed}
                        onClick={() => viewOfficialPostDetails(feed.feed_id)}
                      />
                      <ItemSeperator />
                    </>
                  ) : null}
                </div>
              ))}
              <CreatePostFormComponent
                modalVisible={modalVisible}
                dismissModal={() => {
                  refreshList();
                  setModalVisible(false);
                }}
                type="activity"
                data={{}}
              />
              <CommunityGuidelinesComponent
                visibility={showGuideline}
                dismissModal={() => setShowGuideline(false)}
                agreeGuideline={agreeGuideline}
              />
              {!!poll && (
                <PollPopupComponent
                  poll={poll}
                  visibility={pollVisible}
                  dismissModal={() => setPollVisible(false)}
                />
              )}

              <CharitySelectionComponent
                options={charitySelectionOptions}
                visibility={charitySelectionModal}
                dismissModal={() => {
                  setCharitySelectionModal(false);
                }}
              />
            </InfiniteScroll>
            {!!incomingFeed.concat(feeds).length && <BackToTopComponent />}
          </>
        )}
      </FeedList>
    );
  };

  const PageWrapper = ({ tab }) =>
    tab === 'feeds' ? (
      <ActivityFeed />
    ) : tab === 'posts' ? (
      <ActivityFeedMyPostComponent />
    ) : (
      <OfficialPostLibraryComponent dispatch={dispatch} location={location} />
    );

  return (
    <div>
      <Helmet>
        <title>Activity Feed - Live to Give</title>
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

const mapStateToProps = createStructuredSelector({
  activityFeedPage: makeSelectActivityFeedPage(),
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
)(ActivityFeedPage);
