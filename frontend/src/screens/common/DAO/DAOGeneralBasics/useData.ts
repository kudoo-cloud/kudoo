import { AppActions, ProfileActions } from 'src/store/actions';
import { useReducerData, useStoreActions } from 'src/store/hooks';

export const useData = () => {
  const createdDAOs = useReducerData('profile', 'createdDAOs', []);
  return {
    createdDAOs,
  };
};

export const useActions = () => {
  return useStoreActions({
    ...ProfileActions,
    ...AppActions,
  });
};
