import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as queryString from 'query-string';
import * as Yup from 'yup';
import { compose } from 'recompose';
import idx from 'idx';
import {
  withStyles,
  ErrorBoundary,
  Button,
  TextField,
  withRouterProps,
  withStylesProps,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import { showToast } from '@client/helpers/toast';
import { withUpdateUser } from '@kudoo/graphql';
import styles from './styles';

interface IUpdateUserParams {
  firstName: string;
  lastName: string;
  password: string;
  passwordRepeat: string;
}

interface IProps {
  actions: any;
  client: any;
  updateUser: (params: IUpdateUserParams) => any;
  location: any;
  history: any;
  classes: any;
}
interface IState {
  loading: boolean;
  updatingUser: boolean;
}

class InviteEmail extends React.Component<IProps, IState> {
  public state = {
    loading: false,
    updatingUser: false,
  };

  public componentDidMount() {
    // const search = idx(this.props, (_) => _.location.search);
    const search = this.props.location.search || '';
    const query = queryString.parse(search);
    if (query.token) {
      // token success
      this.props.actions.setOnlyToken(query.token);
      if (query.target_type !== 'update') {
        // if user is already have all details
        // then just need to redirect user to login page
        showToast(null, 'Invitation Accepted Successfully');
        this.props.history.replace(URL.LOGIN());
      }
    } else {
      // error, token expired or invalid
      this.props.actions.resetUserData();
    }
  }

  public _updateUser = async values => {
    try {
      this.setState({ updatingUser: true });
      const res = await this.props.updateUser({
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        passwordRepeat: values.passwordRepeat,
      });
      if (res.success) {
        showToast(null, 'Invitation Accepted');
        this.props.actions.resetUserData();
        this.setState({ updatingUser: false });
        this.props.history.replace(URL.LOGIN());
      } else {
        this.setState({ updatingUser: false });
        res.error.map(err => showToast(err.toString()));
      }
    } catch (e) {
      this.setState({ updatingUser: false });
      showToast(e.toString());
    }
  };

  public _renderFormContent({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  }) {
    const { classes } = this.props;
    return (
      <form className={classes.form}>
        <TextField
          label='Firstname'
          name='firstName'
          id='firstName'
          placeholder='Firstname'
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && errors.firstName}
        />
        <TextField
          label='Lastname'
          name='lastName'
          id='lastName'
          placeholder='Lastname'
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && errors.lastName}
        />
        <TextField
          type='password'
          label='Password'
          name='password'
          id='password'
          placeholder='Password'
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && errors.password}
        />
        <TextField
          type='password'
          label='Confirm Password'
          name='passwordRepeat'
          id='passwordRepeat'
          placeholder='Confirm Password'
          value={values.passwordRepeat}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.passwordRepeat && errors.passwordRepeat}
        />
        <Button
          isDisabled={this.state.updatingUser}
          title='Update'
          applyBorderRadius
          type='submit'
          iconAfter={
            this.state.updatingUser ? (
              <i className='fa fa-pulse fa-spinner' />
            ) : null
          }
          classes={{ component: classes.submitBtn }}
        />
      </form>
    );
  }

  public _renderForm() {
    const { classes } = this.props;
    return (
      <Grid item xs={12}>
        <div className={classes.middleContainer}>
          <img
            className={classes.mailSentIcon}
            src={require('images/reset-password.png')}
          />
          <div className={classes.messageWrapper}>
            <div className={classes.messageTitle}>Invited</div>
            <div className={classes.messageDesc}>Update your details</div>
          </div>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              password: '',
              passwordRepeat: '',
            }}
            validationSchema={Yup.object().shape({
              firstName: Yup.string().required(`Firstname is required!`),
              lastName: Yup.string().required(`Lastname is required!`),
              password: Yup.string().required(`Password is required!`),
              passwordRepeat: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password does not match')
                .required('Confirm Password is required!'),
            })}
            onSubmit={this._updateUser}>
            {this._renderFormContent.bind(this)}
          </Formik>
        </div>
      </Grid>
    );
  }

  public render() {
    const {
      classes,
      location: { search = '' },
    } = this.props;
    // const search = idx(this.props, (_) => _.location.search);
    const query = queryString.parse(search);
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          <Grid container justify={'center'}>
            {query.target_type === 'update' && this._renderForm()}
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withStyles(styles),
  withUpdateUser()
)(InviteEmail as any);
