import {
  Button,
  DatePicker,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import idx from 'idx';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import SelectedCompany from 'src/helpers/SelectedCompany';
import URL from 'src/helpers/urls';
import styles from 'src/screens/common/SalesOrder/SalesOrderWizard/styles';

interface IProps {
  actions: any;
  profile: any;
  initialData: any;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
  customers: any;
  makeStepActive: (data: any) => any;
  markedVisited: (data: any) => any;
  setSalesOrderData: (data: any) => any;
  salesOrderData: any;
}
interface IState {
  isEditMode: boolean;
  customersList: any;
  isSubmitting: boolean;
}

class CreateSalesOrder extends Component<IProps, IState> {
  static defaultProps = {
    customers: { data: [] },
    initialData: { data: [] },
    updateCompany: () => ({}),
  };

  public state = {
    isEditMode: false,
    customersList: [],
    isSubmitting: false,
  };

  public _submitForm = async (values, actions) => {
    try {
      const { initialData, makeStepActive, markedVisited } = this.props;
      const { isEditMode } = this.state;

      if (!isEditMode) {
        const data = {
          transactionDate: values.transactionDate,
          customer: values.customer,
        };
        await this.props.setSalesOrderData({ data, isEditMode, actions });
        markedVisited(0);
        makeStepActive(1);
      } else {
        const data = {
          id: initialData.id,
          transactionDate: values.transactionDate,
          customer: values.customer,
        };

        await this.props.setSalesOrderData({ data, isEditMode, actions });
        makeStepActive(1);
        markedVisited(0);
      }
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('SalesOrder');

    this.setState({
      isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
    });
  }

  public componentDidUpdate(prevProps) {
    const {
      customers: { data },
      initialData,
      salesOrderData,
    } = this.props;
    const { customersList }: any = this.state;
    const salesOrderId = idx(salesOrderData.data, (_) => _.id);
    if (data.length && !isEqual(data, prevProps.customers.data)) {
      data.forEach((rec: any) => {
        customersList.push({ value: rec.id, label: rec.name });
      });
      this.setState({ customersList });
    }
    if (!isEqual(initialData, prevProps.initialData)) {
      if (!salesOrderData || !isEqual(salesOrderId, initialData.id)) {
        const data = {
          id: initialData.id,
          transactionDate: initialData.transactionDate,
          customer: initialData?.customer?.id,
        };
        this.props.setSalesOrderData({
          data,
          isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
        });
      }
      this.setState({
        isEditMode: Boolean(idx(this.props, (_) => _.initialData)),
      });
    }
  }

  public _renderSalesOrderForm({
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  }) {
    const keys = {
      transactionDate: 'transactionDate',
      customer: 'customer',
    };
    const labels = {
      transactionDate: 'Transaction Date',
      customer: 'Customer',
    };
    const { classes } = this.props;
    const { customersList } = this.state;
    return (
      <ErrorBoundary>
        <div className={classes.mainDivSalesOrder}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <DatePicker
                label='Transaction Date'
                onDateChange={(date) =>
                  setFieldValue(keys.transactionDate, date)
                }
                value={values[keys.transactionDate]}
              />
            </Grid>
            <Grid item xs={12}>
              <Dropdown
                label={labels.customer}
                placeholder={'Select Customer'}
                name={keys.customer}
                id={keys.customer}
                items={
                  customersList.length
                    ? customersList
                    : [
                        {
                          value: '',
                          label:
                            'No Customer found. Please create new customer first',
                        },
                      ]
                }
                value={values[keys.customer]}
                onChange={(e) => setFieldValue(keys.customer, e.value)}
                onClose={() => setFieldTouched(keys.customer)}
                error={touched[keys.customer] && errors[keys.customer]}
              />
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }

  public _renderForm() {
    const {
      classes,
      theme,
      salesOrderData: { data = {} },
    } = this.props;
    const { isEditMode } = this.state;
    return (
      <Formik
        initialValues={{
          transactionDate: idx(data, (_) => _.transactionDate) || new Date(),
          customer: idx(data, (_) => _.customer) || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          transactionDate: Yup.string().required(
            'Transaction Date is required',
          ),
          customer: Yup.string().required('Customer is required'),
        })}
        onSubmit={this._submitForm}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => {
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <SectionHeader
                title={`${isEditMode ? 'Update' : 'Create new'} SalesOrder`}
                // subtitle={`${isEditMode ? 'Update' : 'Create a new'} salesOrder ${isEditMode ? 'to update information in salesOrder. ' : 'to add in salesOrder. '}`}
                classes={{ component: classes.sectionHeader }}
                renderLeftPart={() => (
                  <div className={classes.prevNextWrapper}>
                    <Button
                      loading={isSubmitting}
                      title='Next'
                      id='next-button'
                      classes={{ component: classes.prevNextButton }}
                      applyBorderRadius
                      compactMode
                      buttonColor={'#29a9db'}
                      type='submit'
                    />
                  </div>
                )}
              />
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderSalesOrderForm({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched,
                  })}
                </Grid>
              </Grid>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={12}>
                  <Button
                    title={isEditMode ? 'Back to SalesOrder list' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.SALES_ORDER());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
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
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.SALES_ORDER());
          }}
        >
          <div className={classes.page}>{this._renderForm()}</div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withI18n(),
  // withCreateSalesOrder(),
  // withUpdateSalesOrder(),
  // withCustomers(({ type }) => {
  //   let isArchived = false;
  //   if (type === 'archived-customers') {
  //     isArchived = true;
  //   }
  //   return {
  //     variables: {
  //       where: {
  //         isArchived,
  //       },
  //       orderBy: 'name_ASC',
  //     },
  //   };
  // }),
  // withSalesOrder(
  //   (props) => {
  //     const salesOrderId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: salesOrderId,
  //     };
  //   },
  //   ({ data }) => ({ initialData: idx(data, (_) => _.salesOrder) || {} }),
  // ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateSalesOrder);
