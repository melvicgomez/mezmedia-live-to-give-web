/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * UserPostCardComponent
 *
 */

import React, { memo, useEffect, useState, createRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import pusher from 'services/pusher';
import { compose } from 'redux';
import moment from 'moment';
import { push } from 'connected-react-router';
import { Row, Popover } from 'antd';
import axiosInstance from 'services';
import UserAvatarComponent from 'components/UserAvatarComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';

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
  cursor: pointer;

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

function UserPostCardComponent({ feed, actionOnFeed, dispatch, admin }) {
  const desc = createRef(null);

  const user = reactLocalStorage.getObject('user');

  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  const [isLikeUpdating, setIsLikeUpdating] = useState(false);
  const [isLiked, setIsLiked] = useState(!!feed.is_like);

  const [imgError, setImgError] = useState(false); // handle img crash

  // for flag post / delete post
  const [postActionModalVisible, setPostActionModalVisible] = useState(false);
  const [visibility, setVisibility] = useState(false);

  const [acknowledgeModalVisible, setAcknowledgeModalVisible] = useState(false);

  let tempCommentCtr = 0;
  const [commentCtr, setCommentCtr] = useState(0);

  let tempLikesCtr = 0;
  const [likesCtr, setLikesCtr] = useState(0);

  useEffect(() => {
    setIsLiked(feed.is_like === 1);
  }, [feed]);

  useMemo(() => {
    pusher.bind('new-comment', function(data) {
      const comment = JSON.parse(
        typeof data.comment === 'string' ? data.comment : {},
      );
      if (feed.feed_id === comment.feed_id) {
        tempCommentCtr++;
        setCommentCtr(tempCommentCtr);
      }
    });
  }, [feed]);

  // like counter
  useEffect(() => {
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
  }, [feed.likes_count]);

  const flagFeedPost = () => {
    setPostActionModalVisible(false);
    setAcknowledgeModalVisible(true);
  };

  const deletePost = () => {
    actionOnFeed(feed.feed_id, 'delete');
    setPostActionModalVisible(false);
  };

  const toogleLike = e => {
    e.stopPropagation();
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

  useEffect(() => {
    const lineHeight = 22;
    const lines = Math.round(desc.current.clientHeight / lineHeight);
    setLengthMore(lines > 4);
  }, []);

  return (
    <div
      onClick={() => {
        if (!admin) {
          dispatch(push(`../post/${feed.feed_id}`));
        }
      }}
    >
      <PostInfoSection>
        <Row justify="space-between" align="middle">
          <Row align="middle" wrap={false}>
            <UserAvatarComponent user={feed.user} />
            <PostInfo>
              <p className="h3">
                {feed.user ? feed.user.first_name : ''}{' '}
                {feed.user ? feed.user.last_name : ''}
              </p>
              <p className="captionBold">{feed.title}</p>
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
          </Row>
        </Row>
        <Content>
          {lengthMore ? (
            <>
              <Description ref={desc} className="body" line={textShown ? 0 : 4}>
                {feed.content}
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
        </Content>
      </PostInfoSection>
      {feed.images.length > 0 && !imgError ? (
        <PostPhoto
          src={`${process.env.IMAGE_URL_PREFIX}activity-feed/${feed.feed_id}/${
            feed.images[0].image_path
          }`}
          onError={() => setImgError(true)}
        />
      ) : null}
      <PostActionSection
        justify={admin ? 'end' : 'space-between'}
        align="middle"
      >
        {!admin && (
          <Popover
            placement="topLeft"
            content={
              <div
                className="bodyBold darkGrey-text"
                style={{ padding: '0px 10px', cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation();
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
            onVisibleChange={visible => {
              setVisibility(visible);
            }}
          >
            <img
              src={
                feed.user_id === user.user_id
                  ? Images.deleteIcon
                  : Images.flagIcon
              }
              onClick={e => {
                e.stopPropagation();
              }}
              alt="next"
              style={{ width: '25px', height: '25px', cursor: 'pointer' }}
            />
          </Popover>
        )}

        <Row>
          <Row align="middle">
            <ChatIcon>
              <img src={Images.chatIcon} alt="like" />
            </ChatIcon>
            <p className="bodyBold">
              {commentCtr + feed.comments_count >= 1000
                ? `${(commentCtr + feed.comments_count / 1000).toFixed(1)}k`
                : commentCtr + feed.comments_count}
            </p>
          </Row>
          <Row align="middle">
            <LikeIcon onClick={!admin ? toogleLike : null}>
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
        <ConfirmationPopupComponent
          visibility={postActionModalVisible}
          dismissModal={e => {
            e.stopPropagation();
            setPostActionModalVisible(false);
          }}
          title={
            feed.user_id === user.user_id ? 'Delete Post' : 'Flag / Report Post'
          }
          message={`This action cannot be undone. ${
            feed.user_id === user.user_id
              ? 'By deleting this post, you are deleting all associated likes and comments. Are you sure you wish to delete this post?'
              : 'Do you wish to flag / report this post for inappropriate content?'
          }`}
          leftAction={e => {
            e.stopPropagation();
            if (feed.user_id === user.user_id) {
              deletePost();
            } else {
              flagFeedPost();
            }
          }}
          rightAction={e => {
            e.stopPropagation();
            setPostActionModalVisible(false);
          }}
        />

        <ConfirmationPopupComponent
          visibility={acknowledgeModalVisible}
          dismissModal={e => {
            e.stopPropagation();
            setAcknowledgeModalVisible(false);
            actionOnFeed(feed.feed_id, 'flag');
          }}
          title="Thank you for your report"
          message="Thank you for reporting this post. It has been removed and will be moderated."
          actionRequire={false}
        />
      </PostActionSection>
    </div>
  );
}

UserPostCardComponent.propTypes = {
  admin: PropTypes.bool,
};

UserPostCardComponent.defaultProps = {
  admin: false,
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
)(UserPostCardComponent);
