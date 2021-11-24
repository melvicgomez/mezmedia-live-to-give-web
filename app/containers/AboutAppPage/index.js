/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * AboutAppPage
 *
 */

import React, { memo } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAboutAppPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div``;

const ActivityPhoto = styled.img`
  height: 359px;
  width: 100%;
  margin-top: 10px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
`;

const Content = styled.div`
  margin: 25px 0px 5px;

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
`;

const Divider = styled.div`
  height: 2px;
  background-color: ${Colors.pureWhite};
  width: 100%;
  margin: 20px 0px;
`;

export function AboutAppPage({ match }) {
  useInjectReducer({ key: 'aboutAppPage', reducer });
  useInjectSaga({ key: 'aboutAppPage', saga });

  return (
    <div>
      <Helmet>
        <title>About Live to Give</title>
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
          <div className="white-text">
            <ActivityPhoto src={Images.aboutLTG} />
            <Content className="white-text">
              <p className="h1">About Live to Give</p>
              <Divider />
              <Description className="body white-text">
                <p className="body">
                  Live to Give is an immersive and dynamic digital platform
                  designed to empower Barclays’ colleagues to achieve their
                  wellbeing goals, engage and connect with one another over
                  interests they are passionate about while giving back to
                  partner charities.
                </p>
                <p>Live to Give key features:</p>
                <p style={{ marginTop: '20px' }} className="h3">
                  Clubs
                </p>
                <p>
                  There are 12 Virtual Clubs spanning culture, wellbeing,
                  fitness and purpose. Colleagues are given the opportunity to
                  join one, or multiple, virtual clubs and engage in thought
                  leadership, expert advice and share content with peers.
                </p>
                <p style={{ marginTop: '20px' }} className="h3">
                  Activity Feed
                </p>
                <p>
                  There is one main Live to Give Activity Feed that provides
                  colleagues with expert and user generated content. Colleagues
                  are encouraged to comment, like and share ideas through the
                  Live to Give Activity Feed.
                </p>
                <p style={{ marginTop: '20px' }} className="h3">
                  Challenges
                </p>
                <p>
                  In addition to daily engagement posts, there are regular
                  weekly and monthly challenges within the Clubs that encourage
                  colleague participation. Fitness challenges are tracked by
                  Strava and Apple Health. Non-Fitness Challenges are tracked
                  through social posting of photos to showcase achievements.
                </p>
                <p style={{ marginTop: '20px' }} className="h3">
                  Leaderboards
                </p>
                <p>
                  Colleagues are encouraged to participate and engage in
                  content, challenges and activities in order to climb up the
                  Leaderboards. There is a leaderboard of individuals as well as
                  country leaderboards to encourage friendly competition across
                  the region.
                </p>
                <p style={{ marginTop: '20px' }} className="h3">
                  Charity Fundraising
                </p>
                <p>
                  The more engaged colleagues are in the features of Live to
                  Give, the more money is raised for charity. There are 9
                  partner charities, all impacted by COVID-19, that will benefit
                  from funds raised through Live to Give.
                </p>
                <p style={{ marginTop: '20px' }}>
                  Click{' '}
                  <a
                    className="bodyLink anchor-link"
                    style={{ cursor: 'pointer' }}
                    href="./settings/contact-us"
                  >
                    here
                  </a>{' '}
                  to contact us
                </p>
              </Description>
            </Content>
          </div>
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

// AboutAppPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  aboutAppPage: makeSelectAboutAppPage(),
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
)(AboutAppPage);
