import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveSessionListPage state domain
 */

const selectLiveSessionListPageDomain = state =>
  state.liveSessionListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveSessionListPage
 */

const makeSelectLiveSessionListPage = () =>
  createSelector(
    selectLiveSessionListPageDomain,
    substate => substate,
  );

export default makeSelectLiveSessionListPage;
export { selectLiveSessionListPageDomain };
