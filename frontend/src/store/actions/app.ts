import { createAction } from 'redux-actions';
import { Product } from '@client/security/types';
import Types from '../types/app';

const setKudooProduct = createAction(
  Types.SET_KUDOO_PRODUCT,
  (type: Product) => ({ type })
);

const updateHeaderTitle = createAction(
  Types.UPDATE_HEADER_TITLE,
  (title: string) => ({ title })
);

interface IShowAlertDialogParams {
  title: any;
  description: any;
  buttons: any;
  titleColor: string;
  classes: object;
}

const showAlertDialog = createAction(
  Types.SHOW_ALERT_DIALOG,
  (params: IShowAlertDialogParams) => params
);

const closeAlertDialog = createAction(Types.CLOSE_ALERT_DIALOG);

const setActiveLanguage = createAction(
  Types.SET_ACTIVE_LANGUAGE,
  (language: string) => ({ language })
);

const setTemporaryActiveLanguage = createAction(
  Types.SET_TEMPORARY_ACTIVE_LANGUAGE,
  (language: string) => ({ language })
);

export default {
  setKudooProduct,
  updateHeaderTitle,
  showAlertDialog,
  closeAlertDialog,
  setActiveLanguage,
  setTemporaryActiveLanguage,
};
