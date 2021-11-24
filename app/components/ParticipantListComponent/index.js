/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/**
 *
 * ParticipantListComponent
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import styled, { css } from 'styled-components';
import { Colors } from 'theme/colors';
import { Row, Spin, Col, Collapse, Dropdown, Menu } from 'antd';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axiosInstance from 'services';
import Icon, { LoadingOutlined, StarFilled } from '@ant-design/icons';
import SearchPopupComponent from 'components/SearchPopupComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';
import InfiniteScroll from 'react-infinite-scroll-component';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const { Panel } = Collapse;

const ParticipantSection = styled.div`
  width: ${props => (props.admin ? '100%' : '396px')};
  padding-top: 15px;
  margin-right: 10px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin: 15px 0px;
  overflow: hidden;

  > div:first-child {
    margin: 0px 20px;
  }
`;

const ParticipantStrip = styled(Row)`
  min-height: 80px;
  background-color: ${props =>
    props.ghost
      ? Colors.mediumGray
      : props.user
      ? Colors.grapefruit
      : props.plural
      ? Colors.pureWhite
      : Colors.disabled};
  padding: 10px 20px;
  position: relative;
  opacity: ${props => (props.ghost ? 0.5 : 1)};

  ${props =>
    !props.user &&
    !props.ghost &&
    css`
      border-bottom: 2px solid
        ${props.plural ? Colors.disabled : Colors.pureWhite};
    `}
`;

const CountryIcon = styled.img`
  height: 22px;
  width: 22px;
  margin: 0px 15px;
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: ${props => (props.small ? '30px' : '40px')};
`;

const TeamStrip = styled(Collapse)`
  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0px;
  }

  .ant-collapse-header {
    min-height: 80px !important;
    display: flex;
    align-items: center;
    padding: 12px !important;
  }

  .ant-collapse-arrow {
    top: 45%;
    padding: auto;
  }

  .ant-collapse-item {
    border: none !important;
  }
`;

const TeamProgress = styled.div`
  min-width: 70px;
  text-align: right;
  margin-right: 15px;
`;

const ExpandArrow = styled.img`
  height: 19px;
  width: 11px;
`;

const TeamIcon = styled.img`
  height: 12px;
  width: 20px;
  margin: 0px 10px;
`;

const FilterBar = styled(Row)`
  height: 60px;
  padding: 0px 20px;
  border-bottom: 3px solid ${Colors.mediumGray};

  > div {
    cursor: pointer;
  }
`;

const JumpToRankIcon = styled.div`
  > img {
    height: 28px;
    width: 28px;
    cursor: pointer;
  }
`;

const LeaderIcon = styled.img`
  position: absolute;
  height: 16px;
  width: 27px;
  top: -16px;
  right: 0px;
`;

const JoinSection = styled(Row)`
  background-color: ${Colors.pureWhite};
  height: 80px;

  > div {
    height: 46px;
    padding: 0px 25px;
    background-color: ${Colors.grapefruit};
    margin: 10px 0px;
    border-radius: 16px;
  }
`;

const ScrollList = styled(InfiniteScroll)`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  > div {
    overflow-y: hidden;
  }
`;

const FavoriteSection = styled.div`
  border: 6px solid ${Colors.primary};
  background-color: ${Colors.mediumGray};
`;

const FavoriteHeader = styled(Row)`
  background-color: ${Colors.primary};
  padding: 10px 15px 5px;
`;

const FavouriteIcon = styled(StarFilled)`
  color: ${Colors.star};
  font-size: 20px;
  margin-right: 8px;
`;

function ParticipantListComponent({
  type,
  participants,
  loadParticipant,
  teams,
  loadTeam,
  data,
  joinTeam,
  hasNextPage,
  getMoreParticipant,
  admin,
  location,
  dispatch,
  refreshList,
}) {
  const user = reactLocalStorage.getObject('user');

  const [activeKey, setActiveKey] = useState([]);
  const filterOption = ['Teams', 'Individual Rankings'];
  const [selectedFilter, setSelectedFilter] = useState(isTeam ? 0 : 1);

  const [participantList, setParticipantList] = useState(participants);
  const [teamList, setTeamList] = useState(teams);

  const [hasTeam, setHasTeam] = useState(false);
  const [isParticipate, setIsParticipate] = useState(false);

  const [isTeam, setIsTeam] = useState(0);
  const [isTrackable, setIsTrackable] = useState(0);
  const [targetUnit, setTargetUnit] = useState('distance');

  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    setParticipantList(participants);
  }, [participants]);

  useEffect(() => {
    setTeamList(teams);
  }, [teams]);

  useEffect(() => {
    if (type === 'challenge') {
      if (Object.keys(data).length) {
        setHasTeam(
          admin
            ? true
            : !!data.is_joined_challenge &&
                !!data.participants.length &&
                !!data.participants[0].team,
        );
        setIsParticipate(admin ? true : !!data.is_joined_challenge);
        setIsTeam(data.is_team_challenge);
        setIsTrackable(data.is_trackable);
        setTargetUnit(data.is_trackable ? data.target_unit : 'distance');
      }
    }
  }, [data]);

  useEffect(() => {
    setSelectedFilter(isTeam ? 0 : 1);
  }, [isTeam]);

  useEffect(() => {
    if (selectedUser) {
      setShowConfirmPopup(true);
    }
  }, [selectedUser]);

  const getActiveKey = key => {
    setActiveKey(key);
  };

  const onClick = ({ key }) => {
    setSelectedFilter(parseInt(key, 10));
  };

  const jumpToRank = () => {
    const target = document.getElementById(
      selectedFilter === 0 ? 'user-team' : 'user',
    );

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const toogleFavorite = participant => {
    axiosInstance
      .post('api/favorite-users', {
        favorite_user_id: participant.user_id,
      })
      .then(() => {
        setShowConfirmPopup(false);
        setSelectedUser(null);
        refreshList();
      })
      .catch(error => {
        if (error.status === 422) {
          setErrorModalVisible(true);
        }
      });
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

  const menu = (
    <Menu onClick={onClick}>
      {isTeam ? (
        filterOption.map((option, i) => <Menu.Item key={i}>{option}</Menu.Item>)
      ) : (
        <Menu.Item key={1}>{filterOption[1]}</Menu.Item>
      )}
    </Menu>
  );

  const TeamList = () => (
    <TeamStrip
      bordered={false}
      className="site-collapse-custom-collapse"
      activeKey={activeKey}
      onChange={getActiveKey}
    >
      {teamList.teams.map((team, i) => (
        <Panel
          showArrow={false}
          extra={
            <Row
              wrap={false}
              style={{
                color:
                  team.participants.find(
                    participant => participant.user_id === user.user_id,
                  ) || activeKey.includes((i + 1).toString())
                    ? Colors.pureWhite
                    : Colors.bodyText,
              }}
              align="middle"
            >
              <TeamIcon
                src={
                  team.participants.find(
                    participant => participant.user_id === user.user_id,
                  ) || activeKey.includes((i + 1).toString())
                    ? Images.memberIcon
                    : Images.navigation.clubIcon
                }
              />
              <div className="bodyBold" style={{ width: '30px' }}>
                {team.participants_count}/5
              </div>
              <TeamProgress
                className="bodyBold"
                style={{
                  color:
                    team.participants.find(
                      participant => participant.user_id === user.user_id,
                    ) || activeKey.includes((i + 1).toString())
                      ? Colors.pureWhite
                      : Colors.primary,
                }}
              >
                {getProgress(team.team_progress)}
                {targetUnit === 'distance'
                  ? 'km'
                  : targetUnit === 'calories'
                  ? 'Cal'
                  : team.team_progress === 1
                  ? 'hr'
                  : 'hrs'}
              </TeamProgress>
              <Icon
                component={() => (
                  <ExpandArrow
                    src={
                      team.participants.find(
                        participant => participant.user_id === user.user_id,
                      ) || activeKey.includes((i + 1).toString())
                        ? Images.rightArrow
                        : Images.rightArrowBlue
                    }
                  />
                )}
                style={{
                  fontSize: '20px',
                  color:
                    team.participants.find(
                      participant => participant.user_id === user.user_id,
                    ) || activeKey.includes((i + 1).toString())
                      ? Colors.pureWhite
                      : Colors.primary,
                  transform: activeKey.includes((i + 1).toString())
                    ? 'rotate(90deg)'
                    : 'none',
                }}
              />
            </Row>
          }
          header={
            <Row
              wrap={false}
              style={{
                width: '100%',
                color:
                  team.participants.find(
                    participant => participant.user_id === user.user_id,
                  ) || activeKey.includes((i + 1).toString())
                    ? Colors.pureWhite
                    : Colors.bodyText,
              }}
            >
              <div
                style={{
                  minWidth: '35px',
                  position: 'relative',
                  textAlign: 'center',
                  marginRight: '5px',
                }}
              >
                #{team.ranking}
              </div>
              <Row
                justify="center"
                align="middle"
                className="card-icon"
                style={{ marginRight: '5px' }}
              >
                <img
                  src={
                    team.is_private
                      ? team.participants.find(
                          participant => participant.user_id === user.user_id,
                        ) || activeKey.includes((i + 1).toString())
                        ? Images.lockIcon
                        : Images.lockIconGrey
                      : team.participants.find(
                          participant => participant.user_id === user.user_id,
                        ) || activeKey.includes((i + 1).toString())
                      ? Images.unlockIcon
                      : Images.unlockIconGreen
                  }
                  style={{
                    height: 15,
                    width: 23,
                    objectFit: 'contain',
                  }}
                  alt="icon"
                />
              </Row>
              <div
                style={{
                  color:
                    team.participants_count <= 1
                      ? Colors.redHeart
                      : team.participants.find(
                          participant => participant.user_id === user.user_id,
                        ) || activeKey.includes((i + 1).toString())
                      ? Colors.pureWhite
                      : Colors.bodyText,
                }}
              >
                {team.team_name}
              </div>
            </Row>
          }
          key={i + 1}
          className="bodyBold darkGrey-text"
          style={{
            backgroundColor:
              team.participants.find(
                participant => participant.user_id === user.user_id,
              ) || activeKey.includes((i + 1).toString())
                ? Colors.grapefruit
                : i % 2 === 0
                ? Colors.pureWhite
                : Colors.disabled,
          }}
          id={
            team.participants.find(
              participant => participant.user_id === user.user_id,
            )
              ? 'user-team'
              : 'team'
          }
        >
          {team.participants.map((participant, index) => (
            <ParticipantStrip
              justify="space-between"
              align="middle"
              wrap={false}
              key={index}
              plural={index % 2 === 0 ? 1 : 0}
              user={participant.user.user_id === user.user_id ? 1 : 0}
              style={{ cursor: 'pointer' }}
              onClick={
                !admin && participant.user.user_id !== user.user_id
                  ? () => {
                      setSelectedUser(participant.user);
                    }
                  : null
              }
            >
              <Row
                align="middle"
                className={`${
                  participant.user.user_id === user.user_id
                    ? 'white-text'
                    : 'darkGrey-text'
                }`}
                wrap={false}
              >
                <div style={{ minWidth: '40px' }}>{index + 1}.</div>
                <UserAvatarComponent user={participant.user} list />
                <CountryIcon
                  src={
                    Images.country[countryIcon[participant.user.country_code]]
                  }
                />
                <Col flex="auto">
                  <div className="body" style={{ fontWeight: 400 }}>
                    {participant.user.first_name} {participant.user.last_name}
                  </div>
                  <div className="captionBold">Team {team.team_name}</div>
                </Col>
              </Row>
              <Col
                flex="none"
                className={`bodyBold ${
                  participant.user.user_id === user.user_id
                    ? 'white-text'
                    : 'cyan-text'
                }`}
                style={{ marginLeft: '15px', position: 'relative' }}
              >
                {team.user_id === participant.user.user_id && (
                  <LeaderIcon
                    src={
                      participant.user.user_id === user.user_id
                        ? Images.teamLeaderIcon
                        : Images.teamLeaderIconBlue
                    }
                    style={{
                      position: 'absolute',
                      height: '16px',
                      width: '27px',
                      top: '-16px',
                      right: '0px',
                    }}
                  />
                )}
                {getProgress(participant.progress)}
                {targetUnit === 'distance'
                  ? 'km'
                  : targetUnit === 'calories'
                  ? 'Cal'
                  : participant.progress === 1
                  ? 'hr'
                  : 'hrs'}
              </Col>
            </ParticipantStrip>
          ))}
          {isParticipate &&
            !team.is_private &&
            !hasTeam &&
            team.participants.length < 5 && (
              <JoinSection align="middle" justify="center">
                <Row
                  className="white-text"
                  align="middle"
                  onClick={() => joinTeam(team)}
                  style={{ cursor: 'pointer' }}
                >
                  Join Team
                </Row>
              </JoinSection>
            )}
        </Panel>
      ))}
    </TeamStrip>
  );

  const ParticipantList = () =>
    participantList.participants.map((participant, i) => (
      <ParticipantStrip
        justify="space-between"
        align="middle"
        wrap={false}
        key={i}
        id={participant.user.user_id === user.user_id ? 'user' : 'participant'}
        plural={i % 2 === 0 ? 1 : 0}
        user={participant.user.user_id === user.user_id ? 1 : 0}
        style={{ cursor: 'pointer' }}
        onClick={
          !admin && participant.user.user_id !== user.user_id
            ? () => {
                setSelectedUser(participant.user);
              }
            : null
        }
      >
        <Row
          align="middle"
          className={`${
            participant.user.user_id === user.user_id
              ? 'white-text'
              : 'darkGrey-text'
          }`}
          wrap={false}
        >
          {!!isTrackable && (
            <div className="bodyBold" style={{ minWidth: '40px' }}>
              #{participant.ranking}
            </div>
          )}
          <UserAvatarComponent user={participant.user} list />
          <CountryIcon
            src={Images.country[countryIcon[participant.user.country_code]]}
          />
          <Col
            flex="auto"
            className={`body ${
              participant.user.user_id === user.user_id
                ? 'white-text'
                : 'darkGrey-text'
            }`}
          >
            <div>
              {participant.user.first_name} {participant.user.last_name}
            </div>
            {participant.team ? (
              <div className="captionBold">
                Team {participant.team.team_name}
              </div>
            ) : null}
          </Col>
        </Row>
        {!!isTrackable && (
          <Col
            flex="none"
            className={`bodyBold ${
              participant.user.user_id === user.user_id
                ? 'white-text'
                : 'cyan-text'
            }`}
            style={{ marginLeft: '15px' }}
          >
            {getProgress(participant.progress)}
            {!!isTrackable &&
              (targetUnit === 'distance'
                ? 'km'
                : targetUnit === 'calories'
                ? 'Cal'
                : participant.progress === 1
                ? 'hr'
                : 'hrs')}
          </Col>
        )}
      </ParticipantStrip>
    ));

  return (
    <ParticipantSection admin={admin ? 1 : 0} className="cyan-text">
      <Row justify="space-between">
        <div className="h3">{type === 'club' ? 'Members' : 'Participants'}</div>
        {type === 'challenge' && !!isTrackable && !admin && (
          <JumpToRankIcon role="button" tabIndex="-1" onClick={jumpToRank}>
            <img src={Images.jumpToRankIcon} alt="jump_to_rank" />
          </JumpToRankIcon>
        )}
      </Row>
      {type === 'challenge' ? (
        <div>
          {!!isTrackable && (
            <FilterBar justify="space-between" align="middle">
              {!admin ? (
                <SearchPopupComponent
                  location={location}
                  dispatch={dispatch}
                  type="user"
                  width={90}
                />
              ) : (
                <JumpToRankIcon
                  role="button"
                  tabIndex="-1"
                  onClick={jumpToRank}
                >
                  <img src={Images.jumpToRankIcon} alt="jump_to_rank" />
                </JumpToRankIcon>
              )}
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <div className="bodyLink darkGrey-text">
                  Shows: {filterOption[selectedFilter]}
                </div>
              </Dropdown>
            </FilterBar>
          )}
          {(selectedFilter
            ? !loadParticipant && !!participantList.favorite_users.length
            : !loadTeam && !!teamList.favorite_users.length) &&
            !admin && (
              <>
                <FavoriteHeader align="middle">
                  <FavouriteIcon />
                  <div className="white-text h3">Your Favourites</div>
                </FavoriteHeader>
                <FavoriteSection>
                  {(selectedFilter
                    ? participantList
                    : teamList
                  ).favorite_users.map((participant, i) => (
                    <div style={{ position: 'relative' }} key={i}>
                      <ParticipantStrip
                        justify="space-between"
                        align="middle"
                        wrap={false}
                        key={i}
                        id={
                          participant.user.user_id === user.user_id
                            ? 'user'
                            : 'participant'
                        }
                        plural={i % 2 === 0 ? 1 : 0}
                        user={participant.user.user_id === user.user_id ? 1 : 0}
                        style={{ cursor: 'pointer' }}
                        ghost={participant.is_ghost || 0}
                        onClick={
                          !admin && participant.user.user_id !== user.user_id
                            ? () => {
                                setSelectedUser(participant.user);
                              }
                            : null
                        }
                      >
                        <Row
                          align="middle"
                          className={`${
                            participant.user.user_id === user.user_id
                              ? 'white-text'
                              : 'darkGrey-text'
                          }`}
                          wrap={false}
                        >
                          {!!isTrackable && (
                            <div
                              className="bodyBold"
                              style={{ minWidth: '40px' }}
                            >
                              {!participant.is_ghost
                                ? `#${participant.ranking}`
                                : ''}
                            </div>
                          )}
                          <UserAvatarComponent user={participant.user} list />
                          <CountryIcon
                            src={
                              Images.country[
                                countryIcon[participant.user.country_code]
                              ]
                            }
                          />
                          <Col
                            flex="auto"
                            className={`body ${
                              participant.user.user_id === user.user_id
                                ? 'white-text'
                                : 'darkGrey-text'
                            }`}
                          >
                            <div>
                              {participant.user.first_name}{' '}
                              {participant.user.last_name}
                            </div>
                            {participant.team ? (
                              <div className="captionBold">
                                Team {participant.team.team_name}
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                        {!!isTrackable && (
                          <Col
                            flex="none"
                            className={`bodyBold ${
                              participant.user.user_id === user.user_id
                                ? 'white-text'
                                : 'cyan-text'
                            }`}
                            style={{ marginLeft: '15px' }}
                          >
                            {!participant.is_ghost &&
                              `${getProgress(
                                participant.progress,
                              )} ${!!isTrackable &&
                                (targetUnit === 'distance'
                                  ? 'km'
                                  : targetUnit === 'calories'
                                  ? 'Cal'
                                  : participant.progress === 1
                                  ? 'hr'
                                  : 'hrs')}`}
                          </Col>
                        )}
                      </ParticipantStrip>
                    </div>
                  ))}
                </FavoriteSection>
              </>
            )}
          {(!!selectedFilter && loadParticipant) ||
          (!selectedFilter && loadTeam) ? (
            <Row justify="center" style={{ height: '50px' }}>
              <Spin indicator={<LoadingSpinner spin small={1} />} />
            </Row>
          ) : !!selectedFilter && !participantList.participants.length ? (
            <p
              className="h3 darkGrey-text"
              style={{ textAlign: 'center', padding: '40px 0px' }}
            >
              <b>
                {qs.parse(location.search).search
                  ? 'No Participants Found'
                  : 'There are no participants'}
              </b>
            </p>
          ) : !selectedFilter && !teamList.teams.length ? (
            <p
              className="h3 darkGrey-text"
              style={{ textAlign: 'center', padding: '40px 0px' }}
            >
              <b>
                {qs.parse(location.search).search
                  ? 'No Teams Found'
                  : 'No Available Team'}
              </b>
            </p>
          ) : selectedFilter ? (
            <ParticipantList />
          ) : (
            <TeamList />
          )}
        </div>
      ) : loadParticipant && participantList.participants.length === 0 ? (
        <Row justify="center" style={{ height: '50px' }}>
          <Spin indicator={<LoadingSpinner spin small={1} />} />
        </Row>
      ) : (
        <>
          {!admin && (
            <FilterBar justify="space-between" align="middle">
              <SearchPopupComponent
                location={location}
                dispatch={dispatch}
                type="user"
                width={300}
              />
            </FilterBar>
          )}
          {!loadParticipant &&
            !!participantList.favorite_users.length &&
            !admin && (
              <>
                <FavoriteHeader align="middle">
                  <FavouriteIcon />
                  <div className="white-text h3">Your Favourites</div>
                </FavoriteHeader>
                <FavoriteSection>
                  {participantList.favorite_users.map((participant, i) => (
                    <ParticipantStrip
                      justify="space-between"
                      align="middle"
                      wrap={false}
                      key={i}
                      id={
                        participant.user.user_id === user.user_id
                          ? 'user'
                          : 'participant'
                      }
                      plural={i % 2 === 0 ? 1 : 0}
                      user={participant.user.user_id === user.user_id ? 1 : 0}
                      style={{ cursor: 'pointer' }}
                      ghost={participant.is_ghost || 0}
                      onClick={
                        !admin && participant.user.user_id !== user.user_id
                          ? () => {
                              setSelectedUser(participant.user);
                            }
                          : null
                      }
                    >
                      <Row
                        align="middle"
                        className={`${
                          participant.user.user_id === user.user_id
                            ? 'white-text'
                            : 'darkGrey-text'
                        }`}
                        wrap={false}
                      >
                        {!!isTrackable && (
                          <div
                            className="bodyBold"
                            style={{ minWidth: '40px' }}
                          >
                            {!participant.is_ghost
                              ? `#${participant.ranking}`
                              : ''}
                          </div>
                        )}
                        <UserAvatarComponent user={participant.user} list />
                        <CountryIcon
                          src={
                            Images.country[
                              countryIcon[participant.user.country_code]
                            ]
                          }
                        />
                        <Col
                          flex="auto"
                          className={`body ${
                            participant.user.user_id === user.user_id
                              ? 'white-text'
                              : 'darkGrey-text'
                          }`}
                        >
                          <div>
                            {participant.user.first_name}{' '}
                            {participant.user.last_name}
                          </div>
                          {participant.team ? (
                            <div className="captionBold">
                              Team {participant.team.team_name}
                            </div>
                          ) : null}
                        </Col>
                      </Row>
                      {!!isTrackable && (
                        <Col
                          flex="none"
                          className={`bodyBold ${
                            participant.user.user_id === user.user_id
                              ? 'white-text'
                              : 'cyan-text'
                          }`}
                          style={{ marginLeft: '15px' }}
                        >
                          {!participant.is_ghost &&
                            `${getProgress(
                              participant.progress,
                            )} ${!!isTrackable &&
                              (targetUnit === 'distance'
                                ? 'km'
                                : targetUnit === 'calories'
                                ? 'Cal'
                                : participant.progress === 1
                                ? 'hr'
                                : 'hrs')}`}
                        </Col>
                      )}
                    </ParticipantStrip>
                  ))}
                </FavoriteSection>
              </>
            )}
          <ScrollList
            dataLength={participantList.participants.length}
            next={getMoreParticipant}
            hasMore={hasNextPage}
            loader={
              <Row justify="center" style={{ height: '50px' }}>
                <Spin indicator={<LoadingSpinner spin small={1} />} />
              </Row>
            }
            scrollableTarget="scrollableDiv"
            endMessage={
              !participantList.participants.length && (
                <p
                  className="h3 darkGrey-text"
                  style={{ textAlign: 'center', padding: '40px 0px' }}
                >
                  <b>
                    {qs.parse(location.search).search
                      ? `No ${
                          type === 'club' ? 'Members' : 'Participants'
                        } Found`
                      : `There are no ${
                          type === 'club' ? 'Members' : 'Participants'
                        }`}
                  </b>
                </p>
              )
            }
          >
            <ParticipantList />
          </ScrollList>
        </>
      )}
      {!!selectedUser && (
        <ConfirmationPopupComponent
          actionRequire
          visibility={showConfirmPopup}
          dismissModal={() => {
            setShowConfirmPopup(false);
          }}
          title={
            selectedUser.is_favorite
              ? 'Remove from Your Favourites List'
              : 'Add to Your Favourites list'
          }
          message={
            selectedUser.is_favorite
              ? `Remove ${selectedUser.first_name} ${
                  selectedUser.last_name
                } from your favourites list?`
              : `Add ${selectedUser.first_name} ${
                  selectedUser.last_name
                } to your favourites list?`
          }
          leftAction={() => {
            toogleFavorite(selectedUser);
            setShowConfirmPopup(false);
          }}
          rightAction={() => {
            setShowConfirmPopup(false);
          }}
        />
      )}
      <ConfirmationPopupComponent
        actionRequire={false}
        visibility={errorModalVisible}
        dismissModal={() => {
          setErrorModalVisible(false);
        }}
        title="Maximum Reached"
        message="You can only have a maximum of 5 favourites in your list"
      />
    </ParticipantSection>
  );
}

ParticipantListComponent.propTypes = {
  type: PropTypes.string,
  participants: PropTypes.object,
  loadParticipant: PropTypes.bool,
  teams: PropTypes.object,
  loadTeam: PropTypes.bool,
  data: PropTypes.object,
  joinTeam: PropTypes.func,
  hasNextPage: PropTypes.bool,
  getMoreParticipant: PropTypes.func,
  admin: PropTypes.bool,
};

ParticipantListComponent.defaultProps = {
  type: 'challenge',
  data: {},
  joinTeam: () => {},
  teams: {},
  loadTeam: false,
  hasNextPage: false,
  getMoreParticipant: () => {},
  admin: false,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ParticipantListComponent);
