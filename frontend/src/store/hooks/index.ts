import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

const useReducerData = (reducerName, attr, defaultValue) => {
  return useSelector(
    (state) => get(state, `${reducerName}.${attr}`) || defaultValue,
  );
};

const useStoreActions = (actions) => {
  const dispatch = useDispatch();
  return bindActionCreators(actions || {}, dispatch);
};

export { useStoreActions, useReducerData };
