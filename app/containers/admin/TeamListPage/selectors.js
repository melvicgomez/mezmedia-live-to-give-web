import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the teamListPage state domain
 */

const selectTeamListPageDomain = state => state.teamListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TeamListPage
 */

const makeSelectTeamListPage = () =>
  createSelector(
    selectTeamListPageDomain,
    substate => substate,
  );

export default makeSelectTeamListPage;
export { selectTeamListPageDomain };
