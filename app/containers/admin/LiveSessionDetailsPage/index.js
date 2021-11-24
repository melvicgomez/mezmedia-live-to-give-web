/* eslint-disable no-nested-ternary */
/**
 *
 * LiveSessionDetailsPage
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
import EventDetailsComponent from 'components/admin/EventDetailsComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ParticipantListComponent from 'components/ParticipantListComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { LoadingOutlined } from '@ant-design/icons';
import { Row, Spin } from 'antd';
import { Colors } from 'theme/colors';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAdminLiveSessionDetailsPage from './selectors';
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

export function LiveSessionDetailsPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'liveSessionDetailsPage', reducer });
  useInjectSaga({ key: 'liveSessionDetailsPage', saga });

  const liveId = match.params.id;

  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);

  // load participant
  const [participants, setParticipants] = useState({
    favorite_users: [],
    participants: [],
  });
  const [loadParticipant, setLoadParticipant] = useState(true);
  const [participantNextPage, setParticipantNextPage] = useState(true);
  const [participantPageNum, setParticipantPageNum] = useState(1);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [unpublishModalVisible, setUnpublishModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/admin/all-live-sessions/${liveId}`)
      .then(res => {
        const details = res.data.data;
        setLiveData(details);
        getParticipants(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getParticipants = (refresh = false) => {
    const hasMore = refresh ? true : participantNextPage;
    const page = refresh ? 1 : participantPageNum;

    if (hasMore) {
      axiosInstance
        .get(`api/live-session/participants/${liveId}?page=${page}`)
        .then(res => {
          const participantList = refresh
            ? res.data.data
            : participants.participants.concat(res.data.data);
          setParticipants({
            ...participants,
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

  const publish = () => {
    if (!publishLoading) {
      axiosInstance
        .post(`api/admin/all-live-sessions/publish/${liveId}?action=publish`)
        .then(res => {
          liveData.published_at = res.data.data.published_at;
          setConfirmModalVisible(false);
          // setPublishModalVisible(true);
          setPublishLoading(false);
          dispatch(push('../../../admin/live-sessions'));
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
        .post(`api/admin/all-live-sessions/publish/${liveId}?action=unpublish`)
        .then(() => {
          liveData.published_at = null;
          setUnpublishModalVisible(false);
          setPublishLoading(false);
        })
        .catch(() => {
          setUnpublishModalVisible(false);
          setPublishLoading(false);
        });
    }
  };

  const deleteLiveSession = () => {
    axiosInstance
      .delete(`api/admin/all-live-sessions/${liveId}`)
      .then(() => {
        setDeleteModalVisible(false);
        dispatch(replace('../../../admin/live-sessions'));
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
                <EventDetailsComponent type="lives" data={liveData} />
                <div style={{ marginTop: '30px' }}>
                  <ParticipantListComponent
                    type="lives"
                    participants={participants}
                    loadParticipant={loadParticipant}
                    hasNextPage={participantNextPage}
                    data={liveData || {}}
                    getMoreParticipant={getParticipants}
                    admin
                    location={location}
                  />
                </div>
              </div>
              <InfoSection className="white-text bodyBold">
                <Row>
                  <div className="label">Live ID</div>
                  <div>{liveId}</div>
                </Row>
                <Row>
                  <div className="label">Created Date</div>
                  <div>
                    {moment
                      .utc(liveData.created_at)
                      .local()
                      .format('DD/MM/yyyy HH:mm')}
                  </div>
                </Row>
                <Row>
                  <div className="label">Published Date</div>
                  <div
                    className={
                      liveData.published_at ? 'green-text' : 'error-text'
                    }
                  >
                    {liveData.published_at
                      ? moment
                          .utc(liveData.published_at)
                          .local()
                          .format('DD/MM/yyyy HH:mm')
                      : 'Unpublished'}
                  </div>
                </Row>
                <Row>
                  <div className="label">Schedule Date</div>
                  <div className="orange-text">
                    {liveData.scheduled_at
                      ? moment(liveData.scheduled_at).format('DD/MM/yyyy HH:mm')
                      : '-'}
                  </div>
                </Row>

                <Row>
                  <div className="label">Slots</div>
                  <div>{liveData.slots}</div>
                </Row>
                <Row wrap={false}>
                  <div className="label">VC Link</div>
                  <div>{liveData.virtual_room_link || '-'}</div>
                </Row>
                <Row wrap={false}>
                  <div className="label">Recording Link</div>
                  <div>{liveData.recording_link || '-'}</div>
                </Row>
                <Row>
                  <div className="label">Featured</div>
                  <div>{liveData.is_featured === 1 ? 'Yes' : 'No'}</div>
                </Row>
                <Row wrap={false}>
                  <div className="label">Notification Message</div>
                  <div>
                    {liveData.notification_message
                      ? liveData.notification_message
                      : '-'}
                  </div>
                </Row>
                {!liveData.deleted_at && (
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
                        label="Edit Live Session"
                        onClick={() =>
                          dispatch(
                            push(
                              `../../admin/live-sessions/${
                                liveData.live_id
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
                        label="Delete Live Session"
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
                        liveData.published_at
                          ? 'Unpublish Live Session'
                          : 'Publish Live Session Now'
                      }
                      onClick={() => {
                        if (!liveData.published_at) {
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
                <ConfirmationPopupComponent
                  visibility={deleteModalVisible}
                  dismissModal={() => {
                    setDeleteModalVisible(false);
                  }}
                  title="Delete Live Session"
                  message="This action cannot be undone. Do you wish to delete this live session?"
                  leftAction={deleteLiveSession}
                  rightAction={() => setDeleteModalVisible(false)}
                />
                <ConfirmationPopupComponent
                  visibility={unpublishModalVisible}
                  dismissModal={() => {
                    setUnpublishModalVisible(false);
                  }}
                  title="Unpublish Live Session"
                  message="Do you wish to unpublish this live session?"
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
                  title="Publish Live Session"
                  message="This will be posted on the Activity Feed and Live Session List which can be viewed by all Live to Give users"
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
                    dispatch(push('../../../admin/live-sessions'));
                  }}
                  title="Publish Successful"
                  message="The live session has been published!"
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

LiveSessionDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  liveSessionDetailsPage: makeSelectAdminLiveSessionDetailsPage(),
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
