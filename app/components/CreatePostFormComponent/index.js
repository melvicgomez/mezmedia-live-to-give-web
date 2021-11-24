/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/**
 *
 * CreatePostFormComponent
 *
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance, { createFormData } from 'services';
import { Row, Modal, Input, Spin, Select } from 'antd';
import Resizer from 'react-image-file-resizer';
import { LoadingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { regexStr, hasInappropriateLanguage } from 'utils/constants';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';

const { TextArea } = Input;
const { Option } = Select;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 30px;
`;

const PopupModel = styled(Modal)`
  background-color: ${Colors.background};
  border-radius: 16px;
  padding: 15px 40px 5px;
  width: auto !important;
  color: ${Colors.pureWhite};
  overflow: hidden;
  margin: 20px 0px;

  > div {
    background-color: ${Colors.background};
  }

  > .ant-modal-content {
    box-shadow: none;
    padding-bottom: 0px;

    > button {
      color: ${Colors.pureWhite};
      top: -19px;
      right: -38px;
    }
  }
`;

const UploadPicSection = styled(Row)`
  background-color: ${Colors.textInput};
  height: 290px;
  width: 474px;
  border-radius: 16px;
  flex-direction: column;
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

const UploadIcon = styled.div`
  background-color: ${Colors.primary};
  height: 56px;
  width: 56px;
  margin-top: 15px;
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
    height: 290px;
    width: 474px;
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

const TagSelector = styled(Select)`
  width: 100% !important;
  margin: 20px 0px 0px;
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

function CreatePostFormComponent({ modalVisible, dismissModal, type, data }) {
  const user = reactLocalStorage.getObject('user');

  const [fetchData, setFetchData] = useState(true);

  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Select Tag for Post');

  const [tempFiles, setTempFiles] = useState([]);
  const [tempPicList, setTempPicList] = useState([]);

  const [availableTag, setAvailableTag] = useState([]);
  const [loading, setLoading] = useState(false);

  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [inappropriateWarnVisible, setInappropriateWarnVisible] = useState(
    false,
  );
  const [foreignWarnVisible, setForeignWarnVisible] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const [error, setError] = useState({
    description: false,
    tag: false,
    inappropriate: false,
    foreign: false,
  });

  useEffect(() => {
    setTempFiles([]);
    setTempPicList([]);
    setDescription('');
    setTag('Select Tag for Post');
    setError({
      description: false,
      tag: false,
      inappropriate: false,
      foreign: false,
    });
  }, [modalVisible]);

  useEffect(() => {
    if (type === 'activity') {
      axiosInstance.get('api/club-interest').then(res => {
        const tagList = [];
        Object.keys(res.data).map(key => {
          res.data[key].map(d => {
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
        setAvailableTag(tagList);
        setFetchData(false);
      });
    } else {
      setFetchData(false);
    }
  }, []);

  const submitDetails = () => {
    setLoading(true);

    let params = null;
    params =
      type === 'activity'
        ? {
            user_id: user.user_id,
            interest_id: availableTag.find(interest =>
              interest.name.includes(tag),
            ).id,
            title: availableTag.find(interest => interest.name.includes(tag))
              .name,
            content: description,
            images: tempFiles.length ? tempFiles : null,
            published_at: 1,
            feed_type: 'feed',
          }
        : type === 'club'
        ? {
            user_id: user.user_id,
            interest_id: data.interest_id,
            title: data.interest_name
              .split(' ')
              .slice(0, -1)
              .join(' '),
            content: description,
            images: tempFiles.length ? tempFiles : null,
            published_at: 1,
            feed_type: 'feed',
          }
        : type === 'challenge'
        ? {
            user_id: user.user_id,
            challenge_id: data.challenge_id,
            interest_id: data.club_interest.interest_id,
            title: data.title,
            content: description,
            images: tempFiles.length ? tempFiles : null,
            published_at: 1,
            feed_type: 'feed',
          }
        : type === 'lives'
        ? {
            user_id: user.user_id,
            live_id: data.live_id,
            interest_id: data.club_interest.interest_id,
            title: data.title,
            content: description,
            images: tempFiles.length ? tempFiles : null,
            published_at: 1,
            feed_type: 'feed',
          }
        : type === 'meetup'
        ? {
            user_id: user.user_id,
            meetup_id: data.meetup_id,
            interest_id: data.club_interest.interest_id,
            title: data.title,
            content: description,
            images: tempFiles.length ? tempFiles : null,
            published_at: 1,
            feed_type: 'feed',
          }
        : {
            user_id: user.user_id,
            challenge_id: data.challenge_id,
            interest_id: data.club_interest.interest_id,
            title: `${data.title} Entry`,
            content: description,
            images: tempFiles.length ? tempFiles : null,
            published_at: 1,
            is_challenge_entry: 1,
            feed_type: 'feed',
          };

    axiosInstance
      .post('api/activity-feed', createFormData(params), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async () => {
        setLoading(false);
        setSubmitModalVisible(true);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const imageUpload = async e => {
    const file = e.target.files[0];
    const newFile = await resizeFile(file);
    setTempFiles([newFile]);
    setTempPicList([URL.createObjectURL(newFile)]);
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

  return fetchData ? (
    <Row justify="center" style={{ height: '50px' }}>
      <Spin indicator={<LoadingSpinner spin small={1} />} />
    </Row>
  ) : (
    <PopupModel
      centered
      maskClosable={false}
      destroyOnClose
      visible={modalVisible}
      onCancel={() => {
        dismissModal();
      }}
      style={{ backgroundColor: Colors.background }}
      footer={null}
    >
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
        <UploadPicSection justify="center" align="middle" className="bodyBold">
          Upload a Photo
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
      {type === 'activity' && (
        <TagSelector
          defaultValue={tag}
          showArrow={false}
          className="bodyBold"
          error={error.tag ? 1 : 0}
          style={{
            width: 120,
            color:
              tag === 'Select Tag for Post'
                ? Colors.placeholderTextColor
                : Colors.pureWhite,
          }}
          onChange={value => {
            setTag(value);
            error.tag = false;
          }}
          dropdownStyle={{ zIndex: 999999 }}
        >
          {availableTag.map((option, index) => (
            <Option
              key={index}
              value={option.name}
              className="bodyBold darkGrey-text"
            >
              {option.name}
            </Option>
          ))}
        </TagSelector>
      )}
      <DescriptionInputSection
        type="desc"
        align="middle"
        style={{
          borderColor: error.description ? Colors.error : Colors.pureWhite,
        }}
      >
        <TextArea
          value={description}
          onChange={({ target: { value } }) => {
            setDescription(value);
            error.description = false;
          }}
          placeholder={isFocused ? '' : 'Description'}
          className="bodyBold"
          bordered={false}
          autoSize={{ minRows: 6, maxRows: 6 }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
      </DescriptionInputSection>
      <Row justify="center">
        <PrimaryButtonComponent
          style={{ margin: '5px 0px 0px' }}
          label="Submit"
          disabled={
            !description ||
            !description.trim().length ||
            (type === 'activity' ? tag === 'Select Tag for Post' : false)
          }
          onClick={() => {
            const errorChecking = { ...error };
            errorChecking.description =
              !description || !description.trim().length;
            errorChecking.tag = tag === 'Select Tag for Post';
            errorChecking.inappropriate =
              !errorChecking.description &&
              hasInappropriateLanguage(description);
            errorChecking.foreign =
              !errorChecking.description &&
              !regexStr.englishAndEmoji.test(description);

            if (
              !errorChecking.description &&
              !errorChecking.inappropriate &&
              !errorChecking.foreign &&
              (type === 'activity' ? !errorChecking.tag : true)
            ) {
              setConfirmModalVisible(true);
            } else {
              setError(errorChecking);
              setForeignWarnVisible(errorChecking.foreign);
              setInappropriateWarnVisible(errorChecking.inappropriate);
            }
          }}
          loading={loading}
        />
      </Row>
      <ConfirmationPopupComponent
        visibility={confirmModalVisible}
        dismissModal={() => {
          setConfirmModalVisible(false);
        }}
        title="Make a Post"
        message={
          type === 'entry'
            ? 'This will be submitted as your entry'
            : 'This will be posted on the Activity Feed which can be viewed by all Live to Give users'
        }
        rightAction={() => setConfirmModalVisible(false)}
        rightLabel="Cancel"
        leftAction={() => {
          setConfirmModalVisible(false);
          submitDetails();
        }}
        leftLabel="Confirm"
      />
      <ConfirmationPopupComponent
        visibility={inappropriateWarnVisible}
        dismissModal={() => {
          setInappropriateWarnVisible(false);
        }}
        title="Inappropriate Language"
        message="It appears your post contains inappropriate language which contravenes the Live to Give User Guidelines and cannot be published. Please review your post and make the necessary edits. If this is incorrect, please contact the Support Team via the Settings page."
        actionRequire={false}
      />
      <ConfirmationPopupComponent
        visibility={foreignWarnVisible}
        dismissModal={() => {
          setForeignWarnVisible(false);
        }}
        title="Only alphanumeric characters allowed"
        message="Please note that only alphanumeric characters (A-Z, a-z, 0-9), punctuation and emojis are allowed in your posts. Please amend your post accordingly in order to successfully submit it"
        actionRequire={false}
      />
      <ConfirmationPopupComponent
        visibility={submitModalVisible}
        dismissModal={() => {
          setSubmitModalVisible(false);
          setTempFiles([]);
          setTempPicList([]);
          setDescription('');
          setTag('Select Tag for Post');
          dismissModal();
        }}
        title={type === 'entry' ? 'Submit Successful' : 'Post Successful'}
        message={
          type === 'entry'
            ? 'Great your entry is submitted!'
            : 'Great, your post has been uploaded!'
        }
        actionRequire={false}
      />
    </PopupModel>
  );
}

CreatePostFormComponent.propTypes = {
  modalVisible: PropTypes.bool,
  dismissModal: PropTypes.func,
  type: PropTypes.string,
  data: PropTypes.object,
};

CreatePostFormComponent.defaultProps = {
  data: {},
};

export default CreatePostFormComponent;
