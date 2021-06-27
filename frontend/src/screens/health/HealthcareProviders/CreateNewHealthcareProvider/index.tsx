import {
  AddressForm,
  FormikDatePicker,
  FormikDropdown,
  FormikTextField,
  withStyles,
} from '@kudoo/components';
import { FormControl, Grid } from '@material-ui/core';
import get from 'lodash/get';
import React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import SimpleCreatePage from 'src/screens/common/SimpleCreatePage';
import { IReduxState } from 'src/store/reducers';
import { IProfileState } from 'src/store/reducers/profile';
import styles, { ClassesKeys } from './styles';

type Props = IRouteProps<ClassesKeys> & {
  profile: IProfileState;
  createHealthcareProvider: Function;
  updateTrader: Function;
};

const CreateNewHealthcareProvider: React.FC<Props> = (props) => {
  const { classes, profile, history } = props;
  const selectedCompany = profile.selectedCompany;

  const isAddressEmpty = (address) => {
    if (!address) {
      return true;
    }
    if (
      address.street ||
      address.city ||
      address.state ||
      address.country ||
      address.postcode
    ) {
      return false;
    }
    return true;
  };

  const _submitForm = async (values) => {
    try {
      const res = await props.createHealthcareProvider({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          dateOfBirth: values.dateOfBirth,
          emailAddress: values.emailAddress,
          gender: values.gender,
          address: !isAddressEmpty(values.address)
            ? {
                create: {
                  street: values.address.street,
                  city: values.address.city,
                  state: values.address.state,
                  country: values.address.country,
                  postCode: values.address.postcode,
                },
              }
            : undefined,
          occupation: values.occupation,
          hpii: values.hpii,
        },
      });
      if (res.success) {
        showToast(null, 'HealthcareProvider created successfully');
        history.push(URL.HEALTH_CARE_PROVIDERS());
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  return (
    <SimpleCreatePage
      onCompanyChange={() => {
        history.push(URL.HEALTH_CARE_PROVIDERS());
      }}
      editMode={false}
      header={{
        createTitle: 'Create a new Healthcare Provider',
        createSubtitle:
          'Create a new healthcareProvider to add to your account.',
      }}
      initialValues={{
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        emailAddress: '',
        gender: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          postcode: '',
        },
        occupation: '',
        hpii: '',
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required('FirstName required'),
        lastName: Yup.string().required('LastName required'),
        emailAddress: Yup.string().required('Email required'),
      })}
      onSubmit={_submitForm}
      onCancel={() => {
        history.push(URL.HEALTH_CARE_PROVIDERS());
      }}
    >
      <Grid container className={classes.formFields}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin='dense'>
            <FormikTextField
              label={'First Name'}
              showClearIcon={false}
              name='firstName'
              id='firstName'
            />
          </FormControl>

          <FormControl fullWidth margin='dense'>
            <FormikTextField
              label={'Last Name'}
              showClearIcon={false}
              name='lastName'
              id='lastName'
            />
          </FormControl>

          <FormControl fullWidth margin='dense'>
            <FormikDatePicker label={'Date Of Birth'} name='dateOfBirth' />
          </FormControl>

          <FormControl fullWidth margin='dense'>
            <FormikTextField
              label={'Email'}
              showClearIcon={false}
              name='emailAddress'
              id='emailAddress'
            />
          </FormControl>

          <FormControl fullWidth margin='dense'>
            <FormikDropdown
              label={'Gender'}
              name='gender'
              items={[
                { label: 'Male', value: 'MALE' },
                { label: 'Female', value: 'FEMALE' },
                { label: 'InterSex', value: 'INTERSEX' },
                { label: 'Unspecified', value: 'UNSPECIFIED' },
              ]}
            />
          </FormControl>

          <FormControl fullWidth margin='dense'>
            <AddressForm
              keys={{
                street: 'address.street',
                city: 'address.city',
                state: 'address.state',
                country: 'address.country',
                postcode: 'address.postcode',
              }}
            />
          </FormControl>

          {get(selectedCompany, 'country') === 'au' && (
            <>
              <FormControl fullWidth margin='dense'>
                <FormikTextField
                  label={'Occupation'}
                  showClearIcon={false}
                  name='occupation'
                  id='occupation'
                />
              </FormControl>

              <FormControl fullWidth margin='dense'>
                <FormikTextField
                  label={'HPII'}
                  showClearIcon={false}
                  name='hpii'
                  id='hpii'
                />
              </FormControl>
            </>
          )}
        </Grid>
      </Grid>
    </SimpleCreatePage>
  );
};

CreateNewHealthcareProvider.defaultProps = {
  createHealthcareProvider: () => ({}),
};

export default compose<Props, Props>(
  withStyles(styles),
  // withCreateHealthcareProvider(),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
)(CreateNewHealthcareProvider);
