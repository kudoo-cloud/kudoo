import {
  ApolloClient,
  ApolloLink,
  ErrorPolicy,
  FetchPolicy,
  InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { CachePersistor } from 'apollo-cache-persist';
import { createUploadLink } from 'apollo-upload-client';
import idx from 'idx';
import { IReduxState } from 'src/store/reducers';
import { store } from '../store';
import profileActions from '../store/actions/profile';

const uri = process.env.REACT_APP_GRAPHQL_API_URL;

const httpLink = createUploadLink({ uri });

const middlewareLink = new ApolloLink((operation, forward) => {
  const state = store.getState() as IReduxState;
  const token = state.profile.token;
  const daoId = idx(state, (_) => _.profile.selectedDAO.id);
  const headers = {};
  if (token) {
    headers['x-user-auth'] = `${token}`;
  }
  if (daoId) {
    headers['x-dao-auth'] = `${daoId}`;
  }
  const opName = operation.operationName;
  operation.setContext({
    headers,
    uri: uri + `?operationName=${opName}`,
  });
  return forward(operation);
});

const responseMiddleware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    return response;
  });
});

const onErrorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    // Check whethere there is UNAUTHENTICATED error, this mainly comes when token is invalid, navigate user to login
    const errors = (graphQLErrors || []).filter(
      ({ extensions = {} }) => extensions.code === 'UNAUTHENTICATED',
    );
    if (errors.length > 0) {
      // if user token is not valid then dispatch logout action which will navigate user to login page automatically
      store.dispatch(profileActions.logoutUser());
    }
  }
});

const link = ApolloLink.from([
  middlewareLink,
  responseMiddleware,
  onErrorLink,
  httpLink,
]);

const cache = new InMemoryCache().restore(
  (window as any).__APOLLO_STATE__ || {},
);

const persistor = new CachePersistor({
  cache,
  storage: window.localStorage,
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only' as FetchPolicy,
    errorPolicy: 'all' as ErrorPolicy,
  },
  query: {
    fetchPolicy: 'network-only' as FetchPolicy,
    errorPolicy: 'all' as ErrorPolicy,
  },
  mutate: {
    errorPolicy: 'all' as ErrorPolicy,
  },
};

const client = new ApolloClient({
  link,
  cache,
  defaultOptions,
});

const clearStore = () => {
  persistor.pause(); // Pause automatic persistence.
  persistor.purge(); // Delete everything in the storage provider.
  client.resetStore();
  persistor.resume();
};

export { client, persistor, clearStore };
