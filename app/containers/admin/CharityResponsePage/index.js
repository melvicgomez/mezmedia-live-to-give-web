/**
 *
 * CharityResponsePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import api from 'services';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { Spin, Row, Col } from 'antd';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Images } from 'images/index';

import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const PageWrapperStyled = styled.div`
  margin-top: 20px;
  .charity-card {
    .charity-card-content {
      background-color: white;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }
  }

  .user-count {
    display: flex;
    align-items: center;
    position: absolute;
    padding: 4px 10px;
    border-radius: 10px;
    background-color: rgb(0 0 0 / 77%);
    bottom: 10px;
    left: 10px;
    > span {
      margin-right: 6px;
    }
  }
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: ${props => (props.type === 'bottom' ? '20px' : '40px')};

  ${props =>
    props.type === 'refresh'
      ? css`
          font-size: 30px;
          margin-bottom: 15px;
        `
      : null}
`;

export function CharityResponsePage({ match }) {
  const [isLoading, setIsLoading] = useState(false);
  const [charityResponse, setCharityResponse] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      api
        .get('/api/admin/all-charities-response')
        .then(res => {
          setCharityResponse(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>Admin Panel - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AdminNavigationWrapperComponent match={match}>
        <PageWrapperStyled>
          {!isLoading && charityResponse.length > 0 ? (
            charityResponse.map(charity => (
              <div
                key={charity.country_code}
                className="body white-text divider"
              >
                <Row gutter={[10, 10]}>
                  <Col span={8}>
                    <img
                      style={{ maxWidth: 50, marginBottom: 10 }}
                      src={Images.country[countryIcon[charity.country_code]]}
                      alt="country"
                    />
                    <div className="h2   bold">
                      {charity.country_code === 'Hong Kong SAR'
                        ? 'Hong Kong SAR/China'
                        : charity.country_code}
                    </div>
                    <div>
                      Total # of Users:{' '}
                      <span className="bodyBold">{charity.total_users}</span>
                    </div>
                    <div>
                      Total # of Users Picked One Charity:{' '}
                      <span className="bodyBold">
                        {charity.total_users_respond}
                      </span>
                    </div>
                    <div>
                      Total # of Users Picked Both Charity:{' '}
                      <span className="bodyBold">
                        {charity.total_users_respond_both}
                      </span>
                    </div>
                    <div>
                      Total # of Users Haven’t Picked Any Charity:{' '}
                      <span className="bodyBold">
                        {charity.total_users_havent_respond}
                      </span>
                    </div>
                  </Col>
                  {charity.charities.map(charityData => (
                    <Col span={8} key={charityData.charity_id}>
                      <div className="charity-card">
                        <div
                          style={{
                            height: 200,
                            width: '100%',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '16px 16px 0px 0px',
                            backgroundImage: `url("${
                              process.env.IMAGE_URL_PREFIX
                            }charity/${charityData.charity_id}/${
                              charityData.images[0].image_path
                            }")`,
                            position: 'relative',
                          }}
                        >
                          <span className="user-count body">
                            <UserOutlined />
                            {charityData.response_count} users
                          </span>
                        </div>
                        <div
                          className="charity-card-content darkGrey-text"
                          style={{
                            padding: 10,
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16,
                          }}
                        >
                          <p className="h3" style={{ marginBottom: 15 }}>
                            {charityData.charity_name}
                          </p>
                          <div className="body">{charityData.description}</div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            ))
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

// CharityResponsePage.propTypes = {
//   // dispatch: PropTypes.func.isRequired,
// };

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }

const withConnect = connect(
  null,
  null,
  // mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CharityResponsePage);
