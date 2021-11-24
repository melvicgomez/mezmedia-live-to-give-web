/* eslint-disable react/no-array-index-key */
/**
 *
 * TeamDetailsPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import styled from 'styled-components';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import EventDetailsComponent from 'components/admin/EventDetailsComponent';
import { Row, Col, Spin } from 'antd';
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectTeamDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  'Hong Kong': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const PageWrapperStyled = styled.div``;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 40px;
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

const Checkbox = styled(Row)`
  border: 2px solid ${props => (props.error ? Colors.error : Colors.pureWhite)};
  border-radius: 8px;
  height: 29px;
  min-width: 29px;
  margin: 0px 10px;
  background-color: ${Colors.textInput};
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

const InfoSection = styled.div`
  margin-top: 30px;
  margin-left: 30px;

  > div {
    margin-top: 5px;
  }

  .label {
    width: 175px;
    min-width: 175px;
  }

  a:hover {
    color: ${Colors.pureWhite};
  }
`;

const TeamIcon = styled.img`
  height: 30px;
  width: 30px;
  margin-right: 8px;
`;

const ParticipantSection = styled.div`
  width: 100%;
  padding-top: 15px;
  margin-right: 10px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin: 15px 0px;
  overflow: hidden;

  > div:first-child {
    margin: 0px 20px 10px;
  }
`;

const ParticipantStrip = styled(Row)`
  min-height: 80px;
  background-color: ${props =>
    props.plural ? Colors.pureWhite : Colors.disabled};
  padding: 10px 20px;
`;

const CountryIcon = styled.img`
  height: 22px;
  width: 22px;
  margin: 0px 15px;
`;

const LeaderIcon = styled.img`
  height: 16px;
  width: 27px;
  margin-left: 20px;
`;

export function TeamDetailsPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'teamDetailsPage', reducer });
  useInjectSaga({ key: 'teamDetailsPage', saga });

  const teamId = match.params.id;

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);

  const [selectedMember, setSelectedMember] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/admin/all-teams/${teamId}`)
      .then(res => {
        setTeam(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const remove = () => {
    axiosInstance
      .post(`api/admin/all-teams/challenge-team`, {
        team_id: teamId,
        user_id: selectedMember.user_id,
      })
      .then(() => {
        team.participants = team.participants.filter(
          p => p.user_id !== selectedMember.user_id,
        );
        setConfirmModalVisible(false);
      })
      .catch(() => {
        setConfirmModalVisible(false);
      });
  };

  const deleteTeam = () => {
    axiosInstance
      .delete(`api/admin/all-teams/${teamId}`)
      .then(() => {
        setDeleteModalVisible(false);
        dispatch(push('../../../admin/teams'));
      })
      .catch(() => {
        setDeleteModalVisible(false);
      });
  };

  return (
    <div>
      <Helmet>
        <title>Admin Panel - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AdminNavigationWrapperComponent match={match} location={location}>
        <PageWrapperStyled className="white-text">
          {!loading ? (
            <Row wrap={false}>
              <div
                className="white-text"
                style={{ width: '612px', minWidth: '612px' }}
              >
                <EventDetailsComponent
                  type="challenge"
                  isTeam
                  data={team.challenge}
                />
                <TeamDetailStrip className="white-text">
                  <Row align="middle" className="h3">
                    <TeamIcon src={Images.teamIconWhite} />
                    Team {team.team_name}
                  </Row>
                  <Row justify="space-between">
                    <Col span={16}>
                      <Row justify="space-between">
                        <Col span={12}>
                          <Row className="h3" align="middle">
                            <Row
                              justify="center"
                              align="middle"
                              className="card-icon"
                            >
                              <img
                                src={Images.memberIcon}
                                style={{ height: 17.5, width: 28 }}
                                alt="icon"
                              />
                            </Row>
                            {team.participants.length}
                            /5 Members
                          </Row>
                        </Col>
                      </Row>
                      <Row
                        className="body"
                        wrap={false}
                        align="middle"
                        style={{ marginTop: '20px' }}
                      >
                        <Row
                          justify="center"
                          align="middle"
                          className="card-icon"
                        >
                          <img
                            src={
                              team.is_private
                                ? Images.lockIcon
                                : Images.unlockIcon
                            }
                            style={{
                              height: 15,
                              width: 23,
                              objectFit: 'contain',
                            }}
                            alt="icon"
                          />
                        </Row>
                        Allow anyone to join this team?
                        <Checkbox align="middle" justify="center">
                          {!team.is_private && (
                            <CheckOutlined style={{ fontSize: '20px' }} />
                          )}
                        </Checkbox>
                      </Row>
                    </Col>

                    <TeamCode span={8}>
                      <div className="h3">Team Code</div>
                      <div className="h1 cyan-text">{team.team_code}</div>
                    </TeamCode>
                  </Row>
                </TeamDetailStrip>
                <div style={{ marginTop: '30px' }}>
                  <ParticipantSection className="cyan-text">
                    <div className="h3">Members</div>
                    <div>
                      {team.participants.map((participant, i) => (
                        <ParticipantStrip
                          justify="space-between"
                          align="middle"
                          wrap={false}
                          key={i}
                          id="participant"
                          plural={i % 2 === 0 ? 1 : 0}
                        >
                          <Row
                            align="middle"
                            justify="space-between"
                            wrap={false}
                            style={{ width: '100%' }}
                          >
                            <Row
                              align="middle"
                              className="darkGrey-text"
                              wrap={false}
                            >
                              <UserAvatarComponent user={participant.user} />
                              <CountryIcon
                                src={
                                  Images.country[
                                    countryIcon[participant.user.country_code]
                                  ]
                                }
                              />
                              <Col flex="auto" className="body darkGrey-text">
                                <div>
                                  {participant.user.first_name}{' '}
                                  {participant.user.last_name}
                                </div>
                              </Col>
                              {participant.user_id === team.user_id && (
                                <LeaderIcon src={Images.teamLeaderIconBlue} />
                              )}
                            </Row>
                            {participant.user_id !== team.user_id && (
                              <PrimaryButtonComponent
                                style={{
                                  padding: '0px 20px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                                label="Remove"
                                onClick={() => {
                                  setSelectedMember(participant);
                                  setConfirmModalVisible(true);
                                }}
                                iconRight={false}
                              />
                            )}
                          </Row>
                        </ParticipantStrip>
                      ))}
                    </div>
                  </ParticipantSection>
                </div>
              </div>
              <InfoSection className="white-text bodyBold">
                <Row>
                  <div className="label">Team ID</div>
                  <div>{team.team_id}</div>
                </Row>
                <Row>
                  <div className="label">Challenge ID</div>
                  <div>{team.challenge_id}</div>
                </Row>
                <Row>
                  <div className="label">Targte Activity</div>
                  <div>
                    {team.challenge.type.charAt(0).toUpperCase() +
                      team.challenge.type.slice(1)}{' '}
                    {team.challenge.target_unit}
                  </div>
                </Row>
                <Row>
                  <div className="label">Created Date</div>
                  <div>
                    {moment
                      .utc(team.created_at)
                      .local()
                      .format('DD/MM/yyyy HH:mm')}
                  </div>
                </Row>
                {!team.deleted_at && (
                  <PrimaryButtonComponent
                    style={{
                      padding: '0px 30px',
                      marginTop: '25px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    label="Delete Team"
                    onClick={() => setDeleteModalVisible(true)}
                    iconRight={false}
                  />
                )}
                <ConfirmationPopupComponent
                  visibility={deleteModalVisible}
                  dismissModal={() => {
                    setDeleteModalVisible(false);
                  }}
                  title="Delete Team"
                  message="This action cannot be undone. Do you wish to delete this team?"
                  leftAction={deleteTeam}
                  rightAction={() => setDeleteModalVisible(false)}
                />
                <ConfirmationPopupComponent
                  visibility={confirmModalVisible}
                  dismissModal={() => {
                    setConfirmModalVisible(false);
                  }}
                  title="Remove Member"
                  message="This action cannot be undone. Do you wish to remove this member from team?"
                  leftAction={remove}
                  rightAction={() => setConfirmModalVisible(false)}
                />
              </InfoSection>
            </Row>
          ) : (
            <Row justify="center">
              <Spin indicator={<LoadingSpinner spin />} />
            </Row>
          )}
        </PageWrapperStyled>
      </AdminNavigationWrapperComponent>
    </div>
  );
}

TeamDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  teamDetailsPage: makeSelectTeamDetailsPage(),
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
)(TeamDetailsPage);
