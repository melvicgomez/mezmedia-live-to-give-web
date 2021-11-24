/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/**
 *
 * ChallengeSuggestionPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Colors } from 'theme/colors';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Helmet } from 'react-helmet';
import { goBack } from 'connected-react-router';
import { regexStr, hasInappropriateLanguage } from 'utils/constants';
import { Row, Input, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import TextInputComponent from 'components/TextInputComponent';
import AppBarComponent from 'components/AppBarComponent';
import axiosInstance from 'services';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectChallengeSuggestionPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const { TextArea } = Input;
const { Option } = Select;

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

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 40px;
  margin-top: 30px;
`;

const Form = styled.div`
  margin: 30px 0px;

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

const TagSelector = styled(Select)`
  width: 100% !important;
  margin: 6px 0px 20px;
  border: ${props =>
    props.error
      ? `2px solid ${Colors.error}`
      : `2px solid ${Colors.pureWhite}`} !important;
  border-radius: 16px !important;

  > .ant-select-selector {
    height: 48px !important;
    background-color: ${Colors.textInput} !important;
    border-radius: 16px !important;
    border: none !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
  }
`;

const FormCaption = styled.div`
  width: 490px;
  margin: 20px 30px 0px;
`;

export function ChallengeSuggestionPage({ dispatch }) {
  useInjectReducer({ key: 'challengeSuggestionPage', reducer });
  useInjectSaga({ key: 'challengeSuggestionPage', saga });

  const user = reactLocalStorage.getObject('user');

  const [challengeName, setChallengeName] = useState('');
  const [selectedInterest, setSelectedInterest] = useState(
    'Select Live to Give Club',
  );
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    challengeName: false,
    selectedInterest: false,
    description: false,
  });

  const [inappropriateWarnVisible, setInappropriateWarnVisible] = useState(
    false,
  );
  const [foreignWarnVisible, setForeignWarnVisible] = useState(false);
  const [warning, setWarning] = useState({
    inappropriateChallengeName: false,
    characterChallengeName: false,
    inappropriateDescription: false,
    characterDescription: false,
  });

  const [isFocused, setIsFocues] = useState(false);

  const [interestList, setInterestList] = useState([]);
  const [loadList, setLoadList] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    axiosInstance.get('api/club-interest').then(res => {
      const list = [];
      Object.keys(res.data).map(key => {
        res.data[key].forEach(data => {
          const interest = {
            interest_id: data.interest_id,
            interest_name: data.interest_name,
          };
          list.push(interest);
        });
      });
      setInterestList(list);
      setLoadList(false);
    });
  }, []);

  const submitDetails = () => {
    setLoading(true);
    const errorChecking = { ...error };
    errorChecking.challengeName = !challengeName;
    errorChecking.description = !description;
    errorChecking.selectedInterest =
      selectedInterest === 'Select Live to Give Club';

    const languageChecking = { ...warning };
    if (!errorChecking.challengeName) {
      languageChecking.inappropriateChallengeName = hasInappropriateLanguage(
        challengeName,
      );
      languageChecking.characterChallengeName = !regexStr.englishAndEmoji.test(
        challengeName,
      );
    }
    if (!errorChecking.description) {
      languageChecking.inappropriateDescription = hasInappropriateLanguage(
        description,
      );
      languageChecking.characterDescription = !regexStr.englishAndEmoji.test(
        description,
      );
    }

    if (
      !errorChecking.challengeName &&
      !errorChecking.selectedInterest &&
      !errorChecking.description &&
      !languageChecking.inappropriateSpeakerName &&
      !languageChecking.inappropriateDescription &&
      !languageChecking.characterSpeakerName &&
      !languageChecking.characterDescription
    ) {
      axiosInstance
        .post('api/form/challenge-suggestion-form', {
          user_id: user.user_id,
          interest_id: interestList.find(
            interest => interest.interest_name === selectedInterest,
          ).interest_id,
          title: challengeName,
          description,
        })
        .catch(() => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
          setModalVisible(true);
        });
    } else {
      setInappropriateWarnVisible(
        languageChecking.inappropriateChallengeName ||
          languageChecking.inappropriateDescription,
      );
      setForeignWarnVisible(
        languageChecking.characterChallengeName ||
          languageChecking.characterDescription,
      );
      setError(errorChecking);
      setWarning(languageChecking);
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Suggest a Challenge - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled>
        {loadList ? (
          <Row justify="center">
            <Spin indicator={<LoadingSpinner spin />} />
          </Row>
        ) : (
          <div>
            <Form>
              <p className="h2 white-text">Suggest a Challenge</p>
              <TextInputComponent
                defaultValue={challengeName}
                value={challengeName}
                hasError={
                  error.challengeName ||
                  warning.inappropriateChallengeName ||
                  warning.characterChallengeName
                }
                placeholder="Name of Challenge"
                onChange={value => {
                  error.challengeName = false;
                  warning.inappropriateChallengeName = false;
                  warning.characterChallengeName = false;
                  setChallengeName(value);
                }}
              />
              <TagSelector
                defaultValue={selectedInterest}
                showArrow={false}
                className="bodyBold"
                error={error.selectedInterest ? 1 : 0}
                style={{
                  width: 120,
                  margin: '6px 0px 25px',
                  color:
                    selectedInterest === 'Select Live to Give Club'
                      ? Colors.placeholderTextColor
                      : Colors.pureWhite,
                }}
                onChange={value => {
                  setSelectedInterest(value);
                  error.selectedInterest = false;
                }}
                dropdownStyle={{ zIndex: 999 }}
              >
                {interestList.map((option, index) => (
                  <Option
                    key={index}
                    value={option.interest_name}
                    className="bodyBold darkGrey-text"
                  >
                    {option.interest_name}
                  </Option>
                ))}
              </TagSelector>
              <DescriptionInputSection
                type="desc"
                align="middle"
                style={{
                  borderColor:
                    error.description ||
                    warning.inappropriateDescription ||
                    warning.characterDescription
                      ? Colors.error
                      : Colors.pureWhite,
                  marginTop: '0px',
                }}
              >
                <TextArea
                  value={description}
                  onChange={({ target: { value } }) => {
                    setDescription(value);
                    error.description = false;
                    warning.inappropriateDescription = false;
                    warning.characterDescription = false;
                  }}
                  placeholder={isFocused ? '' : 'Challenge Description'}
                  className="bodyBold"
                  bordered={false}
                  autoSize={{ minRows: 6, maxRows: 6 }}
                  onFocus={() => setIsFocues(true)}
                  onBlur={() => setIsFocues(false)}
                />
              </DescriptionInputSection>
              <Row justify="center">
                <PrimaryButtonComponent
                  style={{ margin: '5px 0px 0px' }}
                  label="Submit"
                  loading={loading}
                  onClick={submitDetails}
                  disabled={
                    !challengeName ||
                    !description ||
                    selectedInterest === 'Select Live to Give Club'
                  }
                />
              </Row>
              <Row justify="center">
                <FormCaption className="caption white-text">
                  *All Challenge suggestions are welcomed. However please note
                  that edits may be requested and we may not be able to publish
                  all suggested challenges. Should your Challenge be published,
                  please note it will be open for all users to participate in.
                </FormCaption>
              </Row>
              <ConfirmationPopupComponent
                visibility={inappropriateWarnVisible}
                dismissModal={() => {
                  setInappropriateWarnVisible(false);
                }}
                title="Inappropriate Language"
                message="It appears your suggestion contains inappropriate language which contravenes the Live to Give User Guidelines and cannot be published. Please review your suggestion and make the necessary edits. If this is incorrect, please contact the Support Team via the Settings page."
                actionRequire={false}
              />
              <ConfirmationPopupComponent
                visibility={foreignWarnVisible}
                dismissModal={() => {
                  setForeignWarnVisible(false);
                }}
                title="Only alphanumeric characters allowed"
                message="Please note that only alphanumeric characters (A-Z, a-z, 0-9), punctuation and emojis are allowed in your suggestions. Please amend your suggestion accordingly in order to successfully submit it"
                actionRequire={false}
              />
            </Form>
            <ConfirmationPopupComponent
              visibility={modalVisible}
              dismissModal={() => {
                setModalVisible(false);
                dispatch(goBack());
              }}
              title="Thank you for your suggestion!"
              message="We will get back to you shortly"
              actionRequire={false}
            />
          </div>
        )}
      </PageWrapperStyled>
    </div>
  );
}

ChallengeSuggestionPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  challengeSuggestionPage: makeSelectChallengeSuggestionPage(),
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
)(ChallengeSuggestionPage);
