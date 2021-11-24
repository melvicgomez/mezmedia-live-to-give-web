/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * PostDetailsPage
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
import { Row, Spin } from 'antd';
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
import makeSelectPostDetailsPage from './selectors';
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
  }

  a:hover {
    color: ${Colors.pureWhite};
  }
`;

export function PostDetailsPage({ match, location }) {
  useInjectReducer({ key: 'postDetailsPage', reducer });
  useInjectSaga({ key: 'postDetailsPage', saga });

  const feedId = match.params.id;
  const desc = useRef(null);

  // for clean up unmount
  const unmounted = useRef(false);

  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  const [comments, setComments] = useState([]);
  const [loadMore, setLoadMore] = useState(false); // decide whether display more comments
  const [commentLoading, setCommentLoading] = useState(true);

  const [imgError, setImgError] = useState(false);

  const [isLiked] = useState(false);

  const [flagModalVisible, setFlagModalVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/admin/all-posts/${feedId}`)
      .then(res => {
        if (!unmounted.current) {
          setFeed(res.data);
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

      axiosInstance
        .get(`api/admin/posts-get-comments?feed_id=${feedId}`)
        .then(res => {
          const lineHeight = 22;
          const lines = Math.round(desc.current.clientHeight / lineHeight);
          setLengthMore(lines > 4);

          feed.comments_count = res.data.data.length;
          setComments(res.data.data);

          setCommentLoading(false);
        })
        .finally(() => {
          setCommentLoading(false);
        });
    }
    setLoadMore(false);
  }, [feed]);

  const restorePost = () => {
    axiosInstance
      .put(`api/admin/all-posts/${feedId}?action=unflag`)
      .then(() => {
        feed.recent_flag = null;
        setFlagModalVisible(false);
      })
      .catch(() => {
        setFlagModalVisible(false);
      });
  };

  const flagPost = () => {
    axiosInstance
      .put(`api/admin/all-posts/${feedId}?action=flag`)
      .then(res => {
        feed.recent_flag = res.data;
        setFlagModalVisible(false);
      })
      .catch(() => {
        setFlagModalVisible(false);
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
            <Row>
              <div style={{ width: '400px', margin: '20px' }}>
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
                    src={`${
                      process.env.IMAGE_URL_PREFIX
                    }activity-feed/${feedId}/${feed.images[0].image_path}`}
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
                      href={`/admin/users/${feed.user.user_id}`}
                    >{`${feed.user.first_name} ${feed.user.last_name}`}</a>
                  </div>
                </Row>
                <Row>
                  <div className="label">Posted Date</div>
                  <div>
                    {moment
                      .utc(feed.published_at)
                      .local()
                      .format('DD/MMM/yyyy HH:mm')}
                  </div>
                </Row>
                <Row>
                  <div className="label">Reported By</div>
                  <div>
                    {feed.recent_flag ? (
                      <a
                        className="white-text"
                        href={`/admin/users/${feed.recent_flag.user.user_id}`}
                      >{`${feed.recent_flag.user.first_name} ${
                        feed.recent_flag.user.last_name
                      }`}</a>
                    ) : (
                      '-'
                    )}
                  </div>
                </Row>
                <Row>
                  <div className="label">Reported Date</div>
                  <div>
                    {feed.recent_flag
                      ? moment
                          .utc(feed.recent_flag.created_at)
                          .local()
                          .format('DD/MMM/yyyy HH:mm')
                      : '-'}
                  </div>
                </Row>
                <Row>
                  <div className="label">Deleted Date</div>
                  <div>
                    {feed.deleted_at
                      ? moment
                          .utc(feed.deleted_at)
                          .local()
                          .format('DD/MMM/yyyy HH:mm')
                      : '-'}
                  </div>
                </Row>
                {!feed.deleted_at && (
                  <Row>
                    <PrimaryButtonComponent
                      style={{
                        padding: '0px 30px',
                        marginTop: '25px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      label={
                        feed.recent_flag
                          ? 'Restore this Post'
                          : 'Flag this Post'
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
                  title={feed.recent_flag ? 'Restore Post' : 'Flag Post'}
                  message={`Do you wish to ${
                    feed.recent_flag ? 'restore' : 'flag'
                  } this user's post?`}
                  leftAction={feed.recent_flag ? restorePost : flagPost}
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

PostDetailsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  postDetailsPage: makeSelectPostDetailsPage(),
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
)(PostDetailsPage);
