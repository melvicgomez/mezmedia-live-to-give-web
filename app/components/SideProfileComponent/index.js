/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * SideProfileComponent
 *
 */

import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';
import axiosInstance, { createFormData } from 'services';
import { Col, Row, Modal } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import moment from 'moment';
import BcoinValueComponent from 'components/BcoinValueComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import Resizer from 'react-image-file-resizer';
import { badgeRankNames } from 'utils/constants';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { reactLocalStorage } from 'reactjs-localstorage';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const Text = styled.p`
  margin-bottom: 5px;
`;

const UserPhoto = styled.img`
  height: 292px;
  width: 396px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  -khtml-user-select: none;
  -o-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  object-fit: cover;
`;

const NoImagePlaceholder = styled(Row)`
  height: 292px;
  width: 396px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: 3px solid ${Colors.pureWhite};
`;

const UserInfoBar = styled(Row)`
  min-height: 80px;
  width: 396px;
  padding: 10px 20px;
  background-color: ${Colors.textInput};

  > div:last-child {
    display: flex;
    align-items: center;
  }
`;

const AdminUserInfoBar = styled.div`
  min-height: 80px;
  width: 396px;
  padding: 10px 20px;
  background-color: ${Colors.textInput};

  > div:last-child {
    display: flex;
    align-items: center;
  }
`;

const CountryIcon = styled.img`
  height: 22px;
  width: 22px;
  margin-right: 10px;
`;

const UserBadgeBar = styled.div`
  height: 176px;
  width: 396px;
  padding: 10px 20px;
  background-color: ${Colors.digital};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  > p {
    margin-bottom: 15px;
  }
`;

const BadgeIcon = styled.img`
  height: 37px;
  width: 37px;
  margin-right: 5px;
`;

const ProgressBar = styled.div`
  height: 14px;
  width: 100%;
  background-color: ${Colors.mediumGray};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 2px 2px 0px #00000025;
  margin-bottom: 8px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${Colors.grapefruit};
  width: ${props => props.width};
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const BcoinIcon = styled.img`
  height: 26px;
  width: 24px;
  margin-left: 5px;
`;

const InfoButton = styled.div`
  margin-top: 5px;
  border-radius: 50px;
  width: 14px;
  height: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > img {
    height: 20px;
    width: 15px;
    object-fit: contain;
  }
`;

const UploadIcon = styled.div`
  background-color: ${Colors.primary};
  height: 56px;
  width: 56px;
  border-radius: 50px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  > input {
    height: 56px;
    width: 56px;
    opacity: 0;
    cursor: pointer;
  }

  > img {
    height: 27px;
    width: 27px;
  }
`;

const Popup = styled(Modal)`
  background-color: ${Colors.pureWhite} !important;
  border-radius: 16px;
  padding-bottom: 0px;
  width: auto !important;
  overflow: hidden;

  > div {
    background-color: ${Colors.pureWhite};
  }

  > .ant-modal-content {
    box-shadow: 0px !important;
    padding: 25px 10px 10px;
    width: 400px;

    > div > div {
      margin-bottom: 15px;
    }
  }
