/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
/**
 *
 * RegistrationPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import axiosInstance from 'services';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import { Row } from 'antd';
import styled from 'styled-components';
import { ExclamationCircleFilled, CheckOutlined } from '@ant-design/icons';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { emailDomains } from 'utils/constants';
import { Helmet } from 'react-helmet';
import { Images } from 'images/index';
import { Colors } from 'theme/colors';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectRegistrationPage from './selectors';
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
    max-width: 400px;
    margin: 20px 0px;
  }

  img {
    max-width: 200px;
  }

  .error-messages {
    background: ${Colors.white};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.3);
    display: flex;
    margin: 20px 0px 15px;
  }
`;

const Link = styled.div`
  cursor: pointer;
`;

const Checkbox = styled(Row)`
  cursor: pointer;
  border: 2px solid ${props => (props.error ? Colors.error : Colors.pureWhite)};
  border-radius: 8px;
  height: 29px;
  min-width: 29px;
  margin: 5px 15px 0px 0px;
`;

export function RegistrationPage({ dispatch }) {
  useInjectReducer({ key: 'registrationPage', reducer });
  useInjectSaga({ key: 'registrationPage', saga });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [agreeTerm, setAgreeTerm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPass, setIsValidConfirmPass] = useState(true);
  const [isTermChecked, setIsTermChecked] = useState(true);

  const [isEmailExists, setIsEmailExists] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (agreeTerm) {
      setIsTermChecked(true);
    }
  }, [agreeTerm]);

  const submitCreateAccount = () => {
    setLoading(true);
    axiosInstance
      .post('api/signup', {
        password,
        username: email,
      })
      .then(success => {
        dispatch(
          push({
            pathname: `/verify`,
            state: { user_id: success.data.data.user_id },
          }),
        );
        setLoading(false);
      })
      .catch(error => {
        if (error.status === 409) {
          setIsEmailExists(true);
          setHasError(true);
        }
        setLoading(false);
      });
  };

  const validate = type => {
    let errorCtr = 0;

    const endsWithAny = (suffixes, string) =>
      suffixes.some(suffix => string.endsWith(suffix));

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$/;
    // password e.g: BArclays123, (?=.*?\W) to check one special charater

    if (type === 'email') {
      if (emailRegex.test(email)) {
        setIsValidEmail(endsWithAny(emailDomains, email));
        if (!endsWithAny(emailDomains, email)) errorCtr += 1;
      } else {
        setIsValidEmail(emailRegex.test(email));
        if (!emailRegex.test(email)) errorCtr += 1;
      }
    } else if (type === 'password') {
      setIsValidPassword(passwordRegex.test(password));
      if (!passwordRegex.test(password)) errorCtr += 1;
    } else if (type === 'confirmPass') {
      setIsValidConfirmPass(password === confirmPass);
      if (password !== confirmPass) errorCtr += 1;
    }

    if (errorCtr > 0) {
      setHasError(true);
    }
  };

  return (
    <PageWrapperStyled>
      <Helmet>
        <title>User Registration - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <div className="form-wrapper">
        <div className="center">
          <img
            src={Images.logo}
            style={{ marginBottom: '20px' }}
            alt="Live to Give App Logo"
          />
        </div>
        <TextInputComponent
          title="Your Barclays Email"
          defaultValue={email}
          value={email}
          placeholder="Enter your Barclays Email"
          onChange={setEmail}
          onBlur={() => {
            validate('email');
          }}
        />
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
          defaultValue={confirmPass}
          value={confirmPass}
          type="password"
          placeholder="Enter the same password again"
          onChange={setConfirmPass}
          onBlur={() => {
            validate('confirmPass');
          }}
        />

        {hasError &&
        (isEmailExists ||
          !isValidEmail ||
          !isValidPassword ||
          !isValidConfirmPass) ? (
          <div className="error-messages">
            <Row style={{ marginTop: '5px' }}>
              <ExclamationCircleFilled
                className="error-text"
                style={{ marginRight: 12 }}
              />
            </Row>
            <div className="error-text">
              {isEmailExists && (
                <div>• This email is already registered with us.</div>
              )}
              {!isValidEmail && (
                <div>• Please enter your Barclays email address.</div>
              )}
              {!isValidPassword && (
                <div>
                  • Your password must include at least 8 characters, 1
                  uppercase, 1 lowercase & 1 number.
                </div>
              )}
              {!isValidConfirmPass && <div>• Password does not match.</div>}
            </div>
          </div>
        ) : null}

        <Row className="body white-text" wrap={false}>
          <Checkbox
            align="middle"
            justify="center"
            error={isTermChecked ? 0 : 1}
            onClick={() => setAgreeTerm(!agreeTerm)}
          >
            {agreeTerm && <CheckOutlined style={{ fontSize: '20px' }} />}
          </Checkbox>
          <Row>
            By creating an account I acknowledge that I have read and accepted
            the BWell Club App’s&nbsp;
            <Link
              className="bodyLink"
              onClick={() => dispatch(push('terms-and-conditions'))}
            >
              Terms and Conditions
            </Link>
            &nbsp;and&nbsp;
            <Link
              className="bodyLink"
              onClick={() => dispatch(push('privacy-policy'))}
            >
              Privacy Policy
            </Link>
          </Row>
        </Row>
        <div>
          <PrimaryButtonComponent
            style={{
              margin: '25px 0px 10px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
            label="Create an Account"
            onClick={() => {
              if (agreeTerm) {
                setIsEmailExists(false);
                if (isValidEmail && isValidPassword && isValidConfirmPass)
                  submitCreateAccount();
              } else {
                setIsTermChecked(false);
              }
            }}
            loading={loading}
            disabled={!email || !password || !confirmPass || !agreeTerm}
            iconRight={false}
          />
        </div>
      </div>
    </PageWrapperStyled>
  );
}

RegistrationPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  registrationPage: makeSelectRegistrationPage(),
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
)(RegistrationPage);
