import idx from 'idx';
import { handleActions } from 'redux-actions';
import Types from '../types/app';
import ProfileTypes from '../types/profile';
import { Product } from '../types/security';

interface IState {
  kudoo_product: Product;
  headerTitle: string;
  alertDialog: {
    visible: boolean;
    title: any;
    description: any;
    buttons?: any;
    titleColor?: string | null;
    classes?: Record<string, unknown>;
  };
  activeLanguage: string;
  tempActiveLanguage: string | undefined;
}

interface IAction {
  payload: any;
  type: string;
}

const initialState = {
  headerTitle: 'Dashboard',
  kudoo_product: Product.inventory,
  alertDialog: {
    visible: false,
    title: null,
    description: null,
    buttons: undefined,
    titleColor: null,
    classes: {},
  },
  activeLanguage: 'en_AU',
  tempActiveLanguage: undefined, // this is mainly used for create/update company page , so that on dropdwon we can change temporary language
};

export default handleActions(
  {
    'persist/REHYDRATE': (state: IState, action: IAction) => {
      return {
        ...initialState,
        headerTitle: state.headerTitle,
        kudoo_product:
          idx(action, (x) => x.payload.app.kudoo_product) ||
          initialState.kudoo_product,
      };
    },

    [Types.SET_KUDOO_PRODUCT]: (state: IState, action: IAction) => ({
      ...state,
      kudoo_product: action.payload.type,
    }),

    [Types.UPDATE_HEADER_TITLE]: (state: IState, action: IAction) => ({
      ...state,
      headerTitle: action.payload.title,
    }),

    [Types.SHOW_ALERT_DIALOG]: (state: IState, action: IAction) => ({
      ...state,
      alertDialog: {
        visible: true,
        title: action.payload.title,
        description: action.payload.description,
        buttons: action.payload.buttons,
        titleColor: action.payload.titleColor,
        classes: action.payload.classes,
      },
    }),

    [Types.CLOSE_ALERT_DIALOG]: (state: IState) => ({
      ...state,
      alertDialog: initialState.alertDialog,
    }),

    [Types.SET_ACTIVE_LANGUAGE]: (state: IState, action: IAction) => ({
      ...state,
      activeLanguage: action.payload.language,
    }),

    [Types.SET_TEMPORARY_ACTIVE_LANGUAGE]: (
      state: IState,
      action: IAction,
    ) => ({
      ...state,
      tempActiveLanguage: action.payload.language,
    }),

    [ProfileTypes.LOGOUT_USER]: (state: IState) => ({
      ...initialState,
      kudoo_product: state.kudoo_product,
    }),
  },
  initialState,
) as IState;
