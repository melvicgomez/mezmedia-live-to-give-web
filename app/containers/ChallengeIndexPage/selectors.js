import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the challengeIndexPage state domain
 */

const selectChallengeIndexPageDomain = state =>
  state.challengeIndexPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChallengeIndexPage
 */

const makeSelectChallengeIndexPage = () =>
  createSelector(
    selectChallengeIndexPageDomain,
    substate => substate,
  );

export default makeSelectChallengeIndexPage;
export { selectChallengeIndexPageDomain };
