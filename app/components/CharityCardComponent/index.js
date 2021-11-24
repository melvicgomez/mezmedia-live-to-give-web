/**
 *
 * CharityCardComponent
 *
 */

import React, { useEffect, useState, createRef } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { Row, Col } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const CharityPhoto = styled.img`
  height: 428px;
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
  -khtml-user-select: none;
  -o-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const CharityInfoSection = styled.div`
  width: 100%;
  padding: 10px 20px;
  background-color: ${Colors.pureWhite};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;

  > p {
    margin-bottom: 15px;
  }
`;

const Content = styled.div`
  margin: 5px 0px;

  > p {
    margin-bottom: 15px;
  }
`;

const CountryInfo = styled(Row)`
  margin-top: 20px;
  margin-bottom: 10px;

  > img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
`;

const Description = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;

  ${props =>
    props.line === 4 &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    `}
`;

const ReadHideIndicator = styled.div`
  line-height: 22px;
  margin-top: 10px;
  padding: 0px;
  background-color: ${Colors.pureWhite};
  cursor: pointer;
  display: inline-block;
`;

const NoImagePlaceholder = styled(Row)`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border: 3px solid ${Colors.pureWhite};
`;

function CharityCardComponent({ charity }) {
  const desc = createRef();
  const [textShown, setTextShown] = useState(false); // To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); // to show the "Read more & Less Line"

  useEffect(() => {
    const lineHeight = 22;
    const lines = Math.round(desc.current.clientHeight / lineHeight);
    setLengthMore(lines > 4);
  }, []);

  return (
    <div>
      {charity.images.length > 0 ? (
        <CharityPhoto
          draggable="false"
          src={`${process.env.IMAGE_URL_PREFIX}charity/${charity.charity_id}/${
            charity.images[0].image_path
          }`}
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
      <CharityInfoSection className="white-text">
        <Content className="darkGrey-text">
          <p className="h3">{charity.charity_name}</p>
          {lengthMore ? (
            <>
              <Description ref={desc} className="body" line={textShown ? 0 : 4}>
                {charity.description}
              </Description>
              <ReadHideIndicator
                className="bodyLink"
                onClick={e => {
                  e.stopPropagation();
                  setTextShown(!textShown);
                }}
              >
                {textShown ? 'Hide' : 'Read More'}
              </ReadHideIndicator>
            </>
          ) : (
            <Description ref={desc} className="body">
              {charity.description}
            </Description>
          )}
          <CountryInfo className="h3 cyan-text" align="middle">
            <img
              src={Images.country[countryIcon[charity.country_code]]}
              alt="country"
            />
            {charity.country_code}
          </CountryInfo>
        </Content>
      </CharityInfoSection>
    </div>
  );
}

CharityCardComponent.propTypes = {
  charity: PropTypes.object,
};

export default CharityCardComponent;
