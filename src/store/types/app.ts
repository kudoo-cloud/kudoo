import createTypes from 'redux-create-action-types';

interface IAppActionsTypes {
  SET_KUDOO_PRODUCT: string;
  UPDATE_HEADER_TITLE: string;
  SHOW_ALERT_DIALOG: string;
  CLOSE_ALERT_DIALOG: string;
  SET_ACTIVE_LANGUAGE: string;
  SET_TEMPORARY_ACTIVE_LANGUAGE: string;
}

const types: IAppActionsTypes = createTypes(
  'SET_KUDOO_PRODUCT',
  'UPDATE_HEADER_TITLE',
  'SHOW_ALERT_DIALOG',
  'CLOSE_ALERT_DIALOG',
  'SET_ACTIVE_LANGUAGE',
  'SET_TEMPORARY_ACTIVE_LANGUAGE',
);

export default types;
