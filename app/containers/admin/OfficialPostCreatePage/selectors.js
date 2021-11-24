import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the officialPostCreatePage state domain
 */

const selectOfficialPostCreatePageDomain = state =>
  state.officialPostCreatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OfficialPostCreatePage
 */

const makeSelectOfficialPostCreatePage = () =>
  createSelector(
    selectOfficialPostCreatePageDomain,
    substate => substate,
  );

export default makeSelectOfficialPostCreatePage;
export { selectOfficialPostCreatePageDomain };
