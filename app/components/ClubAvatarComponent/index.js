/**
 *
 * ClubAvatarComponent
 *
 */

import React from 'react';
import styled from 'styled-components';
import { Images } from 'images/index';
// import PropTypes from 'prop-types';

// eslint-disable-next-line consistent-return
export const getCurrentRankName = (isMember = 0, totalActivities = 0) => {
  if (isMember === 0) return 'You are not a member.';
  else {
    if (totalActivities === 0) return 'No rank available.';
    else if (totalActivities >= 1 && totalActivities <= 2) {
      return 'Bronze Member';
    }
    if (totalActivities >= 3 && totalActivities <= 5) {
      return 'Silver Member';
    }
    if (totalActivities >= 6 && totalActivities <= 8) {
      return 'Gold Member';
    }
    if (totalActivities >= 9 && totalActivities <= 11) {
      return 'Platinum Member';
    }
    if (totalActivities > 11) {
      return 'Diamond Member';
    }
  }
  return 'You are not a member.';
};

const Badge = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  margin-top: 2px;
  align-items: center;
  justify-content: center;
  background-size: cover !important;
`;

const ClubIcon = styled.img`
  width: ${props =>
    props.iconName === 'sustainability' ||
    props.iconName === 'hiking_walking' ||
    props.iconName === 'personal_development'
      ? '22px'
      : '28px'};
  top: -1px;
  opacity: ${props => (props.isMember === 1 ? 1 : 0.5)};
`;

function ClubAvatarComponent({ isMember, totalActivities, iconName }) {
  const getCurrentRank = () => {
    if (isMember === 0) return Images.clubRank.not_member;
    else {
      if (totalActivities === 0) return Images.clubRank.unrank;
      else if (totalActivities >= 1 && totalActivities <= 2) {
        return Images.clubRank.bronze;
      }
      if (totalActivities >= 3 && totalActivities <= 5) {
        return Images.clubRank.silver;
      }
      if (totalActivities >= 6 && totalActivities <= 8) {
        return Images.clubRank.gold;
      }
      if (totalActivities >= 9 && totalActivities <= 11) {
        return Images.clubRank.platinum;
      }
      if (totalActivities > 11) {
        return Images.clubRank.diamond;
      }
    }
    return Images.clubRank.unrank;
  };

  return (
    <Badge
      style={{
        background: `url(${getCurrentRank()})`,
      }}
    >
      <ClubIcon
        src={Images.clubActivities[iconName]}
        iconName={iconName}
        isMember={isMember}
        alt="clubRank"
      />
    </Badge>
  );
}

ClubAvatarComponent.propTypes = {};

export default ClubAvatarComponent;
