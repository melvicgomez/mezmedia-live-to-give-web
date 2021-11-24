import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the newPasswordPage state domain
 */

const selectNewPasswordPageDomain = state =>
  state.newPasswordPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by NewPasswordPage
 */

const makeSelectNewPasswordPage = () =>
  createSelector(
    selectNewPasswordPageDomain,
    substate => substate,
  );

export default makeSelectNewPasswordPage;
export { selectNewPasswordPageDomain };
