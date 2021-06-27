import {
  Button,
  // ErrorBoundary,
  TextField,
  helpers as utils,
  withStyles,
} from '@kudoo/components';
import { I18n } from '@lingui/core';
import { withI18n } from '@lingui/react';
// import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
// import idx from 'idx';
import get from 'lodash/get';
import queryString from 'query-string';
import React, { Component } from 'react';
import { compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import * as Yup from 'yup';
// import URL from 'src/helpers/urls';
import ComingSoon from 'src/screens/common/ComingSoon';
import ProfileActions from 'src/store/actions/profile';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  i18n: I18n;
  history: any;
  actions: any;
  profile: Object;
  login: Function;
  register: Function;
  client: any;
  classes: any;
  theme: any;
};

type State = {
  isFormSubmitting: boolean;
  loginError: string | null;
  signupError: string | null;
};
class Login extends Component<Props, State> {
  public static defaultProps = {
    login: () => {},
    register: () => {},
  };

  signupForm: any;

  state = {
    isFormSubmitting: false,
    loginError: null,
    signupError: null,
  };

  _getQuery() {
    return queryString.parse(get(this.props, 'location.search', ''));
  }

  _redirectTo() {
    return this._getQuery().redirect || 'https://kudoo.io';
  }

  _integrationType() {
    return this._getQuery().type;
  }

  _loginPress = async (email: string, password: string) => {
    try {
      this.setState({ isFormSubmitting: true });
      const res = await this.props.login(email, password);
      const parsesdRes = utils.handleMutationResponse(res, 'login');
      if (parsesdRes.success) {
        const data = parsesdRes.result;
        this.props.actions.setUserData({ ...data });
        // do `me` query to get user information
        // const me_res = await this.props.client.query({
        //   query: AccountQuery.me,
        //   fetchPolicy: 'network-only', // skip the cache
        // });
        // if (idx(me_res, (_) => _.data.me)) {
        //   const { id, ...rest } = idx(me_res, (_) => _.data.me.user) || {}; // eslint-disable-line
        //   this.props.actions.setUserData({
        //     ...rest,
        //     isLoggedIn: true,
        //   });
        //   setTimeout(() => {
        //     this.props.history.push(
        //       URL.INTEGRATION_CHOOSE_COMPANY({
        //         type: this._integrationType(),
        //       }) + `?redirect=${this._redirectTo()}`,
        //     );
        //   });
        // }
      } else {
        const msg = parsesdRes.error[0];
        this.setState({ loginError: msg, isFormSubmitting: false });
      }
    } catch (err) {
      console.error(err); // eslint-disable-line
      this.setState({ loginError: err.toString(), isFormSubmitting: false });
    }
  };

  _onCancelButtonClick = () => {
    // location.href = this._redirectTo();
  };

  _renderLoginForm() {
    const { i18n, classes, theme } = this.props;
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(i18n._(`Invalid email address`))
            .required(i18n._(`Email is required!`)),
          password: Yup.string()
            .min(4)
            .required(i18n._(`Password is required!`)),
        })}
        onSubmit={(values) => {
          this._loginPress(values.email, values.password);
        }}
      >
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
            onSubmit={handleSubmit}
          >
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
              <div className={classes.formErrorText}>
                {this.state.loginError}
              </div>
            )}
            <Button
              applyBorderRadius
              buttonColor={theme.palette.primary.color2}
              classes={{ component: classes.submitBtn }}
              id='login_button'
              loading={this.state.isFormSubmitting}
              title='Sign in'
              type='submit'
            />
            <Button
              applyBorderRadius
              buttonColor={theme.palette.primary.color1}
              classes={{ component: classes.submitBtn }}
              id='cansel_button'
              loading={this.state.isFormSubmitting}
              onClick={this._onCancelButtonClick}
              title='Cancel'
              type='button'
            />
          </form>
        )}
      </Formik>
    );
  }

  render() {
    const { classes } = this.props;
    return <ComingSoon classes={{ imageSize: classes.comingSoonImageSize }} />;
    // if (get(profile, 'isLoggedIn')) {
    //   return (
    //     <Redirect
    //       from={URL.INTEGRATION_LOGIN({ path: true })}
    //       to={
    //         URL.INTEGRATION_CHOOSE_COMPANY({
    //           type: this._integrationType(),
    //         }) + `?redirect=${this._redirectTo()}`
    //       }
    //     />
    //   );
    // }
    // return (
    //   <ErrorBoundary>
    //     <div className={classes.page}>
    //       <Trans>
    //         <div className={classes.title}>Welcome to Kudoo</div>
    //       </Trans>
    //       <Grid container justify={'center'}>
    //         {this._renderLoginForm()}
    //       </Grid>
    //     </div>
    //   </ErrorBoundary>
    // );
  }
}

export default compose(
  withI18n(),
  withStyles(styles),
  withApollo,
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
    }),
    (dispatch) => {
      return {
        actions: bindActionCreators({ ...ProfileActions }, dispatch),
      };
    },
  ),
  // graphql(AccountQuery.login, {
  //   props: ({ mutate }) => ({
  //     login: (email, password) => mutate({ variables: { email, password } }),
  //   }),
  // }),
)(Login);
