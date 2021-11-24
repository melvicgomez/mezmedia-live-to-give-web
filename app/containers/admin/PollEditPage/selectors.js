import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the pollEditPage state domain
 */

const selectPollEditPageDomain = state => state.pollEditPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PollEditPage
 */

const makeSelectPollEditPage = () =>
  createSelector(
    selectPollEditPageDomain,
    substate => substate,
  );

export default makeSelectPollEditPage;
export { selectPollEditPageDomain };
