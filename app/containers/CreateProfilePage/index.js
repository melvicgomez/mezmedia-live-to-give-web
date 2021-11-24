/* eslint-disable react/no-array-index-key */
/*
 * UserRegistrationPage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { memo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import axiosInstance, { createFormData } from 'services';
import AppBarComponent from 'components/AppBarComponent';
import styled from 'styled-components';
import TextInputComponent from 'components/TextInputComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { regexStr, hasInappropriateLanguage, locations } from 'utils/constants';
import { Row, Select } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import Resizer from 'react-image-file-resizer';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCreateProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';

const { Option } = Select;

const PageWrapperStyled = styled.div`
  background-color: ${Colors.background};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  padding-top: 68px;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .error-messages {
    background: ${Colors.white};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.3);
    margin-bottom: 10px;
    display: flex;
    margin-top: 20px;
  }
`;

const Form = styled.div`
  width: 334px !important;
  min-height: calc(100vh-68px);
  padding: 20px 0px;
`;

const ImageUploadSection = styled(Row)`
  position: relative;

  > img {
    width: 334px;
    height: 198px;
    object-fit: cover;
    border-radius: 8px;
    margin: 10px 0px 40px;
  }
`;

const FormImagePlaceholder = styled(Row)`
  height: 198px;
  width: 334px;
  background-color: ${Colors.textInput};
  margin: 10px 0px 40px;
  border-radius: 8px;

  > img {
    height: 76px;
    width: 76px;
  }
`;

const UpdateIcon = styled.div`
  background-color: ${Colors.primary};
  height: 56px;
  width: 56px;
  border-radius: 50px;
  position: absolute;
  bottom: 3px;
  left: 42%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    height: 32px;
    width: 32px;
  }
`;

const StyledInput = styled.div`
  margin-bottom: 14px;

  .input-title {
    margin-bottom: 6px;
  }
`;

const LocationSelector = styled(Select)`
  width: 100% !important;
  border: ${props =>
    props.error
      ? `2px solid ${Colors.error}`
      : `2px solid ${Colors.pureWhite}`} !important;
  border-radius: 16px !important;

  > .ant-select-selector {
    height: 48px !important;
    border: none !important;
    background-color: ${Colors.textInput} !important;
    border-radius: 16px !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
  }
`;

export function CreateProfilePage({ location, dispatch }) {
  useInjectReducer({ key: 'createProfilePage', reducer });
  useInjectSaga({ key: 'createProfilePage', saga });

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [officeLocation, setOfficeLocation] = useState(
    'Please select your office location',
  );
  const [tempPic, setTempPic] = useState(null);
  const [tempFile, setTempFile] = useState(null);

  const [error, setError] = useState({
    fname: false,
    lname: false,
    officeLocation: false,
  });
  const [warning, setWarning] = useState({
    inappropriateFName: false,
    characterFName: false,
    inappropriateLName: false,
    characterLName: false,
  });

  const submitDetails = () => {
    const errorChecking = { ...error };

    errorChecking.fname = !fName || !fName.trim().length;
    errorChecking.lname = !lName || !lName.trim().length;
    errorChecking.officeLocation =
      officeLocation === 'Please select your office location';

    const languageChecking = { ...warning };
    if (!errorChecking.fname) {
      languageChecking.inappropriateFName = hasInappropriateLanguage(fName);
      languageChecking.characterFName = !regexStr.name.test(fName);
    }
    if (!errorChecking.lname) {
      languageChecking.inappropriateLName = hasInappropriateLanguage(lName);
      languageChecking.characterLName = !regexStr.name.test(lName);
    }

    if (
      !errorChecking.fname &&
      !errorChecking.lname &&
      !errorChecking.officeLocation &&
      !languageChecking.inappropriateFName &&
      !languageChecking.inappropriateLName &&
      !languageChecking.characterFName &&
      !languageChecking.characterLName
    ) {
      axiosInstance
        .post(
          'api/user',
          createFormData({
            user_id: location.state.user_id,
            first_name: fName,
            last_name: lName,
            country_code: officeLocation,
            photo_url: tempFile,
            is_verified: 1,
          }),
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then(() => {
          dispatch(
            push({
              pathname: `/my-interests`,
              state: {
                user_id: location.state.user_id,
                access_token: location.state.access_token,
                expires_in: location.state.expires_in,
                expires_at: location.state.expires_at,
                useToken: location.state.useToken,
              },
            }),
          );
        });
    } else {
      setError(errorChecking);
      setWarning(languageChecking);
    }
  };

  const imageUpload = async e => {
    const file = e.target.files[0];
    const newFile = await resizeFile(file);
    setTempFile(newFile);
    setTempPic(URL.createObjectURL(newFile));
  };

  const resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        396,
        292,
        'JPEG',
        100,
        0,
        fileObj => {
          resolve(fileObj);
        },
        'file',
      );
    });

  return (
    <div>
      <Helmet>
        <title>Create User Profile - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled>
        <Form>
          <ImageUploadSection justify="center">
            <div className="white-text bodyBold">Upload a Profile Photo</div>
            {!tempPic ? (
              <FormImagePlaceholder align="middle" justify="center">
                <img src={Images.profileIcon} alt="profile-pic" />
              </FormImagePlaceholder>
            ) : (
              <img src={tempPic} alt="profile-pic" />
            )}

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
                <img src={Images.camera} alt="upload" />
              </UpdateIcon>
            </label>
          </ImageUploadSection>
          <TextInputComponent
            title="Your First Name"
            defaultValue={fName}
            value={fName}
            hasError={error.fname}
            placeholder="Please enter your first name"
            onChange={value => {
              error.fname = false;
              setFName(value);
            }}
          />
          <TextInputComponent
            title="Your Last Name"
            defaultValue={lName}
            value={lName}
            hasError={error.lname}
            placeholder="Please enter your last name"
            onChange={value => {
              error.lname = false;
              setLName(value);
            }}
          />
          <StyledInput>
            <p className="bodyBold white-text input-title">Office Location</p>
            <LocationSelector
              defaultValue={officeLocation}
              showArrow={false}
              style={{
                width: 120,
                color:
                  officeLocation === 'Please select your office location'
                    ? Colors.placeholderTextColor
                    : Colors.pureWhite,
              }}
              error={error.officeLocation ? 1 : 0}
              className="bodyBold"
              onChange={value => {
                error.officeLocation = false;
                setOfficeLocation(value);
              }}
              dropdownStyle={{ zIndex: 999999 }}
            >
              {locations.map((option, index) => (
                <Option
                  key={index}
                  value={option}
                  className="bodyBold darkGrey-text"
                >
                  {option}
                </Option>
              ))}
            </LocationSelector>
          </StyledInput>

          {error.fname ||
          error.lname ||
          error.location ||
          warning.inappropriateFName ||
          warning.inappropriateLName ||
          warning.characterFName ||
          warning.characterLName ? (
            <div className="error-messages">
              <Row style={{ marginTop: '5px' }}>
                <ExclamationCircleFilled
                  className="error-text"
                  style={{ marginRight: 12 }}
                />
              </Row>
              <div className="error-text body">
                {(error.fname || error.lname) && (
                  <div>• Your first and last name is required.</div>
                )}
                {error.officeLocation && (
                  <div>• Please select your office location.</div>
                )}
                {(warning.inappropriateFName || warning.inappropriateLName) && (
                  <div>
                    • Inappropriate language detected in
                    {warning.inappropriateFName ? ' first name' : ' last name'}
                  </div>
                )}
                {(warning.characterFName || warning.characterLName) && (
                  <div>
                    • Only alphanumeric characters and some symbols are allowed
                    for this field
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <Row justify="center">
            <PrimaryButtonComponent
              style={{ margin: '15px 0px 0px' }}
              label="Next"
              onClick={submitDetails}
              disabled={
                !fName ||
                !lName ||
                officeLocation === 'Please select your office location'
              }
            />
          </Row>
        </Form>
      </PageWrapperStyled>
    </div>
  );
}

CreateProfilePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  myInterestPage: makeSelectCreateProfilePage(),
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
)(CreateProfilePage);
