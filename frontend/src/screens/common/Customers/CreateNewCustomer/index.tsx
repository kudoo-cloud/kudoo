import {
  AddressForm,
  Button,
  CustomerForm,
  ErrorBoundary,
  PhoneNumberField,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  actions: any;
  profile: Record<string, any>;
  createCustomer: Function;
  updateTrader: Function;
  i18n: any;
  classes: any;
  history: any;
  theme: any;
};
type State = {};

class CreateNewCustomer extends Component<Props, State> {
  static defaultProps = {
    createCustomer: () => ({}),
  };

  componentDidMount() {
    this.props.actions.updateHeaderTitle('Customers');
  }

  _renderSectionHeading() {
    const { classes } = this.props;
    return (
      <SectionHeader
        title='Create a new customer'
        subtitle='Create a new customer to add to your account. '
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  _renderFormContent(formProps) {
    const { classes, i18n } = this.props;
    // const { values } = formProps;
    return (
      <form className={classes.form} onSubmit={formProps.handleSubmit}>
        <div style={{ padding: '20px', flex: 1 }}>
          <Grid
            container
            classes={{ container: classes.formContainer }}
            spacing={16}
          >
            <Grid item xs={12} sm={6}>
              <CustomerForm
                keys={{
                  customer_name: 'customer_name',
                  contact_name: 'contact_name',
                  contact_surname: 'contact_surname',
                  abn: 'govNumber',
                  email: 'email',
                }}
                labels={{
                  customer_name: 'Customer Name',
                  contact_name: 'Contact Name',
                  contact_surname: 'Contact Surname',
                  abn: i18n._(`ABN`),
                  email: 'Email',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} />
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
                  postcode: 'postcode',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SectionHeader
                title='Customer Contact Details'
                classes={{ component: classes.formHeading }}
              />
              <PhoneNumberField
                areaCodeFieldName='mobile.countryCode'
                phoneNumberFieldName='mobile.number'
                areaCodeLabel='Area Code'
                phoneNumberLabel={'Mobile Number'}
                showClearIcon={false}
              />
              <PhoneNumberField
                areaCodeFieldName='landline.countryCode'
                phoneNumberFieldName='landline.number'
                areaCodeLabel='Area Code'
                phoneNumberLabel={'Mobile Number'}
                showClearIcon={false}
              />
            </Grid>
          </Grid>
        </div>

        {this._renderBottomButtons()}
      </form>
    );
  }

  _submitForm = async (values) => {
    try {
      const res = await this.props.createCustomer({
        data: {
          name: values.customer_name,
          govNumber: String(values.govNumber.replace(/ /g, '')),
          addresses: {
            create: [
              {
                street: values.street,
                city: values.city,
                state: values.state,
                country: values.country,
                postCode: values.postcode,
              },
            ],
          },
          contacts: {
            create: [
              {
                name: values.contact_name,
                surname: values.contact_surname,
                email: values.email,
                mobileCode: values.mobile.countryCode,
                mobileNumber: values.mobile.number,
                landlineCode: values.landline.countryCode,
                landlineNumber: values.landline.number,
              },
            ],
          },
        },
      });
      if (res.success) {
        showToast(null, 'Customer created successfully');
        this.props.history.push(URL.CUSTOMERS());
      } else {
        res.error((err) => showToast(err));
      }
    } catch (e) {
      console.error('submit form ===>', e);
    }
  };

  _renderForm() {
    return (
      <Formik
        initialValues={{
          customer_name: '',
          contact_name: '',
          contact_surname: '',
          govNumber: '',
          email: '',
          street: '',
          city: '',
          state: '',
          country: '',
          postcode: '',
          landline: {
            countryCode: '',
            number: '',
          },
          mobile: {
            countryCode: '',
            number: '',
          },
          primaryContact: true,
        }}
        validationSchema={Yup.object().shape({
          customer_name: Yup.string().required('Name is required'),
          contact_name: Yup.string().required('Contact name is required'),
          contact_surname: Yup.string().required('Surname is required'),
          // abn: Yup.string()
          //   .required('ABN is required')
          //   .test('is-abn', 'ABN is not valid', utils.validateABN),
          email: Yup.string()
            .required('Email is required')
            .required('Invalid Email'),
          street: Yup.string().required('street is required'),
          city: Yup.string().required('city is required'),
          state: Yup.string().required('state is required'),
          country: Yup.string().required('country is required'),
          postcode: Yup.string().required('postcode is required'),
          landline: Yup.object().shape({
            number: Yup.string().required('Number is required'),
          }),
          mobile: Yup.object().shape({
            number: Yup.string().required('Number is required'),
          }),
        })}
        onSubmit={this._submitForm}
      >
        {this._renderFormContent.bind(this)}
      </Formik>
    );
  }

  _renderBottomButtons() {
    const { classes, theme } = this.props;
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <Button
            title='Cancel'
            href={URL.CUSTOMERS()}
            buttonColor={theme.palette.grey['200']}
            classes={{ text: classes.cancelButtonText }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            title='Save new Customer'
            id='submit-customer'
            buttonColor={theme.palette.primary.color2}
            type='submit'
          />
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.CUSTOMERS());
          }}
        >
          <div className={classes.page}>
            {this._renderSectionHeading()}
            {this._renderForm()}
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withStyles(styles),
  withI18n(),
  connect((state: IReduxState) => ({
    profile: state.profile,
  })),
  // withCreateCustomer(),
)(CreateNewCustomer);
