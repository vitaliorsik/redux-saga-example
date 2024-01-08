import { put, call, all, takeEvery, takeLatest, fork, select, delay, throttle, debounce, retry, apply, join, cancel } from 'redux-saga/effects';
import {
  GET_LATEST_NEWS,
  GET_POPULAR_NEWS,
  SET_LATEST_NEWS_ERROR, SET_LOADING_DATA,
  SET_POPULAR_NEWS_ERROR,
} from '../constants';
import { setLatestNews, setPopularNews } from '../actions/actionCreator';
import { getLatestNews, getPopularNews } from '../../api/index';
import {LOCATION_CHANGE} from "connected-react-router";

export function* handleLatestNews() {
  try {
    const { hits } = yield call(getLatestNews, 'react');
    // const { hits } = yield apply(getLatestNews, ['react']);
    yield put(setLatestNews(hits));
  } catch {
    yield put({ type: SET_LATEST_NEWS_ERROR, payload: 'Error fetching latest news' });
  }
}

export function* handlePopularNews() {
  try {
    const { hits } = yield call(getPopularNews);
    yield put(setPopularNews(hits));
  } catch {
    yield put({ type: SET_POPULAR_NEWS_ERROR, payload: 'Error fetching popular news' });
  }
}

export function* watchPopularSaga() {
  yield takeEvery(GET_POPULAR_NEWS, handlePopularNews);
}

export function* watchLatestSaga() {
  yield takeEvery(GET_LATEST_NEWS, handleLatestNews);
}

export function * watchNewSaga() {
  // yield delay(2000);
  // console.log('!!!');
  yield put({ type: SET_LOADING_DATA, payload: true})
  const path = yield select(({router}) => router.location.pathname);
  if (path === '/popular-news') {
    yield call(handlePopularNews);
  } else if (path === '/latest-news') {
    yield call(handleLatestNews);
  }
  yield put({ type: SET_LOADING_DATA, payload: false})
}

export function* error() {
  console.log('!!!');
  throw new Error('test error');
}

export function* loadTest() {
  const { hits } = yield call(getPopularNews);

  if (true) {
    cancel(getPopularNews);
  }
  return hits;
}

export default function* rootSaga() {
  // yield throttle(5000, LOCATION_CHANGE, () => console.log('!!!'));
  // yield debounce(5000, LOCATION_CHANGE, () => console.log('!!!'));
  // yield retry(5, 2000, error);
  yield takeLatest(LOCATION_CHANGE, watchNewSaga);

  const news = yield fork(loadTest);
  const [first] = yield join(news);
  console.log(first);
}
