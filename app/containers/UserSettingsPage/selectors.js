import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userSettingsPage state domain
 */

const selectUserSettingsPageDomain = state =>
  state.userSettingsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserSettingsPage
 */

const makeSelectUserSettingsPage = () =>
  createSelector(
    selectUserSettingsPageDomain,
    substate => substate,
  );

export default makeSelectUserSettingsPage;
export { selectUserSettingsPageDomain };
