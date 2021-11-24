/**
 *
 * CharityDetailsPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import axiosInstance from 'services';
import styled from 'styled-components';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import { Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import DOMPurify from 'dompurify';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCharityDetailsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const PageWrapperStyled = styled.div``;

const ActivityPhoto = styled.img`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 40px;
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

const Content = styled.div`
  margin: 10px 0px 5px;

  > p:first-child {
    margin-bottom: 15px;
  }
`;

const Description = styled.div`
  margin-bottom: 20px;

  > h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${Colors.pureWhite};
  }

  > p {
    margin-bottom: 1rem;
  }

  > img {
    width: 100%;
    margin: 10px 0px 15px;
  }
`;

export function CharityDetailsPage({ match }) {
  useInjectReducer({ key: 'charityDetailsPage', reducer });
  useInjectSaga({ key: 'charityDetailsPage', saga });

  const charityId = match.params.id;

  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`api/charity/${charityId}`)
      .then(res => {
        setCharity(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Charity Details - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        match={match}
        rightContent={
          <div>
            <SideProfileComponent />
          </div>
        }
      >
        <PageWrapperStyled className="white-text">
          {!loading ? (
            <div className="white-text">
              <ActivityPhoto
                src={`${process.env.IMAGE_URL_PREFIX}charity/${
                  charity.charity_id
                }/${charity.images[0].image_path}`}
              />
              <CountryInfo className="h3 cyan-text" align="middle">
                <img
                  src={Images.country[countryIcon[charity.country_code]]}
                  alt="country"
                />
                {charity.country_code}
              </CountryInfo>
              <Content className="white-text">
                <p className="h2">{charity.charity_name}</p>
                <Description
                  className="body white-text"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(charity.html_content),
                  }}
                />
              </Content>
            </div>
          ) : (
            <Row justify="center">
              <Spin indicator={<LoadingSpinner spin />} />
            </Row>
          )}
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  charityDetailsPage: makeSelectCharityDetailsPage(),
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
)(CharityDetailsPage);
