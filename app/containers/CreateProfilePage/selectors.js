import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the CreateProfilePage state domain
 */

const selectCreateProfilePageDomain = state =>
  state.createProfilePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateProfilePage
 */

const makeSelectcreateProfilePage = () =>
  createSelector(
    selectCreateProfilePageDomain,
    substate => substate,
  );

export default makeSelectcreateProfilePage;
export { selectCreateProfilePageDomain };
