/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
/**
 *
 * ChallengeDetailsPage
 *
 */

/*
  TODO: submit entry
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import qs from 'query-string';
import { createStructuredSelector } from 'reselect';
import axiosInstance from 'services';
import { compose } from 'redux';
import styled, { css } from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import ContentPageDescription from 'components/ContentPageDescription';
import UserPostCardComponent from 'components/UserPostCardComponent';
// import UserAvatarComponent from 'components/UserAvatarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import ParticipantListComponent from 'components/ParticipantListComponent';
import CreatePostFormComponent from 'components/CreatePostFormComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Row, Col, Spin, Input, Modal } from 'antd';
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { getRemainingDayNonUtc } from 'utils/getRemainingDay';
import makeSelectChallengeDetailsPage from './selectors';
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

const ProgressBar = styled.div`
  height: 14px;
  width: 100%;
  background-color: ${props =>
    props.isEnded ? Colors.pureWhite : Colors.mediumGray};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 2px 2px 0px ${Colors.shadow};
  margin-bottom: 8px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${props =>
    props.isEnded ? Colors.bodyText : Colors.positive};
  border-radius: 16px;
  width: ${props => props.width};
`;

const QuitButton = styled.div`
  margin: 15px 0px 10px;
  cursor: pointer;
`;

const MakePostStrip = styled.div`
  padding: 10px 20px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin: 10px 0px 15px;
`;

// const WritePost = styled(Row)`
//   width: 100%;
//   margin-top: 20px;
//   margin-bottom: 10px;
// `;

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
      padding: 0px 10px;
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

const TeamIcon = styled.img`
  height: 30px;
  width: 30px;
  margin-right: 8px;
`;

const JoinTeamSection = styled.div`
  margin: 10px 0px 30px;

  .create-team {
    padding: 0px 20px 0px 0px;
    margin-bottom: 10px;
    border-right: 1px solid ${Colors.pureWhite};
  }

  .join-team {
    margin-bottom: 10px;
    padding: 0px 0px 0px 20px;
  }

  > div:first-child {
    margin-bottom: 10px;
  }
`;

const Checkbox = styled(Row)`
  cursor: pointer;
  border: 2px solid ${props => (props.error ? Colors.error : Colors.pureWhite)};
  border-radius: 8px;
  height: 29px;
  min-width: 29px;
  margin: 0px 10px;
  background-color: ${Colors.textInput};
`;

const PopupModel = styled(Modal)`
  background-color: ${Colors.background};
  border-radius: 16px;
  padding-bottom: 0px;
  padding-top: 30px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.background};
  }

  > .ant-modal-content {
    box-shadow: 0px;
    padding-bottom: 30px;

    > button {
      color: ${Colors.pureWhite};
      top: -30px;
    }
  }
`;

const TeamDetailStrip = styled.div`
  margin: 15px 0px 20px;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${Colors.digital};

  > div {
    padding: 10px 10px 10px 30px;

    > div > div {
      margin: 15px 0px;
    }

    .card-icon {
      margin-right: 7px;
      min-width: 27px;
    }

    :first-child {
      background-color: ${Colors.primary};
      height: 60px;
    }
  }
`;

const InfoButton = styled.div`
  margin-right: 10px;
  border-radius: 50px;
  width: 14px;
  height: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  align-self: flex-start;
  justify-content: center;
  cursor: pointer;

  > img {
    height: 20px;
    width: 15px;
    object-fit: contain;
  }
`;

const TeamCode = styled(Col)`
  text-align: center;

  > div:first-child {
    margin: 15px 0px 0px;
  }

  > div:nth-child(2) {
    display: inline-flex;
    background-color: ${Colors.pureWhite};
    height: 46px;
    padding: 0px 20px;
    border-radius: 16px;
    margin: 5px 0px;
    border: 2px solid ${Colors.mediumGray};
  }

  > div:last-child {
    margin: 0px 0px 15px;
  }
`;

export function ChallengeDetailsPage({ match, location }) {
  useInjectReducer({ key: 'challengeDetailsPage', reducer });
  useInjectSaga({ key: 'challengeDetailsPage', saga });

  const user = reactLocalStorage.getObject('user');

  const challengeId = match.params.id;

  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isParticipate, setIsParticipate] = useState(false);
  const [isShowDesc, setIsShowDesc] = useState(true); // hide or show description

  const [isEnded, setIsEnded] = useState(false);

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

  // load team
  const [teams, setTeams] = useState({ favorite_users: [], teams: [] });
  const [loadTeam, setLoadTeam] = useState(true);

  const [quitModalVisible, setQuitModalVisible] = useState(false);
  const [participateModalVisible, setParticipateModalVisible] = useState(false);

  const [joinedTeamDetails, setJoinedTeamDetails] = useState(null);
  const [joinTeamModalVisible, setJoinTeamModalVisible] = useState(false);

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
    getChallengeData();
  }, []);

  const getChallengeData = () => {
    axiosInstance
      .get(`api/challenge/${challengeId}?user_id=${user.user_id}`)
      .then(res => {
        const details = res.data.data;
        setChallengeData(details);
        setIsParticipate(!!details.is_joined_challenge);
        setIsShowDesc(!details.is_joined_challenge);
        setIsEnded(
          moment().isSameOrAfter(moment.utc(details.ended_at).local()),
        );
        getParticipants();
        if (res.data.data.is_team_challenge) {
          getTeams();
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getFeeds = (reload = false) => {
    const hasMore = reload ? true : feedNextPage;
    const page = reload ? 1 : feedPageNum;

    if (hasMore) {
      axiosInstance
        .get(
          `api/activity-feed?page=${feedPageNum}&per_page=20&challenge_id=${challengeId}&user_id=${
            user.user_id
          }`,
        )
        .then(res => {
          const feedList = reload ? res.data.data : feeds.concat(res.data.data);
          setFeeds(feedList);
          if (res.data.next_page_url) {
            setFeedPageNum(page + 1);
            setFeedNextPage(true);
            setLoadFeeds(true);
          } else {
            setFeedPageNum(page);
            setFeedNextPage(false);
            setLoadFeeds(false);
          }
        })
        .catch(() => {
          setLoadFeeds(false);
        });
    }
  };

  const getTeams = () => {
    axiosInstance
      .get(
        `api/challenge/participants/${challengeId}?is_team=1&search=${currentSearch}`,
      )
      .then(res => {
        setTeams({
          favorite_users: res.data.favorite_users || [],
          teams: res.data.data,
        });
        setLoadTeam(false);
      })
      .catch(() => {
        setLoadTeam(false);
      });
  };

  const getParticipants = () => {
    axiosInstance
      .get(`api/challenge/participants/${challengeId}?search=${currentSearch}`)
      .then(res => {
        const participantList = res.data.data;
        setParticipants({
          favorite_users: res.data.favorite_users || [],
          participants: participantList,
        });
        setLoadParticipant(false);
      })
      .catch(() => {
        setLoadParticipant(false);
      });
  };

  const refreshList = () => {
    getChallengeData();
    getFeeds(true);
  };

  const joinEvent = () => {
    axiosInstance
      .put(`api/challenge/participant/${challengeData.challenge_id}/join`, null)
      .then(() => {
        setIsParticipate(true);
        setIsShowDesc(false);

        window.scrollTo(0, 0);

        setParticipateModalVisible(true);
      });
  };

  const leaveEvent = () => {
    axiosInstance
      .put(
        `api/challenge/participant/${challengeData.challenge_id}/leave`,
        null,
      )
      .then(() => {
        setIsParticipate(false);
        setIsShowDesc(true);
        setQuitModalVisible(false);

        const data = { ...challengeData };
        data.participants_count -= 1;
        data.is_joined_challenge = 0;
        setChallengeData(data);
        getParticipants();
      });
  };

  const joinTeam = team => {
    // setLoading(true);
    axiosInstance
      .post('/api/challenge-participate-team', {
        team_code: team.team_code,
        challenge_id: team.challenge_id,
        user_id: user.user_id,
        status: 'join',
      })
      .then(res => {
        setJoinedTeamDetails(res.data.data);
        setJoinTeamModalVisible(true);
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

  const getProgress = progress => {
    if (progress % 1 === 0) {
      return progress;
    } else {
      if ((parseInt(progress * 10, 10) / 10).toFixed(1) % 1 === 0) {
        return (parseInt(progress * 10, 10) / 10).toFixed(0);
      } else {
        return (parseInt(progress * 10, 10) / 10).toFixed(1);
      }
    }
  };

  const TeamChallengeContent = () => {
    const [isFocused, setIsFocues] = useState(true);

    const [teamCode, setTeamCode] = useState('');
    const [teamName, setTeamName] = useState('');
    const [error, setError] = useState({
      exists: '',
      notFound: '',
    });
    const [isPrivate, setIsPrivate] = useState(
      challengeData.participants.length && challengeData.participants[0].team
        ? challengeData.participants[0].team.is_private
        : 1,
    );

    const [modalTeamVisible, setModalTeamVisible] = useState(false);

    const [createLoading, setCreateLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [joinedDetails, setJoinedDetails] = useState(null);

    const [joinTeamLoading, setJoinTeamLoding] = useState(false);

    const progress =
      challengeData.is_joined_challenge &&
      challengeData.participants.length &&
      challengeData.participants[0].team
        ? challengeData.participants[0].team.progress
        : 0;

    const hasTeam =
      challengeData.participants.length && challengeData.participants[0].team
        ? !!challengeData.participants[0].team
        : false;

    const isLeader =
      challengeData.participants.length && challengeData.participants[0].team
        ? challengeData.participants[0].team.user_id === user.user_id
        : false;

    const createTeam = () => {
      setCreateLoading(true);
      const errorChecking = { ...error };

      axiosInstance
        .post('api/challenge-team', {
          challenge_id: challengeId,
          user_id: user.user_id,
          team_name: teamName,
          is_private: 1,
        })
        .then(() => {
          setCreateLoading(false);
          setModalVisible(false);
          getChallengeData();
        })
        .catch(err => {
          errorChecking.exists = err.data.error;
          setError(errorChecking);
          setCreateLoading(false);
        });
    };

    const updatePrivacy = () => {
      const newPrivacy = isPrivate === 0 ? 1 : 0;
      setIsPrivate(newPrivacy);

      axiosInstance
        .put(
          `api/challenge-team/${challengeData.participants[0].team.team_id}`,
          {
            is_private: newPrivacy,
          },
        )
        .then(() => {
          getTeams();
          getChallengeData();
        });
    };

    const joinTeamByCode = () => {
      setJoinTeamLoding(true);
      axiosInstance
        .post('/api/challenge-participate-team', {
          team_code: teamCode.toUpperCase(),
          challenge_id: challengeData.challenge_id,
          user_id: user.user_id,
          status: 'join',
        })
        .then(res => {
          setJoinedDetails(res.data.data);
          setJoinTeamLoding(false);
          setJoinModalVisible(true);
        })
        .catch(err => {
          const errorChecking = { ...error };
          errorChecking.notFound = err.data.error;
          setJoinTeamLoding(false);
          setError(errorChecking);
        });
    };

    return !hasTeam ? (
      <div>
        <Row className="h2" align="middle">
          <TeamIcon src={Images.teamIconBlue} />
          Teams
        </Row>
        <JoinTeamSection className="body">
          <Row justify="space-between">
            <Col span={13} className="create-team">
              <p>
                Some challenges are more fun if you’re in a team! Create a team
                and invite your friends!
              </p>
              <Row justify="center">
                <PrimaryButtonComponent
                  style={{ margin: '20px 0px 10px' }}
                  label="Create a Team"
                  onClick={() => setModalVisible(true)}
                  disabled={isEnded}
                />
              </Row>
            </Col>
            <Col span={11} className="join-team">
              <p>
                If someone has invited you to a team enter the team code beside.
              </p>
              <Row justify="center">
                <CommentInput type="code" align="middle">
                  <Input
                    value={teamCode}
                    onChange={({ target: { value } }) => {
                      setTeamCode(value);
                      error.notFound = '';
                    }}
                    placeholder={isFocused ? 'Enter a Team Code' : ''}
                    className="bodyBold"
                    style={{
                      height: '38px !important',
                      width: '168px',
                    }}
                    bordered={false}
                    maxLength={5}
                    onFocus={() => {
                      setIsFocues(false);
                    }}
                    onBlur={() => {
                      setIsFocues(true);
                    }}
                  />
                </CommentInput>
                {error.notFound && (
                  <Row justify="center" className="bodyBold error-text">
                    {error.notFound}
                  </Row>
                )}
              </Row>
              <Row justify="center">
                <PrimaryButtonComponent
                  style={{ margin: '10px 0px' }}
                  label="Submit"
                  onClick={!teamCode ? () => {} : joinTeamByCode}
                  disabled={isEnded}
                  loading={joinTeamLoading}
                />
              </Row>
            </Col>
          </Row>
          <p>If not, pick and join a Public Team from the teams beside!</p>
          <PopupModel
            className="white-text"
            centered
            visible={modalVisible}
            onOk={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
            style={{ backgroundColor: Colors.background }}
            footer={null}
          >
            <CommentInput type="create" align="middle">
              <Input
                value={teamName}
                onChange={({ target: { value } }) => {
                  setTeamName(value);
                  error.exists = false;
                }}
                placeholder="Enter your Team Name"
                className="bodyBold"
                bordered={false}
              />
            </CommentInput>
            {error.exists && (
              <Row justify="center" className="bodyBold error-text">
                {error.exists}
              </Row>
            )}
            <Row justify="center">
              <PrimaryButtonComponent
                style={{ margin: '30px 0px 0px' }}
                label="Submit"
                onClick={createTeam}
                disabled={isEnded || !teamName || !teamName.trim().length}
                loading={createLoading}
              />
            </Row>
          </PopupModel>
        </JoinTeamSection>
        {joinedDetails ? (
          <ConfirmationPopupComponent
            visibility={joinModalVisible}
            dismissModal={() => {
              getChallengeData();
              setJoinModalVisible(false);
            }}
            title="Welcome aboard!"
            message={`Great! You’ve joined Team ${
              teams.length
                ? teams.find(t => t.team_id === joinedDetails.team_id).team_name
                : ''
            }`}
            actionRequire={false}
          />
        ) : null}
      </div>
    ) : (
      <>
        <ParticipationStrip
          className="bodyBold"
          isEnded={isEnded}
          single={challengeData.participants[0].team.participants_count === 1}
        >
          <Row align="middle">
            {challengeData.participants[0].team.participants_count !== 1 && (
              <ParticipationIcon
                className="bodyBold"
                isEnded={isEnded}
                completed={progress >= challengeData.target_goal}
              >
                <img src={Images.tickIcon} alt="Participation" />
              </ParticipationIcon>
            )}
            {challengeData.participants[0].team.participants_count === 1
              ? 'Fantastic! You created a new team. Please invite one more member to make this a valid team!'
              : !progress
              ? 'Fantastic! You’ve signed up for this activity.'
              : progress >= challengeData.target_goal
              ? 'Awesome! You’ve completed this activity.'
              : 'Well done! You’re doing great!'}
          </Row>
          {moment().isBefore(challengeData.started_at) ? (
            <Row justify="center">
              <div style={{ margin: '20px 0px' }}>
                This Activity{' '}
                {getRemainingDayNonUtc(
                  challengeData.started_at,
                  challengeData.ended_at,
                ).toLowerCase()}
              </div>
            </Row>
          ) : (
            <>
              <div style={{ margin: '15px 0px 5px' }}>Progress</div>
              <ProgressBar isEnded={isEnded}>
                <Progress
                  isEnded={isEnded}
                  width={`${
                    (progress / challengeData.target_goal) * 100 > 100
                      ? 100
                      : (progress / challengeData.target_goal) * 100
                  }%`}
                />
              </ProgressBar>
              <Row align="end">
                {getProgress(progress)}/{challengeData.target_goal}
                {challengeData.target_unit === 'distance'
                  ? 'km'
                  : challengeData.target_unit === 'calories'
                  ? 'Cal'
                  : progress === 1
                  ? 'hr'
                  : 'hrs'}
              </Row>
            </>
          )}
        </ParticipationStrip>
        <TeamDetailStrip className="white-text">
          <Row align="middle" className="h3">
            <TeamIcon src={Images.teamIconWhite} />
            Team {challengeData.participants[0].team.team_name}
          </Row>
          <Row justify="space-between">
            <Col span={16}>
              <Row justify="space-between">
                <Col span={12}>
                  <Row className="h3" align="middle">
                    <Row justify="center" className="card-icon">
                      <img
                        src={
                          isLeader
                            ? Images.teamLeaderIcon
                            : Images.teamMemberIcon
                        }
                        style={
                          isLeader
                            ? { height: 16, width: 27 }
                            : { height: 21, width: 21 }
                        }
                        alt="icon"
                      />
                    </Row>
                    Team {isLeader ? 'Leader' : 'Member'}
                  </Row>
                </Col>
                <Col span={12} style={{ paddingLeft: '20px' }}>
                  <Row className="h3" align="middle">
                    <Row justify="center" align="middle" className="card-icon">
                      <img
                        src={Images.memberIcon}
                        style={{ height: 17.5, width: 28 }}
                        alt="icon"
                      />
                    </Row>
                    {challengeData.participants[0].team.participants_count}/5
                    Members
                  </Row>
                </Col>
              </Row>
              {isLeader && (
                <Row
                  className="body"
                  wrap={false}
                  align="middle"
                  style={{ marginTop: '20px' }}
                >
                  <Row justify="center" align="middle" className="card-icon">
                    <img
                      src={isPrivate ? Images.lockIcon : Images.unlockIcon}
                      style={{ height: 15, width: 23, objectFit: 'contain' }}
                      alt="icon"
                    />
                  </Row>
                  Allow anyone to join your team?
                  <Checkbox
                    align="middle"
                    justify="center"
                    onClick={updatePrivacy}
                  >
                    {!isPrivate && (
                      <CheckOutlined style={{ fontSize: '20px' }} />
                    )}
                  </Checkbox>
                  <InfoButton
                    className="captionBold darkGrey-text"
                    onClick={() => setModalTeamVisible(true)}
                  >
                    <img src={Images.infoIcon} alt="info" />
                  </InfoButton>
                </Row>
              )}
            </Col>

            <TeamCode span={8}>
              <div className="h3">Team Code</div>
              <div className="h1 cyan-text">
                {challengeData.participants[0].team.team_code}
              </div>
              <div>Share this code to invite friends to your team.</div>
            </TeamCode>
          </Row>
          <ConfirmationPopupComponent
            visibility={modalTeamVisible}
            dismissModal={() => {
              setModalTeamVisible(false);
            }}
            title="Allow anyone to join your team!"
            message="Can’t find team members? You can check the tick box to make your team open to other members of Live to Give to join. Anyone within the Live to Give community will be able to join your team automatically, without using a Team Code. Share a post on the Club’s Activity Feed and get recruiting!"
            actionRequire={false}
          />
        </TeamDetailStrip>
      </>
    );
  };

  const IndividualChallengeContent = () => {
    const progress =
      challengeData.is_joined_challenge && challengeData.participants.length
        ? challengeData.participants[0].progress
        : 0;

    return (
      <ParticipationStrip className="bodyBold" isEnded={isEnded}>
        <Row align="middle">
          <ParticipationIcon
            className="bodyBold"
            isEnded={isEnded}
            completed={progress >= challengeData.target_goal}
          >
            <img src={Images.tickIcon} alt="Participation" />
          </ParticipationIcon>
          {!progress
            ? 'Fantastic! You’ve signed up for this activity.'
            : progress >= challengeData.target_goal
            ? 'Awesome! You’ve completed this activity.'
            : 'Well done! You’re doing great!'}
        </Row>
        {moment().isBefore(challengeData.started_at) ? (
          <Row justify="center">
            <div style={{ margin: '20px 0px' }}>
              This Activity{' '}
              {getRemainingDayNonUtc(
                challengeData.started_at,
                challengeData.ended_at,
              ).toLowerCase()}
            </div>
          </Row>
        ) : (
          <>
            <div style={{ margin: '15px 0px 5px' }}>Progress</div>
            <ProgressBar isEnded={isEnded}>
              <Progress
                isEnded={isEnded}
                width={`${
                  (progress / challengeData.target_goal) * 100 > 100
                    ? 100
                    : (progress / challengeData.target_goal) * 100
                }%`}
              />
            </ProgressBar>
            <Row align="end">
              {getProgress(progress)}/{challengeData.target_goal}
              {challengeData.target_unit === 'distance'
                ? 'km'
                : challengeData.target_unit === 'calories'
                ? 'Cal'
                : progress === 1
                ? 'hr'
                : 'hrs'}
            </Row>
          </>
        )}
      </ParticipationStrip>
    );
  };

  const NonTrackableChallengeContent = () => {
    const completed =
      challengeData.is_joined_challenge && challengeData.participants.length
        ? challengeData.participants[0].status === 'DONE'
        : false;

    const [modalVisible, setModalVisible] = useState(false);

    return (
      <div id="feed-section">
        <ParticipationStrip className="bodyBold" isEnded={isEnded}>
          <Row align="middle">
            <ParticipationIcon
              className="bodyBold"
              isEnded={isEnded}
              completed={completed}
            >
              <img src={Images.tickIcon} alt="Participation" />
            </ParticipationIcon>
            {!completed
              ? 'Fantastic! You’ve signed up for this activity.'
              : 'Awesome! You’ve completed this activity.'}
          </Row>
        </ParticipationStrip>
        <Row justify="center">
          <PrimaryButtonComponent
            style={{ margin: '20px 0px 5px' }}
            label={completed ? 'Submit another Entry' : 'Submit your Entry'}
            onClick={() => setModalVisible(true)} // to be handled
            disabled={isEnded}
          />
        </Row>
        <CreatePostFormComponent
          modalVisible={modalVisible}
          dismissModal={() => {
            refreshList();
            setModalVisible(false);
            const target = document.getElementById('feed-section');
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            });
          }}
          type="entry"
          data={challengeData}
        />
      </div>
    );
  };

  const ActivityFeedList = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <>
        <MakePostStrip className="h3 cyan-text">
          Activity Feed
          {/* {!!challengeData.is_trackable && (
            <WritePost>
              <Col flex="none">
                <UserAvatarComponent
                  user={user}
                />
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
          )} */}
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
          type="challenge"
          data={challengeData}
        />
      </>
    );
  };

  return (
    <div>
      <Helmet>
        <title>Challenge Details - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        match={match}
        location={location}
        rightContent={
          <div>
            <ParticipantListComponent
              participants={participants}
              loadParticipant={
                challengeData && challengeData.is_team_challenge
                  ? loadTeam
                  : loadParticipant
              }
              teams={teams}
              loadTeam={loadTeam}
              data={challengeData || {}}
              joinTeam={joinTeam}
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
                  data={challengeData}
                  type="challenge"
                  participate={joinEvent}
                  isParticipate={isParticipate}
                  isShowDesc={isShowDesc}
                  toggleShowDesc={() => setIsShowDesc(!isShowDesc)}
                />
                {isParticipate &&
                  (!challengeData.is_trackable ? (
                    <NonTrackableChallengeContent />
                  ) : !challengeData.is_team_challenge ? (
                    <IndividualChallengeContent />
                  ) : (
                    <TeamChallengeContent />
                  ))}
                {isParticipate && !challengeData.is_team_challenge && (
                  <>
                    <Row>
                      <QuitButton
                        className="bodyLink white-text"
                        onClick={() => setQuitModalVisible(true)}
                      >
                        Quit this Challenge
                      </QuitButton>
                    </Row>
                    <ConfirmationPopupComponent
                      visibility={quitModalVisible}
                      dismissModal={() => setQuitModalVisible(false)}
                      title="Quit Challenge"
                      message="You are quitting this challenge and will no longer be a participant. All your submission entries and scores will be removed and reset to zero. This cannot be undone. Please confirm that you would like to quit this challenge."
                      leftAction={leaveEvent}
                      rightAction={() => setQuitModalVisible(false)}
                    />
                  </>
                )}
                {!challengeData.is_trackable && <ActivityFeedList />}
                <ConfirmationPopupComponent
                  visibility={participateModalVisible}
                  dismissModal={() => {
                    const data = { ...challengeData };
                    data.participants_count += 1;
                    data.is_joined_challenge = 1;
                    setChallengeData(data);
                    if (challengeData.is_team_challenge) {
                      getTeams();
                    }
                    getParticipants();
                    setParticipateModalVisible(false);
                  }}
                  title="Fantastic!"
                  message={`You’ve signed up for this activity!${
                    challengeData.is_team_challenge
                      ? ' Remember that you must create or join a team!'
                      : ''
                  }`}
                  note={
                    challengeData.is_trackable
                      ? 'Please ensure that you have synced with a fitness tracker on your Live to Give mobile app in order to complete this Challenge.'
                      : ''
                  }
                  actionRequire={false}
                />
              </div>
              {joinedTeamDetails ? (
                <ConfirmationPopupComponent
                  visibility={joinTeamModalVisible}
                  dismissModal={() => {
                    getChallengeData();
                    setJoinTeamModalVisible(false);
                  }}
                  title="Welcome aboard!"
                  message={`Great! You’ve joined Team ${
                    teams.length
                      ? teams.find(t => t.team_id === joinedTeamDetails.team_id)
                          .team_name
                      : ''
                  }`}
                  actionRequire={false}
                />
              ) : null}
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

// ChallengeDetailsPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  challengeDetailsPage: makeSelectChallengeDetailsPage(),
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
)(ChallengeDetailsPage);
