/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { reactLocalStorage } from 'reactjs-localstorage';

import ActivityFeedPage from 'containers/ActivityFeedPage/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import OfficialPostDetailsPage from 'containers/OfficialPostDetailsPage/Loadable';
import ClubIndexPage from 'containers/ClubIndexPage/Loadable';
import ClubDetailsPage from 'containers/ClubDetailsPage/Loadable';
import CharityIndexPage from 'containers/CharityIndexPage/Loadable';
import CharityDetailsPage from 'containers/CharityDetailsPage/Loadable';
import ChallengeIndexPage from 'containers/ChallengeIndexPage/Loadable';
import ChallengeDetailsPage from 'containers/ChallengeDetailsPage/Loadable';
import MeetupIndexPage from 'containers/MeetupIndexPage/Loadable';
import MeetupDetailsPage from 'containers/MeetupDetailsPage/Loadable';
import LiveSessionIndexPage from 'containers/LiveSessionIndexPage/Loadable';
import LiveSessionDetailsPage from 'containers/LiveSessionDetailsPage/Loadable';
import NotificationsPage from 'containers/NotificationsPage/Loadable';
import UserProfilePage from 'containers/UserProfilePage/Loadable';
import UserSettingsPage from 'containers/UserSettingsPage/Loadable';
import UserRankingPage from 'containers/UserRankingPage/Loadable';
import AboutAppPage from 'containers/AboutAppPage/Loadable';
import TermsAndConditionsPage from 'containers/TermsAndConditionsPage/Loadable';
import PrivacyPolicyPage from 'containers/PrivacyPolicyPage/Loadable';
import UserCommentingGuidelinesPage from 'containers/UserCommentingGuidelinesPage/Loadable';
import MeetupSuggestionPage from 'containers/MeetupSuggestionPage/Loadable';
import ChallengeSuggestionPage from 'containers/ChallengeSuggestionPage/Loadable';
import LiveSessionSuggestionPage from 'containers/LiveSessionSuggestionPage/Loadable';
import UserPostDetailsPage from 'containers/UserPostDetailsPage/Loadable';
import ContactUsPage from 'containers/ContactUsPage/Loadable';

import AuthLoginPage from 'containers/AuthLoginPage/Loadable';
import CreateProfilePage from 'containers/CreateProfilePage/Loadable';
import MyInterestPage from 'containers/MyInterestPage/Loadable';
import RegistrationPage from 'containers/RegistrationPage/Loadable';
import OneTimePinPage from 'containers/OneTimePinPage/Loadable';
import ForgotPasswordPage from 'containers/ForgotPasswordPage/Loadable';
import NewPasswordPage from 'containers/NewPasswordPage/Loadable';

// admin
import UserListPage from 'containers/admin/UserListPage/Loadable';
import UserInfoPage from 'containers/admin/UserInfoPage/Loadable';
import PostListPage from 'containers/admin/PostListPage/Loadable';
import PostDetailsPage from 'containers/admin/PostDetailsPage/Loadable';
import CommentListPage from 'containers/admin/CommentListPage/Loadable';
import CommentDetailsPage from 'containers/admin/CommentDetailsPage/Loadable';
import OfficialPostListPage from 'containers/admin/OfficialPostListPage/Loadable';
import OfficialPostCreatePage from 'containers/admin/OfficialPostCreatePage/Loadable';
import OfficialPostEditPage from 'containers/admin/OfficialPostEditPage/Loadable';
import AdminOfficialPostDetailsPage from 'containers/admin/OfficialPostDetailsPage/Loadable';
import ChallengeListPage from 'containers/admin/ChallengeListPage/Loadable';
import ChallengeCreatePage from 'containers/admin/ChallengeCreatePage/Loadable';
import AdminChallengeDetailsPage from 'containers/admin/ChallengeDetailsPage/Loadable';
import ChallengeEditPage from 'containers/admin/ChallengeEditPage/Loadable';
import DashboardAnalyticsContainer from 'containers/admin/DashboardAnalyticsContainer/Loadable';
import LiveSessionListPage from 'containers/admin/LiveSessionListPage/Loadable';
import LiveSessionCreatePage from 'containers/admin/LiveSessionCreatePage/Loadable';
import AdminLiveSessionDetailsPage from 'containers/admin/LiveSessionDetailsPage/Loadable';
import LiveSessionEditPage from 'containers/admin/LiveSessionEditPage/Loadable';
import MeetupListPage from 'containers/admin/MeetupListPage/Loadable';
import MeetupCreatePage from 'containers/admin/MeetupCreatePage/Loadable';
import AdminMeetupDetailsPage from 'containers/admin/MeetupDetailsPage/Loadable';
import MeetupEditPage from 'containers/admin/MeetupEditPage/Loadable';
import TeamListPage from 'containers/admin/TeamListPage/Loadable';
import TeamDetailsPage from 'containers/admin/TeamDetailsPage/Loadable';
import SendNotificationsContainer from 'containers/admin/SendNotificationsContainer/Loadable';
import PollListPage from 'containers/admin/PollListPage/Loadable';
import PollDetailsPage from 'containers/admin/PollDetailsPage/Loadable';
import PollCreatePage from 'containers/admin/PollCreatePage/Loadable';
import PollEditPage from 'containers/admin/PollEditPage/Loadable';
import CharityResponsePage from 'containers/admin/CharityResponsePage/Loadable';

