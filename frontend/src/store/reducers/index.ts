import AppReducer from './app';
import ProfileReducer from './profile';
import SessionDataReducer from './sessionData';

const reducers = {
  profile: ProfileReducer,
  app: AppReducer,
  sessionData: SessionDataReducer,
};

export type IReduxState = typeof reducers;

export default reducers;
