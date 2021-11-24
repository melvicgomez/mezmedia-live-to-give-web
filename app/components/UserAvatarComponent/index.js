/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * UserAvatarComponent
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StarFilled, StarTwoTone } from '@ant-design/icons';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  margin-top: 2px;
  object-fit: cover !important;
  border-radius: 8px;
`;

const Badge = styled.img`
  position: absolute;
  height: 30px;
  width: 30px;
  bottom: -15px;
  right: -11px;
`;

const FavouriteIcon = styled(StarFilled)`
  color: ${Colors.star};
  font-size: 20px;
  position: absolute;
  left: -7px;
  top: -5px;
`;

const UnfavouriteIcon = styled(StarTwoTone)`
  font-size: 20px;
  position: absolute;
  left: -7px;
  top: -5px;
`;

function UserAvatarComponent({ user, list }) {
  const currentUser = reactLocalStorage.getObject('user');

  const [imgError, setImgError] = useState(false); // handle img crash

  const [favorite] = useState(user.is_favorite);

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
      if (user.bcoin_total_sum_amount >= progress) {
        rankIndex = i;
      }
    });

    return rankIndex;
  };

  return (
    <>
      <div
        style={{
          position: 'relative',
        }}
      >
        <UserAvatar
          src={
            user.photo_url && !imgError
              ? `${process.env.IMAGE_URL_PREFIX}user-profile/${user.user_id}/${
                  user.photo_url
                }`
              : Images.defaultAvatar
          }
          onError={() => setImgError(true)}
        />
        <Badge src={Images.badges[getBadge()]} />
        {list &&
          (favorite ? (
            <FavouriteIcon />
          ) : user.user_id !== currentUser.user_id ? (
            <UnfavouriteIcon twoToneColor="#ababab" />
          ) : null)}
      </div>
    </>
  );
}

UserAvatarComponent.propTypes = {
  user: PropTypes.object,
  list: PropTypes.bool,
};

UserAvatarComponent.defaultProps = {
  list: false,
};

export default UserAvatarComponent;
