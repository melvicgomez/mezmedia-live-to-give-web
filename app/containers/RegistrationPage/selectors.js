import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the registrationPage state domain
 */

const selectRegistrationPageDomain = state =>
  state.registrationPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RegistrationPage
 */

const makeSelectRegistrationPage = () =>
  createSelector(
    selectRegistrationPageDomain,
    substate => substate,
  );

export default makeSelectRegistrationPage;
export { selectRegistrationPageDomain };
