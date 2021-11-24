/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-lonely-if */
/**
 *
 * LiveSessionDetailsPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import qs from 'query-string';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import axiosInstance from 'services';
import { compose } from 'redux';
import styled, { css } from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import ContentPageDescription from 'components/ContentPageDescription';
import UserPostCardComponent from 'components/UserPostCardComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import CreatePostFormComponent from 'components/CreatePostFormComponent';
import ParticipantListComponent from 'components/ParticipantListComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoPlayerModalComponent from 'components/VideoPlayerModalComponent';
import { Row, Col, Spin, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import makeSelectLiveSessionDetailsPage from './selectors';
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

const QuitButton = styled.div`
  margin: 15px 0px 10px;
  cursor: pointer;
`;

const MakePostStrip = styled.div`
  padding: 10px 20px 20px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin: 10px 0px 15px;
`;

const WritePost = styled(Row)`
  width: 100%;
  margin-top: 20px;
`;

const CommentInput = styled(Row)`
  border-radius: 16px;
  border: 2px solid ${Colors.mediumGray};
  margin-left: 20px;
  padding-left: 20px;
  height: 46px !important;
  color: ${Colors.bodyText};
  box-shadow: inset 0px 1px 2px 0px #00000035;

  ${props =>
    props.type === 'post' &&
    css`
      cursor: pointer;
    `}

  ${props =>
    props.type === 'code' &&
    css`
      background-color: ${Colors.pureWhite};
      padding: 0px 20px;
      margin: 20px 20px 5px;

      > .ant-input {
        text-align: center;

        ::placeholder {
          opacity: 1 !important;
          color: ${Colors.black};
        }
      }
    `}

  ${props =>
    props.type === 'create' &&
    css`
      background-color: ${Colors.background};
      border: 2px solid ${Colors.pureWhite};
      padding: 0px 15px;
      margin: 20px 20px 10px;
      height: auto;
      width: 334px;

      > .ant-input {
        text-align: center;
        color: ${Colors.pureWhite};

        ::placeholder {
          opacity: 1 !important;
          color: ${Colors.pureWhite};
        }
      }
    `}
`;

const ParticipationStrip = styled.div`
  padding: 20px 50px 20px 30px;
  background-color: ${props =>
    props.isEnded
      ? Colors.mediumGray
      : props.single
      ? Colors.redHeart
      : Colors.grapefruit};
  color: ${props => (props.isEnded ? Colors.bodyText : Colors.pureWhite)};
  border-radius: 16px;
`;

const ParticipationIcon = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 24px;
  background-color: ${Colors.positive};
  box-shadow: 0px 2px 2px 0px ${Colors.shadow};
  opacity: ${props => (props.completed ? 1 : 0.5)};
  padding: 4px;

  > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const LiveDetailStrip = styled.div`
  margin: 15px 0px 10px;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${props =>
    props.ended ? Colors.bodyText : Colors.digital};

  > div {
    padding: 15px 30px;

    :first-child {
      background-color: ${props =>
        props.ended ? Colors.bodyText : Colors.primary};
      height: 60px;
    }
  }

  > .details > div {
    margin-bottom: 15px;
    white-space: pre-line;
    word-wrap: break-word;
  }
`;

const RecordingLink = styled(Row)`
  margin-bottom: 10px !important;
  cursor: pointer;

  > img {
    height: 30px;
    width: 30px;
    margin-right: 10px;
  }
`;

const AddButton = styled(Row)`
  background-color: ${Colors.primary};
  height: 45px;
  width: 45px;
  border-radius: 50px;
  padding: 10px;
`;

const CalendarIcon = styled.img`
  height: 100%;
  width: 100%;
`;

const PopupModel = styled(Modal)`
  background-color: ${Colors.pureWhite} !important;
  border-radius: 16px;
  padding: 15px 0px 5px;
  overflow: hidden;
  margin: 20px 0px;
  width: 320px !important;

  > div {
    background-color: ${Colors.pureWhite};
  }

  > .ant-modal-content {
    box-shadow: none;
    padding: 0px 40px;

    > button {
      color: ${Colors.bodyText};
      top: -18px;
      right: 0px;
    }
  }

  .error-messages {
    background: ${Colors.white};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.3);
    margin-bottom: 10px;
    display: flex;
    margin-top: 25px;
  }

  .link {
    color: ${Colors.bodyText};
    padding: 12px;
    width: 250px;
    border-bottom: 1px solid ${Colors.mediumGray};
    text-align: center;

    :last-child {
      border-bottom: none;
    }
  }

  .link-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .header {
    padding: 10px 10px 20px;
    text-align: center;
  }
`;

const AddToCalendarWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 13px;
  margin-bottom: -13px;
`;

export function LiveSessionDetailsPage({ match, location }) {
  useInjectReducer({ key: 'liveSessionDetailsPage', reducer });
  useInjectSaga({ key: 'liveSessionDetailsPage', saga });

  const user = reactLocalStorage.getObject('user');

  const liveId = match.params.id;

  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isParticipate, setIsParticipate] = useState(false);
  const [isShowDesc, setIsShowDesc] = useState(true); // hide or show description
  const [status, setStatus] = useState('PARTICIPATED');
  const [isEnded, setIsEnded] = useState(false);
  const [videoModalVisibility, setVideoModalVisibility] = useState(false);

  // load activity feed
  const [feeds, setFeeds] = useState([]);
  const [loadFeeds, setLoadFeeds] = useState(true);
  const [feedNextPage, setFeedNextPage] = useState(true);
  const [feedPageNum, setFeedPageNum] = useState(1);

  // load participant
  const [participants, setParticipants] = useState({
    favorite_users: [],
    participants: [],
  });
  const [loadParticipant, setLoadParticipant] = useState(true);
  const [participantNextPage, setParticipantNextPage] = useState(true);
  const [participantPageNum, setParticipantPageNum] = useState(1);

  const [quitModalVisible, setQuitModalVisible] = useState(false);
  const [participateModalVisible, setParticipateModalVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  let currentSearch = '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const qsParams = qs.parse(location.search);
    currentSearch = qsParams.search || '';
    refreshList();
  }, [location.search]);

  useEffect(() => {
    getFeeds();
    getLiveSessionData();
  }, []);

  const getLiveSessionData = () => {
    axiosInstance
      .get(`api/live-session/${liveId}?user_id=${user.user_id}`)
      .then(res => {
        const details = res.data.data;
        setLiveData(details);
        setIsParticipate(!!details.is_joined_live_session);
        setIsShowDesc(!details.is_joined_live_session);
        setIsEnded(
          moment().isSameOrAfter(moment.utc(details.ended_at).local()),
        );
        setStatus(
          details.is_joined_live_session && details.participant
            ? details.participant.status
            : 'PARTICIPATED',
        );
        getParticipants(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getFeeds = (reload = false) => {
    if (reload) {
      axiosInstance
        .get(
          `api/activity-feed?page=1&per_page=20&live_id=${liveId}&user_id=${
            user.user_id
          }`,
        )
        .then(res => {
          const feedList = res.data.data;
          setFeeds(feedList);
          if (res.data.next_page_url) {
            setFeedPageNum(2);
            setFeedNextPage(true);
            setLoadFeeds(true);
          } else {
            setFeedPageNum(1);
            setFeedNextPage(false);
            setLoadFeeds(false);
          }
        })
        .catch(() => {
          setLoadFeeds(false);
        });
    } else {
      if (feedNextPage) {
        axiosInstance
          .get(
            `api/activity-feed?page=${feedPageNum}&per_page=20&live_id=${liveId}&user_id=${
              user.user_id
            }`,
          )
          .then(res => {
            const feedList = feeds.concat(res.data.data);
            setFeeds(feedList);
            if (res.data.next_page_url) {
              setFeedPageNum(feedPageNum + 1);
              setFeedNextPage(true);
              setLoadFeeds(true);
            } else {
              setFeedNextPage(false);
              setLoadFeeds(false);
            }
          })
          .catch(() => {
            setLoadFeeds(false);
          });
      }
    }
  };

  const getParticipants = (refresh = false) => {
    const hasMore = refresh ? true : participantNextPage;
    const page = refresh ? 1 : participantPageNum;

    if (hasMore) {
      axiosInstance
        .get(
          `api/live-session/participants/${liveId}?page=${page}&search=${currentSearch}`,
        )
        .then(res => {
          const participantList = refresh
            ? res.data.data
            : participants.participants.concat(res.data.data);
          setParticipants({
            favorite_users: res.data.favorite_users || [],
            participants: participantList,
          });
          if (res.data.next_page_url) {
            setParticipantPageNum(page + 1);
            setParticipantNextPage(true);
            setLoadParticipant(true);
          } else {
            setParticipantPageNum(page);
            setParticipantNextPage(false);
            setLoadParticipant(false);
          }
        })
        .catch(() => {
          setLoadParticipant(false);
        });
    }
  };

  const refreshList = () => {
    getLiveSessionData();
    getFeeds(true);
  };

  const joinEvent = () => {
    axiosInstance
      .put(`api/live-session/participant/${liveId}/join`, null)
      .then(() => {
        setIsParticipate(true);
        setIsShowDesc(false);

        window.scrollTo(0, 0);

        setParticipateModalVisible(true);
      });
  };

  const leaveEvent = () => {
    axiosInstance
      .put(`api/live-session/participant/${liveId}/leave`, null)
      .then(() => {
        setIsParticipate(false);
        setIsShowDesc(true);
        setQuitModalVisible(false);

        const data = { ...liveData };
        data.participants_count -= 1;
        data.is_joined_live_session = 0;
        setLiveData(data);
        getParticipants(true);
      });
  };

  const updateStatus = () => {
    axiosInstance
      .post('api/live-session/join-room-link', {
        participant_id: liveData.participant.participant_id,
      })
      .then(res => {
        liveData.participant.status = res.data.status;
        setStatus(res.data.status);
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
          const newFeedList = feeds.filter(feed => feed.feed_id !== id);
          setFeeds(newFeedList);
        });
    } else {
      axiosInstance.delete(`api/activity-feed/${id}`).then(() => {
        const newFeedList = feeds.filter(feed => feed.feed_id !== id);
        setFeeds(newFeedList);
      });
    }
  };

  const ActivityFeedList = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <>
        <MakePostStrip className="h3 cyan-text">
          Activity Feed
          <WritePost>
            <Col flex="none">
              <UserAvatarComponent user={user} />
            </Col>
            <Col flex="auto">
              <CommentInput
                type="post"
                align="middle"
                onClick={() => setModalVisible(true)}
              >
                Make a post...
              </CommentInput>
            </Col>
          </WritePost>
        </MakePostStrip>
        {feeds.map((feed, index) => (
          <div key={index}>
            <UserPostCardComponent feed={feed} actionOnFeed={actionOnFeed} />
            <div style={{ height: '15px' }} />
          </div>
        ))}
        {loadFeeds && (
          <Row justify="center" style={{ height: '50px' }}>
            <Spin indicator={<LoadingSpinner spin small={1} />} />
          </Row>
        )}
        <CreatePostFormComponent
          modalVisible={modalVisible}
          dismissModal={() => {
            getFeeds(true);
            setModalVisible(false);
          }}
          type="lives"
          data={liveData}
        />
      </>
    );
  };

  const CalendarModal = () => {
    const downloadIcs = () => {
      const url = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `URL:${document.URL}`,
        'METHOD:PUBLISH',
        `DTSTART:${moment
          .utc(liveData.started_at)
          .format('YYYYMMDDTHHmmss[Z]')}`,
        `DTEND:${moment.utc(liveData.ended_at).format('YYYYMMDDTHHmmss[Z]')}`,
        `SUMMARY:${liveData.title}`,
        `DESCRIPTION:${
          liveData.virtual_room_link
            ? liveData.virtual_room_link.replace(/(\r?\n|<br ?\/?>)/g, '\\n')
            : ''
        }`,
        `LOCATION:`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\n');

      const filename = liveData ? `${liveData.title}.ics` : 'download.ics';
      const blob = new Blob([url], { type: 'text/calendar;charset=utf-8' });

      if (window.navigator.msSaveOrOpenBlob && window.Blob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return (
      <PopupModel
        centered
        visible={calendarModalVisible}
        onCancel={() => setCalendarModalVisible(false)}
        className="bodyBold"
        style={{ backgroundColor: Colors.background }}
        footer={null}
      >
        <p className="h3 cyan-text header">Add to Calendar</p>
        <div className="link-wrapper h3">
          <a className="link" onClick={downloadIcs}>
            Barclays Outlook (.ics)
          </a>
          <a
            className="link"
            target="_blank"
            href={
              liveData
                ? `https://outlook.office.com/calendar/0/deeplink/compose?rru=addevent&path=/calendar/action/compose&startdt=${moment(
                    liveData.started_at,
                  ).format('YYYY-MM-DDTHH:mm:ss[Z]')}&enddt=${moment(
                    liveData.ended_at,
                  ).format('YYYY-MM-DDTHH:mm:ss[Z]')}&subject=${
                    liveData.title
                  }${!!liveData.virtual_room_link &&
                    `&body=${encodeURIComponent(
                      liveData.virtual_room_link,
                    )}`}&allday=false&uid=123&path=/calendar/view/Month`
                : '/'
            }
          >
            Office 365
          </a>
          <a
            className="link"
            target="_blank"
            href={
              liveData
                ? `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${moment(
                    liveData.started_at,
                  ).format('YYYYMMDDTHHmmss[Z]')}/${moment(
                    liveData.ended_at,
                  ).format('YYYYMMDDTHHmmss[Z]')}&text=${liveData.title.replace(
                    ' ',
                    '%20',
                  )}${!!liveData.virtual_room_link &&
                    `&details=${encodeURIComponent(
                      liveData.virtual_room_link,
                    )}`}`
                : '/'
            }
          >
            Google
          </a>
          <a
            className="link"
            target="_blank"
            href={
              liveData
                ? `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${liveData.title.replace(
                    ' ',
                    '%20',
                  )}&st=${moment
                    .utc(liveData.started_at)
                    .local()
                    .format('YYYYMMDDTHHmmss')}&et=${moment
                    .utc(liveData.ended_at)
                    .local()
                    .format('YYYYMMDDTHHmmss')}${!!liveData.virtual_room_link &&
                    `&desc=${encodeURIComponent(liveData.virtual_room_link)}`}`
                : '/'
            }
          >
            Yahoo
          </a>
        </div>
      </PopupModel>
    );
  };

  return (
    <div>
      <Helmet>
        <title>Live Session Details - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        match={match}
        location={location}
        rightContent={
          <div>
            <ParticipantListComponent
              type="lives"
              participants={participants}
              loadParticipant={loadParticipant}
              hasNextPage={participantNextPage}
              data={liveData || {}}
              getMoreParticipant={getParticipants}
              location={location}
              refreshList={refreshList}
            />
          </div>
        }
      >
        <PageWrapperStyled className="white-text">
          {!loading ? (
            <ScrollList
              dataLength={feeds.length}
              next={getFeeds}
              hasMore={feedNextPage}
              loader={
                <Spin indicator={<LoadingSpinner type="bottom" spin />} />
              }
              refreshFunction={refreshList}
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
                <ContentPageDescription
                  data={liveData}
                  type="lives"
                  participate={joinEvent}
                  isParticipate={isParticipate}
                  isShowDesc={isShowDesc}
                  toggleShowDesc={() => setIsShowDesc(!isShowDesc)}
                />
                {!!liveData.is_joined_live_session && (
                  <>
                    <ParticipationStrip className="bodyBold" isEnded={isEnded}>
                      <Row align="middle">
                        <ParticipationIcon
                          className="bodyBold"
                          isEnded={isEnded}
                          completed={status === 'DONE'}
                        >
                          <img src={Images.tickIcon} alt="Participation" />
                        </ParticipationIcon>
                        {status !== 'DONE'
                          ? 'Fantastic! You’ve signed up for this activity.'
                          : 'Awesome! You’ve completed this activity.'}
                      </Row>
                    </ParticipationStrip>
                    <LiveDetailStrip
                      ended={isEnded ? 1 : 0}
                      className="white-text"
                    >
                      <Row align="middle" className="h3">
                        {`${moment
                          .utc(liveData.started_at)
                          .local()
                          .format('D MMM YYYY hh:mma')} - ${moment
                          .utc(liveData.ended_at)
                          .local()
                          .format('hh:mma')}`}
                      </Row>
                      <div className="details">
                        <div>
                          <div className="bodyBold">
                            Host: {liveData.host_name}
                          </div>
                          <div className="body">
                            Contact: {liveData.host_email}
                          </div>
                        </div>
                        <div>
                          <div className="bodyBold">Additional Details:</div>
                          <div className="body">
                            {liveData.additional_details}
                          </div>
                        </div>

                        <VideoPlayerModalComponent
                          videoLink={liveData.recording_link}
                          visibility={videoModalVisibility}
                          onDismiss={() => {
                            setVideoModalVisibility(false);
                          }}
                        />

                        {!isEnded ? (
                          <Row justify="space-between">
                            <PrimaryButtonComponent
                              style={{ margin: '15px 0px 10px' }}
                              label={
                                moment().isBefore(
                                  moment
                                    .utc(liveData.started_at)
                                    .local()
                                    .subtract(1, 'hours'),
                                ) || liveData.virtual_room_link === null
                                  ? 'Coming Soon'
                                  : 'Join the Live Session'
                              }
                              onClick={() => {
                                if (
                                  liveData.virtual_room_link &&
                                  moment().isSameOrAfter(
                                    moment
                                      .utc(liveData.started_at)
                                      .local()
                                      .subtract(1, 'hours'),
                                  )
                                ) {
                                  updateStatus();
                                  window.open(liveData.virtual_room_link);
                                }
                              }}
                              disabled={
                                moment().isBefore(
                                  moment
                                    .utc(liveData.started_at)
                                    .local()
                                    .subtract(1, 'hours'),
                                ) || liveData.virtual_room_link === null
                              }
                            />
                            <AddToCalendarWrapper>
                              <AddButton
                                style={{ cursor: 'pointer' }}
                                onClick={() => setCalendarModalVisible(true)}
                              >
                                <CalendarIcon src={Images.calendarIcon} />
                              </AddButton>
                              <div
                                className="bodyBold white-text"
                                style={{ marginTop: '5px' }}
                              >
                                Add to Calendar
                              </div>
                              <CalendarModal />
                            </AddToCalendarWrapper>
                          </Row>
                        ) : liveData.recording_link ? (
                          <RecordingLink
                            align="middle"
                            onClick={() => {
                              // window.open(liveData.recording_link);
                              setVideoModalVisibility(true);
                            }}
                          >
                            <img
                              src={Images.viewRecordingIcon}
                              alt="recording"
                            />
                            View the recording of this Live Session
                          </RecordingLink>
                        ) : null}
                      </div>
                    </LiveDetailStrip>
                    <Row>
                      <QuitButton
                        className="bodyLink white-text"
                        onClick={() => setQuitModalVisible(true)}
                      >
                        Quit this Live Session
                      </QuitButton>
                    </Row>
                  </>
                )}
                <ConfirmationPopupComponent
                  visibility={quitModalVisible}
                  dismissModal={() => setQuitModalVisible(false)}
                  title="Quit Live Session"
                  message="You are quitting this Live Session and will no longer be a participant. Please confirm that you would like to quit this Live Session."
                  note="Note: if you’re quitting a Live Session with limited availability, your slot will be released to another participant. Should you wish to re-register, we cannot guarantee your slot will still be available."
                  leftAction={leaveEvent}
                  rightAction={() => setQuitModalVisible(false)}
                />
                <ActivityFeedList />
                <ConfirmationPopupComponent
                  visibility={participateModalVisible}
                  dismissModal={() => {
                    getParticipants(true);
                    getLiveSessionData();
                    setParticipateModalVisible(false);
                  }}
                  title="Fantastic!"
                  message="You’ve signed up for this activity!"
                  actionRequire={false}
                />
              </div>
            </ScrollList>
          ) : (
            <Row justify="center">
              <Spin indicator={<LoadingSpinner spin />} />
            </Row>
          )}
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

// LiveSessionDetailsPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  liveSessionDetailsPage: makeSelectLiveSessionDetailsPage(),
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
)(LiveSessionDetailsPage);
