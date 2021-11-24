import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetupListPage state domain
 */

const selectMeetupListPageDomain = state =>
  state.meetupListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetupListPage
 */

const makeSelectMeetupListPage = () =>
  createSelector(
    selectMeetupListPageDomain,
    substate => substate,
  );

export default makeSelectMeetupListPage;
export { selectMeetupListPageDomain };
