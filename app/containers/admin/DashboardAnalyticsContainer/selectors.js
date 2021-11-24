import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboardAnalyticsContainer state domain
 */

const selectDashboardAnalyticsContainerDomain = state =>
  state.dashboardAnalyticsContainer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardAnalyticsContainer
 */

const makeSelectDashboardAnalyticsContainer = () =>
  createSelector(
    selectDashboardAnalyticsContainerDomain,
    substate => substate,
  );

export default makeSelectDashboardAnalyticsContainer;
export { selectDashboardAnalyticsContainerDomain };
