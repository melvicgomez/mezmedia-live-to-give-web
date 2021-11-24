/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * LoginPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled, { css } from 'styled-components';
import { compose } from 'redux';
import { Button, Col, Row } from 'antd';
import { BrowserView, MobileView } from 'react-device-detect';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Helmet } from 'react-helmet';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { push, replace } from 'connected-react-router';
import { reactLocalStorage } from 'reactjs-localstorage';
import api from 'services';
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const Background = styled.div`
  background-image: url(${Images.background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const Logo = styled.img`
  max-width: 307px;
  margin-bottom: 35px;
`;

const RegisterButton = styled(Button)`
  background: ${Colors.blueGradient};
  border: none;
  border-radius: 16px;
  width: 334px;
  color: ${Colors.pureWhite};
  margin-top: 30;
  height: 46px;
  box-shadow: ${Colors.shadow} 0px 2px 2px 0px;
  outline: none;

  &:hover,
  :focus {
    background: ${Colors.blueGradient};
    color: ${Colors.pureWhite};
  }
`;

const LoginButton = styled(Button)`
  background: ${Colors.textInput};
  border: 2px solid ${Colors.pureWhite};
  border-radius: 16px;
  width: 334px;
  height: 46px;
  color: ${Colors.pureWhite};
  margin-top: 30;
  outline: none;

  &:hover,
  :focus {
    background: ${Colors.textInput};
    border: 2px solid ${Colors.pureWhite};
  }
`;

const Divider = styled.div`
  display: flex;
  width: 334px;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: space-between;
  color: ${Colors.pureWhite};
`;

const DividerLine = styled.div`
  height: 2px;
  width: 40%;
  background-color: ${Colors.pureWhite};
`;

const StoreLinkDiv = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  margin-top: 40px;
  margin-left: 20px;
`;

const MobileStoreLinkDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  text-align: center;
`;

const StoreLink = styled.img`
  width: 160px;

  ${props =>
    props.code &&
    css`
      width: 113px;
      margin-bottom: 15px;
      margin-left: 0;
    `}

  ${props =>
    props.mobile &&
    css`
      margin-bottom: 40px;
      width: 180px;
    `}
`;

const QrCodeDiv = styled.div`
  display: flex;
  width: 210px;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  color: ${Colors.pureWhite};
  text-align: center;
  line-height: 20px;
`;

const LeftSubContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  bottom: 25px;
  left: 40px;
`;

const SubContentLink = styled(Button)`
  border: none;
  color: ${Colors.pureWhite};
  outline: none;
  padding: 0;
  padding-right: 10px;
  height: 29px;
  background-color: ${Colors.transparent};

  &:focus {
    color: ${Colors.pureWhite};
  }
`;

const SubContentText = styled.a`
  color: ${Colors.pureWhite};
`;

const SubContentFooter = styled.div`
  color: ${Colors.pureWhite};
  margin-top: 5px;
  margin-right: 10px;
`;

const RightSubContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  bottom: 25px;
  right: 40px;
`;

const Description = styled.div`
  max-width: 20vw;
  color: ${Colors.pureWhite};
  font-size: 2vh;
