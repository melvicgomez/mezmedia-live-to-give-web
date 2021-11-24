/* eslint-disable no-nested-ternary */
/**
 *
 * InterestFeedCardComponent
 *
 */

import React, { useEffect, useState, createRef } from 'react';
import styled, { css } from 'styled-components';
// import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Col } from 'antd';
import { UserOutlined, PictureOutlined } from '@ant-design/icons';
import ClubAvatarComponent from 'components/ClubAvatarComponent';
import BcoinValueComponent from 'components/BcoinValueComponent';
import getRemainingDay, { getRemainingDayNonUtc } from 'utils/getRemainingDay';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';

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

const ParticipationIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 24px;
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
  justify-content: space-between;
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

function InterestFeedCardComponent({ feed, type, clubInterest, compress }) {
  const [eventId, setEventId] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);

  const desc = createRef();
  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  const [imgError, setImgError] = useState(false); // handle img crash

  useEffect(() => {
    if (type === 'challenge') {
      setEventId(feed.challenge_id);
      setIsParticipating(!!feed.is_joined_challenge);
    } else if (type === 'lives') {
      setEventId(feed.live_id);
      setIsParticipating(!!feed.is_joined_live_session);
    } else if (type === 'meetup') {
      setEventId(feed.meetup_id);
      setIsParticipating(!!feed.is_joined_meetup);
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

  return (
    <div
      style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}
    >
      <div style={{ position: 'relative' }}>
        {compress ? null : feed.image_cover && !imgError ? (
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
          <LabelBar>
            <div>
              {feed.is_open === 0 &&
              moment().isBefore(moment(feed.ended_at)) ? (
                <Label type="new" className="white-text bodyBold">
                  New
                </Label>
              ) : null}
            </div>

            <div style={{ display: 'inline-flex' }}>
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
            </div>
          </LabelBar>
        )}

        {type === 'lives' || type === 'meetup' ? (
          <LabelBar>
            <div>
              {feed.is_open === 0 &&
              moment().isBefore(moment.utc(feed.ended_at).local()) ? (
                <Label type="new" className="white-text bodyBold">
                  New
                </Label>
              ) : null}
            </div>
          </LabelBar>
        ) : null}
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
              <p className="bodyBold cyan-text">{clubInterest.interest_name}</p>
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
              <Description ref={desc} className="body" line={textShown ? 0 : 4}>
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
          <ParticipantsInfo
            justify={
              type !== 'challenge' &&
              getRemainingDay(feed.started_at, feed.ended_at) === 'Ended'
                ? 'end'
                : 'space-between'
            }
            align="middle"
          >
            {type !== 'challenge' &&
              getRemainingDay(feed.started_at, feed.ended_at) !== 'Ended' && (
                <Row align="middle">
                  <UserOutlined
                    className="digitalBlue-text"
                    style={{ fontSize: '15px' }}
                  />
                  <p className="bodyBold digitalBlue-text">
                    {feed.slots - feed.participants_count} Slots Remaining
                  </p>
                </Row>
              )}
            {type === 'challenge' && (
              <Row align="middle">
                <UserOutlined
                  className="digitalBlue-text"
                  style={{ fontSize: '15px' }}
                />
                <p className="bodyBold digitalBlue-text">
                  {feed.participants_count} Participants
                </p>
              </Row>
            )}
            {isParticipating && (
              <ParticipationIcon
                isEnded={
                  type === 'challenge'
                    ? getRemainingDayNonUtc(feed.started_at, feed.ended_at) ===
                      'Ended'
                    : getRemainingDay(feed.started_at, feed.ended_at) ===
                      'Ended'
                }
              >
                <img src={Images.tickIcon} alt="Participation" />
              </ParticipationIcon>
            )}
          </ParticipantsInfo>
        </Content>
      </ActivityInfoSection>
    </div>
  );
}

InterestFeedCardComponent.propTypes = {};

export default InterestFeedCardComponent;