import NotFoundPage from 'containers/NotFoundPage/Loadable';

import firebase from 'firebase/app';
import 'firebase/analytics';

import GlobalStyle from '../../global-styles';

// This import loads the firebase namespace.

firebase.initializeApp({
  apiKey: 'AIzaSyD3zcRysLwITCwFD4V3UayMCWVYU2T0bdc',
  authDomain: 'live-to-give-4cf93.firebaseapp.com',
  projectId: 'live-to-give-4cf93',
  storageBucket: 'live-to-give-4cf93.appspot.com',
  messagingSenderId: '917980550606',
  appId: '1:917980550606:web:770deb9c77ee5e3951879f',
  measurementId: 'G-6QTKESB7SR',
});

function App() {
  const user = reactLocalStorage.getObject('user');

  firebase.analytics();

  return (
    <div>
      {isMobile ? (
        <Switch>
          <Route
            exact
            path="/terms-and-conditions"
            component={TermsAndConditionsPage}
          />
          <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={AuthLoginPage} />
          <Route exact path="/forgot-password" component={ForgotPasswordPage} />
          <Route exact path="/new-password" component={NewPasswordPage} />
          <Route exact path="/register" component={RegistrationPage} />
          <Route exact path="/verify" component={OneTimePinPage} />
          <Route exact path="/create-profile" component={CreateProfilePage} />
          <Route exact path="/my-interests" component={MyInterestPage} />
          <Route exact path="/activity-feed" component={ActivityFeedPage} />
          <Route
            exact
            path="/activity-feed/official/:id"
            component={OfficialPostDetailsPage}
          />
          <Route
            exact
            path="/activity-feed/challenges/:id"
            component={ChallengeDetailsPage}
          />
          <Route
            exact
            path="/activity-feed/live-sessions/:id"
            component={LiveSessionDetailsPage}
          />
          <Route
            exact
            path="/activity-feed/meetups/:id"
            component={MeetupDetailsPage}
          />
          <Route exact path="/post/:id" component={UserPostDetailsPage} />
          <Route exact path="/my-clubs" component={ClubIndexPage} />
          <Route exact path="/my-clubs/:id" component={ClubDetailsPage} />
          <Route exact path="/charities" component={CharityIndexPage} />
          <Route exact path="/charities/:id" component={CharityDetailsPage} />
          <Route exact path="/challenges" component={ChallengeIndexPage} />
          <Route
            exact
            path="/challenges/suggestion"
            component={ChallengeSuggestionPage}
          />
          <Route
            exact
            path="/challenges/:id"
            component={ChallengeDetailsPage}
          />
          <Route exact path="/meetups" component={MeetupIndexPage} />
          <Route
            exact
            path="/meetups/suggestion"
            component={MeetupSuggestionPage}
          />
          <Route exact path="/meetups/:id" component={MeetupDetailsPage} />
          <Route exact path="/live-sessions" component={LiveSessionIndexPage} />
          <Route
            exact
            path="/live-sessions/suggestion"
            component={LiveSessionSuggestionPage}
          />
          <Route
            exact
            path="/live-sessions/:id"
            component={LiveSessionDetailsPage}
          />
          <Route exact path="/notifications" component={NotificationsPage} />
          <Route exact path="/user-profile" component={UserProfilePage} />
          <Route exact path="/settings" component={UserSettingsPage} />
          <Route exact path="/ranking" component={UserRankingPage} />

          <Route exact path="/about-live-to-give" component={AboutAppPage} />
          <Route
            exact
            path="/terms-and-conditions"
            component={TermsAndConditionsPage}
          />
          <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route
            exact
            path="/user-commitments-and-commenting-guidelines"
            component={UserCommentingGuidelinesPage}
          />
          <Route exact path="/contact-us" component={ContactUsPage} />
          <Route exact path="/settings/contact-us" component={ContactUsPage} />

          {/* Admin */}
          {user.privilege === 'moderator' && (
            <>
              <Route
                exact
                path="/admin/dashboard"
                component={DashboardAnalyticsContainer}
              />
              <Route exact path="/admin/users" component={UserListPage} />
              <Route exact path="/admin/users/:id" component={UserInfoPage} />
              <Route exact path="/admin/posts" component={PostListPage} />
              <Route
                exact
                path="/admin/posts/:id"
                component={PostDetailsPage}
              />
              <Route exact path="/admin/comments" component={CommentListPage} />
              <Route
                exact
                path="/admin/comments/:id"
                component={CommentDetailsPage}
              />
              <Route
                exact
                path="/admin/officials"
                component={OfficialPostListPage}
              />
              <Route
                exact
                path="/admin/official/create"
                component={OfficialPostCreatePage}
              />
              <Route
                exact
                path="/admin/officials/:id/edit"
                component={OfficialPostEditPage}
              />
              <Route
                exact
                path="/admin/officials/:id"
                component={AdminOfficialPostDetailsPage}
              />
              <Route
                exact
                path="/admin/challenges"
                component={ChallengeListPage}
              />
              <Route
                exact
                path="/admin/challenge/create"
                component={ChallengeCreatePage}
              />
              <Route
                exact
                path="/admin/challenges/:id/edit"
                component={ChallengeEditPage}
              />
              <Route
                exact
                path="/admin/challenges/:id"
                component={AdminChallengeDetailsPage}
              />
              <Route
                exact
                path="/admin/live-session/create"
                component={LiveSessionCreatePage}
              />
              <Route
                exact
                path="/admin/live-sessions"
                component={LiveSessionListPage}
              />
              <Route
                exact
                path="/admin/live-sessions/:id"
                component={AdminLiveSessionDetailsPage}
              />
              <Route
                exact
                path="/admin/live-sessions/:id/edit"
                component={LiveSessionEditPage}
              />
              <Route
                exact
                path="/admin/meetup/create"
                component={MeetupCreatePage}
              />
              <Route exact path="/admin/meetups" component={MeetupListPage} />
              <Route
                exact
                path="/admin/meetups/:id"
                component={AdminMeetupDetailsPage}
              />
              <Route
                exact
                path="/admin/meetups/:id/edit"
                component={MeetupEditPage}
              />
              <Route exact path="/admin/teams" component={TeamListPage} />
              <Route
                exact
                path="/admin/teams/:id"
                component={TeamDetailsPage}
              />
              <Route
                exact
                path="/admin/notifications"
                component={SendNotificationsContainer}
              />
              <Route
                exact
                path="/admin/poll/create"
                component={PollCreatePage}
              />
              <Route exact path="/admin/polls" component={PollListPage} />
              <Route
                exact
                path="/admin/polls/:id"
                component={PollDetailsPage}
              />
              <Route
                exact
                path="/admin/polls/:id/edit"
                component={PollEditPage}
              />

              <Route
                exact
                path="/admin/charity-response"
                component={CharityResponsePage}
              />
            </>
          )}

          {/* This is the page handler for 404 page */}
          <Route path="" component={NotFoundPage} />
        </Switch>
      )}
      <GlobalStyle />
    </div>
  );
}

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
});

export default connect(mapStateToProps)(App);
