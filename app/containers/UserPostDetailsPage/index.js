/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/**
 *
 * UserPostDetailsPage
 *
 */

import React, { memo, useEffect, useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import pusher from 'services/pusher';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Col, Row, Popover, Input, Spin, Modal } from 'antd';
import axiosInstance from 'services';
import UserAvatarComponent from 'components/UserAvatarComponent';
import CommentBarComponent from 'components/CommentBarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import CommunityGuidelinesComponent from 'components/CommunityGuidelinesComponent';
import AppBarComponent from 'components/AppBarComponent';
import { regexStr, hasInappropriateLanguage } from 'utils/constants';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserPostDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const { TextArea } = Input;

const PageWrapperStyled = styled.div`
  background-color: ${Colors.background};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: calc(100vh-68px);
  display: flex;
  padding-top: 68px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

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
  cursor: pointer;

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
  height: 428px;
  width: 100%;
  object-fit: cover;
`;

const PostCommentSection = styled(Row)`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const WriteComment = styled(Row)`
  width: 100%;
`;

const CommentInputButton = styled.div`
  background-color: ${Colors.grapefruit};
  border-radius: 16px;
  margin-left: 20px;
  padding: 10px 10px 10px 20px;
  height: 46px;
  cursor: pointer;
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 20px;
  margin: 10px 0px;
`;

const PopupModel = styled(Modal)`
  background-color: ${Colors.background};
  border-radius: 16px;
  padding-bottom: 0px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.background};
  }

  > .ant-modal-content {
    box-shadow: 0px;

    > button {
      color: ${Colors.pureWhite};
      top: -5px;
    }
  }
