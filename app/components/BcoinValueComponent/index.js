/**
 *
 * BcoinValueComponent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from 'antd';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';

const { Text } = Typography;

const BCoinComponent = styled.div`
  background-color: ${Colors.pureWhite};
  border-radius: 24px;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 30px;
  padding-right: 10px;
  justify-content: flex-end;
`;

const BCoinIcon = styled.img`
  width: 24px;
  height: 26px;
  margin-left: 5px;
`;

function BcoinValueComponent({
  bcoinValue,
  style,
  textStyle,
  original,
  isHistory,
}) {
  return (
    <div>
      <BCoinComponent style={style}>
        <Text className="bodyBold darkGrey-text" style={textStyle}>
          {isHistory && '+'}
          {`${bcoinValue || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Text>
        <BCoinIcon
          src={original ? Images.bcoinBlueIcon : Images.bcoinWhiteIcon}
        />
      </BCoinComponent>
    </div>
  );
}

BcoinValueComponent.propTypes = {
  bcoinValue: PropTypes.number,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  original: PropTypes.bool,
  isHistory: PropTypes.bool,
};

BcoinValueComponent.defaultProps = {
  bcoinValue: 0,
  style: {},
  textStyle: {},
  original: true,
  isHistory: false,
};

export default BcoinValueComponent;
