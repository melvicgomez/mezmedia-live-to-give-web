/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/**
 *
 * CommentDetailsPage
 *
 */

import React, { memo, useRef, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Row, Col, Spin } from 'antd';
import axiosInstance from 'services';
import UserAvatarComponent from 'components/UserAvatarComponent';
import CommentBarComponent from 'components/CommentBarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCommentDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

const PostInfoSection = styled.div`
  width: 100%;
  padding: 15px 20px;
  background-color: ${Colors.pureWhite};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  color: ${Colors.pureWhite};

  > p {
    margin-bottom: 15px;
  }
`;

const PostInfo = styled.div`
  margin-left: 15px;

  > p {
    color: ${Colors.bodyText};
    line-height: 16px;

    :first-child {
      line-height: 20px;
      margin-bottom: 2px;
    }
  }

  a:hover {
    color: ${Colors.bodyText};
  }
`;

const Content = styled.div`
  margin: 20px 0px 0px;
  color: ${Colors.bodyText};
`;

const Description = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;
  white-space: pre-line;
  word-wrap: break-word;

  ${props =>
    props.line === 4 &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    `}
`;

const PostActionSection = styled(Row)`
  width: 100%;
  padding: 15px 20px 15px;
  background-color: ${Colors.pureWhite};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  color: ${Colors.bodyText};

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

const PostPhoto = styled.img`
  height: 247px;
  width: 100%;
  object-fit: cover;
`;

const PostCommentSection = styled(Row)`
  width: 100%;
  margin-top: 30px;
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 20px;
  margin: 10px 0px;
`;

const LoadMoreButton = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const InfoSection = styled.div`
  margin-top: 30px;

  > div {
    margin-top: 5px;
  }

  .label {
    width: 160px;
    min-width: 160px;
  }

  a:hover {
    color: ${Colors.pureWhite};
  }
`;

const OfficialIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-top: 2px;
  object-fit: cover !important;
  border-radius: 8px;
`;

const OfficialPostInfoSection = styled.div`
  width: 100%;
  padding: 15px 20px;
  background-color: ${Colors.digital};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  > p {
    margin-bottom: 15px;
  }
`;

const OfficialPostInfo = styled.div`
  margin-left: 15px;

  > p {
    line-height: 16px;

    :first-child {
      line-height: 20px;
      margin-bottom: 2px;
    }
  }
`;

const OfficialContent = styled.div`
  padding: 20px 20px 10px;
  background-color: ${Colors.pureWhite};

  > p {
    margin-bottom: 10px;
  }
`;

const CommentDetails = styled.div`
  background-color: ${Colors.redHeart};
  border-radius: 16px;
  margin-left: 20px;
  padding: 15px 15px 15px 20px;
`;

const CommentBar = styled(Row)`
  width: 100%;
  flex-flow: row;
  margin-bottom: 20px;
`;

export function CommentDetailsPage({ match, location }) {
  useInjectReducer({ key: 'commentDetailsPage', reducer });
  useInjectSaga({ key: 'commentDetailsPage', saga });

  const commentId = match.params.id;
  const desc = useRef(null);

  // for clean up unmount
  const unmounted = useRef(false);

  const [commentDetails, setCommentDetails] = useState(null);

  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  const [commentList, setCommentList] = useState([]);
  const [loadMore, setLoadMore] = useState(false); // decide whether display more comments
  const [commentLoading, setCommentLoading] = useState(true);

  const [imgError, setImgError] = useState(false);

  const [isLiked] = useState(false);

  const [flagModalVisible, setFlagModalVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/admin/all-comments/${commentId}`)
      .then(res => {
        if (!unmounted.current) {
          const { activity_feed, ...data } = res.data;
          setCommentDetails(data);

          const { comments, ...feedDetails } = activity_feed;
          setFeed(feedDetails);
          setCommentList(comments);
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (feed) {
      setLoading(false);
      setCommentLoading(false);
    }
    setLoadMore(false);
  }, [feed]);

  useEffect(() => {
    if (desc.current) {
      const lineHeight = 22;
      const lines = Math.round(desc.current.clientHeight / lineHeight);
      setLengthMore(lines > 4);
    }
  }, [desc.current]);

  const restoreComment = () => {
    axiosInstance
      .put(`api/admin/all-comments/${commentId}?action=unflag`)
      .then(() => {
        commentDetails.recent_flag = null;
        setFlagModalVisible(false);
      })
      .catch(() => {
        setFlagModalVisible(false);
      });
  };

  const flagComment = () => {
    axiosInstance
      .put(`api/admin/all-comments/${commentId}?action=flag`)
      .then(res => {
        commentDetails.recent_flag = res.data;
        setFlagModalVisible(false);
      })
      .catch(() => {
        setFlagModalVisible(false);
      });
  };

  const FlaggedCommentBar = ({ comment }) => (
    <CommentBar className="white-text" align="top">
      <Col flex="none">
        <UserAvatarComponent user={comment.user} />
      </Col>
      <Col flex="auto">
        <CommentDetails>
          <div className="captionBold">
            {comment.user.first_name} {comment.user.last_name}
          </div>
          <div className="caption">
            {`${moment
              .utc(comment.created_at)
              .local()
              .format('DD MMM')} at ${moment
              .utc(comment.created_at)
              .local()
              .format('h:mmA')}`}
          </div>
          <Row
            className="body"
            style={{ lineHeight: '22px', margin: '10px 30px 5px 0px' }}
          >
            {comment.comment}
          </Row>
        </CommentDetails>
      </Col>
    </CommentBar>
  );

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
              {feed.feed_type === 'feed' ? (
                <div
                  style={{ width: '400px', minWidth: '400px', margin: '20px' }}
                >
                  <PostInfoSection>
                    <Row justify="space-between" align="middle">
                      <Row wrap={false}>
                        <a href={`/admin/users/${feed.user.user_id}`}>
                          <UserAvatarComponent user={feed.user} />
                        </a>
                        <PostInfo>
                          <p className="h3">
                            <a
                              className="darkGrey-text"
                              href={`/admin/users/${feed.user.user_id}`}
                            >
                              {feed.user ? feed.user.first_name : ''}{' '}
                              {feed.user ? feed.user.last_name : ''}
                            </a>
                          </p>
                          <p className="captionBold">
                            {`${moment
                              .utc(feed.published_at)
                              .local()
                              .format('DD MMM')} at ${moment
                              .utc(feed.published_at)
                              .local()
                              .format('h:mmA')}`}
                          </p>
                          <p className="captionBold">{feed.title}</p>
                        </PostInfo>
                      </Row>
                    </Row>
                    <Content>
                      {lengthMore ? (
                        <>
                          <Description
                            ref={desc}
                            className="body"
                            line={textShown ? 0 : 4}
                          >
                            {feed.content.trim()}
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
                          {feed.content.trim()}
                        </Description>
                      )}
                    </Content>
                  </PostInfoSection>
                  {feed.images.length > 0 && !imgError ? (
                    <PostPhoto
                      src={`${process.env.IMAGE_URL_PREFIX}activity-feed/${
                        feed.feed_id
                      }/${feed.images[0].image_path}`}
                      onError={() => setImgError(true)}
                    />
                  ) : null}
                  <PostActionSection justify="end" align="middle">
                    <Row>
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
                            (loadMore
                              ? commentList
                              : commentList.slice(0, 3)
                            ).map(comment =>
                              comment.comment_id ===
                                commentDetails.comment_id &&
                              !!commentDetails.recent_flag ? (
                                <FlaggedCommentBar
                                  key={comment.comment_id}
                                  comment={comment}
                                />
                              ) : (
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
              ) : (
                <div
                  style={{ width: '400px', minWidth: '400px', margin: '20px' }}
                >
                  <OfficialPostInfoSection className="white-text">
                    <Row align="middle">
                      <OfficialIcon src={Images.avatarBwell} />
                      <OfficialPostInfo className="white-text">
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
                          {`${moment
                            .utc(feed.published_at)
                            .local()
                            .format('DD MMM')} at ${moment
                            .utc(feed.published_at)
                            .local()
                            .format('h:mmA')}`}
                        </p>
                      </OfficialPostInfo>
                    </Row>
                  </OfficialPostInfoSection>
                  {feed.images.length > 0 && !imgError ? (
                    <PostPhoto
                      src={`${process.env.IMAGE_URL_PREFIX}activity-feed/${
                        feed.feed_id
                      }/${feed.images[0].image_path}`}
                      onError={() => setImgError(true)}
                    />
                  ) : null}
                  <OfficialContent className="darkGrey-text">
                    <p className="h3">{feed.title}</p>
                    {lengthMore ? (
                      <>
                        <Description
                          ref={desc}
                          className="body"
                          line={textShown ? 0 : 4}
                        >
                          {feed.content} {feed.content} {feed.content}
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
                        {feed.content}
                      </Description>
                    )}
                  </OfficialContent>
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
                            (loadMore
                              ? commentList
                              : commentList.slice(0, 3)
                            ).map(comment =>
                              comment.comment_id ===
                                commentDetails.comment_id &&
                              !!commentDetails.recent_flag ? (
                                <FlaggedCommentBar
                                  key={comment.comment_id}
                                  comment={comment}
                                />
                              ) : (
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
                    </PostActionSection>
                  </div>
                </div>
              )}
              <InfoSection className="white-text bodyBold">
                <Row>
                  <div className="label">Feed ID</div>
                  <div>{feed.feed_id}</div>
                </Row>
                <Row>
                  <div className="label">Posted By</div>
                  <div>
                    <a
                      className="white-text"
                      href={`/admin/users/${commentDetails.user.user_id}`}
                    >{`${commentDetails.user.first_name} ${
                      commentDetails.user.last_name
                    }`}</a>
                  </div>
                </Row>
                <Row>
                  <div className="label">Posted Date</div>
                  <div>
                    {moment
                      .utc(commentDetails.created_at)
                      .local()
                      .format('DD/MMM/yyyy HH:mm')}
                  </div>
                </Row>
                <Row>
                  <div className="label">Reported By</div>
                  <div>
                    {commentDetails.recent_flag ? (
                      <a
                        className="white-text"
                        href={`/admin/users/${
                          commentDetails.recent_flag.user.user_id
                        }`}
                      >{`${commentDetails.recent_flag.user.first_name} ${
                        commentDetails.recent_flag.user.last_name
                      }`}</a>
                    ) : (
                      '-'
                    )}
                  </div>
                </Row>
                <Row>
                  <div className="label">Reported Date</div>
                  <div>
                    {commentDetails.recent_flag
                      ? moment
                          .utc(commentDetails.recent_flag.created_at)
                          .local()
                          .format('DD/MMM/yyyy HH:mm')
                      : '-'}
                  </div>
                </Row>
                <Row wrap={false}>
                  <div className="label">Comment</div>
                  <div>{commentDetails.comment}</div>
                </Row>
                {!commentDetails.deleted_at && (
                  <Row>
                    <PrimaryButtonComponent
                      style={{
                        padding: '0px 30px',
                        marginTop: '25px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      label={
                        commentDetails.recent_flag
                          ? 'Restore this Comment'
                          : 'Flag this Comment'
                      }
                      onClick={() => setFlagModalVisible(true)}
                      iconRight
                    />
                  </Row>
                )}
                <ConfirmationPopupComponent
                  visibility={flagModalVisible}
                  dismissModal={() => {
                    setFlagModalVisible(false);
                  }}
                  title={
                    commentDetails.recent_flag
                      ? 'Restore Comment'
                      : 'Flag Comment'
                  }
                  message={`Do you wish to ${
                    feed.recent_flag ? 'restore' : 'flag'
                  } this user's comment?`}
                  leftAction={feed.recent_flag ? restoreComment : flagComment}
                  rightAction={() => setFlagModalVisible(false)}
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

CommentDetailsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  commentDetailsPage: makeSelectCommentDetailsPage(),
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
)(CommentDetailsPage);
