import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the forgotPasswordPage state domain
 */

const selectForgotPasswordPageDomain = state =>
  state.forgotPasswordPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ForgotPasswordPage
 */

const makeSelectForgotPasswordPage = () =>
  createSelector(
    selectForgotPasswordPageDomain,
    substate => substate,
  );

export default makeSelectForgotPasswordPage;
export { selectForgotPasswordPageDomain };
