import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the challengeDetailsPage state domain
 */

const selectChallengeDetailsPageDomain = state =>
  state.challengeDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChallengeDetailsPage
 */

const makeSelectChallengeDetailsPage = () =>
  createSelector(
    selectChallengeDetailsPageDomain,
    substate => substate,
  );

export default makeSelectChallengeDetailsPage;
export { selectChallengeDetailsPageDomain };
