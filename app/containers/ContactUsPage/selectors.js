import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the contactUsPage state domain
 */

const selectContactUsPageDomain = state => state.contactUsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ContactUsPage
 */

const makeSelectContactUsPage = () =>
  createSelector(
    selectContactUsPageDomain,
    substate => substate,
  );

export default makeSelectContactUsPage;
export { selectContactUsPageDomain };
