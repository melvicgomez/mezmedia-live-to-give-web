/* eslint-disable no-nested-ternary */
/**
 *
 * ChallengeDetailsPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import styled from 'styled-components';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ParticipantListComponent from 'components/ParticipantListComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import EventDetailsComponent from 'components/admin/EventDetailsComponent';
import { LoadingOutlined } from '@ant-design/icons';
import { Row, Spin } from 'antd';
import { Colors } from 'theme/colors';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAdminChallengeDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 40px;
`;

const InfoSection = styled.div`
  margin-top: 30px;
  margin-left: 30px;

  > div {
    margin-top: 5px;
  }

  .label {
    width: 200px;
    min-width: 200px;
  }

  a:hover {
    color: ${Colors.pureWhite};
  }
`;

const Analytics = styled.div`
  margin-top: 30px !important;

  > div {
    margin-bottom: 5px;
  }
`;

export function ChallengeDetailsPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'challengeDetailsPage', reducer });
  useInjectSaga({ key: 'challengeDetailsPage', saga });

  const challengeId = match.params.id;

  const [loading, setLoading] = useState(true);
  const [challengeData, setChallengeData] = useState(null);

  // load participant
  const [participants, setParticipants] = useState({
    favorite_users: [],
    participants: [],
  });
  const [loadParticipant, setLoadParticipant] = useState(true);

  // load team
  const [teams, setTeams] = useState({ favorite_users: [], teams: [] });
  const [loadTeam, setLoadTeam] = useState(true);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [unpublishModalVisible, setUnpublishModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/admin/all-challenges/${challengeId}`)
      .then(res => {
        const details = res.data.data;
        setChallengeData(details);
        getParticipants();
        if (res.data.data.is_team_challenge) {
          getTeams();
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getTeams = () => {
    axiosInstance
      .get(`api/challenge/participants/${challengeId}?is_team=1`)
      .then(res => {
        setTeams({
          ...teams,
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
      .get(`api/challenge/participants/${challengeId}`)
      .then(res => {
        setParticipants({
          ...participants,
          participants: res.data.data,
        });
        setLoadParticipant(false);
      })
      .catch(() => {
        setLoadParticipant(false);
      });
  };

  const publish = () => {
    if (!publishLoading) {
      axiosInstance
        .post(`api/admin/all-challenges/publish/${challengeId}?action=publish`)
        .then(res => {
          challengeData.published_at = res.data.data.published_at;
          setConfirmModalVisible(false);
          // setPublishModalVisible(true);
          setPublishLoading(false);
          dispatch(push('../../../admin/challenges'));
        })
        .catch(() => {
          setConfirmModalVisible(false);
          setPublishLoading(false);
        });
    }
  };

  const unpublish = () => {
    if (!publishLoading) {
      axiosInstance
        .post(
          `api/admin/all-challenges/publish/${challengeId}?action=unpublish`,
        )
        .then(() => {
          challengeData.published_at = null;
          setUnpublishModalVisible(false);
          setPublishLoading(false);
        })
        .catch(() => {
          setUnpublishModalVisible(false);
          setPublishLoading(false);
        });
    }
  };

  const deleteChallenge = () => {
    axiosInstance
      .delete(`api/admin/all-challenges/${challengeId}`)
      .then(() => {
        setDeleteModalVisible(false);
        dispatch(replace('../../../admin/challenges'));
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
              <div style={{ width: '612px', minWidth: '612px' }}>
                <EventDetailsComponent type="challenge" data={challengeData} />
                <div style={{ marginTop: '30px' }}>
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
                    admin
                    location={location}
                  />
                </div>
              </div>
              <InfoSection className="white-text bodyBold">
                <Row>
                  <div className="label">Challenge ID</div>
                  <div>{challengeId}</div>
                </Row>
                <Row>
                  <div className="label">Type</div>
                  <div>
                    {!challengeData.is_trackable
                      ? 'Non-Trackable Challenge'
                      : challengeData.is_team_challenge
                      ? 'Team Trackable Challenge'
                      : 'Individual Trackable Challenge'}
                  </div>
                </Row>
                <Row>
                  <div className="label">Created Date</div>
                  <div>
                    {moment
                      .utc(challengeData.created_at)
                      .local()
                      .format('DD/MM/yyyy HH:mm')}
                  </div>
                </Row>
                <Row>
                  <div className="label">Published Date</div>
                  <div
                    className={
                      challengeData.published_at ? 'green-text' : 'error-text'
                    }
                  >
                    {challengeData.published_at
                      ? moment
                          .utc(challengeData.published_at)
                          .local()
                          .format('DD/MM/yyyy HH:mm')
                      : 'Unpublished'}
                  </div>
                </Row>
                {!!challengeData.is_trackable && (
                  <Row>
                    <div className="label">Target</div>
                    <div>
                      {challengeData.type.charAt(0).toUpperCase() +
                        challengeData.type.slice(1)}{' '}
                      {challengeData.target_goal}
                      {challengeData.target_unit === 'distance'
                        ? 'km'
                        : challengeData.target_unit === 'duration'
                        ? 'hrs'
                        : 'calories'}
                    </div>
                  </Row>
                )}
                <Row>
                  <div className="label">Featured</div>
                  <div>{challengeData.is_featured === 1 ? 'Yes' : 'No'}</div>
                </Row>
                <Row wrap={false}>
                  <div className="label">Notification Message</div>
                  <div>
                    {challengeData.notification_message
                      ? challengeData.notification_message
                      : '-'}
                  </div>
                </Row>

                {!challengeData.deleted_at && (
                  <>
                    <Row wrap={false} justify="space-between">
                      <PrimaryButtonComponent
                        style={{
                          padding: '0px 30px',
                          marginTop: '25px',
                          marginRight: '10px',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                        label="Edit Challenge"
                        onClick={() =>
                          dispatch(
                            push(
                              `../../admin/challenges/${
                                challengeData.challenge_id
                              }/edit`,
                            ),
                          )
                        }
                        iconRight={false}
                      />
                      <PrimaryButtonComponent
                        style={{
                          padding: '0px 30px',
                          marginTop: '25px',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                        label="Delete Challenge"
                        onClick={() => setDeleteModalVisible(true)}
                        iconRight={false}
                      />
                    </Row>
                    <PrimaryButtonComponent
                      style={{
                        padding: '0px 30px',
                        marginTop: '15px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      label={
                        challengeData.published_at
                          ? 'Unpublish Challenge'
                          : 'Publish Challenge Now'
                      }
                      onClick={() => {
                        if (!challengeData.published_at) {
                          setConfirmModalVisible(true);
                        } else {
                          setUnpublishModalVisible(true);
                        }
                      }}
                      loading={publishLoading}
                      iconRight={false}
                    />
                  </>
                )}
                {!!challengeData.published_at &&
                  (!challengeData.is_trackable ? (
                    <Analytics>
                      <div>
                        No. of Submitted Entries:{' '}
                        {challengeData.entries_count || 0}
                      </div>
                      <div>
                        No. of Unique Users who Submitted Entries:{' '}
                        {challengeData.unique_entries_count || 0}
                      </div>
                    </Analytics>
                  ) : (
                    <Analytics>
                      <div>
                        No. of Unique Users with Non-Zero Trackable Metrics:{' '}
                        {challengeData.user_with_progress_count || 0}
                      </div>
                    </Analytics>
                  ))}
                <ConfirmationPopupComponent
                  visibility={deleteModalVisible}
                  dismissModal={() => {
                    setDeleteModalVisible(false);
                  }}
                  title="Delete Challenge"
                  message="This action cannot be undone. Do you wish to delete this challenge?"
                  leftAction={deleteChallenge}
                  rightAction={() => setDeleteModalVisible(false)}
                />
                <ConfirmationPopupComponent
                  visibility={unpublishModalVisible}
                  dismissModal={() => {
                    setUnpublishModalVisible(false);
                  }}
                  title="Unpublish Challenge"
                  message="Do you wish to unpublish this challenge?"
                  leftAction={() => {
                    unpublish();
                    setPublishLoading(true);
                    setUnpublishModalVisible(false);
                  }}
                  rightAction={() => setUnpublishModalVisible(false)}
                />
                <ConfirmationPopupComponent
                  visibility={confirmModalVisible}
                  dismissModal={() => {
                    setConfirmModalVisible(false);
                  }}
                  title="Publish Challenge"
                  message="This will be posted on the Activity Feed and Challenge List which can be viewed by all Live to Give users"
                  rightAction={() => setConfirmModalVisible(false)}
                  rightLabel="Cancel"
                  leftAction={() => {
                    publish();
                    setPublishLoading(true);
                    setConfirmModalVisible(false);
                  }}
                  leftLabel="Confirm"
                />
                <ConfirmationPopupComponent
                  visibility={publishModalVisible}
                  dismissModal={() => {
                    setPublishModalVisible(false);
                    dispatch(push('../../../admin/challenges'));
                  }}
                  title="Publish Successful"
                  message="The challenge has been published!"
                  actionRequire={false}
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

ChallengeDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  challengeDetailsPage: makeSelectAdminChallengeDetailsPage(),
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
