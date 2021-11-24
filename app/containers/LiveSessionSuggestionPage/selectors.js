import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveSessionSuggestionPage state domain
 */

const selectLiveSessionSuggestionPageDomain = state =>
  state.liveSessionSuggestionPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveSessionSuggestionPage
 */

const makeSelectLiveSessionSuggestionPage = () =>
  createSelector(
    selectLiveSessionSuggestionPageDomain,
    substate => substate,
  );

export default makeSelectLiveSessionSuggestionPage;
export { selectLiveSessionSuggestionPageDomain };
