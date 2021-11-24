/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * DashboardAnalyticsContainer
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { push } from 'connected-react-router';
import { compose } from 'redux';
import { Colors } from 'theme/colors';
import moment from 'moment';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import ClubAvatarComponent from 'components/ClubAvatarComponent';
import UserPostCardComponent from 'components/UserPostCardComponent';
import InterestFeedCardComponent from 'components/InterestFeedCardComponent';
import { DatePicker, Row, Col, Spin } from 'antd';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Images } from 'images/index';
import api from 'services';
import makeSelectDashboardAnalyticsContainer from './selectors';
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

const DateTimePicker = styled(DatePicker)`
  background-color: ${Colors.textInput};
  height: 48px;
  width: ${props => (props.range ? 'auto' : '55%')};
  border: 2px solid ${props => (props.error ? Colors.error : Colors.pureWhite)};
  border-radius: 16px;
  margin: ${props => (props.range ? '3px 0px 15px' : '0px')};

  :focus,
  :active,
  :hover {
    border-color: ${props =>
      props.error ? Colors.error : Colors.pureWhite} !important;
  }

  .ant-picker-suffix {
    color: ${Colors.placeholderTextColor};
  }

  .ant-picker-input > input {
    color: ${Colors.pureWhite};
    text-align: center;
  }
`;

const StyledWrapper = styled.div`
  .club-row-item {
    display: flex;
    flex: 1;
    margin-bottom: 12px;
  }

  .box-container-style {
    border: 2px solid white;
    padding: 10px;
    border-radius: 16px;
  }

  .card-challenge {
    margin-bottom: 10px;
    cursor: pointer;
    :hover {
      opacity: 0.9;
    }
  }
`;

