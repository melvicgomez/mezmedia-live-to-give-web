import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the OfficialPostListPage state domain
 */

const selectOfficialPostListPageDomain = state =>
  state.OfficialPostListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OfficialPostListPage
 */

const makeSelectOfficialPostListPage = () =>
  createSelector(
    selectOfficialPostListPageDomain,
    substate => substate,
  );

export default makeSelectOfficialPostListPage;
export { selectOfficialPostListPageDomain };
