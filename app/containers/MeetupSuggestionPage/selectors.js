import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetupSuggestionPage state domain
 */

const selectMeetupSuggestionPageDomain = state =>
  state.meetupSuggestionPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetupSuggestionPage
 */

const makeSelectMeetupSuggestionPage = () =>
  createSelector(
    selectMeetupSuggestionPageDomain,
    substate => substate,
  );

export default makeSelectMeetupSuggestionPage;
export { selectMeetupSuggestionPageDomain };
