/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * UserSettingsPage
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Row, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import axiosInstance from 'services';
import { replace, push } from 'connected-react-router';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import TextInputComponent from 'components/TextInputComponent';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Colors } from 'theme/colors';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserSettingsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div`
  .personal-setting {
    padding-bottom: 10px;
    border-bottom: 2px solid ${Colors.pureWhite};

    > div {
      margin-bottom: 30px;
    }
  }

  .technical-support {
    padding: 35px 0px;
    border-bottom: 2px solid ${Colors.pureWhite};

    .header {
      margin-bottom: 10px;
    }
  }

  .web-version {
    padding-top: 20px;

    > div {
      margin-bottom: 20px;
    }
  }
`;

const PopupModel = styled(Modal)`
  background-color: ${Colors.background};
  border-radius: 16px;
  padding: 15px 0px 5px;
  color: ${Colors.pureWhite};
  overflow: hidden;
  margin: 20px 0px;

  > div {
    background-color: ${Colors.background};
  }

  > .ant-modal-content {
    box-shadow: none;
    padding: 0px 40px;

    > button {
      color: ${Colors.pureWhite};
      top: -18px;
      right: 0px;
    }
  }

  .error-messages {
    background: ${Colors.white};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.3);
    margin-bottom: 10px;
    display: flex;
    margin-top: 25px;
  }
`;

