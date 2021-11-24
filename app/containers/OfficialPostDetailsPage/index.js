/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/**
 *
 * OfficialPostDetailsPage
 *
 */

import React, { memo, useEffect, useState, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import styled from 'styled-components';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import CommentBarComponent from 'components/CommentBarComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import CommunityGuidelinesComponent from 'components/CommunityGuidelinesComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { reactLocalStorage } from 'reactjs-localstorage';
import { regexStr, hasInappropriateLanguage } from 'utils/constants';
import { Row, Col, Spin, Modal, Input } from 'antd';
import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import DOMPurify from 'dompurify';
import moment from 'moment';
import pusher from 'services/pusher';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectOfficialPostDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const { TextArea } = Input;

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
const NoImagePlaceholder = styled(Row)`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: 3px solid ${Colors.pureWhite};
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

export function OfficialPostDetailsPage({ match }) {
  useInjectReducer({ key: 'officialPostDetailsPage', reducer });
  useInjectSaga({ key: 'officialPostDetailsPage', saga });

  const feedId = match.params.id;
  const user = reactLocalStorage.getObject('user');

  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState(null);

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

  const [commentsReceived, setCommentsReceived] = useState([]);
  const [likesCtr, setLikesCtr] = useState(0);
  const [commentCtr, setCommentCtr] = useState(0);

  const newCommentList = useRef([]);
  let tempLikesCtr = 0;
  let tempCommentCtr = 0;

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
          newCommentList.current.unshift(comment);
          setCommentsReceived(newCommentList.current);
        }
        tempCommentCtr++;
        setCommentCtr(tempCommentCtr);
      }
    });
  }, [feed]);

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
        setFeed(res.data.data);
      })
      .catch(() => {
        setLoading(false);
      });
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
          setComments(res.data.data);
          setIsLiked(!!feed.is_like);
          feed.comments_count = res.data.data.length;

          tempCommentCtr = 0;
          setCommentCtr(0);
          newCommentList.current = [];

          setCommentLoading(false);
        })
        .catch(() => {
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

  const deleteComment = () => {
    axiosInstance
      .delete(`api/activity-feed-comment/${selectedComment.comment_id}`, {
        user_id: user.user_id,
        feed_id: feedId,
      })
      .then(() => {
        const tempList = [...comments].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        setComments(tempList);

        const tempNewComments = [...newCommentList.current].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        newCommentList.current = tempNewComments;
        setCommentsReceived(newCommentList.current);

        feed.comments_count--;
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
        const tempList = [...comments].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        setComments(tempList);

        const tempNewComments = [...newCommentList.current].filter(
          comment => comment.comment_id !== selectedComment.comment_id,
        );
        newCommentList.current = tempNewComments;
        setCommentsReceived(newCommentList.current);

        feed.comments_count--;
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
          feed_id: feed.feed_id,
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
        <title>Library - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        match={match}
        rightContent={
          <div>
            <SideProfileComponent />
          </div>
        }
      >
        <PageWrapperStyled className="white-text">
          {!loading ? (
            <div className="white-text">
              {feed.images.length > 0 ? (
                <ActivityPhoto
                  src={`${
                    process.env.IMAGE_URL_PREFIX
                  }activity-feed/${feedId}/${feed.images[0].image_path}`}
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
                    {`${moment
                      .utc(feed.published_at)
                      .local()
                      .format('DD MMM')} at ${moment
                      .utc(feed.published_at)
                      .local()
                      .format('h:mmA')}`}
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
                        ? `${(likesCtr + feed.likes_count / 1000).toFixed(1)}k`
                        : likesCtr + feed.likes_count}
                    </p>
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

                    <WriteComment>
                      <Col flex="none">
                        <UserAvatarComponent user={user} />
                      </Col>
                      <Col flex="auto">
                        <CommentInputButton
                          className="white-text bodyBold"
                          onClick={() => {
                            const checkStatus = reactLocalStorage.getObject(
                              'user',
                            ).community_guidelines;
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
                      setSelectedComment(null);
                    }}
                    title="Thank you for your report"
                    message="Thank you for reporting this comment. It has been removed and will be moderated."
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
            </div>
          ) : (
            <Row justify="center">
              <Spin indicator={<LoadingSpinner spin />} />
            </Row>
          )}
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

OfficialPostDetailsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
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