`;

export function LoginPage({ dispatch }) {
  useInjectReducer({ key: 'loginPage', reducer });
  useInjectSaga({ key: 'loginPage', saga });

  const [showThankYou, setshowThankYou] = useState(false);

  useEffect(() => {
    // add this on pages that must not be accessible login
    const token = reactLocalStorage.getObject('token').access_token;
    if (token) {
      dispatch(replace('activity-feed'));
    }

    // for maintenance check
    api.get('api/check-system-maintenance').then(res => {
      setshowThankYou(res.data.status);
    });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Welcome - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>

      {showThankYou ? (
        <Background>
          <Row align="middle" justify="center">
            <Col span={12}>
              <Logo src={Images.logo} alt="headerLogo" />
              <div className="white-text body">
                Thank you for your engagement on Live to Give. We would like to
                acknowledge all you’ve achieved both on a personal level through
                taking part, as well as our collective impact as a team through
                earning B Coins and subsequent charity donations. The nine
                recipient charities thank you immensely for your engagement and
                efforts during the course of the campaign.
              </div>
            </Col>
          </Row>
        </Background>
      ) : (
        <div>
          <BrowserView>
            <Background>
              <Logo src={Images.logo} alt="headerLogo" />
              <RegisterButton
                type="primary"
                className="bodyBold"
                onClick={() => {
                  dispatch(push('register'));
                }}
              >
                Create an Account
              </RegisterButton>
              <Divider className="bodyBold">
                <DividerLine />
                or
                <DividerLine />
              </Divider>
              <LoginButton
                type="primary"
                className="bodyBold"
                onClick={() => {
                  dispatch(push('login'));
                }}
              >
                Login
              </LoginButton>
              <StoreLinkDiv>
                <QrCodeDiv className="captionBold">
                  <StoreLink code src={Images.googleQrCode} />
                  <StoreLink
                    src={Images.googlePlay}
                    onClick={() =>
                      window.open(
                        'https://play.google.com/store/apps/details?id=com.mezmedia.livetogive',
                      )
                    }
                  />
                </QrCodeDiv>
                <QrCodeDiv className="captionBold">
                  <StoreLink code src={Images.appleQrCode} />
                  <StoreLink
                    src={Images.appleStore}
                    onClick={() =>
                      window.open(
                        'https://apps.apple.com/us/app/live-to-give/id1558275330',
                      )
                    }
                  />
                </QrCodeDiv>
                <QrCodeDiv className="captionBold">
                  <StoreLink code src={Images.apkQrCode} />
                  No access to Google Play?
                  <div>
                    <a
                      className="captionLink anchor-link"
                      href="./app/livetogive_production_1_0.apk"
                      style={{ fontSize: 15 }}
                    >
                      Download Android APK here
                    </a>
                  </div>
                </QrCodeDiv>
              </StoreLinkDiv>
              <LeftSubContent>
                <SubContentLink type="link">
                  <SubContentText
                    className="captionLink anchor-link"
                    href="./contact-us"
                  >
                    Technical Support
                  </SubContentText>
                </SubContentLink>
                <SubContentLink type="link">
                  <SubContentText
                    className="captionLink anchor-link"
                    href="./terms-and-conditions"
                  >
                    Terms & Conditions
                  </SubContentText>
                </SubContentLink>
                <SubContentLink type="link">
                  <SubContentText
                    className="captionLink anchor-link"
                    href="./privacy-policy"
                  >
                    Privacy Policy
                  </SubContentText>
                </SubContentLink>
                <SubContentFooter className="caption">
                  ©Live to Give 2021.
                </SubContentFooter>
              </LeftSubContent>
              <RightSubContent>
                <Description className="caption">
                  The Live to Give Android app will use Google Fit to obtain
                  your activity data (such as running distance) to track your
                  progress in certain fitness activities that you may have
                  chosen to participate in.
                </Description>
              </RightSubContent>
            </Background>
          </BrowserView>
          <MobileView>
            <Background>
              <Logo src={Images.logo} alt="headerLogo" />
              <MobileStoreLinkDiv>
                <StoreLink
                  mobile
                  src={Images.googlePlay}
                  onClick={() =>
                    window.open(
                      'https://play.google.com/store/apps/details?id=com.mezmedia.livetogive',
                    )
                  }
                />
                <StoreLink
                  mobile
                  src={Images.appleStore}
                  onClick={() =>
                    window.open(
                      'https://apps.apple.com/us/app/live-to-give/id1558275330',
                    )
                  }
                />
                <div className="white-text">
                  <div className="bodyBold">No access to Google Play?</div>
                  <div>
                    <a
                      className="bodyLink anchor-link"
                      href="https://livetogive.co/app/livetogive_production_1_0.apk"
                    >
                      Download Android APK here
                    </a>
                  </div>
                </div>
              </MobileStoreLinkDiv>
            </Background>
          </MobileView>
        </div>
      )}
    </div>
  );
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
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
)(LoginPage);
