import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the challengeCreatePage state domain
 */

const selectChallengeCreatePageDomain = state =>
  state.challengeCreatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChallengeCreatePage
 */

const makeSelectChallengeCreatePage = () =>
  createSelector(
    selectChallengeCreatePageDomain,
    substate => substate,
  );

export default makeSelectChallengeCreatePage;
export { selectChallengeCreatePageDomain };
