import idx from 'idx';
import { handleActions } from 'redux-actions';
import { IDAOEntity } from '../types';
import Types from '../types/profile';

export interface IProfileState {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  id: string;
  isLoggedIn: boolean;
  expiresAt: string;
  signedAt: string;
  userId: string;
  selectedDAO: IDAOEntity;
  joinedDAOs: IDAOEntity[];
  createdDAOs: IDAOEntity[];
}

interface IAction {
  payload: any;
  type: string;
}

const initialState = {
  email: '',
  firstName: '',
  lastName: '',
  token: '',
  id: '',
  isLoggedIn: false,
  expiresAt: '',
  signedAt: '',
  userId: '',
  selectedDAO: {},
  joinedDAOs: [],
  createdDAOs: [],
};

export default handleActions(
  {
    [Types.SET_USER_DATA]: (state: IProfileState, action: IAction) => ({
      ...state,
      ...action.payload,
    }),
    [Types.RESET_USER_DATA]: () => ({
      ...initialState,
    }),
    [Types.SELECT_DAO]: (state: IProfileState, action: IAction) => ({
      ...state,
      selectedDAO: action.payload,
    }),
    [Types.SET_ONLY_TOKEN]: (state: IProfileState, action: IAction) => ({
      token: idx(action, (_) => _.payload.token),
    }),
    [Types.LOGOUT_USER]: () => ({
      ...initialState,
    }),
  },
  initialState,
) as IProfileState;
