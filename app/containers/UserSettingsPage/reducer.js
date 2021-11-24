/*
 *
 * UserSettingsPage reducer
 *
 */
import produce from 'immer';
import {
  FETCH_BELL_STATUS,
  POST_BELL_STATUS,
  UPDATE_BELL_STATUS,
} from './constants';

export const initialState = {
  bell_show: false,
  isLoading: false,
};

/* eslint-disable default-case, no-param-reassign */
const userSettingsPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FETCH_BELL_STATUS:
      case POST_BELL_STATUS:
        draft.bell_show = false;
        draft.isLoading = true;
        break;
      case UPDATE_BELL_STATUS:
        draft.bell_show = action.params.bell_show;
        draft.isLoading = action.params.isLoading;
        break;
    }
  });

export default userSettingsPageReducer;
