import {
  Button,
  DatePicker,
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
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import SelectedCompany from 'src/helpers/SelectedCompany';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  createBankTransaction: (data: object) => any;
  updateBankTransaction: (data: object) => any;
  initialData: any;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateNewBankTransaction extends Component<IProps, IState> {
  public static defaultProps = {
    createBankTransaction: () => ({}),
    updateBankTransaction: () => ({}),
    initialData: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  public state = {
    isEditMode: false,
  };

  public _submitForm = async (values, actions) => {
    try {
      const { initialData } = this.props;
      const { isEditMode } = this.state;

      const dataToSend = {
        transactionDate: values.transactionDate,
        amount: Number(values.amount),
        description: values.description,
      };

      if (!isEditMode) {
        const res = await this.props.createBankTransaction({
          data: dataToSend,
        });
        if (res.success) {
          showToast(null, 'Bank Transaction created successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.BANKING_BANK_TRANSACTIONS());
        } else {
          res.error.map((err) => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateBankTransaction({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Bank Transaction updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.BANKING_BANK_TRANSACTIONS());
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
    this.props.actions.updateHeaderTitle('Bank Transaction');

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
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} Bank Transaction`}
        subtitle={`${isEditMode ? 'Update' : 'Create a new'} Bank Transaction ${
          isEditMode
            ? 'to update information in your account. '
            : 'to add to your account. '
        }`}
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  public _renderBankTransactionForm({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
  }) {
    const keys = {
      transactionDate: 'transactionDate',
      amount: 'amount',
      description: 'description',
    };
    const labels = {
      transactionDate: 'Bank Transaction Date',
      amount: 'Bank Transaction Amount',
      description: 'Bank Transaction Description',
    };
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <DatePicker
                label='Transaction Date'
                onDateChange={(date) =>
                  setFieldValue(keys.transactionDate, date)
                }
                value={values[keys.transactionDate]}
                classes={{ component: classes.fromDatePicker }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={labels.amount}
                placeholder={'E.g: $10000'}
                name={keys.amount}
                id={keys.amount}
                value={values[keys.amount]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[keys.amount] && errors[keys.amount]}
                showClearIcon={false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={labels.description}
                placeholder={'Description'}
                name={keys.description}
                id={keys.description}
                value={values[keys.description]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[keys.description] && errors[keys.description]}
                showClearIcon={false}
              />
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
          transactionDate: idx(initialData, (_) => _.transactionDate) || '',
          amount: idx(initialData, (_) => _.amount) || 0.0,
          description: idx(initialData, (_) => _.description) || '',
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          transactionDate: Yup.string().required(
            'Transaction Date is required',
          ),
          amount: Yup.string().required('Amount is required'),
          description: Yup.string().required('Description is required'),
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
          dirty,
        }) => {
          const isFormDirty = dirty;
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12} sm={6}>
                  {this._renderBankTransactionForm({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                  })}
                </Grid>
              </Grid>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={
                      isEditMode ? 'Back to Bank Transaction list' : 'Cancel'
                    }
                    onClick={() => {
                      this.props.history.replace(
                        URL.BANKING_BANK_TRANSACTIONS(),
                      );
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${
                        isEditMode ? 'Update' : 'Create new'
                      } Bank Transaction`}
                      id='submit-bankTransaction'
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
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.BANKING_BANK_TRANSACTIONS());
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
  withI18n(),
  // withCreateBankTransaction(),
  // withUpdateBankTransaction(),
  // withBankTransaction(
  //   (props) => {
  //     const bankTransactionId = idx(props, (_) => _.match.params.id);
  //     return {
  //       id: bankTransactionId,
  //     };
  //   },
  //   ({ data }) => ({
  //     initialData: idx(data, (_) => _.bankTransaction) || {},
  //   }),
  // ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles),
)(CreateNewBankTransaction);
