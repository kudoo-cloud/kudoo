import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { compose } from 'recompose';
import * as queryString from 'query-string';
import get from 'lodash/get';
import {
  ErrorBoundary,
  Button,
  TextField,
  withRouterProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import { showToast } from '@client/helpers/toast';
import { withResetPassword } from '@kudoo/graphql';
import './index.scss';

interface IProps {
  actions: any;
  history: any;
  match: any;
  resetPassword: (params: { password: string; passwordRepeat: string }) => any;
}
interface IState {
  token: any;
}

class NewPassword extends React.Component<IProps, IState> {
  public state = {
    token: '',
  };

  public componentDidMount() {
    const { token } = queryString.parse(get(this.props, 'location.search', ''));
    const status = get(this.props, 'match.params.status', '');
    if (status === 'success') {
      this.setState({ token });
      this.props.actions.setOnlyToken(token);
    }
  }

  public _resetPassword = async (values, actions) => {
    try {
      const res = await this.props.resetPassword({
        password: values.password,
        passwordRepeat: values.reTypePassword,
      });
      actions.setSubmitting(false);
      if (res.success) {
        this.props.actions.resetUserData();
        this.props.history.push(URL.LOGIN());
      } else {
        res.error.map(err => showToast(err));
      }
    } catch (e) {
      actions.setSubmitting(false);
      console.error(e); // eslint-disable-line
    }
  };

  public _renderSuccess = () => {
    return (
      <React.Fragment>
        <div className='title'>Choose a new password</div>
        <Grid container justify={'center'}>
          <Grid item xs={12}>
            <div className='middle-container'>
              <img
                className='mail-sent-icon'
                src={require('images/pass-code-icon.png')}
              />
              <div className='message-wrapper'>
                <div className='message-title'>Type a new password below</div>
                <div className='message-desc'>
                  Please choose a password which is different to any previous
                  used passwords.
                </div>
              </div>
              <Formik
                initialValues={{
                  password: '',
                  reTypePassword: '',
                }}
                validationSchema={Yup.object().shape({
                  password: Yup.string()
                    .min(4, `Password should be atleast 4 characters`)
                    .required(`Password is required!`),
                  reTypePassword: Yup.string()
                    .oneOf([Yup.ref('password')], 'Passwords do not match')
                    .required(`Retype your Password!`),
                })}
                onSubmit={this._resetPassword}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }: any) => (
                  <form
                    className='form'
                    autoComplete='off'
                    onSubmit={handleSubmit}>
                    <TextField
                      type='password'
                      name='password'
                      id='password'
                      icon={
                        touched.password && errors.password ? (
                          <i className='icon icon-password' />
                        ) : (
                          <i className='icon icon-password green-text-color' />
                        )
                      }
                      placeholder='Password'
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      classes={{
                        component: 'input-wrapper',
                      }}
                      error={touched.password && errors.password}
                    />
                    <TextField
                      type='password'
                      name='reTypePassword'
                      id='reTypePassword'
                      icon={
                        touched.reTypePassword && errors.reTypePassword ? (
                          <i className='icon icon-password' />
                        ) : (
                          <i className='icon icon-password green-text-color' />
                        )
                      }
                      placeholder='Re-Type Password'
                      value={values.reTypePassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      classes={{
                        component: 'input-wrapper',
                      }}
                      error={touched.reTypePassword && errors.reTypePassword}
                    />
                    <Button
                      type='submit'
                      classes={{ component: 'submit-btn' }}
                      isDisabled={isSubmitting}
                      title='Save my new password'
                      applyBorderRadius
                      iconAfter={
                        isSubmitting ? (
                          <i className='fa fa-pulse fa-spinner' />
                        ) : null
                      }
                    />
                  </form>
                )}
              </Formik>
              <Button
                href='/login'
                classes={{ text: 'signin-btn-text' }}
                width='100%'
                title='Back to sign in'
                buttonColor='transparent'
                applyBorderRadius
                target='_self'
              />
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  public _renderError = () => {
    const { message } = queryString.parse(
      get(this.props, 'location.search', '')
    );
    return (
      <React.Fragment>
        <div className='title'>{message || 'Link is not valid'}</div>
      </React.Fragment>
    );
  };

  public render() {
    const { match } = this.props;
    const { token } = this.state;
    const status = get(match, 'params.status', '');
    return (
      <ErrorBoundary>
        <div className='new-password-page'>
          {status === 'success' && token
            ? this._renderSuccess()
            : this._renderError()}
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose(withResetPassword())(NewPassword as any);
