import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import urls from 'src/helpers/urls';
import { IReduxState } from 'src/store/reducers';

export const useData = () => {
  const profile = useSelector((state: IReduxState) => state?.profile);
  const app = useSelector((state: IReduxState) => state?.app);
  return {
    profile,
    app,
  };
};

export const isPreviewRoute = (history) => {
  return (
    matchPath(history?.location?.pathname, {
      path: '/preview/*',
    }) ||
    matchPath(history?.location?.pathname, {
      path: '/email/:type/*',
    }) ||
    matchPath(history?.location?.pathname, {
      path: '/integrations*',
    })
  );
};

export const shouldRedirectToManageDAO = (history, data, daosLoading) => {
  return (
    !daosLoading &&
    data?.daos?.length === 0 &&
    !matchPath(history?.location?.pathname, {
      path: urls.ACCOUNT_SETTINGS({ path: true }),
    }) &&
    !matchPath(history?.location?.pathname, {
      path: urls.MANAGE_DAOS({ path: true }),
    }) &&
    !matchPath(history?.location?.pathname, {
      path: urls.CREATE_DAO({ path: true }),
    })
  );
};
