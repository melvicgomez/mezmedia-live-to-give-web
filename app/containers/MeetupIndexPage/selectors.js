import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetupIndexPage state domain
 */

const selectMeetupIndexPageDomain = state =>
  state.meetupIndexPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetupIndexPage
 */

const makeSelectMeetupIndexPage = () =>
  createSelector(
    selectMeetupIndexPageDomain,
    substate => substate,
  );

export default makeSelectMeetupIndexPage;
export { selectMeetupIndexPageDomain };
