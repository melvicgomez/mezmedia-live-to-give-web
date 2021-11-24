/* eslint-disable react/no-array-index-key */
/**
 *
 * OfficialPostEditPage
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
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { push } from 'connected-react-router';
import Resizer from 'react-image-file-resizer';
import { Select, Row, Radio, Spin, Col, DatePicker } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import TextInputComponent from 'components/TextInputComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import TextAreaComponent from 'components/admin/TextAreaComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import moment from 'moment';
import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectOfficialPostEditPage from './selectors';
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

export function OfficialPostEditPage({ match, dispatch }) {
  useInjectReducer({ key: 'officialPostEditPage', reducer });
  useInjectSaga({ key: 'officialPostEditPage', saga });

  const [feedData, setFeedData] = useState(null);
  const [interestList, setInterestList] = useState([]);

  const [loadData, setLoadData] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    getData();
  }, []);

  const getData = async () => {
    const request1 = await axiosInstance
      .get(`api/activity-feed/${match.params.id}`)
      .then(res => {
        setFeedData(res.data.data);
      });

    const request2 = await axiosInstance.get('api/club-interest').then(res => {
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

  const Form = ({ feed }) => {
    const [title, setTitle] = useState(feed.title);
    const [content, setContent] = useState(feed.content);
    const [htmlContent, setHtmlContent] = useState(feed.html_content);
    const [pinPost, setPinPost] = useState(feed.pin_post);
    const [interest, setInterest] = useState(
      feed.is_announcement
        ? 1
        : interestList.find(i => i.id === feed.interest_id).name,
    );
    const [notification, setNotification] = useState(feed.notification_message);
    const [image] = useState(
      feed.images.length ? feed.images[0].image_path : '',
    );
    const [tempFiles, setTempFiles] = useState([]);
    const [tempPicList, setTempPicList] = useState([]);
    const [scheduleAt, setScheduleAt] = useState(feed.scheduled_at);

    const [loading, setLoading] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [editorState, setEditorState] = useState(() => {
      if (feed.html_content) {
        const blocksFromHTML = convertFromHTML(feed.html_content);
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
      setTempFiles([newFile]);
      setTempPicList([URL.createObjectURL(newFile)]);
    };

    const submit = () => {
      setLoading(true);
      const params =
        feed.feed_type === 'announcement'
          ? {
              feed_id: feed.feed_id,
              title,
              content,
              html_content: htmlContent
                .replace(/<ins>/g, '<u>')
                .replace(/<\/ins>/g, '</u>'),
              images: tempFiles.length ? tempFiles : null,
              pin_post: pinPost,
            }
          : {
              feed_id: feed.feed_id,
              title,
              content,
              html_content: htmlContent
                .replace(/<ins>/g, '<u>')
                .replace(/<\/ins>/g, '</u>'),
              images: tempFiles.length ? tempFiles : null,
              pin_post: pinPost,
              scheduled_at: scheduleAt || '',
              interest_id: interestList.find(i => i.name.includes(interest)).id,
            };

      if (!feed.published_at) {
        params.notification_message = notification;
      }

      axiosInstance
        .post('api/admin/all-officials', createFormData(params), {
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
        {/* <TextAreaComponent
          value={htmlContent}
          onChange={value => {
            setHtmlContent(value);
          }}
          placeholder="Full Description in HTML Format"
          label="Description"
        /> */}
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
        {!feed.published_at && (
          <TextAreaComponent
            value={notification}
            onChange={value => {
              setNotification(value);
            }}
            placeholder="Notification Message"
            label="Notification Message"
          />
        )}
        {feed.feed_type === 'official' && (
          <Row wrap={false}>
            <Label className="bodyBold white-text">Interest / Club</Label>
            <TypeSelector
              defaultValue={interest}
              showArrow={false}
              className="bodyBold"
              style={{
                width: 120,
                color: Colors.pureWhite,
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
          {image || tempPicList.length > 0 ? (
            <ImageUploadSection justify="center">
              <img
                src={
                  tempPicList.length
                    ? tempPicList[0]
                    : `${process.env.IMAGE_URL_PREFIX}activity-feed/${
                        feed.feed_id
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
        {feed.feed_type === 'official' && !feed.published_at && (
          <>
            <Divider />
            <Row wrap={false}>
              <Label className="bodyBold white-text">
                Schedule Date (Optional)
              </Label>
              <Col flex="auto">
                <Row justify="space-between">
                  <DateTimePicker
                    defaultValue={scheduleAt ? moment(scheduleAt) : null}
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
            label="Update"
            loading={loading}
            disabled={
              !title ||
              !title.trim().length ||
              !content ||
              !content.trim().length ||
              !htmlContent ||
              !htmlContent.trim().length ||
              (!feed.published_at
                ? !notification || !notification.trim().length
                : false)
            }
            onClick={submit}
          />
        </Row>
        <ConfirmationPopupComponent
          visibility={submitModalVisible}
          dismissModal={() => {
            setSubmitModalVisible(false);
            dispatch(push(`../../../admin/officials/${feed.feed_id}`));
          }}
          title="Update Successful"
          message={`The ${
            feed.feed_type === 'announcement'
              ? 'announcement'
              : 'official article'
          } has been updated!`}
          actionRequire={false}
        />
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
            Edit Activity Feed
          </p>
          {!loadData && feedData ? (
            <Form feed={feedData} />
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

OfficialPostEditPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  officialPostEditPage: makeSelectOfficialPostEditPage(),
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
)(OfficialPostEditPage);
