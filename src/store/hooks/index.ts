import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppActions, ProfileActions } from 'src/store/actions';
import { IReduxState } from '../reducers';

const useReducerData = (reducerName, attr, defaultValue) => {
  return useSelector(
    (state) => get(state, `${reducerName}.${attr}`) || defaultValue,
  );
};

const useStoreActions = (actions) => {
  const dispatch = useDispatch();
  return bindActionCreators(actions || {}, dispatch);
};

type AllActionsType = typeof ProfileActions & typeof AppActions;

const useAllActions = (): AllActionsType => {
  return useStoreActions({
    ...ProfileActions,
    ...AppActions,
  });
};

const useProfile = () => {
  return useSelector((state: IReduxState) => state?.profile);
};

export { useStoreActions, useReducerData, useAllActions, useProfile };
