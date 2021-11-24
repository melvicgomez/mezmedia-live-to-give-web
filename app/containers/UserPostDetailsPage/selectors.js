import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userPostDetailsPage state domain
 */

const selectUserPostDetailsPageDomain = state =>
  state.userPostDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserPostDetailsPage
 */

const makeSelectUserPostDetailsPage = () =>
  createSelector(
    selectUserPostDetailsPageDomain,
    substate => substate,
  );

export default makeSelectUserPostDetailsPage;
export { selectUserPostDetailsPageDomain };
