import 'normalize.css';
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datasheet/lib/react-datasheet.css';
import '@kudoo/components/build/config/theme/css/index.scss';
import { ApolloProvider } from '@apollo/client';
import { I18nLoader, KudooThemeProvider, theme } from '@kudoo/components';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Web3ReactProvider } from '@web3-react/core';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { JssProvider, jss } from 'react-jss';
import { Provider, useSelector } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { StripeProvider } from 'react-stripe-elements';
import { PersistGate } from 'redux-persist/integration/react';
import Web3 from 'web3';
import { client } from 'src/helpers/apollo';
import App from 'src/screens/common/App';
import { persistor, store } from 'src/store';
import { IReduxState } from './store/reducers';

(jss as any).options.insertionPoint = document.getElementById(
  'jss-insertion-point',
);

moment.locale('en-us', {
  week: {
    dow: 1, // Monday is the first day of the week.
  },
} as any);

const getWeb3Library = (provider) => {
  return new Web3(provider); // this will vary according to whether you use e.g. ethers or web3.js
};

const MainApp = () => {
  const activeLanguage = useSelector(
    (state: IReduxState) => state?.app?.activeLanguage,
  );
  const tempActiveLanguage = useSelector(
    (state: IReduxState) => state?.app?.tempActiveLanguage,
  );
  return (
    <I18nLoader language={tempActiveLanguage || activeLanguage}>
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          {/* TODO: till we find solution, This is dummy material ui button, so material button styles got loaded earlier, otherwise its breaking style of shared component button */}
          <ButtonBase style={{ display: 'none' }} />
          <App />
        </React.Suspense>
      </Router>
    </I18nLoader>
  );
};

const WebApp: React.FC<Record<string, unknown>> = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <JssProvider jss={jss}>
            <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
              <KudooThemeProvider theme={theme}>
                <Web3ReactProvider getLibrary={getWeb3Library}>
                  <MainApp />
                </Web3ReactProvider>
              </KudooThemeProvider>
            </StripeProvider>
          </JssProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

const root = document.getElementById('root');

if (root !== null) {
  ReactDOM.render(<WebApp />, root);
}
