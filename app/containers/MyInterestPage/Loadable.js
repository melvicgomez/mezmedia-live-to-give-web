/**
 *
 * Asynchronously loads the component for MyInterestPage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
