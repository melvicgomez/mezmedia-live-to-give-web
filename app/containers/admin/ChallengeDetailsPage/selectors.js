import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the challengeDetailsPage state domain
 */

const selectAdminChallengeDetailsPageDomain = state =>
  state.challengeDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChallengeDetailsPage
 */

const makeSelectAdminChallengeDetailsPage = () =>
  createSelector(
    selectAdminChallengeDetailsPageDomain,
    substate => substate,
  );

export default makeSelectAdminChallengeDetailsPage;
export { selectAdminChallengeDetailsPageDomain };
