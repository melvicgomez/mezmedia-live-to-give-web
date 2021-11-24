import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveSessionEditPage state domain
 */

const selectLiveSessionEditPageDomain = state =>
  state.liveSessionEditPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveSessionEditPage
 */

const makeSelectLiveSessionEditPage = () =>
  createSelector(
    selectLiveSessionEditPageDomain,
    substate => substate,
  );

export default makeSelectLiveSessionEditPage;
export { selectLiveSessionEditPageDomain };
