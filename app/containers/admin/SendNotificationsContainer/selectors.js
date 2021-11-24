import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sendNotificationsContainer state domain
 */

const selectSendNotificationsContainerDomain = state =>
  state.sendNotificationsContainer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SendNotificationsContainer
 */

const makeSelectSendNotificationsContainer = () =>
  createSelector(
    selectSendNotificationsContainerDomain,
    substate => substate,
  );

export default makeSelectSendNotificationsContainer;
export { selectSendNotificationsContainerDomain };
