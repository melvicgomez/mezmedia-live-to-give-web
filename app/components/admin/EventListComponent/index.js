/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * EventListComponent
 *
 */

import React, { useEffect, useState, useRef } from 'react';
// import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import axiosInstance from 'services';
import { Row, Spin, Col } from 'antd';
import {
  LoadingOutlined,
  UserOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { Images } from 'images/index';
import { Colors } from 'theme/colors';
import moment from 'moment';
import getRemainingDay, { getRemainingDayNonUtc } from 'utils/getRemainingDay';
import ClubAvatarComponent from 'components/ClubAvatarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import BcoinValueComponent from 'components/BcoinValueComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
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

const ActivityPhoto = styled.img`
  height: 428px;
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
  -khtml-user-select: none;
  -o-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const NoImagePlaceholder = styled(Row)`
  height: 359px;
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: 3px solid ${Colors.pureWhite};
`;

const ActivityInfoSection = styled.div`
  width: 100%;
  padding: 15px 20px;
  background-color: ${Colors.pureWhite};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;

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

const ActivityTypeIcon = styled.img`
  width: 42px;
  height: 36px;
  object-fit: contain;
  margin-right: 5px;
`;

const Content = styled.div`
  margin: 20px 0px 5px;

  > p {
    margin-bottom: 15px;
  }
`;

const ParticipantsInfo = styled(Row)`
  margin-top: 15px;
  > div > p {
    margin-left: 5px;
  }
`;

const Description = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;

  ${props =>
    props.line === 4 &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    `}
`;

const ReadHideIndicator = styled.div`
  line-height: 22px;
  margin-top: 10px;
  padding: 0px;
  background-color: ${Colors.pureWhite};
  cursor: pointer;
  display: inline-block;
`;

const LabelBar = styled(Row)`
  position: absolute;
  width: 100%;
  bottom: 15px;
  padding-right: 15px;
`;

const Label = styled.div`
  border-radius: 16px;
  margin-left: 15px;
  background-color: ${props =>
    props.type === 'duration'
      ? Colors.digital
      : props.type === 'team'
      ? Colors.grapefruit
      : props.type === 'individual'
      ? Colors.darkGreyText
      : Colors.positive};
  padding: 5px 15px;
`;

function EventListComponent({ match, type }) {
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
          `api/admin/${
            type === 'challenge'
              ? 'users-get-challenges'
              : type === 'lives'
              ? 'users-get-live-sessions'
              : 'users-get-meetups'
          }?page=${page}&per_page=20&user_id=${match.params.id}`,
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

  const InterestFeedCard = ({ feed, clubInterest }) => {
    const [eventId, setEventId] = useState(0);

    const desc = useRef();
    const [textShown, setTextShown] = useState(false); // To show ur remaining Text
    const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

    const [imgError, setImgError] = useState(false); // handle img crash
    const [quitModalVisible, setQuitModalVisible] = useState(false);

    useEffect(() => {
      if (type === 'challenge') {
        setEventId(feed.challenge_id);
      } else if (type === 'lives') {
        setEventId(feed.live_id);
      } else if (type === 'meetup') {
        setEventId(feed.meetup_id);
      }
    }, [feed]);

    const event = {
      challenge: {
        icon: Images.navigation.challengeIcon,
        imageLinkPrefix: `${process.env.IMAGE_URL_PREFIX}challenge`,
      },
      lives: {
        icon: Images.navigation.liveIcon,
        imageLinkPrefix: `${process.env.IMAGE_URL_PREFIX}live-session`,
      },
      meetup: {
        icon: Images.navigation.meetupIcon,
        imageLinkPrefix: `${process.env.IMAGE_URL_PREFIX}meetup`,
      },
    };

    useEffect(() => {
      const lineHeight = 22;
      const lines = Math.round(desc.current.clientHeight / lineHeight);
      setLengthMore(lines > 4);
    }, []);

    const quit = () => {
      axiosInstance
        .post('api/admin/all-challenges/quit', {
          challenge_id: eventId,
          user_id: match.params.id,
        })
        .then(() => {
          setQuitModalVisible(false);
          getFeeds(true);
        })
        .catch(() => {
          setQuitModalVisible(false);
        });
    };

    return (
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative' }}>
          {feed.image_cover && !imgError ? (
            <ActivityPhoto
              draggable="false"
              src={`${event[type].imageLinkPrefix}/${eventId}/${
                feed.image_cover
              }`}
              onError={() => setImgError(true)}
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
          {type === 'challenge' && (
            <LabelBar justify="end">
              {!!feed.duration && (
                <Label type="duration" className="white-text bodyBold">
                  {feed.duration}
                </Label>
              )}
              <Label
                type={feed.is_team_challenge ? 'team' : 'individual'}
                className="white-text bodyBold"
              >
                {feed.is_team_challenge ? 'Team' : 'Individual'}
              </Label>
            </LabelBar>
          )}
        </div>
        {feed.bcoin_reward > 0 && (
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <BcoinValueComponent bcoinValue={feed.bcoin_reward} />
          </div>
        )}
        <ActivityInfoSection className="white-text">
          <Row justify="space-between" align="middle">
            <Row align="middle">
              <ClubAvatarComponent
                isMember={clubInterest.is_club_member}
                totalActivities={
                  clubInterest.challenges_done_count +
                  clubInterest.meetups_done_count +
                  clubInterest.live_session_done_count
                }
                iconName={clubInterest.icon_name}
              />
              <ClubInfo className="darkGrey-text">
                <p className="bodyBold cyan-text">
                  {clubInterest.interest_name}
                </p>
                <p className="captionBold">
                  {type === 'challenge'
                    ? `${moment(feed.started_at).format(
                        'DD MMM YYYY',
                      )} - ${moment(feed.ended_at).format('DD MMM YYYY')}`
                    : `${moment
                        .utc(feed.started_at)
                        .local()
                        .format('DD MMM YYYY')}`}
                </p>
                <p className="captionBold">
                  {type === 'challenge'
                    ? getRemainingDayNonUtc(feed.started_at, feed.ended_at)
                    : getRemainingDay(feed.started_at, feed.ended_at)}
                </p>
              </ClubInfo>
            </Row>
            <ActivityTypeIcon src={event[type].icon} />
          </Row>
          <Content className="darkGrey-text">
            <p className="h3">{feed.title}</p>
            {lengthMore ? (
              <>
                <Description
                  ref={desc}
                  className="body"
                  line={textShown ? 0 : 4}
                >
                  {feed.description}
                </Description>
                <ReadHideIndicator
                  className="bodyLink"
                  onClick={e => {
                    e.stopPropagation();
                    setTextShown(!textShown);
                  }}
                >
                  {textShown ? 'Hide' : 'Read More'}
                </ReadHideIndicator>
              </>
            ) : (
              <Description ref={desc} className="body">
                {feed.description}
              </Description>
            )}
            <ParticipantsInfo justify="space-between" align="middle">
              <Row align="middle">
                <UserOutlined
                  className="digitalBlue-text"
                  style={{ fontSize: '15px' }}
                />
                <p className="bodyBold digitalBlue-text">
                  {type === 'challenge'
                    ? `${feed.participants_count} Participants`
                    : `${feed.slots - feed.participants_count} Slots Remaining`}
                </p>
              </Row>
              {/* {isParticipating && (
                <ParticipationIcon
                  isEnded={
                    type === 'challenge'
                      ? getRemainingDayNonUtc(
                          feed.started_at,
                          feed.ended_at,
                        ) === 'Ended'
                      : getRemainingDay(feed.started_at, feed.ended_at) ===
                        'Ended'
                  }
                >
                  <img src={Images.tickIcon} alt="Participation" />
                </ParticipationIcon>
              )} */}
              {type === 'challenge' &&
                getRemainingDayNonUtc(feed.started_at, feed.ended_at) !==
                  'Ended' && (
                  <PrimaryButtonComponent
                    style={{
                      padding: '0px 20px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    label="Quit"
                    onClick={() => setQuitModalVisible(true)}
                    iconRight={false}
                  />
                )}
            </ParticipantsInfo>
            <ConfirmationPopupComponent
              visibility={quitModalVisible}
              dismissModal={() => setQuitModalVisible(false)}
              title="Quit Challenge"
              message="The user will quit this challenge and no longer be a participant. All the user's submission entries and scores will be removed and reset to zero. This cannot be undone. Please confirm that you would like to remove the user from this challenge."
              leftAction={quit}
              rightAction={() => setQuitModalVisible(false)}
            />
          </Content>
        </ActivityInfoSection>
      </div>
    );
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
                  <b>
                    This user is not participating in any{' '}
                    {type === 'challenge'
                      ? 'Challenges'
                      : type === 'lives'
                      ? 'Live Sessions'
                      : 'Meetups'}{' '}
                    yet.
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
            {feeds.map((feed, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i}>
                {i === isPastIndex && (
                  <div
                    className="h2 white-text"
                    style={{ marginBottom: '20px' }}
                  >
                    Past Challenges
                  </div>
                )}
                <div>
                  <InterestFeedCard
                    feed={{
                      ...feed,
                      participants_count: feed.participants_count,
                      is_joined_challenge: feed.is_joined_challenge,
                    }}
                    clubInterest={feed.club_interest}
                  />
                </div>
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

EventListComponent.propTypes = {};

export default EventListComponent;
