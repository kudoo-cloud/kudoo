import {
  Button,
  ErrorBoundary,
  PhoneNumberField,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
import get from 'lodash/get';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as Yup from 'yup';

import { showToast } from 'src/helpers/toast';
import styles from './styles';

interface IProps {
  actions?: any;
  profile?: object;
  updateAccount?: (data: object) => any;
  classes?: any;
  theme?: any;
}

class UserDetails extends React.Component<IProps, {}> {
  static defaultProps = {
    updateAccount: () => ({}),
  };

  public _renderForm = (formProps: any) => {
    const { values, errors, touched, handleChange, handleBlur, dirty } =
      formProps;
    const { classes, theme } = this.props;
    return (
      <form
        className={classes.formWrapper}
        autoComplete='off'
        onSubmit={formProps.handleSubmit}
      >
        <div className={classes.formFields}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <SectionHeader
                title='Basic Details'
                classes={{ component: classes.sectionHeading }}
              />
              <div className={cx(classes.fieldRow, classes.halfFieldWrapper)}>
                <TextField
                  label='Name'
                  value={values.firstName}
                  classes={{
                    component: classes.leftInput,
                  }}
                  id='firstName'
                  name='firstName'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && errors.firstName}
                />
                <TextField
                  label='Surname'
                  value={values.lastName}
                  id='lastName'
                  name='lastName'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && errors.lastName}
                />
              </div>
              <div className={classes.fieldRow}>
                <TextField
                  label='Job Title'
                  placeholder={'Job Title'}
                  value={values.jobTitle || ''}
                  id='jobTitle'
                  name='jobTitle'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.jobTitle && errors.jobTitle}
                />
              </div>
              <SectionHeader
                title='Contact Details'
                classes={{ component: classes.sectionHeading }}
              />
              <div className={classes.fieldRow}>
                <PhoneNumberField
                  areaCodeFieldName='contactNumber.countryCode'
                  phoneNumberFieldName='contactNumber.nationalNumber'
                  areaCodeLabel='Area Code'
                  phoneNumberLabel={'Mobile Number'}
                  showClearIcon={false}
                />
              </div>
              <div className={classes.fieldRow}>
                <TextField
                  label='Email'
                  placeholder={'Email'}
                  value={values.email || ''}
                  isReadOnly
                  showClearIcon={false}
                />
              </div>
              <div className={classes.fieldRow}>
                <TextField
                  label='Telegram ID'
                  placeholder={'@telegram'}
                  value={values.email || ''}
                  isReadOnly
                  showClearIcon={false}
                />
              </div>
              <div className={classes.fieldRow}>
                <TextField
                  label='Discord Username'
                  placeholder={'discord#1234'}
                  value={values.email || ''}
                  isReadOnly
                  showClearIcon={false}
                />
              </div>
            </Grid>
          </Grid>
        </div>

        {dirty && (
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Button
                title='Save'
                loading={formProps.isSubmitting}
                buttonColor={theme.palette.primary.color2}
                type='submit'
              />
            </Grid>
          </Grid>
        )}
      </form>
    );
  };

  public _renderFormSection() {
    const { profile } = this.props;
    const user: any = profile || {};
    return (
      <Formik
        enableReinitialize
        initialValues={{
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          jobTitle: user.jobTitle || '',
          email: user.email || '',
          contactNumber: {
            countryCode: get(user, 'contactNumber.countryCode'),
            nationalNumber: get(user, 'contactNumber.nationalNumber'),
          },
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('Firstname is required'),
          lastName: Yup.string().required('Lastname is required'),
          jobTitle: Yup.string().required('Job Title is required'),
          // contactNumber: Yup.object({
          //   countryCode: Yup.string().required('Code is required'),
          //   nationalNumber: Yup.string().required('Number is required'),
          // }),
        })}
        onSubmit={async (values: any, actions: any) => {
          try {
            const dataToSubmit = values;
            if (
              !get(dataToSubmit, 'contactNumber.countryCode') ||
              !get(dataToSubmit, 'contactNumber.nationalNumber')
            ) {
              delete dataToSubmit.contactNumber;
            }
            const res = await this.props.updateAccount(dataToSubmit);
            actions.setSubmitting(false);
            if (res.success) {
              showToast(null, 'Account Updated');
              this.props.actions.setUserData({
                ...res.result,
                isLoggedIn: true,
              });
            } else {
              res.error.map((err) => showToast(err));
            }
          } catch (e) {
            actions.setSubmitting(false);
            showToast(e.toString());
          }
        }}
      >
        {this._renderForm}
      </Formik>
    );
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.page}>{this._renderFormSection()}</div>
      </ErrorBoundary>
    );
  }
}

export default compose<IProps, IProps>(
  connect((state: any) => ({ profile: state.profile })),
  // withUpdateUser(() => ({ name: 'updateAccount' })),
)(withStyles<IProps>(styles)(UserDetails));
