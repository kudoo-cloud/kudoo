import {
  Button,
  SearchInput,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import { Formik } from 'formik';
import idx from 'idx';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withState } from 'recompose';
import * as Yup from 'yup';
import * as actions from 'src/store/actions/createNewInvoice';
import { IReduxState } from 'src/store/reducers';
import styles from './styles';

type Props = {
  actions: Record<string, any>;
  customers: Record<string, any>;
  newInvoice: Record<string, any>;
  makeStepActive: Function;
  markedVisited: Function;
  unmarkedVisited: Function;
  setSearchText: Function;
  updateCustomerInfo: Function;
  i18n: any;
  classes: any;
  theme: any;
};
type State = {};

class CustomerStep extends Component<Props, State> {
  static defaultProps = {
    customers: { data: [] },
  };

  submitForm: Function;

  state = {};

  _onSearch = debounce((searchText) => {
    if (!searchText) {
      this.props.updateCustomerInfo('text', {});
    }
    this.props.setSearchText(searchText);
  }, 100);

  _onItemClick = async (item) => {
    if (item) {
      this.props.updateCustomerInfo('text', {
        name: item.name,
        govNumber: item.govNumber,
        email: get(item, 'contacts[0].email', ''),
        contactName: get(item, 'contacts[0].name', ''),
        contactSurname: get(item, 'contacts[0].surname', ''),
        isAlreadySaved: true,
        id: item.id,
      });
      this._goToNextScreen();
    }
  };

  _goToNextScreen = () => {
    const { makeStepActive, markedVisited } = this.props;
    makeStepActive(1);
    markedVisited(0);
  };

  _onPressNext = () => {
    const { newInvoice } = this.props;
    if (get(newInvoice, 'text.customer.isAlreadySaved', false)) {
      this._goToNextScreen();
    } else {
      this.submitForm();
    }
  };

  _onSubmitForm = (values) => {
    this.props.updateCustomerInfo('text', {
      name: values.customerName,
      contactName: values.name,
      contactSurname: values.surname,
      email: values.email,
      govNumber: values.govNumber,
      isAlreadySaved: false,
    });
    this._goToNextScreen();
  };

  _renderCustomerForm(formProps) {
    const { classes, i18n } = this.props;
    const { values, touched, errors, submitForm } = formProps;
    this.submitForm = submitForm;
    return (
      <form className={classes.form} onSubmit={formProps.handleSubmit}>
        <div className={classes.input}>
          <TextField
            label={'Customer name'}
            placeholder={'E.g: Google'}
            showClearIcon={false}
            name='customerName'
            id='customerName'
            onBlur={formProps.handleBlur}
            onChange={formProps.handleChange}
            value={values.customerName}
            error={touched.customerName && errors.customerName}
          />
        </div>
        <div className={cx(classes.halfFieldWRow, classes.input)}>
          <TextField
            label={'Contact name'}
            placeholder={'E.g: John'}
            showClearIcon={false}
            classes={{ component: classes.leftInput }}
            name='name'
            id='name'
            onBlur={formProps.handleBlur}
            onChange={formProps.handleChange}
            value={values.name}
            error={touched.name && errors.name}
          />
          <TextField
            label={'Contact surname'}
            placeholder={'E.g: Smith'}
            showClearIcon={false}
            name='surname'
            id='surname'
            onBlur={formProps.handleBlur}
            onChange={formProps.handleChange}
            value={values.surname}
            error={touched.surname && errors.surname}
          />
        </div>
        <div className={cx(classes.halfFieldWRow, classes.input)}>
          <TextField
            label={i18n._(`ABN`)}
            placeholder={'E.g: 51824753556'}
            showClearIcon={false}
            classes={{ component: classes.leftInput }}
            name='govNumber'
            id='govNumber'
            onBlur={formProps.handleBlur}
            onChange={formProps.handleChange}
            value={values.govNumber}
            error={touched.govNumber && errors.govNumber}
          />
          <TextField
            label={'Email'}
            placeholder={'E.g: johndoe@gmail.com'}
            showClearIcon={false}
            name='email'
            id='email'
            onBlur={formProps.handleBlur}
            onChange={formProps.handleChange}
            value={values.email}
            error={touched.email && errors.email}
          />
        </div>
      </form>
    );
  }

  _getInitialValues = () => {
    const { newInvoice } = this.props;
    const customer = get(newInvoice, 'text.customer', {});
    if (!isEmpty(customer) && !customer.isAlreadySaved) {
      return {
        customerName: customer.name,
        name: customer.contactName,
        surname: customer.contactSurname,
        govNumber: customer.govNumber,
        email: customer.email,
      };
    }
    return {
      customerName: '',
      name: '',
      surname: '',
      govNumber: '',
      email: '',
    };
  };

  render() {
    const { classes, theme, customers, newInvoice, i18n } = this.props;
    const customer = get(newInvoice, 'text.customer', {});
    return (
      <div>
        <SectionHeader
          title='Create a free text invoice'
          subtitle='Lets begin by selecting an option below. If you are unsure select the question mark provided.'
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                title='Next'
                id='next-button'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={this._onPressNext}
              />
            </div>
          )}
        />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <SectionHeader
              title='Add an existing customer'
              classes={{ component: classes.formHeading }}
            />
            <div style={{ marginTop: 20 }}>
              <SearchInput
                placeholder={'Search by typing a customer’s name or DAO '}
                showClearIcon={false}
                items={get(customers, 'data', []).map((customer) => ({
                  ...customer,
                  label: customer.name,
                }))}
                defaultInputValue={
                  customer.isAlreadySaved ? get(customer, 'name', '') : ''
                }
                onSearch={this._onSearch}
                onInputChange={this._onSearch}
                onItemClick={this._onItemClick}
              />
            </div>

            <SectionHeader
              title='Create a new customer'
              classes={{ component: classes.formHeading }}
            />
            <Formik
              enableReinitialize
              initialValues={this._getInitialValues()}
              validationSchema={Yup.object().shape({
                customerName: Yup.string().required(
                  'Customer Name is required',
                ),
                name: Yup.string().required('Contact Name is required'),
                surname: Yup.string().required('Surname is required'),
                govNumber: Yup.string().required(
                  i18n._(`ABN`) + ' is required',
                ),
                // .test('is-abn', 'ABN is not valid', utils.validateABN),
                email: Yup.string()
                  .required('Email is required')
                  .email('Email is not valid'),
              })}
              onSubmit={this._onSubmitForm}
            >
              {this._renderCustomerForm.bind(this)}
            </Formik>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withI18n(),
  withStyles(styles),
  withState('searchText', 'setSearchText', ''),
  connect(
    (state: IReduxState) => ({
      profile: state.profile,
      newInvoice: idx(state, (x) => x.sessionData.newInvoice),
    }),
    {
      ...actions,
    },
  ),
  // withCreateCustomer(),
  // withCustomers((props: any) => {
  //   let where: any = {
  //     isArchived: false,
  //   };
  //   if (props.searchText) {
  //     where = {
  //       ...where,
  //       name_contains: props.searchText,
  //     };
  //   }
  //   return {
  //     variables: {
  //       where,
  //     },
  //   };
  // }),
)(CustomerStep);
