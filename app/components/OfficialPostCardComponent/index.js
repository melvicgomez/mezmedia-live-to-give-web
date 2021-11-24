/* eslint-disable func-names */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-plusplus */
/**
 *
 * OfficialPostCardComponent
 *
 */
import React, { useEffect, useState, createRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row } from 'antd';
import axiosInstance from 'services';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';
import pusher from 'services/pusher';

const PostPhoto = styled.img`
  height: 428px;
  width: 100%;
  object-fit: cover;
`;

const OfficialIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-top: 2px;
  object-fit: cover !important;
  border-radius: 8px;
`;

const PostInfoSection = styled.div`
  width: 100%;
  padding: 15px 20px;
  background-color: ${Colors.digital};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  > p {
    margin-bottom: 15px;
  }
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

const Content = styled.div`
  padding: 20px 20px 10px;
  background-color: ${Colors.pureWhite};

  > p {
    margin-bottom: 10px;
  }
`;

const Description = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;

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

function OfficialPostCardComponent({ feed, onClick }) {
  const NUM_OF_LINES = 4;

  const desc = createRef();

  const user = reactLocalStorage.getObject('user');

  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  const [isLikeUpdating, setIsLikeUpdating] = useState(false);
  const [isLiked, setIsLiked] = useState(!!feed.is_like);

  const [likesCtr, setLikesCtr] = useState(0);
  const [commentCtr, setCommentCtr] = useState(0);

  let tempLikesCtr = 0;
  let tempCommentCtr = 0;

  useEffect(() => {
    tempLikesCtr = 0;
    // newCommentList.current = [];
    // setCommentsReceived([]);
    setCommentCtr(0);
    setIsLiked(feed.is_like === 1);
  }, [feed]);

  useMemo(() => {
    pusher.bind('new-comment', function(data) {
      const comment = JSON.parse(
        typeof data.comment === 'string' ? data.comment : {},
      );
      if (feed.feed_id === comment.feed_id) {
        //   const tempComments = [...newCommentList.current];
        //   if (
        //     tempComments.findIndex(c => c.comment_id === comment.comment_id) ===
        //     -1
        //   ) {
        //     newCommentList.current.unshift(comment);
        //     setCommentsReceived(newCommentList.current);
        //   }
        tempCommentCtr++;
        setCommentCtr(tempCommentCtr);
      }
    });
  }, [feed]);

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

  useEffect(() => {
    const lineHeight = 22;
    const lines = Math.round(desc.current.clientHeight / lineHeight);
    setLengthMore(lines > NUM_OF_LINES);
  }, []);

  return (
    <div>
      <div onClick={onClick}>
        <PostInfoSection className="white-text">
          <Row align="middle">
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
          </Row>
        </PostInfoSection>
        {feed.images.length > 0 ? (
          <PostPhoto
            src={`${process.env.IMAGE_URL_PREFIX}activity-feed/${
              feed.feed_id
            }/${feed.images[0].image_path}`}
          />
        ) : null}
        <Content className="darkGrey-text">
          <p className="h3">{feed.title}</p>
          {lengthMore ? (
            <>
              <Description ref={desc} className="body" line={textShown ? 0 : 4}>
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
        </Content>
      </div>
      <div>
        <PostActionSection
          className="darkGrey-text"
          justify="end"
          align="middle"
        >
          <Row align="middle" onClick={onClick}>
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
        </PostActionSection>
      </div>
    </div>
  );
}

OfficialPostCardComponent.propTypes = {
  feed: PropTypes.object,
  onClick: PropTypes.func,
};

OfficialPostCardComponent.defaultProps = {
  onClick: () => {},
};

export default OfficialPostCardComponent;
