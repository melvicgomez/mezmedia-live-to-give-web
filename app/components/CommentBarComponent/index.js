/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * CommentBarComponent
 *
 */

import React, { useState, createRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { Col, Row, Popover } from 'antd';
import UserAvatarComponent from 'components/UserAvatarComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import moment from 'moment';
import { reactLocalStorage } from 'reactjs-localstorage';

const PostCommentSection = styled(Row)`
  width: 100%;
  flex-flow: row;
  margin-bottom: 20px;
`;

const CommentDetails = styled.div`
  background-color: ${Colors.disabled};
  border-radius: 16px;
  margin-left: 20px;
  padding: 15px 15px 15px 20px;
`;

const ReadHideIndicator = styled.div`
  line-height: 22px;
  margin-top: 10px;
  padding: 0px;
  background-color: ${Colors.disabled};
  cursor: pointer;
  display: inline-block;
`;

const Content = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;
  margin: 10px 30px 5px 0px;

  ${props =>
    props.line === 4 &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    `}
`;

function CommentBarComponent({
  comment,
  selectComment,
  admin,
  setConfirmModalVisible,
}) {
  const user = reactLocalStorage.getObject('user');

  const content = createRef();

  const [visibility, setVisibility] = useState(false);
  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  useEffect(() => {
    const lineHeight = 22;
    const lines = Math.round(content.current.clientHeight / lineHeight);
    setLengthMore(lines > 4);
  }, []);

  const setSelectedComment = (visible, selectedComment) => {
    if (visible) {
      selectComment(selectedComment);
    } else {
      selectComment(null);
    }
    setVisibility(visible);
  };

  return (
    <PostCommentSection align="top">
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
          {lengthMore ? (
            <>
              <Content ref={content} className="body" line={textShown ? 0 : 4}>
                {comment.comment}
              </Content>
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
            <Content ref={content} className="body">
              {comment.comment}
            </Content>
          )}

          {!admin && (
            <Row justify="end">
              <Popover
                placement="topRight"
                content={
                  <div
                    className="bodyBold darkGrey-text"
                    style={{ padding: '0px 10px', cursor: 'pointer' }}
                    onClick={() => {
                      setVisibility(false);
                      setConfirmModalVisible(true);
                    }}
                  >
                    {comment.user.user_id === user.user_id
                      ? 'Delete Comment'
                      : 'Flag / Report Comment'}
                  </div>
                }
                trigger="click"
                visible={visibility}
                onVisibleChange={visible =>
                  setSelectedComment(visible, comment)
                }
              >
                <img
                  src={
                    comment.user.user_id === user.user_id
                      ? Images.deleteIcon
                      : Images.flagIcon
                  }
                  alt="next"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </Popover>
            </Row>
          )}
        </CommentDetails>
      </Col>
    </PostCommentSection>
  );
}

CommentBarComponent.propTypes = {
  admin: PropTypes.bool,
};

CommentBarComponent.defaultProps = {
  admin: false,
};

export default CommentBarComponent;
