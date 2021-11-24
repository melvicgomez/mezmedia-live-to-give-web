/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/**
 *
 * MyInterestPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import axiosInstance from 'services';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Colors } from 'theme/colors';
import { replace } from 'connected-react-router';
import AppBarComponent from 'components/AppBarComponent';
import ClubAvatarComponent from 'components/ClubAvatarComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { LoadingOutlined } from '@ant-design/icons';
import { Row, Spin, Col } from 'antd';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectMyInterestPage from './selectors';
import reducer from './reducer';
import saga from './saga';

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
`;

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: 40px;
  margin-top: 30px;
`;

const ClubList = styled.div`
  width: 100%;
  padding: 20px 40px;

  .title {
    margin-bottom: 20px;
  }

  .club-name {
    margin-bottom: -10px;
  }
`;
export function MyInterestPage({ location, dispatch }) {
  useInjectReducer({ key: 'myInterestPage', reducer });
  useInjectSaga({ key: 'myInterestPage', saga });

  const { user_id } = location.state;
  // const { user_id } = reactLocalStorage.getObject('user');

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`api/club-interest?user_id=${user_id}`)
      .then(res => {
        setClubs(
          Object.keys(res.data).map(key => ({
            club_name: key,
            interests: res.data[key],
          })),
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const selectInterest = interestId => {
    const updatedInterests = [...selectedInterest];
    if (updatedInterests.includes(interestId)) {
      updatedInterests.splice(updatedInterests.indexOf(interestId), 1);
    } else {
      updatedInterests.push(interestId);
    }
    setSelectedInterest(updatedInterests);
  };

  const submitInterest = () => {
    setButtonLoading(true);
    axiosInstance
      .post('api/user', {
        user_id,
        interests: selectedInterest,
      })
      .then(async ({ data }) => {
        reactLocalStorage.setObject('user', data.data.user);
        dispatch(replace('activity-feed'));
      })
      .catch(() => {
        setButtonLoading(false);
      });
  };

  return (
    <div>
      <Helmet>
        <title>Select your Interests - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled>
        <div
          style={{
            maxWidth: 1366,
            margin: 'auto',
            width: '100%',
          }}
        >
          {loading ? (
            <Row justify="center">
              <Spin indicator={<LoadingSpinner spin />} />
            </Row>
          ) : (
            <ClubList>
              <p className="h3 white-text title">
                Please select your interests
              </p>
              <Row gutter={[36, 24]}>
                {clubs.map((club, i) => (
                  <Col key={i} span={6}>
                    <Row
                      gutter={[4, 24]}
                      style={{ marginRight: '10px' }}
                      className="h3 cyan-text"
                    >
                      <p className="h3 cyan-text club-name">{club.club_name}</p>
                      {club.interests.map(interest => (
                        <Row
                          className="club-row-item"
                          key={interest.interest_id}
                          onClick={() => selectInterest(interest.interest_id)}
                        >
                          <div style={{ paddingRight: '10px' }}>
                            <ClubAvatarComponent
                              isMember={
                                selectedInterest.includes(interest.interest_id)
                                  ? 1
                                  : 0
                              }
                              totalActivities={0}
                              iconName={interest.icon_name || 'running'}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p
                              className={`interest-name bodyBold ${
                                selectedInterest.includes(interest.interest_id)
                                  ? 'white-text'
                                  : 'darkGrey-text'
                              }`}
                            >
                              {interest.interest_name}
                            </p>
                            <p
                              className={`club-description caption ${
                                selectedInterest.includes(interest.interest_id)
                                  ? 'white-text'
                                  : 'darkGrey-text'
                              }`}
                            >
                              {interest.description}
                            </p>
                          </div>
                        </Row>
                      ))}
                    </Row>
                  </Col>
                ))}
              </Row>
              <Row justify="center">
                <PrimaryButtonComponent
                  style={{ marginTop: '40px' }}
                  label="Let's Go!"
                  onClick={submitInterest}
                  loading={buttonLoading}
                />
              </Row>
            </ClubList>
          )}
        </div>
      </PageWrapperStyled>
    </div>
  );
}

MyInterestPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  myInterestPage: makeSelectMyInterestPage(),
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
)(MyInterestPage);
