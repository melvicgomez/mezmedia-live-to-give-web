/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * UserCommentingGuidelinesPage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row } from 'antd';
import { Colors } from 'theme/colors';
import { push } from 'connected-react-router';
import AppBarComponent from 'components/AppBarComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserCommentingGuidelinesPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div`
  background-color: ${Colors.background};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 1366px;
  min-height: calc(100vh-68px);
  display: flex;
  padding-top: 68px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto;

  > div {
    width: 70%;
    padding: 20px 0px;
  }
`;

const Content = styled.div`
  > div {
    p,
    ul {
      margin-bottom: 20px;
    }

    ul {
      width: 100%;
    }

    .title {
      width: 100%;
      margin-top: 5px;
    }
  }
`;

const Divider = styled.div`
  height: 2px;
  background-color: ${Colors.pureWhite};
  width: 100%;
  margin: 20px 0px;
`;
export function UserCommentingGuidelinesPage({ dispatch }) {
  useInjectReducer({ key: 'userCommentingGuidelinesPage', reducer });
  useInjectSaga({ key: 'userCommentingGuidelinesPage', saga });

  return (
    <div>
      <Helmet>
        <title>User Guidelines - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled className="white-text">
        <div>
          <Row
            justify="start"
            className="h1"
            style={{ margin: '20px 0px 10px' }}
          >
            User Commitments and Commenting Guidelines
          </Row>
          <Divider />
          <Content>
            <Row className="body">
              <p>
                As part of the Live to Give (LTG) platform, the ‘Activity Feed’
                enables you to comment, like and post images – an integral part
                of the platform that encourages all Users to interact with one
                another.
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
                In light of this, we ask you to agree to the following
                commitments:
              </p>
              <Row className="title">
                <p className="h3">Be Respectful</p>
              </Row>
              <p>
                You commit to having the utmost respect for other people’s
                views, ways of working, spiritual and cultural beliefs and
                opinions when uploading any content to LTG. You agree to upload
                content that is:
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
                LTG reserves the right to remove any comments, posts or images
                that we deem to not comply with the above.
              </p>
              <p>
                Any User Generated Content that is discriminatory on the grounds
                of protected characteristics such as (but not limited to) race,
                ethnicity, gender, religion, nationality, sexual orientation,
                disability or age are not permitted and may result in a ban from
                LTG.
              </p>
              <Row className="title">
                <p className="h3">Act with Integrity</p>
              </Row>
              <p>
                You commit to always be 100% honest with the information you
                post. You agree to upload content and engage with the platform
                in a way that is:
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
                Users who write comments that are misleading, untrue, repetitive
                or appear part of an organised effort or advertise (including
                linking to) businesses or products, may be banned from LTG.
              </p>
              <Row className="title">
                <p className="h3">Engage with Empathy</p>
              </Row>
              <p>
                Users who register for LTG represent young and old from all over
                the world – with many different backgrounds, interests, and
                experiences. By joining the platform and interacting with your
                peers, you commit to creating a safe and inclusive environment
                through engaging with empathy. We ask that when engaging with
                LTG, you aspire to:
              </p>
              <ul>
                <li>Be curious and open to different perspectives</li>
                <li>Be positive and encouraging of others</li>
                <li>Be thoughtful when posting</li>
                <li>Be patient when requesting support</li>
              </ul>
              <br />
              <Row className="title">
                <p className="h3">Be Purposeful</p>
              </Row>
              <p>
                LTG is designed to promote networks, communities and
                connectivity between colleagues, inspire Users to reconnect with
                their own sense of purpose and to give back to communities
                through charity partnerships. With this in mind, we ask that
                when engaging with LTG, you aspire to:
              </p>
              <ul>
                <li>
                  Form meaningful connections with peers from other business
                  areas and locations
                </li>
                <li>
                  Only post content that is related to LTG and its clubs, topics
                  and challenges
                </li>
                <li>
                  Remember that we are giving back – each B Coin earned will
                  positively and directly impact those less fortunate than
                  ourselves
                </li>
                <li>Have fun! </li>
              </ul>
              <p>
                We want LTG to be an authentic and safe space for connection,
                collaboration and engagement – and we need all Users to commit
                to help us create and sustain this environment. LTG moderators
                will endeavour to fully monitor all User Generated Content
                published on the platform at all times. Where we receive notice
                of any post/comment/image that does not comply with the
                guidelines in this document and/or is in breach of the{' '}
                <span
                  className="bodyLink cyan-text"
                  style={{ cursor: 'pointer' }}
                  onClick={() => dispatch(push('terms-and-conditions'))}
                >
                  User Terms and Conditions
                </span>{' '}
                , the User Generated Content in question will be reviewed, and
                at the discretion of the Moderators, any required actions will
                be taken to manage this content and User accordingly. If you are
                made aware of any inappropriate content, please notify us
                immediately{' '}
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
        </div>
      </PageWrapperStyled>
    </div>
  );
}

UserCommentingGuidelinesPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userCommentingGuidelinesPage: makeSelectUserCommentingGuidelinesPage(),
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
)(UserCommentingGuidelinesPage);
