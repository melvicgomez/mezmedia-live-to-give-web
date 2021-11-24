import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the termsAndConditionsPage state domain
 */

const selectTermsAndConditionsPageDomain = state =>
  state.termsAndConditionsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TermsAndConditionsPage
 */

const makeSelectTermsAndConditionsPage = () =>
  createSelector(
    selectTermsAndConditionsPageDomain,
    substate => substate,
  );

export default makeSelectTermsAndConditionsPage;
export { selectTermsAndConditionsPageDomain };
