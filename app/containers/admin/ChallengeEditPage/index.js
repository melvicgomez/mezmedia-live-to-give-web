/* eslint-disable react/no-array-index-key */
/**
 *
 * ChallengeEditPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import axiosInstance, { createFormData } from 'services';
import styled from 'styled-components';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { push } from 'connected-react-router';
import Resizer from 'react-image-file-resizer';
import { Select, Row, Col, DatePicker, Radio, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import TextInputComponent from 'components/TextInputComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import TextAreaComponent from 'components/admin/TextAreaComponent';
import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { reactLocalStorage } from 'reactjs-localstorage';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectChallengeEditPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const { Option } = Select;

const PageWrapperStyled = styled.div`
  width: 800px;
  margin: 10px 30px 20px;
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 40px;
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

export function ChallengeEditPage({ match, dispatch }) {
  useInjectReducer({ key: 'challengeEditPage', reducer });
  useInjectSaga({ key: 'challengeEditPage', saga });

  const user = reactLocalStorage.getObject('user');
  const [loadData, setLoadData] = useState(true);
  const [challengeData, setChallengeData] = useState(null);

  const [interestList, setInterestList] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);

  const getData = async () => {
    const request1 = await axiosInstance
      .get(`api/admin/all-challenges/${match.params.id}`)
      .then(res => {
        setChallengeData(res.data.data);
      });

    const request2 = await axiosInstance.get('api/club-interest').then(res => {
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

    Promise.all([request1, request2]).then(() => {
      setLoadData(false);
    });
  };

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

  const Form = ({ challenge }) => {
    const activityList = [
      'Running',
      'Walking',
      // 'Hiking',
      'Cycling',
      'Swimming',
    ];
    const metricsList = [
      'Distance',
      'Duration',
      // 'Calories'
    ];

    const [title, setTitle] = useState(challenge.title);
    const [description, setDescription] = useState(challenge.description);
    const [htmlContent, setHtmlContent] = useState(challenge.html_content);
    const [notification, setNotification] = useState(
      challenge.notification_message,
    );
    const [interest, setInterest] = useState(
      interestList.find(i => i.id === challenge.interest_id).name,
    );
    const [activity, setActivity] = useState(
      challenge.is_trackable
        ? activityList.find(a => a.toLowerCase() === challenge.type)
        : activityList[0],
    );
    const [metric, setMetric] = useState(
      challenge.is_trackable
        ? metricsList.find(m => m.toLowerCase() === challenge.target_unit)
        : metricsList[0],
    );
    const [duration, setDuration] = useState(challenge.duration || 'One-Off');
    const [goal, setGoal] = useState(
      challenge.is_trackable ? challenge.target_goal : 0,
    );
    const [bcoin, setBcoin] = useState(challenge.bcoin_reward);
    const [startDateTime, setStartDateTime] = useState(
      moment.utc(challenge.started_at),
    );
    const [endDateTime, setEndDateTime] = useState(
      moment.utc(challenge.ended_at),
    );
    const [registrationEnd, setRegistrationEnd] = useState(
      moment.utc(challenge.registration_ended_at),
    );
    const [featured, setFeatured] = useState(challenge.is_featured);

    const [image] = useState(challenge.image_cover);
    const [tempFile, setTempFile] = useState(null);
    const [tempPic, setTempPic] = useState(null);

    const [loading, setLoading] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [editorState, setEditorState] = useState(() => {
      if (challenge.html_content) {
        const blocksFromHTML = convertFromHTML(challenge.html_content);
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap,
        );
        return EditorState.createWithContent(state);
      } else {
        return EditorState.createEmpty();
      }
    });

    const imageUpload = async e => {
      const file = e.target.files[0];
      const newFile = await resizeFile(file);
      setTempFile(newFile);
      setTempPic(URL.createObjectURL(newFile));
    };

    const submit = () => {
      setLoading(true);

      let params = {
        challenge_id: challengeData.challenge_id,
        title,
        notification_message: notification,
        description,
        html_content: htmlContent
          .replace(/<ins>/g, '<u>')
          .replace(/<\/ins>/g, '</u>'),
        is_trackable: challenge.is_trackable,
        is_team_challenge: challenge.is_team_challenge,
        user_id: user.user_id,
        is_featured: featured,
        interest_id: interestList.find(i => i.name.includes(interest)).id,
        started_at: moment(startDateTime).format('YYYY-MM-DD HH:mm'),
        ended_at: moment(endDateTime).format('YYYY-MM-DD HH:mm'),
        registration_ended_at: moment(registrationEnd).format(
          'YYYY-MM-DD HH:mm',
        ),
        bcoin_reward: parseInt(bcoin, 10) || 0,
        image_cover: tempFile || null,
      };

      if (challenge.is_trackable) {
        params = {
          ...params,
          type: activity.toLowerCase(),
          target_unit: metric.toLowerCase(),
          target_goal: parseInt(goal, 10),
        };
      }

      if (duration !== 'Select Duration Label') {
        params = {
          ...params,
          duration: duration === 'One-Off' ? '' : duration,
        };
      }

      axiosInstance
        .post('api/admin/all-challenges', createFormData(params), {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          setSubmitModalVisible(true);
          setLoading(false);
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
      <>
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
                placeholder={isFocused ? '' : 'Full Description in HTML Format'}
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
          <Row wrap={false}>
            <Label className="bodyBold white-text">Duration</Label>
            <TypeSelector
              defaultValue={duration}
              showArrow={false}
              className="bodyBold"
              style={{
                width: 120,
                color:
                  duration === 'Select Duration Label'
                    ? Colors.placeholderTextColor
                    : Colors.pureWhite,
              }}
              onChange={value => {
                setDuration(value);
              }}
              dropdownStyle={{ zIndex: 999999 }}
            >
              {['Daily', 'Weekly', 'Monthly', 'One-Off'].map(
                (option, index) => (
                  <Option
                    key={index}
                    value={option}
                    className="bodyBold darkGrey-text"
                  >
                    {option}
                  </Option>
                ),
              )}
            </TypeSelector>
          </Row>
          {!!challenge.is_trackable && (
            <>
              <Row wrap={false}>
                <Label className="bodyBold white-text">Target Activity</Label>
                <TypeSelector
                  defaultValue={activity}
                  showArrow={false}
                  className="bodyBold"
                  style={{
                    width: 120,
                    color:
                      activity === 'Select Activity'
                        ? Colors.placeholderTextColor
                        : Colors.pureWhite,
                  }}
                  onChange={value => {
                    setActivity(value);
                  }}
                  dropdownStyle={{ zIndex: 999999 }}
                >
                  {activityList.map((option, index) => (
                    <Option
                      key={index}
                      value={option}
                      className="bodyBold darkGrey-text"
                    >
                      {option}
                    </Option>
                  ))}
                </TypeSelector>
              </Row>
              <Row wrap={false}>
                <Label className="bodyBold white-text">Target Metric</Label>
                <TypeSelector
                  defaultValue={metric}
                  showArrow={false}
                  className="bodyBold"
                  style={{
                    width: 120,
                    color:
                      metric === 'Select Metric'
                        ? Colors.placeholderTextColor
                        : Colors.pureWhite,
                  }}
                  onChange={value => {
                    setMetric(value);
                  }}
                  dropdownStyle={{ zIndex: 999999 }}
                >
                  {metricsList.map((option, index) => (
                    <Option
                      key={index}
                      value={option}
                      className="bodyBold darkGrey-text"
                    >
                      {option}
                    </Option>
                  ))}
                </TypeSelector>
              </Row>
              <TextInputComponent
                title="Target Goal"
                defaultValue={goal.toString()}
                value={goal.toString()}
                admin
                placeholder="Target Goal"
                onChange={value => {
                  const reg = /^-?\d*(\.\d*)?$/;
                  if (
                    // eslint-disable-next-line no-restricted-globals
                    !isNaN(value) &&
                    reg.test(value)
                  ) {
                    setGoal(value);
                  }
                }}
              />
            </>
          )}
          <TextInputComponent
            title="Bcoin Reward"
            defaultValue={bcoin ? bcoin.toString() : null}
            value={bcoin ? bcoin.toString() : null}
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
                  defaultValue={moment(startDateTime, 'YYYY-MM-DD HH:mm')}
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
                  defaultValue={moment(endDateTime, 'YYYY-MM-DD HH:mm')}
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
                  defaultValue={moment(registrationEnd, 'YYYY-MM-DD HH:mm')}
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
            {image || tempPic ? (
              <ImageUploadSection justify="center">
                <img
                  src={
                    tempPic ||
                    `${process.env.IMAGE_URL_PREFIX}/challenge/${
                      match.params.id
                    }/${image}`
                  }
                  alt="profile-pic"
                />
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
              label="Update"
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
                (challenge.is_trackable ? !activity || !metric || !goal : false)
              }
              onClick={submit}
            />
          </Row>
          <ConfirmationPopupComponent
            visibility={submitModalVisible}
            dismissModal={() => {
              setSubmitModalVisible(false);
              dispatch(
                push(`../../../admin/challenges/${challengeData.challenge_id}`),
              );
            }}
            title="Update Successful"
            message="The challenge has been updated!"
            actionRequire={false}
          />
        </div>
      </>
    );
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
            Edit Challenge
          </p>
          {!loadData && challengeData ? (
            <Form challenge={challengeData} />
          ) : (
            <Row justify="center">
              <Spin indicator={<LoadingSpinner spin />} />
            </Row>
          )}
        </PageWrapperStyled>
      </AdminNavigationWrapperComponent>
    </div>
  );
}

ChallengeEditPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  challengeEditPage: makeSelectChallengeEditPage(),
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
)(ChallengeEditPage);
