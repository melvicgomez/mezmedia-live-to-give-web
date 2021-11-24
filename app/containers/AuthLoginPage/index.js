/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
/**
 *
 * AuthLoginPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import api from 'services';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push, replace } from 'connected-react-router';
import { compose } from 'redux';

import { Button, Row } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { reactLocalStorage } from 'reactjs-localstorage';
import moment from 'moment';

import { emailDomains } from 'utils/constants';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Helmet } from 'react-helmet';
import { Images } from 'images/index';
import { Colors } from 'theme/colors';
import makeSelectAuthLoginPage from './selectors';
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
  }

  img.app-logo {
    width: 200px;
  }

  .error-messages {
    background: ${Colors.white};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.3);
    margin-bottom: 10px;
    display: flex;
    margin-top: 20px;
  }

  .login-action-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export function AuthLoginPage(props) {
  const { dispatch } = props;
  useInjectReducer({ key: 'auth', reducer });
  useInjectSaga({ key: 'auth', saga });

  useEffect(() => {
    // add this on pages that must not be accessible login
    const token = reactLocalStorage.getObject('token').access_token;
    if (token) {
      dispatch(replace('activity-feed'));
    }
  }, []);

  const retryAfter = reactLocalStorage.get('retry-after');

  const [inputEmail, setInputEmail] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [loading, setLoading] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [reqTooMany, setReqTooMany] = useState(false);

  const validate = type => {
    const endsWithAny = (suffixes, string) =>
      suffixes.some(suffix => string.endsWith(suffix));

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$/;
    // password e.g: BArclays123, (?=.*?\W) to check one special charater

    if (type === 'email') {
      if (emailRegex.test(inputEmail)) {
        setIsValidEmail(endsWithAny(emailDomains, inputEmail.trim()));
      } else {
        setIsValidEmail(false);
      }
    } else if (type === 'password') {
      setIsValidPassword(passwordRegex.test(inputPass.trim()));
    }
  };

  const userLogin = () => {
    if (!loading) {
      setLoading(true);
      api
        .post(`api/login`, {
          grant_type: process.env.GRANT_TYPE,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          username: inputEmail,
          password: inputPass,
          scope: process.env.SCOPE,
        })
        .then(response => {
          reactLocalStorage.remove('retry-after');
          if (response)
            if (response.data.error) {
              setLoginError(true);
            } else {
              api.defaults.headers.common.Authorization = `Bearer ${
                response.data.data.token.access_token
              }`;
              reactLocalStorage.setObject('user', response.data.data.user);
              reactLocalStorage.setObject('token', response.data.data.token);
              dispatch(replace('activity-feed'));
            }
        })
        .catch(error => {
          if (error.status === 429) {
            setReqTooMany(true);

            if (retryAfter) {
              if (moment().isAfter(moment(retryAfter))) {
                reactLocalStorage.set(
                  'retry-after',
                  moment()
                    .add(5, 'minutes')
                    .toString(),
                );
              }
            } else {
              reactLocalStorage.set(
                'retry-after',
                moment()
                  .add(5, 'minutes')
                  .toString(),
              );
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <PageWrapperStyled>
      <Helmet>
        <title>Login - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <div className="form-wrapper">
        <div className="center">
          <img
            className="app-logo"
            style={{ marginBottom: '20px' }}
            src={Images.logo}
            alt="Live to Give App Logo"
          />
        </div>
        <TextInputComponent
          title="Your Barclays Email"
          defaultValue={inputEmail}
          value={inputEmail}
          placeholder="Enter your Barclays Email"
          onChange={setInputEmail}
          onBlur={() => {
            validate('email');
          }}
        />

        <TextInputComponent
          title="Your Password"
          defaultValue={inputPass}
          value={inputPass}
          type="password"
          placeholder="Enter your password"
          onChange={setInputPass}
          onBlur={() => {
            validate('password');
          }}
        />

        {!isValidEmail || !isValidPassword || loginError || reqTooMany ? (
          <div className="error-messages">
            <Row style={{ marginTop: '5px' }}>
              <ExclamationCircleFilled
                className="error-text"
                style={{ marginRight: 12 }}
              />
            </Row>
            <div className="error-text body">
              {`${
                (!isValidEmail || !isValidPassword || loginError) && !reqTooMany
                  ? '• Your login details are invalid.'
                  : ''
              }`}
              <div>
                {`${
                  reqTooMany
                    ? `• You have exceeded the maximum login attempts. Try again after ${
                        retryAfter
                          ? moment(retryAfter).diff(moment(), 'minutes') > 0
                            ? moment(retryAfter).diff(moment(), 'minutes')
                            : 'less than a'
                          : ''
                      } minute${
                        retryAfter
                          ? moment(retryAfter).diff(moment(), 'minutes') > 0
                            ? 's'
                            : ''
                          : ''
                      }.`
                    : ''
                }`}
              </div>
            </div>
          </div>
        ) : null}

        <div>
          <PrimaryButtonComponent
            style={{
              margin: '25px 0px 10px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
            label="Login"
            onClick={userLogin}
            loading={loading}
            iconRight={false}
            disabled={!inputEmail || !inputPass}
          />
          <Row justify="center" className="bodyLink white-text">
            <Button
              type="link"
              onClick={() => {
                dispatch(push('/forgot-password'));
              }}
            >
              <span className="bodyLink white-text">Forgot Password</span>
            </Button>
          </Row>
        </div>
      </div>
    </PageWrapperStyled>
  );
}

AuthLoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuthLoginPage(),
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
)(AuthLoginPage);
