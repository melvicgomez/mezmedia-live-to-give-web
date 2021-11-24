import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the teamDetailsPage state domain
 */

const selectTeamDetailsPageDomain = state =>
  state.teamDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TeamDetailsPage
 */

const makeSelectTeamDetailsPage = () =>
  createSelector(
    selectTeamDetailsPageDomain,
    substate => substate,
  );

export default makeSelectTeamDetailsPage;
export { selectTeamDetailsPageDomain };
