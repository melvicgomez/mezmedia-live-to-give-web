import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the pollListPage state domain
 */

const selectPollListControllerDomain = state =>
  state.pollListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PollListPage
 */

const makeSelectPollListController = () =>
  createSelector(
    selectPollListControllerDomain,
    substate => substate,
  );

export default makeSelectPollListController;
export { selectPollListControllerDomain };
