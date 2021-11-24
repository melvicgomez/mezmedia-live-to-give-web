import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the notificationsPage state domain
 */

const selectNotificationsPageDomain = state =>
  state.notificationsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by NotificationsPage
 */

const makeSelectNotificationsPage = () =>
  createSelector(
    selectNotificationsPageDomain,
    substate => substate,
  );

export default makeSelectNotificationsPage;
export { selectNotificationsPageDomain };
