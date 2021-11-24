/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/**
 *
 * OfficialPostCreatePage
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
import { replace } from 'connected-react-router';
import Resizer from 'react-image-file-resizer';
import { Select, Row, Radio, Col, DatePicker } from 'antd';
import TextInputComponent from 'components/TextInputComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import TextAreaComponent from 'components/admin/TextAreaComponent';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import moment from 'moment';

import { reactLocalStorage } from 'reactjs-localstorage';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectOfficialPostCreatePage from './selectors';
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
const DateTimePicker = styled(DatePicker)`
  background-color: ${Colors.textInput};
  height: 48px;
  width: 100%;
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

const Divider = styled.div`
  height: 2px;
  background-color: ${Colors.pureWhite};
  width: 100%;
  margin: 40px 0px;
`;

export function OfficialPostCreatePage({ match, dispatch }) {
  useInjectReducer({ key: 'officialPostCreatePage', reducer });
  useInjectSaga({ key: 'officialPostCreatePage', saga });

  const user = reactLocalStorage.getObject('user');
  const [feedType, setFeedType] = useState('Select Feed Type');
  const [interestList, setInterestList] = useState([]);

  useEffect(() => {
    axiosInstance.get('api/club-interest').then(res => {
      const tagList = [];
      Object.keys(res.data).forEach(key => {
        res.data[key].forEach(d => {
          const interest = {
            id: d.interest_id,
            name: d.interest_name
              .split(' ')
              .slice(0, -1)
              .join(' '),
            type: 'interest',
          };
          tagList.push(interest);
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

  const Form = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [notification, setNotification] = useState('');
    const [pinPost, setPinPost] = useState(1);
    const [interest, setInterest] = useState('Select Live to Give Club');
    const [tempFiles, setTempFiles] = useState([]);
    const [tempPicList, setTempPicList] = useState([]);
    const [scheduleAt, setScheduleAt] = useState(null);

    const [loading, setLoading] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [editorState, setEditorState] = useState(() =>
      EditorState.createEmpty(),
    );

    const imageUpload = async e => {
      const file = e.target.files[0];
      const newFile = await resizeFile(file);
      setTempFiles([newFile]);
      setTempPicList([URL.createObjectURL(newFile)]);
    };

    const submit = () => {
      setLoading(true);
      const params =
        feedType === 'Announcement'
          ? {
              title,
              notification_message: notification,
              content,
              html_content: htmlContent
                .replace(/<ins>/g, '<u>')
                .replace(/<\/ins>/g, '</u>'),
              feed_type: 'announcement',
              user_id: user.user_id,
              is_official: 1,
              is_announcement: 1,
              images: tempFiles.length ? tempFiles : null,
              pin_post: pinPost,
            }
          : {
              title,
              notification_message: notification,
              content,
              html_content: htmlContent
                .replace(/<ins>/g, '<u>')
                .replace(/<\/ins>/g, '</u>'),
              feed_type: 'official',
              user_id: user.user_id,
              is_official: 1,
              is_announcement: 0,
              images: tempFiles.length ? tempFiles : null,
              interest_id: interestList.find(i => i.name.includes(interest)).id,
              pin_post: pinPost,
              scheduled_at: scheduleAt || '',
            };

      axiosInstance
        .post('api/admin/all-officials', createFormData(params), {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          setLoading(false);
          dispatch(replace(`../../admin/officials/${res.data.data.feed_id}`));
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
      <form className="white-text">
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
          value={content}
          onChange={value => {
            setContent(value);
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
        {feedType === 'Official' && (
          <Row wrap={false}>
            <Label className="bodyBold white-text">Interest / Club</Label>
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
        )}
        <Row wrap={false} style={{ margin: '-10px 0px 15px' }}>
          <Label className="bodyBold white-text">Pin Post</Label>
          <Radio.Group
            onChange={async e => {
              setPinPost(e.target.value === 'Yes' ? 1 : 0);
            }}
            value={pinPost === 0 ? 'No' : 'Yes'}
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
          {tempPicList.length > 0 ? (
            <ImageUploadSection justify="center">
              <img src={tempPicList[0]} alt="profile-pic" />
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
        {feedType === 'Official' && (
          <>
            <Divider />
            <Row wrap={false}>
              <Label className="bodyBold white-text">
                Schedule Date (Optional)
              </Label>
              <Col flex="auto">
                <Row justify="space-between">
                  <DateTimePicker
                    defaultValue={null}
                    className="bodyBold white-text"
                    placeholder="Schedule Date"
                    showNow={false}
                    disabledDate={current =>
                      current && current < moment().startOf('day')
                    }
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(value, dateString) => {
                      setScheduleAt(dateString);
                    }}
                  />
                </Row>
              </Col>
            </Row>
          </>
        )}

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
              !content ||
              !content.trim().length ||
              !htmlContent ||
              !htmlContent.trim().length ||
              !notification ||
              !notification.trim().length ||
              (feedType === 'Official'
                ? interest === 'Select Live to Give Club'
                : false)
            }
            onClick={submit}
          />
        </Row>
      </form>
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
            Create New Activity Feed
          </p>
          <Row wrap={false}>
            <Label className="bodyBold white-text">Post Type</Label>
            <TypeSelector
              defaultValue={feedType}
              showArrow={false}
              className="bodyBold"
              style={{
                width: 120,
                color:
                  feedType === 'Select Feed Type'
                    ? Colors.placeholderTextColor
                    : Colors.pureWhite,
              }}
              onChange={value => {
                setFeedType(value);
              }}
              dropdownStyle={{ zIndex: 999999 }}
            >
              {['Official', 'Announcement'].map((option, index) => (
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
          {feedType !== 'Select Feed Type' && <Form />}
        </PageWrapperStyled>
      </AdminNavigationWrapperComponent>
    </div>
  );
}

OfficialPostCreatePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  officialPostCreatePage: makeSelectOfficialPostCreatePage(),
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
)(OfficialPostCreatePage);
