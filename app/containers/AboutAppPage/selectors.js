import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the aboutAppPage state domain
 */

const selectAboutAppPageDomain = state => state.aboutAppPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AboutAppPage
 */

const makeSelectAboutAppPage = () =>
  createSelector(
    selectAboutAppPageDomain,
    substate => substate,
  );

export default makeSelectAboutAppPage;
export { selectAboutAppPageDomain };
