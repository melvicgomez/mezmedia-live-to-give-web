import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the myInterestPage state domain
 */

const selectMyInterestPageDomain = state =>
  state.myInterestPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MyInterestPage
 */

const makeSelectMyInterestPage = () =>
  createSelector(
    selectMyInterestPageDomain,
    substate => substate,
  );

export default makeSelectMyInterestPage;
export { selectMyInterestPageDomain };
