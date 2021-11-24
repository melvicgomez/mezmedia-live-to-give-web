import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the pollDetailsPage state domain
 */

const selectPollDetailsPageDomain = state =>
  state.pollDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PollDetailsPage
 */

const makeSelectPollDetailsPage = () =>
  createSelector(
    selectPollDetailsPageDomain,
    substate => substate,
  );

export default makeSelectPollDetailsPage;
export { selectPollDetailsPageDomain };
