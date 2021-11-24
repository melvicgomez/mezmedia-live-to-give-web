/**
 *
 * NotificationCardComponent
 *
 */

import React, { useState, useEffect, createRef } from 'react';
// import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { Colors } from 'theme/colors';

const Card = styled.div`
  padding: 25px;
  border-radius: 20px;
  background-color: ${Colors.darkGrey};

  .time,
  .title {
    margin-bottom: 10px;
  }
`;

const ReadHideIndicator = styled.div`
  line-height: 22px;
  margin-top: 10px;
  padding: 0px;
  cursor: pointer;
  display: inline-block;
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

function NotificationCardComponent({ data }) {
  const message = createRef();
  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  useEffect(() => {
    const lineHeight = 22;
    if (message.current) {
      const lines = Math.round(message.current.clientHeight / lineHeight);
      setLengthMore(lines > 3);
    }
  }, []);

  return (
    <Card>
      <div className="captionBold time">{`${moment
        .utc(data.created_at)
        .local()
        .format('DD MMM')} at ${moment
        .utc(data.created_at)
        .local()
        .format('h:mmA')}`}</div>
      {!!data.title && <div className="bodyBold title">{data.title}</div>}
      {!!data.message &&
        (lengthMore ? (
          <>
            <Description
              className="body"
              ref={message}
              line={textShown ? 0 : 4}
            >
              {data.message}
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
          <Description className="body" ref={message}>
            {data.message}
          </Description>
        ))}
    </Card>
  );
}

NotificationCardComponent.propTypes = {};

export default NotificationCardComponent;
