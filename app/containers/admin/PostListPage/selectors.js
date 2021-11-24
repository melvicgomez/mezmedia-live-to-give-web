import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the postListPage state domain
 */

const selectPostListPageDomain = state => state.postListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PostListPage
 */

const makeSelectPostListPage = () =>
  createSelector(
    selectPostListPageDomain,
    substate => substate,
  );

export default makeSelectPostListPage;
export { selectPostListPageDomain };
