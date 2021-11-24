import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the oneTimePinPage state domain
 */

const selectOneTimePinPageDomain = state =>
  state.oneTimePinPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OneTimePinPage
 */

const makeSelectOneTimePinPage = () =>
  createSelector(
    selectOneTimePinPageDomain,
    substate => substate,
  );

export default makeSelectOneTimePinPage;
export { selectOneTimePinPageDomain };