export function UserSettingsPage({ match, dispatch }) {
  useInjectReducer({ key: 'userSettingsPage', reducer });
  useInjectSaga({ key: 'userSettingsPage', saga });

  const user = reactLocalStorage.getObject('user');

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const userLogout = () => {
    if (!logoutLoading)
      axiosInstance
        .delete('api/logout')
        .then(async () => {
          reactLocalStorage.remove('user');
          reactLocalStorage.remove('token');
          setConfirmLogout(false);
          dispatch(replace(''));
        })
        .catch(() => {
          setLogoutLoading(false);
        });
  };

  const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidPassConfirm, setIsValidPassConfirm] = useState(true);
    const [isValidCurrentPassword, setIsValidCurrentPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [isCurrentPassExists, setIsCurrentPassExists] = useState(true);
    const [hasError, setHasError] = useState(false);

    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const submitChangePassword = () => {
      setIsLoading(true);
      axiosInstance
        .put(`api/change-password/${user.user_id}`, {
          old_password: currentPassword,
          new_password: password,
        })
        .then(success => {
          if (success.data.error !== undefined) {
            setIsCurrentPassExists(false);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setSuccessModalVisible(true);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    };

    const validate = type => {
      setHasError(true);
      let errorCtr = 0;

      const passwordRegex = /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$/;
      // password e.g: BArclays123, (?=.*?\W) to check one special charater

      if (type === 'passwordCurrent') {
        setIsValidCurrentPassword(passwordRegex.test(currentPassword.trim()));
        if (!passwordRegex.test(currentPassword)) errorCtr += 1;
      } else if (type === 'password') {
        setIsValidPassword(passwordRegex.test(password.trim()));
        if (!passwordRegex.test(password)) errorCtr += 1;
      } else if (type === 'passwordConfirm') {
        setIsValidPassConfirm(password === passwordConfirm);
        if (!passwordRegex.test(passwordConfirm.trim())) errorCtr += 1;
        if (passwordConfirm !== password) errorCtr += 1;
      }

      if (errorCtr > 0) {
        setHasError(true);
      }
    };
    return (
      <PopupModel
        centered
        maskClosable={false}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        className="bodyBold"
        style={{ backgroundColor: Colors.background }}
        footer={null}
      >
        <TextInputComponent
          title="Your Current Password"
          defaultValue={currentPassword}
          value={currentPassword}
          type="password"
          placeholder="Enter your current password"
          hasError={!isCurrentPassExists || !isValidCurrentPassword}
          onChange={value => {
            setCurrentPassword(value);
          }}
          onFocus={() => {
            setIsCurrentPassExists(true);
            setIsValidCurrentPassword(true);
          }}
          onBlur={() => {
            validate('passwordCurrent');
          }}
        />
        <TextInputComponent
          title="Create New Password"
          caption="Your password must include at least 8 characters, 1 uppercase, 1 lowercase & 1 number."
          defaultValue={password}
          value={password}
          type="password"
          placeholder="Enter a secure password"
          hasError={!isValidPassword}
          onChange={value => {
            setPassword(value);
          }}
          onFocus={() => {
            setIsValidPassword(true);
          }}
          onBlur={() => {
            validate('password');
          }}
        />
        <TextInputComponent
          title="Confirm Password"
          defaultValue={passwordConfirm}
          value={passwordConfirm}
          type="password"
          placeholder="Enter the same password again"
          hasError={!isValidPassConfirm}
          onChange={value => {
            setPasswordConfirm(value);
          }}
          onFocus={() => {
            setIsValidPassConfirm(true);
          }}
          onBlur={() => {
            validate('passwordConfirm');
          }}
        />

        {hasError &&
        (!isCurrentPassExists ||
          !isValidCurrentPassword ||
          !isValidPassword ||
          !isValidPassConfirm) ? (
          <div className="error-messages">
            <Row style={{ marginTop: '5px' }}>
              <ExclamationCircleFilled
                className="error-text"
                style={{ marginRight: 12 }}
              />
            </Row>
            <div className="error-text">
              {!isCurrentPassExists && <div>• Wrong Current Password.</div>}
              {!isValidCurrentPassword && (
                <div>• Please enter a valid password.</div>
              )}
              {!isValidPassword && (
                <div>
                  • Your password must include at least 8 characters, 1
                  uppercase, 1 lowercase & 1 number.
                </div>
              )}
              {!isValidPassConfirm && <div>• Password does not match.</div>}
            </div>
          </div>
        ) : null}

        <Row justify="center" style={{ width: '100%' }}>
          <PrimaryButtonComponent
            style={{
              margin: '20px 0px 0px',
            }}
            label="Change your Password"
            onClick={() => {
              // API call if succeed, move to main screen
              if (password && passwordConfirm && currentPassword) {
                if (
                  isCurrentPassExists &&
                  isValidCurrentPassword &&
                  isValidPassword &&
                  isValidPassConfirm
                ) {
                  if (isValidPassword === isValidPassConfirm) {
                    if (passwordConfirm === password)
                      if (!isLoading) submitChangePassword();
                  }
                }
              }
            }}
            disabled={!password || !passwordConfirm || !currentPassword}
            loading={isLoading}
            iconRight={false}
          />
        </Row>
        <ConfirmationPopupComponent
          visibility={successModalVisible}
          dismissModal={() => {
            setSuccessModalVisible(false);
            setModalVisible(false);
            reactLocalStorage.clear();
            dispatch(replace('login'));
          }}
          title="Password Changed!"
          message="Your password has been changed successfully"
          actionRequire={false}
        />
      </PopupModel>
    );
  };

  return (
    <div>
      <Helmet>
        <title>Settings - Live to Give</title>
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
        <PageWrapperStyled className="body white-text">
          <div className="personal-setting">
            <div className="h3 white-text header">Personal Settings</div>
            <Row justify="space-between">
              <div className="bodyBold">Email</div>
              <div>{user.email}</div>
            </Row>
            <Row justify="space-between">
              <div className="bodyBold">Change Password</div>
              <div
                className="bodyLink"
                style={{ cursor: 'pointer' }}
                onClick={() => setModalVisible(true)}
              >
                Change
              </div>
            </Row>
            <Row justify="end">
              <div
                className="bodyLink"
                style={{ cursor: 'pointer' }}
                onClick={() => setConfirmLogout(true)}
              >
                Logout
              </div>
            </Row>
          </div>
          <div className="technical-support">
            <div className="h3 white-text header">Technical Support & FAQs</div>
            <div>
              Read our{' '}
              <a
                className="bodyLink anchor-link"
                href="https://support.livetogive.co/ "
                target="_blank"
              >
                FAQs
              </a>{' '}
              or contact our Support Team{' '}
              <span
                className="bodyLink"
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch(push('/settings/contact-us'))}
              >
                here
              </span>
            </div>
          </div>
          <div className="web-version">
            <div>Web Version 1.4.0</div>
            <Row className="bodyLink" justify="space-between">
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch(push('privacy-policy'))}
              >
                Privacy Policy
              </div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch(push('terms-and-conditions'))}
              >
                Terms and Conditions
              </div>
            </Row>
            <div
              className="bodyLink"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                dispatch(push('user-commitments-and-commenting-guidelines'))
              }
            >
              User Commitments and Commenting Guidelines
            </div>
          </div>
          <ConfirmationPopupComponent
            visibility={confirmLogout}
            dismissModal={() => setConfirmLogout(false)}
            title="Confirm Logout"
            message="You will be logged out of Live to Give and will be required to sign back in. Are you sure you want to proceed?"
            leftAction={userLogout}
            rightAction={() => setConfirmLogout(false)}
          />
          <ChangePassword />
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

UserSettingsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userSettingsPage: makeSelectUserSettingsPage(),
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
)(UserSettingsPage);
