import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userCommentingGuidelinesPage state domain
 */

const selectUserCommentingGuidelinesPageDomain = state =>
  state.userCommentingGuidelinesPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserCommentingGuidelinesPage
 */

const makeSelectUserCommentingGuidelinesPage = () =>
  createSelector(
    selectUserCommentingGuidelinesPageDomain,
    substate => substate,
  );

export default makeSelectUserCommentingGuidelinesPage;
export { selectUserCommentingGuidelinesPageDomain };
