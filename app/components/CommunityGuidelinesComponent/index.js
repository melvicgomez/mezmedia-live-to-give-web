/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * CommunityGuidelinesComponent
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Modal } from 'antd';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import styled from 'styled-components';
import { Colors } from 'theme/colors';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

const Popup = styled(Modal)`
  background-color: ${Colors.pureWhite} !important;
  border-radius: 16px;
  padding-bottom: 0px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.pureWhite};
  }

  > .ant-modal-content {
    box-shadow: 0px !important;
    padding: 30px 30px 10px;
    width: 620px;

    > .ant-modal-body {
      padding: 24px 24px 10px;

      > div {
        margin-bottom: 20px;
      }
    }

    > button {
      top: -5px;
    }
  }
`;

const Content = styled.div`
  height: 62vh;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  > div {
    p,
    ul {
      margin-bottom: 15px;
    }

    ul {
      width: 100%;
    }

    .title {
      margin-top: 5px;
    }
  }
`;

function CommunityGuidelinesComponent({
  visibility,
  dismissModal,
  agreeGuideline,
  dispatch,
}) {
  const [disabled, setDisabled] = useState(true);

  const handleScroll = e => {
    const bottom =
      e.target.scrollHeight - Math.ceil(e.target.scrollTop) ===
      e.target.clientHeight;
    if (bottom) {
      setDisabled(false);
    }
  };

  return (
    <Popup
      className="darkGrey-text"
      centered
      visible={visibility}
      onCancel={dismissModal}
      footer={null}
    >
      <Row justify="center" className="h3">
        User Commitments and Commenting Guidelines
      </Row>
      <Content onScroll={handleScroll}>
        <Row className="body">
          <p>
            As part of the Live to Give (LTG) platform, the ‘Activity Feed’
            enables you to comment, like and post images – an integral part of
            the platform that encourages all Users to interact with one another.
          </p>
          <p>
            You are responsible for all content you upload (User Generated
            Content)
          </p>
          <p>
            In order to ensure that the ‘Activity Feed’ is enjoyable for all
            Users, all User Generated Content on the platform needs to be
            respectful, encouraging, honest and inclusive.
          </p>
          <p>
            In light of this, we ask you to agree to the following commitments:
          </p>
          <p className="title bodyBold">Be Respectful</p>
          <p>
            You commit to having the utmost respect for other people’s views,
            ways of working, spiritual and cultural beliefs and opinions when
            uploading any content to LTG. You agree to upload content that is:
          </p>
          <ul>
            <li>Polite</li>
            <li>Relevant</li>
            <li>Concise</li>
            <li>Appropriate</li>
            <li>
              Absent of offensive and derogatory language (including
              profanities)
            </li>
            <li>Constructive</li>
            <li>Uncritical</li>
            <li>Not insulting to others</li>
            <li>
              Not posted to intentionally upset another user, or to get
              attention or cause trouble
            </li>
            <li>Not suggestive of political campaigning or lobbying</li>
          </ul>
          <p>
            LTG reserves the right to remove any comments, posts or images that
            we deem to not comply with the above.
          </p>
          <p>
            Any User Generated Content that is discriminatory on the grounds of
            protected characteristics such as (but not limited to) race,
            ethnicity, gender, religion, nationality, sexual orientation,
            disability or age are not permitted and may result in a ban from
            LTG.
          </p>
          <p className="title bodyBold">Act with Integrity</p>
          <p>
            You commit to always be 100% honest with the information you post.
            You agree to upload content and engage with the platform in a way
            that is:
          </p>
          <ul>
            <li>Original (that you own or have the rights to share)</li>
            <li>
              Respectful of copyrights, trademarks, and other legal rights
            </li>
            <li>Respectful of third party confidential information</li>
            <li>Compliant with local laws and regulations</li>
            <li>
              Respectful of other Users’ personal data (not collecting or
              storing their data)
            </li>
            <li>Not interfering with the functionality of LTG</li>
            <li>Not repetitive in nature</li>
            <li>Not indicative of commercial intent</li>
          </ul>
          <p>
            Users who write comments that are misleading, untrue, repetitive or
            appear part of an organised effort or advertise (including linking
            to) businesses or products, may be banned from LTG.
          </p>
          <p className="title bodyBold">Engage with Empathy</p>
          <p>
            Users who register for LTG represent young and old from all over the
            world – with many different backgrounds, interests, and experiences.
            By joining the platform and interacting with your peers, you commit
            to creating a safe and inclusive environment through engaging with
            empathy. We ask that when engaging with LTG, you aspire to:
          </p>
          <ul>
            <li>Be curious and open to different perspectives</li>
            <li>Be positive and encouraging of others</li>
            <li>Be thoughtful when posting</li>
            <li>Be patient when requesting support</li>
          </ul>
          <br />
          <p className="title bodyBold">Be Purposeful</p>
          <p>
            LTG is designed to promote networks, communities and connectivity
            between colleagues, inspire Users to reconnect with their own sense
            of purpose and to give back to communities through charity
            partnerships. With this in mind, we ask that when engaging with LTG,
            you aspire to:
          </p>
          <ul>
            <li>
              Form meaningful connections with peers from other business areas
              and locations
            </li>
            <li>
              Only post content that is related to LTG and its clubs, topics and
              challenges
            </li>
            <li>
              Remember that we are giving back – each B Coin earned will
              positively and directly impact those less fortunate than ourselves
            </li>
            <li>Have fun! </li>
          </ul>
          <p>
            We want LTG to be an authentic and safe space for connection,
            collaboration and engagement – and we need all Users to commit to
            help us create and sustain this environment. LTG moderators will
            endeavour to fully monitor all User Generated Content published on
            the platform at all times. Where we receive notice of any
            post/comment/image that does not comply with the guidelines in this
            document and/or is in breach of the{' '}
            <span
              className="bodyLink cyan-text"
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch(push('../../terms-and-conditions'))}
            >
              User Terms and Conditions
            </span>{' '}
            , the User Generated Content in question will be reviewed, and at
            the discretion of the Moderators, any required actions will be taken
            to manage this content and User accordingly. If you are made aware
            of any inappropriate content, please notify us immediately{' '}
            <span
              className="bodyLink cyan-text"
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch(push('../../settings/contact-us'))}
            >
              here
            </span>
          </p>
        </Row>
      </Content>
      <Row justify="center">
        <PrimaryButtonComponent
          style={{
            padding: '0px 30px',
            marginTop: '15px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
          label="Yes, I have read and agree to the guidelines"
          onClick={agreeGuideline}
          iconRight={false}
          disabled={disabled}
        />
      </Row>
    </Popup>
  );
}

CommunityGuidelinesComponent.propTypes = {
  visibility: PropTypes.bool,
  dismissModal: PropTypes.func,
  agreeGuideline: PropTypes.func,
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
)(CommunityGuidelinesComponent);
