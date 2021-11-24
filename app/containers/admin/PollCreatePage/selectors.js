import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the pollCreatePage state domain
 */

const selectPollCreatePageDomain = state =>
  state.pollCreatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PollCreatePage
 */

const makeSelectPollCreatePage = () =>
  createSelector(
    selectPollCreatePageDomain,
    substate => substate,
  );

export default makeSelectPollCreatePage;
export { selectPollCreatePageDomain };
