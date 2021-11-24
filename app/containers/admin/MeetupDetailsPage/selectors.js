import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetupDetailsPage state domain
 */

const selectMeetupDetailsPageDomain = state =>
  state.meetupDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetupDetailsPage
 */

const makeSelectMeetupDetailsPage = () =>
  createSelector(
    selectMeetupDetailsPageDomain,
    substate => substate,
  );

export default makeSelectMeetupDetailsPage;
export { selectMeetupDetailsPageDomain };
