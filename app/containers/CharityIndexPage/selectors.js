import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the charityIndexPage state domain
 */

const selectCharityIndexPageDomain = state =>
  state.charityIndexPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CharityIndexPage
 */

const makeSelectCharityIndexPage = () =>
  createSelector(
    selectCharityIndexPageDomain,
    substate => substate,
  );

export default makeSelectCharityIndexPage;
export { selectCharityIndexPageDomain };
