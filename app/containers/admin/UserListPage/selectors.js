import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userListPage state domain
 */

const selectUserListPageDomain = state => state.userListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserListPage
 */

const makeSelectUserListPage = () =>
  createSelector(
    selectUserListPageDomain,
    substate => substate,
  );

export default makeSelectUserListPage;
export { selectUserListPageDomain };
