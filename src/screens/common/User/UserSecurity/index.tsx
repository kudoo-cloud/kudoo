import {
  Button,
  ErrorBoundary,
  Modal,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
import * as React from 'react';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import styles from './styles';

interface IProps {
  actions?: object;
  updatePassword?: (data: object) => any;
  classes?: any;
  theme?: any;
}
interface IState {
  updatePasswordModalVisible: boolean;
}

class UserSecurity extends React.Component<IProps, IState> {
  static defaultProps = {
    updatePassword: () => ({}),
  };

  public state = {
    updatePasswordModalVisible: false,
  };

  public _openUpdatePasswordModal = () => {
    this.setState({
      updatePasswordModalVisible: true,
    });
  };

  public _closeUpdatePasswordModal = () => {
    this.setState({
      updatePasswordModalVisible: false,
    });
  };

  public _updatePassword = async (values, actions) => {
    try {
      const res = await this.props.updatePassword({
        oldPassword: values.oldPassword,
        password: values.password,
        passwordRepeat: values.passwordRepeat,
      });
      actions.setSubmitting(false);
      if (res.success) {
        showToast(null, 'Password updated successfully!');
        this._closeUpdatePasswordModal();
      } else {
        res.error.map((err) => showToast(err, ''));
      }
    } catch (e) {
      actions.setSubmitting(false);
      showToast(e.toString(), '');
    }
  };

  public _renderUpdatePasswordModal() {
    const { theme, classes } = this.props;
    const { updatePasswordModalVisible } = this.state;
    return (
      <Modal
        visible={updatePasswordModalVisible}
        onClose={this._closeUpdatePasswordModal}
        classes={{ description: classes.updatePwdModalDescription }}
        description={
          <Formik
            initialValues={{
              oldPassword: '',
              password: '',
              passwordRepeat: '',
            }}
            validationSchema={Yup.object({
              oldPassword: Yup.string().required('Old Password is required'),
              password: Yup.string().required('New Password is required'),
              passwordRepeat: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords do not match')
                .required('Repeat New Password is required'),
            })}
            onSubmit={this._updatePassword}
          >
            {(formProps: any) => {
              const { values, touched, errors } = formProps;
              return (
                <form
                  className={classes.form}
                  onSubmit={formProps.handleSubmit}
                >
                  <div className={classes.formFields}>
                    <div>
                      <TextField
                        id='oldPassword'
                        name='oldPassword'
                        label='Old password'
                        type='password'
                        placeholder={'*******'}
                        value={values.oldPassword}
                        error={touched.oldPassword && errors.oldPassword}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                      />
                    </div>
                    <div>
                      <TextField
                        id='password'
                        name='password'
                        label='New password'
                        type='password'
                        placeholder={'*******'}
                        value={values.password}
                        error={touched.password && errors.password}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                      />
                    </div>
                    <div>
                      <TextField
                        id='passwordRepeat'
                        name='passwordRepeat'
                        label='Repeat new password'
                        type='password'
                        placeholder={'*******'}
                        value={values.passwordRepeat}
                        error={touched.passwordRepeat && errors.passwordRepeat}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                      />
                    </div>
                  </div>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <Button
                        title='Cancel'
                        buttonColor={theme.palette.grey['200']}
                        classes={{ text: classes.cancelButtonText }}
                        onClick={this._closeUpdatePasswordModal}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        id='update-password-submit'
                        title='Update'
                        buttonColor={theme.palette.primary.color2}
                        type='submit'
                        loading={formProps.isSubmitting}
                      />
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        }
      />
    );
  }

  public _renderFormSection() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <SectionHeader
          title='Security'
          classes={{ component: classes.sectionHeading }}
        />
        <Grid container>
          <Grid item xs={12} sm={5}>
            <form className={classes.formWrapper}>
              <div className={cx(classes.fieldRow)}>
                <TextField
                  label='Password'
                  type='password'
                  placeholder={'*******'}
                  disabled
                  isReadOnly
                  extraLinkWithLabel={'Change'}
                  onExtraLinkClicked={this._openUpdatePasswordModal}
                />
              </div>
              {/*<div className={cx(classes.fieldRow)}>*/}
              {/*<ToggleSwitch label={'Two step account authentication'} />*/}
              {/*</div>*/}
              {/*<div className={classes.fieldRow}>*/}
              {/*<TextField*/}
              {/*label="Linked accounts"*/}
              {/*extraLinkWithLabel={'Remove'}*/}
              {/*disabled*/}
              {/*isReadOnly*/}
              {/*placeholder={'johndoe@gmail.com'}*/}
              {/*/>*/}
              {/*<div className={classes.fieldSideText}>Google account</div>*/}
              {/*</div>*/}
              {/*<div className={classes.fieldRow}>*/}
              {/*<TextField*/}
              {/*label="Account activity"*/}
              {/*extraLinkWithLabel={'View History'}*/}
              {/*disabled*/}
              {/*isReadOnly*/}
              {/*placeholder={'Yesterday 12/03/2018 13:00'}*/}
              {/*onExtraLinkClicked={() => {*/}
              {/*history.push(URL.ACCOUNT_USER_HISTORY());*/}
              {/*}}*/}
              {/*/>*/}
              {/*<div className={classes.fieldSideText}>Last Login</div>*/}
              {/*</div>*/}
            </form>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          {this._renderFormSection()}
          {this._renderUpdatePasswordModal()}
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<IProps, IProps>(
  withStyles(styles),
  // withUpdateUser(() => ({ name: 'updatePassword' })),
)(UserSecurity as any);
