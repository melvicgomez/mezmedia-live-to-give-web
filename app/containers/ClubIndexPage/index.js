/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * ClubIndexPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import api from 'services';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { reactLocalStorage } from 'reactjs-localstorage';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
// import SideProfileComponent from 'components/SideProfileComponent';
import { Col, Row } from 'antd';
import ClubAvatarComponent from 'components/ClubAvatarComponent';
import SideProfileComponent from 'components/SideProfileComponent';

import { push } from 'connected-react-router';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectClubIndexPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div`
  padding-bottom: 30px;
  .club-row-item {
    display: flex;
    margin-bottom: 16px;
  }

  .club-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .club-name {
    margin-bottom: 14px;
  }

  .interest-name {
    margin-bottom: 6px;
  }
`;

export function ClubIndexPage({ match, dispatch }) {
  useInjectReducer({ key: 'clubIndexPage', reducer });
  useInjectSaga({ key: 'clubIndexPage', saga });

  const user = reactLocalStorage.getObject('user');

  const [isLoading, setIsLoading] = useState(true);
  const [listOfClubs, setListOfClubs] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`api/club-interest?user_id=${user.user_id}`)
      .then(response => {
        setListOfClubs(
          Object.keys(response.data).map(key => ({
            club_name: key,
            interests: response.data[key],
          })),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user.user_id]);

  const viewClubDetails = id => {
    dispatch(push(`my-clubs/${id}`));
  };

  return (
    <div>
      <Helmet>
        <title>Clubs - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <div>
        <NavigationWrapperComponent
          match={match}
          rightContent={
            <div>
              <SideProfileComponent />
            </div>
          }
        >
          <PageWrapperStyled>
            {!isLoading ? (
              <div>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Row gutter={[12, 12]}>
                      {listOfClubs.splice(0, 2).map(club => (
                        <Col span={24} key={club.club_name}>
                          <p className="h3 cyan-text club-name">
                            {club.club_name}
                          </p>

                          {club.interests.map(interest => (
                            <div
                              className="club-row-item"
                              key={interest.interest_id}
                              onClick={() => {
                                viewClubDetails(interest.interest_id);
                              }}
                            >
                              <div style={{ padding: '0px 10px' }}>
                                <ClubAvatarComponent
                                  isMember={interest.is_club_member}
                                  totalActivities={
                                    interest.challenges_done_count +
                                    interest.meetups_done_count +
                                    interest.live_session_done_count
                                  }
                                  iconName={interest.icon_name}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <p
                                  className={`interest-name bodyBold ${
                                    interest.is_club_member === 1
                                      ? 'white-text'
                                      : 'darkGrey-text'
                                  }`}
                                >
                                  {interest.interest_name}
                                </p>
                                <p
                                  className={`club-description caption ${
                                    interest.is_club_member === 1
                                      ? 'white-text'
                                      : 'darkGrey-text'
                                  }`}
                                >
                                  {interest.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </Col>
                      ))}
                    </Row>
                  </Col>

                  <Col span={12}>
                    <Row gutter={[12, 12]}>
                      {listOfClubs.splice(0, 2).map(club => (
                        <Col span={24} key={club.club_name}>
                          <div>
                            <p className="h3 cyan-text club-name">
                              {club.club_name}
                            </p>

                            {club.interests.map(interest => (
                              <div
                                className="club-row-item"
                                key={interest.interest_id}
                                onClick={() => {
                                  viewClubDetails(interest.interest_id);
                                }}
                              >
                                <div style={{ padding: '0px 10px' }}>
                                  <ClubAvatarComponent
                                    isMember={interest.is_club_member}
                                    totalActivities={
                                      interest.challenges_done_count +
                                      interest.meetups_done_count +
                                      interest.live_session_done_count
                                    }
                                    iconName={interest.icon_name}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p
                                    className={`interest-name bodyBold ${
                                      interest.is_club_member === 1
                                        ? 'white-text'
                                        : 'darkGrey-text'
                                    }`}
                                  >
                                    {interest.interest_name}
                                  </p>
                                  <p
                                    className={`club-description caption ${
                                      interest.is_club_member === 1
                                        ? 'white-text'
                                        : 'darkGrey-text'
                                    }`}
                                  >
                                    {interest.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </div>
            ) : null}
          </PageWrapperStyled>
        </NavigationWrapperComponent>
      </div>
    </div>
  );
}

ClubIndexPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  clubIndexPage: makeSelectClubIndexPage(),
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
)(ClubIndexPage);
