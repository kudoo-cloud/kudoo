import {
  AddressForm,
  Button,
  PhoneNumberField,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import get from 'lodash/get';
import React from 'react';
import * as Yup from 'yup';
import URL from 'src/helpers/urls';
import styles from './styles';

type Props = {
  actions?: any;
  healthcareProvider?: any;
  onSubmit?: any;
  classes?: any;
  theme?: any;
};

class DetailsTab extends React.Component<Props, any> {
  render() {
    const { classes, theme, healthcareProvider, onSubmit } = this.props;
    const { address, contact } = healthcareProvider;
    return (
      <div className={classes.section}>
        <SectionHeader
          title='HealthcareProvider Details'
          subtitle='Edit healthcareProvider details and save your changes. '
        />
        <Formik
          enableReinitialize
          initialValues={{
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            country: address.country || '',
            postCode: address.postCode || '',
            landlineCode: contact.landlineCode || '',
            landlineNumber: contact.landlineNumber || '',
            mobileCode: contact.mobileCode || '',
            mobileNumber: contact.mobileNumber || '',
          }}
          validationSchema={Yup.object().shape({
            street: Yup.string().required('street is required'),
            city: Yup.string().required('city is required'),
            state: Yup.string().required('state is required'),
            country: Yup.string().required('country is required'),
            postCode: Yup.string().required('postCode is required'),
            landlineNumber: Yup.string().required('Number is required'),
            mobileNumber: Yup.string().required('Number is required'),
          })}
          onSubmit={onSubmit}
        >
          {(formProps) => {
            const isDirty = formProps.dirty;
            return (
              <form
                className={classes.detailsForm}
                onSubmit={formProps.handleSubmit}
              >
                <Grid container spacing={40}>
                  <Grid item xs={12} sm={6}>
                    <SectionHeader
                      title='Address'
                      classes={{ component: classes.formHeading }}
                    />
                    <AddressForm
                      keys={{
                        street: 'street',
                        city: 'city',
                        state: 'state',
                        country: 'country',
                        postcode: 'postCode',
                      }}
                      values={formProps.values}
                      errors={formProps.errors}
                      touched={formProps.touched}
                      handleChange={formProps.handleChange}
                      handleBlur={formProps.handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SectionHeader
                      title='DAO Contact Details'
                      classes={{ component: classes.formHeading }}
                    />
                    <PhoneNumberField
                      areaCodeLabel='Area Code'
                      areaCodePlaceholder='61'
                      areaCodeValue={String(
                        get(formProps, 'values.mobileCode'),
                      )}
                      phoneNumberLabel={'Mobile'}
                      phoneNumberPlaceholder='0435900999'
                      phoneNumberValue={String(
                        get(formProps, 'values.mobileNumber'),
                      )}
                      error={
                        get(formProps, 'touched.mobileNumber') &&
                        get(formProps, 'errors.mobileNumber')
                      }
                      showClearIcon={false}
                      onChangeText={({ areaCode, phoneNumber }) => {
                        formProps.setFieldValue('mobileCode', areaCode);
                        formProps.setFieldValue('mobileNumber', phoneNumber);
                      }}
                    />
                    <PhoneNumberField
                      areaCodeLabel='Area Code'
                      areaCodePlaceholder='61'
                      areaCodeValue={String(
                        get(formProps, 'values.landlineCode'),
                      )}
                      phoneNumberLabel={'Landline'}
                      phoneNumberPlaceholder='0435900999'
                      phoneNumberValue={String(
                        get(formProps, 'values.landlineNumber'),
                      )}
                      error={
                        get(formProps, 'touched.landlineNumber') &&
                        get(formProps, 'errors.landlineNumber')
                      }
                      showClearIcon={false}
                      onChangeText={({ areaCode, phoneNumber }) => {
                        formProps.setFieldValue('landlineCode', areaCode);
                        formProps.setFieldValue('landlineNumber', phoneNumber);
                      }}
                    />
                  </Grid>
                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={isDirty ? 6 : 12}>
                      <Button
                        title='Back to HealthcareProvider list'
                        href={URL.ACTIVE_CUSTOMERS()}
                        buttonColor={theme.palette.grey['200']}
                        classes={{ text: classes.cancelButtonText }}
                      />
                    </Grid>
                    {isDirty && (
                      <Grid item xs={12} sm={6}>
                        <Button
                          title='Save changes'
                          type='submit'
                          loading={formProps.isSubmitting}
                          buttonColor={theme.palette.primary.color2}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default withStyles<Props>(styles)(DetailsTab);
