/**
 *
 * Asynchronously loads the component for TextInputComponent
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
