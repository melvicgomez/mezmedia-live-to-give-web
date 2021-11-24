import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveSessionDetailsPage state domain
 */

const selectAdminLiveSessionDetailsPageDomain = state =>
  state.liveSessionDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveSessionDetailsPage
 */

const makeSelectAdminLiveSessionDetailsPage = () =>
  createSelector(
    selectAdminLiveSessionDetailsPageDomain,
    substate => substate,
  );

export default makeSelectAdminLiveSessionDetailsPage;
export { selectAdminLiveSessionDetailsPageDomain };
