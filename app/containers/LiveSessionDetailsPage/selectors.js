import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveSessionDetailsPage state domain
 */

const selectLiveSessionDetailsPageDomain = state =>
  state.liveSessionDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveSessionDetailsPage
 */

const makeSelectLiveSessionDetailsPage = () =>
  createSelector(
    selectLiveSessionDetailsPageDomain,
    substate => substate,
  );

export default makeSelectLiveSessionDetailsPage;
export { selectLiveSessionDetailsPageDomain };
