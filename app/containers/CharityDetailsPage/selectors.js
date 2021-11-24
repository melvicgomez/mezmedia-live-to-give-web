import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the charityDetailsPage state domain
 */

const selectCharityDetailsPageDomain = state =>
  state.charityDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CharityDetailsPage
 */

const makeSelectCharityDetailsPage = () =>
  createSelector(
    selectCharityDetailsPageDomain,
    substate => substate,
  );

export default makeSelectCharityDetailsPage;
export { selectCharityDetailsPageDomain };
