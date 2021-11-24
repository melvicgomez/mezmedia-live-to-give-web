import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the commentDetailsPage state domain
 */

const selectCommentDetailsPageDomain = state =>
  state.commentDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CommentDetailsPage
 */

const makeSelectCommentDetailsPage = () =>
  createSelector(
    selectCommentDetailsPageDomain,
    substate => substate,
  );

export default makeSelectCommentDetailsPage;
export { selectCommentDetailsPageDomain };
