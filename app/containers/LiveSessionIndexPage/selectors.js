import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveSessionIndexPage state domain
 */

const selectLiveSessionIndexPageDomain = state =>
  state.liveSessionIndexPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveSessionIndexPage
 */

const makeSelectLiveSessionIndexPage = () =>
  createSelector(
    selectLiveSessionIndexPageDomain,
    substate => substate,
  );

export default makeSelectLiveSessionIndexPage;
export { selectLiveSessionIndexPageDomain };
