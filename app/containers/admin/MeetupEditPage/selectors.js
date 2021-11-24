import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetupEditPage state domain
 */

const selectMeetupEditPageDomain = state =>
  state.meetupEditPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetupEditPage
 */

const makeSelectMeetupEditPage = () =>
  createSelector(
    selectMeetupEditPageDomain,
    substate => substate,
  );

export default makeSelectMeetupEditPage;
export { selectMeetupEditPageDomain };
