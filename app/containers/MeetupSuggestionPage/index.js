/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/**
 *
 * MeetupSuggestionPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axiosInstance, { createFormData } from 'services';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { goBack } from 'connected-react-router';
import { compose } from 'redux';
import { Colors } from 'theme/colors';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Row, Input, Spin, Select, DatePicker } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import TextInputComponent from 'components/TextInputComponent';
import AppBarComponent from 'components/AppBarComponent';
import { regexStr, hasInappropriateLanguage } from 'utils/constants';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectMeetupSuggestionPage from './selectors';
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
  margin: 0px 0px 20px;
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

const DateTimePicker = styled(DatePicker)`
  background-color: ${Colors.textInput};
  height: 48px;
  width: 45%;
  border: 2px solid ${props => (props.error ? Colors.error : Colors.pureWhite)};
  border-radius: 16px;
  margin-bottom: 20px;

  :focus,
  :active,
  :hover {
    border-color: ${props =>
      props.error ? Colors.error : Colors.pureWhite} !important;
  }

  .ant-picker-suffix {
    color: ${Colors.placeholderTextColor};
  }

  .ant-picker-input > input {
    color: ${Colors.pureWhite};
    text-align: center;
  }
`;

export function MeetupSuggestionPage({ dispatch }) {
  useInjectReducer({ key: 'meetupSuggestionPage', reducer });
  useInjectSaga({ key: 'meetupSuggestionPage', saga });

  const user = reactLocalStorage.getObject('user');
  const [interestList, setInterestList] = useState([]);
  const [loadList, setLoadList] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const [meetupName, setMeetupName] = useState('');
  const [selectedInterest, setSelectedInterest] = useState(
    'Select Live to Give Club',
  );
  const [slots, setSlots] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [extraInfo, setExtraInfo] = useState('');

  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState({
    description: 'Meetup Description',
    extraInfo: 'Additional Details that are only visible to participants',
  });

  const [error, setError] = useState({
    meetupName: false,
    selectedInterest: false,
    slots: false,
    description: false,
    startDateTime: false,
    endDateTime: false,
    meetingLink: false,
    extraInfo: false,
  });

  const [inappropriateWarnVisible, setInappropriateWarnVisible] = useState(
    false,
  );
  const [foreignWarnVisible, setForeignWarnVisible] = useState(false);
  const [warning, setWarning] = useState({
    inappropriateMeetupName: false,
    characterMeetupName: false,
    inappropriateDescription: false,
    characterDescription: false,
    inappropriateExtraInfo: false,
    characterExtraInfo: false,
  });

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
    errorChecking.meetupName = !meetupName;
    errorChecking.slots = !slots || slots % 1 !== 0;
    errorChecking.description = !description;
    errorChecking.selectedInterest =
      selectedInterest === 'Select Live to Give Club';
    errorChecking.startDateTime =
      !startDateTime || moment(startDateTime) > moment(endDateTime);
    errorChecking.endDateTime =
      !endDateTime || moment(startDateTime) > moment(endDateTime);
    errorChecking.meetingLink = !meetingLink;
    errorChecking.extraInfo = !extraInfo;

    const languageChecking = { ...warning };
    if (!errorChecking.meetupName) {
      languageChecking.inappropriateMeetupName = hasInappropriateLanguage(
        meetupName,
      );
      languageChecking.characterMeetupName = !regexStr.englishAndEmoji.test(
        meetupName,
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
    if (!errorChecking.extraInfo) {
      languageChecking.inappropriateExtraInfo = hasInappropriateLanguage(
        extraInfo,
      );
      languageChecking.characterExtraInfo = !regexStr.englishAndEmoji.test(
        extraInfo,
      );
    }

    if (
      !errorChecking.meetupName &&
      !errorChecking.selectedInterest &&
      !errorChecking.slots &&
      !errorChecking.description &&
      !errorChecking.startDateTime &&
      !errorChecking.endDateTime &&
      !errorChecking.meetingLink &&
      !errorChecking.extraInfo &&
      !languageChecking.meetupName &&
      !languageChecking.description &&
      !languageChecking.extraInfo
    ) {
      axiosInstance
        .post(
          'api/form/meetup-suggestion-form',
          createFormData({
            user_id: user.user_id,
            interest_id: interestList.find(
              interest => interest.interest_name === selectedInterest,
            ).interest_id,
            title: meetupName,
            description,
            slots,
            registration_ended_at: moment(startDateTime).format(
              'YYYY-MM-DD HH:mm',
            ),
            started_at: moment(startDateTime).format('YYYY-MM-DD HH:mm'),
            ended_at: moment(endDateTime).format('YYYY-MM-DD HH:mm'),
            virtual_room_link: meetingLink,
            additional_details: extraInfo,
          }),
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .catch(() => {
          setLoading(false);
        })
        .finally(() => {
          setModalVisible(true);
          setLoading(false);
        });
    } else {
      setInappropriateWarnVisible(
        languageChecking.inappropriateMeetupName ||
          languageChecking.inappropriateDescription ||
          languageChecking.inappropriateExtraInfo,
      );
      setForeignWarnVisible(
        languageChecking.characterMeetupName ||
          languageChecking.characterDescription ||
          languageChecking.characterExtraInfo,
      );
      setError(errorChecking);
      setWarning(languageChecking);
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Suggest a Meetup - Live to Give</title>
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
              <p className="h2 white-text">Suggest a Virtual Meetup</p>
              <TextInputComponent
                defaultValue={meetupName}
                value={meetupName}
                hasError={
                  error.meetupName ||
                  warning.inappropriateMeetupName ||
                  warning.characterMeetupName
                }
                placeholder="Name of Virtual Meetup"
                onChange={value => {
                  error.meetupName = false;
                  warning.inappropriateMeetupName = false;
                  warning.characterMeetupName = false;
                  setMeetupName(value);
                }}
              />
              <TagSelector
                defaultValue={selectedInterest}
                showArrow={false}
                className="bodyBold"
                error={error.selectedInterest ? 1 : 0}
                style={{
                  width: 120,
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
              <TextInputComponent
                defaultValue={slots}
                value={slots}
                hasError={error.slots}
                placeholder="Number of slots available"
                onChange={value => {
                  const reg = /^-?\d*(\.\d*)?$/;
                  if (
                    // eslint-disable-next-line no-restricted-globals
                    !isNaN(value) &&
                    reg.test(value)
                  ) {
                    error.slots = false;
                    setSlots(value);
                  }
                }}
              />
              <Row
                className="white-text caption"
                style={{ width: '612px', margin: '20px 0px' }}
              >
                Given the ongoing uncertainty surrounding COVID-19 and
                associated government regulations, all meetups are required to
                be virtual. 
              </Row>
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
                }}
              >
                <TextArea
                  value={description}
                  onChange={({ target: { value } }) => {
                    error.description = false;
                    warning.inappropriateDescription = false;
                    warning.characterDescription = false;
                    setDescription(value);
                  }}
                  placeholder={placeholder.description}
                  className="bodyBold"
                  bordered={false}
                  autoSize={{ minRows: 6, maxRows: 6 }}
                  onFocus={() =>
                    setPlaceholder({ ...placeholder, description: '' })
                  }
                  onBlur={() =>
                    setPlaceholder({
                      ...placeholder,
                      description: 'Meetup Description',
                    })
                  }
                />
              </DescriptionInputSection>
              <Row justify="space-between">
                <DateTimePicker
                  className="bodyBold white-text"
                  placeholder="Start Date & Time"
                  error={error.startDateTime ? 1 : 0}
                  disabledDate={current =>
                    current && current < moment().endOf('day')
                  }
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={(value, dateString) => {
                    error.startDateTime = false;
                    setStartDateTime(dateString);
                  }}
                />
                <DateTimePicker
                  className="bodyBold white-text"
                  placeholder="End Date & Time"
                  error={error.endDateTime ? 1 : 0}
                  disabledDate={current =>
                    current && current < moment().endOf('day')
                  }
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={(value, dateString) => {
                    error.endDateTime = false;
                    setEndDateTime(dateString);
                  }}
                />
              </Row>
              <TextInputComponent
                defaultValue={meetingLink}
                value={meetingLink}
                hasError={error.meetingLink}
                placeholder="Webex / Zoom Link for Virtual Meetup"
                onChange={value => {
                  error.meetingLink = false;
                  setMeetingLink(value);
                }}
              />
              <DescriptionInputSection
                type="desc"
                align="middle"
                style={{
                  borderColor:
                    error.extraInfo ||
                    warning.inappropriateExtraInfo ||
                    warning.characterExtraInfo
                      ? Colors.error
                      : Colors.pureWhite,
                }}
              >
                <TextArea
                  value={extraInfo}
                  onChange={({ target: { value } }) => {
                    error.extraInfo = false;
                    warning.inappropriateExtraInfo = false;
                    warning.characterExtraInfo = false;
                    setExtraInfo(value);
                  }}
                  placeholder={placeholder.extraInfo}
                  className="bodyBold"
                  bordered={false}
                  autoSize={{ minRows: 6, maxRows: 6 }}
                  onFocus={() =>
                    setPlaceholder({ ...placeholder, extraInfo: '' })
                  }
                  onBlur={() =>
                    setPlaceholder({
                      ...placeholder,
                      extraInfo:
                        'Additional Details that are only visible to participants',
                    })
                  }
                />
              </DescriptionInputSection>
              <Row justify="center">
                <PrimaryButtonComponent
                  style={{ margin: '5px 0px 0px' }}
                  label="Submit"
                  loading={loading}
                  onClick={submitDetails}
                  disabled={
                    !meetupName ||
                    !description ||
                    !slots ||
                    !startDateTime ||
                    !endDateTime ||
                    !meetingLink ||
                    !extraInfo ||
                    selectedInterest === 'Select Live to Give Club'
                  }
                />
              </Row>
              <Row justify="center">
                <FormCaption className="caption white-text">
                  *Note: once received, the Live to Give support team will
                  review your Virtual Meetup suggestion and if required, will
                  request changes before publishing. Should your Meetup be
                  published, please note it will be open for all users to
                  participate in.
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

MeetupSuggestionPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  meetupSuggestionPage: makeSelectMeetupSuggestionPage(),
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
)(MeetupSuggestionPage);
