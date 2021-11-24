import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the challengeSuggestionPage state domain
 */

const selectChallengeSuggestionPageDomain = state =>
  state.challengeSuggestionPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChallengeSuggestionPage
 */

const makeSelectChallengeSuggestionPage = () =>
  createSelector(
    selectChallengeSuggestionPageDomain,
    substate => substate,
  );

export default makeSelectChallengeSuggestionPage;
export { selectChallengeSuggestionPageDomain };
