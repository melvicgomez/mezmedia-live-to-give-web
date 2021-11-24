/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/**
 *
 * ContentPageDescription
 *
 */

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ClubAvatarComponent from 'components/ClubAvatarComponent';
import BcoinValueComponent from 'components/BcoinValueComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { Row, Col } from 'antd';
import { UserOutlined, PictureOutlined } from '@ant-design/icons';
import getRemainingDay, { getRemainingDayNonUtc } from 'utils/getRemainingDay';
import { push } from 'connected-react-router';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import DOMPurify from 'dompurify';
import VideoPlayerModalComponent from 'components/VideoPlayerModalComponent';

const ActivityPhoto = styled.img`
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

const ParticipationStrip = styled.div`
  padding: 20px 50px 20px 30px;
  background-color: ${props =>
    props.isEnded ? Colors.mediumGray : Colors.primary};
  color: ${props => (props.isEnded ? Colors.bodyText : Colors.pureWhite)};
  border-radius: 16px;
  margin-bottom: 15px;
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
    margin-right: 20px;
  }
`;

const ShowHideButton = styled.div`
  margin-bottom: 15px;
  cursor: pointer;
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

const RecordingLink = styled(Row)`
  margin-bottom: 20px !important;
  cursor: pointer;

  > img {
    height: 30px;
    width: 30px;
    margin-right: 10px;
  }
`;