export function DashboardAnalyticsContainer({ match, location, dispatch }) {
  useInjectReducer({ key: 'dashboardAnalyticsContainer', reducer });
  useInjectSaga({ key: 'dashboardAnalyticsContainer', saga });

  const [isLoading, setIsloading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    moment()
      .format()
      .toString(),
  );

  useEffect(() => {
    setIsloading(true);

    api
      .get(
        `/api/admin/get-report?filter_date=${
          selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''
        }`,
      )
      .then(res => {
        setData(res.data);
        setIsloading(false);
      });
  }, [selectedDate]);

  useEffect(() => {
    setIsloading(true);
  }, [selectedDate]);

  const ClubWithMembers = () => {
    const allClubs = Object.keys(data.clubs).map(key => ({
      club_name: key,
      interests: data.clubs[key],
    }));

    return (
      <div>
        {allClubs.map(clubCategory => (
          <div key={clubCategory.club_name}>
            <div className="h3 cyan-text club-name">
              {clubCategory.club_name}
            </div>
            {clubCategory.interests.map(interest => (
              <div style={{ display: 'flex' }} key={interest.interest_id}>
                <div className="club-row-item">
                  <div style={{ padding: '0px 10px' }}>
                    <ClubAvatarComponent
                      isMember={1}
                      totalActivities={0}
                      iconName={interest.icon_name}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="interest-name bodyBold  white-text">
                      {interest.interest_name}
                    </p>
                    <p className="club-description caption white-text">
                      {interest.description}
                    </p>
                  </div>
                </div>
                <div
                  className="h2 cyan-text right"
                  style={{ minWidth: 60, marginRight: 10 }}
                >
                  {interest.members_count}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const LikeCommentsStats = () => (
    <div className="box-container-style">
      <div>
        <Row>
          <Col span={16} className="bodyBold white-text">
            Total # of Comments
          </Col>
          <Col span={8} className="bodyBold cyan-text right">
            {data.total_comments}
          </Col>
        </Row>
        <Row>
          <Col span={16} className="bodyBold white-text">
            Total # of Likes
          </Col>
          <Col span={8} className="bodyBold cyan-text right">
            {data.total_likes}
          </Col>
        </Row>
      </div>
    </div>
  );

  const UsersInfoStats = () => (
    <div className="box-container-style">
      <div>
        <Row justify="space-between">
          <Col span={16} className="bodyBold white-text">
            Total # of Users
          </Col>
          <Col span={8} className="bodyBold cyan-text right">
            {data.users.total_users}
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={16} className="bodyBold white-text">
            Total # Users With Clubs
          </Col>
          <Col span={8} className="bodyBold cyan-text right">
            {data.users.withClubs} (
            {`${(
              (data.users.withClubs / data.users.total_users >= 0
                ? data.users.withClubs / data.users.total_users
                : 0) * 100
            ).toFixed(2)}%`}
            )
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={16} className="bodyBold white-text">
            Total # Users Without Clubs
          </Col>
          <Col span={8} className="bodyBold cyan-text right">
            {data.users.withoutClubs} (
            {`${(
              (data.users.withoutClubs / data.users.total_users >= 0
                ? data.users.withoutClubs / data.users.total_users
                : 0) * 100
            ).toFixed(2)}%`}
            )
          </Col>
        </Row>
      </div>
      <br />

      <div>
        <div className="bodyBold white-text" style={{ marginBottom: 6 }}>
          Members per country
        </div>
        {data.users.per_country
          .sort((a, b) => b.users_count - a.users_count)
          .map(country => (
            <Row justify="space-between" align="middle" key={country.country}>
              <Col span={16} className="bodyBold white-text">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={Images.country[countryIcon[country.country]]}
                    alt="country"
                    style={{
                      maxWidth: 20,
                      height: '100%',
                      marginRight: 6,
                    }}
                  />
                  {country.country}
                </div>
              </Col>
              <Col span={8} className="bodyBold cyan-text right">
                {country.users_count}
              </Col>
            </Row>
          ))}
      </div>
    </div>
  );

  const LoginUsersInfoStats = () => (
    <div className="box-container-style">
      <Row justify="space-between">
        <Col span={16} className="bodyBold white-text">
          Total Unique Users Checked In on (
          {moment(selectedDate).format('YYYY-MM-DD')})
        </Col>
        <Col span={8} className="bodyBold cyan-text right">
          {data.users.total_user_checkin || 0}
        </Col>
      </Row>
    </div>
  );

  const ChallengeInfoStats = () => {
    const [infoLoading, setInfoLoading] = useState(true);
    const [challengeUserData, setChallengeUserData] = useState(null);

    const [selectedStartDate, setSelectedStartDate] = useState('');

    const [selectedEndDate, setSelectedEndDate] = useState('');

    useEffect(() => {
      if (selectedDate) {
        setInfoLoading(true);
        api
          .get(
            `/api/admin/get-challenge-info-report?filter_start_date=${moment(
              selectedDate,
            )
              .subtract(7, 'days')
              .format('YYYY-MM-DD')}&filter_end_date=${moment(
              selectedDate,
            ).format('YYYY-MM-DD')}`,
          )
          .then(res => {
            setChallengeUserData(res.data.challenges);
            setSelectedEndDate(
              moment(selectedDate)
                .format()
                .toString(),
            );
            setSelectedStartDate(
              moment(selectedDate)
                .subtract(7, 'days')
                .format()
                .toString(),
            );
            setInfoLoading(false);
          });
      }
    }, [selectedDate]);

    useEffect(() => {
      if (selectedStartDate && selectedEndDate) {
        api
          .get(
            `/api/admin/get-challenge-info-report?filter_start_date=${moment(
              selectedStartDate,
            ).format('YYYY-MM-DD')}&filter_end_date=${moment(
              selectedEndDate,
            ).format('YYYY-MM-DD')}`,
          )
          .then(res => {
            setChallengeUserData(res.data.challenges);
          });
      }
    }, [selectedStartDate, selectedEndDate]);

    return (
      <div className="box-container-style">
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <div className="bodyBold white-text">From:</div>
            <DateTimePicker
              allowClear={false}
              className="bodyBold white-text"
              placeholder="Select Date"
              range
              value={
                selectedStartDate
                  ? moment(selectedStartDate)
                  : moment().subtract(7, 'days')
              }
              format="YYYY-MM-DD"
              onChange={(value, dateString) => {
                setSelectedStartDate(dateString);
              }}
            />
          </Col>
          <Col span={12}>
            <div className="bodyBold white-text">To:</div>
            <DateTimePicker
              allowClear={false}
              className="bodyBold white-text"
              placeholder="Select Date"
              range
              value={selectedEndDate ? moment(selectedEndDate) : moment()}
              format="YYYY-MM-DD"
              onChange={(value, dateString) => {
                setSelectedEndDate(dateString);
              }}
            />
          </Col>
        </Row>
        {infoLoading ? (
          <div
            style={{
              paddingTop: 50,
              paddingBottom: 50,
              textAlign: 'center',
            }}
          >
            <Spin size="medium" />
          </div>
        ) : (
          <div>
            <Row style={{ marginBottom: 6 }}>
              <Col span={16} className="bodyBold white-text">
                Total # of Daily Challenges
              </Col>
              <Col span={8} className="bodyBold cyan-text right">
                {challengeUserData.daily_challenge_count}
              </Col>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col span={16} className="bodyBold white-text">
                Total # of Unique Participants in All Daily Challenges
              </Col>
              <Col span={8} className="bodyBold cyan-text right">
                {challengeUserData.daily_users}
              </Col>
            </Row>

            <Row style={{ marginBottom: 6 }}>
              <Col span={16} className="bodyBold white-text">
                Total # of Weekly Challenges
              </Col>
              <Col span={8} className="bodyBold cyan-text right">
                {challengeUserData.weekly_challenge_count}
              </Col>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col span={16} className="bodyBold white-text">
                Total # of Unique Participants in All Weekly Challenges
              </Col>
              <Col span={8} className="bodyBold cyan-text right">
                {challengeUserData.weekly_users}
              </Col>
            </Row>

            <Row style={{ marginBottom: 6 }}>
              <Col span={16} className="bodyBold white-text">
                Total # Monthly Challenges
              </Col>
              <Col span={8} className="bodyBold cyan-text right">
                {challengeUserData.monthly_challenge_count}
              </Col>
            </Row>

            <Row style={{ marginBottom: 6 }}>
              <Col span={16} className="bodyBold white-text">
                Total # of Unique Participants in All Monthly Challenges
              </Col>
              <Col span={8} className="bodyBold cyan-text right">
                {challengeUserData.monthly_users}
              </Col>
            </Row>

            <Row>
              <Col className="caption italic white-text">
                *Refers to all Challenges that have been published (and not
                deleted), including expired ones, as of the Selected Date
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  };

  const ListOfTopFeedChallenges = () => {
    const [listLoading, setListLoading] = useState(false);
    const [topFeedData, setTopFeedData] = useState(null);

    useEffect(() => {
      if (!listLoading) {
        setListLoading(true);
        api
          .get(
            `/api/admin/get-top-feed-event-report?filter_date=${
              selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''
            }`,
          )
          .then(res => {
            setTopFeedData(res.data);
          })
          .finally(() => {
            setListLoading(false);
          });
      }
    }, [selectedDate]);

    const ListOfPopularChallenges = ({ type = 'weekly' }) => (
      <div>
        <div className="bodyBold white-text" style={{ marginBottom: 10 }}>
          Popular{' '}
          {type === 'daily'
            ? 'Daily'
            : type === 'weekly'
            ? 'Weekly'
            : 'Monthly'}{' '}
          Challenges
        </div>

        {topFeedData
          ? (type === 'daily'
              ? topFeedData.popular_events.popular_daily_challenges
              : type === 'weekly'
              ? topFeedData.popular_events.popular_weekly_challenges
              : topFeedData.popular_events.popular_monthly_challenges
            ).map(challenge => (
              <div
                className="card-challenge"
                key={challenge.challenge_id}
                onClick={() => {
                  dispatch(push(`/admin/challenges/${challenge.challenge_id}`));
                }}
              >
                <InterestFeedCardComponent
                  compress
                  feed={{
                    ...challenge,
                    participants_count: challenge.participants_count,
                    is_joined_challenge: 0,
                  }}
                  clubInterest={challenge.club_interest}
                  type="challenge"
                />
              </div>
            ))
          : null}

        {topFeedData ? (
          (type === 'daily'
            ? topFeedData.popular_events.popular_daily_challenges
            : type === 'weekly'
            ? topFeedData.popular_events.popular_weekly_challenges
            : topFeedData.popular_events.popular_monthly_challenges
          ).length === 0 ? (
            <div className="bodyBold cyan-text">{`There is no popular ${type} challenges found.`}</div>
          ) : null
        ) : null}
      </div>
    );

    const ListOfTopPosts = ({ type }) => (
      <div>
        <div className="bodyBold white-text" style={{ marginBottom: 10 }}>
          Top Posts with Most {type === 'comments' ? 'Comments' : 'Likes'}
        </div>
        {topFeedData
          ? (type === 'comments'
              ? topFeedData.top_posts_comments
              : topFeedData.top_posts_likes
            ).map(feed => (
              <div
                key={`${type === 'comments' ? 'comments' : 'likes'}${
                  feed.feed_id
                }`}
              >
                <UserPostCardComponent feed={feed} actionOnFeed={() => {}} />
                <div style={{ height: '15px' }} />
              </div>
            ))
          : null}

        {topFeedData ? (
          (type === 'comments'
            ? topFeedData.top_posts_comments
            : topFeedData.top_posts_likes
          ).length === 0 ? (
            <div className="bodyBold cyan-text">{`There is no posts with most ${
              type === 'comments' ? 'comments' : 'likes'
            }.`}</div>
          ) : null
        ) : null}
      </div>
    );

    return listLoading ? (
      <div
        style={{
          paddingTop: 50,
          paddingBottom: 50,
          textAlign: 'center',
        }}
      >
        <Spin size="medium" />
      </div>
    ) : (
      <Row gutter={[10, 10]}>
        <Col span={12}>
          {topFeedData ? <ListOfTopPosts /> : null}
          <br />
          {topFeedData ? <ListOfTopPosts type="comments" /> : null}
        </Col>
        <Col span={12}>
          {topFeedData ? <ListOfPopularChallenges type="daily" /> : null}
          <br />
          {topFeedData ? <ListOfPopularChallenges type="weekly" /> : null}
          <br />
          {topFeedData ? <ListOfPopularChallenges type="monthly" /> : null}
        </Col>
      </Row>
    );
  };

  return (
    <StyledWrapper>
      <Helmet>
        <title>Admin Panel - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AdminNavigationWrapperComponent
        match={match}
        location={location}
        topTab={
          <div style={{ marginTop: 12, width: '100%' }}>
            <Row justify="space-between">
              <Col>
                <Row align="middle">
                  <div
                    className="bodyBold white-text"
                    style={{ marginRight: 10 }}
                  >
                    Select Date:
                  </div>
                  <DateTimePicker
                    allowClear={false}
                    className="bodyBold white-text"
                    placeholder="Select Date"
                    defaultValue={moment()}
                    format="YYYY-MM-DD"
                    onChange={(value, dateString) => {
                      setSelectedDate(dateString);
                    }}
                  />
                </Row>
                <div
                  className="bodyBold white-text italic"
                  style={{ marginTop: 6 }}
                >
                  Data as of {moment(selectedDate).format('YYYY-MM-DD')}
                </div>
              </Col>
              <Col className="h2 cyan-text">Web Version 1.4.0 (Build 1)</Col>
            </Row>
          </div>
        }
      >
        {isLoading ? (
          <div
            style={{ paddingTop: 50, paddingBottom: 50, textAlign: 'center' }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <Row
            style={{ paddingTop: 15, paddingBottom: 15 }}
            gutter={[10, 10]}
            justify="space-around"
          >
            <Col span={8}>
              {data ? <LoginUsersInfoStats /> : null}
              <br />
              {data ? <LikeCommentsStats /> : null}
              <br />
              {data ? <UsersInfoStats /> : null}
              <br />
              {data ? <ChallengeInfoStats /> : null}
              <br />
              <div className="box-container-style">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <div className="bodyBold white-text">Members per club</div>
                  <div className="bodyBold cyan-text"># of participants</div>
                </div>
                {data ? <ClubWithMembers /> : null}
              </div>
            </Col>
            <Col span={16}>
              <ListOfTopFeedChallenges />
            </Col>

            {/* <Col span={8}>{data ? <ListOfPopularLiveSessions /> : null}</Col> */}
            {/* <Col span={6}>{data ? <ListOfMeetups /> : null}</Col> */}
          </Row>
        )}
      </AdminNavigationWrapperComponent>
    </StyledWrapper>
  );
}

DashboardAnalyticsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboardAnalyticsContainer: makeSelectDashboardAnalyticsContainer(),
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
)(DashboardAnalyticsContainer);
