import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the commentListPage state domain
 */

const selectCommentListPageDomain = state =>
  state.commentListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CommentListPage
 */

const makeSelectCommentListPage = () =>
  createSelector(
    selectCommentListPageDomain,
    substate => substate,
  );

export default makeSelectCommentListPage;
export { selectCommentListPageDomain };
