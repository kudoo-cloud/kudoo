import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Portal } from 'react-portal';
import { compose } from 'recompose';
import * as queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as Yup from 'yup';
import idx from 'idx';
import get from 'lodash/get';
import cx from 'classnames';
import {
  ErrorBoundary,
  Checkbox,
  TextField,
  ToggleButton,
  Button,
  withStyles,
  TermsOfService,
  withStylesProps,
  withRouterProps,
  helpers as utils,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import ProfileActions from '@client/store/actions/profile';
import { withLogin, withRegister } from '@kudoo/graphql';
import { clearStore } from '@client/helpers/apollo'; // eslint-disable-line
import styles from './styles';

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
  loginError: string | null;
  signupError: string | null;
  shouldShowTOSModal: boolean;
}

class Login extends React.Component<IProps, IState> {
  public state: any = {
    activeForm: 0,
    isFormSubmitting: false,
    loginError: null,
    signupError: null,
    shouldShowTOSModal: false,
  };

  public componentDidMount() {
    const { profile } = this.props;
    if (!profile.isLoggedIn) {
      console.log('====================clear store===================');
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

  public _loginPress = async (email: string, password: string) => {
    try {
      const query = queryString.parse(get(this.props, 'location.search', ''));
      this.setState({ isFormSubmitting: true });
      const res = await this.props.login({ email, password });
      if (res.success) {
        const data = res.result;
        this.props.actions.setUserData({
          ...data,
          isLoggedIn: true,
        });
        setTimeout(() => {
          if (query.redirect) {
            this.props.history.replace(query.redirect);
          } else {
            this.props.history.replace(URL.DASHBOARD());
          }
        });
      } else {
        const msg = res.error[0];
        this.setState({ loginError: msg, isFormSubmitting: false });
      }
    } catch (err) {
      console.error(err); // eslint-disable-line
      this.setState({ loginError: err.toString(), isFormSubmitting: false });
    }
  };

  public _signupPress = async values => {
    try {
      const { firstName, lastName, password, reTypePassword, email } = values;
      this.setState({ isFormSubmitting: true });
      const res = await this.props.register({
        email,
        firstName,
        lastName,
        password,
        passwordRepeat: reTypePassword,
        baseURL: `${window.location.origin}/#/`,
      });
      if (res.success) {
        this.props.history.replace(URL.CONFIRM_EMAIL());
      } else {
        const msg = res.error[0];
        this.setState({ signupError: msg, isFormSubmitting: false });
      }
    } catch (err) {
      console.error(err); // eslint-disable-line
      this.setState({ signupError: err.toString(), isFormSubmitting: false });
    }
  };

  public _renderLoginForm() {
    const { classes, theme } = this.props;
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(`Invalid email address`)
            .required(`Email is required!`),
          password: Yup.string()
            .min(4)
            .required(`Password is required!`),
        })}
        onSubmit={(values: any) => {
          this._loginPress(values.email, values.password);
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form
            className={classes.form}
            autoComplete='off'
            onSubmit={handleSubmit}>
            <TextField
              applyTopBorderRadius
              type='email'
              name='email'
              id='login_email'
              placeholder='Email'
              icon={
                touched.email && errors.email ? (
                  <i className='icon icon-message' />
                ) : (
                  <i
                    className={cx('icon icon-message', classes.greenTextColor)}
                  />
                )
              }
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='off'
              error={touched.email && errors.email}
              showErrorMessage={false}
            />
            <TextField
              applyBottomBorderRadius
              type='password'
              name='password'
              id='login_password'
              icon={
                touched.password && errors.password ? (
                  <i className='icon icon-password' />
                ) : (
                  <i
                    className={cx('icon icon-password', classes.greenTextColor)}
                  />
                )
              }
              placeholder='Password'
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete='off'
              error={touched.password && errors.password}
              showErrorMessage={false}
            />
            {Boolean(this.state.loginError) && (
              <div className={classes.formErrorText} id='login_error'>
                {this.state.loginError}
              </div>
            )}
            <Link
              to={URL.RESET_PASSWORD()}
              className={classes.forgotPasswordText}>
              Forgot Password?
            </Link>
            <Button
              type='submit'
              classes={{ component: classes.submitBtn }}
              title='Sign In'
              buttonColor={theme.palette.primary.color2}
              applyBorderRadius
              id='login_button'
              loading={this.state.isFormSubmitting}
            />
          </form>
        )}
      </Formik>
    );
  }

  public _renderSignupForm() {
    const { classes, theme } = this.props;
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
        validationSchema={Yup.object().shape({
          firstName: Yup.string()
            .min(2, `Firstname is too short`)
            .required(`First Name is required!`),
          lastName: Yup.string().required(`Last Name is required!`),
          email: Yup.string()
            .email(`Invalid email address`)
            .required(`Email is required!`),
          password: Yup.string()
            .min(4, `Password should be atleast 4 characters`)
            .required(`Password is required!`),
          reTypePassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords do not match')
            .required('Retype your Password!'),
          tocCheckbox: Yup.boolean().oneOf(
            [true],
            `Please read our terms & conditions and agree in order to create your account`
          ),
        })}
        onSubmit={this._signupPress}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }: any) => {
          return (
            <form
              className={classes.form}
              autoComplete='off'
              onSubmit={handleSubmit}>
              <TextField
                applyTopBorderRadius
                type='text'
                name='firstName'
                id='signup_firstName'
                placeholder='First Name'
                icon={
                  touched.firstName && errors.firstName ? (
                    <i className='icon icon-user-account' />
                  ) : (
                    <i
                      className={cx(
                        'icon icon-user-account',
                        classes.greenTextColor
                      )}
                    />
                  )
                }
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && errors.firstName}
                showErrorMessage={false}
              />
              <TextField
                type='text'
                noBorderRadius={true}
                name='lastName'
                id='signup_lastName'
                placeholder='Last Name'
                icon={
                  touched.lastName && errors.lastName ? (
                    <i className='icon icon-user-account' />
                  ) : (
                    <i
                      className={cx(
                        'icon icon-user-account',
                        classes.greenTextColor
                      )}
                    />
                  )
                }
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && errors.lastName}
                showErrorMessage={false}
              />
              <TextField
                type='email'
                noBorderRadius={true}
                name='email'
                id='signup_email'
                placeholder='Email'
                icon={
                  touched.email && errors.email ? (
                    <i className='icon icon-message' />
                  ) : (
                    <i
                      className={cx(
                        'icon icon-message',
                        classes.greenTextColor
                      )}
                    />
                  )
                }
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                showErrorMessage={false}
              />
              <TextField
                type='password'
                noBorderRadius={true}
                name='password'
                id='signup_password'
                icon={
                  touched.password && errors.password ? (
                    <i className='icon icon-password' />
                  ) : (
                    <i
                      className={cx(
                        'icon icon-password',
                        classes.greenTextColor
                      )}
                    />
                  )
                }
                placeholder='Password'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                showErrorMessage={false}
              />
              <TextField
                applyBottomBorderRadius
                type='password'
                name='reTypePassword'
                id='signup_reTypePassword'
                icon={
                  touched.reTypePassword && errors.reTypePassword ? (
                    <i className='icon icon-password' />
                  ) : (
                    <i
                      className={cx(
                        'icon icon-password',
                        classes.greenTextColor
                      )}
                    />
                  )
                }
                placeholder='Re-Type Password'
                value={values.reTypePassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.reTypePassword && errors.reTypePassword}
                showErrorMessage={false}
              />
              <Checkbox
                value={values.tocCheckbox}
                onChange={value => {
                  setFieldValue('tocCheckbox', value);
                }}
                id='terms-condition'
                label={
                  <span>
                    I agree to{' '}
                    <span
                      className={classes.tocLink}
                      onClick={() => {
                        this.setState({ shouldShowTOSModal: true });
                      }}>
                      Terms & Conditions
                    </span>
                  </span>
                }
                classes={{
                  label: classes.tocCheckboxText,
                  component: classes.tocCheckboxWrapper,
                }}
                error={errors.tocCheckbox}
              />
              {Boolean(this.state.signupError) && (
                <div className={classes.formErrorText}>
                  {this.state.signupError}
                </div>
              )}
              <Button
                type='submit'
                classes={{ component: classes.submitBtn }}
                buttonColor={theme.palette.primary.color2}
                title='Create an account'
                applyBorderRadius
                id='signup_button'
                loading={this.state.isFormSubmitting}
              />
            </form>
          );
        }}
      </Formik>
    );
  }

  public _renderTOSModal() {
    const { classes } = this.props;
    return (
      <Portal>
        <div className={classes.tosModalWrapper}>
          <div className={classes.tosModal}>
            <div className={classes.tosModalHeader}>
              <span>Terms & Conditions</span>
              <i
                className='fa fa-times close-icon'
                onClick={() => {
                  this.setState({ shouldShowTOSModal: false });
                }}
              />
            </div>
            <div className={classes.tosModalContent}>
              <TermsOfService />
            </div>
          </div>
        </div>
      </Portal>
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
          {this.state.shouldShowTOSModal && this._renderTOSModal()}
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
