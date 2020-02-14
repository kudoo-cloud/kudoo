import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withI18n } from '@lingui/react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { compose } from 'react-apollo';
import {
  Button,
  ErrorBoundary,
  TextField,
  Checkbox,
  Dropdown,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import URL from '@client/helpers/urls';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import SelectedCompany from '@client/helpers/SelectedCompany';
import {
  withCreateLedgerJournal,
  withLedgerJournal,
  withUpdateLedgerJournal,
} from '@kudoo/graphql';
import { showToast } from '@client/helpers/toast';
import { CURRENCY } from '@kudoo/common';
import styles from './styles';

interface IProps {
  actions: any;
  profile: any;
  createLedgerJournal: (data: object) => any;
  updateLedgerJournal: (data: object) => any;
  initialData: any;
  i18n: any;
  history: any;
  classes: any;
  theme: any;
}
interface IState {
  isEditMode: boolean;
}

class CreateLedgerJournal extends Component<IProps, IState> {
  public state = {
    isEditMode: false,
  };

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Journal');
    this.setState({
      isEditMode: Boolean(get(this.props, 'initialData')),
    });
  }

  public componentDidUpdate(prevProps) {
    if (!isEqual(this.props.initialData, prevProps.initialData)) {
      this.setState({
        isEditMode: Boolean(get(this.props, 'initialData')),
      });
    }
  }

  public _submitForm = async (values, actions) => {
    try {
      const { initialData } = this.props;
      const { isEditMode } = this.state;

      const dataToSend = {
        total: Number(values.total),
        currency: values.currency,
        includeConsTax: values.includeConsTax,
        posted: values.posted,
        description: values.description,
      };

      if (!isEditMode) {
        const res = await this.props.createLedgerJournal({ data: dataToSend });
        if (res.success) {
          showToast(null, 'Journal created successfully');

          actions.setSubmitting(false);
          this.props.history.push(URL.LEDGER_JOURNALS());
        } else {
          res.error.map(err => showToast(err));
          actions.setSubmitting(false);
        }
      } else {
        const res = await this.props.updateLedgerJournal({
          data: dataToSend,
          where: { id: initialData.id },
        });
        if (res.success) {
          showToast(null, 'Journal updated successfully');
          actions.setSubmitting(false);
          this.props.history.push(URL.LEDGER_JOURNALS());
        } else {
          res.error.map(err => showToast(err));
          actions.setSubmitting(false);
        }
      }
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  public _renderSectionHeading() {
    const { isEditMode } = this.state;
    const { classes } = this.props;
    return (
      <SectionHeader
        title={`${isEditMode ? 'Update' : 'Create new'} Ledger Journal`}
        classes={{ component: classes.sectionHeader }}
      />
    );
  }

  public _renderFormFields({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  }) {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.component}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label={'Description'}
                placeholder={'Enter description here'}
                name={'description'}
                id={'description'}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && errors.description}
                showClearIcon={false}
                multiline={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Total'}
                placeholder={'Enter total value'}
                name={'total'}
                id={'total'}
                value={String(values.total)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.total && errors.total}
                showClearIcon={false}
                isNumber
              />
            </Grid>
            <Grid item xs={12}>
              <Dropdown
                label={'Currency'}
                placeholder={'Select Currency'}
                name={'currency'}
                id={'currency'}
                items={CURRENCY}
                value={values.currency}
                onChange={e => setFieldValue('currency', e.value)}
                onClose={() => setFieldTouched('currency')}
                error={touched.currency && errors.currency}
              />
            </Grid>
            <Grid item xs={6}>
              <Checkbox
                label={'Include Tax'}
                value={values.includeConsTax}
                onChange={checked => {
                  setFieldValue('includeConsTax', checked);
                }}
                error={touched.includeConsTax && errors.includeConsTax}
              />
            </Grid>
            <Grid item xs={6}>
              <Checkbox
                label={'Posted'}
                value={values.posted}
                onChange={checked => {
                  setFieldValue('posted', checked);
                }}
                error={touched.posted && errors.posted}
              />
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }

  public _renderForm() {
    const { initialData = {}, classes, theme } = this.props;
    const { isEditMode } = this.state;
    return (
      <Formik
        initialValues={{
          total: initialData.total || '',
          description: initialData.description || '',
          currency: initialData.currency || '',
          includeConsTax: initialData.includeConsTax || false,
          posted: initialData.posted || false,
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          total: Yup.number().required('Enter total value'),
          description: Yup.string().required('Description required'),
          currency: Yup.string().required('Currency required'),
        })}
        onSubmit={this._submitForm}>
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
                  {this._renderFormFields({
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
              <Grid container spacing={0}>
                <Grid item xs={12} sm={isFormDirty ? 6 : 12}>
                  <Button
                    title={isEditMode ? 'Back to Journals' : 'Cancel'}
                    onClick={() => {
                      this.props.history.replace(URL.LEDGER_JOURNALS());
                    }}
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                  />
                </Grid>
                {isFormDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={isSubmitting}
                      title={`${isEditMode ? 'Update' : 'Create new'} Journal`}
                      id='submit-mainAccount'
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
            this.props.history.push(URL.LEDGER());
          }}>
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
  withCreateLedgerJournal(),
  withUpdateLedgerJournal(),
  withLedgerJournal(
    props => {
      const id = get(props, 'match.params.id');
      return {
        id,
      };
    },
    ({ data }) => ({
      initialData: get(data, 'ledgerJournal') || {},
    })
  ),
  connect((state: any) => ({
    profile: state.profile,
  })),
  withStyles(styles)
)(CreateLedgerJournal);
