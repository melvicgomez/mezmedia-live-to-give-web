import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetupCreatePage state domain
 */

const selectMeetupCreatePageDomain = state =>
  state.meetupCreatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetupCreatePage
 */

const makeSelectMeetupCreatePage = () =>
  createSelector(
    selectMeetupCreatePageDomain,
    substate => substate,
  );

export default makeSelectMeetupCreatePage;
export { selectMeetupCreatePageDomain };
