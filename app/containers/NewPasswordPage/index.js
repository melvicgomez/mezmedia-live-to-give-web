/**
 *
 * NewPasswordPage
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import { Row } from 'antd';
import { replace } from 'connected-react-router';
import { ExclamationCircleFilled } from '@ant-design/icons';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { Images } from 'images/index';
import { Colors } from 'theme/colors';
import { Helmet } from 'react-helmet';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectNewPasswordPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div`
  background-image: url(${Images.background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .form-wrapper {
    width: 400px;
    margin: 20px 0px;
  }

  .instruction {
    text-align: center;
    margin-bottom: 30px;
    > div {
      width: 90%;
    }
  }

  .error-messages {
    background: ${Colors.white};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.3);
    display: flex;
    margin: 30px 0px 15px;
  }
`;

export function NewPasswordPage({ location, dispatch }) {
  useInjectReducer({ key: 'newPasswordPage', reducer });
  useInjectSaga({ key: 'newPasswordPage', saga });

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isValidPassConfirm, setIsValidPassConfirm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const validate = type => {
    const passwordRegex = /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$/;
    if (type === 'password') {
      setIsValidPassword(passwordRegex.test(password));
    } else if (type === 'passwordConfirm') {
      setIsValidPassConfirm(password === passwordConfirm);
    }
  };

  const submitNewPassword = () => {
    if (isValidPassword && isValidPassConfirm) {
      if (!isLoading) {
        reactLocalStorage.setObject('token', location.state.token);

        setIsLoading(true);
        axiosInstance
          .post('api/new-password', {
            new_password: password,
            request_code: location.state.request_code,
            user_id: location.state.user_id,
          })
          .then(async () => {
            setModalVisible(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <PageWrapperStyled>
      <Helmet>
        <title>Create New Password - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <div className="form-wrapper">
        <Row justify="center" className="body white-text instruction">
          <div>Reset your password below</div>
        </Row>
        <TextInputComponent
          title="Create Password"
          caption="Your password must include at least 8 characters, 1 uppercase, 1 lowercase & 1 number."
          defaultValue={password}
          value={password}
          type="password"
          placeholder="Enter a secure password"
          onChange={setPassword}
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
          onChange={setPasswordConfirm}
          onBlur={() => {
            validate('passwordConfirm');
          }}
        />

        {!isValidPassword || !isValidPassConfirm ? (
          <div className="error-messages">
            <Row style={{ marginTop: '5px' }}>
              <ExclamationCircleFilled
                className="error-text"
                style={{ marginRight: 12 }}
              />
            </Row>
            <div className="error-text body">
              {!isValidPassword &&
                '• Your password must include at least 8 characters, 1 uppercase, 1 lowercase & 1 number.'}
              {!isValidPassConfirm && '• Password does not match.'}
            </div>
          </div>
        ) : null}

        <div>
          <PrimaryButtonComponent
            style={{
              margin: '30px 0px 10px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
            iconRight={false}
            label="Submit New Password"
            onClick={() => {
              validate('password');
              validate('passwordConfirm');
              submitNewPassword();
            }}
            loading={isLoading}
          />
        </div>

        <ConfirmationPopupComponent
          visibility={modalVisible}
          dismissModal={() => {
            reactLocalStorage.clear();
            setModalVisible(false);
            dispatch(replace('login'));
          }}
          title="Password Changed!"
          message="Your password has been changed successfully"
          actionRequire={false}
        />
      </div>
    </PageWrapperStyled>
  );
}

NewPasswordPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  newPasswordPage: makeSelectNewPasswordPage(),
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
)(NewPasswordPage);