`;

const CommentInputSection = styled(Row)`
  border-radius: 16px;
  height: auto !important;
  width: 474px;
  box-shadow: inset 0px 1px 2px 0px #00000035;
  background-color: ${Colors.textInput};
  border: 2px solid ${Colors.pureWhite};
  padding: 10px 15px;
  margin: 40px 20px 20px;

  > textarea {
    width: 100%;
    color: ${Colors.pureWhite};
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export function UserPostDetailsPage({ match, dispatch }) {
  useInjectReducer({ key: 'userPostDetailsPage', reducer });
  useInjectSaga({ key: 'userPostDetailsPage', saga });

  const user = reactLocalStorage.getObject('user');
  const feedId = match.params.id;
  const desc = useRef(null);

  // for clean up unmount
  const unmounted = useRef(false);

  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState(''); // input for comment
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isLikeUpdating, setIsLikeUpdating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [commentActionVisible] = useState(false);

  // for flag comment / delete comment
  const [selectedComment, setSelectedComment] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // for flag post / delete post
  const [postActionModalVisible, setPostActionModalVisible] = useState(false);
  const [visibility, setVisibility] = useState(false);

  const [acknowledgeModalVisible, setAcknowledgeModalVisible] = useState(false);
  const [showGuideline, setShowGuideline] = useState(false);

  const [inappropriateWarnVisible, setInappropriateWarnVisible] = useState(
    false,
  );
  const [foreignWarnVisible, setForeignWarnVisible] = useState(false);
  const [error, setError] = useState({
    inappropriate: false,
    foreign: false,
  });

  const newCommentList = useRef([]);
  const [commentsReceived, setCommentsReceived] = useState([]);

  let tempCommentCtr = 0;
  const [commentCtr, setCommentCtr] = useState(0);

  let tempLikesCtr = 0;
  const [likesCtr, setLikesCtr] = useState(0);

  useMemo(() => {
    pusher.bind('new-comment', function(data) {
      const comment = JSON.parse(
        typeof data.comment === 'string' ? data.comment : {},
      );
      if (feedId === comment.feed_id) {
        const tempComments = [...newCommentList.current];
        if (
          tempComments.findIndex(c => c.comment_id === comment.comment_id) ===
          -1
        ) {
          tempComments.unshift(comment);
          newCommentList.current = tempComments;
          setCommentsReceived(tempComments);
        }
        tempCommentCtr++;
        setCommentCtr(tempCommentCtr);
      }
    });
  }, [feed]);

  // like counter
  useEffect(() => {
    if (feed) {
      tempLikesCtr = 0;
      setLikesCtr(0);
      pusher.bind('new-like', function(data) {
        if (feed.feed_id === data.feed_id) {
          tempLikesCtr += data.likeCount;
          setLikesCtr(tempLikesCtr);
          if (data.source_user_id === user.user_id)
            setIsLiked(data.likeCount === 1);
        }
      });
    }
  }, [feed && feed.likes_count]);

  useEffect(() => {
    window.scrollTo(0, 0);

    axiosInstance
      .get(`api/activity-feed/${feedId}?user_id=${user.user_id}`)
      .then(res => {
        if (!unmounted.current) {
          setFeed(res.data.data);
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

      newCommentList.current = [];
      setCommentsReceived([]);
      axiosInstance
        .get(
          `api/activity-feed-comment?feed_id=${feedId}&user_id=${user.user_id}`,
        )
        .then(res => {
          feed.comments_count = res.data.data.length;
          setComments(res.data.data);
          setIsLiked(!!feed.is_like);

          tempCommentCtr = 0;
          setCommentCtr(0);
          setCommentLoading(false);

          const lineHeight = 22;
          const lines = Math.round(desc.current.clientHeight / lineHeight);
          setLengthMore(lines > 4);
        })
        .finally(() => {
          setCommentLoading(false);
        });
    }
  }, [feed]);

  const submitComment = () => {
    const errorChecking = { ...error };
    errorChecking.inappropriate = hasInappropriateLanguage(commentInput);
    errorChecking.foreign = !regexStr.englishAndEmoji.test(commentInput);

    if (!errorChecking.inappropriate && !errorChecking.foreign) {
      axiosInstance
        .post('api/activity-feed-comment', {
          comment: commentInput,
          user_id: user.user_id,
          feed_id: feedId,
        })
        .then(() => {
          setCommentInput('');
          setCommentModalVisible(false);
        });
    } else {
      setForeignWarnVisible(errorChecking.foreign);
      setInappropriateWarnVisible(errorChecking.inappropriate);
      setError(errorChecking);
    }
  };

  const flagFeedPost = () => {
    setPostActionModalVisible(false);
    setAcknowledgeModalVisible(true);
  };

  const deletePost = () => {
    actionOnFeed(feedId, 'delete');
    setPostActionModalVisible(false);
  };

  const actionOnFeed = (id, action) => {
    if (action === 'flag') {
      axiosInstance
        .post('api/activity-feed-flag', {
          user_id: user.user_id,
          feed_id: id,
        })
        .then(() => {
          dispatch(goBack());
        });
    } else {
      axiosInstance.delete(`api/activity-feed/${id}`).then(() => {
        dispatch(goBack());
      });
    }
  };

  const deleteComment = () => {
    axiosInstance
      .delete(`api/activity-feed-comment/${selectedComment.comment_id}`, {
        user_id: user.user_id,
        feed_id: feedId,
      })
      .then(() => {
        const tempComments = [...comments].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        setComments(tempComments);

        const tempNewComments = [...newCommentList.current].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        newCommentList.current = tempNewComments;
        setCommentsReceived(newCommentList.current);

        feed.comments_count -= 1;
        setSelectedComment(null);
        setConfirmModalVisible(false);
      });
  };

  const flagComment = () => {
    axiosInstance
      .post('api/activity-feed-comment-flag', {
        user_id: user.user_id,
        comment_id: selectedComment.comment_id,
      })
      .then(() => {
        feed.comments_count -= 1;
        const tempComments = [...comments].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        setComments(tempComments);

        const tempNewComments = [...newCommentList.current].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        newCommentList.current = tempNewComments;
        setCommentsReceived(newCommentList.current);

        setConfirmModalVisible(false);
        setAcknowledgeModalVisible(true);
      });
  };

  const toogleLike = () => {
    if (!isLikeUpdating) {
      setIsLikeUpdating(true);
      axiosInstance
        .post('api/activity-feed-like', {
          user_id: user.user_id,
          feed_id: feedId,
        })
        .then(() => {
          setIsLiked(!isLiked);
        })
        .finally(() => {
          setIsLikeUpdating(false);
        });
    }
  };

  const agreeGuideline = () => {
    axiosInstance
      .post('api/user', { user_id: user.user_id, community_guidelines: 1 })
      .then(res => {
        reactLocalStorage.setObject('user', res.data.data.user);
        user.community_guidelines = res.data.data.user.community_guidelines;
        setShowGuideline(false);
      })
      .catch(() => {
        setShowGuideline(false);
      });
  };

  return (
    <div>
      <Helmet>
        <title>User Post Details - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled>
        {!loading ? (
          <div style={{ width: '612px', margin: '20px' }}>
            <PostInfoSection>
              <Row justify="space-between" align="middle">
                <Row align="middle">
                  <UserAvatarComponent user={feed.user} />
                  <PostInfo>
                    <p className="h3">
                      {feed.user ? feed.user.first_name : ''}{' '}
                      {feed.user ? feed.user.last_name : ''}
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
            {feed.images.length > 0 ? (
              <PostPhoto
                src={`${process.env.IMAGE_URL_PREFIX}activity-feed/${feedId}/${
                  feed.images[0].image_path
                }`}
              />
            ) : null}
            <PostActionSection justify="space-between" align="middle">
              <Popover
                placement="topLeft"
                content={
                  <div
                    className="bodyBold darkGrey-text"
                    style={{ padding: '0px 10px', cursor: 'pointer' }}
                    onClick={() => {
                      setVisibility(false);
                      setPostActionModalVisible(true);
                    }}
                  >
                    {feed.user_id === user.user_id
                      ? 'Delete Post'
                      : 'Flag / Report Post'}
                  </div>
                }
                trigger="click"
                visible={visibility}
                onVisibleChange={visible => setVisibility(visible)}
              >
                <img
                  src={
                    feed.user_id === user.user_id
                      ? Images.deleteIcon
                      : Images.flagIcon
                  }
                  alt="next"
                  style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                />
              </Popover>

              <Row>
                <Row align="middle">
                  <ChatIcon>
                    <img src={Images.chatIcon} alt="like" />
                  </ChatIcon>
                  <p className="bodyBold">
                    {commentCtr + feed.comments_count >= 1000
                      ? `${(commentCtr + feed.comments_count / 1000).toFixed(
                          1,
                        )}k`
                      : commentCtr + feed.comments_count}
                  </p>
                </Row>
                <Row align="middle">
                  <LikeIcon onClick={toogleLike}>
                    {isLiked ? (
                      <img src={Images.heartFilled} alt="like" />
                    ) : (
                      <img src={Images.heartOutlined} alt="like" />
                    )}
                  </LikeIcon>
                  <p className="bodyBold" style={{ marginRight: '15px' }}>
                    {likesCtr + feed.likes_count >= 1000
                      ? `${((likesCtr + feed.likes_count) / 1000).toFixed(1)}k`
                      : likesCtr + feed.likes_count}
                  </p>
                </Row>
              </Row>
              <PostCommentSection>
                {feed.comments_count + commentCtr > 0 &&
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
                    [...commentsReceived, ...comments].map(comment => (
                      <CommentBarComponent
                        key={comment.comment_id}
                        comment={comment}
                        selectComment={setSelectedComment}
                        setConfirmModalVisible={setConfirmModalVisible}
                        commentActionVisible={commentActionVisible}
                      />
                    ))
                  ))}
                <WriteComment align="middle">
                  <Col flex="none">
                    <UserAvatarComponent user={user} />
                  </Col>
                  <Col flex="auto">
                    <CommentInputButton
                      className="white-text bodyBold"
                      onClick={() => {
                        const checkStatus = reactLocalStorage.getObject('user')
                          .community_guidelines;
                        if (!checkStatus) {
                          setShowGuideline(true);
                        } else {
                          setCommentModalVisible(true);
                        }
                      }}
                    >
                      Write a comment...
                    </CommentInputButton>
                  </Col>
                </WriteComment>
              </PostCommentSection>
              <ConfirmationPopupComponent
                visibility={postActionModalVisible}
                dismissModal={() => setPostActionModalVisible(false)}
                title={
                  feed.user_id === user.user_id
                    ? 'Delete Post'
                    : 'Flag / Report Post'
                }
                message={`This action cannot be undone. ${
                  feed.user_id === user.user_id
                    ? 'By deleting this post, you are deleting all associated likes and comments. Are you sure you wish to delete this post?'
                    : 'Do you wish to flag / report this post for inappropriate content?'
                }`}
                leftAction={
                  feed.user_id === user.user_id ? deletePost : flagFeedPost
                }
                rightAction={() => setPostActionModalVisible(false)}
              />
              <ConfirmationPopupComponent
                visibility={inappropriateWarnVisible}
                dismissModal={() => {
                  setInappropriateWarnVisible(false);
                }}
                title="Inappropriate Language"
                message="It appears your comment contains inappropriate language which contravenes the Live to Give User Guidelines and cannot be published. Please review your comment and make the necessary edits. If this is incorrect, please contact the Support Team via the Settings page."
                actionRequire={false}
              />
              <ConfirmationPopupComponent
                visibility={foreignWarnVisible}
                dismissModal={() => {
                  setForeignWarnVisible(false);
                }}
                title="Only alphanumeric characters allowed"
                message="Please note that only alphanumeric characters (A-Z, a-z, 0-9), punctuation and emojis are allowed in your comments. Please amend your comment accordingly in order to successfully submit it"
                actionRequire={false}
              />
              <ConfirmationPopupComponent
                visibility={acknowledgeModalVisible}
                dismissModal={() => {
                  setAcknowledgeModalVisible(false);
                  selectedComment
                    ? setSelectedComment(null)
                    : actionOnFeed(feedId, 'flag');
                }}
                title="Thank you for your report"
                message={`Thank you for reporting this ${
                  selectedComment ? 'comment' : 'post'
                }. It has been removed and will be moderated.`}
                actionRequire={false}
              />
              {selectedComment && (
                <>
                  {selectedComment.user.user_id === user.user_id ? (
                    <ConfirmationPopupComponent
                      visibility={confirmModalVisible}
                      dismissModal={() => setConfirmModalVisible(false)}
                      title="Delete Comment"
                      message="This action cannot be undone. Do you wish to delete this comment?"
                      leftAction={deleteComment}
                      rightAction={() => setConfirmModalVisible(false)}
                    />
                  ) : (
                    <ConfirmationPopupComponent
                      visibility={confirmModalVisible}
                      dismissModal={() => setConfirmModalVisible(false)}
                      title="Flag / Report Comment"
                      message="This action cannot be undone. Do you wish to flag / report this comment for inappropriate content?"
                      leftAction={flagComment}
                      rightAction={() => setConfirmModalVisible(false)}
                    />
                  )}
                </>
              )}
              <PopupModel
                className="white-text"
                centered
                visible={commentModalVisible}
                onOk={() => setCommentModalVisible(false)}
                onCancel={() => {
                  setCommentModalVisible(false);
                  setCommentInput('');
                }}
                style={{ backgroundColor: Colors.background }}
                footer={null}
              >
                <CommentInputSection align="middle" className="white-text">
                  <TextArea
                    value={commentInput}
                    onChange={({ target: { value } }) => {
                      setCommentInput(value);
                    }}
                    placeholder={isFocused ? '' : 'Make a comment'}
                    className="bodyBold"
                    bordered={false}
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                  />
                </CommentInputSection>
                <Row justify="center">
                  <PrimaryButtonComponent
                    style={{ margin: '25px 0px 20px' }}
                    label="Submit"
                    onClick={submitComment}
                    disabled={!commentInput || !commentInput.trim().length}
                  />
                </Row>
              </PopupModel>
              <CommunityGuidelinesComponent
                visibility={showGuideline}
                dismissModal={() => setShowGuideline(false)}
                agreeGuideline={agreeGuideline}
              />
            </PostActionSection>
          </div>
        ) : (
          <Row justify="center">
            <Spin indicator={<LoadingSpinner spin />} />
          </Row>
        )}
      </PageWrapperStyled>
    </div>
  );
}

UserPostDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userPostDetailsPage: makeSelectUserPostDetailsPage(),
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
)(UserPostDetailsPage);
