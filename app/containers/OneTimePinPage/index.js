/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
/**
 *
 * OneTimePinPage
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
import axiosInstance from 'services';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { replace } from 'connected-react-router';
import { compose } from 'redux';
import { Button, Row } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';
import TextInputComponent from 'components/TextInputComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { Helmet } from 'react-helmet';
import { Images } from 'images/index';
import { Colors } from 'theme/colors';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectOneTimePinPage from './selectors';
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
    margin: 20px 0px 15px;
  }
`;

const ResendButton = styled(Button)`
  ::before {
    background: transparent;
  }

  .ant-btn-loading-icon {
    color: white;
    display: inline-flex;
  }
`;
export function OneTimePinPage({ location, dispatch }) {
  useInjectReducer({ key: 'oneTimePinPage', reducer });
  useInjectSaga({ key: 'oneTimePinPage', saga });

  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTooManyReq, setIsTooManyReq] = useState(null);

  const retryAfter = reactLocalStorage.get('forgot-pass-retry-after');

  useEffect(() => {
    getOTP(true);
  }, []);

  const getOTP = useCallback((firstLoad = false) => {
    if (!firstLoad) setIsResendLoading(true);
    axiosInstance
      .post('api/otp-new', {
        user_id: location.state.user_id,
      })
      .then(res => {
        if (res.status === 204) {
          setIsTooManyReq(null);
          if (!firstLoad) setModalVisibility(true);
        }
      })
      .catch(error => {
        if (error.status === 429) {
          setIsTooManyReq(
            `• Please wait for less than ${
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
            } to get another code.`,
          );
          if (retryAfter) {
            if (moment().isAfter(moment(retryAfter))) {
              reactLocalStorage.set(
                'forgot-pass-retry-after',
                moment()
                  .add(10, 'minutes')
                  .toString(),
              );
            }
          } else {
            reactLocalStorage.set(
              'forgot-pass-retry-after',
              moment()
                .add(10, 'minutes')
                .toString(),
            );
          }
        }
        if (error.status === 422) {
          setIsTooManyReq(null);
          if (!firstLoad) setModalVisibility(true);
        }
      })
      .finally(() => {
        if (!firstLoad) setIsResendLoading(false);
      });
  }, []);

  const submitOTP = () => {
    setIsTooManyReq(null);
    const alphnum = /^[A-Z0-9]+$/;
    if (alphnum.test(pin)) {
      setIsLoading(true);
      axiosInstance
        .post('api/otp-verify', {
          user_id: location.state.user_id,
          otp_code: pin.toUpperCase(),
        })
        .then(({ data }) => {
          setIsLoading(false);
          if (data.data.is_valid === 1) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${
              data.data.accessToken
            }`;
            if (location.state.hasOwnProperty('request_code')) {
              dispatch(
                replace({
                  pathname: `/new-password`,
                  state: {
                    user_id: location.state.user_id,
                    request_code: location.state.request_code,
                    token: {
                      access_token: data.data.accessToken,
                      expires_in: data.data.token.expires_at,
                      expires_at: moment(
                        data.data.token.expires_at,
                        'YYYY-M-D H:m',
                      ).toISOString(),
                    },
                  },
                }),
              );
            } else {
              reactLocalStorage.setObject('token', {
                access_token: data.data.accessToken,
                expires_in: data.data.token.expires_at,
                expires_at: moment(
                  data.data.token.expires_at,
                  'YYYY-M-D H:m',
                ).toISOString(),
              });
              dispatch(
                replace({
                  pathname: `/create-profile`,
                  state: {
                    user_id: location.state.user_id,
                    access_token: data.data.accessToken,
                    expires_in: data.data.token.expires_at,
                    expires_at: moment(
                      data.data.token.expires_at,
                      'YYYY-M-D H:m',
                    ).toISOString(),
                    useToken: true,
                  },
                }),
              );
            }
          }
        })
        .catch(reason => {
          setPin(null);
          setIsLoading(false);
          setErrorMessage(reason.data.error && reason.data.error.token);
        });
    } else {
      setErrorMessage('500');
    }
  };

  return (
    <PageWrapperStyled>
      <Helmet>
        <title>User Registration - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <div className="form-wrapper">
        <Row justify="center" className="body white-text instruction">
          <div>Please enter the PIN that has been sent to your email.</div>
        </Row>
        <TextInputComponent
          defaultValue={pin}
          value={pin}
          placeholder="Enter your PIN"
          maxLength={5}
          onChange={value => {
            setPin(value);
          }}
        />
        {errorMessage || isTooManyReq !== null ? (
          <div className="error-messages">
            <Row style={{ marginTop: '5px' }}>
              <ExclamationCircleFilled
                className="error-text"
                style={{ marginRight: 12 }}
              />
            </Row>
            <div className="error-text">
              {!!errorMessage && <div>• Your PIN is invalid.</div>}
              {isTooManyReq !== null ? <div>{isTooManyReq}</div> : null}
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
            label="Verify"
            onClick={pin.length === 5 ? submitOTP : () => {}}
            disabled={pin.length < 5}
            iconRight={false}
            loading={isLoading}
          />
          <Row justify="center" className="bodyLink white-text">
            <ResendButton
              type="link"
              onClick={() => {
                if (!isResendLoading) {
                  getOTP();
                }
              }}
              loading={isResendLoading}
            >
              <span className="bodyLink white-text">
                Resend Verification PIN
              </span>
            </ResendButton>
          </Row>
        </div>
        <ConfirmationPopupComponent
          visibility={modalVisibility}
          dismissModal={() => {
            setModalVisibility(false);
          }}
          title="New Verification PIN Sent"
          message="A new verification PIN has been sent to your email address"
          actionRequire={false}
        />
      </div>
    </PageWrapperStyled>
  );
}

OneTimePinPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  oneTimePinPage: makeSelectOneTimePinPage(),
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
)(OneTimePinPage);
