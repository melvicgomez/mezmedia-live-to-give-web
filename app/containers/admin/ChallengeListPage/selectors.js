import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the challengeListPage state domain
 */

const selectCHallengeListPageDomain = state =>
  state.challengeListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChallengeListPage
 */

const makeSelectCHallengeListPage = () =>
  createSelector(
    selectCHallengeListPageDomain,
    substate => substate,
  );

export default makeSelectCHallengeListPage;
export { selectCHallengeListPageDomain };
