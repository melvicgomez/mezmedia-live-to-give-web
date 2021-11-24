/* eslint-disable no-useless-escape */
/**
 *
 * ForgotPasswordPage
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import axiosInstance from 'services';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row } from 'antd';
import { push } from 'connected-react-router';
import { ExclamationCircleFilled } from '@ant-design/icons';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { emailDomains } from 'utils/constants';
import { Images } from 'images/index';
import { Colors } from 'theme/colors';
import { Helmet } from 'react-helmet';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectForgotPasswordPage from './selectors';
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

export function ForgotPasswordPage({ dispatch }) {
  useInjectReducer({ key: 'forgotPasswordPage', reducer });
  useInjectSaga({ key: 'forgotPasswordPage', saga });

  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const endsWithAny = (suffixes, string) =>
      suffixes.some(suffix => string.endsWith(suffix));

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (emailRegex.test(email)) {
      setIsValidEmail(endsWithAny(emailDomains, email));
      return endsWithAny(emailDomains, email);
    } else {
      setIsValidEmail(emailRegex.test(email));
      return emailRegex.test(email);
    }
  };

  return (
    <PageWrapperStyled>
      <Helmet>
        <title>Forget Password - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <div className="form-wrapper">
        <Row justify="center" className="body white-text instruction">
          <div>
            Forgot your password? No worries it happens to the best of us. Enter
            your email below and we will send you a PIN Number to reset your
            password.
          </div>
        </Row>
        <TextInputComponent
          title="Your Barclays Email"
          defaultValue={email}
          value={email}
          placeholder="Enter your Barclays Email"
          onChange={setEmail}
          onBlur={() => {
            validate();
          }}
        />

        {!isValidEmail ? (
          <div className="error-messages">
            <Row style={{ marginTop: '5px' }}>
              <ExclamationCircleFilled
                className="error-text"
                style={{ marginRight: 12 }}
              />
            </Row>
            <div className="error-text body">
              {!isValidEmail && '• Invalid email address format'}
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
            label="Reset Password"
            onClick={() => {
              if (validate()) {
                if (!isLoading) {
                  setIsLoading(true);
                  axiosInstance
                    .post('api/forgot-password', {
                      email,
                    })
                    .then(({ data }) => {
                      if (data.data.request_code && data.data.user_id) {
                        dispatch(
                          push({
                            pathname: `/verify`,
                            state: {
                              user_id: data.data.user_id,
                              request_code: data.data.request_code,
                            },
                          }),
                        );
                      }
                    })
                    .catch(err => {
                      if (err.status === 422) {
                        // setIsValidEmail(false);
                        dispatch(
                          push({
                            pathname: `/verify`,
                            state: {
                              user_id: -1,
                              request_code: null,
                            },
                          }),
                        );
                      }
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }
              }
            }}
            loading={isLoading}
          />
        </div>
      </div>
    </PageWrapperStyled>
  );
}

ForgotPasswordPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  forgotPasswordPage: makeSelectForgotPasswordPage(),
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
)(ForgotPasswordPage);
