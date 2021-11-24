/**
 *
 * OfficialPostDetailsPage
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
import CommentBarComponent from 'components/CommentBarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Row, Col, Spin } from 'antd';
import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectOfficialPostDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

const ActivityPhoto = styled.img`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 40px;
`;

const Content = styled.div`
  margin: 10px 0px 5px;

  > p:first-child {
    margin-bottom: 15px;
  }
`;

const OfficialIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-top: 2px;
  object-fit: cover !important;
  border-radius: 8px;
`;

const PostInfoSection = styled(Row)`
  width: 100%;
  padding: 15px 20px;
  background-color: ${Colors.digital};
  margin-bottom: 20px;
`;

const PostInfo = styled.div`
  margin-left: 15px;

  > p {
    line-height: 16px;

    :first-child {
      line-height: 20px;
      margin-bottom: 2px;
    }
  }
`;

const Description = styled.div`
  margin-bottom: 20px;

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
    margin: 10px 0px 15px;
  }
`;

const PostActionSection = styled(Row)`
  width: 100%;
  padding: 15px 20px 15px;
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  margin-bottom: 20px;

  > div {
    color: ${Colors.bodyText};
  }
`;

const ChatIcon = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  margin-left: 20px;
  border-radius: 24px;
  padding: 0px;

  > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const LikeIcon = styled.button`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  margin-left: 20px;
  border-radius: 24px;
  padding: 0px;
  outline: none;
  border: none;
  background-color: ${Colors.pureWhite};
  cursor: pointer;

  > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const PostCommentSection = styled(Row)`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const LoadMoreButton = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const NoImagePlaceholder = styled(Row)`
  height: 359px;
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

export function OfficialPostDetailsPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'officialPostDetailsPage', reducer });
  useInjectSaga({ key: 'officialPostDetailsPage', saga });

  const feedId = match.params.id;
  const user = reactLocalStorage.getObject('user');

  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState(null);

  const [comments, setComments] = useState([]);
  const [loadMore, setLoadMore] = useState(false); // decide whether display more comments
  const [commentLoading, setCommentLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);

  const [imgError, setImgError] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [unpublishModalVisible, setUnpublishModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/admin/all-officials/${feedId}`)
      .then(res => {
        setFeed(res.data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (feed) {
      setLoading(false);
      axiosInstance
        .get(
          `api/activity-feed-comment?feed_id=${feedId}&user_id=${user.user_id}`,
        )
        .then(res => {
          setComments(res.data.data);
          setIsLiked(false);

          setCommentLoading(false);
        })
        .catch(() => {
          setCommentLoading(false);
        });
    }
    setLoadMore(false);
  }, [feed]);

  const unpublish = () => {
    if (!publishLoading) {
      axiosInstance
        .post(`api/admin/all-officials/publish/${feedId}?action=unpublish`)
        .then(() => {
          feed.published_at = null;
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
        .post(`api/admin/all-officials/publish/${feedId}?action=publish`)
        .then(res => {
          feed.published_at = res.data.data.published_at;
          setConfirmModalVisible(false);
          // setPublishModalVisible(true);
          setPublishLoading(false);
          dispatch(push('../../../admin/officials'));
        })
        .catch(() => {
          setConfirmModalVisible(false);
          setPublishLoading(false);
        });
    }
  };

  const deletePost = () => {
    axiosInstance
      .delete(`api/admin/all-officials/${feedId}`)
      .then(() => {
        setDeleteModalVisible(false);
        dispatch(replace('../../../admin/officials'));
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
                {!imgError && feed.images.length > 0 ? (
                  <ActivityPhoto
                    src={`${
                      process.env.IMAGE_URL_PREFIX
                    }activity-feed/${feedId}/${feed.images[0].image_path}`}
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
                <PostInfoSection className="white-text" align="middle">
                  <OfficialIcon src={Images.avatarBwell} />
                  <PostInfo className="white-text">
                    <p className="bodyBold">Live to Give</p>
                    <p className="captionBold">
                      {feed.is_announcement === 0
                        ? feed.club_interest.interest_name
                            .split(' ')
                            .slice(0, -1)
                            .join(' ')
                        : 'Announcement'}
                    </p>
                    <p className="captionBold">
                      {feed.published_at
                        ? `${moment
                            .utc(feed.published_at)
                            .local()
                            .format('DD MMM')} at ${moment
                            .utc(feed.published_at)
                            .local()
                            .format('h:mmA')}`
                        : '-'}
                    </p>
                  </PostInfo>
                </PostInfoSection>
                <Content className="white-text">
                  <p className="h2">{feed.title}</p>
                  <Description
                    className="body white-text"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(feed.html_content),
                    }}
                  />
                </Content>
                <div>
                  <PostActionSection
                    className="darkGrey-text"
                    justify="end"
                    align="middle"
                  >
                    <Row align="middle">
                      <ChatIcon>
                        <img src={Images.chatIcon} alt="like" />
                      </ChatIcon>
                      <p className="bodyBold">
                        {feed.comments_count >= 1000
                          ? `${(feed.comments_count / 1000).toFixed(1)}k`
                          : feed.comments_count}
                      </p>
                    </Row>
                    <Row align="middle">
                      <LikeIcon>
                        {isLiked ? (
                          <img src={Images.heartFilled} alt="like" />
                        ) : (
                          <img src={Images.heartOutlined} alt="like" />
                        )}
                      </LikeIcon>
                      <p className="bodyBold" style={{ marginRight: '15px' }}>
                        {feed.likes_count >= 1000
                          ? `${(feed.likes_count / 1000).toFixed(1)}k`
                          : feed.likes_count}
                      </p>
                    </Row>
                    {feed.comments_count > 0 && !commentLoading && (
                      <PostCommentSection>
                        {feed.comments_count > 0 &&
                          (commentLoading ? (
                            <Row
                              justify="center"
                              style={{
                                width: '100%',
                                marginBottom: '20px',
                              }}
                            >
                              <Spin indicator={<LoadingSpinner spin />} />
                            </Row>
                          ) : (
                            (loadMore ? comments : comments.slice(0, 3)).map(
                              comment => (
                                <CommentBarComponent
                                  key={comment.comment_id}
                                  admin
                                  comment={comment}
                                  selectComment={() => {}}
                                  setConfirmModalVisible={() => {}}
                                />
                              ),
                            )
                          ))}

                        {feed.comments_count > 3 && (
                          <Row justify="center" style={{ width: '100%' }}>
                            <LoadMoreButton
                              className="bodyLink"
                              onClick={() => setLoadMore(!loadMore)}
                            >
                              {loadMore
                                ? 'Hide more comments'
                                : 'Load more comments'}
                            </LoadMoreButton>
                          </Row>
                        )}
                      </PostCommentSection>
                    )}
                  </PostActionSection>
                </div>
              </div>
              <InfoSection className="white-text bodyBold">
                <Row>
                  <div className="label">Feed ID</div>
                  <div>{feed.feed_id}</div>
                </Row>
                <Row>
                  <div className="label">Created Date</div>
                  <div>
                    {moment
                      .utc(feed.created_at)
                      .local()
                      .format('DD/MM/yyyy HH:mm')}
                  </div>
                </Row>

                <Row>
                  <div className="label">Schedule Date</div>
                  <div className="orange-text">
                    {feed.scheduled_at
                      ? moment(feed.scheduled_at).format('DD/MM/yyyy HH:mm')
                      : '-'}
                  </div>
                </Row>
                <Row>
                  <div className="label">Published Date</div>
                  <div
                    className={feed.published_at ? 'green-text' : 'error-text'}
                  >
                    {feed.published_at
                      ? moment
                          .utc(feed.published_at)
                          .local()
                          .format('DD/MM/yyyy HH:mm')
                      : 'Unpublished'}
                  </div>
                </Row>
                <Row>
                  <div className="label">Pinned</div>
                  <div>{feed.pin_post === 1 ? 'Yes' : 'No'}</div>
                </Row>
                <Row wrap={false}>
                  <div className="label">Notification Message</div>
                  <div>
                    {feed.notification_message
                      ? feed.notification_message
                      : '-'}
                  </div>
                </Row>
                {!feed.deleted_at && (
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
                        label="Edit Post"
                        onClick={() =>
                          dispatch(
                            push(`../../admin/officials/${feed.feed_id}/edit`),
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
                        label="Delete Post"
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
                        !feed.published_at
                          ? 'Publish Post Now'
                          : 'Unpublish Post'
                      }
                      onClick={() => {
                        if (!feed.published_at) {
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
                  title="Delete Feed"
                  message="This action cannot be undone. Do you wish to delete this feed?"
                  leftAction={deletePost}
                  rightAction={() => setDeleteModalVisible(false)}
                />
                <ConfirmationPopupComponent
                  visibility={unpublishModalVisible}
                  dismissModal={() => {
                    setUnpublishModalVisible(false);
                  }}
                  title="Unpublish Post"
                  message="Do you wish to unpublish this post?"
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
                  title={`Publish ${
                    feed.feed_type === 'Announcement'
                      ? 'Announcement'
                      : 'Official Article'
                  }`}
                  message="This will be posted on the Activity Feed which can be viewed by all Live to Give users"
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
                    dispatch(push('../../../admin/officials'));
                  }}
                  title="Publish Successful"
                  message={`The ${
                    feed.feed_type === 'Announcement'
                      ? 'announcement'
                      : 'official article'
                  } has been published!`}
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

OfficialPostDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  officialPostDetailsPage: makeSelectOfficialPostDetailsPage(),
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
)(OfficialPostDetailsPage);
