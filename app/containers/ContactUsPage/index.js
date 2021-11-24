/* eslint-disable no-useless-escape */
/* eslint-disable array-callback-return */
/**
 *
 * ContactUsPage
 *
 */
import React, { memo, useState, useRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Colors } from 'theme/colors';
import { Helmet } from 'react-helmet';
import { goBack } from 'connected-react-router';
import { regexStr, hasInappropriateLanguage } from 'utils/constants';
import { Row, Input } from 'antd';
import { reactLocalStorage } from 'reactjs-localstorage';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import TextInputComponent from 'components/TextInputComponent';
import AppBarComponent from 'components/AppBarComponent';
import axiosInstance, { createFormData } from 'services';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectContactUsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const { TextArea } = Input;

const PageWrapperStyled = styled.div`
  background-color: ${Colors.background};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: calc(100vh-68px);
  display: flex;
  padding-top: 68px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Form = styled.div`
  margin: 30px 0px;
  width: 550px;

  > p:first-child {
    text-align: center;
    margin-bottom: 30px;
  }
`;

const DescriptionInputSection = styled(Row)`
  border-radius: 16px;
  height: auto !important;
  color: ${Colors.bodyText};
  box-shadow: inset 0px 1px 2px 0px #00000035;
  background-color: ${Colors.textInput};
  border: 2px solid ${Colors.pureWhite};
  padding: 10px 15px;
  margin: 20px 0px;

  > textarea {
    width: 100%;
    color: ${Colors.pureWhite};
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export function ContactUsPage({ match, dispatch }) {
  useInjectReducer({ key: 'contactUsPage', reducer });
  useInjectSaga({ key: 'contactUsPage', saga });

  const user = reactLocalStorage.getObject('user');
  const isPublic = match.path === '/contact-us';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationToken, setValidationToken] = useState('');

  const [nameIsFocused, setNameIsFocused] = useState(false);
  const [emailIsFocused, setEmailIsFocused] = useState(false);
  const [titleIsFocused, setTitleIsFocused] = useState(false);
  const [descIsFocused, setDescIsFocused] = useState(false);

  const [loading, setLoading] = useState(false);

  const [warning, setWarning] = useState({
    inappropriateName: false,
    inappropriateTitle: false,
    inappropriateDesc: false,
    foreignName: false,
    foreignTitle: false,
    foreignDesc: false,
  });
  const [emailError, setEmailError] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const [inappropriateWarnVisible, setInappropriateWarnVisible] = useState(
    false,
  );
  const [foreignWarnVisible, setForeignWarnVisible] = useState(false);

  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [submitFailModalVisible, setSubmitFailModalVisible] = useState(false);

  const captchaRef = useRef();

  const submitForm = () => {
    if (validationToken || !isPublic) {
      setLoading(true);

      const api = isPublic
        ? 'api/form/public-contact-form'
        : 'api/form/contact-form';

      axiosInstance
        .post(
          api,
          createFormData(
            isPublic
              ? {
                  name,
                  email,
                  subject: title,
                  description,
                  token: validationToken,
                }
              : {
                  user_id: user.user_id,
                  subject: title,
                  description,
                },
          ),
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then(() => {
          setLoading(false);
          setSubmitModalVisible(true);
          if (isPublic) {
            captchaRef.current.resetCaptcha();
            setValidationToken('');
          }
        })
        .catch(err => {
          if (err.status === 400) {
            setCaptchaError(true);
          } else if (err.status === 422) {
            setSubmitFailModalVisible(true);
          } else {
            setSubmitModalVisible(true);
          }
          setLoading(false);
          if (isPublic) {
            captchaRef.current.resetCaptcha();
            setValidationToken('');
          }
        });
    }
  };

  const validate = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    let invalidEmail = false;
    if (isPublic) {
      invalidEmail = !emailRegex.test(email);
    }

    const languageChecking = { ...warning };

    if (isPublic) {
      languageChecking.inappropriateName = hasInappropriateLanguage(name);
      languageChecking.foreignName = !regexStr.englishAndEmoji.test(title);
    }
    languageChecking.inappropriateTitle = hasInappropriateLanguage(title);
    languageChecking.foreignTitle = !regexStr.englishAndEmoji.test(title);
    languageChecking.inappropriateDesc = hasInappropriateLanguage(description);
    languageChecking.foreignDesc = !regexStr.englishAndEmoji.test(description);

    if (
      !invalidEmail &&
      !languageChecking.inappropriateName &&
      !languageChecking.foreignName &&
      !languageChecking.inappropriateTitle &&
      !languageChecking.foreignTitle &&
      !languageChecking.inappropriateDesc &&
      !languageChecking.foreignDesc
    ) {
      submitForm();
    } else {
      if (isPublic) {
        captchaRef.current.resetCaptcha();
      }
      setEmailError(invalidEmail);
      setWarning(languageChecking);
      setForeignWarnVisible(
        languageChecking.foreignName ||
          languageChecking.foreignDesc ||
          languageChecking.foreignTitle,
      );
      setInappropriateWarnVisible(
        languageChecking.inappropriateName ||
          languageChecking.inappropriateDesc ||
          languageChecking.inappropriateTitle,
      );
    }
  };

  return (
    <div>
      <Helmet>
        <title>Contact Us - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled>
        <div>
          <Form>
            <p className="h2 white-text">Contact Us</p>
            {isPublic && (
              <>
                <TextInputComponent
                  defaultValue={name}
                  value={name}
                  placeholder={nameIsFocused ? '' : 'Name'}
                  hasError={warning.inappropriateName || warning.foreignName}
                  onChange={value => {
                    warning.inappropriateName = false;
                    warning.foreignName = false;
                    setName(value);
                  }}
                  onFocus={() => {
                    setNameIsFocused(true);
                  }}
                  onBlur={() => {
                    setNameIsFocused(false);
                  }}
                />
                <TextInputComponent
                  defaultValue={email}
                  value={email}
                  placeholder={emailIsFocused ? '' : 'Email'}
                  hasError={emailError}
                  onChange={value => {
                    setEmailError(false);
                    setEmail(value);
                  }}
                  onFocus={() => {
                    setEmailIsFocused(true);
                  }}
                  onBlur={() => {
                    setEmailIsFocused(false);
                  }}
                />
              </>
            )}
            <TextInputComponent
              defaultValue={title}
              value={title}
              placeholder={titleIsFocused ? '' : 'Subject Title'}
              hasError={warning.inappropriateTitle || warning.foreignTitle}
              onChange={value => {
                warning.inappropriateTitle = false;
                warning.foreignTitle = false;
                setTitle(value);
              }}
              onFocus={() => {
                setTitleIsFocused(true);
              }}
              onBlur={() => {
                setTitleIsFocused(false);
              }}
            />
            <DescriptionInputSection
              type="desc"
              align="middle"
              style={{
                borderColor:
                  warning.inappropriateDesc || warning.foreignDesc
                    ? Colors.error
                    : Colors.pureWhite,
              }}
            >
              <TextArea
                value={description}
                onChange={({ target: { value } }) => {
                  warning.inappropriateDesc = false;
                  warning.foreignDesc = false;
                  setDescription(value);
                }}
                placeholder={descIsFocused ? '' : 'Description'}
                className="bodyBold"
                bordered={false}
                autoSize={{ minRows: 8, maxRows: 8 }}
                onFocus={() => {
                  setDescIsFocused(true);
                }}
                onBlur={() => {
                  setDescIsFocused(false);
                }}
              />
            </DescriptionInputSection>
            {isPublic && (
              <>
                <Row justify="center" style={{ marginTop: '20px' }}>
                  <HCaptcha
                    sitekey="9ae63ad2-bf78-4fce-a670-c1fb7501b496"
                    ref={captchaRef}
                    onVerify={token => {
                      setCaptchaError(false);
                      setValidationToken(token);
                    }}
                    onError={() => {
                      captchaRef.current.resetCaptcha();
                    }}
                    theme="dark"
                    // size="invisible"
                    onExpire={() => {
                      setValidationToken('');
                      captchaRef.current.resetCaptcha();
                    }}
                  />
                </Row>
                {captchaError && (
                  <Row justify="center" className="error-text">
                    Failed to validate captcha
                  </Row>
                )}
              </>
            )}
            <Row justify="center">
              <PrimaryButtonComponent
                style={{ marginTop: isPublic ? '20px' : '5px' }}
                label="Submit"
                onClick={validate}
                loading={loading}
                disabled={
                  (isPublic
                    ? !name ||
                      !name.trim().length ||
                      !email ||
                      !email.trim().length ||
                      !validationToken
                    : false) ||
                  !title ||
                  !title.trim().length ||
                  !description ||
                  !description.trim().length
                }
              />
            </Row>
            <ConfirmationPopupComponent
              visibility={submitFailModalVisible}
              dismissModal={() => {
                setSubmitFailModalVisible(false);
              }}
              title="Form Submission Failed"
              message="Failed to send your form. Please try again later."
              actionRequire={false}
            />
            <ConfirmationPopupComponent
              visibility={inappropriateWarnVisible}
              dismissModal={() => {
                setInappropriateWarnVisible(false);
              }}
              title="Inappropriate Language"
              message="It appears your form contains inappropriate language which contravenes the Live to Give User Guidelines and cannot be published. Please review your form and make the necessary edits. If this is incorrect, please contact the Support Team via the Settings page."
              actionRequire={false}
            />
            <ConfirmationPopupComponent
              visibility={foreignWarnVisible}
              dismissModal={() => {
                setForeignWarnVisible(false);
              }}
              title="Only alphanumeric characters allowed"
              message="Please note that only alphanumeric characters (A-Z, a-z, 0-9), punctuation and emojis are allowed in your forms. Please amend your form accordingly in order to successfully submit it"
              actionRequire={false}
            />
          </Form>
          <ConfirmationPopupComponent
            visibility={submitModalVisible}
            dismissModal={() => {
              setSubmitModalVisible(false);
              dispatch(goBack());
            }}
            title="Thank You!"
            message="Your submission has been received and we will get back to you shortly"
            actionRequire={false}
          />
        </div>
      </PageWrapperStyled>
    </div>
  );
}

ContactUsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contactUsPage: makeSelectContactUsPage(),
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
)(ContactUsPage);
