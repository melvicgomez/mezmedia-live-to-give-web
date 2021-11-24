import { takeLatest, call, put } from 'redux-saga/effects';
import axiosInstance from 'services';
import { FETCH_BELL_STATUS, POST_BELL_STATUS } from './constants';
import { updateBellStatus } from './actions';

function* fetchNotificationStatus(action) {
  try {
    const repos = yield call(
      requestParams =>
        axiosInstance.get(
          `/api/latest-notification?user_id=${requestParams.user_id}`,
        ),
      {
        user_id: action.userId,
      },
    );
    yield put(
      updateBellStatus({ bell_show: repos.data.show_bell, isLoading: false }),
    );
  } catch (err) {
    yield put(updateBellStatus({ bell_show: false, isLoading: false }));
  }
}

function* postNotificationStatus(action) {
  try {
    const repos = yield call(
      requestParams =>
        axiosInstance.post(`/api/latest-notification`, {
          user_id: requestParams.user_id,
        }),
      {
        user_id: action.userId,
      },
    );
    yield put(
      updateBellStatus({ bell_show: repos.data.show_bell, isLoading: false }),
    );
  } catch (err) {
    yield put(updateBellStatus({ bell_show: false, isLoading: false }));
  }
}

export default function* notificationSage() {
  yield takeLatest(POST_BELL_STATUS, postNotificationStatus);
  yield takeLatest(FETCH_BELL_STATUS, fetchNotificationStatus);
}
