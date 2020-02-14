import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'normalize.css';
import '@kudoo/components/build/config/theme/css/index.scss';
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datasheet/lib/react-datasheet.css';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { StripeProvider } from 'react-stripe-elements';
import { HashRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider, connect } from 'react-redux';
import { compose } from 'recompose';
import { PersistGate } from 'redux-persist/lib/integration/react';
import App from '@client/common_screens/App';
import { I18nLoader } from '@kudoo/components';
import { client } from '@client/helpers/apollo';
import { KudooThemeProvider, theme } from '@kudoo/components';
import { store, persistor } from '@client/store/index';
import { jss, JssProvider } from 'react-jss';
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

moment.locale('en-us', {
  week: {
    dow: 1, // Monday is the first day of the week.
  },
} as any);

class WebApp extends React.Component<any, {}> {
  public render() {
    const { tempActiveLanguage, activeLanguage } = this.props;
    return (
      // <React.StrictMode>
      <I18nLoader language={tempActiveLanguage || activeLanguage}>
        <Router>
          <App />
        </Router>
      </I18nLoader>
      // </React.StrictMode>
    );
  }
}

const EnhancedWebApp = compose(
  connect((state: any) => {
    return {
      activeLanguage: state.app.activeLanguage,
      tempActiveLanguage: state.app.tempActiveLanguage,
    };
  })
)(WebApp);

const root = document.getElementById('root');

if (root !== null) {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <JssProvider jss={jss}>
            <StripeProvider apiKey={process.env.STRIPE_API_KEY}>
              <KudooThemeProvider theme={theme}>
                <EnhancedWebApp />
              </KudooThemeProvider>
            </StripeProvider>
          </JssProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>,
    root
  );
}
