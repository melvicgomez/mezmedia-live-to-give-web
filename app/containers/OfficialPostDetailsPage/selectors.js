import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the officialPostDetailsPage state domain
 */

const selectOfficialPostDetailsPageDomain = state =>
  state.officialPostDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OfficialPostDetailsPage
 */

const makeSelectOfficialPostDetailsPage = () =>
  createSelector(
    selectOfficialPostDetailsPageDomain,
    substate => substate,
  );

export default makeSelectOfficialPostDetailsPage;
export { selectOfficialPostDetailsPageDomain };
