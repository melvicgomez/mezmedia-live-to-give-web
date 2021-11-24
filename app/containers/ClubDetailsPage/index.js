/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/**
 *
 * ClubDetailsPage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import { reactLocalStorage } from 'reactjs-localstorage';
import DOMPurify from 'dompurify';
import { push } from 'connected-react-router';
import { Row, Col, Spin, Button, Dropdown, Radio } from 'antd';
import {
  LoadingOutlined,
  PictureOutlined,
  CaretDownFilled,
} from '@ant-design/icons';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import UserPostCardComponent from 'components/UserPostCardComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import CreatePostFormComponent from 'components/CreatePostFormComponent';
import OfficialPostCardComponent from 'components/OfficialPostCardComponent';
import InterestFeedCardComponent from 'components/InterestFeedCardComponent';
import ClubAvatarComponent, {
  getCurrentRankName,
} from 'components/ClubAvatarComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import ParticipantListComponent from 'components/ParticipantListComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectClubDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

const ScrollList = styled(InfiniteScroll)`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: ${props => (props.small ? '30px' : '40px')};
`;

const ParticipateButton = styled(Button)`
  background-image: ${props =>
    props.disabled ? Colors.disabled : Colors.blueGradient} !important;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 16px;
  border: 0px;
  outline: 0px;
  height: 46px;
  display: flex;
  align-items: center;
  box-shadow: ${Colors.shadow} 0px 2px 2px 0px;

  &:hover,
  :focus {
    background: ${Colors.blueGradient};
    color: ${Colors.pureWhite};
  }

  > .ant-btn-loading-icon {
    margin: 0px 5px 5px 0px;
  }

  :disabled {
    background-color: ${Colors.mediumGray} !important;
    color: ${Colors.pureWhite};

    :hover {
      color: ${Colors.pureWhite};
    }
  }
`;

const ClubPhoto = styled.img`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
  -khtml-user-select: none;
  -o-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const ClubInfoSection = styled.div`
  width: 100%;
  padding: 15px 30px 15px 20px;
  background-color: ${Colors.pureWhite};

  > p {
    margin-bottom: 15px;
  }
`;

const ClubInfo = styled.div`
  margin-left: 10px;

  > p {
    line-height: 16px;

    :first-child {
      line-height: 20px;
      margin-bottom: 2px;
    }
  }
`;

const NoImagePlaceholder = styled(Row)`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: 3px solid ${Colors.pureWhite};
`;

const Content = styled.div`
  margin: 20px 0px 5px;

  > p:first-child {
    margin-bottom: 10px;
  }
`;

const Description = styled.div`
  margin-bottom: 35px;

  > img {
    width: 100%;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > img {
    width: 39px;
    height: 37px;
    object-fit: contain;
    margin-bottom: 10px;
  }
`;

const LeaveButton = styled(Row)`
  cursor: pointer;
`;

const ParticipationIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 24px;
  margin-right: 5px;
  background-color: ${props =>
    props.isEnded ? Colors.bodyText : Colors.positive};
  padding: 4px;
  box-shadow: 0px 2px 2px 0px #00000025;

  > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const MakePostStrip = styled.div`
  padding: 10px 20px 20px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin: 30px 0px 15px;
`;

const WritePost = styled(Row)`
  width: 100%;
  margin-top: 20px;
`;

const CreatePostButton = styled(Row)`
  border-radius: 16px;
  border: 2px solid ${Colors.mediumGray};
  margin-left: 20px;
  padding-left: 20px;
  height: 46px !important;
  color: ${Colors.bodyText};
  box-shadow: inset 0px 1px 2px 0px #00000035;
  cursor: pointer;
`;

const ItemSeperator = styled.div`
  height: 20px;
`;

const FilterOptionTab = styled.div`
  color: ${Colors.bodyText};
  padding: 10px 10px;

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Colors.grapefruit};
    border-color: ${Colors.grapefruit};
  }
  .ant-checkbox + span {
    color: ${Colors.bodyText};
  }
`;

const DropdownItem = styled.div`
  box-shadow: 0px 1px 5px 3px #00000020;
  background-color: ${Colors.pureWhite};
`;

export function ClubDetailsPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'clubDetailsPage', reducer });
  useInjectSaga({ key: 'clubDetailsPage', saga });

  const user = reactLocalStorage.getObject('user');
  const interestId = match.params.id;

  const [clubData, setClubData] = useState({});
  const [totalActivitiesDone, setTotalActivitiesDone] = useState(0);
  const [totalRelatedActivities, setTotalRelatedActivities] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // load activity feed
  const [feeds, setFeeds] = useState([]);
  const [feedNextPage, setFeedNextPage] = useState(true);
  const [feedPageNum, setFeedPageNum] = useState(1);

  // load member
  const [members, setMembers] = useState({
    favorite_users: [],
    participants: [],
  });
  const [loadMember, setLoadMember] = useState(true);
  const [memberNextPage, setMemberNextPage] = useState(true);
  const [memberPageNum, setMemberPageNum] = useState(1);

  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState('Activity Feed');
  const filterOption = [
    'Activity Feed',
    'Challenges',
    'Live Sessions',
    'Meetups',
    'Posts',
  ];

  let currentSearch = '';

  useEffect(() => {
    setIsLoading(true);
    getClubData();
  }, [interestId, user.user_id]);

  useEffect(() => {
    const qsParams = qs.parse(location.search);
    currentSearch = qsParams.search || '';
    getMembers(true);
  }, [location.search]);

  useEffect(() => {
    getFeeds();
    getMembers();
  }, []);

  const getClubData = () => {
    axiosInstance
      .get(`api/club-interest/${interestId}?user_id=${user.user_id}`)
      .then(response => {
        const { data } = response.data;
        setClubData(data);
        setTotalActivitiesDone(
          (data.challenges_done_count || 0) +
            (data.meetups_done_count || 0) +
            (data.live_session_done_count || 0),
        );
        setTotalRelatedActivities(
          (data.related_challenges_count || 0) +
            (data.related_live_sessions_count || 0) +
            (data.related_meetups_count || 0),
        );
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getFeeds = (refresh = false) => {
    const hasMore = refresh ? true : feedNextPage;
    const page = refresh ? 1 : feedPageNum;

    const filter =
      selectedFilter === filterOption[0]
        ? ''
        : selectedFilter === filterOption[1]
        ? 'challenge'
        : selectedFilter === filterOption[2]
        ? 'live_session'
        : selectedFilter === filterOption[3]
        ? 'meetup'
        : 'feed';

    if (hasMore) {
      axiosInstance
        .get(
          `api/activity-feed?page=${page}&filter_by=${filter}&interest_id=${interestId}&user_id=${
            user.user_id
          }`,
        )
        .then(res => {
          const feedList = refresh
            ? res.data.data
            : feeds.concat(res.data.data);
          setFeeds(feedList);
          if (res.data.next_page_url) {
            setFeedPageNum(page + 1);
            setFeedNextPage(true);
          } else {
            setFeedPageNum(page);
            setFeedNextPage(false);
          }
        });
    }
  };

  const getMembers = (refresh = false) => {
    const hasMore = refresh ? true : memberNextPage;
    const page = refresh ? 1 : memberPageNum;

    if (hasMore) {
      axiosInstance
        .get(
          `api/club-interest/participants/${interestId}?page=${page}&search=${currentSearch}`,
        )
        .then(res => {
          const memberList = refresh
            ? res.data.data
            : members.participants.concat(res.data.data);
          setMembers({
            favorite_users: res.data.favorite_users || [],
            participants: memberList,
          });
          if (res.data.next_page_url) {
            setMemberPageNum(page + 1);
            setMemberNextPage(true);
            setLoadMember(true);
          } else {
            setMemberPageNum(page);
            setMemberNextPage(false);
            setLoadMember(false);
          }
        })
        .catch(() => {
          setLoadMember(false);
        });
    }
  };

  const actionOnFeed = (id, action) => {
    if (action === 'flag') {
      axiosInstance
        .post('api/activity-feed-flag', {
          user_id: user.user_id,
          feed_id: id,
        })
        .then(() => {
          const newFeedList = feeds.filter(feed => feed.feed_id !== id);
          setFeeds(newFeedList);
          clubData.related_posts_count--;
        });
    } else {
      axiosInstance.delete(`api/activity-feed/${id}`).then(() => {
        const newFeedList = feeds.filter(feed => feed.feed_id !== id);
        setFeeds(newFeedList);
        clubData.related_posts_count--;
      });
    }
  };

  const updateClubMembership = status => {
    axiosInstance
      .post('api/user-club-interest-participate', {
        user_id: user.user_id,
        interest_id: clubData.interest_id,
        status,
      })
      .then(response => {
        if (response.data.data) {
          if (status === 'leave') {
            setClubData({
              ...clubData,
              is_club_member: 0,
              members_count: clubData.members_count - 1,
            });
            clubData.is_club_member = 0; // update parent
            clubData.members_count--;
          } else {
            setClubData({
              ...clubData,
              is_club_member: 1,
              members_count: clubData.members_count + 1,
            });
            clubData.is_club_member = 1; // update parent
            clubData.members_count++;
          }
          getMembers(true);
        }
      });
  };
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      getFeeds(true);
    }
  }, [selectedFilter]);

  const [visible, setVisible] = useState(false);
  const handleVisibleChange = flag => {
    setVisible(flag);
  };

  const ActivityFeedList = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <>
        <MakePostStrip className="h3 cyan-text">
          <Dropdown
            overlay={
              <DropdownItem
                style={{
                  boxShadow: '0px 1px 5px 3px #00000020',
                  backgroundColor: Colors.pureWhite,
                }}
              >
                <Radio.Group
                  onChange={async e => {
                    setSelectedFilter(e.target.value);
                    setVisible(false);
                  }}
                  value={selectedFilter}
                >
                  {filterOption.map((option, i) => (
                    <div key={i}>
                      <FilterOptionTab>
                        <Radio value={option} style={{ padding: '5px' }}>
                          {option}
                        </Radio>
                      </FilterOptionTab>
                    </div>
                  ))}
                </Radio.Group>
              </DropdownItem>
            }
            onVisibleChange={handleVisibleChange}
            visible={visible}
            overlayStyle={{ zIndex: 4, width: '240px' }}
            trigger="click"
            placement="bottomLeft"
          >
            <Row
              align="middle"
              justify="start"
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
              }}
            >
              <CaretDownFilled
                style={{
                  fontSize: '12px',
                  color: Colors.primary,
                  marginRight: '5px',
                }}
              />
              {selectedFilter}
            </Row>
          </Dropdown>

          <WritePost>
            <Col flex="none">
              <UserAvatarComponent user={user} />
            </Col>
            <Col flex="auto">
              <CreatePostButton
                align="middle"
                onClick={() => setModalVisible(true)}
              >
                Make a post...
              </CreatePostButton>
            </Col>
          </WritePost>
        </MakePostStrip>
        {feeds.map((feed, index) => (
          <div key={index}>
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
                    dispatch(push(`../challenges/${feed.challenge_id}?tab=1`));
                  }}
                >
                  <InterestFeedCardComponent
                    feed={{
                      ...feed.challenge,
                      participants_count: feed.challenge.participants_count,
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
                    dispatch(push(`../live-sessions/${feed.live_id}?tab=1`));
                  }}
                >
                  <InterestFeedCardComponent
                    feed={{
                      ...feed.live_session,
                      participants_count: feed.live_session.participants_count,
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
              <div>
                <div
                  onClick={() => {
                    dispatch(push(`../meetups/${feed.meetup_id}?tab=1`));
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
              </div>
            ) : null}
            {feed.feed_type === 'official' ||
            feed.feed_type === 'announcement' ? (
              <>
                <OfficialPostCardComponent
                  feed={feed}
                  onClick={() => {
                    dispatch(push(`../activity-feed/official/${feed.feed_id}`));
                  }}
                />
                <ItemSeperator />
              </>
            ) : null}
          </div>
        ))}
        {/* {loadFeeds && (
          <Row justify="center" style={{ height: '50px' }}>
            <Spin indicator={<LoadingSpinner spin small={1} />} />
          </Row>
        )} */}
        <CreatePostFormComponent
          modalVisible={modalVisible}
          dismissModal={() => {
            getClubData();
            getFeeds(true);
            setModalVisible(false);
          }}
          type="club"
          data={clubData}
        />
      </>
    );
  };

  return (
    <div>
      <Helmet>
        <title>Club Details - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <div>
        <NavigationWrapperComponent
          match={match}
          rightContent={
            <div>
              <ParticipantListComponent
                type="club"
                participants={members}
                loadParticipant={loadMember}
                hasNextPage={memberNextPage}
                data={clubData || {}}
                getMoreParticipant={getMembers}
                location={location}
                refreshList={() => getMembers(true)}
              />
            </div>
          }
        >
          <PageWrapperStyled className="white-text">
            {!isLoading ? (
              <ScrollList
                dataLength={feeds.length}
                next={getFeeds}
                hasMore={feedNextPage}
                loader={
                  <Row justify="center">
                    <Spin indicator={<LoadingSpinner type="bottom" spin />} />
                  </Row>
                }
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
                <div>
                  {clubData.image_cover ? (
                    <ClubPhoto
                      draggable={false}
                      src={`${process.env.IMAGE_URL_PREFIX}club-interest/${
                        clubData.interest_id
                      }/${clubData.image_cover}`}
                    />
                  ) : (
                    <NoImagePlaceholder align="middle" justify="center">
                      <Col align="middle">
                        <PictureOutlined
                          style={{ fontSize: '90px', color: Colors.pureWhite }}
                        />
                        <div className="h3 white-text">No Image Available</div>
                      </Col>
                    </NoImagePlaceholder>
                  )}
                  <ClubInfoSection className="white-text">
                    <Row justify="space-between" align="middle">
                      <Row align="middle">
                        <ClubAvatarComponent
                          isMember={clubData.is_club_member || 0}
                          totalActivities={totalActivitiesDone}
                          iconName={clubData.icon_name || 'running'}
                        />
                        <ClubInfo className="darkGrey-text">
                          <p className="bodyBold cyan-text">
                            {`${getCurrentRankName(
                              clubData.is_club_member || 0,
                              totalActivitiesDone,
                            )}`}
                          </p>
                          <p className="captionBold">
                            {`Completed ${totalActivitiesDone} Activities`}
                          </p>
                        </ClubInfo>
                      </Row>
                      {clubData.is_club_member ? (
                        <LeaveButton
                          align="middle"
                          className="bodyBold darkGrey-text"
                          onClick={() => setLeaveModalVisible(true)}
                        >
                          <ParticipationIcon>
                            <img src={Images.tickIcon} alt="Participation" />
                          </ParticipationIcon>
                          Joined
                        </LeaveButton>
                      ) : (
                        <ParticipateButton
                          className="bodyBold white-text"
                          onClick={() => {
                            updateClubMembership('join');
                          }}
                        >
                          Join Club
                        </ParticipateButton>
                      )}
                    </Row>
                  </ClubInfoSection>
                  <Content className="white-text">
                    <p className="h2">{clubData.interest_name}</p>
                    <Description
                      className="body white-text"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(clubData.html_content),
                      }}
                    />
                    <Row justify="space-around">
                      <Details className="bodyBold white-text">
                        <img
                          src={Images.navigation.challengeIcon}
                          alt="challenge"
                        />
                        {totalRelatedActivities} Activities
                      </Details>
                      <Details className="bodyBold white-text">
                        <img
                          src={Images.navigation.activityIcon}
                          alt="challenge"
                        />
                        {clubData.related_posts_count || 0} Posts
                      </Details>
                      <Details className="bodyBold white-text">
                        <img src={Images.navigation.clubIcon} alt="challenge" />
                        {clubData.members_count || 0} Members
                      </Details>
                    </Row>
                  </Content>
                  <ActivityFeedList />
                </div>
                <ConfirmationPopupComponent
                  visibility={leaveModalVisible}
                  dismissModal={() => setLeaveModalVisible(false)}
                  title="Leave Club"
                  message="Do you wish to leave this club ?"
                  leftAction={() => {
                    updateClubMembership('leave');
                    setLeaveModalVisible(false);
                  }}
                  rightAction={() => setLeaveModalVisible(false)}
                />
              </ScrollList>
            ) : (
              <Row justify="center">
                <Spin indicator={<LoadingSpinner spin />} />
              </Row>
            )}
          </PageWrapperStyled>
        </NavigationWrapperComponent>
      </div>
    </div>
  );
}

ClubDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  clubDetailsPage: makeSelectClubDetailsPage(),
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
)(ClubDetailsPage);
