import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clubIndexPage state domain
 */

const selectClubIndexPageDomain = state => state.clubIndexPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ClubIndexPage
 */

const makeSelectClubIndexPage = () =>
  createSelector(
    selectClubIndexPageDomain,
    substate => substate,
  );

export default makeSelectClubIndexPage;
export { selectClubIndexPageDomain };
