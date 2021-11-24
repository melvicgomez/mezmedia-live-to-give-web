import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userProfilePage state domain
 */

const selectUserProfilePageDomain = state =>
  state.userProfilePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserProfilePage
 */

const makeSelectUserProfilePage = () =>
  createSelector(
    selectUserProfilePageDomain,
    substate => substate,
  );

export default makeSelectUserProfilePage;
export { selectUserProfilePageDomain };
