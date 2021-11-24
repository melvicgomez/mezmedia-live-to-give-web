import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userInfoPage state domain
 */

const selectUserInfoPageDomain = state => state.userInfoPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserInfoPage
 */

const makeSelectUserInfoPage = () =>
  createSelector(
    selectUserInfoPageDomain,
    substate => substate,
  );

export default makeSelectUserInfoPage;
export { selectUserInfoPageDomain };
