import createTypes from 'redux-create-action-types';

interface IProfileActionsTypes {
  SET_USER_DATA: string;
  LOGOUT_USER: string;
  SELECT_COMPANY: string;
  SET_ONLY_TOKEN: string;
  RESET_USER_DATA: string;
}

const types: IProfileActionsTypes = createTypes(
  'SET_USER_DATA',
  'LOGOUT_USER',
  'SELECT_COMPANY',
  'SET_ONLY_TOKEN',
  'RESET_USER_DATA'
);

export default types;
