import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the postDetailsPage state domain
 */

const selectPostDetailsPageDomain = state =>
  state.postDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PostDetailsPage
 */

const makeSelectPostDetailsPage = () =>
  createSelector(
    selectPostDetailsPageDomain,
    substate => substate,
  );

export default makeSelectPostDetailsPage;
export { selectPostDetailsPageDomain };
