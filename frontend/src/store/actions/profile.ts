import { createAction } from 'redux-actions';
import Types from '../types/profile';

const setUserData = createAction(Types.SET_USER_DATA);
const setOnlyToken = createAction(Types.SET_ONLY_TOKEN, (token) => ({ token }));
const logoutUser = createAction(Types.LOGOUT_USER);
const resetUserData = createAction(Types.RESET_USER_DATA);
const selectDAO = createAction(Types.SELECT_DAO);

export default {
  setUserData,
  logoutUser,
  selectDAO,
  setOnlyToken,
  resetUserData,
};
