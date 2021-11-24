import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveSessionCreatePage state domain
 */

const selectLiveSessionCreatePageDomain = state =>
  state.liveSessionCreatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveSessionCreatePage
 */

const makeSelectLiveSessionCreatePage = () =>
  createSelector(
    selectLiveSessionCreatePageDomain,
    substate => substate,
  );

export default makeSelectLiveSessionCreatePage;
export { selectLiveSessionCreatePageDomain };
