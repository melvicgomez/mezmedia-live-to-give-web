import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clubDetailsPage state domain
 */

const selectClubDetailsPageDomain = state =>
  state.clubDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ClubDetailsPage
 */

const makeSelectClubDetailsPage = () =>
  createSelector(
    selectClubDetailsPageDomain,
    substate => substate,
  );

export default makeSelectClubDetailsPage;
export { selectClubDetailsPageDomain };