function ContentPageDescription({
  data,
  type,
  participate,
  isParticipate,
  isShowDesc,
  toggleShowDesc,
  dispatch,
}) {
  const [details, setDetails] = useState(data);
  const [videoModalVisibility, setVideoModalVisibility] = useState(false);

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

  useEffect(() => {
    setDetails(data);
  }, [data]);

  const checkIfRegistrationEnable = () => {
    if (type !== 'challenge') {
      if (details.slots - details.participants_count > 0) {
        return moment.utc(details.registration_ended_at).local() > moment();
      } else {
        return false;
      }
    } else {
      return moment(details.registration_ended_at) > moment();
    }
  };

  const handleParticipate = () => {
    if (checkIfRegistrationEnable()) {
      participate(true);
    }
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {details.image_cover ? (
          <ActivityPhoto
            draggable={false}
            src={`${event[type].imageLinkPrefix}/${event[type].id}/${
              details.image_cover
            }`}
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
        {details.bcoin_reward > 0 && (
          <div style={{ position: 'absolute', top: 25, right: 20 }}>
            <BcoinValueComponent bcoinValue={details.bcoin_reward} />
          </div>
        )}
        {type === 'challenge' && (
          <LabelBar>
            {!!details.duration && (
              <Label type="duration" className="white-text bodyBold">
                {details.duration}
              </Label>
            )}
            <Label
              type={details.is_team_challenge ? 'team' : 'individual'}
              className="white-text bodyBold"
            >
              {details.is_team_challenge ? 'Team' : 'Individual'}
            </Label>
          </LabelBar>
        )}
      </div>
      <ActivityInfoSection className="white-text">
        <Row justify="space-between" align="middle" wrap={false}>
          <Row align="middle" wrap={false}>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                dispatch(
                  push(`../../my-clubs/${details.club_interest.interest_id}`),
                );
              }}
            >
              <ClubAvatarComponent
                isMember={details.club_interest.is_club_member}
                totalActivities={
                  details.club_interest.challenges_done_count +
                  details.club_interest.meetups_done_count +
                  details.club_interest.live_session_done_count
                }
                iconName={details.club_interest.icon_name}
              />
            </div>
            <ClubInfo className="darkGrey-text">
              <p className="bodyBold cyan-text">
                {details.club_interest.interest_name}
              </p>
              <p className="captionBold">
                {type === 'challenge'
                  ? `${moment(details.started_at).format(
                      'DD MMM YYYY',
                    )} - ${moment(details.ended_at).format('DD MMM YYYY')}`
                  : `${moment
                      .utc(details.started_at)
                      .local()
                      .format('DD MMM YYYY')}`}
              </p>
              <p className="captionBold">
                {type === 'challenge'
                  ? getRemainingDayNonUtc(details.started_at, details.ended_at)
                  : getRemainingDay(details.started_at, details.ended_at)}
              </p>
            </ClubInfo>
          </Row>
          <Row wrap={false} justify="end" style={{ width: '45%' }}>
            <ParticipantsInfo
              className="cyan-text"
              justify="space-between"
              align="middle"
            >
              <Row align="middle" wrap={false}>
                <UserOutlined
                  className="cyan-text"
                  style={{ fontSize: '15px' }}
                />
                <p className="bodyBold">
                  {details.participants_count} Participants
                </p>
              </Row>
            </ParticipantsInfo>
            <ActivityTypeIcon src={event[type].icon} />
          </Row>
        </Row>
      </ActivityInfoSection>
      <Content className="white-text">
        <p className="h2">{details.title}</p>
        {type !== 'challenge' && !isParticipate && (
          <ParticipationStrip
            className="bodyBold"
            isEnded={moment().isSameOrAfter(
              moment.utc(details.ended_at).local(),
            )}
          >
            <Row align="middle">
              {`${moment
                .utc(details.started_at)
                .local()
                .format('D MMM YYYY hh:mma')} - ${moment
                .utc(details.ended_at)
                .local()
                .format('hh:mma')}`}
            </Row>
          </ParticipationStrip>
        )}
        {isParticipate && (
          <Row justify="end">
            <ShowHideButton className="bodyLink" onClick={toggleShowDesc}>
              {isShowDesc ? 'Hide Description' : 'Show Description'}
            </ShowHideButton>
          </Row>
        )}
        {isShowDesc && (
          <div>
            <Description
              className="body white-text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(details.html_content),
              }}
            />
            {details.recording_link ? (
              <RecordingLink
                justify="center"
                align="middle"
                onClick={() => {
                  // window.open(liveData.recording_link);
                  setVideoModalVisibility(true);
                }}
              >
                <img src={Images.viewRecordingIcon} alt="recording" />
                View the recording of this{' '}
                {type === 'lives'
                  ? 'Live Session'
                  : type === 'meetup'
                  ? 'Meetup'
                  : ''}
              </RecordingLink>
            ) : null}
          </div>
        )}
        {!isParticipate && (
          <>
            {!!details.bcoin_reward && (
              <>
                <p className="h3 cyan-text bcoin-info">
                  Completing this {event[type].name} will award you
                </p>
                <Row justify="center">
                  <BcoinValueComponent bcoinValue={details.bcoin_reward} />
                </Row>
              </>
            )}
            <Row justify="center" align="middle">
              {(type === 'lives' || type === 'meetup') &&
                moment().isBefore(moment.utc(details.ended_at).local()) && (
                  <p className="h3 grapefruit-text slot-info">
                    {details.slots - details.participants_count} SLOTS REMAINING
                  </p>
                )}
              <PrimaryButtonComponent
                style={{ margin: '20px 0px' }}
                label={
                  checkIfRegistrationEnable()
                    ? 'Participate'
                    : moment().isSameOrAfter(
                        type === 'challenge'
                          ? moment(details.ended_at)
                          : moment.utc(details.ended_at).local(),
                      )
                    ? 'This Activity Has Ended'
                    : 'Registration Ended'
                }
                onClick={
                  checkIfRegistrationEnable() ? handleParticipate : () => {}
                }
                disabled={!checkIfRegistrationEnable()}
              />
            </Row>
          </>
        )}
        <VideoPlayerModalComponent
          videoLink={details.recording_link}
          visibility={videoModalVisibility}
          onDismiss={() => {
            setVideoModalVisibility(false);
          }}
        />
      </Content>
    </div>
  );
}

ContentPageDescription.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  participate: PropTypes.func,
  isParticipate: PropTypes.bool,
  isShowDesc: PropTypes.bool,
  toggleShowDesc: PropTypes.func,
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
)(ContentPageDescription);
