import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the activityFeedPage state domain
 */

const selectActivityFeedPageDomain = state =>
  state.activityFeedPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ActivityFeedPage
 */

const makeSelectActivityFeedPage = () =>
  createSelector(
    selectActivityFeedPageDomain,
    substate => substate,
  );

export default makeSelectActivityFeedPage;
export { selectActivityFeedPageDomain };
