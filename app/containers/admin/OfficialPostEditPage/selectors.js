import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the officialPostEditPage state domain
 */

const selectOfficialPostEditPageDomain = state =>
  state.officialPostEditPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OfficialPostEditPage
 */

const makeSelectOfficialPostEditPage = () =>
  createSelector(
    selectOfficialPostEditPageDomain,
    substate => substate,
  );

export default makeSelectOfficialPostEditPage;
export { selectOfficialPostEditPageDomain };
