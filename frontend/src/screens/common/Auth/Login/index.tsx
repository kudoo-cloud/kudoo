import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import {
  ErrorBoundary,
  ToggleButton,
  Button,
  withStyles,
  helpers as utils,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import ProfileActions from '@client/store/actions/profile';
import { withLogin, withRegister } from '@kudoo/graphql';
import { clearStore } from '@client/helpers/apollo'; // eslint-disable-line
import styles from './styles';
import { InjectedConnector } from '@web3-react/injected-connector';
import {
  AVALANCHE_MAINNET_PARAMS,
  AVALANCHE_TESTNET_PARAMS,
} from '@client/helpers/constants';

interface ILoginParams {
  email: string;
  password: string;
}

type RegisterParams = ILoginParams & {
  firstName: string;
  lastName: string;
  passwordRepeat: string;
  baseURL: string;
};

interface IProps {
  actions: any;
  profile: any;
  app: any;
  history: any;
  classes: any;
  theme: any;
  login: (params: ILoginParams) => any;
  register: (params: RegisterParams) => any;
}
interface IState {
  activeForm: number;
  isFormSubmitting: boolean;
}

class Login extends React.Component<IProps, IState> {
  public state: any = {
    activeForm: 0,
    isFormSubmitting: false,
  };

  public componentDidMount() {
    const { profile } = this.props;
    if (!profile.isLoggedIn) {
      // console.log('====================clear store===================');
      setTimeout(clearStore);
    }
    this._observeRoute();
  }

  public componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.activeForm === 0 && utils.isURLMatching(URL.SIGNUP())) ||
      (this.state.activeForm === 1 && utils.isURLMatching(URL.LOGIN()))
    ) {
      this._observeRoute();
    }
  }

  public _observeRoute = () => {
    if (utils.isURLMatching(URL.LOGIN())) {
      this._changeForm(0);
    } else if (utils.isURLMatching(URL.SIGNUP())) {
      this._changeForm(1);
    }
  };

  public _changeForm = (index: number) => {
    this.setState({
      activeForm: index,
    });
  };

  public _navigate = index => {
    if (index === 0) {
      this.props.history.push(URL.LOGIN());
    } else if (index === 1) {
      this.props.history.push(URL.SIGNUP());
    }
  };

  public connectWallet = async () => {
    const useTestNet = process.env.USE_AVALANCHE_TESTNET === 'true';
    const injected = new InjectedConnector({});
    try {
      this.setState({ isFormSubmitting: true });
      const provider = await injected.getProvider();
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          useTestNet ? AVALANCHE_TESTNET_PARAMS : AVALANCHE_MAINNET_PARAMS,
        ],
      });
      await provider.request({
        method: 'eth_requestAccounts',
      });
      this.props.actions.setUserData({
        isLoggedIn: true,
      });
      this.setState({ isFormSubmitting: false });
    } catch (error) {
      console.log(error);
      this.setState({ isFormSubmitting: false });
    }
  };

  public _renderLoginForm() {
    const { classes, theme } = this.props;
    const isMetamaskInstalled = (window as any).ethereum;
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={() => {
          this.connectWallet();
        }}>
        {({ handleSubmit }) => (
          <form
            className={classes.form}
            autoComplete='off'
            onSubmit={handleSubmit}>
            <Button
              type='submit'
              classes={{ component: classes.submitBtn }}
              title={
                isMetamaskInstalled
                  ? 'Login with Metamask'
                  : 'Please install metamask'
              }
              buttonColor={theme.palette.primary.color2}
              applyBorderRadius
              id='login_button'
              loading={this.state.isFormSubmitting}
              isDisabled={!isMetamaskInstalled}
            />
          </form>
        )}
      </Formik>
    );
  }

  public _renderSignupForm() {
    const { classes, theme } = this.props;
    const isMetamaskInstalled = (window as any).ethereum;
    return (
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          reTypePassword: '',
          tocCheckbox: false,
        }}
        onSubmit={this.connectWallet}>
        {({ handleSubmit }: any) => {
          return (
            <form
              className={classes.form}
              autoComplete='off'
              onSubmit={handleSubmit}>
              <Button
                type='submit'
                classes={{ component: classes.submitBtn }}
                buttonColor={theme.palette.primary.color2}
                title={
                  isMetamaskInstalled
                    ? 'Signup with Metamask'
                    : 'Please install metamask'
                }
                applyBorderRadius
                id='signup_button'
                loading={this.state.isFormSubmitting}
                isDisabled={!isMetamaskInstalled}
              />
            </form>
          );
        }}
      </Formik>
    );
  }

  public render() {
    const { activeForm } = this.state;
    const { classes } = this.props;
    const isLoggedIn = idx(this.props, _ => _.profile.isLoggedIn);
    if (isLoggedIn) {
      return <Redirect to={URL.DASHBOARD()} />;
    }
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <div className={classes.title}>
            <a href='https://kudoo.io/'>
              <img
                src={require('images/logo512px.png')}
                alt='Kudoo'
                style={{ maxWidth: '160px' }}
              />
            </a>
          </div>
          {/* Segment */}
          <Grid container justify={'center'}>
            <Grid item xs={12}>
              <ToggleButton
                labels={['Sign In', 'Create Account']}
                selectedIndex={this.state.activeForm}
                classes={{
                  component: classes.toggleButtonWrapper,
                }}
                activeColor={'#2bc88f'}
                onChange={(label, index) => {
                  this._navigate(index);
                }}
              />
            </Grid>
          </Grid>
          {/* Login/Signup */}
          <Grid container justify={'center'}>
            <Grid
              item
              xs={12}
              classes={activeForm === 1 ? { item: classes.hideForm } : {}}>
              {this._renderLoginForm()}
            </Grid>
            <Grid
              item
              xs={12}
              classes={activeForm === 0 ? { item: classes.hideForm } : {}}>
              {this._renderSignupForm()}
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    (state: any) => ({
      profile: state.profile,
      app: state.app,
    }),
    dispatch => {
      return {
        actions: bindActionCreators({ ...ProfileActions }, dispatch),
      };
    }
  ),
  withLogin(),
  withRegister()
)(Login as any);