`;

function SideProfileComponent({ dispatch, admin, id }) {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState('');

  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const tempUser = reactLocalStorage.getObject('user');
    axiosInstance.get(`api/user/${admin ? id : tempUser.user_id}`).then(res => {
      const data = res.data.data.user;
      setUser(data);
      if (!admin) {
        reactLocalStorage.setObject('user', data);
      }
      setPhoto(data.photo_url);
    });
  }, []);

  const getBadge = () => {
    const badgeProgress = [
      0,
      50,
      100,
      150,
      225,
      300,
      450,
      600,
      900,
      2250,
      3000,
      3750,
      5000,
      5750,
      6500,
    ];

    let rankIndex = 0;
    badgeProgress.forEach((progress, i) => {
      if (progress <= (user.bcoin_total_sum_amount || 0)) {
        rankIndex = i;
      }
    });

    return {
      rankIndex,
      point:
        badgeProgress[
          rankIndex === badgeProgress.length - 1 ? rankIndex : rankIndex + 1
        ],
    };
  };

  const getBcoinProgress = () =>
    ((user.bcoin_total_sum_amount || 0) / getBadge().point) * 100;

  const handleUpload = async e => {
    const file = e.target.files[0];
    const newFile = await resizeFile(file);
    axiosInstance
      .post(
        'api/user',
        createFormData({
          user_id: user.user_id,
          photo_url: newFile,
        }),
      )
      .then(response => {
        reactLocalStorage.setObject('user', response.data.data.user);
        setPhoto(response.data.data.user.photo_url);
      });
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

  const deletePhoto = () => {
    if (admin) {
      axiosInstance
        .get(`api/admin/user-delete-photo/${id}`)
        .then(() => {
          setPhoto(null);
          setDeleteModalVisible(false);
        })
        .catch(err => console.log('err', err));
    }
  };

  return user ? (
    <div style={{ margin: '15px 10px 0px 0px' }}>
      <div style={{ position: 'relative' }}>
        {photo ? (
          <UserPhoto
            draggable={false}
            src={`${process.env.IMAGE_URL_PREFIX}user-profile/${
              user.user_id
            }/${photo}`}
            onError={() => setPhoto(null)}
          />
        ) : (
          <NoImagePlaceholder align="middle" justify="center">
            <Col align="middle">
              <PictureOutlined
                style={{ fontSize: '90px', color: Colors.pureWhite }}
              />
              <div className="h3 white-text">No Image Available</div>
            </Col>
          </NoImagePlaceholder>
        )}
        <input
          accept="image/*"
          className="input"
          id="files"
          style={{ display: 'none' }}
          onChange={handleUpload}
          type="file"
        />
        {admin ? (
          <UploadIcon onClick={() => setDeleteModalVisible(true)}>
            <img src={Images.deleteWhiteIcon} alt="delete" />
          </UploadIcon>
        ) : (
          <label htmlFor="files">
            <UploadIcon>
              <img src={Images.editIcon} alt="upload" />
            </UploadIcon>
          </label>
        )}
      </div>
      {!admin ? (
        <UserInfoBar wrap={false} justify="space-between">
          <Row
            wrap={false}
            align="middle"
            justify="space-between"
            style={{ width: '100%' }}
          >
            <Row wrap={false} align="middle">
              <CountryIcon
                src={Images.country[countryIcon[user.country_code]]}
              />
              <Text className="h2 cyan-text">{`${user.first_name} ${
                user.last_name
              }`}</Text>
            </Row>
            <InfoButton
              className="captionBold darkGrey-text"
              onClick={() => setEditModalVisible(true)}
            >
              <img src={Images.infoIcon} alt="info" />
            </InfoButton>
          </Row>
        </UserInfoBar>
      ) : (
        <AdminUserInfoBar>
          <div className="bodyBold white-text">User ID {user.user_id}</div>
          <div className="h2 cyan-text">
            {`${user.first_name} ${user.last_name}`}
          </div>
          <Row wrap={false} align="middle">
            <CountryIcon src={Images.country[countryIcon[user.country_code]]} />
            <Text className="body white-text">{user.email}</Text>
          </Row>
        </AdminUserInfoBar>
      )}
      <UserBadgeBar className="white-text">
        <Text className="h2">Badge</Text>
        <Row style={{ marginBottom: '15px' }}>
          <Col flex="none">
            <BadgeIcon src={Images.badges[getBadge().rankIndex]} />
          </Col>
          <Col flex="auto">
            <Text className="body">
              Current Badge : {badgeRankNames[getBadge().rankIndex]}
            </Text>
            <ProgressBar>
              <Progress
                width={`${
                  getBcoinProgress() > 100 ? 100 : getBcoinProgress()
                }%`}
              />
            </ProgressBar>
            <Row>
              {!admin && (
                <Col flex="none">
                  <InfoButton
                    className="captionBold darkGrey-text"
                    onClick={() => setBadgeModalVisible(true)}
                  >
                    <img src={Images.infoIcon} alt="info" />
                  </InfoButton>
                </Col>
              )}
              <Col flex="auto">
                <Row justify="end">
                  <Text className="bodyBold">
                    {user.bcoin_total_sum_amount
                      ? user.bcoin_total_sum_amount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : 0}
                    /
                    {getBadge()
                      .point.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </Text>
                  <BcoinIcon src={Images.bcoinWhiteIcon} />
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </UserBadgeBar>
      {admin && (
        <Row justify="space-between" align="middle" style={{ marginTop: 20 }}>
          <Row className="bodyBold white-text">
            <div>Date Joined</div>
            <div style={{ marginLeft: 10 }}>
              {moment
                .utc(user.created_at)
                .local()
                .format('DD/MM/yyyy')}
            </div>
          </Row>
          <BcoinValueComponent bcoinValue={user.bcoin_total_sum_amount || 0} />
        </Row>
      )}
      <ConfirmationPopupComponent
        visibility={badgeModalVisible}
        dismissModal={() => {
          setBadgeModalVisible(false);
        }}
        title="About Live to Give Badges"
        message="This is your current badge. Badges start at Bronze and go all the way up to Diamond. You’ll see your badge change colour as you participate in more activities and accumulate more B Coins!"
        actionRequire={false}
      />
      <ConfirmationPopupComponent
        visibility={deleteModalVisible}
        dismissModal={() => {
          setDeleteModalVisible(false);
        }}
        title="Remove User's Photo"
        message="This action cannot be undone. Do you wish to remove this user's photo?"
        leftAction={deletePhoto}
        rightAction={() => setDeleteModalVisible(false)}
      />
      <Popup
        className="darkGrey-text"
        centered
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
        }}
        footer={null}
      >
        <Row justify="center" className="h3">
          Edit Personal Details
        </Row>
        <div className="body" style={{ textAlign: 'center' }}>
          If you wish to edit your personal details, please contact us{' '}
          <span
            className="cyan-text bodyLink"
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch(push('../../settings/contact-us'))}
          >
            here
          </span>
          .
        </div>
      </Popup>
    </div>
  ) : null;
}

SideProfileComponent.propTypes = {
  admin: PropTypes.bool,
  id: PropTypes.number,
};

SideProfileComponent.defaultProps = {
  admin: false,
  id: 0,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SideProfileComponent);
