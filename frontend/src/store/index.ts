import { createStore, compose, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import persistStore from 'redux-persist/lib/persistStore';
import persistCombineReducers from 'redux-persist/lib/persistCombineReducers';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web
import reducers from './reducers';

const emptyMiddleware = store => next => action => {
  // empty middleware
  next(action);
};

let loggerMiddleware;

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  loggerMiddleware = logger;
} else {
  loggerMiddleware = emptyMiddleware;
}

const config = {
  key: 'root',
  storage,
};

const reducer = persistCombineReducers(config, reducers);

let reduxDevTool = f => f;
// @ts-ignore
if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
  // @ts-ignore
  reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__();
}

const store = createStore(
  reducer,
  {}, // initial state
  compose(
    applyMiddleware(thunk, loggerMiddleware),
    // If you are using the devToolsExtension, you can add it here also
    reduxDevTool
  )
);

const persistor = persistStore(store);

export { persistor, store };
