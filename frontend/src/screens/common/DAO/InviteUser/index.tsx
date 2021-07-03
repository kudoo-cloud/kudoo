import {
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router } from 'react-router';
import { Link } from 'react-router-dom';
import { Tooltip, Trigger } from 'react-tippy';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from 'src/screens/common/styles/styles';
import { IReduxState } from 'src/store/reducers';

interface IProps {
  actions: any;
  invite: (data: any) => any;
  app: any;
  classes: any;
  theme: any;
  match: any;
  history: any;
}

class InviteUser extends Component<IProps> {
  static defaultProps = {
    invite: () => ({}),
  };

  _renderSectionHeader() {
    const { classes } = this.props;
    return (
      <SectionHeader
        title='Invite a new user'
        subtitle={
          <div>
            <div>Enter the new user&rsquo;s details below.</div>
            <div>
              This user will receive an email with your request to add them to
              your DAO account.
            </div>
          </div>
        }
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  _renderInviteForm(formProps) {
    const {
      initialValues,
      values,
      setFieldValue,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
    } = formProps;
    const { classes, theme, match } = this.props;
    const daoId = idx(match, (_) => _.params.daoId);
    const isFormDirty = !isEqual(initialValues, values);
    return (
      <form
        autoComplete='off'
        className={classes.formWrapper}
        onSubmit={handleSubmit}
      >
        <div className={classes.form}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              {/* <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={'Name'}
                    placeholder={'E.g: John'}
                    name="firstName"
                    id="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={'Surname'}
                    placeholder={'E.g: Doe'}
                    name="lastName"
                    id="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && errors.lastName}
                  />
                </Grid>
              </Grid> */}
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={'Email'}
                    value={values.email}
                    placeholder={'E.g: john@doe.com'}
                    showClearIcon={false}
                    name='email'
                    id='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                  />
                </Grid>
              </Grid>
              {/* <Grid container>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label={'Job Title'}
                    placeholder={'E.g: Developer'}
                    showClearIcon={false}
                    name="jobTitle"
                    id="jobTitle"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.jobTitle && errors.jobTitle}
                  />
                </Grid>
              </Grid> */}
              <Grid container spacing={8}>
                <Grid item xs={12} sm={6}>
                  <Dropdown
                    id='user-role'
                    label='Role'
                    items={[
                      { label: 'Admin', value: 'ADMIN' },
                      { label: 'Owner', value: 'OWNER' },
                      { label: 'User', value: 'USER' },
                    ]}
                    onChange={({ value }) => {
                      setFieldValue('role', value);
                    }}
                  />
                </Grid>
                <Grid item sm={6} classes={{ item: classes.helpIconWrapper }}>
                  <Tooltip
                    interactive
                    html={
                      <div className={classes.tooltipContent}>
                        <div className={classes.tooltipText}>
                          User roles define the level of access to the User.
                        </div>
                        <Router {...this.props}>
                          <Link className={classes.tooltipLink} to={'#'}>
                            See User Roles
                          </Link>
                        </Router>
                      </div>
                    }
                    animation='fade'
                    position='right'
                    arrow
                    // arrowType={'round' as any}
                    trigger={'mouseenter focus' as Trigger}
                  >
                    <span className={classes.helpIcon}>
                      <i className='ion-ios-help-outline' />
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
              {/* <Grid container>
                <Grid item xs={12}>
                  <div className={classes.checkbox}>
                    <Checkbox
                      label="Make this user the primary account holder"
                      onChange={isChecked => {
                        setFieldValue('makePrimaryOwner', isChecked);
                      }}
                    />
                  </div>
                </Grid>
              </Grid> */}
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
            <Button
              title='Back to user list'
              href={URL.DAO_USERS({ daoId })}
              buttonColor={theme.palette.grey['200']}
              classes={{ text: classes.cancelButtonText }}
            />
          </Grid>
          {isFormDirty && (
            <Grid item xs={12} sm={6}>
              <Button
                id='submit-button'
                type='submit'
                title='Save new user'
                loading={isSubmitting}
                buttonColor={theme.palette.primary.color2}
              />
            </Grid>
          )}
        </Grid>
      </form>
    );
  }

  _renderFormik() {
    const { history, match } = this.props;
    const daoId = idx(match, (_) => _.params.daoId);
    return (
      <Formik
        initialValues={{
          // firstName: '',
          // lastName: '',
          email: '',
          // jobTitle: '',
          role: '',
          makePrimaryOwner: false,
        }}
        validationSchema={Yup.object().shape({
          // firstName: Yup.string().required(`Firstname is required!`),
          // lastName: Yup.string().required(`Lastname is required!`),
          // jobTitle: Yup.string().required(`Job Title is required!`),
          email: Yup.string()
            .email(`Invalid email address`)
            .required(`Email is required!`),
        })}
        onSubmit={async (values, actions) => {
          try {
            const res = await this.props.invite({
              email: values.email,
              role: values.role,
              baseURL: `${window.location.origin}/#/`,
            });
            actions.setSubmitting(false);
            if (res.success) {
              showToast(null, 'User Invited successfully');
              history.push(URL.DAO_USERS({ daoId }));
            } else {
              showToast('User is already in the DAO');
            }
          } catch (e) {
            actions.setSubmitting(false);
            showToast(e.toString());
          }
        }}
      >
        {this._renderInviteForm.bind(this)}
      </Formik>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>
          {this._renderSectionHeader()}
          {this._renderFormik()}
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<any, any>(
  withStyles(styles),
  connect((state: IReduxState) => ({
    app: state.app,
  })),
  // withInviteMember(),
)(InviteUser);
