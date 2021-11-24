/**
 *
 * PollCreatePage
 *
 */

import React, { memo, useState } from 'react';
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
import { Row, Col, DatePicker } from 'antd';
import TextInputComponent from 'components/TextInputComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectPollCreatePage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div`
  width: 800px;
  margin: 10px 30px 20px;
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

export function PollCreatePage({ match, dispatch }) {
  useInjectReducer({ key: 'pollCreatePage', reducer });
  useInjectSaga({ key: 'pollCreatePage', saga });

  const [title, setTitle] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const [tempFile, setTempFile] = useState(null);
  const [tempPic, setTempPic] = useState(null);

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const params = {
      title,
      option_one: option1,
      option_two: option2,
      option_three: option3,
      option_four: option4,
      started_at: moment
        .utc(`${startDateTime}${moment().format('Z')}`)
        .format('YYYY-MM-DD HH:mm'),
      ended_at: moment
        .utc(`${endDateTime}${moment().format('Z')}`)
        .format('YYYY-MM-DD HH:mm'),
      image_cover: tempFile || null,
    };

    axiosInstance
      .post('api/admin/all-polls', createFormData(params), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        setLoading(false);
        dispatch(replace(`../../admin/polls/${res.data.data.poll_id}`));
      })
      .catch(() => {
        setLoading(false);
      });
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
            Poll Question
          </p>

          <div className="white-text">
            <TextInputComponent
              title="Poll Question"
              defaultValue={title}
              value={title}
              admin
              placeholder="Poll Question"
              onChange={value => {
                setTitle(value);
              }}
            />
            <TextInputComponent
              title="Answer #1"
              defaultValue={option1}
              value={option1}
              admin
              placeholder="Answer #1"
              onChange={value => {
                setOption1(value);
              }}
            />
            <TextInputComponent
              title="Answer #2"
              defaultValue={option2}
              value={option2}
              admin
              placeholder="Answer #2"
              onChange={value => {
                setOption2(value);
              }}
            />
            <TextInputComponent
              title="Answer #3"
              defaultValue={option3}
              value={option3}
              admin
              placeholder="Answer #3"
              onChange={value => {
                setOption3(value);
              }}
            />
            <TextInputComponent
              title="Answer #4"
              defaultValue={option4}
              value={option4}
              admin
              placeholder="Answer #4"
              onChange={value => {
                setOption4(value);
              }}
            />
            <Row wrap={false}>
              <Label className="bodyBold white-text">Start & End Date</Label>
              <Col flex="auto">
                <Row justify="space-between">
                  <DateTimePicker
                    className="bodyBold white-text"
                    placeholder="Start Date & Time"
                    showNow={false}
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
                    showNow={false}
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
              <Label className="bodyBold white-text">Poll Image</Label>
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
                  !option1 ||
                  !option1.trim().length ||
                  !option2 ||
                  !option2.trim().length ||
                  !option3 ||
                  !option3.trim().length ||
                  !option4 ||
                  !option4.trim().length ||
                  !startDateTime ||
                  !endDateTime
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

PollCreatePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pollCreatePage: makeSelectPollCreatePage(),
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
)(PollCreatePage);
