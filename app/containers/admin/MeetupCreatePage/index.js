/* eslint-disable react/no-array-index-key */
/**
 *
 * MeetupCreatePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import axiosInstance, { createFormData } from 'services';
import styled from 'styled-components';
import { replace } from 'connected-react-router';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import Resizer from 'react-image-file-resizer';
import { Select, Row, Col, DatePicker, Radio } from 'antd';
import TextInputComponent from 'components/TextInputComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import TextAreaComponent from 'components/admin/TextAreaComponent';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { reactLocalStorage } from 'reactjs-localstorage';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectMeetupCreatePage from './selectors';
import reducer from './reducer';
import saga from './saga';

const { Option } = Select;

const PageWrapperStyled = styled.div`
  width: 800px;
  margin: 10px 30px 20px;
`;

const TypeSelector = styled(Select)`
  width: 100% !important;
  margin-bottom: 25px;
  border: 2px solid ${Colors.pureWhite} !important;
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

const Label = styled.p`
  margin-bottom: 6px;
  width: 250px;
  min-width: 250px;
  padding-top: 10px;
`;

const UploadPicSection = styled(Row)`
  background-color: ${Colors.textInput};
  height: 130px;
  width: 550px;
  border-radius: 16px;
  border: 2px solid ${Colors.pureWhite};
  flex-direction: column;
`;

const UploadIcon = styled.div`
  background-color: ${Colors.primary};
  height: 56px;
  width: 56px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    height: 32px;
    width: 32px;
  }
`;

const ImageUploadSection = styled(Row)`
  position: relative;

  > img {
    height: 366px;
    width: 550px;
    object-fit: cover;
    border-radius: 16px;
  }
`;

const UpdateIcon = styled.div`
  background-color: ${Colors.primary};
  height: 56px;
  width: 56px;
  border-radius: 50px;
  position: absolute;
  bottom: 15px;
  right: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    height: 25px;
    width: 25px;
  }
`;

const DateTimePicker = styled(DatePicker)`
  background-color: ${Colors.textInput};
  height: 48px;
  width: 45%;
  border: 2px solid ${props => (props.error ? Colors.error : Colors.pureWhite)};
  border-radius: 16px;
  margin-bottom: 25px;

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

const RegistrationDateTimePicker = styled(DateTimePicker)`
  width: 100%;
`;

const TextAreaInputSection = styled(Row)`
  border-radius: 16px;
  width: 100%;
  height: auto !important;
  color: ${Colors.bodyText};
  box-shadow: inset 0px 1px 2px 0px #00000035;
  background-color: ${Colors.textInput};
  border: 2px solid ${Colors.pureWhite};
  padding: 10px 15px;
  margin-bottom: 25px;

  .toolbarClassName {
    padding-bottom: 12px;
    border: none;
    border-bottom: 1px solid ${Colors.pureWhite};
  }

  .editorClassName {
    color: ${Colors.pureWhite};
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${Colors.pureWhite};
    }
    pre {
      color: ${Colors.black};
    }
  }
`;

export function MeetupCreatePage({ match, dispatch }) {
  useInjectReducer({ key: 'meetupCreatePage', reducer });
  useInjectSaga({ key: 'meetupCreatePage', saga });

  const user = reactLocalStorage.getObject('user');
  const [interestList, setInterestList] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [notification, setNotification] = useState('');
  const [interest, setInterest] = useState('Select Live to Give Club');
  const [slots, setSlots] = useState('');
  const [bcoin, setBcoin] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [hostName, setHostName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [registrationEnd, setRegistrationEnd] = useState('');
  const [featured, setFeatured] = useState(0);

  const [tempFile, setTempFile] = useState(null);
  const [tempPic, setTempPic] = useState(null);

  const [loading, setLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  useEffect(() => {
    axiosInstance.get('api/club-interest').then(res => {
      const tagList = [];
      Object.keys(res.data).forEach(key => {
        res.data[key].forEach(d => {
          const interestData = {
            id: d.interest_id,
            name: d.interest_name
              .split(' ')
              .slice(0, -1)
              .join(' '),
            type: 'interest',
          };
          tagList.push(interestData);
        });
      });
      setInterestList(tagList);
    });
  }, []);

  // resize image
  const resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        612,
        428,
        'JPEG',
        100,
        0,
        fileObj => {
          resolve(fileObj);
        },
        'file',
      );
    });

  const imageUpload = async e => {
    const file = e.target.files[0];
    const newFile = await resizeFile(file);
    setTempFile(newFile);
    setTempPic(URL.createObjectURL(newFile));
  };

  const submit = () => {
    const params = {
      title,
      notification_message: notification,
      description,
      html_content: htmlContent
        .replace(/<ins>/g, '<u>')
        .replace(/<\/ins>/g, '</u>'),
      user_id: user.user_id,
      slots: parseInt(slots, 10),
      is_featured: featured,
      additional_details: extraInfo,
      host_name: hostName,
      host_email: hostEmail,
      virtual_room_link: meetingLink,
      interest_id: interestList.find(i => i.name.includes(interest)).id,
      started_at: moment
        .utc(`${startDateTime}${moment().format('Z')}`)
        .format('YYYY-MM-DD HH:mm'),
      ended_at: moment
        .utc(`${endDateTime}${moment().format('Z')}`)
        .format('YYYY-MM-DD HH:mm'),
      registration_ended_at: moment
        .utc(`${registrationEnd}${moment().format('Z')}`)
        .format('YYYY-MM-DD HH:mm'),
      bcoin_reward: parseInt(bcoin, 10) || 0,
      image_cover: tempFile || null,
    };

    axiosInstance
      .post('api/admin/all-meetups', createFormData(params), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        setLoading(false);
        dispatch(replace(`../../admin/meetups/${res.data.data.meetup_id}`));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleEditorChange = state => {
    setEditorState(state);
    const currentContentAsHTML = draftToHtml(
      convertToRaw(state.getCurrentContent()),
    );
    setHtmlContent(currentContentAsHTML);
  };

  return (
    <div>
      <Helmet>
        <title>Admin Panel - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AdminNavigationWrapperComponent match={match}>
        <PageWrapperStyled>
          <p className="h2 white-text" style={{ marginBottom: '20px' }}>
            Create New Meetup
          </p>

          <div className="white-text">
            <Row wrap={false}>
              <Label className="bodyBold white-text">Interest / CLub</Label>
              <TypeSelector
                defaultValue={interest}
                showArrow={false}
                className="bodyBold"
                style={{
                  width: 120,
                  color:
                    interest === 'Select Live to Give Club'
                      ? Colors.placeholderTextColor
                      : Colors.pureWhite,
                }}
                onChange={value => {
                  setInterest(value);
                }}
                dropdownStyle={{ zIndex: 999999 }}
              >
                {interestList.map((option, index) => (
                  <Option
                    key={index}
                    value={option.name}
                    className="bodyBold darkGrey-text"
                  >
                    {option.name}
                  </Option>
                ))}
              </TypeSelector>
            </Row>
            <TextInputComponent
              title="Title"
              defaultValue={title}
              value={title}
              admin
              placeholder="Title"
              onChange={value => {
                setTitle(value);
              }}
            />
            <TextAreaComponent
              value={description}
              onChange={value => {
                setDescription(value);
              }}
              placeholder="Short Description (will be displayed on Card Summary)"
              label="Card Summary"
            />
            <Row wrap={false}>
              <Label className="bodyBold white-text">Description</Label>
              <TextAreaInputSection type="desc" align="middle">
                <Editor
                  placeholder={
                    isFocused ? '' : 'Full Description in HTML Format'
                  }
                  className="white-text"
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  toolbarClassName="toolbarClassName"
                  editorClassName="editorClassName white-text"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  toolbar={{
                    options: [
                      'inline',
                      'blockType',
                      'list',
                      'textAlign',
                      'link',
                      'embedded',
                      'emoji',
                      'image',
                      'colorPicker',
                    ],
                    colorPicker: {
                      colors: [
                        Colors.error,
                        Colors.cyan,
                        Colors.darkBlue,
                        Colors.black,
                        Colors.darkGrey,
                        Colors.white,
                      ],
                    },
                  }}
                />
              </TextAreaInputSection>
            </Row>
            <TextAreaComponent
              value={notification}
              onChange={value => {
                setNotification(value);
              }}
              placeholder="Notification Message"
              label="Notification Message"
            />
            <TextInputComponent
              title="Slots"
              defaultValue={slots}
              value={slots}
              admin
              placeholder="Number of slots available"
              onChange={value => {
                const reg = /^-?\d*(\.\d*)?$/;
                if (
                  // eslint-disable-next-line no-restricted-globals
                  !isNaN(value) &&
                  reg.test(value)
                ) {
                  setSlots(value);
                }
              }}
            />
            <TextInputComponent
              title="Host Name"
              defaultValue={hostName}
              value={hostName}
              admin
              placeholder="Name of Host"
              onChange={value => {
                setHostName(value);
              }}
            />
            <TextInputComponent
              title="Host Email"
              defaultValue={hostEmail}
              value={hostEmail}
              admin
              placeholder="Host Email Address"
              onChange={value => {
                setHostEmail(value);
              }}
            />
            <TextInputComponent
              title="VC Link"
              defaultValue={meetingLink}
              value={meetingLink}
              admin
              placeholder="Webex / Zoom Link"
              onChange={value => {
                setMeetingLink(value);
              }}
            />
            <TextAreaComponent
              value={extraInfo}
              onChange={value => {
                setExtraInfo(value);
              }}
              placeholder="Additional Details"
              label="Additional Details"
            />

            <TextInputComponent
              title="Bcoin Reward"
              defaultValue={bcoin}
              value={bcoin}
              admin
              placeholder="Bcoin Reward"
              onChange={value => {
                const reg = /^-?\d*(\.\d*)?$/;
                if (
                  // eslint-disable-next-line no-restricted-globals
                  !isNaN(value) &&
                  reg.test(value)
                ) {
                  setBcoin(value);
                }
              }}
            />
            <Row wrap={false}>
              <Label className="bodyBold white-text">Start & End Date</Label>
              <Col flex="auto">
                <Row justify="space-between">
                  <DateTimePicker
                    className="bodyBold white-text"
                    placeholder="Start Date & Time"
                    disabledDate={current =>
                      current && current < moment().startOf('day')
                    }
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(value, dateString) => {
                      setStartDateTime(dateString);
                    }}
                  />
                  <DateTimePicker
                    className="bodyBold white-text"
                    placeholder="End Date & Time"
                    disabledDate={current =>
                      current && current < moment().startOf('day')
                    }
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(value, dateString) => {
                      setEndDateTime(dateString);
                    }}
                  />
                </Row>
              </Col>
            </Row>
            <Row wrap={false}>
              <Label className="bodyBold white-text">
                Registration Ended Date
              </Label>
              <Col flex="auto">
                <Row justify="space-between">
                  <RegistrationDateTimePicker
                    className="bodyBold white-text"
                    placeholder="Registration Ended Date & Time"
                    disabledDate={current =>
                      current && current < moment().startOf('day')
                    }
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(value, dateString) => {
                      setRegistrationEnd(dateString);
                    }}
                  />
                </Row>
              </Col>
            </Row>
            <Row wrap={false} style={{ margin: '-10px 0px 15px' }}>
              <Label className="bodyBold white-text">Featured</Label>
              <Radio.Group
                onChange={async e => {
                  setFeatured(e.target.value === 'Yes' ? 1 : 0);
                }}
                value={featured === 0 ? 'No' : 'Yes'}
              >
                <Row>
                  {['Yes', 'No'].map((option, i) => (
                    <div key={i} style={{ padding: '5px 10px' }}>
                      <Radio
                        className="white-text bodyBold"
                        value={option}
                        style={{ padding: '5px' }}
                      >
                        {option}
                      </Radio>
                    </div>
                  ))}
                </Row>
              </Radio.Group>
            </Row>
            <Row wrap={false}>
              <Label className="bodyBold white-text">Cover Image</Label>
              {tempPic ? (
                <ImageUploadSection justify="center">
                  <img src={tempPic} alt="profile-pic" />
                  <input
                    accept="image/*"
                    className="pic"
                    id="pic"
                    style={{ display: 'none' }}
                    onChange={imageUpload}
                    type="file"
                  />
                  <label htmlFor="pic">
                    <UpdateIcon>
                      <img src={Images.editIcon} alt="upload" />
                    </UpdateIcon>
                  </label>
                </ImageUploadSection>
              ) : (
                <UploadPicSection
                  justify="center"
                  align="middle"
                  className="bodyBold"
                >
                  <input
                    accept="image/*"
                    className="pic"
                    multiple
                    id="pic"
                    style={{ display: 'none' }}
                    onChange={imageUpload}
                    type="file"
                  />
                  <label htmlFor="pic">
                    <UploadIcon>
                      <img src={Images.camera} alt="upload" />
                    </UploadIcon>
                  </label>
                </UploadPicSection>
              )}
            </Row>
            <Row justify="center">
              <PrimaryButtonComponent
                style={{
                  margin: '50px 20px 20px',
                  width: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                label="Save and Preview"
                loading={loading}
                disabled={
                  !title ||
                  !title.trim().length ||
                  !description ||
                  !description.trim().length ||
                  !htmlContent ||
                  !htmlContent.trim().length ||
                  !notification ||
                  !notification.trim().length ||
                  interest === 'Select Live to Give Club' ||
                  !startDateTime ||
                  !endDateTime ||
                  !registrationEnd ||
                  !slots ||
                  !hostName ||
                  !hostName.trim().length ||
                  !hostEmail ||
                  !hostEmail.trim().length ||
                  !extraInfo ||
                  !extraInfo.trim().length
                }
                onClick={submit}
              />
            </Row>
          </div>
        </PageWrapperStyled>
      </AdminNavigationWrapperComponent>
    </div>
  );
}

MeetupCreatePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  meetupCreatePage: makeSelectMeetupCreatePage(),
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
)(MeetupCreatePage);
