/*
 *
 * UserSettingsPage actions
 *
 */

import {
  FETCH_BELL_STATUS,
  POST_BELL_STATUS,
  UPDATE_BELL_STATUS,
} from './constants';

export function fetchBellStatus(userId) {
  return {
    type: FETCH_BELL_STATUS,
    userId,
  };
}

export function postBellStatus(userId) {
  return {
    type: POST_BELL_STATUS,
    userId,
  };
}

export function updateBellStatus(params) {
  return {
    type: UPDATE_BELL_STATUS,
    params,
  };
}
