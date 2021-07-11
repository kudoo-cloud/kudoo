import {
  AddressForm,
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as Yup from 'yup';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from './styles';
import { TERMS_OF_PAYMENT } from './termsOfPaymentType';

interface IProps {
  actions: any;
  profile: any;
  createSupplier: (data: object) => any;
  updateSupplier: (data: object) => any;
  initialData: any;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateNewSupplier extends Component<IProps, IState> {
  public static defaultProps = {
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: [],
    },
    createSupplier: () => ({}),
    updateSupplier: () => ({}),
  };

  public state = {
    isEditMode: false,
  };

  public _submitForm = async (values, actions) => {
    try {
      const { initialData } = this.props;
      const { isEditMode } = this.state;
      const address = {
        street: idx(values, (_) => _.street),
        city: idx(values, (_) => _.city),
        state: idx(values, (_) => _.state),
        country: idx(values, (_) => _.country),
        postCode: idx(values, (_) => _.postcode),
      };
      const dataToSend = {
        name: values.name,
        termsOfPayment: values.termsOfPayment,
        emailAddressForRemittance: values.emailAddressForRemittance,
      };

      if (!isEditMode) {
        const res = await this.props.createSupplier({
          data: {
            ...dataToSend,
            address: {
              create: address,
            },
          },
        });
        if (res.success) {
          showToast(null, 'Supplier created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.SUPPLIERS());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateSupplier({
          data: {
            ...dataToSend,
            address: {
              update: {
                where: { id: initialData.address[0].id },
                data: address,
              },
            },
          },
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Supplier updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.SUPPLIERS());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      }
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Supplier');

    this.setState({
      isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
    });
  }

  public componentDidUpdate(prevProps) {
    if (!isEqual(this.props.initialData, prevProps.initialData)) {
      this.setState({
        isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
      });
    }
  }

  public _renderSectionHeading() {
    const { isEditMode } = this.state;
    const { classes } = this.props;
    return (
      <Grid container item xs={12} sm={6}>
        <SectionHeader
          title={`${isEditMode ? 'Update' : 'Create new'} Supplier`}
          subtitle={`${isEditMode ? 'Update' : 'Create a new'} Supplier ${
            isEditMode
              ? 'to update information in your account. '
              : 'to add to your account. '
          }`}
          classes={{ component: classes.sectionHeader }}
        />
      </Grid>
    );
  }

  public _renderSupplierForm({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  }) {
    const keys = {
      name: 'name',
      termsOfPayment: 'termsOfPayment',
      emailAddressForRemittance: 'emailAddressForRemittance',
    };
    const labels = {
      name: 'Supplier Name',
      termsOfPayment: 'Terms Of Payment',
      emailAddressForRemittance: 'Email address for remittance',
    };
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label={labels.name}
                placeholder={'E.g: Supplier Name'}
                name={keys.name}
                id={keys.name}
                value={values[keys.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[keys.name] && errors[keys.name]}
                showClearIcon={false}
              />
            </Grid>
            <Grid item xs={12}>
              <Dropdown
                label={labels.termsOfPayment}
                placeholder={'Select Terms Of Payment'}
                name={keys.termsOfPayment}
                id={keys.termsOfPayment}
                items={TERMS_OF_PAYMENT}
                value={values[keys.termsOfPayment]}
                onChange={(e) => setFieldValue(keys.termsOfPayment, e.value)}
                onClose={() => setFieldTouched(keys.termsOfPayment)}
                error={
                  touched[keys.termsOfPayment] && errors[keys.termsOfPayment]
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={labels.emailAddressForRemittance}
                placeholder={'E.g: Jode@gmail.com'}
                name={keys.emailAddressForRemittance}
                id={keys.emailAddressForRemittance}
                value={values[keys.emailAddressForRemittance]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched[keys.emailAddressForRemittance] &&
                  errors[keys.emailAddressForRemittance]
                }
                showClearIcon={false}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <SectionHeader
                  title='Address'
                  classes={{ component: classes.formHeading }}
                />
              </Grid>
              <Grid item xs={12}>
                <AddressForm
                  keys={{
                    street: 'street',
                    city: 'city',
                    state: 'state',
                    country: 'country',
                    postcode: 'postcode',
                  }}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }

  public _renderForm() {
    const { initialData, classes, theme } = this.props;
    const { isEditMode } = this.state;
    return (
      <Formik
        initialValues={{
          name: idx(initialData, (_) => _.name) || '',
          termsOfPayment: idx(initialData, (_) => _.termsOfPayment) || '',
          emailAddressForRemittance:
            idx(initialData, (_) => _.emailAddressForRemittance) || '',
          street: idx(initialData, (_) => _.address[0].street) || '',
          city: idx(initialData, (_) => _.address[0].city) || '',
          state: idx(initialData, (_) => _.address[0].state) || '',
          country: idx(initialData, (_) => _.address[0].country) || '',
          postcode: idx(initialData, (_) => _.address[0].postCode) || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          termsOfPayment: Yup.string().required('Terms of payment is required'),
          emailAddressForRemittance: Yup.string().required(
            'Email address is required',
          ),
          street: Yup.string().required('Street is required'),
          city: Yup.string().required('City is required'),
          state: Yup.string().required('State is required'),
          country: Yup.string().required('Country is required'),
          postcode: Yup.string().required('Postcode is required'),
        })}
        onSubmit={this._submitForm}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          dirty,
        }) => {
          const isFormDirty = dirty;
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderSupplierForm({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
                  })}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Supplier list' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.SUPPLIERS());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${isEditMode ? 'Update' : 'Create new'} Supplier`}
                      id='submit-supplier'
                      buttonColor={theme.palette.primary.color2}
                      type='submit'
                    />
                  </Grid>
                )}
              </Grid>
            </form>
          );
        }}
      </Formik>
    );
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.SUPPLIERS());
          }}
        >
          <div className={classes.page}>
            {this._renderSectionHeading()}
            {this._renderForm()}
          </div>
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  // withCreateSupplier(),
  // withUpdateSupplier(),
  // withSupplier(
  //   (props) => {
  //     const supplierId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: supplierId,
  //     };
  //   },
  //   ({ data }) => ({
  //     initialData: idx(data, (_) => _.supplier) || {},
  //   }),
  // ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateNewSupplier);
