import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the challengeEditPage state domain
 */

const selectChallengeEditPageDomain = state =>
  state.challengeEditPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChallengeEditPage
 */

const makeSelectChallengeEditPage = () =>
  createSelector(
    selectChallengeEditPageDomain,
    substate => substate,
  );

export default makeSelectChallengeEditPage;
export { selectChallengeEditPageDomain };
