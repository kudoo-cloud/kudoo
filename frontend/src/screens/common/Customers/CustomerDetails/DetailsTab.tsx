import {
  AddressForm,
  Button,
  PhoneNumberField,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import URL from 'src/helpers/urls';
import styles, { StyleKeys } from './styles';
import { CustomerObject } from './types';

type Props = IRouteProps<StyleKeys> & {
  customer: CustomerObject;
  onSubmit: (values: Record<string, any>) => void;
};

const DetailsTab: React.FC<Props> = (props) => {
  const { classes, theme, customer, onSubmit } = props;
  const { address, contact } = customer;
  return (
    <div className={classes.section}>
      <SectionHeader
        title='Customer Details'
        subtitle='Edit customer details and save your changes. '
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SectionHeader
                    title='DAO Contact Details'
                    classes={{ component: classes.formHeading }}
                  />
                  <PhoneNumberField
                    areaCodeFieldName='mobileCode'
                    phoneNumberFieldName='mobileNumber'
                    areaCodeLabel='Area Code'
                    phoneNumberLabel={'Mobile Number'}
                    showClearIcon={false}
                  />
                  <PhoneNumberField
                    areaCodeFieldName='landlineCode'
                    phoneNumberFieldName='landlineNumber'
                    areaCodeLabel='Area Code'
                    phoneNumberLabel={'Mobile Number'}
                    showClearIcon={false}
                  />
                </Grid>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={isDirty ? 6 : 12}>
                    <Button
                      title='Back to Customer list'
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
};

export default withStyles(styles)(DetailsTab);
