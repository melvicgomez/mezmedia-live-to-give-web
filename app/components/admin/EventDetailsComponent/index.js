/* eslint-disable no-nested-ternary */
/**
 *
 * EventDetailsComponent
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import getRemainingDay, { getRemainingDayNonUtc } from 'utils/getRemainingDay';
import { UserOutlined, PictureOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import BcoinValueComponent from 'components/BcoinValueComponent';
import ClubAvatarComponent from 'components/ClubAvatarComponent';
import { Images } from 'images/index';
import { Colors } from 'theme/colors';
import DOMPurify from 'dompurify';
import moment from 'moment';

const ActivityPhoto = styled.img`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
`;

const NoImagePlaceholder = styled(Row)`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: 3px solid ${Colors.pureWhite};
`;

const LabelBar = styled(Row)`
  position: absolute;
  bottom: 15px;
  right: 20px;
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

const ActivityInfoSection = styled.div`
  width: 100%;
  padding: 15px 20px;
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

const ActivityTypeIcon = styled.img`
  width: 42px;
  height: 36px;
  object-fit: contain;
  margin-left: 25px;
`;

const ParticipantsInfo = styled(Row)`
  > div > p {
    margin-left: 5px;
  }
`;

const Content = styled.div`
  margin: 20px 0px 5px;

  > p {
    margin-bottom: 20px;

    :first-child {
      margin-bottom: 10px;
    }
  }

  > .bcoin-info {
    text-align: center;
    margin: 20px 0px;
  }

  > div > .slot-info {
    text-align: center;
    margin-top: 20px;
  }
`;

const Description = styled.div`
  margin-bottom: 25px;

  > h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${Colors.pureWhite};
  }

  > p {
    margin-bottom: 1rem;
  }

  > img {
    width: 100%;
  }
`;

const MeetingDetailStrip = styled.div`
  margin: 20px 0px 10px;
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

  > .details {
    margin-bottom: 10px;

    > div:first-child {
      margin-bottom: 20px;
    }

    > div {
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
`;

function EventDetailsComponent({ type, data, isTeam }) {
  const [imgError, setImgError] = useState(false);

  const event = {
    challenge: {
      name: 'Challenge',
      icon: Images.navigation.challengeIcon,
      iconStyle: { width: 36, height: 36 },
      imageLinkPrefix: `${process.env.IMAGE_URL_PREFIX}/challenge`,
      id: data.challenge_id,
    },
    lives: {
      name: 'Live Session',
      icon: Images.navigation.liveIcon,
      iconStyle: { width: 42, height: 32 },
      imageLinkPrefix: `${process.env.IMAGE_URL_PREFIX}/live-session`,
      id: data.live_id,
    },
    meetup: {
      name: 'Meetup',
      icon: Images.navigation.meetupIcon,
      iconStyle: { width: 36, height: 33 },
      imageLinkPrefix: `${process.env.IMAGE_URL_PREFIX}/meetup`,
      id: data.meetup_id,
    },
  };

  return (
    <div style={{ width: '612px' }}>
      <div style={{ position: 'relative' }}>
        {!imgError && data.image_cover ? (
          <ActivityPhoto
            draggable={false}
            src={`${event[type].imageLinkPrefix}/${event[type].id}/${
              data.image_cover
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
        {data.bcoin_reward > 0 && (
          <div style={{ position: 'absolute', top: 25, right: 20 }}>
            <BcoinValueComponent bcoinValue={data.bcoin_reward} />
          </div>
        )}
        {type === 'challenge' && (
          <LabelBar>
            {!!data.duration && (
              <Label type="duration" className="white-text bodyBold">
                {data.duration}
              </Label>
            )}
            <Label
              type={data.is_team_challenge ? 'team' : 'individual'}
              className="white-text bodyBold"
            >
              {data.is_team_challenge ? 'Team' : 'Individual'}
            </Label>
          </LabelBar>
        )}
      </div>
      <ActivityInfoSection className="white-text">
        <Row justify="space-between" align="middle" wrap={false}>
          <Row align="middle" wrap={false}>
            <div>
              <ClubAvatarComponent
                isMember={data.club_interest.is_club_member}
                totalActivities={
                  data.club_interest.challenges_done_count +
                  data.club_interest.meetups_done_count +
                  data.club_interest.live_session_done_count
                }
                iconName={data.club_interest.icon_name}
              />
            </div>
            <ClubInfo className="darkGrey-text">
              <p className="bodyBold cyan-text">
                {data.club_interest.interest_name}
              </p>
              <p className="captionBold">
                {type === 'challenge'
                  ? `${moment(data.started_at).format(
                      'DD MMM YYYY',
                    )} - ${moment(data.ended_at).format('DD MMM YYYY')}`
                  : `${moment
                      .utc(data.started_at)
                      .local()
                      .format('DD MMM YYYY')}`}
              </p>
              <p className="captionBold">
                {type === 'challenge'
                  ? getRemainingDayNonUtc(data.started_at, data.ended_at)
                  : getRemainingDay(data.started_at, data.ended_at)}
              </p>
            </ClubInfo>
          </Row>
          <Row wrap={false} justify="end" style={{ width: '45%' }}>
            <ParticipantsInfo
              className="cyan-text"
              justify="space-between"
              align="middle"
            >
              {!isTeam && (
                <Row align="middle" wrap={false}>
                  <UserOutlined
                    className="cyan-text"
                    style={{ fontSize: '15px' }}
                  />
                  <p className="bodyBold">
                    {data.participants_count} Participants
                  </p>
                </Row>
              )}
            </ParticipantsInfo>
            <ActivityTypeIcon src={event[type].icon} />
          </Row>
        </Row>
      </ActivityInfoSection>
      <Content className="white-text">
        <p className="h2">{data.title}</p>
        <Description
          className="body white-text"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data.html_content),
          }}
        />
        {!!data.bcoin_reward && type === 'challenge' && !isTeam && (
          <>
            <p className="h3 cyan-text bcoin-info">
              Completing this {event[type].name} will award
            </p>
            <Row justify="center">
              <BcoinValueComponent bcoinValue={data.bcoin_reward} />
            </Row>
          </>
        )}
      </Content>
      {type !== 'challenge' && (
        <MeetingDetailStrip className="white-text">
          <Row align="middle" className="h3">
            {`${moment
              .utc(data.started_at)
              .local()
              .format('D MMM YYYY hh:mma')} - ${moment
              .utc(data.ended_at)
              .local()
              .format('hh:mma')}`}
          </Row>
          <div className="details">
            <div>
              <div className="bodyBold">Host: {data.host_name}</div>
              <div className="body">Contact: {data.host_email}</div>
            </div>
            <div>
              <div className="bodyBold">Additional Details:</div>
              <div className="body">{data.additional_details}</div>
            </div>
          </div>
        </MeetingDetailStrip>
      )}
    </div>
  );
}

EventDetailsComponent.propTypes = {
  type: PropTypes.string,
  data: PropTypes.object,
  isTeam: PropTypes.bool,
};

EventDetailsComponent.defaultProps = {
  isTeam: false,
};

export default EventDetailsComponent;
