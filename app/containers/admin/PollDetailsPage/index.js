/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/**
 *
 * PollDetailsPage
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
import styled, { css } from 'styled-components';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Row, Col, Spin, Radio, Progress } from 'antd';
import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import qs from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectPollDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const PageWrapperStyled = styled.div``;

const PollPhoto = styled.img`
  height: 281px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 30px;
`;

const OptionSection = styled.div`
  background-color: ${Colors.pureWhite};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 10px 20px 20px;

  > div {
    padding: 8px 0px;
  }

  .ant-radio {
    margin-top: 5px;
  }

  .ant-radio-inner {
    border: 2px solid ${Colors.bodyText} !important;
  }

  .ant-radio-wrapper {
    display: flex;
    align-items: center;
    white-space: pre-line;
  }
`;

const ResultSection = styled.div`
  margin: 25px 20px 30px;

  .ant-progress-text {
    color: ${Colors.pureWhite};
  }

  .ant-progress-inner,
  .ant-progress-bg {
    height: 15px !important;
  }

  .label {
    margin: 8px 0px;
    width: 90px;
  }
`;

const NoImagePlaceholder = styled(Row)`
  height: 200px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: 3px solid ${Colors.pureWhite};
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

export function PollDetailsPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'pollDetailsPage', reducer });
  useInjectSaga({ key: 'pollDetailsPage', saga });

  const pollId = match.params.id;
  const user = reactLocalStorage.getObject('user');

  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState(null);

  // load participant
  const [respondents, setRespondents] = useState([]);
  const [loadRespondent, setLoadRespondent] = useState(true);
  const [respondentNextPage, setRespondentNextPage] = useState(true);
  const [respondentPageNum, setRespondentPageNum] = useState(1);

  const [totalRespondent, setTotalRespondent] = useState([]);

  const [imgError, setImgError] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [unpublishModalVisible, setUnpublishModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/admin/all-polls/${pollId}`)
      .then(res => {
        const pollData = res.data.data;
        setPoll(pollData);
        getRespondents(true);
        setTotalRespondent(
          pollData.option_one_res_count +
            pollData.option_two_res_count +
            pollData.option_three_res_count +
            pollData.option_four_res_count,
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getRespondents = (refresh = false) => {
    const hasMore = refresh ? true : respondentNextPage;
    const page = refresh ? 1 : respondentPageNum;

    if (hasMore) {
      axiosInstance
        .get(`api/admin/polls/respondent/${pollId}?page=${page}`)
        .then(res => {
          setRespondents(
            refresh ? res.data.data : respondents.concat(res.data.data),
          );
          if (res.data.next_page_url) {
            setRespondentPageNum(page + 1);
            setRespondentNextPage(true);
            setLoadRespondent(true);
          } else {
            setRespondentPageNum(page);
            setRespondentNextPage(false);
            setLoadRespondent(false);
          }
        })
        .catch(() => {
          setLoadRespondent(false);
        });
    }
  };

  const unpublish = () => {
    if (!publishLoading) {
      axiosInstance
        .post(`api/admin/all-polls/publish/${pollId}?action=unpublish`)
        .then(() => {
          poll.published_at = null;
          setUnpublishModalVisible(false);
          setPublishLoading(false);
        })
        .catch(() => {
          setUnpublishModalVisible(false);
          setPublishLoading(false);
        });
    }
  };

  const publish = () => {
    if (!publishLoading) {
      axiosInstance
        .post(`api/admin/all-polls/publish/${pollId}?action=publish`)
        .then(res => {
          poll.published_at = res.data.data.published_at;
          setConfirmModalVisible(false);
          // setPublishModalVisible(true);
          setPublishLoading(false);
          dispatch(push('../../../admin/polls'));
        })
        .catch(() => {
          setConfirmModalVisible(false);
          setPublishLoading(false);
        });
    }
  };

  const deletePost = () => {
    axiosInstance
      .delete(`api/admin/all-polls/${pollId}`)
      .then(() => {
        setDeleteModalVisible(false);
        dispatch(replace('../../../admin/polls'));
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
              <div>
                <div
                  className="white-text"
                  style={{ width: '430px', minWidth: '430px' }}
                >
                  {!imgError && poll.image_cover ? (
                    <PollPhoto
                      src={`${process.env.IMAGE_URL_PREFIX}poll/${pollId}/${
                        poll.image_cover
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
                  <OptionSection className="white-text">
                    <div className="h3 darkGrey-text">{poll.title}</div>
                    {[
                      poll.option_one,
                      poll.option_two,
                      poll.option_three,
                      poll.option_four,
                    ].map((option, i) => (
                      <div key={i}>
                        <Radio
                          key={i}
                          className="body darkGrey-text"
                          checked={false}
                          style={{ display: 'flex', alignItems: 'flex-start' }}
                        >
                          {option}
                        </Radio>
                      </div>
                    ))}
                  </OptionSection>
                </div>
                <ResultSection>
                  <div className="white-text h3">Results:</div>
                  {[
                    poll.option_one_res_count,
                    poll.option_two_res_count,
                    poll.option_three_res_count,
                    poll.option_four_res_count,
                  ].map((option, i) => (
                    <Row key={i} wrap={false} align="middle">
                      <div className="label">{`Option ${i + 1}`}</div>
                      <Progress
                        className="white-text"
                        key={i}
                        status="normal"
                        percent={(option / totalRespondent) * 100}
                        format={() => `${option}`}
                      />
                    </Row>
                  ))}
                </ResultSection>
                <ParticipantSection className="cyan-text">
                  <Row justify="space-between">
                    <div className="h3">
                      Respondents ({poll.responses_count})
                    </div>
                  </Row>
                  {loadRespondent && respondents.length === 0 ? (
                    <Row justify="center" style={{ height: '50px' }}>
                      <Spin indicator={<LoadingSpinner spin small={1} />} />
                    </Row>
                  ) : (
                    <ScrollList
                      dataLength={respondents.length}
                      next={getRespondents}
                      hasMore={respondentNextPage}
                      loader={
                        <Row justify="center" style={{ height: '50px' }}>
                          <Spin indicator={<LoadingSpinner spin small={1} />} />
                        </Row>
                      }
                      scrollableTarget="scrollableDiv"
                      endMessage={
                        !respondents.length && (
                          <p
                            className="h3 darkGrey-text"
                            style={{
                              textAlign: 'center',
                              padding: '40px 0px',
                            }}
                          >
                            <b>
                              {qs.parse(location.search).search
                                ? 'No Respondents Found'
                                : 'There are no Respondent'}
                            </b>
                          </p>
                        )
                      }
                    >
                      {respondents.map((participant, i) => (
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
                          user={
                            participant.user.user_id === user.user_id ? 1 : 0
                          }
                          style={{ cursor: 'pointer' }}
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
                            <UserAvatarComponent user={participant.user} />
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
                            </Col>
                          </Row>
                          <Col
                            flex="none"
                            className={`bodyBold ${
                              participant.user.user_id === user.user_id
                                ? 'white-text'
                                : 'cyan-text'
                            }`}
                            style={{ marginLeft: '15px' }}
                          >
                            {participant.answer}
                          </Col>
                        </ParticipantStrip>
                      ))}
                    </ScrollList>
                  )}
                </ParticipantSection>
              </div>
              <InfoSection className="white-text bodyBold">
                <Row>
                  <div className="label">Poll ID</div>
                  <div>{poll.poll_id}</div>
                </Row>
                <Row>
                  <div className="label">Started Date</div>
                  <div className="white-text">
                    {moment
                      .utc(poll.started_at)
                      .local()
                      .format('DD/MM/yyyy HH:mm')}
                  </div>
                </Row>
                <Row>
                  <div className="label">Ended Date</div>
                  <div className="white-text">
                    {moment
                      .utc(poll.ended_at)
                      .local()
                      .format('DD/MM/yyyy HH:mm')}
                  </div>
                </Row>
                <Row>
                  <div className="label">Created Date</div>
                  <div>
                    {moment
                      .utc(poll.created_at)
                      .local()
                      .format('DD/MM/yyyy HH:mm')}
                  </div>
                </Row>

                <Row>
                  <div className="label">Schedule Date</div>
                  <div className="orange-text">
                    {poll.published_at &&
                    moment.utc() < moment.utc(poll.started_at)
                      ? moment
                          .utc(poll.started_at)
                          .local()
                          .format('DD/MM/yyyy HH:mm')
                      : '-'}
                  </div>
                </Row>
                <Row>
                  <div className="label">Published Date</div>
                  <div
                    className={
                      poll.published_at &&
                      moment.utc() >= moment.utc(poll.started_at)
                        ? 'green-text'
                        : 'error-text'
                    }
                  >
                    {poll.published_at &&
                    moment.utc() >= moment.utc(poll.started_at)
                      ? moment
                          .utc(poll.started_at)
                          .local()
                          .format('DD/MM/yyyy HH:mm')
                      : 'Unpublished'}
                  </div>
                </Row>
                {!poll.deleted_at && (
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
                        label="Edit Poll"
                        onClick={() =>
                          dispatch(push(`../../admin/polls/${pollId}/edit`))
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
                        label="Delete Poll"
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
                        !poll.published_at ? 'Enable Poll' : 'Disable Poll'
                      }
                      onClick={() => {
                        if (!poll.published_at) {
                          setConfirmModalVisible(true);
                        } else {
                          setUnpublishModalVisible(true);
                        }
                      }}
                      iconRight={false}
                    />
                  </>
                )}
                <ConfirmationPopupComponent
                  visibility={deleteModalVisible}
                  dismissModal={() => {
                    setDeleteModalVisible(false);
                  }}
                  title="Delete Poll"
                  message="This action cannot be undone. Do you wish to delete this poll?"
                  leftAction={deletePost}
                  rightAction={() => setDeleteModalVisible(false)}
                />
                <ConfirmationPopupComponent
                  visibility={unpublishModalVisible}
                  dismissModal={() => {
                    setUnpublishModalVisible(false);
                  }}
                  title="Disable Poll"
                  message="Do you wish to disable this poll?"
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
                  title="Enable Poll"
                  message={`This will be published at ${moment
                    .utc(poll.started_at)
                    .local()
                    .format(
                      'DD/MM/yyyy HH:mm',
                    )} which can be viewed by all Live to Give users`}
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
                    dispatch(push('../../../admin/polls'));
                  }}
                  title="Enable Successful"
                  message="The poll has been enabled!"
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

PollDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pollDetailsPage: makeSelectPollDetailsPage(),
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
)(PollDetailsPage);
