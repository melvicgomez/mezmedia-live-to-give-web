import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userRankingPage state domain
 */

const selectUserRankingPageDomain = state =>
  state.userRankingPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserRankingPage
 */

const makeSelectUserRankingPage = () =>
  createSelector(
    selectUserRankingPageDomain,
    substate => substate,
  );

export default makeSelectUserRankingPage;
export { selectUserRankingPageDomain };
