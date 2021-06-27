import { Button, ErrorBoundary, TextField } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import './index.scss';

interface IProps {
  actions: any;
  history?: any;
  remember?: ({ email, baseURL }) => any;
  app?: any;
}

class ForgotPassword extends React.Component<IProps> {
  static defaultProps = {
    remember: () => ({}),
  };

  public _sendResetLink = async (values: any, actions: any) => {
    try {
      const res = await this.props.remember({
        email: values.email,
        baseURL: `${window.location.origin}/#/`,
      });
      if (res.success) {
        actions.setSubmitting(false);
        this.props.history.push(URL.RESET_PASSWORD_EMAIL());
      } else {
        actions.setSubmitting(false);
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      actions.setSubmitting(false);
      console.error(e); // eslint-disable-line
    }
  };

  public render() {
    return (
      <ErrorBoundary>
        <div className='forgot-password-page'>
          <div className='title'>Reset your password</div>
          {/* Login/Signup */}
          <Grid container justify={'center'}>
            <Grid item xs={12}>
              <div className='middle-container'>
                <img
                  className='mail-sent-icon'
                  src={require('@kudoo/components/build/assets/images/reset-password.png')}
                />
                <div className='message-wrapper'>
                  <div className='message-title'>
                    Can’t remember your password?
                  </div>
                  <div className='message-desc'>
                    Tell us your email address and we will send you a reset
                    link.
                  </div>
                </div>
                <Formik
                  initialValues={{
                    email: '',
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email(`Invalid email address`)
                      .required(`Email is required!`),
                  })}
                  onSubmit={this._sendResetLink}
                  render={({
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
                      onSubmit={handleSubmit}
                    >
                      <TextField
                        type='email'
                        name='email'
                        id='email'
                        placeholder='Email'
                        icon={
                          touched.email && errors.email ? (
                            <i className='icon icon-message' />
                          ) : (
                            <i className='icon icon-message green-text-color' />
                          )
                        }
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='off'
                        classes={{
                          component: 'email-input',
                        }}
                        error={touched.email && errors.email}
                      />
                      <Button
                        type='submit'
                        isDisabled={isSubmitting}
                        title='Send me a reset link'
                        applyBorderRadius
                        iconAfter={
                          isSubmitting ? (
                            <i className='fa fa-pulse fa-spinner' />
                          ) : null
                        }
                      />
                    </form>
                  )}
                />
                <Button
                  href='/login'
                  classes={{ text: 'signin-btn-text' }}
                  width='100%'
                  title='Back to sign in'
                  buttonColor='transparent'
                  applyBorderRadius
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<IProps, IProps>(
  connect((state: any) => ({
    app: state.app,
  })),
)(ForgotPassword as any);
