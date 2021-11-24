import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the authLoginPage state domain
 */

const selectAuthLoginPageDomain = state => state.authLoginPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AuthLoginPage
 */

const makeSelectAuthLoginPage = () =>
  createSelector(
    selectAuthLoginPageDomain,
    substate => substate,
  );

export default makeSelectAuthLoginPage;
export { selectAuthLoginPageDomain };
