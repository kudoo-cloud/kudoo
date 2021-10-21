import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web
import thunk from 'redux-thunk';
import reducers, { IReduxState } from './reducers';

const emptyMiddleware = () => (next) => (action) => {
  // empty middleware
  next(action);
};

let loggerMiddleware;

if (process.env.NODE_ENV === 'development') {
  loggerMiddleware = logger;
} else {
  loggerMiddleware = emptyMiddleware;
}

const config = {
  key: 'root',
  storage,
};

const reducer = persistReducer<IReduxState>(config, reducers as any);

let reduxDevTool = (f) => f;
if (typeof (window as any).__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
  reduxDevTool = (window as any).__REDUX_DEVTOOLS_EXTENSION__();
}

const store = createStore(
  reducer,
  {} as any, // initial state
  compose(
    applyMiddleware(thunk, loggerMiddleware),
    // If you are using the devToolsExtension, you can add it here also
    reduxDevTool,
  ),
);

const persistor = persistStore(store);

export { persistor, store };
