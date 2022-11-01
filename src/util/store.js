import { createSlice, configureStore, current } from '@reduxjs/toolkit';
import { formatPage } from './url';
import config from '../config';

const { debug } = config;

const defaultPage = config.default;

const articleContext = require.context('../articles/', true, /\.(md|jpg|png|gif|jpeg|mp4|mp3|avi|ogg)$/);
const articles = {}
articleContext.keys().forEach((key) => (articles[key] = articleContext(key)));

const getFilePath = (page, articles) => {
  // if the path not in the articles, which is the maps from the original aricle path to the bundle path created by require.context
  const path = formatPage(page);
  if (!articles[path]) {
    return null;
  }
  // dynamically import the article resource by articles
  return articles[path];
}

const routerInitialState = {
  history: [],
  page: defaultPage,
  articles,
  filePath: getFilePath(defaultPage, articles),
};

export const AppSlice = createSlice({
  name: 'router',
  initialState: routerInitialState,
  reducers: {
    goBack: (state, action) => {
      // go back to last page based on history list
      if (state.history.length === 0) {
        return {
          ...state,
        };
      }
      const history = state.history.slice();
      const articles = Object.assign({}, state.articles);
      const lastPage = history.pop();
      const filePath = getFilePath(lastPage, articles);
      debug && console.log('[debug] goBack To Page: ', lastPage, 'history', history);
      return {
        ...state,
        history,
        filePath,
        page: lastPage,
      }
    },
    navigate: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const page = action.payload;
      if (page === state.page) {
        return {
          ...state,
        };
      }
      const history = state.history.slice();
      const filePath = getFilePath(page, state.articles);
      // push current page to history
      history.push(state.page);
      window.history.pushState(null, null, `?page=${page}`);
      // window.location.hash = `?page=${page}`;
      debug && console.log('[debug] navigate page: ', page, 'history', history);
      return {
        ...state,
        history,
        filePath,
        page,
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { goBack, navigate } = AppSlice.actions
export const selectHistory = (state) => state.router.history;
export const selectPage = (state) => state.router.page;
export const selectFilePath = (state) => state.router.filePath;
export default configureStore({
  reducer: {
    router: AppSlice.reducer
  }
});
